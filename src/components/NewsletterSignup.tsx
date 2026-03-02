import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Loader2, CheckCircle2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

const emailSchema = z.string().trim().email().max(255);

const NewsletterSignup = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) { setErrorMsg(parsed.error.errors[0].message); return; }
    setStatus("loading");
    const { error } = await supabase.from("newsletter_subscribers").insert({ email: parsed.data });
    if (error) {
      if (error.code === "23505") { setStatus("success"); }
      else { setStatus("error"); setErrorMsg(t("newsletter.error")); }
    } else { setStatus("success"); }
  };

  if (status === "success") {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-foreground rounded-2xl p-8 md:p-12 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_hsla(160,35%,30%,0.15),_transparent_60%)]" />
        <div className="relative z-10">
          <CheckCircle2 className="w-12 h-12 text-primary mx-auto mb-4" />
          <h3 className="font-display text-2xl font-bold text-background mb-2">{t("newsletter.successTitle")}</h3>
          <p className="text-background/60 text-sm">{t("newsletter.successDesc")}</p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="bg-foreground rounded-2xl p-8 md:p-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_hsla(38,60%,55%,0.1),_transparent_60%)]" />
      <div className="relative z-10 max-w-xl mx-auto text-center">
        <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center mx-auto mb-4">
          <Mail className="w-6 h-6 text-primary" />
        </div>
        <h3 className="font-display text-2xl md:text-3xl font-bold text-background mb-2">{t("newsletter.title")}</h3>
        <p className="text-background/60 text-sm mb-6">{t("newsletter.subtitle")}</p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email" placeholder="tu@email.com" required maxLength={255} value={email}
            onChange={(e) => { setEmail(e.target.value); setErrorMsg(""); }}
            className="flex-1 px-4 py-3 rounded-xl bg-background/10 text-background placeholder:text-background/40 border border-background/20 focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
          />
          <button type="submit" disabled={status === "loading"} className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2 text-sm disabled:opacity-50 whitespace-nowrap">
            {status === "loading" ? <Loader2 className="w-4 h-4 animate-spin" /> : t("newsletter.subscribe")}
          </button>
        </form>
        {errorMsg && <p className="text-destructive text-xs mt-2">{errorMsg}</p>}
        <p className="text-background/30 text-xs mt-4">{t("newsletter.noSpam")}</p>
      </div>
    </div>
  );
};

export default NewsletterSignup;
