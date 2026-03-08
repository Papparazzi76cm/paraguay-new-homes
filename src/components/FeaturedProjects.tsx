import { motion } from "framer-motion";
import { MapPin, TrendingUp, Building, Loader2, Home } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useFeaturedProjects, type Project, type ProjectFilters } from "@/hooks/useProjects";
import { useCurrency } from "@/hooks/useCurrency";
import { convertCurrency, formatCurrency } from "./CurrencyToggle";
import ProjectCardActions from "./ProjectCardActions";
import { getDeveloperByName } from "@/data/developers";

import project1 from "@/assets/project-1.jpg";
import project2 from "@/assets/project-2.jpg";
import project3 from "@/assets/project-3.jpg";

const fallbackImages = [project1, project2, project3];

const statusColor: Record<string, string> = {
  preventa: "bg-muted text-muted-foreground",
  en_pozo: "bg-accent text-accent-foreground",
  en_construccion: "bg-primary text-primary-foreground",
  entrega_inmediata: "bg-secondary text-secondary-foreground",
};

interface FeaturedProjectsProps {
  filters?: ProjectFilters;
  showExploreButton?: boolean;
}

const ProjectCard = ({ project, index }: { project: Project; index: number }) => {
  const { t } = useTranslation();
  const { displayCurrency } = useCurrency();
  const fmtPrice = (price: number, fromCurrency: string) =>
    formatCurrency(convertCurrency(price, fromCurrency, displayCurrency), displayCurrency);
  return (
    <Link to={`/proyecto/${project.slug}`}>
      <motion.article
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.1, duration: 0.5 }}
        className="group bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-shadow duration-300"
      >
        <div className="relative aspect-[4/3] overflow-hidden">
          <img src={project.cover_image_url || fallbackImages[index % fallbackImages.length]} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
          <ProjectCardActions projectId={project.id} projectTitle={project.title} projectSlug={project.slug} />
          <div className="absolute top-4 left-4 flex gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor[project.status] || "bg-secondary text-secondary-foreground"}`}>
              {t(`projectStatus.${project.status}`)}
            </span>
            {project.featured && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-accent text-accent-foreground">{t("featured.featured")}</span>
            )}
            {(project as any).programa_financiacion === "che_roga_pora" && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary text-primary-foreground flex items-center gap-1">
                <Home className="w-3 h-3" /> Che Róga Porã
              </span>
            )}
          </div>
        </div>

        <div className="p-5 md:p-6">
          <div className="flex items-center gap-1.5 text-muted-foreground text-sm mb-2">
            <MapPin className="w-3.5 h-3.5" />
            <span>{project.location_city}{project.location_zone ? `, ${project.location_zone}` : ""}</span>
          </div>

          <h3 className="font-display text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">{project.title}</h3>

          {project.developer_name && (() => {
            const dev = getDeveloperByName(project.developer_name);
            return (
              <Link
                to={dev ? `/promotor/${dev.slug}` : "#"}
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-2 mb-3 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                {dev?.logo && (
                  <img src={dev.logo} alt={dev.name} className="w-5 h-5 rounded object-contain" />
                )}
                <span>{project.developer_name}</span>
              </Link>
            );
          })()}

          <div className="flex items-center justify-between border-t border-border pt-4">
            <div>
              <p className="text-xs text-muted-foreground">{t("featured.from")}</p>
              <p className="text-lg font-bold text-foreground">{project.price_from ? fmtPrice(project.price_from, project.price_currency) : "—"}</p>
            </div>
            {project.estimated_yield && (
              <div className="flex items-center gap-1 text-primary">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm font-semibold">{t("featured.yield", { value: project.estimated_yield })}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
            <Building className="w-3.5 h-3.5" />
            <span>{t(`projectTypes.${project.project_type}`)}</span>
            {project.delivery_date && (
              <>
                <span className="text-border">•</span>
                <span>{t("featured.delivery", { date: project.delivery_date })}</span>
              </>
            )}
          </div>
        </div>
      </motion.article>
    </Link>
  );
};

const FeaturedProjects = ({ filters, showExploreButton = true }: FeaturedProjectsProps) => {
  const { data: projects, isLoading } = useFeaturedProjects(filters);
  const hasFilters = filters && Object.values(filters).some((v) => v != null && v !== "");
  const { t } = useTranslation();

  // On home page (showExploreButton=true), show max 6; on /proyectos show all 15
  const displayProjects = showExploreButton ? projects?.slice(0, 6) : projects;

  return (
    <section id="proyectos" className="py-20 md:py-28 bg-background" aria-label="Proyectos de obra nueva destacados en Paraguay">
      <div className="container">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
          <span className="text-accent font-semibold text-sm uppercase tracking-wider">
            {hasFilters ? t("featured.searchResults") : t("featured.curated")}
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">
            {hasFilters ? t("featured.foundTitle") : t("featured.featuredTitle")}
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            {hasFilters
              ? t("featured.foundDesc", { count: projects?.length || 0 })
              : t("featured.featuredDesc")}
          </p>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : displayProjects && displayProjects.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {displayProjects.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">{t("featured.noResults")}</p>
          </div>
        )}

        {showExploreButton && !hasFilters && (
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mt-12">
            <Link to="/proyectos" className="bg-primary text-primary-foreground px-8 py-3.5 rounded-xl font-medium hover:opacity-90 transition-opacity text-base inline-block">
              {t("featured.exploreAll")}
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProjects;
