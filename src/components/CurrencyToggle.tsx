import { DollarSign } from "lucide-react";

export type DisplayCurrency = "USD" | "PYG";

// Approximate exchange rate — update as needed
export const USD_TO_PYG = 7300;

export const convertCurrency = (
  amount: number,
  fromCurrency: string,
  toCurrency: DisplayCurrency
): number => {
  if (fromCurrency === toCurrency) return amount;
  if (fromCurrency === "USD" && toCurrency === "PYG") return amount * USD_TO_PYG;
  if (fromCurrency === "PYG" && toCurrency === "USD") return amount / USD_TO_PYG;
  return amount;
};

export const formatCurrency = (amount: number, currency: DisplayCurrency): string => {
  if (currency === "PYG") {
    return `₲ ${new Intl.NumberFormat("es-PY", { maximumFractionDigits: 0 }).format(amount)}`;
  }
  return `USD ${new Intl.NumberFormat("es-PY", { maximumFractionDigits: 0 }).format(amount)}`;
};

interface CurrencyToggleProps {
  value: DisplayCurrency;
  onChange: (c: DisplayCurrency) => void;
  className?: string;
}

const CurrencyToggle = ({ value, onChange, className = "" }: CurrencyToggleProps) => (
  <div className={`inline-flex items-center rounded-lg bg-secondary p-0.5 ${className}`}>
    <button
      type="button"
      onClick={() => onChange("USD")}
      className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
        value === "USD"
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:text-foreground"
      }`}
    >
      USD
    </button>
    <button
      type="button"
      onClick={() => onChange("PYG")}
      className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
        value === "PYG"
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:text-foreground"
      }`}
    >
      ₲ PYG
    </button>
  </div>
);

export default CurrencyToggle;
