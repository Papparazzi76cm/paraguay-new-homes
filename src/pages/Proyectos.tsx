import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SearchBar from "@/components/SearchBar";
import ProjectCardActions from "@/components/ProjectCardActions";
import FeaturedProjects from "@/components/FeaturedProjects";
import { useNonFeaturedProjects, type ProjectFilters, type Project } from "@/hooks/useProjects";
import { useCurrency } from "@/hooks/useCurrency";
import { convertCurrency, formatCurrency } from "@/components/CurrencyToggle";
import { Link } from "react-router-dom";
import { MapPin, TrendingUp, Building, Loader2, Home } from "lucide-react";
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

const SmallProjectCard = ({ project, index }: { project: Project; index: number }) => {
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
        transition={{ delay: Math.min(index * 0.05, 0.3), duration: 0.5 }}
        className="group bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-shadow duration-300"
      >
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={project.cover_image_url || fallbackImages[index % fallbackImages.length]}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <ProjectCardActions projectId={project.id} projectTitle={project.title} projectSlug={project.slug} />
          <div className="absolute top-4 left-4 flex gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor[project.status] || "bg-secondary text-secondary-foreground"}`}>
              {t(`projectStatus.${project.status}`)}
            </span>
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
              <p className="text-xs text-muted-foreground">{t("featured.from")}</p>
              <p className="text-lg font-bold text-foreground">
                {project.price_from ? fmtPrice(project.price_from, project.price_currency) : "—"}
              </p>
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

const Proyectos = () => {
  const [filters, setFilters] = useState<ProjectFilters>({});
  const [showAll, setShowAll] = useState(false);
  const { t } = useTranslation();
  const hasFilters = Object.values(filters).some((v) => v != null && v !== "");
  const { data: nonFeatured, isLoading: loadingNonFeatured } = useNonFeaturedProjects(filters);

  return (
    <main className="min-h-screen">
      <Helmet>
        <title>Proyectos de Obra Nueva en Paraguay | Tekoha</title>
        <meta
          name="description"
          content="Explorá todos los proyectos de obra nueva en Paraguay. Filtrá por ciudad, tipo, precio, estado y promotor."
        />
        <link rel="canonical" href="https://tekoha.estate/proyectos" />
      </Helmet>

      <Navbar />

      <section className="pt-28 pb-10 md:pt-36 md:pb-14 bg-foreground">
        <div className="container">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-background text-center mb-3">
            {t("allProjects.title")}
          </h1>
          <p className="text-background/60 text-lg text-center max-w-xl mx-auto mb-10">
            {t("allProjects.subtitle")}
          </p>
          <SearchBar filters={filters} onFiltersChange={setFilters} />
        </div>
      </section>

      <FeaturedProjects filters={hasFilters ? filters : undefined} showExploreButton={false} />

      {/* Show All / Non-featured projects */}
      {!hasFilters && (
        <section className="pb-20 bg-background">
          <div className="container">
            {!showAll ? (
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <button
                  onClick={() => setShowAll(true)}
                  className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-8 py-3.5 rounded-xl font-medium hover:opacity-90 transition-opacity text-base"
                >
                  Mostrar todos los proyectos
                  <ChevronDown className="w-4 h-4" />
                </button>
              </motion.div>
            ) : (
              <>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-foreground rounded-2xl px-8 py-8 text-center mb-10"
                >
                  <h2 className="font-display text-2xl md:text-3xl font-bold text-background mb-2">
                    Todos los proyectos
                  </h2>
                  <p className="text-background/60">
                    {nonFeatured?.length || 0} proyectos adicionales ordenados por fecha de publicación
                  </p>
                </motion.div>

                {loadingNonFeatured ? (
                  <div className="flex justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
                ) : nonFeatured && nonFeatured.length > 0 ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {nonFeatured.map((project, i) => (
                      <SmallProjectCard key={project.id} project={project} index={i} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <p className="text-muted-foreground">No hay más proyectos disponibles.</p>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      )}

      <Footer />
    </main>
  );
};

export default Proyectos;
