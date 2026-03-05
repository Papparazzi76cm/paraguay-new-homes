import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Plus, Pencil, Trash2, Image } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const statusLabels: Record<string, string> = {
  preventa: "Preventa",
  en_pozo: "En Pozo",
  en_construccion: "Construcción",
  entrega_inmediata: "Entrega",
};

const DeveloperProjectsList = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: projects, isLoading } = useQuery({
    queryKey: ["dev-projects", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("developer_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("projects").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dev-projects"] });
      toast.success("Proyecto eliminado");
    },
    onError: () => toast.error("Error al eliminar"),
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-foreground">Mis Proyectos</h2>
        <Button asChild>
          <Link to="/developer/projects/new"><Plus className="w-4 h-4 mr-2" />Nuevo proyecto</Link>
        </Button>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground">Cargando...</p>
      ) : !projects?.length ? (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-lg mb-2">No tenés proyectos aún</p>
          <p className="text-sm mb-4">Creá tu primer proyecto para empezar a recibir leads.</p>
          <Button asChild>
            <Link to="/developer/projects/new"><Plus className="w-4 h-4 mr-2" />Crear proyecto</Link>
          </Button>
        </div>
      ) : (
        <div className="bg-card rounded-xl border border-border overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Ciudad</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Precio desde</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.title}</TableCell>
                  <TableCell>{p.location_city}</TableCell>
                  <TableCell><Badge variant="secondary">{statusLabels[p.status] ?? p.status}</Badge></TableCell>
                  <TableCell>{p.price_from ? `${p.price_currency} ${Number(p.price_from).toLocaleString()}` : "—"}</TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button variant="ghost" size="icon" asChild>
                      <Link to={`/developer/projects/${p.id}/images`}><Image className="w-4 h-4" /></Link>
                    </Button>
                    <Button variant="ghost" size="icon" asChild>
                      <Link to={`/developer/projects/${p.id}`}><Pencil className="w-4 h-4" /></Link>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => { if (confirm("¿Eliminar este proyecto?")) deleteMutation.mutate(p.id); }}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default DeveloperProjectsList;
