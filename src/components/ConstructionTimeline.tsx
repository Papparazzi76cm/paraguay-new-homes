import { motion } from "framer-motion";
import { CheckCircle2, Clock, ShoppingCart, Landmark, HardHat, Home } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useTranslation } from "react-i18next";

const stages = [
  { key: "preventa", dateKey: "phase_preventa_date", labelKey: "timeline.preventa", descKey: "timeline.preventaDesc", icon: ShoppingCart },
  { key: "en_pozo", dateKey: "phase_en_pozo_date", labelKey: "timeline.enPozo", descKey: "timeline.enPozoDesc", icon: Landmark },
  { key: "en_construccion", dateKey: "phase_construccion_date", labelKey: "timeline.construccion", descKey: "timeline.construccionDesc", icon: HardHat },
  { key: "entrega_inmediata", dateKey: "phase_entrega_date", labelKey: "timeline.entrega", descKey: "timeline.entregaDesc", icon: Home },
];

const statusOrder: Record<string, number> = { preventa: 0, en_pozo: 1, en_construccion: 2, entrega_inmediata: 3 };

interface ConstructionTimelineProps {
  status: string;
  deliveryDate?: string | null;
  phaseDates?: Record<string, string | null>;
}

const ConstructionTimeline = ({ status, deliveryDate, phaseDates }: ConstructionTimelineProps) => {
  const currentStep = statusOrder[status] ?? 0;
  const progressPercent = Math.round((currentStep / (stages.length - 1)) * 100);
  const { t } = useTranslation();

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-card rounded-2xl p-6 md:p-8 shadow-card">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
        <h3 className="font-display text-xl font-semibold text-foreground">{t("timeline.title")}</h3>
        <span className="text-sm font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">{t("timeline.completed", { percent: progressPercent })}</span>
      </div>
      {deliveryDate && (<p className="text-sm text-muted-foreground mb-6">{t("timeline.estimatedDelivery")} <span className="font-medium text-foreground">{deliveryDate}</span></p>)}
      <Progress value={progressPercent} className="h-2 mb-8" />

      {/* Desktop */}
      <div className="hidden md:grid grid-cols-4 gap-2">
        {stages.map((stage, i) => {
          const done = i <= currentStep;
          const active = i === currentStep;
          const Icon = stage.icon;
          return (
            <motion.div key={stage.key} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className={`relative flex flex-col items-center text-center rounded-xl p-4 transition-colors ${active ? "bg-primary/10 ring-2 ring-primary/30" : done ? "bg-muted/50" : "bg-transparent"}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${done ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                {done && !active ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
              </div>
              <p className={`font-semibold text-sm ${done ? "text-foreground" : "text-muted-foreground"}`}>{t(stage.labelKey)}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{t(stage.descKey)}</p>
              {phaseDates?.[stage.dateKey] && <p className="text-[11px] text-muted-foreground mt-1 font-medium">{phaseDates[stage.dateKey]}</p>}
              {active && (<span className="mt-2 flex items-center gap-1 text-[11px] font-semibold text-primary"><Clock className="w-3 h-3" /> {t("timeline.currentPhase")}</span>)}
            </motion.div>
          );
        })}
      </div>

      {/* Mobile */}
      <div className="md:hidden relative">
        <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-border" />
        <div className="absolute left-[19px] top-4 w-0.5 bg-primary transition-all duration-700" style={{ height: `${Math.min(currentStep / (stages.length - 1), 1) * 100}%` }} />
        <div className="space-y-6">
          {stages.map((stage, i) => {
            const done = i <= currentStep;
            const active = i === currentStep;
            const Icon = stage.icon;
            return (
              <div key={stage.key} className={`relative flex items-start gap-4 pl-0 rounded-xl p-2 ${active ? "bg-primary/10" : ""}`}>
                <div className={`relative z-10 flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${done ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                  {done && !active ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                </div>
                <div className="pt-1">
                  <p className={`font-semibold text-sm ${done ? "text-foreground" : "text-muted-foreground"}`}>{t(stage.labelKey)}</p>
                  <p className="text-xs text-muted-foreground">{t(stage.descKey)}</p>
                  {phaseDates?.[stage.dateKey] && <p className="text-[11px] text-muted-foreground mt-0.5 font-medium">{phaseDates[stage.dateKey]}</p>}
                </div>
                {active && (<span className="ml-auto flex items-center gap-1 text-[11px] font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full self-center"><Clock className="w-3 h-3" /> {t("timeline.current")}</span>)}
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default ConstructionTimeline;
