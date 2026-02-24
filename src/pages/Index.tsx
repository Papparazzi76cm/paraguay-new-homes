import { useState } from "react";
import { Helmet } from "react-helmet-async";
import Hero from "@/components/Hero";
import FeaturedProjects from "@/components/FeaturedProjects";
import Benefits from "@/components/Benefits";
import CtaBanner from "@/components/CtaBanner";
import Footer from "@/components/Footer";
import type { ProjectFilters } from "@/hooks/useProjects";

const Index = () => {
  const [filters, setFilters] = useState<ProjectFilters>({});

  return (
    <main className="min-h-screen">
      <Helmet>
        <title>NuevaPY — Proyectos de obra nueva en Paraguay</title>
        <meta name="description" content="Explorá los mejores proyectos inmobiliarios de obra nueva en Paraguay. Departamentos, casas y barrios cerrados con información verificada para inversores." />
        <meta property="og:title" content="NuevaPY — Proyectos de obra nueva en Paraguay" />
        <meta property="og:description" content="La plataforma líder de proyectos inmobiliarios de obra nueva en Paraguay." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="/" />
      </Helmet>
      <Hero filters={filters} onFiltersChange={setFilters} />
      <FeaturedProjects filters={filters} />
      <Benefits />
      <CtaBanner />
      <Footer />
    </main>
  );
};

export default Index;
