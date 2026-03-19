import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation, Trans } from "react-i18next";
import { Link } from "react-router-dom";
import { Star, ArrowRight } from "lucide-react";
import SearchBar from "./SearchBar";
import Navbar from "./Navbar";
import { useHeroProject } from "@/hooks/useHeroProject";
import type { ProjectFilters } from "@/hooks/useProjects";

interface HeroProps {
  filters: ProjectFilters;
  onFiltersChange: (filters: ProjectFilters) => void;
}

const Hero = ({ filters, onFiltersChange }: HeroProps) => {
  const { t } = useTranslation();
  const { data: topProject, isLoading } = useHeroProject();
  const [imgLoaded, setImgLoaded] = useState(false);

  // Don't show any image until query resolves to avoid flash
  const heroImage = topProject?.cover_image_url || null;
  const showImage = !isLoading && heroImage;

  return (
    <section className="relative min-h-[90vh] md:min-h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0 bg-foreground">
        {showImage && (
          <img
            src={heroImage}
            alt="Modern real estate development in Paraguay"
            className={`w-full h-full object-cover transition-opacity duration-500 ${imgLoaded ? "opacity-100" : "opacity-0"}`}
            loading="eager"
            onLoad={() => setImgLoaded(true)}
          />
        )}
        <div className="absolute inset-0" style={{ background: "var(--hero-overlay)" }} />
      </div>

      <Navbar />

      <div className="relative z-10 container flex flex-col items-center text-center pt-24 pb-16">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="inline-block bg-accent/20 backdrop-blur-sm text-white px-4 py-1.5 rounded-full text-sm font-medium mb-6 border border-accent/30"
        >
          {t("hero.badge")}
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-white font-display text-4xl md:text-4xl lg:text-6xl font-bold leading-tight max-w-3xl mb-5"
        >
          <Trans i18nKey="hero.title" components={{ italic: <span className="italic" /> }} />
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-white/75 text-lg md:text-xl max-w-xl mb-8"
        >
          {t("hero.subtitle")}
        </motion.p>

        {topProject && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mb-10 w-full max-w-md"
          >
            <Link
              to={`/proyecto/${topProject.slug}`}
              className="group block bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 hover:bg-white/15 transition-all duration-300 hover:border-accent/40 hover:shadow-lg hover:shadow-accent/10"
            >
              <div className="flex items-center justify-center gap-2 mb-3">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span className="text-xs font-bold tracking-widest uppercase text-amber-400">
                  Proyecto Top del Mes
                </span>
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              </div>
              <p className="text-white font-display text-lg font-semibold mb-1">
                {topProject.title}
              </p>
              {topProject.developer_name && (
                <p className="text-white/60 text-sm mb-3">
                  por {topProject.developer_name}
                </p>
              )}
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-accent group-hover:gap-2.5 transition-all duration-300">
                Ver Proyecto <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          </motion.div>
        )}

        <SearchBar filters={filters} onFiltersChange={onFiltersChange} />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="flex flex-wrap justify-center gap-8 md:gap-16 mt-14"
        >
          {[
            { value: "120+", label: t("hero.statsProjects") },
            { value: "35", label: t("hero.statsDevelopers") },
            { value: "8", label: t("hero.statsCities") },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-white font-display text-2xl md:text-3xl font-bold">{stat.value}</p>
              <p className="text-white/60 text-sm mt-1">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
