import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import {
  Star, MapPin, Award, Layout, Search, Share2, Globe, Video, Image, FileText,
  Home, Box, Glasses, Landmark, BarChart3, TrendingUp, Monitor, Building, Users, Key,
  ShoppingBag, Loader2, CheckCircle2
} from "lucide-react";
import { useState } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Star, MapPin, Award, Layout, Search, Share2, Globe, Video, Image, FileText,
  Home, Box, Glasses, Landmark, BarChart3, TrendingUp, Monitor, Building, Users, Key
};

const categoryLabels: Record<string, { title: string; description: string }> = {
  posicionamiento: {
    title: "📌 Posicionamiento destacado",
    description: "Destaca tus proyectos con máxima visibilidad en la plataforma."
  },
  marketing: {
    title: "📣 Marketing inmobiliario",
    description: "Campañas y contenido profesional para atraer compradores."
  },
  servicios: {
    title: "🏠 Ecosistema de servicios",
    description: "Servicios complementarios para potenciar tus ventas."
  },
  datos: {
    title: "📊 Datos de mercado",
    description: "Informes exclusivos con datos reales del mercado inmobiliario."
  },
  saas: {
    title: "💻 Licencias de software",
    description: "Tu propio portal inmobiliario con tecnología Tekoha."
  },
  crowdfunding: {
    title: "🤝 Crowdfunding inmobiliario",
    description: "Abre tus proyectos a micro-inversores y amplía tu financiación."
  },
  llave_en_mano: {
    title: "🔑 Proyectos llave en mano",
    description: "Publica suelo, proyecto y viabilidad para atraer inversores."
  },
};

interface Service {
  id: string;
  category: string;
  title: string;
  description: string | null;
  price_label: string | null;
  icon_name: string | null;
}

const Marketplace = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [notes, setNotes] = useState("");

  const { data: services, isLoading } = useQuery({
    queryKey: ["marketplace-services"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("marketplace_services")
        .select("*")
        .eq("active", true)
        .order("sort_order");
      if (error) throw error;
      return data as Service[];
    },
  });

  const requestMutation = useMutation({
    mutationFn: async () => {
      if (!selectedService || !user) return;
      const { error } = await supabase.from("service_requests").insert({
        user_id: user.id,
        service_id: selectedService.id,
        service_title: selectedService.title,
        notes: notes || null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("¡Solicitud enviada! Te contactaremos pronto.");
      setSelectedService(null);
      setNotes("");
      queryClient.invalidateQueries({ queryKey: ["dev-request-count"] });
    },
    onError: () => {
      toast.error("Error al enviar la solicitud.");
    },
  });

  // Group by category
  const grouped = (services ?? []).reduce<Record<string, Service[]>>((acc, s) => {
    if (!acc[s.category]) acc[s.category] = [];
    acc[s.category].push(s);
    return acc;
  }, {});

  const categoryOrder = ["posicionamiento", "marketing", "servicios", "datos", "saas", "crowdfunding", "llave_en_mano"];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">Marketplace</h2>
        <p className="text-muted-foreground">Potenciá tu negocio con servicios adicionales diseñados para desarrolladores inmobiliarios.</p>
      </div>

      {categoryOrder.map((cat) => {
        const items = grouped[cat];
        if (!items?.length) return null;
        const catInfo = categoryLabels[cat] ?? { title: cat, description: "" };

        return (
          <section key={cat} className="mb-10">
            <h3 className="text-lg font-semibold text-foreground mb-1">{catInfo.title}</h3>
            <p className="text-sm text-muted-foreground mb-4">{catInfo.description}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((service) => {
                const IconComp = iconMap[service.icon_name ?? ""] ?? ShoppingBag;
                return (
                  <button
                    key={service.id}
                    onClick={() => setSelectedService(service)}
                    className="bg-card border border-border rounded-xl p-5 text-left hover:border-primary/40 hover:shadow-md transition-all group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <IconComp className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-foreground text-sm mb-1">{service.title}</h4>
                        {service.description && (
                          <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{service.description}</p>
                        )}
                        {service.price_label && (
                          <span className="inline-block text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                            {service.price_label}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        );
      })}

      {/* Request dialog */}
      <Dialog open={!!selectedService} onOpenChange={(open) => !open && setSelectedService(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Solicitar servicio</DialogTitle>
            <DialogDescription>
              {selectedService?.title} — {selectedService?.price_label}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">{selectedService?.description}</p>
            <Textarea
              placeholder="Notas adicionales (opcional)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedService(null)}>Cancelar</Button>
            <Button onClick={() => requestMutation.mutate()} disabled={requestMutation.isPending}>
              {requestMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <CheckCircle2 className="w-4 h-4 mr-2" />
              )}
              Enviar solicitud
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Marketplace;
