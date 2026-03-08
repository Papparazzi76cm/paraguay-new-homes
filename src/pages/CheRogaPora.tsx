import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Home, Shield, Percent, Clock, MapPin, Building, TrendingUp, Loader2, ArrowRight, BadgeCheck, Calculator, ClipboardCheck, FileText, BookOpen } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { useCurrency } from "@/hooks/useCurrency";
import { convertCurrency, formatCurrency } from "@/components/CurrencyToggle";
import Navbar from "@/components/Navbar";
import MortgageSimulator from "@/components/MortgageSimulator";
import EligibilityForm from "@/components/EligibilityForm";
import CheRogaLeadForm from "@/components/CheRogaLeadForm";
import Footer from "@/components/Footer";

import project1 from "@/assets/project-1.jpg";
import project2 from "@/assets/project-2.jpg";
import project3 from "@/assets/project-3.jpg";

const fallbackImages = [project1, project2, project3];

const formatGs = (n: number) =>
  new Intl.NumberFormat("es-PY", { style: "currency", currency: "PYG", maximumFractionDigits: 0 }).format(n);

const useFinanceableProjects = (cityFilter?: string) => {
  return useQuery({
    queryKey: ["financeable-projects", cityFilter],
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
};

const CheRogaPora = () => {
  const { t } = useTranslation();
  const [cityFilter, setCityFilter] = useState("");
  const { data: projects, isLoading } = useFinanceableProjects(cityFilter || undefined);
  const { displayCurrency } = useCurrency();
  const fmtPrice = (price: number, from: string) =>
    formatCurrency(convertCurrency(price, from, displayCurrency), displayCurrency);

  const benefits = [
    { icon: Percent, title: t("cheRoga.benefit1Title"), desc: t("cheRoga.benefit1Desc") },
    { icon: Clock, title: t("cheRoga.benefit2Title"), desc: t("cheRoga.benefit2Desc") },
    { icon: Shield, title: t("cheRoga.benefit3Title"), desc: t("cheRoga.benefit3Desc") },
    { icon: Home, title: t("cheRoga.benefit4Title"), desc: t("cheRoga.benefit4Desc") },
  ];

  const modalities = [
    { title: t("cheRoga.mod1Title"), desc: t("cheRoga.mod1Desc") },
    { title: t("cheRoga.mod2Title"), desc: t("cheRoga.mod2Desc") },
    { title: t("cheRoga.mod3Title"), desc: t("cheRoga.mod3Desc") },
    { title: t("cheRoga.mod4Title"), desc: t("cheRoga.mod4Desc") },
    { title: t("cheRoga.mod5Title"), desc: t("cheRoga.mod5Desc") },
  ];

  const requirements = [
    t("cheRoga.req1"), t("cheRoga.req2"), t("cheRoga.req3"),
    t("cheRoga.req4"), t("cheRoga.req5"), t("cheRoga.req6"),
  ];

  const faqs = [
    { q: t("cheRoga.faq1Q"), a: t("cheRoga.faq1A") },
    { q: t("cheRoga.faq2Q"), a: t("cheRoga.faq2A") },
    { q: t("cheRoga.faq3Q"), a: t("cheRoga.faq3A") },
    { q: t("cheRoga.faq4Q"), a: t("cheRoga.faq4A") },
    { q: t("cheRoga.faq5Q"), a: t("cheRoga.faq5A") },
    { q: t("cheRoga.faq6Q"), a: t("cheRoga.faq6A") },
    { q: t("cheRoga.faq7Q"), a: t("cheRoga.faq7A") },
  ];

  const steps = [
    { step: "1", title: t("cheRoga.step1Title"), desc: t("cheRoga.step1Desc"), link: "#elegibilidad" },
    { step: "2", title: t("cheRoga.step2Title"), desc: t("cheRoga.step2Desc"), link: "/proyectos-che-roga-pora" },
    { step: "3", title: t("cheRoga.step3Title"), desc: t("cheRoga.step3Desc"), link: "#simulador" },
    { step: "4", title: t("cheRoga.step4Title"), desc: t("cheRoga.step4Desc") },
    { step: "5", title: t("cheRoga.step5Title"), desc: t("cheRoga.step5Desc") },
  ];

  return (
    <main className="min-h-screen bg-background">
      <Helmet>
        <title>Che Róga Porã — Casas Financiadas en Paraguay | Crédito Vivienda 6,5% | Tekoha</title>
        <meta name="description" content="Accedé a vivienda propia con el programa Che Róga Porã del gobierno paraguayo. Tasa fija 6,5%, hasta 30 años. Simulá tu cuota y encontrá proyectos compatibles en Asunción, Ciudad del Este y Encarnación." />
        <link rel="canonical" href="https://tekoha.estate/che-roga-pora" />
        <meta property="og:title" content="Che Róga Porã — Casas Financiadas en Paraguay | Tekoha" />
        <meta property="og:description" content="Comprá tu primera vivienda con financiación del gobierno paraguayo. Tasa 6,5%, hasta 30 años. Simulador de cuotas y proyectos compatibles." />
        <meta property="og:url" content="https://tekoha.estate/che-roga-pora" />
        <meta property="og:type" content="website" />
        <meta name="keywords" content="che roga pora, che róga porã, crédito vivienda paraguay, casas financiadas paraguay, MUVH, AFD, vivienda social paraguay, comprar casa paraguay, financiación vivienda asunción, cuota che roga pora, requisitos che roga pora, simulador che roga pora" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Che Róga Porã — Guía Completa y Simulador | Tekoha",
          "description": "Guía completa del programa Che Róga Porã: requisitos, simulador de cuotas, test de elegibilidad y proyectos compatibles.",
          "url": "https://tekoha.estate/che-roga-pora",
          "publisher": { "@type": "Organization", "name": "Tekoha", "url": "https://tekoha.estate" },
          "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Inicio", "item": "https://tekoha.estate/" },
              { "@type": "ListItem", "position": 2, "name": "Che Róga Porã", "item": "https://tekoha.estate/che-roga-pora" }
            ]
          }
        })}</script>
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            { "@type": "Question", "name": "¿Qué es el programa Che Róga Porã?", "acceptedAnswer": { "@type": "Answer", "text": "Es una política pública del gobierno paraguayo para facilitar el acceso a la primera vivienda con créditos a tasa fija del 6,5% anual y plazos de hasta 30 años." } },
            { "@type": "Question", "name": "¿Cuáles son los requisitos para Che Róga Porã?", "acceptedAnswer": { "@type": "Answer", "text": "Tener entre 18 y 75 años, ingresos familiares entre 1 y 6 salarios mínimos, no poseer vivienda edificada, y contar con documentación vigente." } },
            { "@type": "Question", "name": "¿Cuánto se paga de cuota en Che Róga Porã?", "acceptedAnswer": { "@type": "Answer", "text": "La cuota depende del monto financiado y el plazo. Con tasa fija del 6,5% a 25 años, un crédito de Gs. 350 millones tiene una cuota aproximada de Gs. 2.360.000 por mes." } },
            { "@type": "Question", "name": "¿Qué casas se pueden comprar con Che Róga Porã?", "acceptedAnswer": { "@type": "Answer", "text": "Casas y departamentos nuevos de proyectos habilitados, con precios desde Gs. 100 millones hasta Gs. 725 millones según la versión 2.0 del programa." } },
            { "@type": "Question", "name": "¿Cómo solicitar el crédito Che Róga Porã?", "acceptedAnswer": { "@type": "Answer", "text": "Debés acercarte a una entidad financiera intermediaria (IFI) autorizada por la AFD con tu documentación personal, comprobante de ingresos y la vivienda seleccionada." } },
          ]
        })}</script>
      </Helmet>

      {/* Hero */}
      <section className="relative bg-foreground text-background overflow-hidden">
        <div className="absolute inset-0 bg-[var(--hero-overlay)]" />
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `url(${project1})`, backgroundSize: "cover", backgroundPosition: "center" }} />
        <Navbar />
        <div className="container relative z-10 pt-36 pb-20 md:pt-44 md:pb-28">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <span className="inline-flex items-center gap-2 bg-primary/20 text-primary-foreground px-4 py-1.5 rounded-full text-sm font-medium mb-6">
              <Home className="w-4 h-4" /> {t("cheRoga.programBadge")}
            </span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              {t("cheRoga.heroTitle")} <span className="text-accent">{t("cheRoga.heroHighlight")}</span>
            </h1>
            <p className="text-white/80 text-lg md:text-xl max-w-2xl mb-8">
              {t("cheRoga.heroSubtitle")}
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="#simulador" className="bg-primary text-primary-foreground px-6 py-3.5 rounded-xl font-semibold hover:opacity-90 transition-opacity inline-flex items-center gap-2 text-base">
                <Calculator className="w-5 h-5" /> {t("cheRoga.simulateCta")}
              </a>
              <a href="#elegibilidad" className="bg-white/10 backdrop-blur-sm text-white px-6 py-3.5 rounded-xl font-semibold border border-white/20 hover:bg-white/20 transition-colors inline-flex items-center gap-2 text-base">
                <ClipboardCheck className="w-5 h-5" /> {t("cheRoga.canIAccess")}
              </a>
              <Link to="/proyectos-che-roga-pora" className="bg-accent text-accent-foreground px-6 py-3.5 rounded-xl font-semibold hover:opacity-90 transition-opacity inline-flex items-center gap-2 text-base">
                <Building className="w-5 h-5" /> {t("cheRoga.viewFinanceable")}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick Action Bar */}
      <section className="bg-primary py-4">
        <div className="container">
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8">
            <a href="#simulador" className="text-primary-foreground font-medium hover:underline inline-flex items-center gap-2 text-sm">
              <Calculator className="w-4 h-4" /> {t("cheRoga.quickSimulate")}
            </a>
            <a href="#elegibilidad" className="text-primary-foreground font-medium hover:underline inline-flex items-center gap-2 text-sm">
              <ClipboardCheck className="w-4 h-4" /> {t("cheRoga.quickCheck")}
            </a>
            <Link to="/proyectos-che-roga-pora" className="text-primary-foreground font-medium hover:underline inline-flex items-center gap-2 text-sm">
              <Building className="w-4 h-4" /> {t("cheRoga.quickProjects")}
            </Link>
            <a href="#lead-form" className="text-primary-foreground font-medium hover:underline inline-flex items-center gap-2 text-sm">
              <FileText className="w-4 h-4" /> {t("cheRoga.quickReceive")}
            </a>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <span className="text-accent font-semibold text-sm uppercase tracking-wider">{t("cheRoga.benefitsTag")}</span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">{t("cheRoga.benefitsTitle")}</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">{t("cheRoga.benefitsSubtitle")}</p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((b, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-card rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-shadow">
                <b.icon className="w-8 h-8 text-primary mb-4" />
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">{b.title}</h3>
                <p className="text-muted-foreground text-sm">{b.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner 1 */}
      <section className="py-10 bg-accent">
        <div className="container text-center">
          <h3 className="font-display text-2xl md:text-3xl font-bold text-accent-foreground mb-3">{t("cheRoga.ctaBanner1Title")}</h3>
          <p className="text-accent-foreground/80 mb-6 max-w-xl mx-auto">{t("cheRoga.ctaBanner1Subtitle")}</p>
          <a href="#simulador" className="bg-accent-foreground text-accent px-8 py-3.5 rounded-xl font-semibold hover:opacity-90 transition-opacity inline-flex items-center gap-2">
            <Calculator className="w-5 h-5" /> {t("cheRoga.ctaBanner1Btn")}
          </a>
        </div>
      </section>

      {/* SEO Section: Cuánto se paga de cuota */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-display text-3xl font-bold text-foreground mb-6">{t("cheRoga.paymentTitle")}</h2>
            <div className="prose prose-lg text-muted-foreground space-y-4">
              <p dangerouslySetInnerHTML={{ __html: t("cheRoga.paymentIntro") }} />
              <div className="bg-card rounded-xl p-5 shadow-card not-prose">
                <h4 className="font-semibold text-foreground mb-3">{t("cheRoga.paymentExamples")}</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Gs. 200.000.000</span>
                    <span className="font-semibold text-primary">≈ Gs. 1.350.000/mes</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Gs. 350.000.000</span>
                    <span className="font-semibold text-primary">≈ Gs. 2.360.000/mes</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Gs. 500.000.000</span>
                    <span className="font-semibold text-primary">≈ Gs. 3.370.000/mes</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-muted-foreground">Gs. 725.000.000</span>
                    <span className="font-semibold text-primary">≈ Gs. 4.890.000/mes</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Modalities */}
      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">{t("cheRoga.modalitiesTitle")}</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">{t("cheRoga.modalitiesSubtitle")}</p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {modalities.map((m, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="bg-card rounded-xl p-5 shadow-card flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Building className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{m.title}</h3>
                  <p className="text-sm text-muted-foreground">{m.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/proyectos-che-roga-pora" className="bg-primary text-primary-foreground px-8 py-3.5 rounded-xl font-semibold hover:opacity-90 transition-opacity inline-flex items-center gap-2">
              <Building className="w-5 h-5" /> {t("cheRoga.viewFinanceableProjects")} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-display text-3xl font-bold text-foreground mb-6 text-center">{t("cheRoga.requirementsTitle")}</h2>
            <div className="bg-card rounded-2xl p-6 md:p-8 shadow-card">
              <ul className="space-y-3">
                {requirements.map((r, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <BadgeCheck className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                    <span className="text-foreground">{r}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="text-center mt-8">
              <a href="#elegibilidad" className="bg-accent text-accent-foreground px-8 py-3.5 rounded-xl font-semibold hover:opacity-90 transition-opacity inline-flex items-center gap-2">
                <ClipboardCheck className="w-5 h-5" /> {t("cheRoga.checkEligibility")} <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Simulator */}
      <section id="simulador" className="py-16 md:py-24 bg-secondary/30">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">{t("cheRoga.simulatorTitle")}</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">{t("cheRoga.simulatorSubtitle")}</p>
          </motion.div>
          <div className="max-w-2xl mx-auto">
            <MortgageSimulator />
          </div>
        </div>
      </section>

      {/* CTA Banner 2 */}
      <section className="py-10 bg-primary">
        <div className="container text-center">
          <h3 className="font-display text-2xl md:text-3xl font-bold text-primary-foreground mb-3">{t("cheRoga.ctaBanner2Title")}</h3>
          <p className="text-primary-foreground/80 mb-6 max-w-xl mx-auto">{t("cheRoga.ctaBanner2Subtitle")}</p>
          <a href="#elegibilidad" className="bg-primary-foreground text-primary px-8 py-3.5 rounded-xl font-semibold hover:opacity-90 transition-opacity inline-flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5" /> {t("cheRoga.ctaBanner2Btn")}
          </a>
        </div>
      </section>

      {/* Eligibility Form */}
      <section id="elegibilidad" className="py-16 md:py-24 bg-secondary/30">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">{t("cheRoga.eligibilityTitle")}</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">{t("cheRoga.eligibilitySubtitle")}</p>
          </motion.div>
          <div className="max-w-3xl mx-auto">
            <EligibilityForm />
          </div>
        </div>
      </section>

      {/* Eligible Projects (preview) */}
      <section id="proyectos-financiables" className="py-16 md:py-24 bg-background">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
            <span className="text-accent font-semibold text-sm uppercase tracking-wider">{t("cheRoga.projectsTag")}</span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">{t("cheRoga.projectsTitle")}</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">{t("cheRoga.projectsSubtitle")}</p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {["", "Asunción", "Ciudad del Este", "Encarnación", "Luque"].map((c) => (
              <button
                key={c}
                onClick={() => setCityFilter(c)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  cityFilter === c
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                {c || t("cheRoga.allCities")}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
          ) : projects && projects.length > 0 ? (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.slice(0, 6).map((project: any, i: number) => (
                  <Link to={`/proyecto/${project.slug}`} key={project.id}>
                    <motion.article
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
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
                            <p className="text-xs text-muted-foreground">{t("cheRoga.from")}</p>
                            <p className="text-lg font-bold text-foreground">
                              {project.price_from ? fmtPrice(project.price_from, project.price_currency) : t("cheRoga.askPrice")}
                            </p>
                          </div>
                          {project.cuota_estimativa && (
                            <div className="text-right">
                              <p className="text-xs text-muted-foreground">{t("cheRoga.installmentFrom")}</p>
                              <p className="text-sm font-semibold text-primary">{formatGs(project.cuota_estimativa)}{t("cheRoga.perMonth")}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.article>
                  </Link>
                ))}
              </div>
              {projects.length > 6 && (
                <div className="text-center mt-8">
                  <Link to="/proyectos-che-roga-pora" className="bg-primary text-primary-foreground px-8 py-3.5 rounded-xl font-semibold hover:opacity-90 transition-opacity inline-flex items-center gap-2">
                    {t("cheRoga.viewAllProjects")} ({projects.length}) <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16 bg-card rounded-2xl shadow-card">
              <Home className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-display text-xl font-semibold text-foreground mb-2">{t("cheRoga.comingSoon")}</h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">{t("cheRoga.comingSoonDesc")}</p>
              <a href="#lead-form" className="text-primary font-medium hover:underline inline-flex items-center gap-1">
                {t("cheRoga.notifyMe")} <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          )}
        </div>
      </section>

      {/* SEO Section: Cómo solicitar el crédito */}
      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="container max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-display text-3xl font-bold text-foreground mb-6">{t("cheRoga.howToTitle")}</h2>
            <div className="space-y-4">
              {steps.map((s, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                  className="flex gap-4 bg-card rounded-xl p-5 shadow-card">
                  <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold shrink-0">
                    {s.step}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{s.title}</h3>
                    <p className="text-sm text-muted-foreground">{s.desc}</p>
                    {s.link && (
                      s.link.startsWith("#") ? (
                        <a href={s.link} className="text-primary text-sm font-medium hover:underline inline-flex items-center gap-1 mt-1">
                          {t("cheRoga.goNow")} <ArrowRight className="w-3 h-3" />
                        </a>
                      ) : (
                        <Link to={s.link} className="text-primary text-sm font-medium hover:underline inline-flex items-center gap-1 mt-1">
                          {t("cheRoga.viewOptions")} <ArrowRight className="w-3 h-3" />
                        </Link>
                      )
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Lead Capture Form */}
      <section id="lead-form" className="py-16 md:py-24 bg-background">
        <div className="container max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">{t("cheRoga.leadTitle")}</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">{t("cheRoga.leadSubtitle")}</p>
          </motion.div>
          <CheRogaLeadForm />
        </div>
      </section>

      {/* FAQ Section for SEO */}
      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="container max-w-3xl">
          <h2 className="font-display text-3xl font-bold text-foreground mb-8 text-center">{t("cheRoga.faqTitle")}</h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <motion.details key={i} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                className="bg-card rounded-xl p-5 shadow-card group">
                <summary className="font-semibold text-foreground cursor-pointer list-none flex items-center justify-between">
                  {faq.q}
                  <span className="text-muted-foreground group-open:rotate-45 transition-transform text-xl">+</span>
                </summary>
                <p className="text-muted-foreground text-sm mt-3 leading-relaxed">{faq.a}</p>
              </motion.details>
            ))}
          </div>
        </div>
      </section>

      {/* Interlinking Section */}
      <section className="py-16 bg-background">
        <div className="container">
          <h2 className="font-display text-2xl font-bold text-foreground mb-8 text-center">{t("cheRoga.interlinksTitle")}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link to="/proyectos-che-roga-pora" className="bg-card rounded-xl p-5 shadow-card hover:shadow-card-hover transition-shadow group">
              <Building className="w-6 h-6 text-primary mb-3" />
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-1">{t("cheRoga.linkFinanceable")}</h3>
              <p className="text-sm text-muted-foreground">{t("cheRoga.linkFinanceableDesc")}</p>
            </Link>
            <Link to="/" className="bg-card rounded-xl p-5 shadow-card hover:shadow-card-hover transition-shadow group">
              <Home className="w-6 h-6 text-primary mb-3" />
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-1">{t("cheRoga.linkAllProjects")}</h3>
              <p className="text-sm text-muted-foreground">{t("cheRoga.linkAllProjectsDesc")}</p>
            </Link>
            <Link to="/inversion" className="bg-card rounded-xl p-5 shadow-card hover:shadow-card-hover transition-shadow group">
              <TrendingUp className="w-6 h-6 text-primary mb-3" />
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-1">{t("cheRoga.linkInvest")}</h3>
              <p className="text-sm text-muted-foreground">{t("cheRoga.linkInvestDesc")}</p>
            </Link>
            <Link to="/blog" className="bg-card rounded-xl p-5 shadow-card hover:shadow-card-hover transition-shadow group">
              <BookOpen className="w-6 h-6 text-primary mb-3" />
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-1">{t("cheRoga.linkBlog")}</h3>
              <p className="text-sm text-muted-foreground">{t("cheRoga.linkBlogDesc")}</p>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default CheRogaPora;
