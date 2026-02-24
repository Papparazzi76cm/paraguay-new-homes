import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Project } from "./useProjects";

export const useProjectBySlug = (slug: string) => {
  return useQuery({
    queryKey: ["project", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("slug", slug)
        .single();
      if (error) throw error;
      return data as Project;
    },
    enabled: !!slug,
  });
};

export const useProjectImages = (projectId: string) => {
  return useQuery({
    queryKey: ["project-images", projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("project_images")
        .select("*")
        .eq("project_id", projectId)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: !!projectId,
  });
};
