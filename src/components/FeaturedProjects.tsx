import { motion } from "framer-motion";
import { MapPin, TrendingUp, Building, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useFeaturedProjects, type Project, type ProjectFilters } from "@/hooks/useProjects";

import project1 from "@/assets/project-1.jpg";
import project2 from "@/assets/project-2.jpg";
import project3 from "@/assets/project-3.jpg";

const fallbackImages = [project1, project2, project3];

const statusLabels: Record<string, string> = {
  preventa: "Preventa",
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

const statusColor: Record<string, string> = {
  preventa: "bg-muted text-muted-foreground",
  en_pozo: "bg-accent text-accent-foreground",
  en_construccion: "bg-primary text-primary-foreground",
  entrega_inmediata: "bg-secondary text-secondary-foreground",
};

interface FeaturedProjectsProps {
  filters?: ProjectFilters;
}

const ProjectCard = ({ project, index }: { project: Project; index: number }) => (
  <Link to={`/proyecto/${project.slug}`}>
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="group bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-shadow duration-300"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={project.cover_image_url || fallbackImages[index % fallbackImages.length]}
          alt={project.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute top-4 left-4 flex gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor[project.status] || "bg-secondary text-secondary-foreground"}`}>
            {statusLabels[project.status]}
          </span>
          {project.featured && (
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-accent text-accent-foreground">
              Destacado
            </span>
          )}
        </div>
      </div>

      <div className="p-5 md:p-6">
        <div className="flex items-center gap-1.5 text-muted-foreground text-sm mb-2">
          <MapPin className="w-3.5 h-3.5" />
          <span>{project.location_city}{project.location_zone ? `, ${project.location_zone}` : ""}</span>
        </div>

        <h3 className="font-display text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
          {project.title}
        </h3>

        <div className="flex items-center justify-between border-t border-border pt-4">
          <div>
            <p className="text-xs text-muted-foreground">Desde</p>
            <p className="text-lg font-bold text-foreground">
              {project.price_currency} {project.price_from?.toLocaleString()}
            </p>
          </div>
          {project.estimated_yield && (
            <div className="flex items-center gap-1 text-primary">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-semibold">Rent. {project.estimated_yield}%</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
          <Building className="w-3.5 h-3.5" />
          <span>{typeLabels[project.project_type]}</span>
          {project.delivery_date && (
            <>
              <span className="text-border">•</span>
              <span>Entrega: {project.delivery_date}</span>
            </>
          )}
        </div>
      </div>
    </motion.article>
  </Link>
);

const FeaturedProjects = ({ filters }: FeaturedProjectsProps) => {
  const { data: projects, isLoading } = useFeaturedProjects(filters);
  const hasFilters = filters && Object.values(filters).some((v) => v != null && v !== "");

  return (
    <section id="proyectos" className="py-20 md:py-28 bg-background">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="text-accent font-semibold text-sm uppercase tracking-wider">
            {hasFilters ? "Resultados de búsqueda" : "Selección curada"}
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">
            {hasFilters ? "Proyectos Encontrados" : "Proyectos Destacados"}
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            {hasFilters
              ? `${projects?.length || 0} proyecto${(projects?.length || 0) !== 1 ? "s" : ""} coinciden con tu búsqueda.`
              : "Desarrollos verificados con la mejor relación inversión-rentabilidad del mercado paraguayo."}
          </p>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : projects && projects.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {projects.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">No se encontraron proyectos con los filtros seleccionados.</p>
          </div>
        )}

        {!hasFilters && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <button className="bg-primary text-primary-foreground px-8 py-3.5 rounded-xl font-medium hover:opacity-90 transition-opacity text-base">
              Explorar todos los proyectos
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProjects;
