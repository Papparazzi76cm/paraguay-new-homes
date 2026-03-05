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
        <title>Tekoha — Obra Nueva en Paraguay | Departamentos y Casas en Asunción</title>
        <meta name="description" content="Explorá los mejores proyectos de obra nueva en Paraguay. Departamentos, casas y barrios cerrados verificados en Asunción, Ciudad del Este y Encarnación. Compará desarrollos e invertí con confianza." />
        <link rel="canonical" href="https://tekoha.estate/" />
        <meta property="og:title" content="Tekoha — Obra Nueva en Paraguay | Proyectos Inmobiliarios Verificados" />
        <meta property="og:description" content="Portal inmobiliario líder en proyectos de obra nueva en Paraguay. Departamentos, casas y barrios cerrados en Asunción, Ciudad del Este y Encarnación." />
        <meta property="og:url" content="https://tekoha.estate/" />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Tekoha",
          "url": "https://tekoha.estate",
          "logo": "https://tekoha.estate/favicon.jpg",
          "description": "Plataforma líder en proyectos de obra nueva en Paraguay. Departamentos, casas y barrios cerrados en Asunción, Ciudad del Este y Encarnación.",
          "contactPoint": {
            "@type": "ContactPoint",
            "email": "info@tekoha.estate",
            "contactType": "customer service",
            "areaServed": "PY",
            "availableLanguage": ["Spanish", "English"]
          },
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Asunción",
            "addressCountry": "PY"
          }
        })}</script>
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ItemList",
          "name": "Proyectos de Obra Nueva en Paraguay",
          "description": "Proyectos inmobiliarios de obra nueva verificados en Asunción, Ciudad del Este y Encarnación",
          "itemListOrder": "https://schema.org/ItemListUnordered",
          "numberOfItems": 120
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
