import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Building2, Mail, ShoppingBag } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const DeveloperDashboard = () => {
  const { user } = useAuth();

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

  const stats = [
    { label: "Mis Proyectos", value: projectCount, icon: Building2 },
    { label: "Leads cualificados", value: leadCount, icon: Mail },
    { label: "Servicios contratados", value: requestCount, icon: ShoppingBag },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-foreground mb-6">Dashboard</h2>
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
