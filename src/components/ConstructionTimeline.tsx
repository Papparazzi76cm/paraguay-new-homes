import { motion } from "framer-motion";
import { CheckCircle2, Clock, Circle } from "lucide-react";

const stages = [
  { key: "preventa", label: "Preventa", description: "Lanzamiento comercial" },
  { key: "en_pozo", label: "En Pozo", description: "Inicio de obra" },
  { key: "en_construccion", label: "En Construcción", description: "Avance de obra" },
  { key: "entrega_inmediata", label: "Entrega", description: "Listo para habitar" },
];

const statusOrder: Record<string, number> = {
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-card rounded-2xl p-6 md:p-8 shadow-card"
    >
      <h3 className="font-display text-xl font-semibold text-foreground mb-2">
        Etapa de Obra
      </h3>
      {deliveryDate && (
        <p className="text-sm text-muted-foreground mb-6">
          Entrega estimada: <span className="font-medium text-foreground">{deliveryDate}</span>
        </p>
      )}

      <div className="relative">
        {/* Line */}
        <div className="absolute left-[15px] top-4 bottom-4 w-0.5 bg-border" />
        <div
          className="absolute left-[15px] top-4 w-0.5 bg-primary transition-all duration-700"
          style={{ height: `${Math.min(currentStep / (stages.length - 1), 1) * 100}%` }}
        />

        <div className="space-y-8">
          {stages.map((stage, i) => {
            const done = i <= currentStep;
            const active = i === currentStep;
            return (
              <div key={stage.key} className="relative flex items-start gap-4 pl-0">
                <div className="relative z-10 flex-shrink-0">
                  {done ? (
                    <CheckCircle2 className={`w-8 h-8 ${active ? "text-primary" : "text-primary/60"}`} />
                  ) : (
                    <Circle className="w-8 h-8 text-muted-foreground/40" />
                  )}
                </div>
                <div>
                  <p className={`font-semibold text-sm ${done ? "text-foreground" : "text-muted-foreground"}`}>
                    {stage.label}
                  </p>
                  <p className="text-xs text-muted-foreground">{stage.description}</p>
                </div>
                {active && (
                  <span className="ml-auto flex items-center gap-1.5 text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
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
