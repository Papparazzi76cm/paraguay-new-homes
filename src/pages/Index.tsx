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
        <title>Tekoha — Proyectos de obra nueva en Paraguay</title>
        <meta name="description" content="Explorá los mejores proyectos inmobiliarios de obra nueva en Paraguay. Departamentos, casas y barrios cerrados con información verificada para inversores." />
        <meta property="og:title" content="Tekoha — Proyectos de obra nueva en Paraguay" />
        <meta property="og:description" content="La plataforma líder de proyectos inmobiliarios de obra nueva en Paraguay." />
...
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Tekoha",
          "url": "https://tekoha.estate",
          "description": "La plataforma especializada en proyectos de obra nueva en Paraguay. Inversión segura, información verificada.",
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+595-21-000-0000",
            "contactType": "customer service",
            "email": "info@tekoha.estate",
            "areaServed": "PY",
            "availableLanguage": "Spanish"
          },
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Asunción",
            "addressCountry": "PY"
          }
        })}</script>
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
