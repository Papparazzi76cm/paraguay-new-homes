import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, AlertTriangle, ClipboardCheck } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSubmitLead } from "@/hooks/useContactLead";

const SALARIO_MINIMO = 2_680_373;

type Result = "elegible" | "elegible_con_condiciones" | "no_elegible" | null;

const EligibilityForm = () => {
  const { t } = useTranslation();
  const [age, setAge] = useState("");
  const [income, setIncome] = useState("");
  const [hasHome, setHasHome] = useState("");
  const [hasTerrain, setHasTerrain] = useState("");
  const [employmentYears, setEmploymentYears] = useState("");
  const [city, setCity] = useState("");
  const [maritalStatus, setMaritalStatus] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [result, setResult] = useState<Result>(null);
  const [showContact, setShowContact] = useState(false);
  const submitLead = useSubmitLead();

  const evaluate = () => {
    const ageNum = parseInt(age);
    const incomeNum = parseInt(income.replace(/\D/g, ""));
    const empYears = parseInt(employmentYears);

    if (isNaN(ageNum) || isNaN(incomeNum)) return;

    const inSalarios = incomeNum / SALARIO_MINIMO;

    if (ageNum < 18 || ageNum > 75) { setResult("no_elegible"); return; }
    if (hasHome === "si") { setResult("no_elegible"); return; }
    if (inSalarios > 6) { setResult("no_elegible"); return; }
    if (inSalarios < 1) { setResult("no_elegible"); return; }

    let conditions = 0;
    if (empYears && !isNaN(empYears) && empYears < 1) conditions++;
    if (ageNum > 65) conditions++;

    setResult(conditions > 0 ? "elegible_con_condiciones" : "elegible");
    setShowContact(true);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    submitLead.mutate({
      full_name: name.trim(),
      email: email.trim(),
      phone: phone.trim() || undefined,
      message: `Pre-calificación Che Róga Porã: ${result}. Ciudad: ${city}. Ingreso: ${income}. Edad: ${age}.`,
      lead_type: "che_roga_pora",
    });
  };

  const resultConfig = {
    elegible: { icon: CheckCircle, color: "text-primary", bg: "bg-primary/10 border-primary/20", title: t("cheRoga.eligResultOk"), desc: t("cheRoga.eligResultOkDesc") },
    elegible_con_condiciones: { icon: AlertTriangle, color: "text-accent", bg: "bg-accent/10 border-accent/20", title: t("cheRoga.eligResultCond"), desc: t("cheRoga.eligResultCondDesc") },
    no_elegible: { icon: XCircle, color: "text-destructive", bg: "bg-destructive/10 border-destructive/20", title: t("cheRoga.eligResultNo"), desc: t("cheRoga.eligResultNoDesc") },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-card rounded-2xl p-6 md:p-8 shadow-card"
    >
      <div className="flex items-center gap-2 mb-6">
        <ClipboardCheck className="w-5 h-5 text-primary" />
        <h3 className="font-display text-xl font-semibold text-foreground">{t("cheRoga.eligTitle")}</h3>
      </div>

      <p className="text-muted-foreground text-sm mb-6">{t("cheRoga.eligSubtitle")}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="space-y-2">
          <Label>{t("cheRoga.eligAge")}</Label>
          <Input type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder={t("cheRoga.eligAgePlaceholder")} min={18} max={99} />
        </div>
        <div className="space-y-2">
          <Label>{t("cheRoga.eligIncome")}</Label>
          <Input value={income} onChange={(e) => setIncome(e.target.value)} placeholder={t("cheRoga.eligIncomePlaceholder")} />
        </div>
        <div className="space-y-2">
          <Label>{t("cheRoga.eligHasHome")}</Label>
          <Select value={hasHome} onValueChange={setHasHome}>
            <SelectTrigger><SelectValue placeholder={t("cheRoga.eligSelect")} /></SelectTrigger>
            <SelectContent>
              <SelectItem value="no">{t("cheRoga.eligNo")}</SelectItem>
              <SelectItem value="si">{t("cheRoga.eligYes")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>{t("cheRoga.eligHasTerrain")}</Label>
          <Select value={hasTerrain} onValueChange={setHasTerrain}>
            <SelectTrigger><SelectValue placeholder={t("cheRoga.eligSelect")} /></SelectTrigger>
            <SelectContent>
              <SelectItem value="no">{t("cheRoga.eligNo")}</SelectItem>
              <SelectItem value="si">{t("cheRoga.eligYes")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>{t("cheRoga.eligEmploymentYears")}</Label>
          <Input type="number" value={employmentYears} onChange={(e) => setEmploymentYears(e.target.value)} placeholder={t("cheRoga.eligEmploymentPlaceholder")} min={0} />
        </div>
        <div className="space-y-2">
          <Label>{t("cheRoga.eligCity")}</Label>
          <Select value={city} onValueChange={setCity}>
            <SelectTrigger><SelectValue placeholder={t("cheRoga.eligSelect")} /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Asunción">Asunción</SelectItem>
              <SelectItem value="Ciudad del Este">Ciudad del Este</SelectItem>
              <SelectItem value="Encarnación">Encarnación</SelectItem>
              <SelectItem value="Luque">Luque</SelectItem>
              <SelectItem value="San Lorenzo">San Lorenzo</SelectItem>
              <SelectItem value="Fernando de la Mora">Fernando de la Mora</SelectItem>
              <SelectItem value="Otra">{t("cheRoga.eligOtherCity")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>{t("cheRoga.eligMaritalStatus")}</Label>
          <Select value={maritalStatus} onValueChange={setMaritalStatus}>
            <SelectTrigger><SelectValue placeholder={t("cheRoga.eligSelect")} /></SelectTrigger>
            <SelectContent>
              <SelectItem value="soltero">{t("cheRoga.eligSingle")}</SelectItem>
              <SelectItem value="casado">{t("cheRoga.eligMarried")}</SelectItem>
              <SelectItem value="union_libre">{t("cheRoga.eligPartnership")}</SelectItem>
              <SelectItem value="divorciado">{t("cheRoga.eligDivorced")}</SelectItem>
              <SelectItem value="viudo">{t("cheRoga.eligWidowed")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button onClick={evaluate} className="w-full md:w-auto" size="lg">
        {t("cheRoga.eligVerify")}
      </Button>

      {result && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-6 rounded-xl p-5 border ${resultConfig[result].bg}`}
        >
          <div className="flex items-center gap-2 mb-2">
            {(() => { const Icon = resultConfig[result].icon; return <Icon className={`w-5 h-5 ${resultConfig[result].color}`} />; })()}
            <h4 className={`font-semibold ${resultConfig[result].color}`}>{resultConfig[result].title}</h4>
          </div>
          <p className="text-sm text-muted-foreground">{resultConfig[result].desc}</p>
        </motion.div>
      )}

      {showContact && result !== "no_elegible" && (
        <motion.form
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleContactSubmit}
          className="mt-6 space-y-4 border-t border-border pt-6"
        >
          <h4 className="font-display text-lg font-semibold text-foreground">{t("cheRoga.eligContactTitle")}</h4>
          <p className="text-sm text-muted-foreground">{t("cheRoga.eligContactDesc")}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t("cheRoga.eligName")}</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>{t("cheRoga.eligEmail")}</Label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>{t("cheRoga.eligPhone")}</Label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
          </div>
          <Button type="submit" disabled={submitLead.isPending}>
            {submitLead.isPending ? t("cheRoga.eligSubmitting") : t("cheRoga.eligSubmit")}
          </Button>
          {submitLead.isSuccess && (
            <p className="text-sm text-primary flex items-center gap-1"><CheckCircle className="w-4 h-4" /> {t("cheRoga.eligSuccess")}</p>
          )}
        </motion.form>
      )}
    </motion.div>
  );
};

export default EligibilityForm;
