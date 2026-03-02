import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Building, TrendingUp, CreditCard, CalendarDays, Send, FileText, Loader2, Share2, Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useProjectBySlug, useProjectImages } from "@/hooks/useProjectDetail";
import ProjectGallery from "@/components/ProjectGallery";
import ConstructionTimeline from "@/components/ConstructionTimeline";
import AmenitiesList from "@/components/AmenitiesList";
import YieldSimulator from "@/components/YieldSimulator";
import ContactDialog from "@/components/ContactDialog";
import ProjectMap from "@/components/ProjectMap";
import UnitSearch from "@/components/UnitSearch";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import Footer from "@/components/Footer";

const ProjectDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: project, isLoading, error } = useProjectBySlug(slug || "");
  const { data: images } = useProjectImages(project?.id || "");
  const [contactOpen, setContactOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const { t } = useTranslation();

  const handleShare = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (<div className="min-h-screen flex items-center justify-center bg-background"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>);
  }

  if (error || !project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
        <h1 className="font-display text-2xl font-bold text-foreground">{t("detail.notFound")}</h1>
        <Link to="/" className="text-primary font-medium hover:underline flex items-center gap-1"><ArrowLeft className="w-4 h-4" /> {t("detail.backHome")}</Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <nav className="bg-card border-b border-border sticky top-0 z-40">
        <div className="container flex items-center justify-between py-3">
          <Link to="/" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center"><span className="text-primary-foreground font-display font-bold text-sm">P</span></div>
              <span className="font-display font-bold text-base hidden sm:inline">ProyectPY</span>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <button onClick={handleShare} className="p-2 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:bg-accent transition-colors" title={t("detail.share")}>
              {copied ? <Check className="w-4 h-4 text-primary" /> : <Share2 className="w-4 h-4" />}
            </button>
            <button onClick={() => setContactOpen(true)} className="bg-primary text-primary-foreground px-5 py-2 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-2">
              <Send className="w-4 h-4" /> {t("detail.contact")}
            </button>
          </div>
        </div>
      </nav>

      <div className="container py-6 md:py-10">
        <ProjectGallery images={images} coverUrl={project.cover_image_url} title={project.title} />

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-8 mb-10">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary">{t(`projectStatus.${project.status}`)}</span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-secondary text-secondary-foreground">{t(`projectTypes.${project.project_type}`)}</span>
            {project.financing_available && (<span className="px-3 py-1 rounded-full text-xs font-semibold bg-accent/15 text-accent">{t("detail.financingAvailable")}</span>)}
          </div>

          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">{project.title}</h1>

          <div className="flex flex-wrap items-center gap-4 text-muted-foreground text-sm">
            <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" />{project.location_city}{project.location_zone ? `, ${project.location_zone}` : ""}</span>
            {project.developer_name && (<span className="flex items-center gap-1.5"><Building className="w-4 h-4" />{project.developer_name}</span>)}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
            {project.price_from && (<MetricCard icon={CreditCard} label={t("detail.fromPrice")} value={`${project.price_currency} ${project.price_from.toLocaleString()}`} />)}
            {project.estimated_yield && (<MetricCard icon={TrendingUp} label={t("detail.estYield")} value={`${project.estimated_yield}%`} />)}
            {project.delivery_date && (<MetricCard icon={CalendarDays} label={t("detail.deliveryLabel")} value={project.delivery_date} />)}
            <MetricCard icon={FileText} label={t("detail.typeLabel")} value={t(`projectTypes.${project.project_type}`)} />
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
          <div className="lg:col-span-2 space-y-6">
            {project.description && (
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-card rounded-2xl p-6 md:p-8 shadow-card">
                <h3 className="font-display text-xl font-semibold text-foreground mb-4">{t("detail.aboutProject")}</h3>
                <p className="text-muted-foreground leading-relaxed">{project.description}</p>
              </motion.div>
            )}
            {project.amenities && project.amenities.length > 0 && <AmenitiesList amenities={project.amenities} />}
            <UnitSearch projectId={project.id} currency={project.price_currency} />
            <ConstructionTimeline status={project.status} deliveryDate={project.delivery_date} phaseDates={{ phase_preventa_date: project.phase_preventa_date, phase_en_pozo_date: project.phase_en_pozo_date, phase_construccion_date: project.phase_construccion_date, phase_entrega_date: project.phase_entrega_date }} />
            {project.latitude && project.longitude && (<ProjectMap latitude={project.latitude} longitude={project.longitude} title={project.title} city={project.location_city} />)}
          </div>

          <div className="space-y-6">
            {project.price_from && project.estimated_yield && (<YieldSimulator priceFrom={project.price_from} estimatedYield={project.estimated_yield} currency={project.price_currency} />)}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-card rounded-2xl p-6 shadow-card lg:sticky lg:top-20">
              <h3 className="font-display text-lg font-semibold text-foreground mb-2">{t("detail.interestedTitle")}</h3>
              <p className="text-sm text-muted-foreground mb-5">{t("detail.interestedDesc")}</p>
              <div className="space-y-3">
                <button onClick={() => setContactOpen(true)} className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"><Send className="w-4 h-4" /> {t("detail.requestInfo")}</button>
                <button onClick={() => setContactOpen(true)} className="w-full bg-secondary text-secondary-foreground py-3 rounded-xl font-medium hover:bg-secondary/80 transition-colors flex items-center justify-center gap-2"><FileText className="w-4 h-4" /> {t("detail.downloadDossier")}</button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />
      <ContactDialog open={contactOpen} onClose={() => setContactOpen(false)} projectId={project.id} projectTitle={project.title} leadType="project_inquiry" />
    </main>
  );
};

const MetricCard = ({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) => (
  <div className="bg-card rounded-xl p-4 shadow-card">
    <div className="flex items-center gap-1.5 text-muted-foreground mb-1"><Icon className="w-4 h-4" /><span className="text-xs">{label}</span></div>
    <p className="font-bold text-foreground text-sm">{value}</p>
  </div>
);

export default ProjectDetail;
