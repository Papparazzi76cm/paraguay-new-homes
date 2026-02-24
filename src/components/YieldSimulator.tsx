import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { TrendingUp, DollarSign, Calendar } from "lucide-react";

interface YieldSimulatorProps {
  priceFrom: number;
  estimatedYield: number;
  currency: string;
}

const YieldSimulator = ({ priceFrom, estimatedYield, currency }: YieldSimulatorProps) => {
  const [investment, setInvestment] = useState(priceFrom);
  const [years, setYears] = useState(5);

  const results = useMemo(() => {
    const annualReturn = investment * (estimatedYield / 100);
    const totalReturn = annualReturn * years;
    const finalValue = investment + totalReturn;
    const monthlyIncome = annualReturn / 12;
    return { annualReturn, totalReturn, finalValue, monthlyIncome };
  }, [investment, years, estimatedYield]);

  const fmt = (n: number) =>
    new Intl.NumberFormat("es-PY", { maximumFractionDigits: 0 }).format(n);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-card rounded-2xl p-6 md:p-8 shadow-card"
    >
      <div className="flex items-center gap-2 mb-6">
        <div className="w-10 h-10 rounded-xl bg-accent/15 flex items-center justify-center">
          <TrendingUp className="w-5 h-5 text-accent" />
        </div>
        <div>
          <h3 className="font-display text-xl font-semibold text-foreground">
            Simulador de Rentabilidad
          </h3>
          <p className="text-xs text-muted-foreground">Rendimiento estimado: {estimatedYield}% anual</p>
        </div>
      </div>

      <div className="space-y-5">
        {/* Investment slider */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Inversión inicial</span>
            <span className="font-semibold text-foreground">
              {currency} {fmt(investment)}
            </span>
          </div>
          <input
            type="range"
            min={priceFrom * 0.8}
            max={priceFrom * 3}
            step={1000}
            value={investment}
            onChange={(e) => setInvestment(Number(e.target.value))}
            className="w-full accent-primary h-2 rounded-full appearance-none bg-secondary cursor-pointer"
          />
        </div>

        {/* Years slider */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Horizonte de inversión</span>
            <span className="font-semibold text-foreground">{years} años</span>
          </div>
          <input
            type="range"
            min={1}
            max={15}
            step={1}
            value={years}
            onChange={(e) => setYears(Number(e.target.value))}
            className="w-full accent-primary h-2 rounded-full appearance-none bg-secondary cursor-pointer"
          />
        </div>

        {/* Results */}
        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border">
          <ResultCard
            icon={DollarSign}
            label="Ingreso mensual"
            value={`${currency} ${fmt(results.monthlyIncome)}`}
          />
          <ResultCard
            icon={TrendingUp}
            label="Retorno anual"
            value={`${currency} ${fmt(results.annualReturn)}`}
          />
          <ResultCard
            icon={Calendar}
            label={`Retorno a ${years} años`}
            value={`${currency} ${fmt(results.totalReturn)}`}
          />
          <ResultCard
            icon={DollarSign}
            label="Valor final"
            value={`${currency} ${fmt(results.finalValue)}`}
            highlight
          />
        </div>
      </div>

      <p className="text-[11px] text-muted-foreground mt-4">
        * Proyección estimativa basada en rendimiento anual bruto. No constituye garantía de retorno.
      </p>
    </motion.div>
  );
};

const ResultCard = ({
  icon: Icon,
  label,
  value,
  highlight,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  highlight?: boolean;
}) => (
  <div className={`p-3 rounded-xl ${highlight ? "bg-primary/10" : "bg-secondary/50"}`}>
    <div className="flex items-center gap-1.5 mb-1">
      <Icon className={`w-3.5 h-3.5 ${highlight ? "text-primary" : "text-muted-foreground"}`} />
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
    <p className={`font-bold text-sm ${highlight ? "text-primary" : "text-foreground"}`}>{value}</p>
  </div>
);

export default YieldSimulator;
