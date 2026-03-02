import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default marker icon issue in bundlers
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

interface ProjectMapProps {
  latitude: number;
  longitude: number;
  title: string;
  city?: string;
}

const ProjectMap = ({ latitude, longitude, title, city }: ProjectMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    const map = L.map(mapRef.current).setView([latitude, longitude], 15);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    L.marker([latitude, longitude])
      .addTo(map)
      .bindPopup(`<strong>${title}</strong>${city ? `<br/>${city}` : ""}`);

    mapInstance.current = map;

    return () => {
      map.remove();
      mapInstance.current = null;
    };
  }, [latitude, longitude, title, city]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-card rounded-2xl p-6 md:p-8 shadow-card"
    >
      <h3 className="font-display text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
        <MapPin className="w-5 h-5 text-primary" />
        Ubicación
      </h3>
      <div
        ref={mapRef}
        className="w-full h-[300px] md:h-[400px] rounded-xl overflow-hidden border border-border z-0"
      />
    </motion.div>
  );
};

export default ProjectMap;
