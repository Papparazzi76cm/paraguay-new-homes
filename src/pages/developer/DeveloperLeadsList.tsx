import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

const DeveloperLeadsList = () => {
  const { user } = useAuth();

  const { data: leads, isLoading } = useQuery({
    queryKey: ["dev-matched-leads", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_matched_leads_for_developer", {
        _developer_id: user!.id,
      });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  return (
    <div>
      <h2 className="text-2xl font-bold text-foreground mb-2">Leads cualificados</h2>
      <p className="text-sm text-muted-foreground mb-6">
        Solo se muestran inversores cuyas preferencias coinciden en al menos 3 criterios con tus unidades disponibles.
      </p>

      {isLoading ? (
        <p className="text-muted-foreground">Cargando...</p>
      ) : !leads?.length ? (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-lg mb-2">No hay leads cualificados aún</p>
          <p className="text-sm">Los leads aparecerán cuando sus preferencias coincidan con tus proyectos y unidades.</p>
        </div>
      ) : (
        <div className="bg-card rounded-xl border border-border overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead>Coincidencias</TableHead>
                <TableHead>Fecha</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leads.map((l: any) => (
                <TableRow key={l.lead_id}>
                  <TableCell className="font-medium">{l.full_name}</TableCell>
                  <TableCell>{l.email}</TableCell>
                  <TableCell>{l.phone ?? "—"}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{l.match_count}/5</Badge>
                  </TableCell>
                  <TableCell>{format(new Date(l.created_at), "dd/MM/yyyy")}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default DeveloperLeadsList;
