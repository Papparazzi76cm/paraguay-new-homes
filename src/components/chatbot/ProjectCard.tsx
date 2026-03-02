import { useState } from "react";
import { MapPin, TrendingUp } from "lucide-react";
import type { Project } from "@/hooks/useProjects";

const statusLabels: Record<string, string> = {
  preventa: "Preventa",
  en_pozo: "En pozo",
  en_construccion: "En construcción",
  entrega_inmediata: "Entrega inmediata",
};

const ProjectCard = ({ project }: { project: Project }) => {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);

  return (
    <a
      href={`/proyecto/${project.slug}`}
      className="block rounded-xl border border-border bg-card overflow-hidden group transition-all duration-300 hover:shadow-card-hover hover:-translate-y-0.5 hover:border-primary/30"
    >
      <div className="h-24 bg-muted overflow-hidden relative">
        {project.cover_image_url && !imgError ? (
          <>
            {/* Skeleton */}
            {!imgLoaded && (
              <div className="absolute inset-0 bg-muted animate-pulse" />
            )}
            <img
              src={project.cover_image_url}
              alt={project.title}
              className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-110 ${imgLoaded ? "opacity-100" : "opacity-0"}`}
              onLoad={() => setImgLoaded(true)}
              onError={() => setImgError(true)}
              loading="lazy"
            />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
            Sin imagen
          </div>
        )}
        {/* Status badge overlay */}
        <span className="absolute top-1.5 right-1.5 text-[9px] px-1.5 py-0.5 rounded-full bg-background/80 backdrop-blur-sm text-primary font-medium whitespace-nowrap">
          {statusLabels[project.status] || project.status}
        </span>
      </div>
      <div className="p-2.5 space-y-1">
        <p className="text-xs font-semibold text-card-foreground leading-tight line-clamp-1 group-hover:text-primary transition-colors">
          {project.title}
        </p>
        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
          <MapPin className="w-3 h-3 flex-shrink-0" />
          <span className="truncate">{project.location_city}</span>
        </div>
        <div className="flex items-center justify-between">
          {project.price_from ? (
            <p className="text-xs font-bold text-primary">
              {project.price_currency} {project.price_from.toLocaleString()}
            </p>
          ) : (
            <p className="text-[10px] text-muted-foreground">Consultar precio</p>
          )}
          {project.estimated_yield != null && (
            <span className="flex items-center gap-0.5 text-[10px] text-primary font-medium">
              <TrendingUp className="w-3 h-3" />
              {project.estimated_yield}%
            </span>
          )}
        </div>
      </div>
    </a>
  );
};

export default ProjectCard;
