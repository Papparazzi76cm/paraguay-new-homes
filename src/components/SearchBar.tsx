import { useState } from "react";
import { Search, MapPin, Building2, Banknote, CalendarDays, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";

const filterOptions = {
  ciudad: ["Asunción", "Luque", "San Lorenzo", "Lambaré", "Encarnación", "Ciudad del Este"],
  tipo: ["Departamentos", "Casas", "Barrio Cerrado", "Mixto"],
  estado: ["En Pozo", "En Construcción", "Entrega Inmediata"],
};

const SearchBar = () => {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.6 }}
      className="w-full max-w-4xl mx-auto"
    >
      <div className="bg-card rounded-2xl shadow-elevated p-2 md:p-3">
        <div className="flex flex-col md:flex-row md:items-center gap-2">
          {/* Ciudad */}
          <FilterButton
            icon={<MapPin className="w-4 h-4" />}
            label="Ciudad"
            placeholder="¿Dónde buscas?"
            active={activeFilter === "ciudad"}
            onClick={() => setActiveFilter(activeFilter === "ciudad" ? null : "ciudad")}
          />
          
          <div className="hidden md:block w-px h-8 bg-border" />

          {/* Tipo */}
          <FilterButton
            icon={<Building2 className="w-4 h-4" />}
            label="Tipo"
            placeholder="Tipo de proyecto"
            active={activeFilter === "tipo"}
            onClick={() => setActiveFilter(activeFilter === "tipo" ? null : "tipo")}
          />

          <div className="hidden md:block w-px h-8 bg-border" />

          {/* Precio */}
          <FilterButton
            icon={<Banknote className="w-4 h-4" />}
            label="Precio"
            placeholder="Rango de precio"
            active={activeFilter === "precio"}
            onClick={() => setActiveFilter(activeFilter === "precio" ? null : "precio")}
          />

          <div className="hidden md:block w-px h-8 bg-border" />

          {/* Estado */}
          <FilterButton
            icon={<CalendarDays className="w-4 h-4" />}
            label="Estado"
            placeholder="Etapa de obra"
            active={activeFilter === "estado"}
            onClick={() => setActiveFilter(activeFilter === "estado" ? null : "estado")}
          />

          {/* Search Button */}
          <button className="flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-medium hover:opacity-90 transition-opacity shrink-0">
            <Search className="w-4 h-4" />
            <span className="md:hidden">Buscar</span>
          </button>
        </div>

        {/* Dropdown */}
        {activeFilter && filterOptions[activeFilter as keyof typeof filterOptions] && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="pt-3 pb-1 px-2 flex flex-wrap gap-2"
          >
            {filterOptions[activeFilter as keyof typeof filterOptions].map((option) => (
              <button
                key={option}
                className="px-4 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                {option}
              </button>
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

const FilterButton = ({
  icon,
  label,
  placeholder,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  placeholder: string;
  active: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-3 px-4 py-3 rounded-xl flex-1 text-left transition-colors ${
      active ? "bg-secondary" : "hover:bg-secondary/50"
    }`}
  >
    <span className="text-muted-foreground">{icon}</span>
    <div className="min-w-0">
      <p className="text-xs font-semibold text-foreground">{label}</p>
      <p className="text-sm text-muted-foreground truncate">{placeholder}</p>
    </div>
    <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground ml-auto transition-transform ${active ? "rotate-180" : ""}`} />
  </button>
);

export default SearchBar;
