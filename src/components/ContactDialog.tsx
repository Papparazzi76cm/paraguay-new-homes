import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useSubmitLead } from "@/hooks/useContactLead";

interface ContactDialogProps {
  open: boolean;
  onClose: () => void;
  projectId?: string;
  projectTitle?: string;
  leadType?: string;
}

const ContactDialog = ({ open, onClose, projectId, projectTitle, leadType = "contact" }: ContactDialogProps) => {
  const [form, setForm] = useState({ full_name: "", email: "", phone: "", message: "" });
  const { mutate, isPending } = useSubmitLead();
  const { t } = useTranslation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate(
      { ...form, project_id: projectId, lead_type: leadType },
      {
        onSuccess: () => {
          setForm({ full_name: "", email: "", phone: "", message: "" });
          onClose();
        },
      }
    );
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/50 backdrop-blur-sm" onClick={onClose}>
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="bg-card rounded-2xl shadow-elevated w-full max-w-md p-6 md:p-8" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-display text-xl font-semibold text-foreground">{t("contact.title")}</h3>
                {projectTitle && <p className="text-sm text-muted-foreground mt-1">{projectTitle}</p>}
              </div>
              <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" placeholder={t("contact.namePlaceholder")} required value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-secondary text-foreground placeholder:text-muted-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm" />
              <input type="email" placeholder={t("contact.emailPlaceholder")} required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-secondary text-foreground placeholder:text-muted-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm" />
              <input type="tel" placeholder={t("contact.phonePlaceholder")} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-secondary text-foreground placeholder:text-muted-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm" />
              <textarea placeholder={t("contact.messagePlaceholder")} rows={3} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-secondary text-foreground placeholder:text-muted-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm resize-none" />
              <button type="submit" disabled={isPending} className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50">
                {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                {t("contact.send")}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ContactDialog;
