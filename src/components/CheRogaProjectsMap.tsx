import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Map } from "lucide-react";
import { useTranslation } from "react-i18next";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useCurrency } from "@/hooks/useCurrency";
import { convertCurrency, formatCurrency } from "@/components/CurrencyToggle";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({ iconRetinaUrl: markerIcon2x, iconUrl: markerIcon, shadowUrl: markerShadow });

const formatGs = (n: number) =>
  new Intl.NumberFormat("es-PY", { style: "currency", currency: "PYG", maximumFractionDigits: 0 }).format(n);

interface ProjectForMap {
  id: string;
  title: string;
  slug: string;
  latitude: number | null;
  longitude: number | null;
  location_city: string;
  location_zone: string | null;
  price_from: number | null;
  price_currency: string;
  cuota_estimativa: number | null;
  cover_image_url: string | null;
}

interface Props {
  projects: ProjectForMap[];
}

const PARAGUAY_CENTER: [number, number] = [-23.5, -58.0];

const CheRogaProjectsMap = ({ projects }: Props) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const { t } = useTranslation();
  const { displayCurrency } = useCurrency();

  const fmtPrice = (price: number, from: string) =>
    formatCurrency(convertCurrency(price, from, displayCurrency), displayCurrency);

  useEffect(() => {
    if (!mapRef.current) return;

    if (mapInstance.current) {
      mapInstance.current.remove();
      mapInstance.current = null;
    }

    const geoProjects = projects.filter((p) => p.latitude && p.longitude);

    const map = L.map(mapRef.current).setView(PARAGUAY_CENTER, 7);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    const bounds: L.LatLngExpression[] = [];

    geoProjects.forEach((project) => {
      const lat = project.latitude!;
      const lng = project.longitude!;
      bounds.push([lat, lng]);

      const priceHtml = project.price_from
        ? `<div style="font-size:14px;font-weight:700;color:#16a34a;">${fmtPrice(project.price_from, project.price_currency)}</div>`
        : "";

      const cuotaHtml = project.cuota_estimativa
        ? `<div style="font-size:12px;color:#666;">${t("cheRoga.installmentFrom")} ${formatGs(project.cuota_estimativa)}${t("cheRoga.perMonth")}</div>`
        : "";

      const popupContent = `
        <div style="min-width:180px;font-family:system-ui,sans-serif;">
          ${project.cover_image_url ? `<img src="${project.cover_image_url}" alt="${project.title}" style="width:100%;height:100px;object-fit:cover;border-radius:6px;margin-bottom:8px;" />` : ""}
          <div style="font-size:15px;font-weight:600;margin-bottom:4px;">${project.title}</div>
          <div style="font-size:12px;color:#888;margin-bottom:6px;">${project.location_city}${project.location_zone ? `, ${project.location_zone}` : ""}</div>
          ${priceHtml}
          ${cuotaHtml}
          <a href="/proyecto/${project.slug}" style="display:inline-block;margin-top:8px;font-size:12px;color:#2563eb;text-decoration:none;font-weight:500;">${t("cheRoga.mapViewProject")} →</a>
        </div>
      `;

      L.marker([lat, lng]).addTo(map).bindPopup(popupContent, { maxWidth: 260 });
    });

    if (bounds.length > 1) {
      map.fitBounds(bounds as L.LatLngBoundsExpression, { padding: [40, 40] });
    } else if (bounds.length === 1) {
      map.setView(bounds[0] as L.LatLngExpression, 13);
    }

    mapInstance.current = map;

    return () => {
      map.remove();
      mapInstance.current = null;
    };
  }, [projects, displayCurrency]);

  const geoCount = projects.filter((p) => p.latitude && p.longitude).length;

  if (geoCount === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-card rounded-2xl p-6 md:p-8 shadow-card"
    >
      <h3 className="font-display text-xl font-semibold text-foreground mb-2 flex items-center gap-2">
        <Map className="w-5 h-5 text-primary" /> {t("cheRoga.mapTitle")}
      </h3>
      <p className="text-sm text-muted-foreground mb-4">
        {t("cheRoga.mapSubtitle", { count: geoCount })}
      </p>
      <div ref={mapRef} className="w-full h-[400px] md:h-[500px] rounded-xl overflow-hidden border border-border z-0" />
    </motion.div>
  );
};

export default CheRogaProjectsMap;
