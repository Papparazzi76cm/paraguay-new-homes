import { useState } from "react";
import { Search, MapPin, Building2, Banknote, CalendarDays, ChevronDown, X, HardHat } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useProjectCities, useProjectDevelopers, type ProjectFilters } from "@/hooks/useProjects";

const priceRanges = [
  { label: "0 - 50.000$", min: 0, max: 50000 },
  { label: "50.000 - 100.000$", min: 50000, max: 100000 },
  { label: "100.000 - 250.000$", min: 100000, max: 250000 },
  { label: "250.000 - 500.000$", min: 250000, max: 500000 },
  { label: "+ 500.000$", min: 500000, max: undefined },
];

const statusKeys = ["preventa", "en_pozo", "en_construccion", "entrega_inmediata"] as const;
const typeKeys = ["departamentos", "casas", "barrio_cerrado", "mixto"] as const;

interface SearchBarProps {
  filters: ProjectFilters;
  onFiltersChange: (filters: ProjectFilters) => void;
}

const SearchBar = ({ filters, onFiltersChange }: SearchBarProps) => {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const { data: cities } = useProjectCities();
  const { data: developers } = useProjectDevelopers();
  const { t } = useTranslation();

  const selectedCity = filters.city || null;
  const selectedType = filters.type || null;
  const selectedStatus = filters.status || null;
  const selectedPriceLabel = priceRanges.find(
    (r) => r.min === filters.priceMin && r.max === filters.priceMax
  )?.label || null;
  const selectedDeveloper = filters.developer || null;

  const handleCitySelect = (city: string) => {
    onFiltersChange({ ...filters, city: filters.city === city ? undefined : city });
    setActiveFilter(null);
  };

  const handleTypeSelect = (value: string) => {
    onFiltersChange({ ...filters, type: filters.type === value ? undefined : value });
    setActiveFilter(null);
  };

  const handleStatusSelect = (value: string) => {
    onFiltersChange({ ...filters, status: filters.status === value ? undefined : value });
    setActiveFilter(null);
  };

  const handlePriceSelect = (range: typeof priceRanges[number]) => {
    const isSame = filters.priceMin === range.min && filters.priceMax === range.max;
    onFiltersChange({
      ...filters,
      priceMin: isSame ? undefined : range.min,
      priceMax: isSame ? undefined : range.max,
    });
    setActiveFilter(null);
  };

  const handleDeveloperSelect = (name: string) => {
    onFiltersChange({ ...filters, developer: filters.developer === name ? undefined : name });
    setActiveFilter(null);
  };

  const hasAnyFilter = selectedCity || selectedType || selectedStatus || selectedPriceLabel || selectedDeveloper;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.6 }}
      className="w-full max-w-4xl mx-auto"
    >
      <div className="bg-card rounded-2xl shadow-elevated p-2 md:p-3">
        <div className="flex flex-col md:flex-row md:items-center gap-2">
          <FilterButton
            icon={<MapPin className="w-4 h-4" />}
            label={t("search.city")}
            placeholder={selectedCity || t("search.cityPlaceholder")}
            active={activeFilter === "ciudad"}
            selected={!!selectedCity}
            onClick={() => setActiveFilter(activeFilter === "ciudad" ? null : "ciudad")}
          />
          <div className="hidden md:block w-px h-8 bg-border" />
          <FilterButton
            icon={<Building2 className="w-4 h-4" />}
            label={t("search.type")}
            placeholder={selectedType ? t(`projectTypes.${selectedType}`) : t("search.typePlaceholder")}
            active={activeFilter === "tipo"}
            selected={!!selectedType}
            onClick={() => setActiveFilter(activeFilter === "tipo" ? null : "tipo")}
          />
          <div className="hidden md:block w-px h-8 bg-border" />
          <FilterButton
            icon={<Banknote className="w-4 h-4" />}
            label={t("search.price")}
            placeholder={selectedPriceLabel || t("search.pricePlaceholder")}
            active={activeFilter === "precio"}
            selected={!!selectedPriceLabel}
            onClick={() => setActiveFilter(activeFilter === "precio" ? null : "precio")}
          />
          <div className="hidden md:block w-px h-8 bg-border" />
          <FilterButton
            icon={<CalendarDays className="w-4 h-4" />}
            label={t("search.status")}
            placeholder={selectedStatus ? t(`projectStatus.${selectedStatus}`) : t("search.statusPlaceholder")}
            active={activeFilter === "estado"}
            selected={!!selectedStatus}
            onClick={() => setActiveFilter(activeFilter === "estado" ? null : "estado")}
          />
          <div className="hidden md:block w-px h-8 bg-border" />
          <FilterButton
            icon={<HardHat className="w-4 h-4" />}
            label={t("search.developer")}
            placeholder={selectedDeveloper || t("search.developerPlaceholder")}
            active={activeFilter === "promotor"}
            selected={!!selectedDeveloper}
            onClick={() => setActiveFilter(activeFilter === "promotor" ? null : "promotor")}
          />
          {hasAnyFilter ? (
            <button
              onClick={() => onFiltersChange({})}
              className="flex items-center justify-center gap-2 bg-secondary text-secondary-foreground px-5 py-3 rounded-xl font-medium hover:bg-secondary/80 transition-colors shrink-0"
            >
              <X className="w-4 h-4" />
              <span className="md:hidden">{t("search.clear")}</span>
            </button>
          ) : (
            <button className="flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-medium hover:opacity-90 transition-opacity shrink-0">
              <Search className="w-4 h-4" />
              <span className="md:hidden">{t("search.search")}</span>
            </button>
          )}
        </div>

        <AnimatePresence mode="wait">
          {activeFilter === "ciudad" && (
            <DropdownPanel key="ciudad">
              {(cities || []).map((city) => (
                <OptionChip key={city} label={city} selected={selectedCity === city} onClick={() => handleCitySelect(city)} />
              ))}
            </DropdownPanel>
          )}
          {activeFilter === "tipo" && (
            <DropdownPanel key="tipo">
              {typeKeys.map((key) => (
                <OptionChip key={key} label={t(`projectTypes.${key}`)} selected={selectedType === key} onClick={() => handleTypeSelect(key)} />
              ))}
            </DropdownPanel>
          )}
          {activeFilter === "precio" && (
            <DropdownPanel key="precio">
              {priceRanges.map((range) => (
                <OptionChip key={range.label} label={range.label} selected={filters.priceMin === range.min && filters.priceMax === range.max} onClick={() => handlePriceSelect(range)} />
              ))}
            </DropdownPanel>
          )}
          {activeFilter === "estado" && (
            <DropdownPanel key="estado">
              {statusKeys.map((key) => (
                <OptionChip key={key} label={t(`projectStatus.${key}`)} selected={selectedStatus === key} onClick={() => handleStatusSelect(key)} />
              ))}
            </DropdownPanel>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

const DropdownPanel = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, height: 0 }}
    animate={{ opacity: 1, height: "auto" }}
    exit={{ opacity: 0, height: 0 }}
    className="pt-3 pb-1 px-2 flex flex-wrap gap-2"
  >
    {children}
  </motion.div>
);

const OptionChip = ({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
      selected
        ? "bg-primary text-primary-foreground"
        : "bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground"
    }`}
  >
    {label}
  </button>
);

const FilterButton = ({
  icon,
  label,
  placeholder,
  active,
  selected,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  placeholder: string;
  active: boolean;
  selected?: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 md:gap-1.5 lg:gap-3 px-3 md:px-2 lg:px-4 py-3 md:py-2 lg:py-3 rounded-xl flex-1 text-left transition-colors ${
      active ? "bg-secondary" : "hover:bg-secondary/50"
    }`}
  >
    <span className={`${selected ? "text-primary" : "text-muted-foreground"} shrink-0`}>{icon}</span>
    <div className="min-w-0">
      <p className="text-xs font-semibold text-foreground md:text-[10px] lg:text-xs">{label}</p>
      <p className={`text-sm md:text-xs lg:text-sm truncate ${selected ? "text-foreground font-medium" : "text-muted-foreground"}`}>
        {placeholder}
      </p>
    </div>
    <ChevronDown className={`w-3.5 h-3.5 md:w-3 md:h-3 lg:w-3.5 lg:h-3.5 text-muted-foreground ml-auto transition-transform shrink-0 ${active ? "rotate-180" : ""}`} />
  </button>
);

export default SearchBar;
