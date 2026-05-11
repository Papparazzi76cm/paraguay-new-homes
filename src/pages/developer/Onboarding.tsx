import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Building2, CreditCard, ShieldCheck, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { StripeEmbeddedCheckout } from "@/components/StripeEmbeddedCheckout";

const PLAN_PRICES: Record<string, { name: string; price: number; lookupKey: string }> = {
  basico: { name: "Básico", price: 149, lookupKey: "basico_monthly" },
  profesional: { name: "Profesional", price: 349, lookupKey: "profesional_monthly" },
  premium: { name: "Premium", price: 699, lookupKey: "premium_monthly" },
};

const companySchema = z.object({
  legal_name: z.string().trim().min(2, "Requerido").max(150),
  tax_id: z.string().trim().min(3, "Requerido").max(40),
  address: z.string().trim().min(5, "Requerido").max(200),
  city: z.string().trim().min(2, "Requerido").max(80),
  country: z.string().trim().min(2).max(80),
  phone: z.string().trim().min(6, "Requerido").max(30),
  website: z.string().trim().url("URL inválida").max(200).optional().or(z.literal("")),
  description: z.string().trim().max(1000).optional().or(z.literal("")),
  contact_name: z.string().trim().min(2, "Requerido").max(120),
  contact_role: z.string().trim().min(2, "Requerido").max(120),
  contact_email: z.string().trim().email("Email inválido").max(200),
  selected_plan: z.enum(["basico", "profesional", "premium"]),
});

type CompanyForm = z.infer<typeof companySchema>;

const Onboarding = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [step, setStep] = useState<"company" | "payment" | "done">("company");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth?role=developer", { replace: true });
  }, [authLoading, user, navigate]);

  const { data: existing, isLoading } = useQuery({
    queryKey: ["dev-profile-onboarding", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("developer_profiles")
        .select("*")
        .eq("user_id", user!.id)
        .maybeSingle();
      return data;
    },
    enabled: !!user,
  });

  const initialPlan = (typeof window !== "undefined" && (localStorage.getItem("selected_plan") as keyof typeof PLAN_PRICES)) || "basico";

  const form = useForm<CompanyForm>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      legal_name: "",
      tax_id: "",
      address: "",
      city: "Asunción",
      country: "Paraguay",
      phone: "",
      website: "",
      description: "",
      contact_name: "",
      contact_role: "",
      contact_email: user?.email || "",
      selected_plan: (PLAN_PRICES[initialPlan] ? initialPlan : "basico") as CompanyForm["selected_plan"],
    },
  });

  useEffect(() => {
    if (existing) {
      form.reset({
        legal_name: existing.legal_name || "",
        tax_id: existing.tax_id || "",
        address: existing.address || "",
        city: existing.city || "Asunción",
        country: existing.country || "Paraguay",
        phone: existing.phone || "",
        website: existing.website || "",
        description: existing.description || "",
        contact_name: existing.contact_name || "",
        contact_role: existing.contact_role || "",
        contact_email: existing.contact_email || user?.email || "",
        selected_plan: (existing.selected_plan as CompanyForm["selected_plan"]) || "basico",
      });
      if (existing.onboarding_status === "complete") {
        navigate("/developer", { replace: true });
      } else if (existing.onboarding_status === "pending_payment" && existing.legal_name) {
        setStep("payment");
      }
    }
  }, [existing]);

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const onSubmitCompany = async (values: CompanyForm) => {
    if (!user) return;
    setSaving(true);
    const payload = {
      user_id: user.id,
      ...values,
      website: values.website || null,
      description: values.description || null,
      onboarding_status: "pending_payment",
    };
    const { error } = await (supabase.from("developer_profiles") as any)
      .upsert(payload, { onConflict: "user_id" });
    setSaving(false);
    if (error) {
      toast.error("No se pudo guardar: " + error.message);
      return;
    }
    localStorage.setItem("selected_plan", values.selected_plan);
    queryClient.invalidateQueries({ queryKey: ["dev-profile-onboarding", user.id] });
    setStep("payment");
  };

  const selectedPlan = form.watch("selected_plan");
  const planInfo = PLAN_PRICES[selectedPlan];

  return (
    <div className="min-h-screen bg-background py-10 px-4">
      <Helmet>
        <title>Onboarding desarrollador — Tekoha.estate</title>
      </Helmet>
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="font-display text-3xl md:text-4xl font-semibold text-foreground">
            Bienvenido a Tekoha
          </h1>
          <p className="mt-2 text-muted-foreground">
            Completá los datos de tu empresa y validá un medio de pago para activar tu prueba gratuita de 30 días.
          </p>
        </div>

        {/* Stepper */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <StepDot active={step === "company"} done={step !== "company"} icon={Building2} label="Datos de empresa" />
          <div className="h-px w-12 bg-border" />
          <StepDot active={step === "payment"} done={step === "done"} icon={CreditCard} label="Medio de pago" />
        </div>

        {step === "company" && (
          <form onSubmit={form.handleSubmit(onSubmitCompany)} className="bg-card border border-border rounded-2xl p-6 md:p-8 space-y-5 shadow-sm">
            <h2 className="font-display text-xl font-semibold flex items-center gap-2">
              <Building2 className="w-5 h-5 text-primary" /> Datos de la empresa desarrolladora
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              <Field label="Razón social *" error={form.formState.errors.legal_name?.message}>
                <Input {...form.register("legal_name")} />
              </Field>
              <Field label="RUC / Identificación fiscal *" error={form.formState.errors.tax_id?.message}>
                <Input {...form.register("tax_id")} />
              </Field>
              <Field label="Dirección fiscal *" error={form.formState.errors.address?.message} className="md:col-span-2">
                <Input {...form.register("address")} />
              </Field>
              <Field label="Ciudad *" error={form.formState.errors.city?.message}>
                <Input {...form.register("city")} />
              </Field>
              <Field label="País *" error={form.formState.errors.country?.message}>
                <Input {...form.register("country")} />
              </Field>
              <Field label="Teléfono *" error={form.formState.errors.phone?.message}>
                <Input {...form.register("phone")} placeholder="+595 ..." />
              </Field>
              <Field label="Sitio web" error={form.formState.errors.website?.message}>
                <Input {...form.register("website")} placeholder="https://..." />
              </Field>
              <Field label="Descripción de la empresa" error={form.formState.errors.description?.message} className="md:col-span-2">
                <Textarea rows={3} {...form.register("description")} />
              </Field>
            </div>

            <div className="border-t border-border pt-5 space-y-4">
              <h3 className="font-medium text-foreground">Persona responsable</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <Field label="Nombre completo *" error={form.formState.errors.contact_name?.message}>
                  <Input {...form.register("contact_name")} />
                </Field>
                <Field label="Cargo *" error={form.formState.errors.contact_role?.message}>
                  <Input {...form.register("contact_role")} />
                </Field>
                <Field label="Email de contacto *" error={form.formState.errors.contact_email?.message} className="md:col-span-2">
                  <Input type="email" {...form.register("contact_email")} />
                </Field>
              </div>
            </div>

            <div className="border-t border-border pt-5">
              <Field label="Plan seleccionado *" error={form.formState.errors.selected_plan?.message}>
                <Select
                  value={form.watch("selected_plan")}
                  onValueChange={(v) => form.setValue("selected_plan", v as CompanyForm["selected_plan"])}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(PLAN_PRICES).map(([k, v]) => (
                      <SelectItem key={k} value={k}>{v.name} — ${v.price}/mes</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>

            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-sm text-foreground flex gap-3">
              <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div>
                Validaremos un medio de pago, pero <span className="font-semibold">no se efectuará ningún cargo</span> durante los 30 días de prueba. Podés cancelar en cualquier momento sin coste.
              </div>
            </div>

            <Button type="submit" size="lg" className="w-full" disabled={saving}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Continuar al medio de pago
            </Button>
          </form>
        )}

        {step === "payment" && user && planInfo && (
          <div className="space-y-4">
            <div className="bg-card border border-border rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="text-sm text-muted-foreground">Plan elegido</p>
                <p className="font-display text-xl font-semibold">{planInfo.name} — ${planInfo.price}/mes</p>
                <p className="text-sm text-muted-foreground mt-1">
                  30 días gratis. Primer cobro: <span className="font-medium text-foreground">{new Date(Date.now() + 30 * 86400000).toLocaleDateString("es-PY", { day: "2-digit", month: "long", year: "numeric" })}</span>
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={() => setStep("company")}>Editar datos</Button>
            </div>

            <div className="bg-card border border-border rounded-2xl p-2 md:p-4">
              <StripeEmbeddedCheckout
                priceId={planInfo.lookupKey}
                customerEmail={user.email}
                userId={user.id}
                trialDays={30}
                returnUrl={`${window.location.origin}/developer/onboarding/done?session_id={CHECKOUT_SESSION_ID}`}
              />
            </div>

            <p className="text-xs text-center text-muted-foreground">
              Al confirmar, autorizás a Tekoha a cobrar el plan al finalizar el período de prueba salvo que canceles antes.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const StepDot = ({ active, done, icon: Icon, label }: { active: boolean; done: boolean; icon: any; label: string }) => (
  <div className="flex flex-col items-center gap-1">
    <div
      className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
        done ? "bg-primary text-primary-foreground border-primary" :
        active ? "border-primary text-primary bg-primary/5" : "border-border text-muted-foreground bg-card"
      }`}
    >
      {done ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
    </div>
    <span className="text-xs text-muted-foreground">{label}</span>
  </div>
);

const Field = ({ label, error, children, className }: { label: string; error?: string; children: React.ReactNode; className?: string }) => (
  <div className={`space-y-1.5 ${className || ""}`}>
    <Label>{label}</Label>
    {children}
    {error && <p className="text-xs text-destructive">{error}</p>}
  </div>
);

export default Onboarding;