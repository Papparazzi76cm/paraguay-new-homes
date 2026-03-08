import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SearchBar from "@/components/SearchBar";
import FeaturedProjects from "@/components/FeaturedProjects";
import type { ProjectFilters } from "@/hooks/useProjects";

const Proyectos = () => {
  const [filters, setFilters] = useState<ProjectFilters>({});
  const { t } = useTranslation();

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

      <section className="pt-28 pb-10 md:pt-36 md:pb-14 bg-background">
        <div className="container">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground text-center mb-3">
            {t("allProjects.title")}
          </h1>
          <p className="text-muted-foreground text-lg text-center max-w-xl mx-auto mb-10">
            {t("allProjects.subtitle")}
          </p>
          <SearchBar filters={filters} onFiltersChange={setFilters} />
        </div>
      </section>

      <FeaturedProjects filters={filters} showAll />

      <Footer />
    </main>
  );
};

export default Proyectos;
