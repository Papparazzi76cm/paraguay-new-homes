import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ArrowLeft, Trash2, Upload } from "lucide-react";

const ProjectImages = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [uploading, setUploading] = useState(false);

  const { data: project } = useQuery({
    queryKey: ["admin-project", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("projects").select("title").eq("id", id!).single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const { data: images, isLoading } = useQuery({
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
    enabled: !!id,
  });

  const deleteMutation = useMutation({
    mutationFn: async (imageId: string) => {
      const { error } = await supabase.from("project_images").delete().eq("id", imageId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-project-images", id] });
      toast.success("Imagen eliminada");
    },
  });

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !id) return;
    setUploading(true);

    const fileExt = file.name.split(".").pop();
    const filePath = `${id}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("project-images")
      .upload(filePath, file);

    if (uploadError) {
      toast.error("Error al subir imagen");
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from("project-images").getPublicUrl(filePath);

    const { error: insertError } = await supabase.from("project_images").insert({
      project_id: id,
      image_url: urlData.publicUrl,
      alt_text: file.name,
      sort_order: (images?.length ?? 0) + 1,
    });

    if (insertError) {
      toast.error("Error al guardar referencia");
    } else {
      queryClient.invalidateQueries({ queryKey: ["admin-project-images", id] });
      toast.success("Imagen subida");
    }
    setUploading(false);
  };

  return (
    <div>
      <Button variant="ghost" className="mb-4" onClick={() => navigate("/admin/projects")}>
        <ArrowLeft className="w-4 h-4 mr-2" /> Volver
      </Button>

      <h2 className="text-2xl font-bold text-foreground mb-2">
        Imágenes: {project?.title ?? "..."}
      </h2>

      <div className="mb-6">
        <Label htmlFor="upload" className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition">
          <Upload className="w-4 h-4" />
          {uploading ? "Subiendo..." : "Subir imagen"}
        </Label>
        <Input id="upload" type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
      </div>

      {isLoading ? (
        <p className="text-muted-foreground">Cargando...</p>
      ) : images?.length === 0 ? (
        <p className="text-muted-foreground">No hay imágenes aún.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images?.map((img) => (
            <div key={img.id} className="relative group rounded-xl overflow-hidden border border-border">
              <img src={img.image_url} alt={img.alt_text ?? ""} className="w-full h-40 object-cover" />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => {
                  if (confirm("¿Eliminar esta imagen?")) deleteMutation.mutate(img.id);
                }}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectImages;
