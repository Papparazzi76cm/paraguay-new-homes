import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Project } from "./useProjects";

export const useHeroProject = () => {
  return useQuery({
    queryKey: ["hero-project"],
    queryFn: async () => {
      // 1. Get the slug from site_settings
      const { data: setting, error: settingError } = await (supabase as any)
        .from("site_settings")
        .select("value")
        .eq("key", "hero_project_slug")
        .maybeSingle();

      if (settingError) throw settingError;
      if (!setting?.value) return null;

      // 2. Fetch the project by slug
      const { data: project, error: projectError } = await supabase
        .from("projects")
        .select("*")
        .eq("slug", setting.value)
        .maybeSingle();

      if (projectError) throw projectError;
      return project as Project | null;
    },
    staleTime: 1000 * 60 * 5, // 5 min cache
  });
};
