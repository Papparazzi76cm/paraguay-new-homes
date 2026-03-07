import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSubmitLead } from "@/hooks/useContactLead";

const CheRogaLeadForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const submitLead = useSubmitLead();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    submitLead.mutate({
      full_name: name.trim(),
      email: email.trim(),
      phone: phone.trim() || undefined,
      message: `Interesado en proyectos Che Róga Porã. Ciudad preferida: ${city || "No especificada"}.`,
      lead_type: "che_roga_pora",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-card rounded-2xl p-6 md:p-8 shadow-card"
    >
      <div className="flex items-center gap-2 mb-4">
        <Mail className="w-5 h-5 text-primary" />
        <h3 className="font-display text-xl font-semibold text-foreground">
          Recibí proyectos compatibles con Che Róga Porã
        </h3>
      </div>
      <p className="text-muted-foreground text-sm mb-6">
        Dejá tus datos y te avisamos cuando tengamos proyectos financiables en tu ciudad.
      </p>

      {submitLead.isSuccess ? (
        <div className="flex items-center gap-3 py-6 text-primary">
          <CheckCircle className="w-6 h-6" />
          <p className="font-semibold">¡Listo! Te contactaremos con proyectos compatibles.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nombre completo *</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Tu nombre" required />
            </div>
            <div className="space-y-2">
              <Label>Email *</Label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@email.com" required />
            </div>
            <div className="space-y-2">
              <Label>Teléfono</Label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="0981 xxx xxx" />
            </div>
            <div className="space-y-2">
              <Label>Ciudad de interés</Label>
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
          </div>
          <Button type="submit" size="lg" className="w-full md:w-auto" disabled={submitLead.isPending}>
            {submitLead.isPending ? "Enviando..." : "Quiero recibir proyectos"}
          </Button>
        </form>
      )}
    </motion.div>
  );
};

export default CheRogaLeadForm;
