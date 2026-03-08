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

/** Deterministic daily seed for shuffling */
function getDailySeed(): number {
  const today = new Date();
  return today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
}

/** Seeded pseudo-random shuffle (Fisher-Yates with simple LCG) */
function seededShuffle<T>(arr: T[], seed: number): T[] {
  const result = [...arr];
  let s = seed;
  for (let i = result.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) & 0x7fffffff;
    const j = s % (i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function applyFilters(query: any, filters?: ProjectFilters) {
  if (filters?.city) query = query.eq("location_city", filters.city);
  if (filters?.type) query = query.eq("project_type", filters.type as any);
  if (filters?.status) query = query.eq("status", filters.status as any);
  if (filters?.priceMin != null) query = query.gte("price_from", filters.priceMin);
  if (filters?.priceMax != null) query = query.lte("price_from", filters.priceMax);
  if (filters?.developer) query = query.eq("developer_name", filters.developer);
  return query;
}

export const useProjects = (filters?: ProjectFilters) => {
  return useQuery({
    queryKey: ["projects", filters],
    queryFn: async () => {
      let query = supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

      query = applyFilters(query, filters);

      const { data, error } = await query;
      if (error) throw error;
      return data as Project[];
    },
  });
};

/** Returns 15 featured projects shuffled daily, or all matching if filters are active */
export const useFeaturedProjects = (filters?: ProjectFilters) => {
  const hasFilters = filters && Object.values(filters).some((v) => v != null && v !== "");

  return useQuery({
    queryKey: ["projects", "featured", filters, getDailySeed()],
    queryFn: async () => {
      if (hasFilters) {
        let query = supabase
          .from("projects")
          .select("*")
          .order("created_at", { ascending: false });
        query = applyFilters(query, filters);
        const { data, error } = await query;
        if (error) throw error;
        return data as Project[];
      }

      // Fetch featured projects (up to 15)
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("featured", true)
        .limit(15);
      if (error) throw error;

      return seededShuffle(data as Project[], getDailySeed());
    },
  });
};

/** Returns all non-featured projects ordered by creation date desc */
export const useNonFeaturedProjects = (filters?: ProjectFilters) => {
  const hasFilters = filters && Object.values(filters).some((v) => v != null && v !== "");

  return useQuery({
    queryKey: ["projects", "non-featured", filters],
    queryFn: async () => {
      let query = supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

      if (!hasFilters) {
        query = query.eq("featured", false);
      }

      query = applyFilters(query, filters);

      const { data, error } = await query;
      if (error) throw error;
      return data as Project[];
    },
    enabled: hasFilters ? false : true, // only fetch when no filters (filters show all in featured)
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

export interface DeveloperOption {
  name: string;
  projectCount: number;
  firstCreated: string;
}

export const useProjectDevelopers = () => {
  return useQuery({
    queryKey: ["project-developers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("developer_name, created_at");
      if (error) throw error;

      const devMap = new Map<string, { count: number; firstCreated: string }>();
      for (const row of data) {
        if (!row.developer_name) continue;
        const existing = devMap.get(row.developer_name);
        if (existing) {
          existing.count++;
          if (row.created_at < existing.firstCreated) existing.firstCreated = row.created_at;
        } else {
          devMap.set(row.developer_name, { count: 1, firstCreated: row.created_at });
        }
      }

      const developers: DeveloperOption[] = Array.from(devMap.entries()).map(
        ([name, { count, firstCreated }]) => ({ name, projectCount: count, firstCreated })
      );

      developers.sort((a, b) => {
        if (b.projectCount !== a.projectCount) return b.projectCount - a.projectCount;
        return a.firstCreated.localeCompare(b.firstCreated);
      });

      return developers;
    },
  });
};
