import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Search, BedDouble, Banknote, X, Expand } from "lucide-react";
import { useProjectUnits, type UnitFilters, type UnitTypology } from "@/hooks/useProjectUnits";
import CurrencyToggle, { type DisplayCurrency, convertCurrency, formatCurrency } from "./CurrencyToggle";

const typologyKeys: UnitTypology[] = ["monoambiente", "1_dormitorio", "2_dormitorios", "3_dormitorios"];

const priceRangesUSD = [
  { label: "0 - 50k", min: 0, max: 50000 },
  { label: "50k - 100k", min: 50000, max: 100000 },
  { label: "100k - 200k", min: 100000, max: 200000 },
  { label: "+ 200k", min: 200000, max: undefined },
];

interface UnitSearchProps {
  projectId: string;
  currency: string;
}

const UnitSearch = ({ projectId, currency }: UnitSearchProps) => {
  const { t } = useTranslation();
  const [filters, setFilters] = useState<UnitFilters>({});
  const [displayCurrency, setDisplayCurrency] = useState<DisplayCurrency>((currency === "PYG" ? "PYG" : "USD") as DisplayCurrency);
  const { data: units, isLoading } = useProjectUnits(projectId, filters);

  const hasFilters = filters.typology || filters.priceMin != null;

  const selectedPriceLabel = priceRangesUSD.find(
    (r) => r.min === filters.priceMin && r.max === filters.priceMax
  )?.label || null;

  const fmtPrice = (price: number, fromCurrency: string) =>
    formatCurrency(convertCurrency(price, fromCurrency, displayCurrency), displayCurrency);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-card rounded-2xl p-6 md:p-8 shadow-card"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-xl font-semibold text-foreground flex items-center gap-2">
          <Search className="w-5 h-5 text-primary" />
          {t("units.title")}
        </h3>
        <CurrencyToggle value={displayCurrency} onChange={setDisplayCurrency} />
      </div>

      {/* Filters */}
      <div className="space-y-3 mb-6">
        {/* Typology */}
        <div>
          <p className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-1.5">
            <BedDouble className="w-3.5 h-3.5" /> {t("units.typology")}
          </p>
          <div className="flex flex-wrap gap-2">
            {typologyKeys.map((key) => (
              <button
                key={key}
                onClick={() => setFilters((f) => ({ ...f, typology: f.typology === key ? undefined : key }))}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  filters.typology === key
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground"
                }`}
              >
                {t(`units.${key}`)}
              </button>
            ))}
          </div>
        </div>

        {/* Price range */}
        <div>
          <p className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-1.5">
            <Banknote className="w-3.5 h-3.5" /> {t("units.priceRange")}
          </p>
          <div className="flex flex-wrap gap-2">
            {priceRangesUSD.map((range) => {
              const isSelected = filters.priceMin === range.min && filters.priceMax === range.max;
              return (
                <button
                  key={range.label}
                  onClick={() =>
                    setFilters((f) => ({
                      ...f,
                      priceMin: isSelected ? undefined : range.min,
                      priceMax: isSelected ? undefined : range.max,
                    }))
                  }
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    isSelected
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground"
                  }`}
                >
                  {range.label}
                </button>
              );
            })}
          </div>
        </div>

        {hasFilters && (
          <button
            onClick={() => setFilters({})}
            className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
          >
            <X className="w-3.5 h-3.5" /> {t("units.clearFilters")}
          </button>
        )}
      </div>

      {/* Results */}
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-6 text-muted-foreground text-sm">
            {t("auth.loading")}
          </motion.div>
        ) : !units || units.length === 0 ? (
          <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-6 text-muted-foreground text-sm">
            {t("units.noUnits")}
          </motion.div>
        ) : (
          <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <p className="text-sm text-muted-foreground mb-3">
              {t("units.found", { count: units.length })}
            </p>
            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {units.map((unit) => (
                <div
                  key={unit.id}
                  className="flex items-center justify-between bg-secondary/50 rounded-xl px-4 py-3 hover:bg-secondary transition-colors"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-foreground text-sm truncate">{unit.unit_name}</p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                      <span>{t(`units.${unit.typology}`)}</span>
                      {unit.area_m2 && <span className="flex items-center gap-1"><Expand className="w-3 h-3" />{unit.area_m2} m²</span>}
                      {unit.floor && <span>{t("units.floor")}: {unit.floor}</span>}
                    </div>
                  </div>
                  {unit.price && (
                    <p className="font-bold text-foreground text-sm shrink-0 ml-4">
                      {fmtPrice(unit.price, unit.price_currency)}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default UnitSearch;
