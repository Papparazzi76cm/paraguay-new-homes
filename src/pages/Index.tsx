import Hero from "@/components/Hero";
import FeaturedProjects from "@/components/FeaturedProjects";
import Benefits from "@/components/Benefits";
import CtaBanner from "@/components/CtaBanner";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <main className="min-h-screen">
      <Hero />
      <FeaturedProjects />
      <Benefits />
      <CtaBanner />
      <Footer />
    </main>
  );
};

export default Index;
