import { motion } from "framer-motion";
import {
  Waves,
  Dumbbell,
  ShieldCheck,
  Car,
  PartyPopper,
  Palmtree,
  Wifi,
  Building2,
  TreePine,
  Footprints,
  LandPlot,
  Flame,
} from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  Piscina: Waves,
  Gimnasio: Dumbbell,
  "Seguridad 24hs": ShieldCheck,
  Estacionamiento: Car,
  "Salón de eventos": PartyPopper,
  Rooftop: Palmtree,
  Coworking: Wifi,
  "Club house": Building2,
  "Cancha de tenis": LandPlot,
  "Laguna artificial": Waves,
  Senderos: Footprints,
  "Portería 24hs": ShieldCheck,
  Parrilla: Flame,
};

const FallbackIcon = TreePine;

interface AmenitiesListProps {
  amenities: string[];
}

const AmenitiesList = ({ amenities }: AmenitiesListProps) => {
  if (!amenities.length) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-card rounded-2xl p-6 md:p-8 shadow-card"
    >
      <h3 className="font-display text-xl font-semibold text-foreground mb-6">
        Amenities y Servicios
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {amenities.map((amenity) => {
          const Icon = iconMap[amenity] || FallbackIcon;
          return (
            <div
              key={amenity}
              className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50"
            >
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Icon className="w-4.5 h-4.5 text-primary" />
              </div>
              <span className="text-sm font-medium text-foreground">{amenity}</span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default AmenitiesList;
