import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type UnitTypology = "monoambiente" | "1_dormitorio" | "2_dormitorios" | "3_dormitorios";

export interface ProjectUnit {
  id: string;
  project_id: string;
  unit_name: string;
  typology: UnitTypology;
  area_m2: number | null;
  price: number | null;
  price_currency: string;
  floor: string | null;
  available: boolean;
  created_at: string;
}

export interface UnitFilters {
  typology?: UnitTypology;
  priceMin?: number;
  priceMax?: number;
}

export const useProjectUnits = (projectId: string, filters?: UnitFilters) => {
  return useQuery({
    queryKey: ["project-units", projectId, filters],
    queryFn: async () => {
      let query = supabase
        .from("project_units")
        .select("*")
        .eq("project_id", projectId)
        .eq("available", true)
        .order("price", { ascending: true, nullsFirst: false });

      if (filters?.typology) query = query.eq("typology", filters.typology);
      if (filters?.priceMin != null) query = query.gte("price", filters.priceMin);
      if (filters?.priceMax != null) query = query.lte("price", filters.priceMax);

      const { data, error } = await query;
      if (error) throw error;
      return data as ProjectUnit[];
    },
    enabled: !!projectId,
  });
};
