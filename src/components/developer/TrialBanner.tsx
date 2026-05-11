import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Clock, Calendar, ShieldCheck } from "lucide-react";

function formatDate(d: Date) {
  return d.toLocaleDateString("es-PY", { day: "2-digit", month: "long", year: "numeric" });
}

const TrialBanner = () => {
  const { user } = useAuth();
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(t);
  }, []);

  const { data: sub } = useQuery({
    queryKey: ["dev-trial-sub", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("subscriptions")
        .select("status,current_period_end,cancel_at_period_end")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      return data;
    },
    enabled: !!user,
  });

  if (!sub?.current_period_end) return null;
  if (sub.status !== "trialing") return null;

  const end = new Date(sub.current_period_end).getTime();
  const msLeft = end - now;
  const daysLeft = Math.max(0, Math.ceil(msLeft / (24 * 60 * 60 * 1000)));
  const hoursLeft = Math.max(0, Math.floor((msLeft % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000)));
  const trialActive = msLeft > 0;
  const nextPaymentDate = new Date(end);

  return (
    <div
      className={`mb-6 rounded-2xl border p-5 md:p-6 ${
        trialActive
          ? "border-primary/20 bg-primary/5"
          : "border-destructive/30 bg-destructive/5"
      }`}
    >
      <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
        <div className="flex items-center gap-3 flex-1">
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
              trialActive ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"
            }`}
          >
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="font-semibold text-foreground">
              {trialActive ? "Prueba gratuita activa" : "Prueba gratuita finalizada"}
            </p>
            <p className="text-sm text-muted-foreground">
              {trialActive ? (
                <>
                  Te quedan{" "}
                  <span className="font-semibold text-primary">
                    {daysLeft} {daysLeft === 1 ? "día" : "días"}
                    {daysLeft <= 1 && ` y ${hoursLeft} h`}
                  </span>{" "}
                  de acceso completo sin cargo.
                </>
              ) : (
                "Activa un plan para seguir publicando proyectos."
              )}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 text-sm">
          <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2">
            <Calendar className="w-4 h-4 text-primary" />
            <div>
              <p className="text-muted-foreground text-xs">Próximo pago</p>
              <p className="font-medium text-foreground">{formatDate(nextPaymentDate)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <div>
              <p className="text-muted-foreground text-xs">Cancelación</p>
              <p className="font-medium text-foreground">Sin coste durante la prueba</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrialBanner;