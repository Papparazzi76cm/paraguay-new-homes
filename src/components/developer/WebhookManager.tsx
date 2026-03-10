import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Plus, Trash2, Copy, Globe, CheckCircle2, XCircle, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

const WebhookManager = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [newUrl, setNewUrl] = useState("");
  const [newSecret, setNewSecret] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [creating, setCreating] = useState(false);

  const { data: webhooks, isLoading } = useQuery({
    queryKey: ["developer-webhooks", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("developer_webhooks" as any)
        .select("*")
        .eq("developer_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as any[];
    },
    enabled: !!user,
  });

  const handleCreate = async () => {
    if (!user || !newUrl) return;
    try {
      new URL(newUrl);
    } catch {
      toast.error("URL inválida. Debe ser una URL completa (https://...)");
      return;
    }

    setCreating(true);
    const { error } = await supabase
      .from("developer_webhooks" as any)
      .insert({
        developer_id: user.id,
        url: newUrl,
        secret: newSecret || null,
        description: newDescription || null,
        events: ["new_lead"],
      } as any);

    if (error) {
      toast.error("Error: " + error.message);
    } else {
      setNewUrl("");
      setNewSecret("");
      setNewDescription("");
      queryClient.invalidateQueries({ queryKey: ["developer-webhooks"] });
      toast.success("Webhook creado. Se enviarán los nuevos leads automáticamente.");
    }
    setCreating(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from("developer_webhooks" as any)
      .delete()
      .eq("id", id);
    if (error) toast.error(error.message);
    else {
      queryClient.invalidateQueries({ queryKey: ["developer-webhooks"] });
      toast.success("Webhook eliminado");
    }
  };

  const handleToggle = async (id: string, active: boolean) => {
    const { error } = await supabase
      .from("developer_webhooks" as any)
      .update({ active: !active } as any)
      .eq("id", id);
    if (error) toast.error(error.message);
    else queryClient.invalidateQueries({ queryKey: ["developer-webhooks"] });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copiado al portapapeles");
  };

  return (
    <div className="space-y-5">
      {/* Info */}
      <div className="flex items-start gap-2 text-sm text-muted-foreground bg-accent/20 rounded-lg p-3">
        <Info className="w-4 h-4 mt-0.5 shrink-0" />
        <p>
          Cuando un nuevo lead se genera en un proyecto tuyo, enviaremos un POST con los datos del lead a cada webhook activo.
          Incluí un <code className="text-xs bg-background px-1 rounded">secret</code> para verificar la autenticidad (se envía como header <code className="text-xs bg-background px-1 rounded">X-Webhook-Secret</code>).
        </p>
      </div>

      {/* Create form */}
      <div className="space-y-3">
        <div className="space-y-2">
          <Label className="text-xs">URL del webhook (POST)</Label>
          <Input
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            placeholder="https://tu-crm.com/api/webhooks/leads"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label className="text-xs">Secret (opcional)</Label>
            <Input
              value={newSecret}
              onChange={(e) => setNewSecret(e.target.value)}
              placeholder="mi_secret_seguro"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Descripción (opcional)</Label>
            <Input
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="CRM Producción"
            />
          </div>
        </div>
        <Button onClick={handleCreate} disabled={creating || !newUrl} className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> Agregar webhook
        </Button>
      </div>

      {/* List */}
      {isLoading ? (
        <p className="text-sm text-muted-foreground">Cargando...</p>
      ) : !webhooks?.length ? (
        <p className="text-sm text-muted-foreground">No tenés webhooks configurados.</p>
      ) : (
        <div className="space-y-3">
          {webhooks.map((wh: any) => (
            <div key={wh.id} className="flex items-center gap-3 bg-muted/30 rounded-lg p-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Globe className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-sm font-medium truncate">{wh.description || "Webhook"}</span>
                  <Badge variant={wh.active ? "outline" : "secondary"} className="text-xs">
                    {wh.active ? "Activo" : "Inactivo"}
                  </Badge>
                </div>
                <code className="text-xs text-muted-foreground font-mono block truncate">{wh.url}</code>
                {wh.last_triggered_at && (
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    {wh.last_status_code && wh.last_status_code < 400 ? (
                      <CheckCircle2 className="w-3 h-3 text-green-500" />
                    ) : wh.last_status_code ? (
                      <XCircle className="w-3 h-3 text-destructive" />
                    ) : null}
                    Último envío: {new Date(wh.last_triggered_at).toLocaleString("es-PY")}
                    {wh.last_status_code ? ` (HTTP ${wh.last_status_code})` : ""}
                  </p>
                )}
              </div>
              <Switch checked={wh.active} onCheckedChange={() => handleToggle(wh.id, wh.active)} />
              <Button size="icon" variant="ghost" onClick={() => copyToClipboard(wh.url)}>
                <Copy className="w-4 h-4" />
              </Button>
              <Button size="icon" variant="ghost" className="text-destructive" onClick={() => handleDelete(wh.id)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Payload example */}
      <details className="text-sm">
        <summary className="text-muted-foreground cursor-pointer">Ver ejemplo de payload</summary>
        <pre className="mt-2 text-xs bg-background border rounded-lg p-3 overflow-x-auto">{`{
  "event": "new_lead",
  "timestamp": "2026-03-10T12:00:00Z",
  "lead": {
    "id": "uuid",
    "full_name": "Juan Pérez",
    "email": "juan@email.com",
    "phone": "+595 981 123456",
    "message": "Me interesa el departamento 2B",
    "lead_type": "contact",
    "created_at": "2026-03-10T12:00:00Z"
  },
  "project": {
    "id": "uuid",
    "title": "Torre Premium",
    "slug": "torre-premium"
  }
}`}</pre>
      </details>
    </div>
  );
};

export default WebhookManager;
