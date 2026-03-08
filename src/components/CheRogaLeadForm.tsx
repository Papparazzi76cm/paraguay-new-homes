import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, CheckCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSubmitLead } from "@/hooks/useContactLead";

const CheRogaLeadForm = () => {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const submitLead = useSubmitLead();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    submitLead.mutate({
      full_name: name.trim(),
      email: email.trim(),
      phone: phone.trim() || undefined,
      message: `Interesado en proyectos Che Róga Porã. Ciudad preferida: ${city || "No especificada"}.`,
      lead_type: "che_roga_pora",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-card rounded-2xl p-6 md:p-8 shadow-card"
    >
      <div className="flex items-center gap-2 mb-4">
        <Mail className="w-5 h-5 text-primary" />
        <h3 className="font-display text-xl font-semibold text-foreground">
          {t("cheRoga.leadFormTitle")}
        </h3>
      </div>
      <p className="text-muted-foreground text-sm mb-6">
        {t("cheRoga.leadFormSubtitle")}
      </p>

      {submitLead.isSuccess ? (
        <div className="flex items-center gap-3 py-6 text-primary">
          <CheckCircle className="w-6 h-6" />
          <p className="font-semibold">{t("cheRoga.leadFormSuccess")}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t("cheRoga.leadFormName")}</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder={t("cheRoga.leadFormName")} required />
            </div>
            <div className="space-y-2">
              <Label>{t("cheRoga.leadFormEmail")}</Label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@email.com" required />
            </div>
            <div className="space-y-2">
              <Label>{t("cheRoga.leadFormPhone")}</Label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="0981 xxx xxx" />
            </div>
            <div className="space-y-2">
              <Label>{t("cheRoga.leadFormCity")}</Label>
              <Select value={city} onValueChange={setCity}>
                <SelectTrigger><SelectValue placeholder={t("cheRoga.leadFormCityPlaceholder")} /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Asunción">Asunción</SelectItem>
                  <SelectItem value="Ciudad del Este">Ciudad del Este</SelectItem>
                  <SelectItem value="Encarnación">Encarnación</SelectItem>
                  <SelectItem value="Luque">Luque</SelectItem>
                  <SelectItem value="San Lorenzo">San Lorenzo</SelectItem>
                  <SelectItem value="Fernando de la Mora">Fernando de la Mora</SelectItem>
                  <SelectItem value="Otra">{t("cheRoga.leadFormOtherCity")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button type="submit" size="lg" className="w-full md:w-auto" disabled={submitLead.isPending}>
            {submitLead.isPending ? t("cheRoga.leadFormSubmitting") : t("cheRoga.leadFormSubmit")}
          </Button>
        </form>
      )}
    </motion.div>
  );
};

export default CheRogaLeadForm;
