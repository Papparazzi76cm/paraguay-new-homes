import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type Project = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  location_city: string;
  location_zone: string | null;
  project_type: "departamentos" | "casas" | "barrio_cerrado" | "mixto";
  status: "preventa" | "en_pozo" | "en_construccion" | "entrega_inmediata";
  price_from: number | null;
  price_currency: string;
  estimated_yield: number | null;
  delivery_date: string | null;
  financing_available: boolean | null;
  amenities: string[] | null;
  featured: boolean | null;
  cover_image_url: string | null;
  developer_name: string | null;
  created_at: string;
  phase_preventa_date: string | null;
  phase_en_pozo_date: string | null;
  phase_construccion_date: string | null;
  phase_entrega_date: string | null;
  latitude: number | null;
  longitude: number | null;
};

export interface ProjectFilters {
  city?: string;
  type?: string;
  status?: string;
  priceMin?: number;
  priceMax?: number;
  developer?: string;
}

export const useProjects = (filters?: ProjectFilters) => {
  return useQuery({
    queryKey: ["projects", filters],
    queryFn: async () => {
      let query = supabase
        .from("projects")
        .select("*")
        .order("featured", { ascending: false })
        .order("created_at", { ascending: false });

      if (filters?.city) query = query.eq("location_city", filters.city);
      if (filters?.type) query = query.eq("project_type", filters.type as any);
      if (filters?.status) query = query.eq("status", filters.status as any);
      if (filters?.priceMin != null) query = query.gte("price_from", filters.priceMin);
      if (filters?.priceMax != null) query = query.lte("price_from", filters.priceMax);
      if (filters?.developer) query = query.eq("developer_name", filters.developer);

      const { data, error } = await query;
      if (error) throw error;
      return data as Project[];
    },
  });
};

export const useFeaturedProjects = (filters?: ProjectFilters) => {
  const hasFilters = filters && Object.values(filters).some((v) => v != null && v !== "");

  return useQuery({
    queryKey: ["projects", "featured", filters],
    queryFn: async () => {
      let query = supabase
        .from("projects")
        .select("*")
        .order("featured", { ascending: false });

      if (filters?.city) query = query.eq("location_city", filters.city);
      if (filters?.type) query = query.eq("project_type", filters.type as any);
      if (filters?.status) query = query.eq("status", filters.status as any);
      if (filters?.priceMin != null) query = query.gte("price_from", filters.priceMin);
      if (filters?.priceMax != null) query = query.lte("price_from", filters.priceMax);

      if (!hasFilters) query = query.limit(6);

      const { data, error } = await query;
      if (error) throw error;
      return data as Project[];
    },
  });
};

export const useProjectCities = () => {
  return useQuery({
    queryKey: ["project-cities"],
    queryFn: async () => {
      const { data, error } = await supabase.from("projects").select("location_city");
      if (error) throw error;
      const cities = [...new Set(data.map((d) => d.location_city))];
      return cities;
    },
  });
};
