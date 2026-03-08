import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ChevronDown, ChevronUp, Plus, Trash2, Upload, Loader2, Image, Map, Eye } from "lucide-react";

interface UnitDetailEditorProps {
  projectId: string;
}

const FLOOR_OPTIONS = [
  { value: "planta_baja", label: "Planta Baja" },
  ...Array.from({ length: 100 }, (_, i) => ({
    value: `piso_${i + 1}`,
    label: `Piso ${i + 1}`,
  })),
  { value: "penthouse", label: "Penthouse" },
];

const MEDIA_TYPES = [
  { value: "photo", label: "Fotos", icon: Image },
  { value: "floor_plan", label: "Planos", icon: Map },
  { value: "virtual_tour", label: "Recorrido Virtual 360", icon: Eye },
];

const UnitDetailEditor = ({ projectId }: UnitDetailEditorProps) => {
  const queryClient = useQueryClient();
  const [expandedUnit, setExpandedUnit] = useState<string | null>(null);
  const [uploading, setUploading] = useState<Record<string, boolean>>({});
  const [newType, setNewType] = useState("");

  const { data: units, isLoading } = useQuery({
    queryKey: ["admin-project-units-detail", projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("project_units")
        .select("*")
        .eq("project_id", projectId)
        .order("typology", { ascending: true })
        .order("unit_name", { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: !!projectId,
  });

  // Get unique custom types used in this project
  const existingTypes = [...new Set(units?.map((u) => (u as any).unit_type).filter(Boolean) || [])];

  const { data: allMedia } = useQuery({
    queryKey: ["admin-unit-media", projectId],
    queryFn: async () => {
      if (!units?.length) return {};
      const unitIds = units.map((u) => u.id);
      const { data, error } = await supabase
        .from("unit_media" as any)
        .select("*")
        .in("unit_id", unitIds)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      const grouped: Record<string, any[]> = {};
      for (const m of data as any[]) {
        if (!grouped[m.unit_id]) grouped[m.unit_id] = [];
        grouped[m.unit_id].push(m);
      }
      return grouped;
    },
    enabled: !!units?.length,
  });

  const updateUnit = async (unitId: string, field: string, value: string) => {
    const { error } = await supabase
      .from("project_units")
      .update({ [field]: value } as any)
      .eq("id", unitId);
    if (error) toast.error("Error al actualizar");
    else {
      queryClient.invalidateQueries({ queryKey: ["admin-project-units-detail", projectId] });
    }
  };

  const handleMediaUpload = async (unitId: string, mediaType: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const key = `${unitId}-${mediaType}`;
    setUploading((prev) => ({ ...prev, [key]: true }));

    for (const file of Array.from(files)) {
      const fileExt = file.name.split(".").pop();
      const filePath = `units/${unitId}/${mediaType}/${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage.from("project-images").upload(filePath, file);
      if (uploadError) {
        toast.error(`Error al subir ${file.name}`);
        continue;
      }

      const { data: urlData } = supabase.storage.from("project-images").getPublicUrl(filePath);

      if (mediaType === "virtual_tour") {
        // For virtual tours, store the URL directly (user may also paste a link)
      }

      const { error: insertError } = await supabase.from("unit_media" as any).insert({
        unit_id: unitId,
        media_type: mediaType,
        media_url: urlData.publicUrl,
        alt_text: file.name,
        sort_order: 0,
      } as any);
      if (insertError) toast.error(`Error al guardar ${file.name}`);
    }

    queryClient.invalidateQueries({ queryKey: ["admin-unit-media", projectId] });
    toast.success("Archivo(s) subido(s)");
    setUploading((prev) => ({ ...prev, [key]: false }));
    e.target.value = "";
  };

  const addVirtualTourUrl = async (unitId: string, url: string) => {
    if (!url.trim()) return;
    const { error } = await supabase.from("unit_media" as any).insert({
      unit_id: unitId,
      media_type: "virtual_tour",
      media_url: url.trim(),
      alt_text: "Recorrido virtual 360",
      sort_order: 0,
    } as any);
    if (error) toast.error("Error al guardar URL");
    else {
      queryClient.invalidateQueries({ queryKey: ["admin-unit-media", projectId] });
      toast.success("Recorrido virtual agregado");
    }
  };

  const deleteMedia = async (mediaId: string) => {
    const { error } = await supabase.from("unit_media" as any).delete().eq("id", mediaId);
    if (error) toast.error("Error al eliminar");
    else {
      queryClient.invalidateQueries({ queryKey: ["admin-unit-media", projectId] });
      toast.success("Archivo eliminado");
    }
  };

  const addCustomType = () => {
    if (newType.trim() && !existingTypes.includes(newType.trim())) {
      setNewType("");
    }
  };

  if (isLoading) return <p className="text-muted-foreground text-sm">Cargando unidades...</p>;
  if (!units?.length) return <p className="text-muted-foreground text-sm">No hay unidades creadas aún.</p>;

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-foreground">Detalle de unidades</h3>
      <p className="text-sm text-muted-foreground mb-2">
        Configurá altura, tipo y multimedia para cada unidad.
      </p>

      <div className="space-y-2">
        {units.map((unit) => {
          const isExpanded = expandedUnit === unit.id;
          const unitMedia = allMedia?.[unit.id] || [];
          const photos = unitMedia.filter((m: any) => m.media_type === "photo");
          const plans = unitMedia.filter((m: any) => m.media_type === "floor_plan");
          const tours = unitMedia.filter((m: any) => m.media_type === "virtual_tour");

          return (
            <div key={unit.id} className="border border-border rounded-xl overflow-hidden">
              {/* Header */}
              <button
                type="button"
                onClick={() => setExpandedUnit(isExpanded ? null : unit.id)}
                className="w-full flex items-center justify-between px-4 py-3 bg-muted/30 hover:bg-muted/50 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-foreground">{unit.unit_name}</span>
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-md">
                    {unit.typology.replace(/_/g, " ")}
                  </span>
                  {(unit as any).unit_type && (
                    <span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                      {(unit as any).unit_type}
                    </span>
                  )}
                  {unit.floor && (
                    <span className="text-xs text-muted-foreground">
                      {unit.floor.replace(/_/g, " ")}
                    </span>
                  )}
                </div>
                {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
              </button>

              {/* Expanded content */}
              {isExpanded && (
                <div className="px-4 py-4 space-y-5 bg-background">
                  {/* Floor & Type */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs">Altura</Label>
                      <Select
                        value={unit.floor || ""}
                        onValueChange={(v) => updateUnit(unit.id, "floor", v)}
                      >
                        <SelectTrigger><SelectValue placeholder="Seleccionar piso" /></SelectTrigger>
                        <SelectContent className="max-h-60">
                          {FLOOR_OPTIONS.map((f) => (
                            <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">Tipo (denominación)</Label>
                      <div className="flex gap-2">
                        <Select
                          value={(unit as any).unit_type || ""}
                          onValueChange={(v) => updateUnit(unit.id, "unit_type", v)}
                        >
                          <SelectTrigger><SelectValue placeholder="Seleccionar o crear tipo" /></SelectTrigger>
                          <SelectContent>
                            {existingTypes.map((t) => (
                              <SelectItem key={t} value={t}>{t}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <div className="flex gap-1">
                          <Input
                            placeholder="Nuevo tipo..."
                            value={newType}
                            onChange={(e) => setNewType(e.target.value)}
                            className="w-32 text-xs"
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                if (newType.trim()) {
                                  updateUnit(unit.id, "unit_type", newType.trim());
                                  setNewType("");
                                }
                              }
                            }}
                          />
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              if (newType.trim()) {
                                updateUnit(unit.id, "unit_type", newType.trim());
                                setNewType("");
                              }
                            }}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Media sections */}
                  {MEDIA_TYPES.map((mt) => {
                    const items = mt.value === "photo" ? photos : mt.value === "floor_plan" ? plans : tours;
                    const uploadKey = `${unit.id}-${mt.value}`;
                    const isUploading = uploading[uploadKey];
                    const Icon = mt.icon;

                    return (
                      <div key={mt.value} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Icon className="w-4 h-4 text-muted-foreground" />
                            <Label className="text-xs font-medium">{mt.label}</Label>
                            <span className="text-xs text-muted-foreground">({items.length})</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {mt.value === "virtual_tour" && (
                              <VirtualTourInput onAdd={(url) => addVirtualTourUrl(unit.id, url)} />
                            )}
                            <Label
                              htmlFor={`upload-${uploadKey}`}
                              className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-muted hover:bg-muted/80 text-foreground text-xs rounded-lg transition-colors"
                            >
                              {isUploading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3" />}
                              {isUploading ? "Subiendo..." : "Subir"}
                            </Label>
                            <Input
                              id={`upload-${uploadKey}`}
                              type="file"
                              accept={mt.value === "virtual_tour" ? "image/*,video/*" : "image/*"}
                              multiple
                              className="hidden"
                              onChange={(e) => handleMediaUpload(unit.id, mt.value, e)}
                              disabled={isUploading}
                            />
                          </div>
                        </div>

                        {items.length > 0 && (
                          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                            {items.map((media: any) => (
                              <div key={media.id} className="relative group rounded-lg overflow-hidden border border-border">
                                {media.media_type === "virtual_tour" && !media.media_url.includes("project-images") ? (
                                  <div className="w-full h-20 bg-muted flex items-center justify-center">
                                    <Eye className="w-5 h-5 text-muted-foreground" />
                                  </div>
                                ) : (
                                  <img src={media.media_url} alt={media.alt_text ?? ""} className="w-full h-20 object-cover" />
                                )}
                                <button
                                  type="button"
                                  onClick={() => deleteMedia(media.id)}
                                  className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-md p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Small inline component for adding a virtual tour URL
const VirtualTourInput = ({ onAdd }: { onAdd: (url: string) => void }) => {
  const [url, setUrl] = useState("");
  return (
    <div className="flex gap-1">
      <Input
        placeholder="URL 360..."
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="w-36 h-7 text-xs"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            onAdd(url);
            setUrl("");
          }
        }}
      />
      <Button
        type="button"
        size="sm"
        variant="outline"
        className="h-7 px-2"
        onClick={() => { onAdd(url); setUrl(""); }}
      >
        <Plus className="w-3 h-3" />
      </Button>
    </div>
  );
};

export default UnitDetailEditor;
