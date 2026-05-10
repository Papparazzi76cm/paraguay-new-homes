import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Building2, Mail, ShoppingBag, Rocket, PlusCircle, Settings, ImagePlus, Users, Check } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import TrialBanner from "@/components/developer/TrialBanner";

const DeveloperDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [dismissed, setDismissed] = useState(false);
  const [hiding, setHiding] = useState(false);
  const prevProjectCount = useRef<number | undefined>(undefined);

  const { data: projectCount } = useQuery({
    queryKey: ["dev-project-count", user?.id],
    queryFn: async () => {
      const { count } = await supabase
        .from("projects")
        .select("*", { count: "exact", head: true })
        .eq("developer_id", user!.id);
      return count ?? 0;
    },
    enabled: !!user,
  });

  const { data: leadCount } = useQuery({
    queryKey: ["dev-lead-count", user?.id],
    queryFn: async () => {
      const { data } = await supabase.rpc("get_matched_leads_for_developer", {
        _developer_id: user!.id,
      });
      return data?.length ?? 0;
    },
    enabled: !!user,
  });

  const { data: requestCount } = useQuery({
    queryKey: ["dev-request-count", user?.id],
    queryFn: async () => {
      const { count } = await supabase
        .from("service_requests")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user!.id);
      return count ?? 0;
    },
    enabled: !!user,
  });

  const { data: profile } = useQuery({
    queryKey: ["dev-profile-onboarding", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("profiles")
        .select("display_name, avatar_url")
        .eq("user_id", user!.id)
        .maybeSingle();
      return data;
    },
    enabled: !!user,
  });

  const { data: hasImages } = useQuery({
    queryKey: ["dev-has-images", user?.id],
    queryFn: async () => {
      const { data: projects } = await supabase
        .from("projects")
        .select("id")
        .eq("developer_id", user!.id)
        .limit(1);
      if (!projects?.length) return false;
      const { count } = await supabase
        .from("project_images")
        .select("*", { count: "exact", head: true })
        .eq("project_id", projects[0].id);
      return (count ?? 0) > 0;
    },
    enabled: !!user && (projectCount ?? 0) > 0,
  });

  // Animate out when project count goes from 0 to 1+
  useEffect(() => {
    if (prevProjectCount.current === 0 && projectCount && projectCount > 0) {
      setHiding(true);
      const timer = setTimeout(() => setDismissed(true), 500);
      return () => clearTimeout(timer);
    }
    prevProjectCount.current = projectCount;
  }, [projectCount]);

  const profileDone = !!(profile?.display_name && profile.display_name !== user?.email);
  const logoDone = !!profile?.avatar_url;
  const projectDone = (projectCount ?? 0) > 0;
  const imagesDone = !!hasImages;

  const completedCount = [profileDone, logoDone, projectDone, imagesDone].filter(Boolean).length;
  const showBanner = !dismissed && !projectDone;

  const stats = [
    { label: "Mis Proyectos", value: projectCount, icon: Building2 },
    { label: "Leads cualificados", value: leadCount, icon: Mail },
    { label: "Servicios contratados", value: requestCount, icon: ShoppingBag },
  ];

  const steps = [
    {
      icon: Settings,
      title: "Configurá tu perfil",
      description: "Completá tu nombre de empresa en la configuración.",
      action: () => navigate("/developer/settings"),
      buttonLabel: "Ir a Configuración",
      done: profileDone,
    },
    {
      icon: ImagePlus,
      title: "Subí tu logo",
      description: "Agregá el logo de tu empresa desde la configuración.",
      action: () => navigate("/developer/settings"),
      buttonLabel: "Subir logo",
      done: logoDone,
    },
    {
      icon: PlusCircle,
      title: "Creá tu primer proyecto",
      description: "Agregá los datos, precios, amenities y ubicación.",
      action: () => navigate("/developer/projects/new"),
      buttonLabel: "Crear proyecto",
      done: projectDone,
    },
    {
      icon: Users,
      title: "Recibí leads cualificados",
      description: "Llegarán automáticamente cuando publiques tu proyecto.",
      action: null,
      buttonLabel: null,
      done: false,
    },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-foreground mb-2">Dashboard</h2>

      <TrialBanner />

      {showBanner && (
        <div
          className={`mb-8 rounded-2xl border border-primary/20 bg-primary/5 p-6 md:p-8 transition-all duration-500 ease-out ${
            hiding ? "opacity-0 scale-95 max-h-0 overflow-hidden mb-0 p-0 border-0" : "opacity-100 scale-100 max-h-[600px]"
          }`}
        >
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Rocket className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  ¡Bienvenido{profile?.display_name && profile.display_name !== user?.email ? `, ${profile.display_name}` : ""}!
                </h3>
                <p className="text-sm text-muted-foreground">Seguí estos pasos para publicar tu primer proyecto.</p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
              <span className="font-medium text-primary">{completedCount}/4</span>
              <div className="w-20 h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${(completedCount / 4) * 100}%` }}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {steps.map((step, i) => (
              <div
                key={i}
                className={`flex gap-3 rounded-xl border p-4 transition-colors duration-300 ${
                  step.done
                    ? "bg-primary/5 border-primary/20"
                    : "bg-card border-border"
                }`}
              >
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-bold text-sm transition-colors duration-300 ${
                    step.done
                      ? "bg-primary text-primary-foreground"
                      : "bg-primary/10 text-primary"
                  }`}
                >
                  {step.done ? <Check className="w-4 h-4" /> : i + 1}
                </div>
                <div className="flex-1">
                  <p className={`font-medium text-sm ${step.done ? "text-primary line-through" : "text-foreground"}`}>
                    {step.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">{step.description}</p>
                  {step.action && !step.done && (
                    <Button size="sm" variant="outline" className="mt-2 h-7 text-xs" onClick={step.action}>
                      {step.buttonLabel}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-card rounded-xl p-6 shadow-sm border border-border">
            <div className="flex items-center gap-3 mb-2">
              <s.icon className="w-5 h-5 text-primary" />
              <span className="text-sm text-muted-foreground">{s.label}</span>
            </div>
            <p className="text-3xl font-bold text-foreground">{s.value ?? "—"}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeveloperDashboard;
