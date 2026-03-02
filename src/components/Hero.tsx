import { motion } from "framer-motion";
import heroImage from "@/assets/hero-building.jpg";
import SearchBar from "./SearchBar";
import Navbar from "./Navbar";
import type { ProjectFilters } from "@/hooks/useProjects";

interface HeroProps {
  filters: ProjectFilters;
  onFiltersChange: (filters: ProjectFilters) => void;
}

const Hero = ({ filters, onFiltersChange }: HeroProps) => {
  return (
    <section className="relative min-h-[90vh] md:min-h-screen flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Desarrollo inmobiliario moderno en Paraguay"
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0" style={{ background: "var(--hero-overlay)" }} />
      </div>

      <Navbar />

      {/* Content */}
      <div className="relative z-10 container flex flex-col items-center text-center pt-24 pb-16">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="inline-block bg-accent/20 backdrop-blur-sm text-white px-4 py-1.5 rounded-full text-sm font-medium mb-6 border border-accent/30"
        >
          Especialistas en Obra Nueva
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-white font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight max-w-3xl mb-5"
        >
          Tu próxima inversión en{" "}
          <span className="italic">obra nueva</span> en Paraguay
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-white/75 text-lg md:text-xl max-w-xl mb-10"
        >
          Explorá proyectos verificados, compará desarrollos y tomá decisiones de inversión con confianza.
        </motion.p>

        <SearchBar filters={filters} onFiltersChange={onFiltersChange} />

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="flex flex-wrap justify-center gap-8 md:gap-16 mt-14"
        >
          {[
            { value: "120+", label: "Proyectos activos" },
            { value: "35", label: "Desarrolladores" },
            { value: "8", label: "Ciudades" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-white font-display text-2xl md:text-3xl font-bold">
                {stat.value}
              </p>
              <p className="text-white/60 text-sm mt-1">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
