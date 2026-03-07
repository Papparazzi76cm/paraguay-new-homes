import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Home, MapPin, Loader2, ArrowRight, Calculator, ClipboardCheck } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useCurrency } from "@/hooks/useCurrency";
import { convertCurrency, formatCurrency } from "@/components/CurrencyToggle";
import Navbar from "@/components/Navbar";
import CheRogaLeadForm from "@/components/CheRogaLeadForm";
import Footer from "@/components/Footer";

import project1 from "@/assets/project-1.jpg";
import project2 from "@/assets/project-2.jpg";
import project3 from "@/assets/project-3.jpg";

const fallbackImages = [project1, project2, project3];

const formatGs = (n: number) =>
  new Intl.NumberFormat("es-PY", { style: "currency", currency: "PYG", maximumFractionDigits: 0 }).format(n);

const ProyectosCheRogaPora = () => {
  const [cityFilter, setCityFilter] = useState("");
  const { displayCurrency } = useCurrency();
  const fmtPrice = (price: number, from: string) =>
    formatCurrency(convertCurrency(price, from, displayCurrency), displayCurrency);

  const { data: projects, isLoading } = useQuery({
    queryKey: ["che-roga-projects-page", cityFilter],
    queryFn: async () => {
      let query = supabase
        .from("projects")
        .select("*")
        .eq("programa_financiacion", "che_roga_pora")
        .order("featured", { ascending: false })
        .order("created_at", { ascending: false });
      if (cityFilter) query = query.eq("location_city", cityFilter);
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  return (
    <main className="min-h-screen bg-background">
      <Helmet>
        <title>Proyectos Che Róga Porã — Casas Financiadas en Paraguay | Tekoha</title>
        <meta name="description" content="Explorá todos los proyectos inmobiliarios compatibles con el programa Che Róga Porã. Casas y departamentos financiados con tasa fija del 6,5% en Asunción, Ciudad del Este y Encarnación." />
        <link rel="canonical" href="https://tekoha.estate/proyectos-che-roga-pora" />
        <meta property="og:title" content="Proyectos Che Róga Porã — Viviendas Financiadas | Tekoha" />
        <meta property="og:description" content="Todos los proyectos compatibles con Che Róga Porã. Financiación con tasa 6,5%, hasta 30 años." />
        <meta property="og:url" content="https://tekoha.estate/proyectos-che-roga-pora" />
        <meta name="keywords" content="proyectos che roga pora, casas financiadas paraguay, departamentos che róga porã, vivienda social asunción, comprar casa financiada" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": "Proyectos Che Róga Porã",
          "description": "Proyectos inmobiliarios compatibles con el programa de vivienda Che Róga Porã en Paraguay.",
          "url": "https://tekoha.estate/proyectos-che-roga-pora",
          "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Inicio", "item": "https://tekoha.estate/" },
              { "@type": "ListItem", "position": 2, "name": "Che Róga Porã", "item": "https://tekoha.estate/che-roga-pora" },
              { "@type": "ListItem", "position": 3, "name": "Proyectos", "item": "https://tekoha.estate/proyectos-che-roga-pora" }
            ]
          }
        })}</script>
      </Helmet>

      {/* Hero */}
      <section className="relative bg-foreground text-background overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `url(${project1})`, backgroundSize: "cover", backgroundPosition: "center" }} />
        <div className="absolute inset-0 bg-foreground/80" />
        <Navbar />
        <div className="container relative z-10 pt-36 pb-16 md:pt-44 md:pb-20">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <span className="inline-flex items-center gap-2 bg-primary/20 text-primary-foreground px-4 py-1.5 rounded-full text-sm font-medium mb-6">
              <Home className="w-4 h-4" /> Programa Che Róga Porã
            </span>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
              Proyectos financiables con <span className="text-accent">Che Róga Porã</span>
            </h1>
            <p className="text-white/80 text-lg max-w-2xl mb-6">
              Casas y departamentos que podés comprar con crédito del gobierno paraguayo. Tasa fija 6,5%, hasta 30 años.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/che-roga-pora#simulador" className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-medium hover:opacity-90 transition-opacity inline-flex items-center gap-2">
                <Calculator className="w-4 h-4" /> Simular cuota
              </Link>
              <Link to="/che-roga-pora#elegibilidad" className="bg-white/10 backdrop-blur-sm text-white px-6 py-3 rounded-xl font-medium border border-white/20 hover:bg-white/20 transition-colors inline-flex items-center gap-2">
                <ClipboardCheck className="w-4 h-4" /> ¿Soy elegible?
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* City filters */}
      <section className="py-8 bg-secondary/30 border-b border-border">
        <div className="container">
          <div className="flex flex-wrap justify-center gap-2">
            {["", "Asunción", "Ciudad del Este", "Encarnación", "Luque", "San Lorenzo"].map((c) => (
              <button
                key={c}
                onClick={() => setCityFilter(c)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  cityFilter === c
                    ? "bg-primary text-primary-foreground"
                    : "bg-card text-foreground hover:bg-secondary"
                }`}
              >
                {c || "Todas las ciudades"}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Projects grid */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container">
          {isLoading ? (
            <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
          ) : projects && projects.length > 0 ? (
            <>
              <p className="text-muted-foreground mb-8 text-center">{projects.length} proyecto{projects.length !== 1 ? "s" : ""} encontrado{projects.length !== 1 ? "s" : ""}</p>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project: any, i: number) => (
                  <Link to={`/proyecto/${project.slug}`} key={project.id}>
                    <motion.article
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.08 }}
                      className="group bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-shadow"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <img src={project.cover_image_url || fallbackImages[i % 3]} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                        <div className="absolute top-4 left-4">
                          <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-primary text-primary-foreground flex items-center gap-1.5">
                            <Home className="w-3 h-3" /> Che Róga Porã
                          </span>
                        </div>
                      </div>
                      <div className="p-5">
                        <div className="flex items-center gap-1.5 text-muted-foreground text-sm mb-2">
                          <MapPin className="w-3.5 h-3.5" />
                          <span>{project.location_city}{project.location_zone ? `, ${project.location_zone}` : ""}</span>
                        </div>
                        <h3 className="font-display text-lg font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">{project.title}</h3>
                        <div className="flex items-center justify-between border-t border-border pt-3">
                          <div>
                            <p className="text-xs text-muted-foreground">Desde</p>
                            <p className="text-lg font-bold text-foreground">
                              {project.price_from ? fmtPrice(project.price_from, project.price_currency) : "Consultar"}
                            </p>
                          </div>
                          {project.cuota_estimativa && (
                            <div className="text-right">
                              <p className="text-xs text-muted-foreground">Cuota desde</p>
                              <p className="text-sm font-semibold text-primary">{formatGs(project.cuota_estimativa)}/mes</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.article>
                  </Link>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-16 bg-card rounded-2xl shadow-card max-w-xl mx-auto">
              <Home className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-display text-xl font-semibold text-foreground mb-2">Próximamente</h3>
              <p className="text-muted-foreground mb-6">
                Estamos incorporando proyectos compatibles con Che Róga Porã.
              </p>
              <Link to="/che-roga-pora#elegibilidad" className="text-primary font-medium hover:underline inline-flex items-center gap-1">
                Mientras tanto, verificá tu elegibilidad <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Lead capture */}
      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="container max-w-3xl">
          <CheRogaLeadForm />
        </div>
      </section>

      {/* Interlinking */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-4">
            <Link to="/che-roga-pora" className="bg-card rounded-xl p-6 shadow-card hover:shadow-card-hover transition-shadow group">
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-2">Guía completa del programa</h3>
              <p className="text-sm text-muted-foreground">Requisitos, modalidades, simulador y test de elegibilidad.</p>
            </Link>
            <Link to="/che-roga-pora#simulador" className="bg-card rounded-xl p-6 shadow-card hover:shadow-card-hover transition-shadow group">
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-2">Simulador de cuotas</h3>
              <p className="text-sm text-muted-foreground">Calculá cuánto pagarías por mes con tasa fija del 6,5%.</p>
            </Link>
            <Link to="/blog" className="bg-card rounded-xl p-6 shadow-card hover:shadow-card-hover transition-shadow group">
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-2">Blog inmobiliario</h3>
              <p className="text-sm text-muted-foreground">Novedades y consejos sobre el mercado inmobiliario paraguayo.</p>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default ProyectosCheRogaPora;
