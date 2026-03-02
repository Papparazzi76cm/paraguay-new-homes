import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Building2, Mail, Users } from "lucide-react";

const Dashboard = () => {
  const { data: projectCount } = useQuery({
    queryKey: ["admin-project-count"],
    queryFn: async () => {
      const { count } = await supabase.from("projects").select("*", { count: "exact", head: true });
      return count ?? 0;
    },
  });

  const { data: leadCount } = useQuery({
    queryKey: ["admin-lead-count"],
    queryFn: async () => {
      const { count } = await supabase.from("contact_leads").select("*", { count: "exact", head: true });
      return count ?? 0;
    },
  });

  const { data: subCount } = useQuery({
    queryKey: ["admin-sub-count"],
    queryFn: async () => {
      const { count } = await supabase.from("newsletter_subscribers").select("*", { count: "exact", head: true });
      return count ?? 0;
    },
  });

  const stats = [
    { label: "Proyectos", value: projectCount, icon: Building2 },
    { label: "Leads", value: leadCount, icon: Mail },
    { label: "Suscriptores", value: subCount, icon: Users },
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

export default Dashboard;
