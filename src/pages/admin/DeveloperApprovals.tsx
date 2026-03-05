import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle2, XCircle, Clock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

const statusConfig = {
  pending: { label: "Pendiente", icon: Clock, variant: "outline" as const },
  approved: { label: "Aprobado", icon: CheckCircle2, variant: "default" as const },
  rejected: { label: "Rechazado", icon: XCircle, variant: "destructive" as const },
};

const DeveloperApprovals = () => {
  const queryClient = useQueryClient();

  const { data: developers, isLoading } = useQuery({
    queryKey: ["admin-developer-approvals"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, user_id, display_name, developer_status, created_at")
        .not("developer_status", "is", null)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ userId, status }: { userId: string; status: string }) => {
      const { error } = await supabase
        .from("profiles")
        .update({ developer_status: status })
        .eq("user_id", userId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Estado actualizado");
      queryClient.invalidateQueries({ queryKey: ["admin-developer-approvals"] });
    },
    onError: () => toast.error("Error al actualizar"),
  });

  if (isLoading) {
    return <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-foreground mb-6">Desarrolladores</h2>
      {!developers?.length ? (
        <p className="text-muted-foreground">No hay solicitudes de desarrolladores.</p>
      ) : (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left p-3 font-medium text-muted-foreground">Nombre</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Estado</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Fecha</th>
                <th className="text-right p-3 font-medium text-muted-foreground">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {developers.map((dev) => {
                const status = statusConfig[dev.developer_status as keyof typeof statusConfig] ?? statusConfig.pending;
                const StatusIcon = status.icon;
                return (
                  <tr key={dev.id} className="border-b border-border last:border-0">
                    <td className="p-3 text-foreground">{dev.display_name ?? "—"}</td>
                    <td className="p-3">
                      <Badge variant={status.variant} className="gap-1">
                        <StatusIcon className="w-3 h-3" />
                        {status.label}
                      </Badge>
                    </td>
                    <td className="p-3 text-muted-foreground">{new Date(dev.created_at).toLocaleDateString()}</td>
                    <td className="p-3 text-right space-x-2">
                      {dev.developer_status !== "approved" && (
                        <Button size="sm" variant="outline" onClick={() => updateStatus.mutate({ userId: dev.user_id, status: "approved" })}>
                          <CheckCircle2 className="w-3 h-3 mr-1" /> Aprobar
                        </Button>
                      )}
                      {dev.developer_status !== "rejected" && (
                        <Button size="sm" variant="ghost" className="text-destructive" onClick={() => updateStatus.mutate({ userId: dev.user_id, status: "rejected" })}>
                          <XCircle className="w-3 h-3 mr-1" /> Rechazar
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DeveloperApprovals;
