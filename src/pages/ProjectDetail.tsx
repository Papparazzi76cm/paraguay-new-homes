import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  MapPin,
  Building,
  TrendingUp,
  CreditCard,
  CalendarDays,
  Send,
  FileText,
  Loader2,
} from "lucide-react";

import { useProjectBySlug, useProjectImages } from "@/hooks/useProjectDetail";
import ProjectGallery from "@/components/ProjectGallery";
import ConstructionTimeline from "@/components/ConstructionTimeline";
import AmenitiesList from "@/components/AmenitiesList";
import YieldSimulator from "@/components/YieldSimulator";
import ContactDialog from "@/components/ContactDialog";
import Footer from "@/components/Footer";

const statusLabels: Record<string, string> = {
  en_pozo: "En Pozo",
  en_construccion: "En Construcción",
  entrega_inmediata: "Entrega Inmediata",
};

const typeLabels: Record<string, string> = {
  departamentos: "Departamentos",
  casas: "Casas",
  barrio_cerrado: "Barrio Cerrado",
  mixto: "Mixto",
};

const ProjectDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: project, isLoading, error } = useProjectBySlug(slug || "");
  const { data: images } = useProjectImages(project?.id || "");
  const [contactOpen, setContactOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
        <h1 className="font-display text-2xl font-bold text-foreground">Proyecto no encontrado</h1>
        <Link to="/" className="text-primary font-medium hover:underline flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Volver al inicio
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Top bar */}
      <nav className="bg-card border-b border-border sticky top-0 z-40">
        <div className="container flex items-center justify-between py-3">
          <Link to="/" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-display font-bold text-sm">P</span>
              </div>
              <span className="font-display font-bold text-base hidden sm:inline">ProyectPY</span>
            </div>
          </Link>
          <button
            onClick={() => setContactOpen(true)}
            className="bg-primary text-primary-foreground px-5 py-2 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <Send className="w-4 h-4" /> Contactar
          </button>
        </div>
      </nav>

      <div className="container py-6 md:py-10">
        {/* Gallery */}
        <ProjectGallery images={images} coverUrl={project.cover_image_url} title={project.title} />

        {/* Header info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 mb-10"
        >
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary">
              {statusLabels[project.status]}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-secondary text-secondary-foreground">
              {typeLabels[project.project_type]}
            </span>
            {project.financing_available && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-accent/15 text-accent">
                Financiación disponible
              </span>
            )}
          </div>

          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
            {project.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-muted-foreground text-sm">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4" />
              {project.location_city}
              {project.location_zone ? `, ${project.location_zone}` : ""}
            </span>
            {project.developer_name && (
              <span className="flex items-center gap-1.5">
                <Building className="w-4 h-4" />
                {project.developer_name}
              </span>
            )}
          </div>

          {/* Key metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
            {project.price_from && (
              <MetricCard
                icon={CreditCard}
                label="Desde"
                value={`${project.price_currency} ${project.price_from.toLocaleString()}`}
              />
            )}
            {project.estimated_yield && (
              <MetricCard icon={TrendingUp} label="Rentabilidad est." value={`${project.estimated_yield}% anual`} />
            )}
            {project.delivery_date && (
              <MetricCard icon={CalendarDays} label="Entrega" value={project.delivery_date} />
            )}
            <MetricCard icon={FileText} label="Tipo" value={typeLabels[project.project_type]} />
          </div>
        </motion.div>

        {/* Content grid */}
        <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
          {/* Left column – 2/3 */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            {project.description && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-card rounded-2xl p-6 md:p-8 shadow-card"
              >
                <h3 className="font-display text-xl font-semibold text-foreground mb-4">
                  Sobre el Proyecto
                </h3>
                <p className="text-muted-foreground leading-relaxed">{project.description}</p>
              </motion.div>
            )}

            {/* Amenities */}
            {project.amenities && project.amenities.length > 0 && (
              <AmenitiesList amenities={project.amenities} />
            )}

            {/* Timeline */}
            <ConstructionTimeline status={project.status} deliveryDate={project.delivery_date} />
          </div>

          {/* Right column – 1/3 */}
          <div className="space-y-6">
            {/* Yield Simulator */}
            {project.price_from && project.estimated_yield && (
              <YieldSimulator
                priceFrom={project.price_from}
                estimatedYield={project.estimated_yield}
                currency={project.price_currency}
              />
            )}

            {/* Sticky contact card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-card rounded-2xl p-6 shadow-card lg:sticky lg:top-20"
            >
              <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                ¿Te interesa este proyecto?
              </h3>
              <p className="text-sm text-muted-foreground mb-5">
                Recibí información detallada, planos y condiciones de financiación.
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => setContactOpen(true)}
                  className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" /> Solicitar información
                </button>
                <button
                  onClick={() => setContactOpen(true)}
                  className="w-full bg-secondary text-secondary-foreground py-3 rounded-xl font-medium hover:bg-secondary/80 transition-colors flex items-center justify-center gap-2"
                >
                  <FileText className="w-4 h-4" /> Descargar dossier
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />

      <ContactDialog
        open={contactOpen}
        onClose={() => setContactOpen(false)}
        projectId={project.id}
        projectTitle={project.title}
        leadType="project_inquiry"
      />
    </main>
  );
};

const MetricCard = ({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) => (
  <div className="bg-card rounded-xl p-4 shadow-card">
    <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
      <Icon className="w-4 h-4" />
      <span className="text-xs">{label}</span>
    </div>
    <p className="font-bold text-foreground text-sm">{value}</p>
  </div>
);

export default ProjectDetail;
