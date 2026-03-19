import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ArrowLeft, Trash2, GripVertical } from "lucide-react";
import ImageOptimizer from "@/components/ImageOptimizer";
import { ArrowLeft, Trash2, Upload, GripVertical } from "lucide-react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface SortableImageProps {
  image: { id: string; image_url: string; alt_text: string | null };
  onDelete: (id: string) => void;
}

const SortableImage = ({ image, onDelete }: SortableImageProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: image.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : undefined,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative group rounded-xl overflow-hidden border border-border">
      <button
        {...attributes}
        {...listeners}
        className="absolute top-2 left-2 z-10 p-1.5 rounded-lg bg-background/80 backdrop-blur-sm text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
      >
        <GripVertical className="w-4 h-4" />
      </button>
      <img src={image.image_url} alt={image.alt_text ?? ""} className="w-full h-40 object-cover" />
      <Button
        variant="destructive"
        size="icon"
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={() => {
          if (confirm("¿Eliminar esta imagen?")) onDelete(image.id);
        }}
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );
};

const ProjectImages = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [uploading, setUploading] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

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

  const reorderMutation = useMutation({
    mutationFn: async (orderedIds: string[]) => {
      const updates = orderedIds.map((imgId, index) =>
        supabase.from("project_images").update({ sort_order: index + 1 }).eq("id", imgId)
      );
      await Promise.all(updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-project-images", id] });
    },
    onError: () => toast.error("Error al reordenar"),
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id || !images) return;

    const oldIndex = images.findIndex((img) => img.id === active.id);
    const newIndex = images.findIndex((img) => img.id === over.id);
    const reordered = arrayMove(images, oldIndex, newIndex);

    // Optimistic update
    queryClient.setQueryData(["admin-project-images", id], reordered);
    reorderMutation.mutate(reordered.map((img) => img.id));
  };

  const handleOptimizedUpload = async (files: File[]) => {
    if (!id) return;
    setUploading(true);

    let currentCount = images?.length ?? 0;

    for (const file of files) {
      const filePath = `${id}/${Date.now()}-${Math.random().toString(36).slice(2)}.webp`;

      const { error: uploadError } = await supabase.storage
        .from("project-images")
        .upload(filePath, file);

      if (uploadError) {
        toast.error(`Error al subir ${file.name}`);
        continue;
      }

      const { data: urlData } = supabase.storage.from("project-images").getPublicUrl(filePath);

      const { error: insertError } = await supabase.from("project_images").insert({
        project_id: id,
        image_url: urlData.publicUrl,
        alt_text: file.name,
        sort_order: ++currentCount,
      });

      if (insertError) {
        toast.error(`Error al guardar ${file.name}`);
      }
    }

    queryClient.invalidateQueries({ queryKey: ["admin-project-images", id] });
    toast.success(`${files.length} imagen(es) subida(s)`);
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
      <p className="text-sm text-muted-foreground mb-4">Arrastrá las imágenes para reordenarlas.</p>

      <div className="mb-6">
        <Label htmlFor="upload" className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition">
          <Upload className="w-4 h-4" />
          {uploading ? "Subiendo..." : "Subir imagen"}
        </Label>
        <Input id="upload" type="file" accept="image/*" multiple className="hidden" onChange={handleUpload} disabled={uploading} />
      </div>

      {isLoading ? (
        <p className="text-muted-foreground">Cargando...</p>
      ) : !images?.length ? (
        <p className="text-muted-foreground">No hay imágenes aún.</p>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={images.map((img) => img.id)} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((img) => (
                <SortableImage key={img.id} image={img} onDelete={(imgId) => deleteMutation.mutate(imgId)} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
};

export default ProjectImages;
