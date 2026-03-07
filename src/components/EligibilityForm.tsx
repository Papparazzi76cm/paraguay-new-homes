import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, AlertTriangle, ClipboardCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSubmitLead } from "@/hooks/useContactLead";

const SALARIO_MINIMO = 2_680_373;

type Result = "elegible" | "elegible_con_condiciones" | "no_elegible" | null;

const EligibilityForm = () => {
  const [age, setAge] = useState("");
  const [income, setIncome] = useState("");
  const [hasHome, setHasHome] = useState("");
  const [hasTerrain, setHasTerrain] = useState("");
  const [employmentYears, setEmploymentYears] = useState("");
  const [city, setCity] = useState("");
  const [maritalStatus, setMaritalStatus] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [result, setResult] = useState<Result>(null);
  const [showContact, setShowContact] = useState(false);
  const submitLead = useSubmitLead();

  const evaluate = () => {
    const ageNum = parseInt(age);
    const incomeNum = parseInt(income.replace(/\D/g, ""));
    const empYears = parseInt(employmentYears);

    if (isNaN(ageNum) || isNaN(incomeNum)) return;

    const inSalarios = incomeNum / SALARIO_MINIMO;

    // Hard disqualifiers
    if (ageNum < 18 || ageNum > 75) { setResult("no_elegible"); return; }
    if (hasHome === "si") { setResult("no_elegible"); return; }
    if (inSalarios > 6) { setResult("no_elegible"); return; }
    if (inSalarios < 1) { setResult("no_elegible"); return; }

    // Conditions
    let conditions = 0;
    if (empYears && !isNaN(empYears) && empYears < 1) conditions++;
    if (ageNum > 65) conditions++;

    setResult(conditions > 0 ? "elegible_con_condiciones" : "elegible");
    setShowContact(true);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    submitLead.mutate({
      full_name: name.trim(),
      email: email.trim(),
      phone: phone.trim() || undefined,
      message: `Pre-calificación Che Róga Porã: ${result}. Ciudad: ${city}. Ingreso: ${income}. Edad: ${age}.`,
      lead_type: "che_roga_pora",
    });
  };

  const resultConfig = {
    elegible: { icon: CheckCircle, color: "text-primary", bg: "bg-primary/10 border-primary/20", title: "¡Cumplís los requisitos!", desc: "Según los datos ingresados, tenés alta probabilidad de ser elegible para el programa Che Róga Porã." },
    elegible_con_condiciones: { icon: AlertTriangle, color: "text-accent", bg: "bg-accent/10 border-accent/20", title: "Elegible con condiciones", desc: "Podrías acceder al programa, pero hay factores que necesitan verificación adicional con la entidad financiera." },
    no_elegible: { icon: XCircle, color: "text-destructive", bg: "bg-destructive/10 border-destructive/20", title: "No cumplís los requisitos", desc: "Según los datos ingresados, no cumplís con los requisitos actuales del programa. Consultá otras opciones de financiación." },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-card rounded-2xl p-6 md:p-8 shadow-card"
    >
      <div className="flex items-center gap-2 mb-6">
        <ClipboardCheck className="w-5 h-5 text-primary" />
        <h3 className="font-display text-xl font-semibold text-foreground">Pre-calificación Che Róga Porã</h3>
      </div>

      <p className="text-muted-foreground text-sm mb-6">
        Comprobá si cumplís con los requisitos básicos del programa de vivienda del gobierno paraguayo.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="space-y-2">
          <Label>Edad</Label>
          <Input type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="Ej: 32" min={18} max={99} />
        </div>
        <div className="space-y-2">
          <Label>Ingreso mensual del hogar (Gs.)</Label>
          <Input
            value={income}
            onChange={(e) => setIncome(e.target.value)}
            placeholder="Ej: 5.000.000"
          />
        </div>
        <div className="space-y-2">
          <Label>¿Tenés vivienda propia?</Label>
          <Select value={hasHome} onValueChange={setHasHome}>
            <SelectTrigger><SelectValue placeholder="Seleccioná" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="no">No</SelectItem>
              <SelectItem value="si">Sí</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>¿Tenés terreno propio?</Label>
          <Select value={hasTerrain} onValueChange={setHasTerrain}>
            <SelectTrigger><SelectValue placeholder="Seleccioná" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="no">No</SelectItem>
              <SelectItem value="si">Sí</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Años de estabilidad laboral</Label>
          <Input type="number" value={employmentYears} onChange={(e) => setEmploymentYears(e.target.value)} placeholder="Ej: 3" min={0} />
        </div>
        <div className="space-y-2">
          <Label>Ciudad</Label>
          <Select value={city} onValueChange={setCity}>
            <SelectTrigger><SelectValue placeholder="Seleccioná" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Asunción">Asunción</SelectItem>
              <SelectItem value="Ciudad del Este">Ciudad del Este</SelectItem>
              <SelectItem value="Encarnación">Encarnación</SelectItem>
              <SelectItem value="Luque">Luque</SelectItem>
              <SelectItem value="San Lorenzo">San Lorenzo</SelectItem>
              <SelectItem value="Fernando de la Mora">Fernando de la Mora</SelectItem>
              <SelectItem value="Otra">Otra ciudad</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Estado civil</Label>
          <Select value={maritalStatus} onValueChange={setMaritalStatus}>
            <SelectTrigger><SelectValue placeholder="Seleccioná" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="soltero">Soltero/a</SelectItem>
              <SelectItem value="casado">Casado/a</SelectItem>
              <SelectItem value="union_libre">Unión libre</SelectItem>
              <SelectItem value="divorciado">Divorciado/a</SelectItem>
              <SelectItem value="viudo">Viudo/a</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button onClick={evaluate} className="w-full md:w-auto" size="lg">
        Verificar elegibilidad
      </Button>

      {result && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-6 rounded-xl p-5 border ${resultConfig[result].bg}`}
        >
          <div className="flex items-center gap-2 mb-2">
            {(() => { const Icon = resultConfig[result].icon; return <Icon className={`w-5 h-5 ${resultConfig[result].color}`} />; })()}
            <h4 className={`font-semibold ${resultConfig[result].color}`}>{resultConfig[result].title}</h4>
          </div>
          <p className="text-sm text-muted-foreground">{resultConfig[result].desc}</p>
        </motion.div>
      )}

      {showContact && result !== "no_elegible" && (
        <motion.form
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleContactSubmit}
          className="mt-6 space-y-4 border-t border-border pt-6"
        >
          <h4 className="font-display text-lg font-semibold text-foreground">¿Querés que te contactemos?</h4>
          <p className="text-sm text-muted-foreground">Dejá tus datos y te asesoramos sobre proyectos compatibles con Che Róga Porã.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nombre completo *</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>Email *</Label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>Teléfono</Label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
          </div>
          <Button type="submit" disabled={submitLead.isPending}>
            {submitLead.isPending ? "Enviando..." : "Solicitar asesoramiento"}
          </Button>
          {submitLead.isSuccess && (
            <p className="text-sm text-primary flex items-center gap-1"><CheckCircle className="w-4 h-4" /> ¡Datos enviados! Te contactaremos pronto.</p>
          )}
        </motion.form>
      )}
    </motion.div>
  );
};

export default EligibilityForm;
