import { useState } from "react";
import { Heart, Share2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useFavorites, useToggleFavorite } from "@/hooks/useFavorites";
import AuthPromptDialog from "./AuthPromptDialog";

interface ProjectCardActionsProps {
  projectId: string;
  projectTitle: string;
  projectSlug: string;
}

const ProjectCardActions = ({ projectId, projectTitle, projectSlug }: ProjectCardActionsProps) => {
  const { user } = useAuth();
  const { favorites } = useFavorites();
  const toggleFavorite = useToggleFavorite();
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  const isFavorited = favorites.includes(projectId);

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      setShowAuthDialog(true);
      return;
    }
    toggleFavorite.mutate({ projectId, isFavorited });
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/proyecto/${projectSlug}`;
    const shareData = { title: projectTitle, text: `Mirá este proyecto: ${projectTitle}`, url };
    if (navigator.share) {
      try { await navigator.share(shareData); } catch {}
    } else {
      await navigator.clipboard.writeText(url);
      toast.success(`Enlace de "${projectTitle}" copiado`);
    }
  };

  return (
    <>
      <div className="absolute top-4 right-4 flex gap-1.5 z-10">
        <button
          onClick={handleShare}
          className="flex items-center justify-center w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm text-foreground/70 hover:text-foreground hover:bg-background transition-colors"
          aria-label="Compartir"
        >
          <Share2 className="w-4 h-4" />
        </button>
        <button
          onClick={handleFavorite}
          className={`flex items-center justify-center w-8 h-8 rounded-full backdrop-blur-sm transition-colors ${
            isFavorited
              ? "bg-destructive text-destructive-foreground"
              : "bg-background/80 text-foreground/70 hover:text-destructive hover:bg-background"
          }`}
          aria-label="Favorito"
        >
          <Heart className={`w-4 h-4 ${isFavorited ? "fill-current" : ""}`} />
        </button>
      </div>
      <AuthPromptDialog open={showAuthDialog} onOpenChange={setShowAuthDialog} />
    </>
  );
};

export default ProjectCardActions;
