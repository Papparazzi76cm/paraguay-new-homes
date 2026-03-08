import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export const useFavorites = () => {
  const { user } = useAuth();

  const { data: favorites = [], isLoading } = useQuery({
    queryKey: ["user-favorites", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_favorites" as any)
        .select("project_id")
        .eq("user_id", user!.id);
      if (error) throw error;
      return (data as any[]).map((f: any) => f.project_id as string);
    },
    enabled: !!user,
  });

  return { favorites, isLoading, user };
};

export const useToggleFavorite = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ projectId, isFavorited }: { projectId: string; isFavorited: boolean }) => {
      if (!user) throw new Error("Not authenticated");
      if (isFavorited) {
        const { error } = await (supabase.from("user_favorites" as any) as any)
          .delete()
          .eq("user_id", user.id)
          .eq("project_id", projectId);
        if (error) throw error;
      } else {
        const { error } = await (supabase.from("user_favorites" as any) as any)
          .insert({ user_id: user.id, project_id: projectId });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-favorites"] });
    },
  });
};
