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
        <title>Inmobiliaria en Encarnación | Proyectos de obra nueva - ProyectPY</title>
        <meta name="description" content="Explorá los mejores proyectos inmobiliarios de obra nueva y departamentos en pozo en Encarnación. Oportunidades de inversión en la Costanera y zonas de alta plusvalía." />
        <meta property="og:title" content="Inmobiliaria en Encarnación | Proyectos de obra nueva - ProyectPY" />
        <meta property="og:description" content="La plataforma líder de proyectos inmobiliarios de obra nueva en Encarnación, Itapúa." />
        
        {/* Schema Markup Optimizado para Inmobiliaria Local */}
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "RealEstateAgent",
          "name": "ProyectPY Encarnación",
          "image": "https://proyectpy.com/logo.png",
          "url": "https://proyectpy.com",
          "description": "La agencia inmobiliaria especializada en proyectos de obra nueva y departamentos en pozo en Encarnación, Paraguay. Inversión segura y alta rentabilidad.",
          "telephone": "+595-71-000-0000",
          "email": "info@proyectpy.com",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Av. Costanera República del Paraguay",
            "addressLocality": "Encarnación",
            "addressRegion": "Itapúa",
            "postalCode": "0700",
            "addressCountry": "PY"
          },
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": "-27.33056",
            "longitude": "-55.86667"
          },
          "openingHoursSpecification": {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": [
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday"
            ],
            "opens": "08:00",
            "closes": "18:00"
          },
          "areaServed": ["Encarnación", "Cambyretá", "Capitán Miranda", "San Juan del Paraná"],
          "priceRange": "$$$"
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
