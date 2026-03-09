import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Copy, Eye, EyeOff, Plus, Trash2, RefreshCw, Code2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

function generateApiKey(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const prefix = "tk_live_";
  let key = prefix;
  for (let i = 0; i < 40; i++) {
    key += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return key;
}

const ApiKeyManager = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [newKeyName, setNewKeyName] = useState("default");
  const [creating, setCreating] = useState(false);
  const [newlyCreatedKey, setNewlyCreatedKey] = useState<string | null>(null);
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());
  const [showDocs, setShowDocs] = useState(false);

  const { data: apiKeys, isLoading } = useQuery({
    queryKey: ["developer-api-keys", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("developer_api_keys" as any)
        .select("*")
        .eq("developer_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as any[];
    },
    enabled: !!user,
  });

  const handleCreateKey = async () => {
    if (!user) return;
    setCreating(true);
    const apiKey = generateApiKey();

    const { error } = await supabase
      .from("developer_api_keys" as any)
      .insert({
        developer_id: user.id,
        api_key: apiKey,
        key_name: newKeyName || "default",
      } as any);

    if (error) {
      toast.error("Error al crear la API key: " + error.message);
    } else {
      setNewlyCreatedKey(apiKey);
      setNewKeyName("default");
      queryClient.invalidateQueries({ queryKey: ["developer-api-keys"] });
      toast.success("API Key creada. Copiala ahora, no se mostrará de nuevo completa.");
    }
    setCreating(false);
  };

  const handleRevoke = async (id: string) => {
    const { error } = await supabase
      .from("developer_api_keys" as any)
      .update({ active: false, revoked_at: new Date().toISOString() } as any)
      .eq("id", id);

    if (error) toast.error(error.message);
    else {
      queryClient.invalidateQueries({ queryKey: ["developer-api-keys"] });
      toast.success("API Key revocada");
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copiado al portapapeles");
  };

  const maskKey = (key: string) => key.substring(0, 12) + "••••••••••••••••••••";

  const toggleVisibility = (id: string) => {
    setVisibleKeys((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const activeKeys = apiKeys?.filter((k: any) => k.active) ?? [];
  const revokedKeys = apiKeys?.filter((k: any) => !k.active) ?? [];

  const baseUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/crm-sync`;

  return (
    <div className="space-y-6">
      {/* New key creation */}
      {newlyCreatedKey && (
        <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-xl p-4 space-y-2">
          <p className="text-sm font-semibold text-green-800 dark:text-green-300">
            🔑 Tu nueva API Key (copiala ahora, no se mostrará completa de nuevo):
          </p>
          <div className="flex items-center gap-2">
            <code className="flex-1 text-xs bg-background border rounded p-2 font-mono break-all">
              {newlyCreatedKey}
            </code>
            <Button size="sm" variant="outline" onClick={() => copyToClipboard(newlyCreatedKey)}>
              <Copy className="w-4 h-4" />
            </Button>
          </div>
          <Button size="sm" variant="ghost" onClick={() => setNewlyCreatedKey(null)}>
            Entendido, ya la copié
          </Button>
        </div>
      )}

      <div className="flex items-center gap-3">
        <Input
          value={newKeyName}
          onChange={(e) => setNewKeyName(e.target.value)}
          placeholder="Nombre de la key (ej: produccion)"
          className="max-w-xs"
        />
        <Button onClick={handleCreateKey} disabled={creating} className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> Generar API Key
        </Button>
      </div>

      {/* Active keys */}
      {isLoading ? (
        <p className="text-sm text-muted-foreground">Cargando...</p>
      ) : activeKeys.length === 0 ? (
        <p className="text-sm text-muted-foreground">No tenés API keys activas. Generá una para conectar tu CRM.</p>
      ) : (
        <div className="space-y-3">
          {activeKeys.map((key: any) => (
            <div key={key.id} className="flex items-center gap-3 bg-muted/30 rounded-lg p-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium">{key.key_name}</span>
                  <Badge variant="outline" className="text-xs">Activa</Badge>
                </div>
                <code className="text-xs text-muted-foreground font-mono">
                  {visibleKeys.has(key.id) ? key.api_key : maskKey(key.api_key)}
                </code>
                {key.last_used_at && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Último uso: {new Date(key.last_used_at).toLocaleDateString("es-PY")}
                  </p>
                )}
              </div>
              <Button size="icon" variant="ghost" onClick={() => toggleVisibility(key.id)}>
                {visibleKeys.has(key.id) ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
              <Button size="icon" variant="ghost" onClick={() => copyToClipboard(key.api_key)}>
                <Copy className="w-4 h-4" />
              </Button>
              <Button size="icon" variant="ghost" className="text-destructive" onClick={() => handleRevoke(key.id)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Revoked keys */}
      {revokedKeys.length > 0 && (
        <details className="text-sm">
          <summary className="text-muted-foreground cursor-pointer">
            {revokedKeys.length} key(s) revocada(s)
          </summary>
          <div className="mt-2 space-y-2">
            {revokedKeys.map((key: any) => (
              <div key={key.id} className="flex items-center gap-3 bg-muted/20 rounded-lg p-2 opacity-60">
                <span className="text-sm">{key.key_name}</span>
                <Badge variant="secondary" className="text-xs">Revocada</Badge>
                <code className="text-xs font-mono">{maskKey(key.api_key)}</code>
              </div>
            ))}
          </div>
        </details>
      )}

      {/* API Documentation */}
      <div className="border-t pt-4">
        <Button variant="outline" size="sm" onClick={() => setShowDocs(!showDocs)} className="flex items-center gap-2">
          <Code2 className="w-4 h-4" /> {showDocs ? "Ocultar" : "Ver"} documentación de la API
        </Button>

        {showDocs && (
          <div className="mt-4 bg-muted/30 rounded-xl p-5 space-y-4 text-sm">
            <h4 className="font-semibold text-foreground">API REST para sincronización CRM</h4>
            <p className="text-muted-foreground">
              Usá estas endpoints para sincronizar tus proyectos, unidades y estados desde tu CRM.
            </p>

            <div className="space-y-1">
              <Label className="text-xs">Base URL</Label>
              <div className="flex items-center gap-2">
                <code className="text-xs bg-background border rounded p-2 font-mono flex-1 break-all">{baseUrl}</code>
                <Button size="sm" variant="ghost" onClick={() => copyToClipboard(baseUrl)}>
                  <Copy className="w-3 h-3" />
                </Button>
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Autenticación</Label>
              <code className="block text-xs bg-background border rounded p-2 font-mono">
                Header: X-API-Key: tu_api_key_aqui
              </code>
            </div>

            <div className="space-y-3">
              <div>
                <code className="text-xs font-semibold text-primary">GET /projects</code>
                <p className="text-xs text-muted-foreground">Listar tus proyectos</p>
              </div>
              <div>
                <code className="text-xs font-semibold text-primary">PUT /projects</code>
                <p className="text-xs text-muted-foreground">Crear o actualizar un proyecto (upsert por slug)</p>
                <pre className="text-xs bg-background border rounded p-2 mt-1 overflow-x-auto">{`{
  "title": "Mi Proyecto",
  "slug": "mi-proyecto",
  "location_city": "Asunción",
  "status": "en_construccion",
  "price_from": 85000,
  "price_currency": "USD"
}`}</pre>
              </div>
              <div>
                <code className="text-xs font-semibold text-primary">PUT /projects/{"{slug}"}/units</code>
                <p className="text-xs text-muted-foreground">Upsert unidades (por unit_name)</p>
                <pre className="text-xs bg-background border rounded p-2 mt-1 overflow-x-auto">{`{
  "units": [
    {
      "unit_name": "1A",
      "typology": "2_dormitorios",
      "area_m2": 75,
      "price": 95000,
      "available": true,
      "floor": "1"
    }
  ]
}`}</pre>
              </div>
              <div>
                <code className="text-xs font-semibold text-primary">PATCH /units/availability</code>
                <p className="text-xs text-muted-foreground">Actualizar disponibilidad masiva</p>
                <pre className="text-xs bg-background border rounded p-2 mt-1 overflow-x-auto">{`{
  "updates": [
    { "unit_name": "1A", "project_slug": "mi-proyecto", "available": false },
    { "unit_name": "2B", "project_slug": "mi-proyecto", "available": true, "price": 98000 }
  ]
}`}</pre>
              </div>
              <div>
                <code className="text-xs font-semibold text-primary">PATCH /projects</code>
                <p className="text-xs text-muted-foreground">Actualizar estado/fases/precios de un proyecto</p>
                <pre className="text-xs bg-background border rounded p-2 mt-1 overflow-x-auto">{`{
  "slug": "mi-proyecto",
  "status": "entrega_inmediata",
  "delivery_date": "2026-06-01"
}`}</pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApiKeyManager;
