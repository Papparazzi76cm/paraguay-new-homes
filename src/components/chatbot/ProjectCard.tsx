import { MapPin, TrendingUp } from "lucide-react";
import type { Project } from "@/hooks/useProjects";

const statusLabels: Record<string, string> = {
  en_pozo: "En pozo",
  en_construccion: "En construcción",
  entrega_inmediata: "Entrega inmediata",
};

const ProjectCard = ({ project }: { project: Project }) => {
  return (
    <a
      href={`/proyecto/${project.slug}`}
      className="block rounded-xl border bg-background overflow-hidden hover:shadow-md transition-shadow group"
    >
      <div className="h-24 bg-muted overflow-hidden">
        {project.cover_image_url ? (
          <img
            src={project.cover_image_url}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
            Sin imagen
          </div>
        )}
      </div>
      <div className="p-2.5 space-y-1">
        <p className="text-xs font-semibold text-foreground leading-tight line-clamp-1">
          {project.title}
        </p>
        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
          <MapPin className="w-3 h-3 flex-shrink-0" />
          <span className="truncate">{project.location_city}</span>
          <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium whitespace-nowrap">
            {statusLabels[project.status] || project.status}
          </span>
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
            <span className="flex items-center gap-0.5 text-[10px] text-emerald-600 font-medium">
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
