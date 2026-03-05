import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useProjectCities } from "@/hooks/useProjects";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const projectTypes = [
  { value: "departamentos", label: "Departamentos" },
  { value: "casas", label: "Casas" },
  { value: "barrio_cerrado", label: "Barrio cerrado" },
  { value: "mixto", label: "Mixto" },
];

const typologies = [
  { value: "monoambiente", label: "Monoambiente" },
  { value: "1_dormitorio", label: "1 Dormitorio" },
  { value: "2_dormitorios", label: "2 Dormitorios" },
  { value: "3_dormitorios", label: "3 Dormitorios" },
];

const UserPreferences = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data: cities } = useProjectCities();

  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedTypologies, setSelectedTypologies] = useState<string[]>([]);
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [priceCurrency, setPriceCurrency] = useState("USD");

  const { data: existing, isLoading } = useQuery({
    queryKey: ["user-preferences", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_preferences")
        .select("*")
        .eq("user_id", user!.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  useEffect(() => {
    if (existing) {
      setSelectedCities(existing.preferred_cities ?? []);
      setSelectedTypes(existing.preferred_project_types ?? []);
      setSelectedTypologies(existing.preferred_typologies ?? []);
      setPriceMin(existing.price_min?.toString() ?? "");
      setPriceMax(existing.price_max?.toString() ?? "");
      setPriceCurrency(existing.price_currency ?? "USD");
    }
  }, [existing]);

  const toggleArray = (arr: string[], val: string) =>
    arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val];

  const mutation = useMutation({
    mutationFn: async () => {
      const payload = {
        user_id: user!.id,
        preferred_cities: selectedCities,
        preferred_project_types: selectedTypes,
        preferred_typologies: selectedTypologies,
        price_min: priceMin ? parseFloat(priceMin) : null,
        price_max: priceMax ? parseFloat(priceMax) : null,
        price_currency: priceCurrency,
      };

      if (existing) {
        const { error } = await supabase
          .from("user_preferences")
          .update(payload)
          .eq("user_id", user!.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("user_preferences").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-preferences"] });
      toast.success("Preferencias guardadas");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (!user) return null;

  return (
    <>
      <Helmet><title>Mis preferencias — ProyectPY</title></Helmet>
      <Navbar />
      <div className="min-h-screen bg-background pt-24 pb-16 px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-foreground mb-2">Mis preferencias de inversión</h1>
          <p className="text-muted-foreground mb-8">Completá tus preferencias para recibir oportunidades personalizadas.</p>

          {isLoading ? (
            <p className="text-muted-foreground">Cargando...</p>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); mutation.mutate(); }} className="space-y-8">
              {/* Cities */}
              <div>
                <Label className="text-base font-semibold mb-3 block">Ciudades de interés</Label>
                <div className="flex flex-wrap gap-3">
                  {(cities ?? []).map((city) => (
                    <label key={city} className="flex items-center gap-2 cursor-pointer">
                      <Checkbox
                        checked={selectedCities.includes(city)}
                        onCheckedChange={() => setSelectedCities((prev) => toggleArray(prev, city))}
                      />
                      <span className="text-sm">{city}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Project types */}
              <div>
                <Label className="text-base font-semibold mb-3 block">Tipo de proyecto</Label>
                <div className="flex flex-wrap gap-3">
                  {projectTypes.map((t) => (
                    <label key={t.value} className="flex items-center gap-2 cursor-pointer">
                      <Checkbox
                        checked={selectedTypes.includes(t.value)}
                        onCheckedChange={() => setSelectedTypes((prev) => toggleArray(prev, t.value))}
                      />
                      <span className="text-sm">{t.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Typologies */}
              <div>
                <Label className="text-base font-semibold mb-3 block">Tipología preferida</Label>
                <div className="flex flex-wrap gap-3">
                  {typologies.map((t) => (
                    <label key={t.value} className="flex items-center gap-2 cursor-pointer">
                      <Checkbox
                        checked={selectedTypologies.includes(t.value)}
                        onCheckedChange={() => setSelectedTypologies((prev) => toggleArray(prev, t.value))}
                      />
                      <span className="text-sm">{t.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price range */}
              <div>
                <Label className="text-base font-semibold mb-3 block">Rango de presupuesto</Label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Mínimo</Label>
                    <Input type="number" value={priceMin} onChange={(e) => setPriceMin(e.target.value)} placeholder="50000" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Máximo</Label>
                    <Input type="number" value={priceMax} onChange={(e) => setPriceMax(e.target.value)} placeholder="200000" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Moneda</Label>
                    <Select value={priceCurrency} onValueChange={setPriceCurrency}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="PYG">PYG</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Button type="submit" disabled={mutation.isPending} className="w-full sm:w-auto">
                {mutation.isPending ? "Guardando..." : "Guardar preferencias"}
              </Button>
            </form>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default UserPreferences;
