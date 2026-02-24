import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  DollarSign,
  Calendar,
  ShieldCheck,
  Building2,
  BarChart3,
  MapPin,
  ArrowRight,
  CheckCircle2,
  Target,
  Landmark,
  PiggyBank,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactDialog from "@/components/ContactDialog";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.6 },
};

const whyInvest = [
  {
    icon: TrendingUp,
    title: "Rentabilidad superior",
    description:
      "El mercado inmobiliario paraguayo ofrece rendimientos del 6-12% anual, superando a depósitos bancarios y bonos tradicionales.",
  },
  {
    icon: ShieldCheck,
    title: "Activo tangible y seguro",
    description:
      "A diferencia de acciones o criptomonedas, un inmueble es un bien físico que no pierde su valor intrínseco y se revaloriza con el tiempo.",
  },
  {
    icon: Landmark,
    title: "Estabilidad económica",
    description:
      "Paraguay mantiene una de las inflaciones más bajas de la región, un tipo de cambio estable y políticas fiscales favorables para la inversión.",
  },
  {
    icon: PiggyBank,
    title: "Ingresos pasivos",
    description:
      "Generá ingresos mensuales predecibles a través del alquiler de tu propiedad, con alta demanda en las principales ciudades.",
  },
  {
    icon: Building2,
    title: "Crecimiento urbano",
    description:
      "Asunción y ciudades satélite están en plena expansión. Invertir en obra nueva hoy significa capturar la plusvalía de mañana.",
  },
  {
    icon: Target,
    title: "Bajo costo de entrada",
    description:
      "Comparado con otros mercados de la región, Paraguay permite acceder a proyectos de calidad desde USD 35.000.",
  },
];

const steps = [
  {
    number: "01",
    title: "Explorá proyectos",
    description: "Navegá nuestro catálogo de proyectos verificados. Filtrá por ciudad, precio, tipo y estado de obra.",
  },
  {
    number: "02",
    title: "Analizá la rentabilidad",
    description: "Usá nuestro simulador para proyectar ingresos, retorno y plusvalía según tu inversión y horizonte.",
  },
  {
    number: "03",
    title: "Contactá al promotor",
    description: "Enviá tu consulta directamente al desarrollador. Recibí información detallada, planos y condiciones.",
  },
  {
    number: "04",
    title: "Cerrá tu inversión",
    description: "Reservá tu unidad con condiciones de financiamiento flexibles y comenzá a generar retorno.",
  },
];

const comparisons = [
  { asset: "Depósito bancario (USD)", yield: "3-4%", risk: "Bajo", liquidity: "Alta", entry: "USD 1.000" },
  { asset: "Bonos del tesoro PY", yield: "5-7%", risk: "Bajo", liquidity: "Media", entry: "USD 5.000" },
  { asset: "Inmueble en obra nueva", yield: "6-12%", risk: "Bajo-Medio", liquidity: "Baja", entry: "USD 35.000", highlight: true },
  { asset: "Acciones (mercado local)", yield: "8-15%", risk: "Alto", liquidity: "Alta", entry: "USD 500" },
  { asset: "Criptomonedas", yield: "Variable", risk: "Muy alto", liquidity: "Alta", entry: "USD 10" },
];

const Inversion = () => {
  const [contactOpen, setContactOpen] = useState(false);

  // Standalone simulator state
  const [investment, setInvestment] = useState(80000);
  const [years, setYears] = useState(5);
  const yieldRate = 8;

  const results = useMemo(() => {
    const annualReturn = investment * (yieldRate / 100);
    const totalReturn = annualReturn * years;
    const finalValue = investment + totalReturn;
    const monthlyIncome = annualReturn / 12;
    return { annualReturn, totalReturn, finalValue, monthlyIncome };
  }, [investment, years]);

  const fmt = (n: number) =>
    new Intl.NumberFormat("es-PY", { maximumFractionDigits: 0 }).format(n);

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative bg-foreground overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_hsla(38,60%,55%,0.1),_transparent_60%)]" />
        <Navbar />
        <div className="container pt-32 pb-20 md:pt-40 md:pb-28 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl"
          >
            <span className="inline-flex items-center gap-2 bg-accent/10 text-accent border border-accent/20 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
              <BarChart3 className="w-4 h-4" />
              Guía de Inversión
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-background leading-tight mb-6">
              Invertí en el futuro inmobiliario de{" "}
              <span className="text-accent">Paraguay</span>
            </h1>
            <p className="text-background/60 text-lg md:text-xl leading-relaxed max-w-2xl mb-8">
              Descubrí por qué miles de inversores eligen obra nueva en Paraguay. 
              Rentabilidad comprobada, mercado en crecimiento y el acompañamiento que necesitás.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="/#proyectos"
                className="bg-accent text-accent-foreground px-8 py-3.5 rounded-xl font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
              >
                Ver proyectos <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#simulador"
                className="bg-background/10 backdrop-blur-sm text-background px-8 py-3.5 rounded-xl font-medium border border-background/20 hover:bg-background/20 transition-colors"
              >
                Simular rentabilidad
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why invest */}
      <section className="py-20 md:py-28">
        <div className="container">
          <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              ¿Por qué invertir en inmuebles en Paraguay?
            </h2>
            <p className="text-muted-foreground text-lg">
              Un mercado con fundamentos sólidos y oportunidades únicas en la región.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyInvest.map((item, i) => (
              <motion.div
                key={item.title}
                {...fadeUp}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="bg-card border border-border rounded-2xl p-6 hover:shadow-[var(--shadow-card-hover)] transition-shadow"
              >
                <div className="w-11 h-11 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                  <item.icon className="w-5 h-5 text-accent" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison table */}
      <section className="py-20 md:py-28 bg-secondary/50">
        <div className="container">
          <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Comparativa de inversiones
            </h2>
            <p className="text-muted-foreground text-lg">
              Cómo se posiciona la inversión inmobiliaria frente a otras alternativas.
            </p>
          </motion.div>

          <motion.div {...fadeUp} className="max-w-4xl mx-auto overflow-x-auto">
            <div className="bg-card rounded-2xl border border-border overflow-hidden min-w-[600px]">
              <div className="grid grid-cols-5 gap-px bg-border">
                {["Activo", "Rendimiento", "Riesgo", "Liquidez", "Entrada mínima"].map((h) => (
                  <div key={h} className="bg-secondary px-5 py-3.5">
                    <span className="text-xs font-semibold text-foreground uppercase tracking-wider">{h}</span>
                  </div>
                ))}
              </div>
              {comparisons.map((row, i) => (
                <div
                  key={row.asset}
                  className={`grid grid-cols-5 gap-px ${row.highlight ? "bg-primary/5" : i % 2 === 0 ? "bg-card" : "bg-secondary/30"}`}
                >
                  <div className="px-5 py-4 flex items-center gap-2">
                    {row.highlight && <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />}
                    <span className={`text-sm ${row.highlight ? "font-semibold text-primary" : "text-foreground"}`}>
                      {row.asset}
                    </span>
                  </div>
                  <div className="px-5 py-4">
                    <span className={`text-sm font-semibold ${row.highlight ? "text-primary" : "text-foreground"}`}>
                      {row.yield}
                    </span>
                  </div>
                  <div className="px-5 py-4">
                    <span className="text-sm text-muted-foreground">{row.risk}</span>
                  </div>
                  <div className="px-5 py-4">
                    <span className="text-sm text-muted-foreground">{row.liquidity}</span>
                  </div>
                  <div className="px-5 py-4">
                    <span className="text-sm text-muted-foreground">{row.entry}</span>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-3 text-center">
              * Rendimientos estimados basados en promedios históricos del mercado paraguayo. No constituye asesoramiento financiero.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Simulator */}
      <section id="simulador" className="py-20 md:py-28">
        <div className="container">
          <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Simulá tu inversión
            </h2>
            <p className="text-muted-foreground text-lg">
              Calculá el retorno estimado según tu monto y horizonte de inversión.
            </p>
          </motion.div>

          <motion.div {...fadeUp} className="max-w-2xl mx-auto bg-card rounded-2xl border border-border p-6 md:p-8 shadow-[var(--shadow-card)]">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-xl bg-accent/15 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h3 className="font-display text-xl font-semibold text-foreground">Simulador de Rentabilidad</h3>
                <p className="text-xs text-muted-foreground">Rendimiento promedio estimado: {yieldRate}% anual</p>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Inversión inicial</span>
                  <span className="font-semibold text-foreground">USD {fmt(investment)}</span>
                </div>
                <input
                  type="range"
                  min={20000}
                  max={500000}
                  step={5000}
                  value={investment}
                  onChange={(e) => setInvestment(Number(e.target.value))}
                  className="w-full accent-primary h-2 rounded-full appearance-none bg-secondary cursor-pointer"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>USD 20.000</span>
                  <span>USD 500.000</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Horizonte de inversión</span>
                  <span className="font-semibold text-foreground">{years} años</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={15}
                  step={1}
                  value={years}
                  onChange={(e) => setYears(Number(e.target.value))}
                  className="w-full accent-primary h-2 rounded-full appearance-none bg-secondary cursor-pointer"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>1 año</span>
                  <span>15 años</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border">
                {[
                  { icon: DollarSign, label: "Ingreso mensual", value: `USD ${fmt(results.monthlyIncome)}` },
                  { icon: TrendingUp, label: "Retorno anual", value: `USD ${fmt(results.annualReturn)}` },
                  { icon: Calendar, label: `Retorno a ${years} años`, value: `USD ${fmt(results.totalReturn)}` },
                  { icon: DollarSign, label: "Valor final", value: `USD ${fmt(results.finalValue)}`, highlight: true },
                ].map((card) => (
                  <div key={card.label} className={`p-3 rounded-xl ${card.highlight ? "bg-primary/10" : "bg-secondary/50"}`}>
                    <div className="flex items-center gap-1.5 mb-1">
                      <card.icon className={`w-3.5 h-3.5 ${card.highlight ? "text-primary" : "text-muted-foreground"}`} />
                      <span className="text-xs text-muted-foreground">{card.label}</span>
                    </div>
                    <p className={`font-bold text-sm ${card.highlight ? "text-primary" : "text-foreground"}`}>{card.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-[11px] text-muted-foreground mt-4">
              * Proyección estimativa basada en rendimiento anual bruto promedio. No constituye garantía de retorno ni asesoramiento financiero.
            </p>
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 md:py-28 bg-secondary/50">
        <div className="container">
          <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              ¿Cómo funciona?
            </h2>
            <p className="text-muted-foreground text-lg">
              En 4 pasos simples podés comenzar a invertir en obra nueva.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                {...fadeUp}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative"
              >
                <div className="bg-card border border-border rounded-2xl p-6 h-full">
                  <span className="text-4xl font-bold text-primary/15 font-display">{step.number}</span>
                  <h3 className="font-display text-lg font-semibold text-foreground mt-2 mb-2">{step.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
                </div>
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 -translate-y-1/2 z-10">
                    <ArrowRight className="w-5 h-5 text-border" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28">
        <div className="container">
          <motion.div
            {...fadeUp}
            className="bg-foreground rounded-3xl p-10 md:p-16 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_hsla(38,60%,55%,0.15),_transparent_60%)]" />
            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-background mb-4">
                Empezá a invertir hoy
              </h2>
              <p className="text-background/60 text-lg mb-8">
                Explorá proyectos verificados con toda la información que necesitás para tomar la mejor decisión de inversión.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a
                  href="/#proyectos"
                  className="bg-accent text-accent-foreground px-10 py-4 rounded-xl font-medium hover:opacity-90 transition-opacity inline-flex items-center gap-2 text-base"
                >
                  Explorar proyectos <ArrowRight className="w-5 h-5" />
                </a>
                <button
                  onClick={() => setContactOpen(true)}
                  className="bg-background/10 backdrop-blur-sm text-background px-10 py-4 rounded-xl font-medium border border-background/20 hover:bg-background/20 transition-colors text-base"
                >
                  Hablar con un asesor
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />

      <ContactDialog
        open={contactOpen}
        onClose={() => setContactOpen(false)}
        leadType="investment_inquiry"
      />
    </main>
  );
};

export default Inversion;
