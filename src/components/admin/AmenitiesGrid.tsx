import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  Waves, Dumbbell, Car, TreePine, Flame, Users, Baby, Dog,
  Gamepad2, Laptop, ShieldCheck, Zap, Building2, Bike,
  UtensilsCrossed, Wine, Sofa, Clapperboard, Bath, Sparkles,
  Droplets, Sun, Lock, Wifi, Wind, Lightbulb, Footprints,
  SquareParking, Shirt, Heart, Music, BookOpen, Palette,
  Tent, Mountain, Sailboat, Globe, Plus, Warehouse, Fence,
  Flower2, Landmark, CircleDot, Heater, AirVent, BriefcaseBusiness
} from "lucide-react";

export interface AmenityOption {
  value: string;
  label: string;
  icon: React.ElementType;
  category: string;
}

const AMENITY_CATALOG: AmenityOption[] = [
  // Agua & Recreación
  { value: "Piscina", label: "Piscina", icon: Waves, category: "Recreación" },
  { value: "Piscina climatizada", label: "Piscina climatizada", icon: Waves, category: "Recreación" },
  { value: "Infinity Pool", label: "Infinity Pool", icon: Waves, category: "Recreación" },
  { value: "Jacuzzi", label: "Jacuzzi", icon: Droplets, category: "Recreación" },
  { value: "Sauna", label: "Sauna", icon: Heater, category: "Recreación" },
  { value: "Spa", label: "Spa", icon: Sparkles, category: "Recreación" },
  { value: "Crystal Lagoons®", label: "Crystal Lagoons®", icon: Waves, category: "Recreación" },

  // Fitness & Deporte
  { value: "Gimnasio", label: "Gimnasio", icon: Dumbbell, category: "Deporte" },
  { value: "Gym exterior", label: "Gym exterior", icon: Dumbbell, category: "Deporte" },
  { value: "Cancha de pádel", label: "Cancha de pádel", icon: CircleDot, category: "Deporte" },
  { value: "Cancha de tenis", label: "Cancha de tenis", icon: CircleDot, category: "Deporte" },
  { value: "Cancha fútbol 5", label: "Cancha fútbol 5", icon: CircleDot, category: "Deporte" },
  { value: "Cancha básquet", label: "Cancha básquet", icon: CircleDot, category: "Deporte" },
  { value: "Yoga deck", label: "Yoga deck", icon: Heart, category: "Deporte" },
  { value: "Running track", label: "Running track", icon: Footprints, category: "Deporte" },

  // Social
  { value: "Quincho", label: "Quincho", icon: Flame, category: "Social" },
  { value: "Parrilla", label: "Parrilla", icon: Flame, category: "Social" },
  { value: "Salón de eventos", label: "Salón de eventos", icon: Users, category: "Social" },
  { value: "SUM", label: "SUM", icon: Users, category: "Social" },
  { value: "Club House", label: "Club House", icon: Landmark, category: "Social" },
  { value: "Rooftop", label: "Rooftop", icon: Sun, category: "Social" },
  { value: "Terraza", label: "Terraza", icon: Sun, category: "Social" },
  { value: "Fire pit", label: "Fire pit", icon: Flame, category: "Social" },
  { value: "Bar", label: "Bar", icon: Wine, category: "Social" },
  { value: "Anfiteatro", label: "Anfiteatro", icon: Music, category: "Social" },

  // Trabajo
  { value: "Coworking", label: "Coworking", icon: Laptop, category: "Trabajo" },
  { value: "Business Center", label: "Business Center", icon: BriefcaseBusiness, category: "Trabajo" },
  { value: "Sala de reuniones", label: "Sala de reuniones", icon: Users, category: "Trabajo" },

  // Niños & Familia
  { value: "Área Kids", label: "Área Kids", icon: Baby, category: "Familia" },
  { value: "Parque infantil", label: "Parque infantil", icon: Baby, category: "Familia" },
  { value: "Gameroom", label: "Gameroom", icon: Gamepad2, category: "Familia" },
  { value: "Cine", label: "Cine", icon: Clapperboard, category: "Familia" },
  { value: "Pet park", label: "Pet park", icon: Dog, category: "Familia" },

  // Gastronomía
  { value: "Cocina interactiva", label: "Cocina interactiva", icon: UtensilsCrossed, category: "Gastronomía" },
  { value: "Cafetería", label: "Cafetería", icon: UtensilsCrossed, category: "Gastronomía" },
  { value: "Minimarket", label: "Minimarket", icon: Building2, category: "Gastronomía" },

  // Servicios
  { value: "Lobby", label: "Lobby", icon: Sofa, category: "Servicios" },
  { value: "Front Desk", label: "Front Desk", icon: Sofa, category: "Servicios" },
  { value: "Ascensores", label: "Ascensores", icon: Building2, category: "Servicios" },
  { value: "Lavandería", label: "Lavandería", icon: Shirt, category: "Servicios" },
  { value: "Bauleras", label: "Bauleras", icon: Warehouse, category: "Servicios" },
  { value: "Cocheras", label: "Cocheras", icon: Car, category: "Servicios" },
  { value: "Bicicleteros", label: "Bicicleteros", icon: Bike, category: "Servicios" },
  { value: "Laundry", label: "Laundry", icon: Shirt, category: "Servicios" },

  // Seguridad & Tecnología
  { value: "Seguridad 24hs", label: "Seguridad 24hs", icon: ShieldCheck, category: "Seguridad" },
  { value: "CCTV", label: "CCTV", icon: ShieldCheck, category: "Seguridad" },
  { value: "Cerraduras inteligentes", label: "Cerraduras inteligentes", icon: Lock, category: "Seguridad" },
  { value: "Domótica", label: "Domótica", icon: Wifi, category: "Seguridad" },
  { value: "Generador eléctrico", label: "Generador eléctrico", icon: Zap, category: "Seguridad" },
  { value: "Climatización", label: "Climatización", icon: AirVent, category: "Seguridad" },
  { value: "Paneles solares", label: "Paneles solares", icon: Lightbulb, category: "Seguridad" },

  // Exteriores
  { value: "Jardines", label: "Jardines", icon: Flower2, category: "Exteriores" },
  { value: "Espacios verdes", label: "Espacios verdes", icon: TreePine, category: "Exteriores" },
  { value: "Deck", label: "Deck", icon: Tent, category: "Exteriores" },
  { value: "Solarium", label: "Solarium", icon: Sun, category: "Exteriores" },
  { value: "Senderos", label: "Senderos", icon: Footprints, category: "Exteriores" },
  { value: "Marina", label: "Marina", icon: Sailboat, category: "Exteriores" },
  { value: "Helipuerto", label: "Helipuerto", icon: Globe, category: "Exteriores" },
  { value: "Cercado perimetral", label: "Cercado perimetral", icon: Fence, category: "Exteriores" },
];

const CATEGORIES = [...new Set(AMENITY_CATALOG.map((a) => a.category))];

interface AmenitiesGridProps {
  selected: string[];
  onChange: (amenities: string[]) => void;
}

const AmenitiesGrid = ({ selected, onChange }: AmenitiesGridProps) => {
  const [customAmenity, setCustomAmenity] = useState("");

  // Include any selected amenities not in catalog as custom
  const customSelected = selected.filter(
    (s) => !AMENITY_CATALOG.some((a) => a.value === s)
  );

  const toggle = (value: string) => {
    onChange(
      selected.includes(value)
        ? selected.filter((s) => s !== value)
        : [...selected, value]
    );
  };

  const addCustom = () => {
    const trimmed = customAmenity.trim();
    if (trimmed && !selected.includes(trimmed)) {
      onChange([...selected, trimmed]);
      setCustomAmenity("");
    }
  };

  return (
    <div className="space-y-4">
      {CATEGORIES.map((cat) => {
        const items = AMENITY_CATALOG.filter((a) => a.category === cat);
        return (
          <div key={cat}>
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">{cat}</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {items.map((amenity) => {
                const isChecked = selected.includes(amenity.value);
                const Icon = amenity.icon;
                return (
                  <label
                    key={amenity.value}
                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border cursor-pointer transition-all ${
                      isChecked
                        ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                        : "border-border bg-muted/20 hover:bg-muted/40"
                    }`}
                  >
                    <Checkbox
                      checked={isChecked}
                      onCheckedChange={() => toggle(amenity.value)}
                      className="sr-only"
                    />
                    <Icon className={`w-4 h-4 shrink-0 ${isChecked ? "text-primary" : "text-muted-foreground"}`} />
                    <span className={`text-xs leading-tight ${isChecked ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                      {amenity.label}
                    </span>
                    {isChecked && (
                      <div className="ml-auto w-2 h-2 rounded-full bg-primary shrink-0" />
                    )}
                  </label>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Custom amenities */}
      {customSelected.length > 0 && (
        <div>
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Personalizados</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {customSelected.map((custom) => (
              <label
                key={custom}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl border border-primary bg-primary/5 ring-1 ring-primary/20 cursor-pointer transition-all"
              >
                <Palette className="w-4 h-4 shrink-0 text-primary" />
                <span className="text-xs leading-tight text-foreground font-medium">{custom}</span>
                <button
                  type="button"
                  onClick={(e) => { e.preventDefault(); toggle(custom); }}
                  className="ml-auto text-muted-foreground hover:text-destructive"
                >
                  ×
                </button>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Add custom */}
      <div className="flex items-center gap-2 pt-1">
        <Input
          placeholder="Agregar amenity personalizado..."
          value={customAmenity}
          onChange={(e) => setCustomAmenity(e.target.value)}
          className="max-w-xs text-sm"
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addCustom(); } }}
        />
        <Button type="button" size="sm" variant="outline" onClick={addCustom} disabled={!customAmenity.trim()}>
          <Plus className="w-3.5 h-3.5 mr-1" /> Agregar
        </Button>
      </div>

      <p className="text-xs text-muted-foreground">
        {selected.length} amenities seleccionados
      </p>
    </div>
  );
};

export default AmenitiesGrid;
