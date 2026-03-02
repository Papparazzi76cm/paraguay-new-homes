import { motion } from "framer-motion";
import { CheckCircle2, Clock, Circle, HardHat, Landmark, Home, ShoppingCart } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const stages = [
  { key: "preventa", label: "Preventa", description: "Lanzamiento comercial", icon: ShoppingCart },
  { key: "en_pozo", label: "En Pozo", description: "Inicio de obra", icon: Landmark },
  { key: "en_construccion", label: "Construcción", description: "Estructura y terminaciones", icon: HardHat },
  { key: "entrega_inmediata", label: "Entrega", description: "Listo para habitar", icon: Home },
];

const statusOrder: Record<string, number> = {
  preventa: 0,
  en_pozo: 1,
  en_construccion: 2,
  entrega_inmediata: 3,
};

interface ConstructionTimelineProps {
  status: string;
  deliveryDate?: string | null;
}

const ConstructionTimeline = ({ status, deliveryDate }: ConstructionTimelineProps) => {
  const currentStep = statusOrder[status] ?? 0;
  const progressPercent = Math.round((currentStep / (stages.length - 1)) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-card rounded-2xl p-6 md:p-8 shadow-card"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
        <h3 className="font-display text-xl font-semibold text-foreground">
          Cronograma de Obra
        </h3>
        <span className="text-sm font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">
          {progressPercent}% completado
        </span>
      </div>

      {deliveryDate && (
        <p className="text-sm text-muted-foreground mb-6">
          Entrega estimada: <span className="font-medium text-foreground">{deliveryDate}</span>
        </p>
      )}

      {/* Progress bar */}
      <Progress value={progressPercent} className="h-2 mb-8" />

      {/* Horizontal timeline (desktop) / Vertical (mobile) */}
      <div className="hidden md:grid grid-cols-4 gap-2">
        {stages.map((stage, i) => {
          const done = i <= currentStep;
          const active = i === currentStep;
          const Icon = stage.icon;
          return (
            <motion.div
              key={stage.key}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative flex flex-col items-center text-center rounded-xl p-4 transition-colors ${
                active
                  ? "bg-primary/10 ring-2 ring-primary/30"
                  : done
                  ? "bg-muted/50"
                  : "bg-transparent"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                  done
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {done && !active ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <Icon className="w-5 h-5" />
                )}
              </div>
              <p className={`font-semibold text-sm ${done ? "text-foreground" : "text-muted-foreground"}`}>
                {stage.label}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">{stage.description}</p>
              {active && (
                <span className="mt-2 flex items-center gap-1 text-[11px] font-semibold text-primary">
                  <Clock className="w-3 h-3" /> Fase actual
                </span>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Vertical timeline (mobile) */}
      <div className="md:hidden relative">
        <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-border" />
        <div
          className="absolute left-[19px] top-4 w-0.5 bg-primary transition-all duration-700"
          style={{ height: `${Math.min(currentStep / (stages.length - 1), 1) * 100}%` }}
        />

        <div className="space-y-6">
          {stages.map((stage, i) => {
            const done = i <= currentStep;
            const active = i === currentStep;
            const Icon = stage.icon;
            return (
              <div
                key={stage.key}
                className={`relative flex items-start gap-4 pl-0 rounded-xl p-2 ${
                  active ? "bg-primary/10" : ""
                }`}
              >
                <div
                  className={`relative z-10 flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                    done
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {done && !active ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                </div>
                <div className="pt-1">
                  <p className={`font-semibold text-sm ${done ? "text-foreground" : "text-muted-foreground"}`}>
                    {stage.label}
                  </p>
                  <p className="text-xs text-muted-foreground">{stage.description}</p>
                </div>
                {active && (
                  <span className="ml-auto flex items-center gap-1 text-[11px] font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full self-center">
                    <Clock className="w-3 h-3" /> Actual
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default ConstructionTimeline;
