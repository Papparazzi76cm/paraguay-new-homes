import { useState } from "react";
import { Search, MapPin, Building2, Banknote, CalendarDays, ChevronDown, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useProjectCities, type ProjectFilters } from "@/hooks/useProjects";

const typeOptions = [
  { label: "Departamentos", value: "departamentos" },
  { label: "Casas", value: "casas" },
  { label: "Barrio Cerrado", value: "barrio_cerrado" },
  { label: "Mixto", value: "mixto" },
];

const statusOptions = [
  { label: "En Pozo", value: "en_pozo" },
  { label: "En Construcción", value: "en_construccion" },
  { label: "Entrega Inmediata", value: "entrega_inmediata" },
];

const priceRanges = [
  { label: "0 - 50.000$", min: 0, max: 50000 },
  { label: "50.000 - 100.000$", min: 50000, max: 100000 },
  { label: "100.000 - 250.000$", min: 100000, max: 250000 },
  { label: "250.000 - 500.000$", min: 250000, max: 500000 },
  { label: "+ 500.000$", min: 500000, max: undefined },
];

interface SearchBarProps {
  filters: ProjectFilters;
  onFiltersChange: (filters: ProjectFilters) => void;
}

const SearchBar = ({ filters, onFiltersChange }: SearchBarProps) => {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const { data: cities } = useProjectCities();

  const selectedCity = filters.city || null;
  const selectedType = filters.type || null;
  const selectedStatus = filters.status || null;
  const selectedPriceLabel = priceRanges.find(
    (r) => r.min === filters.priceMin && r.max === filters.priceMax
  )?.label || null;

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

  const hasAnyFilter = selectedCity || selectedType || selectedStatus || selectedPriceLabel;

  const clearAll = () => {
    onFiltersChange({});
  };

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
            label="Ciudad"
            placeholder={selectedCity || "¿Dónde buscas?"}
            active={activeFilter === "ciudad"}
            selected={!!selectedCity}
            onClick={() => setActiveFilter(activeFilter === "ciudad" ? null : "ciudad")}
          />
          <div className="hidden md:block w-px h-8 bg-border" />
          <FilterButton
            icon={<Building2 className="w-4 h-4" />}
            label="Tipo"
            placeholder={typeOptions.find((t) => t.value === selectedType)?.label || "Tipo de proyecto"}
            active={activeFilter === "tipo"}
            selected={!!selectedType}
            onClick={() => setActiveFilter(activeFilter === "tipo" ? null : "tipo")}
          />
          <div className="hidden md:block w-px h-8 bg-border" />
          <FilterButton
            icon={<Banknote className="w-4 h-4" />}
            label="Precio"
            placeholder={selectedPriceLabel || "Rango de precio"}
            active={activeFilter === "precio"}
            selected={!!selectedPriceLabel}
            onClick={() => setActiveFilter(activeFilter === "precio" ? null : "precio")}
          />
          <div className="hidden md:block w-px h-8 bg-border" />
          <FilterButton
            icon={<CalendarDays className="w-4 h-4" />}
            label="Estado"
            placeholder={statusOptions.find((s) => s.value === selectedStatus)?.label || "Etapa de obra"}
            active={activeFilter === "estado"}
            selected={!!selectedStatus}
            onClick={() => setActiveFilter(activeFilter === "estado" ? null : "estado")}
          />
          {hasAnyFilter ? (
            <button
              onClick={clearAll}
              className="flex items-center justify-center gap-2 bg-secondary text-secondary-foreground px-5 py-3 rounded-xl font-medium hover:bg-secondary/80 transition-colors shrink-0"
            >
              <X className="w-4 h-4" />
              <span className="md:hidden">Limpiar</span>
            </button>
          ) : (
            <button className="flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-medium hover:opacity-90 transition-opacity shrink-0">
              <Search className="w-4 h-4" />
              <span className="md:hidden">Buscar</span>
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
              {typeOptions.map((opt) => (
                <OptionChip key={opt.value} label={opt.label} selected={selectedType === opt.value} onClick={() => handleTypeSelect(opt.value)} />
              ))}
            </DropdownPanel>
          )}
          {activeFilter === "precio" && (
            <DropdownPanel key="precio">
              {priceRanges.map((range) => (
                <OptionChip
                  key={range.label}
                  label={range.label}
                  selected={filters.priceMin === range.min && filters.priceMax === range.max}
                  onClick={() => handlePriceSelect(range)}
                />
              ))}
            </DropdownPanel>
          )}
          {activeFilter === "estado" && (
            <DropdownPanel key="estado">
              {statusOptions.map((opt) => (
                <OptionChip key={opt.value} label={opt.label} selected={selectedStatus === opt.value} onClick={() => handleStatusSelect(opt.value)} />
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
    className={`flex items-center gap-3 px-4 py-3 rounded-xl flex-1 text-left transition-colors ${
      active ? "bg-secondary" : "hover:bg-secondary/50"
    }`}
  >
    <span className={selected ? "text-primary" : "text-muted-foreground"}>{icon}</span>
    <div className="min-w-0">
      <p className="text-xs font-semibold text-foreground">{label}</p>
      <p className={`text-sm truncate ${selected ? "text-foreground font-medium" : "text-muted-foreground"}`}>
        {placeholder}
      </p>
    </div>
    <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground ml-auto transition-transform ${active ? "rotate-180" : ""}`} />
  </button>
);

export default SearchBar;
