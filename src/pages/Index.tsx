import { useState } from "react";
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
      <Hero filters={filters} onFiltersChange={setFilters} />
      <FeaturedProjects filters={filters} />
      <Benefits />
      <CtaBanner />
      <Footer />
    </main>
  );
};

export default Index;
