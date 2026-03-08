import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactDialog from "@/components/ContactDialog";
import { useState } from "react";
import {
  Building2,
  MapPin,
  ArrowRight,
  ArrowLeft,
  Shield,
  Globe,
  Phone,
  Mail,
  Award,
  TrendingUp,
  Users,
} from "lucide-react";
import type { Project } from "@/hooks/useProjects";
import { getDeveloperBySlug } from "@/data/developers";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: { duration: 0.55 },
};

const statusLabels: Record<string, string> = {
  preventa: "Preventa",
  en_pozo: "En pozo",
  en_construccion: "En construcción",
  entrega_inmediata: "Entrega inmediata",
};

const DeveloperProfile = () => {
  const { slug } = useParams<{ slug: string }>();
  const meta = getDeveloperBySlug(slug ?? "");
  const [contactOpen, setContactOpen] = useState(false);

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["developer-projects", meta?.name],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("developer_name", meta!.name)
        .order("title");
      if (error) throw error;
      return data as Project[];
    },
    enabled: !!meta,
  });

  if (!meta) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Promotor no encontrado.</p>
      </div>
    );
  }

  const initials = meta.name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <main className="min-h-screen">
      <Helmet>
        <title>{meta.name} — Promotor Inmobiliario | Tekoha</title>
        <meta name="description" content={meta.description} />
        <link rel="canonical" href={`https://tekoha.estate/promotor/${slug}`} />
      </Helmet>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          {meta.heroImage ? (
            <img
              src={meta.heroImage}
              alt={meta.name}
              className="w-full h-full object-cover"
              loading="eager"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/20 via-secondary to-primary/10" />
          )}
          <div className="absolute inset-0 bg-foreground/70" />
        </div>
        <Navbar />
        <div className="container pt-32 pb-20 md:pt-40 md:pb-28 relative z-10">
          <Link
            to="/promotores"
            className="inline-flex items-center gap-2 text-background/60 hover:text-background text-sm font-medium mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Volver a Promotores
          </Link>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="flex flex-col md:flex-row items-start md:items-center gap-6"
          >
            {meta.logo ? (
              <img
                src={meta.logo}
                alt={`Logo ${meta.name}`}
                className="h-20 md:h-24 w-auto rounded-xl bg-background/10 backdrop-blur-sm p-3"
              />
            ) : (
              <div className="h-20 w-20 md:h-24 md:w-24 rounded-xl bg-primary/20 backdrop-blur-sm flex items-center justify-center text-2xl md:text-3xl font-bold text-primary border border-primary/30">
                {initials}
              </div>
            )}
            <div>
              <div className="flex items-center gap-3 mb-3">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-background">
                  {meta.name}
                </h1>
              </div>
              <p className="text-background/70 text-lg max-w-2xl leading-relaxed">
                {meta.description}
              </p>
              <div className="flex flex-wrap gap-3 mt-5">
                {meta.website && (
                  <a
                    href={meta.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-background/60 hover:text-primary text-sm transition-colors"
                  >
                    <Globe className="w-4 h-4" /> {meta.website.replace(/https?:\/\//, "").replace(/\/$/, "")}
                  </a>
                )}
                {meta.email && (
                  <a
                    href={`mailto:${meta.email}`}
                    className="inline-flex items-center gap-2 text-background/60 hover:text-primary text-sm transition-colors"
                  >
                    <Mail className="w-4 h-4" /> {meta.email}
                  </a>
                )}
                {meta.phone && (
                  <a
                    href={`tel:${meta.phone.replace(/\s/g, "")}`}
                    className="inline-flex items-center gap-2 text-background/60 hover:text-primary text-sm transition-colors"
                  >
                    <Phone className="w-4 h-4" /> {meta.phone}
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Stats (only if available) ── */}
      {meta.stats && meta.stats.length > 0 && (
        <section className="border-b border-border">
          <div className="container py-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {meta.stats.map((s, i) => (
                <motion.div
                  key={s.label}
                  {...fadeUp}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="text-center"
                >
                  <p className="text-3xl md:text-4xl font-bold text-foreground mb-1">
                    {s.value}
                  </p>
                  <p className="text-muted-foreground text-sm">{s.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── About ── */}
      <section className="py-16 md:py-24">
        <div className="container max-w-4xl">
          <motion.div {...fadeUp}>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
              Sobre {meta.name}
            </h2>
            <p className="text-muted-foreground leading-relaxed text-[15px] mb-8">
              {meta.description}
            </p>

            {(meta.certifications || meta.esg) && (
              <div className="grid sm:grid-cols-2 gap-6">
                {meta.certifications && meta.certifications.length > 0 && (
                  <div className="bg-card border border-border rounded-2xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Award className="w-5 h-5 text-primary" />
                      <h3 className="font-semibold text-foreground">Certificaciones</h3>
                    </div>
                    <ul className="space-y-2.5">
                      {meta.certifications.map((c) => (
                        <li key={c} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <TrendingUp className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {meta.esg && (
                  <div className="bg-card border border-border rounded-2xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Users className="w-5 h-5 text-primary" />
                      <h3 className="font-semibold text-foreground">Compromiso ESG</h3>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{meta.esg}</p>
                  </div>
                )}
              </div>
            )}

            {/* Contact info card */}
            <div className="mt-8 bg-card border border-border rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Building2 className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-foreground">Información de contacto</h3>
              </div>
              <div className="grid sm:grid-cols-2 gap-4 text-sm text-muted-foreground">
                {meta.website && (
                  <a href={meta.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-primary transition-colors">
                    <Globe className="w-4 h-4 text-primary shrink-0" />
                    {meta.website.replace(/https?:\/\//, "").replace(/\/$/, "")}
                  </a>
                )}
                {meta.email && (
                  <a href={`mailto:${meta.email}`} className="flex items-center gap-2 hover:text-primary transition-colors">
                    <Mail className="w-4 h-4 text-primary shrink-0" />
                    {meta.email}
                  </a>
                )}
                {meta.phone && (
                  <a href={`tel:${meta.phone.replace(/\s/g, "")}`} className="flex items-center gap-2 hover:text-primary transition-colors">
                    <Phone className="w-4 h-4 text-primary shrink-0" />
                    {meta.phone}
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Projects (only if any) ── */}
      {(isLoading || projects.length > 0) && (
        <section className="py-16 md:py-24 bg-secondary/50">
          <div className="container">
            <motion.div {...fadeUp} className="mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                Proyectos de {meta.name}
              </h2>
              <p className="text-muted-foreground">
                {projects.length} proyectos publicados en Tekoha
              </p>
            </motion.div>

            {isLoading ? (
              <div className="grid md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-80 bg-card border border-border rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {projects.map((project, i) => (
                  <motion.div key={project.id} {...fadeUp} transition={{ duration: 0.5, delay: i * 0.1 }}>
                    <Link
                      to={`/proyecto/${project.slug}`}
                      className="group block bg-card border border-border rounded-2xl overflow-hidden hover:shadow-[var(--shadow-card-hover)] transition-shadow"
                    >
                      <div className="relative h-52 overflow-hidden">
                        <img
                          src={project.cover_image_url || "/placeholder.svg"}
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                        <div className="absolute top-3 left-3">
                          <span className="bg-foreground/80 backdrop-blur-sm text-background text-xs font-medium px-3 py-1.5 rounded-full">
                            {statusLabels[project.status] || project.status}
                          </span>
                        </div>
                      </div>
                      <div className="p-5">
                        <h3 className="font-display text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                          {project.title}
                        </h3>
                        <div className="flex items-center gap-1.5 text-muted-foreground text-sm mb-3">
                          <MapPin className="w-3.5 h-3.5" />
                          {project.location_city}
                          {project.location_zone && ` — ${project.location_zone}`}
                        </div>
                        <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                          {project.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <div>
                            {project.price_from && (
                              <p className="text-foreground font-semibold">
                                Desde {project.price_currency} {project.price_from.toLocaleString("es-PY")}
                              </p>
                            )}
                          </div>
                          <span className="text-primary text-sm font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                            Ver proyecto <ArrowRight className="w-4 h-4" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── CTA ── */}
      <section className="py-16 md:py-24">
        <div className="container">
          <motion.div
            {...fadeUp}
            className="bg-foreground rounded-3xl p-10 md:p-16 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_hsla(160,35%,30%,0.2),_transparent_60%)]" />
            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-background mb-4">
                ¿Te interesa un proyecto de {meta.name}?
              </h2>
              <p className="text-background/60 text-lg mb-8">
                Dejanos tus datos y un asesor te contactará con información detallada sobre disponibilidad y financiación.
              </p>
              <button
                onClick={() => setContactOpen(true)}
                className="bg-primary text-primary-foreground px-10 py-4 rounded-xl font-medium hover:opacity-90 transition-opacity inline-flex items-center gap-2 text-base"
              >
                Contactar <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />

      <ContactDialog
        open={contactOpen}
        onClose={() => setContactOpen(false)}
        leadType="developer_inquiry"
      />
    </main>
  );
};

export default DeveloperProfile;
