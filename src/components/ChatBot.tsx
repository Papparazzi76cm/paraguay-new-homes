import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, User, UserPlus, CheckCircle2, Loader2, RotateCcw, Maximize2, Minimize2 } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTranslation } from "react-i18next";
import ReactMarkdown from "react-markdown";
import { useSubmitLead } from "@/hooks/useContactLead";
import { useProjects } from "@/hooks/useProjects";
import { parseAssistantMessage } from "@/components/chatbot/useMessageParser";
import ProjectCard from "@/components/chatbot/ProjectCard";

type Msg = { role: "user" | "assistant"; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

/* Initial chips will be translated via t() */

/* ── Inline Contact Form ── */
const InlineContactForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const { t } = useTranslation();
  const [form, setForm] = useState({ full_name: "", email: "", phone: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const submitLead = useSubmitLead();

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.full_name.trim()) e.full_name = t("chatbot.required");
    if (!form.email.trim()) e.email = t("chatbot.required");
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = t("chatbot.invalidEmail");
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    submitLead.mutate(
      {
        full_name: form.full_name.trim().slice(0, 100),
        email: form.email.trim().slice(0, 255),
        phone: form.phone.trim().slice(0, 30) || undefined,
        message: form.message.trim().slice(0, 1000) || undefined,
        lead_type: "chatbot",
      },
      { onSuccess }
    );
  };

  if (submitLead.isSuccess) {
    return (
      <div className="flex items-center gap-2 text-sm text-primary">
        <CheckCircle2 className="w-4 h-4" />
        <span>{t("chatbot.dataSent")}</span>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div>
        <input placeholder={t("chatbot.namePlaceholder")} value={form.full_name} onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))} className="w-full text-sm bg-background border border-border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-muted-foreground" />
        {errors.full_name && <p className="text-xs text-destructive mt-0.5">{errors.full_name}</p>}
      </div>
      <div>
        <input type="email" placeholder={t("chatbot.emailPlaceholder")} value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className="w-full text-sm bg-background border border-border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-muted-foreground" />
        {errors.email && <p className="text-xs text-destructive mt-0.5">{errors.email}</p>}
      </div>
      <input type="tel" placeholder={t("chatbot.phonePlaceholder")} value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} className="w-full text-sm bg-background border border-border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-muted-foreground" />
      <textarea placeholder={t("chatbot.projectPlaceholder")} value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))} rows={2} className="w-full text-sm bg-background border border-border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-muted-foreground resize-none" />
      <button onClick={handleSubmit} disabled={submitLead.isPending} className="w-full text-sm font-medium bg-primary text-primary-foreground rounded-lg py-2 hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
        {submitLead.isPending ? (<><Loader2 className="w-4 h-4 animate-spin" /> {t("chatbot.sendingContact")}</>) : t("chatbot.sendContact")}
      </button>
      {submitLead.isError && <p className="text-xs text-destructive">{t("chatbot.errorSend")}</p>}
    </div>
  );
};

const STORAGE_KEY = "proyectpy-chat-history";

function loadHistory(): Msg[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Msg[];
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch { /* ignore */ }
  return [];
}

function saveHistory(msgs: Msg[]) {
  try {
    // Keep last 50 messages to avoid bloating storage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(msgs.slice(-50)));
  } catch { /* ignore */ }
}

/* ── ChatBot ── */
const ChatBot = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language?.split("-")[0] || "es";
  const [open, setOpen] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactShownOnce, setContactShownOnce] = useState(false);
  const [messages, setMessages] = useState<Msg[]>(loadHistory);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [dynamicChips, setDynamicChips] = useState<string[]>([]);
  const [fullscreen, setFullscreen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  const INITIAL_CHIPS = [t("chatbot.chip1"), t("chatbot.chip2"), t("chatbot.chip3"), t("chatbot.chip4")];
  const DEFAULT_MSG: Msg = { role: "assistant", content: t("chatbot.welcome") };

  const { data: allProjects } = useProjects();

  // Initialize with welcome message if empty
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([DEFAULT_MSG]);
    }
  }, []);

  // Persist messages to localStorage
  useEffect(() => {
    saveHistory(messages);
  }, [messages]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, showContactForm]);

  const handleContactSuccess = () => {
    setShowContactForm(false);
    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: t("chatbot.contactSuccess") },
    ]);
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    setShowContactForm(false);
    setDynamicChips([]);
    const userMsg: Msg = { role: "user", content: text.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    let assistantSoFar = "";

    const upsertAssistant = (chunk: string) => {
      assistantSoFar += chunk;
      // Strip markers for display but don't trigger side-effects until stream ends
      const parsed = parseAssistantMessage(assistantSoFar);
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant" && prev.length > 1 && prev[prev.length - 2]?.role === "user" && prev[prev.length - 2]?.content === text.trim()) {
          return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: parsed.cleanContent } : m));
        }
        return [...prev, { role: "assistant", content: parsed.cleanContent }];
      });
    };

    try {
      const allMessages = [...messages, userMsg];
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: allMessages.map(({ role, content }) => ({ role, content })), lang }),
      });

      if (!resp.ok || !resp.body) {
        const errData = await resp.json().catch(() => null);
        throw new Error(errData?.error || t("chatbot.errorConnect"));
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";
      let streamDone = false;

      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") { streamDone = true; break; }
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) upsertAssistant(content);
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }

      if (textBuffer.trim()) {
        for (let raw of textBuffer.split("\n")) {
          if (!raw) continue;
          if (raw.endsWith("\r")) raw = raw.slice(0, -1);
          if (raw.startsWith(":") || raw.trim() === "") continue;
          if (!raw.startsWith("data: ")) continue;
          const jsonStr = raw.slice(6).trim();
          if (jsonStr === "[DONE]") continue;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) upsertAssistant(content);
          } catch { /* ignore */ }
        }
      }

      // After stream completes, process markers for side effects
      const finalParsed = parseAssistantMessage(assistantSoFar);
      if (finalParsed.showContactForm && !contactShownOnce) {
        setShowContactForm(true);
        setContactShownOnce(true);
      }
      if (finalParsed.suggestions.length > 0) {
        setDynamicChips(finalParsed.suggestions);
      }
      // Store project slugs in the last message metadata
      if (finalParsed.projectSlugs.length > 0) {
        setMessages((prev) => {
          const updated = [...prev];
          const lastIdx = updated.length - 1;
          if (updated[lastIdx]?.role === "assistant") {
            (updated[lastIdx] as any)._projectSlugs = finalParsed.projectSlugs;
          }
          return [...updated];
        });
      }
    } catch (e) {
      console.error(e);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: t("chatbot.errorGeneric") },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = () => sendMessage(input);
  const handleChipClick = (chip: string) => sendMessage(chip);

  // Determine which chips to show
  const showInitialChips = messages.length <= 2 && !isLoading && dynamicChips.length === 0;
  const chipsToShow = showInitialChips ? INITIAL_CHIPS : (!isLoading ? dynamicChips : []);

  return (
    <>
      {/* Floating button */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            whileHover={{ scale: 1.1 }}
            onClick={() => { setOpen(true); if (isMobile) setFullscreen(true); }}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow"
            aria-label={t("chatbot.openChat")}
          >
            <MessageCircle className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`fixed z-50 border bg-background shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ${
              fullscreen
                ? "inset-0 rounded-none"
                : "bottom-6 right-6 w-[380px] max-w-[calc(100vw-2rem)] h-[520px] max-h-[calc(100vh-4rem)] rounded-2xl"
            }`}
          >
            {/* Header */}
            <div className={`flex items-center justify-between px-4 py-3 bg-primary text-primary-foreground ${fullscreen ? "" : "rounded-t-2xl"}`}>
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5" />
                <div>
                  <p className="text-sm font-semibold">{t("chatbot.assistant")}</p>
                  <p className="text-xs opacity-80">{t("chatbot.subtitle")}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {messages.length > 1 && (
                  <button
                    onClick={() => { setMessages([DEFAULT_MSG]); setDynamicChips([]); setContactShownOnce(false); setShowContactForm(false); }}
                    className="p-1.5 rounded-full hover:bg-primary-foreground/20 transition-colors"
                    title={t("chatbot.newConversation")}
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                )}
                <button onClick={() => setShowContactForm((v) => !v)} className="p-1.5 rounded-full hover:bg-primary-foreground/20 transition-colors" title={t("chatbot.leaveData")}>
                  <UserPlus className="w-4 h-4" />
                </button>
                <button onClick={() => setFullscreen((v) => !v)} className="p-1.5 rounded-full hover:bg-primary-foreground/20 transition-colors" title={fullscreen ? t("chatbot.minimize") : t("chatbot.fullscreen")}>
                  {fullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
                <button onClick={() => { setOpen(false); setFullscreen(false); }} className="p-1.5 rounded-full hover:bg-primary-foreground/20 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, i) => {
                const slugs = (msg as any)._projectSlugs as string[] | undefined;
                const matchedProjects = slugs?.length
                  ? allProjects?.filter((p) => slugs.includes(p.slug)) ?? []
                  : [];

                return (
                  <div key={i}>
                    <div className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                      {msg.role === "assistant" && (
                        <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Bot className="w-4 h-4 text-primary" />
                        </div>
                      )}
                      <div className={`max-w-[75%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${msg.role === "user" ? "bg-primary text-primary-foreground rounded-br-md" : "bg-muted text-foreground rounded-bl-md"}`}>
                        {msg.role === "assistant" ? (
                          <div className="prose prose-sm max-w-none dark:prose-invert [&>p]:m-0 [&>ul]:m-0 [&>ol]:m-0">
                            <ReactMarkdown
                              components={{
                                a: ({ href, children }) => (
                                  <a href={href} className="text-primary underline hover:text-primary/80 font-medium" target={href?.startsWith("/") ? "_self" : "_blank"} rel="noopener noreferrer">
                                    {children}
                                  </a>
                                ),
                              }}
                            >{msg.content}</ReactMarkdown>
                          </div>
                        ) : (
                          msg.content
                        )}
                      </div>
                      {msg.role === "user" && (
                        <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                          <User className="w-4 h-4 text-primary-foreground" />
                        </div>
                      )}
                    </div>
                    {/* Project cards */}
                    {matchedProjects.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                        className={`mt-2 ml-9 grid gap-2 ${matchedProjects.length === 1 ? "grid-cols-1 max-w-[200px]" : "grid-cols-2"}`}
                      >
                        {matchedProjects.map((p, idx) => (
                          <motion.div
                            key={p.id}
                            initial={{ opacity: 0, y: 12, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ duration: 0.3, delay: 0.15 + idx * 0.1 }}
                          >
                            <ProjectCard project={p} />
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </div>
                );
              })}

              {/* Inline contact form */}
              {showContactForm && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex gap-2">
                  <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <UserPlus className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 bg-muted rounded-2xl rounded-bl-md px-3.5 py-3">
                    <p className="text-sm font-medium text-foreground mb-2">{t("chatbot.leaveDataTitle")}</p>
                    <InlineContactForm onSuccess={handleContactSuccess} />
                  </div>
                </motion.div>
              )}

              {isLoading && messages[messages.length - 1]?.role === "user" && (
                <div className="flex gap-2">
                  <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-primary" />
                  </div>
                  <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-foreground/30 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-2 h-2 bg-foreground/30 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-2 h-2 bg-foreground/30 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom: CTA + Chips + Input */}
            <div className="border-t">
              {!showContactForm && (
                <button onClick={() => setShowContactForm(true)} className="w-full text-xs text-muted-foreground hover:text-primary py-1.5 flex items-center justify-center gap-1 transition-colors">
                  <UserPlus className="w-3 h-3" />
                  {t("chatbot.interestedCta")}
                </button>
              )}
              <AnimatePresence mode="wait">
                {chipsToShow.length > 0 && (
                  <motion.div
                    key={chipsToShow.join(",")}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.25 }}
                    className="px-3 pt-1 flex flex-wrap gap-1.5"
                  >
                    {chipsToShow.map((chip, idx) => (
                      <motion.button
                        key={chip}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.2, delay: idx * 0.05 }}
                        onClick={() => handleChipClick(chip)}
                        className="text-xs border border-border rounded-full px-3 py-1 text-muted-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
                      >
                        {chip}
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
              <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="p-3 pt-1.5 flex gap-2">
                <input value={input} onChange={(e) => setInput(e.target.value)} placeholder={t("chatbot.placeholder")} className="flex-1 text-sm bg-muted rounded-xl px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-muted-foreground" disabled={isLoading} />
                <button type="submit" disabled={!input.trim() || isLoading} className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-40 hover:bg-primary/90 transition-colors">
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatBot;
