import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Calculator, Info } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const TASA_ANUAL = 6.5;
const PLAZO_MAX = 30;
const SALARIO_MINIMO_PYG = 2_680_373;

const formatGs = (n: number) =>
  new Intl.NumberFormat("es-PY", { style: "currency", currency: "PYG", maximumFractionDigits: 0 }).format(n);

const MortgageSimulator = ({ defaultCapital }: { defaultCapital?: number }) => {
  const { t } = useTranslation();
  const [capital, setCapital] = useState(defaultCapital || 350_000_000);
  const [plazo, setPlazo] = useState(25);
  const [salario, setSalario] = useState(SALARIO_MINIMO_PYG * 3);

  const result = useMemo(() => {
    const tasaMensual = TASA_ANUAL / 100 / 12;
    const meses = plazo * 12;
    const cuota = capital * tasaMensual / (1 - Math.pow(1 + tasaMensual, -meses));
    const ingresoMinimo = cuota / 0.3;
    const ratio = salario > 0 ? (cuota / salario) * 100 : 0;
    const totalPagado = cuota * meses;
    return { cuota, ingresoMinimo, ratio, totalPagado };
  }, [capital, plazo, salario]);

  const eligibleBySalary = result.ratio <= 30;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-card rounded-2xl p-6 md:p-8 shadow-card"
    >
      <div className="flex items-center gap-2 mb-6">
        <Calculator className="w-5 h-5 text-primary" />
        <h3 className="font-display text-xl font-semibold text-foreground">{t("cheRoga.simTitle")}</h3>
      </div>

      <div className="space-y-6">
        {/* Capital */}
        <div className="space-y-2">
          <Label className="text-sm text-muted-foreground">{t("cheRoga.simCreditAmount")}</Label>
          <Input
            type="text"
            value={formatGs(capital)}
            onChange={(e) => {
              const num = parseInt(e.target.value.replace(/\D/g, ""));
              if (!isNaN(num)) setCapital(num);
            }}
            className="text-lg font-bold"
          />
          <Slider
            value={[capital]}
            onValueChange={([v]) => setCapital(v)}
            min={100_000_000}
            max={725_000_000}
            step={5_000_000}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{formatGs(100_000_000)}</span>
            <span>{formatGs(725_000_000)}</span>
          </div>
        </div>

        {/* Plazo */}
        <div className="space-y-2">
          <Label className="text-sm text-muted-foreground">{t("cheRoga.simTerm", { years: plazo })}</Label>
          <Slider
            value={[plazo]}
            onValueChange={([v]) => setPlazo(v)}
            min={5}
            max={PLAZO_MAX}
            step={1}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{t("cheRoga.simTermMin")}</span>
            <span>{t("cheRoga.simTermMax")}</span>
          </div>
        </div>

        {/* Salario */}
        <div className="space-y-2">
          <Label className="text-sm text-muted-foreground">{t("cheRoga.simHouseholdIncome")}</Label>
          <Input
            type="text"
            value={formatGs(salario)}
            onChange={(e) => {
              const num = parseInt(e.target.value.replace(/\D/g, ""));
              if (!isNaN(num)) setSalario(num);
            }}
          />
        </div>

        {/* Results */}
        <div className="bg-primary/5 rounded-xl p-5 space-y-3 border border-primary/10">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">{t("cheRoga.simMonthlyPayment")}</span>
            <span className="text-xl font-bold text-primary">{formatGs(result.cuota)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">{t("cheRoga.simFixedRate")}</span>
            <span className="font-semibold text-foreground">{TASA_ANUAL}% {t("cheRoga.simAnnual")}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">{t("cheRoga.simMinIncome")}</span>
            <span className="font-semibold text-foreground">{formatGs(result.ingresoMinimo)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">{t("cheRoga.simPaymentRatio")}</span>
            <span className={`font-semibold ${eligibleBySalary ? "text-primary" : "text-destructive"}`}>
              {result.ratio.toFixed(1)}%
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">{t("cheRoga.simTotalPaid")}</span>
            <span className="font-semibold text-foreground">{formatGs(result.totalPagado)}</span>
          </div>
        </div>

        {!eligibleBySalary && (
          <div className="flex items-start gap-2 text-sm text-destructive bg-destructive/10 rounded-lg p-3">
            <Info className="w-4 h-4 mt-0.5 shrink-0" />
            <p>{t("cheRoga.simWarning")}</p>
          </div>
        )}

        <p className="text-xs text-muted-foreground">{t("cheRoga.simDisclaimer")}</p>
      </div>
    </motion.div>
  );
};

export default MortgageSimulator;
