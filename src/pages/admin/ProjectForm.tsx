import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { ArrowLeft, Upload, Trash2, Star, Loader2, Plus, Minus } from "lucide-react";

const slugify = (text: string) =>
  text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const ProjectForm = () => {
  const { id } = useParams();
  const isEditing = !!id;
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [uploading, setUploading] = useState(false);

  const unitTypologies = [
    { value: "monoambiente", label: "Monoambiente" },
    { value: "1_dormitorio", label: "1 Dormitorio" },
    { value: "2_dormitorios", label: "2 Dormitorios" },
    { value: "3_dormitorios", label: "3 Dormitorios" },
    { value: "4_dormitorios", label: "4 Dormitorios" },
    { value: "5_dormitorios", label: "5 Dormitorios" },
  ];

  const [units, setUnits] = useState<Record<string, number>>({});

  const [form, setForm] = useState({
    title: "",
    slug: "",
    description: "",
    location_city: "",
    location_zone: "",
    project_type: "departamentos" as string,
    status: "en_construccion" as string,
    price_from: "",
    price_currency: "USD",
    estimated_yield: "",
    delivery_date: "",
    financing_available: false,
    featured: false,
    cover_image_url: "",
    developer_name: "",
    amenities: "",
    phase_preventa_date: "",
    phase_en_pozo_date: "",
    phase_construccion_date: "",
    phase_entrega_date: "",
    latitude: "",
    longitude: "",
  });

  const { data: existing } = useQuery({
    queryKey: ["admin-project", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("projects").select("*").eq("id", id!).single();
      if (error) throw error;
      return data;
    },
    enabled: isEditing,
  });

  const { data: images, isLoading: imagesLoading } = useQuery({
    queryKey: ["admin-project-images", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("project_images")
        .select("*")
        .eq("project_id", id!)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: isEditing,
  });

  // Load existing units
  const { data: existingUnits } = useQuery({
    queryKey: ["admin-project-units", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("project_units")
        .select("typology, id")
        .eq("project_id", id!);
      if (error) throw error;
      // Count units per typology
      const counts: Record<string, number> = {};
      for (const u of data) {
        counts[u.typology] = (counts[u.typology] || 0) + 1;
      }
      return counts;
    },
    enabled: isEditing,
  });

  useEffect(() => {
    if (existingUnits) setUnits(existingUnits);
  }, [existingUnits]);

  useEffect(() => {
    if (existing) {
      setForm({
        title: existing.title ?? "",
        slug: existing.slug ?? "",
        description: existing.description ?? "",
        location_city: existing.location_city ?? "",
        location_zone: existing.location_zone ?? "",
        project_type: existing.project_type ?? "departamentos",
        status: existing.status ?? "en_construccion",
        price_from: existing.price_from?.toString() ?? "",
        price_currency: existing.price_currency ?? "USD",
        estimated_yield: existing.estimated_yield?.toString() ?? "",
        delivery_date: existing.delivery_date ?? "",
        financing_available: existing.financing_available ?? false,
        featured: existing.featured ?? false,
        cover_image_url: existing.cover_image_url ?? "",
        developer_name: existing.developer_name ?? "",
        amenities: existing.amenities?.join(", ") ?? "",
        phase_preventa_date: (existing as any).phase_preventa_date ?? "",
        phase_en_pozo_date: (existing as any).phase_en_pozo_date ?? "",
        phase_construccion_date: (existing as any).phase_construccion_date ?? "",
        phase_entrega_date: (existing as any).phase_entrega_date ?? "",
        latitude: (existing as any).latitude?.toString() ?? "",
        longitude: (existing as any).longitude?.toString() ?? "",
      });
    }
  }, [existing]);

  const set = (key: string, value: any) => {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "title" && !isEditing) next.slug = slugify(value);
      return next;
    });
  };

  const mutation = useMutation({
    mutationFn: async () => {
      const payload = {
        title: form.title,
        slug: form.slug,
        description: form.description || null,
        location_city: form.location_city,
        location_zone: form.location_zone || null,
        project_type: form.project_type as any,
        status: form.status as any,
        price_from: form.price_from ? parseFloat(form.price_from) : null,
        price_currency: form.price_currency,
        estimated_yield: form.estimated_yield ? parseFloat(form.estimated_yield) : null,
        delivery_date: form.delivery_date || null,
        financing_available: form.financing_available,
        featured: form.featured,
        cover_image_url: form.cover_image_url || null,
        developer_name: form.developer_name || null,
        amenities: form.amenities ? form.amenities.split(",").map((a) => a.trim()).filter(Boolean) : [],
        phase_preventa_date: form.phase_preventa_date || null,
        phase_en_pozo_date: form.phase_en_pozo_date || null,
        phase_construccion_date: form.phase_construccion_date || null,
        phase_entrega_date: form.phase_entrega_date || null,
        latitude: form.latitude ? parseFloat(form.latitude) : null,
        longitude: form.longitude ? parseFloat(form.longitude) : null,
      };

      if (isEditing) {
        const { error } = await supabase.from("projects").update(payload).eq("id", id!);
        if (error) throw error;
        return id!;
      } else {
        const { data, error } = await supabase.from("projects").insert(payload).select("id").single();
        if (error) throw error;
        return data.id;
      }
    },
    onSuccess: (projectId: string) => {
      queryClient.invalidateQueries({ queryKey: ["admin-projects"] });
      toast.success(isEditing ? "Proyecto actualizado" : "Proyecto creado");
      if (!isEditing) {
        // Redirect to edit mode so images can be uploaded
        navigate(`/admin/projects/${projectId}`, { replace: true });
      }
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate();
  };

  // Image upload
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !id) return;
    setUploading(true);

    let currentCount = images?.length ?? 0;

    for (const file of Array.from(files)) {
      const fileExt = file.name.split(".").pop();
      const filePath = `${id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage.from("project-images").upload(filePath, file);
      if (uploadError) { toast.error(`Error al subir ${file.name}`); continue; }

      const { data: urlData } = supabase.storage.from("project-images").getPublicUrl(filePath);

      const { error: insertError } = await supabase.from("project_images").insert({
        project_id: id,
        image_url: urlData.publicUrl,
        alt_text: file.name,
        sort_order: ++currentCount,
      });
      if (insertError) toast.error(`Error al guardar ${file.name}`);
    }

    queryClient.invalidateQueries({ queryKey: ["admin-project-images", id] });
    toast.success(`${files.length} imagen(es) subida(s)`);
    setUploading(false);
    e.target.value = "";
  };

  // Delete image
  const deleteImage = async (imageId: string, imageUrl: string) => {
    if (!confirm("¿Eliminar esta imagen?")) return;
    const { error } = await supabase.from("project_images").delete().eq("id", imageId);
    if (error) { toast.error("Error al eliminar"); return; }
    // If it was the cover, clear it
    if (form.cover_image_url === imageUrl) {
      set("cover_image_url", "");
      await supabase.from("projects").update({ cover_image_url: null }).eq("id", id!);
    }
    queryClient.invalidateQueries({ queryKey: ["admin-project-images", id] });
    toast.success("Imagen eliminada");
  };

  // Set cover image
  const setCoverImage = async (imageUrl: string) => {
    set("cover_image_url", imageUrl);
    const { error } = await supabase.from("projects").update({ cover_image_url: imageUrl }).eq("id", id!);
    if (error) toast.error("Error al actualizar portada");
    else toast.success("Imagen de portada actualizada");
    queryClient.invalidateQueries({ queryKey: ["admin-project", id] });
  };

  return (
    <div className="max-w-3xl">
      <Button variant="ghost" className="mb-4" onClick={() => navigate("/admin/projects")}>
        <ArrowLeft className="w-4 h-4 mr-2" /> Volver
      </Button>

      <h2 className="text-2xl font-bold text-foreground mb-6">
        {isEditing ? "Editar proyecto" : "Nuevo proyecto"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Título *</Label>
            <Input value={form.title} onChange={(e) => set("title", e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label>Slug</Label>
            <Input value={form.slug} onChange={(e) => set("slug", e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label>Ciudad *</Label>
            <Input value={form.location_city} onChange={(e) => set("location_city", e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label>Zona</Label>
            <Input value={form.location_zone} onChange={(e) => set("location_zone", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Tipo de proyecto</Label>
            <Select value={form.project_type} onValueChange={(v) => set("project_type", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="departamentos">Departamentos</SelectItem>
                <SelectItem value="casas">Casas</SelectItem>
                <SelectItem value="barrio_cerrado">Barrio cerrado</SelectItem>
                <SelectItem value="mixto">Mixto</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Estado</Label>
            <Select value={form.status} onValueChange={(v) => set("status", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="preventa">Preventa</SelectItem>
                <SelectItem value="en_pozo">En Pozo</SelectItem>
                <SelectItem value="en_construccion">En Construcción</SelectItem>
                <SelectItem value="entrega_inmediata">Entrega Inmediata</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Desarrollador</Label>
            <Input value={form.developer_name} onChange={(e) => set("developer_name", e.target.value)} />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Descripción</Label>
          <Textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={4} />
        </div>

        {/* Pricing */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Precio desde</Label>
            <Input type="number" value={form.price_from} onChange={(e) => set("price_from", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Moneda</Label>
            <Select value={form.price_currency} onValueChange={(v) => set("price_currency", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="PYG">PYG</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Rendimiento estimado (%)</Label>
            <Input type="number" step="0.1" value={form.estimated_yield} onChange={(e) => set("estimated_yield", e.target.value)} />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Amenities (separados por coma)</Label>
          <Input value={form.amenities} onChange={(e) => set("amenities", e.target.value)} placeholder="Piscina, Gym, Quincho" />
        </div>

        {/* Phase dates */}
        <div>
          <h3 className="font-semibold text-foreground mb-3">Fechas del cronograma</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Fecha preventa</Label>
              <Input value={form.phase_preventa_date} onChange={(e) => set("phase_preventa_date", e.target.value)} placeholder="Ej: Marzo 2024" />
            </div>
            <div className="space-y-2">
              <Label>Fecha en pozo</Label>
              <Input value={form.phase_en_pozo_date} onChange={(e) => set("phase_en_pozo_date", e.target.value)} placeholder="Ej: Julio 2024" />
            </div>
            <div className="space-y-2">
              <Label>Fecha construcción</Label>
              <Input value={form.phase_construccion_date} onChange={(e) => set("phase_construccion_date", e.target.value)} placeholder="Ej: Enero 2025" />
            </div>
            <div className="space-y-2">
              <Label>Fecha entrega</Label>
              <Input value={form.phase_entrega_date} onChange={(e) => set("phase_entrega_date", e.target.value)} placeholder="Ej: Diciembre 2025" />
            </div>
          </div>
        </div>

        {/* Location coordinates */}
        <div>
          <h3 className="font-semibold text-foreground mb-3">Coordenadas del mapa</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Latitud</Label>
              <Input type="number" step="any" value={form.latitude} onChange={(e) => set("latitude", e.target.value)} placeholder="Ej: -25.2637" />
            </div>
            <div className="space-y-2">
              <Label>Longitud</Label>
              <Input type="number" step="any" value={form.longitude} onChange={(e) => set("longitude", e.target.value)} placeholder="Ej: -57.5759" />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Fecha de entrega general</Label>
          <Input value={form.delivery_date} onChange={(e) => set("delivery_date", e.target.value)} placeholder="Ej: Q4 2025" />
        </div>

        {/* Toggles */}
        <div className="flex flex-wrap gap-6">
          <div className="flex items-center gap-2">
            <Switch checked={form.financing_available} onCheckedChange={(v) => set("financing_available", v)} />
            <Label>Financiamiento disponible</Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch checked={form.featured} onCheckedChange={(v) => set("featured", v)} />
            <Label>Destacado</Label>
          </div>
        </div>

        <Button type="submit" disabled={mutation.isPending} className="w-full md:w-auto">
          {mutation.isPending ? "Guardando..." : isEditing ? "Guardar cambios" : "Crear proyecto"}
        </Button>
      </form>

      {/* Images section — only visible after project is saved */}
      {isEditing && (
        <div className="mt-10 border-t border-border pt-8">
          <h3 className="text-xl font-bold text-foreground mb-2">Imágenes del proyecto</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Subí imágenes y hacé clic en la estrella para elegir la imagen de portada.
          </p>

          <div className="mb-6">
            <Label htmlFor="img-upload" className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition">
              {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              {uploading ? "Subiendo..." : "Subir imágenes"}
            </Label>
            <Input id="img-upload" type="file" accept="image/*" multiple className="hidden" onChange={handleUpload} disabled={uploading} />
          </div>

          {imagesLoading ? (
            <p className="text-muted-foreground">Cargando imágenes...</p>
          ) : !images?.length ? (
            <p className="text-muted-foreground">No hay imágenes aún. Subí la primera.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((img) => {
                const isCover = form.cover_image_url === img.image_url;
                return (
                  <div key={img.id} className={`relative group rounded-xl overflow-hidden border-2 transition-colors ${isCover ? "border-primary ring-2 ring-primary/30" : "border-border"}`}>
                    <img src={img.image_url} alt={img.alt_text ?? ""} className="w-full h-40 object-cover" />
                    {isCover && (
                      <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs font-medium px-2 py-1 rounded-md flex items-center gap-1">
                        <Star className="w-3 h-3 fill-current" /> Portada
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                      {!isCover && (
                        <Button size="sm" variant="secondary" className="text-xs" onClick={() => setCoverImage(img.image_url)}>
                          <Star className="w-3 h-3 mr-1" /> Portada
                        </Button>
                      )}
                      <Button size="sm" variant="destructive" className="text-xs" onClick={() => deleteImage(img.id, img.image_url)}>
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {!isEditing && (
        <p className="mt-6 text-sm text-muted-foreground italic">
          Guardá el proyecto primero para poder subir imágenes.
        </p>
      )}
    </div>
  );
};

export default ProjectForm;