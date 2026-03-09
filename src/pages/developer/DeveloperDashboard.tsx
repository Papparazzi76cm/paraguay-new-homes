import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Building2, Mail, ShoppingBag, Rocket, PlusCircle, Settings, ImagePlus, Users } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const DeveloperDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

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
    queryKey: ["dev-profile", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("profiles")
        .select("display_name")
        .eq("user_id", user!.id)
        .maybeSingle();
      return data;
    },
    enabled: !!user,
  });

  const isFirstTime = projectCount === 0;

  const stats = [
    { label: "Mis Proyectos", value: projectCount, icon: Building2 },
    { label: "Leads cualificados", value: leadCount, icon: Mail },
    { label: "Servicios contratados", value: requestCount, icon: ShoppingBag },
  ];

  const steps = [
    {
      icon: Settings,
      title: "Configurá tu perfil",
      description: "Subí el logo de tu empresa y completá tu información.",
      action: () => navigate("/developer/settings"),
      buttonLabel: "Ir a Configuración",
    },
    {
      icon: PlusCircle,
      title: "Creá tu primer proyecto",
      description: "Agregá los datos, precios, amenities y ubicación de tu desarrollo.",
      action: () => navigate("/developer/projects/new"),
      buttonLabel: "Crear proyecto",
    },
    {
      icon: ImagePlus,
      title: "Subí imágenes",
      description: "Una vez creado el proyecto, agregá fotos y elegí tu imagen de portada.",
      action: null,
      buttonLabel: null,
    },
    {
      icon: Users,
      title: "Recibí leads cualificados",
      description: "Los compradores interesados llegarán automáticamente a tu panel.",
      action: null,
      buttonLabel: null,
    },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-foreground mb-2">Dashboard</h2>

      {isFirstTime && (
        <div className="mb-8 rounded-2xl border border-primary/20 bg-primary/5 p-6 md:p-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <Rocket className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                ¡Bienvenido{profile?.display_name ? `, ${profile.display_name}` : ""}!
              </h3>
              <p className="text-sm text-muted-foreground">Seguí estos pasos para publicar tu primer proyecto en la plataforma.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
            {steps.map((step, i) => (
              <div key={i} className="flex gap-3 rounded-xl bg-card border border-border p-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-sm">
                  {i + 1}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground text-sm">{step.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{step.description}</p>
                  {step.action && (
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
