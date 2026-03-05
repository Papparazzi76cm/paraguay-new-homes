import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Check, BarChart3, Users, Download, Building2, Eye, Zap, Shield, ArrowRight, Star } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactDialog from "@/components/ContactDialog";

const plans = [
  {
    name: "Básico",
    price: "149",
    period: "/mes",
    description: "Ideal para promotores que inician con 1-2 proyectos activos.",
    features: [
      "Hasta 2 proyectos publicados",
      "Galería de hasta 10 fotos por proyecto",
      "Formulario de contacto básico",
      "Estadísticas de visualizaciones",
      "Soporte por email",
    ],
    cta: "Empezar Gratis",
    popular: false,
  },
  {
    name: "Profesional",
    price: "349",
    period: "/mes",
    description: "Para promotores consolidados que buscan maximizar su alcance.",
    features: [
      "Hasta 10 proyectos publicados",
      "Galería ilimitada + videos",
      "Simulador de rentabilidad",
      "Descarga de leads en CSV",
      "Posicionamiento destacado",
      "Panel de analytics avanzado",
      "Soporte prioritario",
    ],
    cta: "Elegir Profesional",
    popular: true,
  },
  {
    name: "Premium",
    price: "699",
    period: "/mes",
    description: "Solución integral para grandes desarrolladores inmobiliarios.",
    features: [
      "Proyectos ilimitados",
      "Recorridos virtuales 360°",
      "Renders 3D interactivos",
      "API de integración CRM",
      "Gerente de cuenta dedicado",
      "Reportes personalizados",
      "Branding personalizado",
      "Prioridad máxima en búsqueda",
    ],
    cta: "Contactar Ventas",
    popular: false,
  },
];

const features = [
  {
    icon: BarChart3,
    title: "Panel de Analytics",
    description: "Visualizá en tiempo real las métricas de tus proyectos: visitas, interacciones, leads generados y tasa de conversión.",
  },
  {
    icon: Users,
    title: "Gestión de Leads",
    description: "Recibí y administrá contactos interesados directamente desde tu panel. Filtrá por proyecto, fecha o estado.",
  },
  {
    icon: Download,
    title: "Exportación de Datos",
    description: "Descargá tus leads y reportes en formatos CSV o Excel para integrar con tu CRM o herramientas de ventas.",
  },
  {
    icon: Eye,
    title: "Posicionamiento Destacado",
    description: "Tus proyectos aparecen primero en las búsquedas y en la sección de destacados de la página principal.",
  },
  {
    icon: Zap,
    title: "Publicación Rápida",
    description: "Subí tu proyecto en minutos con nuestro editor intuitivo. Agregá fotos, planos, precios y amenities fácilmente.",
  },
  {
    icon: Shield,
    title: "Perfil Verificado",
    description: "Generá confianza con un badge de promotor verificado que aparece en todos tus proyectos publicados.",
  },
];

const stats = [
  { value: "15,000+", label: "Inversores activos" },
  { value: "92%", label: "Tasa de respuesta" },
  { value: "48hs", label: "Tiempo medio a primer contacto" },
  { value: "200+", label: "Proyectos publicados" },
];

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.6 },
};

const ParaPromotores = () => {
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <main className="min-h-screen">
      <Helmet>
        <title>Para Promotores Inmobiliarios | Tekoha — Publicá tus proyectos de obra nueva</title>
        <meta name="description" content="Publicá tus desarrollos inmobiliarios en Tekoha. Generá leads calificados de inversores en Asunción, Ciudad del Este y Encarnación. Analytics y herramientas profesionales." />
        <meta property="og:title" content="Para Promotores Inmobiliarios | Tekoha" />
        <meta property="og:description" content="Conectá tus proyectos de obra nueva con miles de inversores en Paraguay. Planes desde USD 149/mes." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://tekoha.estate/para-promotores" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            { "@type": "Question", "name": "¿Cómo publico mi proyecto en Tekoha?", "acceptedAnswer": { "@type": "Answer", "text": "Una vez que elegís tu plan y creás tu cuenta, accedés a un panel donde podés cargar toda la información de tu proyecto: fotos, planos, precios, amenities, ubicación y más. El proceso toma menos de 15 minutos." }},
            { "@type": "Question", "name": "¿Puedo cambiar de plan en cualquier momento?", "acceptedAnswer": { "@type": "Answer", "text": "Sí. Podés subir o bajar de plan cuando quieras. El cambio se aplica en tu próximo ciclo de facturación y la diferencia se prorratea automáticamente." }},
            { "@type": "Question", "name": "¿Qué tipo de leads voy a recibir?", "acceptedAnswer": { "@type": "Answer", "text": "Recibís contactos de inversores y compradores que están activamente buscando proyectos de obra nueva en Paraguay. Cada lead incluye nombre, email, teléfono y el proyecto específico por el que consultan." }},
            { "@type": "Question", "name": "¿Hay algún contrato de permanencia?", "acceptedAnswer": { "@type": "Answer", "text": "No. Todos nuestros planes son mensuales y podés cancelar cuando quieras sin penalización. Si cancelás, tu cuenta permanece activa hasta el final del período pagado." }},
            { "@type": "Question", "name": "¿Puedo integrar Tekoha con mi CRM?", "acceptedAnswer": { "@type": "Answer", "text": "Con el plan Premium tenés acceso a nuestra API de integración, que te permite conectar los leads directamente con tu CRM (Salesforce, HubSpot, Pipedrive, etc.) o cualquier herramienta que uses." }},
            { "@type": "Question", "name": "¿Cómo funciona el posicionamiento destacado?", "acceptedAnswer": { "@type": "Answer", "text": "Los proyectos de planes Profesional y Premium aparecen primero en los resultados de búsqueda y en la sección de destacados de la home. Esto aumenta significativamente la visibilidad y los leads generados." }},
            { "@type": "Question", "name": "¿Qué métodos de pago aceptan?", "acceptedAnswer": { "@type": "Answer", "text": "Aceptamos tarjetas de crédito y débito (Visa, Mastercard), transferencia bancaria y pagos vía Tigo Money. La facturación es mensual en USD." }}
          ]
        })}</script>
      </Helmet>
      {/* Hero */}
      <section className="relative bg-foreground overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_hsla(160,35%,30%,0.15),_transparent_60%)]" />
        <Navbar />
        <div className="container pt-32 pb-20 md:pt-40 md:pb-28 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl"
          >
            <span className="inline-flex items-center gap-2 bg-primary/10 text-primary border border-primary/20 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
              <Building2 className="w-4 h-4" />
              Para Promotores
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-background leading-tight mb-6">
              Conectá tus proyectos con{" "}
              <span className="text-primary">miles de inversores</span>
            </h1>
            <p className="text-background/60 text-lg md:text-xl leading-relaxed max-w-2xl mb-8">
              Publicá tus desarrollos inmobiliarios en la plataforma líder de Paraguay. 
              Generá leads calificados, mostrá tus proyectos con herramientas profesionales 
              y cerrá más ventas.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => setContactOpen(true)}
                className="bg-primary text-primary-foreground px-8 py-3.5 rounded-xl font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
              >
                Empezar ahora <ArrowRight className="w-4 h-4" />
              </button>
              <a
                href="#planes"
                className="bg-background/10 backdrop-blur-sm text-background px-8 py-3.5 rounded-xl font-medium border border-background/20 hover:bg-background/20 transition-colors"
              >
                Ver planes
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-border">
        <div className="container py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                {...fadeUp}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center"
              >
                <p className="text-3xl md:text-4xl font-bold text-foreground mb-1">{stat.value}</p>
                <p className="text-muted-foreground text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 md:py-28">
        <div className="container">
          <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Todo lo que necesitás para vender más
            </h2>
            <p className="text-muted-foreground text-lg">
              Herramientas diseñadas específicamente para promotores inmobiliarios en Paraguay.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                {...fadeUp}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="bg-card border border-border rounded-2xl p-6 hover:shadow-[var(--shadow-card-hover)] transition-shadow"
              >
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="planes" className="py-20 md:py-28 bg-secondary/50">
        <div className="container">
          <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Planes que se adaptan a tu negocio
            </h2>
            <p className="text-muted-foreground text-lg">
              Sin contratos a largo plazo. Cancelá cuando quieras. Precios en USD.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.name}
                {...fadeUp}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className={`relative bg-card rounded-2xl p-6 md:p-8 border transition-shadow ${
                  plan.popular
                    ? "border-primary shadow-[var(--shadow-elevated)] scale-[1.02]"
                    : "border-border hover:shadow-[var(--shadow-card-hover)]"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-primary text-primary-foreground text-xs font-semibold px-4 py-1.5 rounded-full flex items-center gap-1">
                      <Star className="w-3 h-3" /> Más popular
                    </span>
                  </div>
                )}

                <h3 className="font-display text-xl font-semibold text-foreground mb-1">{plan.name}</h3>
                <p className="text-muted-foreground text-sm mb-5">{plan.description}</p>

                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-bold text-foreground">${plan.price}</span>
                  <span className="text-muted-foreground text-sm">{plan.period}</span>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm">
                      <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      <span className="text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => setContactOpen(true)}
                  className={`w-full py-3 rounded-xl font-medium transition-opacity text-sm ${
                    plan.popular
                      ? "bg-primary text-primary-foreground hover:opacity-90"
                      : "bg-secondary text-foreground hover:bg-secondary/80"
                  }`}
                >
                  {plan.cta}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 md:py-28">
        <div className="container max-w-3xl">
          <motion.div {...fadeUp} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Preguntas frecuentes
            </h2>
            <p className="text-muted-foreground text-lg">
              Todo lo que necesitás saber antes de publicar tu proyecto.
            </p>
          </motion.div>

          <motion.div {...fadeUp}>
            <Accordion type="single" collapsible className="space-y-3">
              {[
                {
                  q: "¿Cómo publico mi proyecto en Tekoha?",
                  a: "Una vez que elegís tu plan y creás tu cuenta, accedés a un panel donde podés cargar toda la información de tu proyecto: fotos, planos, precios, amenities, ubicación y más. El proceso toma menos de 15 minutos.",
                },
                {
                  q: "¿Puedo cambiar de plan en cualquier momento?",
                  a: "Sí. Podés subir o bajar de plan cuando quieras. El cambio se aplica en tu próximo ciclo de facturación y la diferencia se prorratea automáticamente.",
                },
                {
                  q: "¿Qué tipo de leads voy a recibir?",
                  a: "Recibís contactos de inversores y compradores que están activamente buscando proyectos de obra nueva en Paraguay. Cada lead incluye nombre, email, teléfono y el proyecto específico por el que consultan.",
                },
                {
                  q: "¿Hay algún contrato de permanencia?",
                  a: "No. Todos nuestros planes son mensuales y podés cancelar cuando quieras sin penalización. Si cancelás, tu cuenta permanece activa hasta el final del período pagado.",
                },
                {
                  q: "¿Puedo integrar Tekoha con mi CRM?",
                  a: "Con el plan Premium tenés acceso a nuestra API de integración, que te permite conectar los leads directamente con tu CRM (Salesforce, HubSpot, Pipedrive, etc.) o cualquier herramienta que uses.",
                },
                {
                  q: "¿Cómo funciona el posicionamiento destacado?",
                  a: "Los proyectos de planes Profesional y Premium aparecen primero en los resultados de búsqueda y en la sección de destacados de la home. Esto aumenta significativamente la visibilidad y los leads generados.",
                },
                {
                  q: "¿Qué métodos de pago aceptan?",
                  a: "Aceptamos tarjetas de crédito y débito (Visa, Mastercard), transferencia bancaria y pagos vía Tigo Money. La facturación es mensual en USD.",
                },
              ].map((faq, i) => (
                <AccordionItem
                  key={i}
                  value={`faq-${i}`}
                  className="bg-card border border-border rounded-xl px-6 data-[state=open]:shadow-[var(--shadow-card)]"
                >
                  <AccordionTrigger className="text-left text-foreground font-medium text-[15px] hover:no-underline py-5">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-5">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>

      {/* CTA final */}
      <section className="py-20 md:py-28">
        <div className="container">
          <motion.div
            {...fadeUp}
            className="bg-foreground rounded-3xl p-10 md:p-16 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_hsla(160,35%,30%,0.2),_transparent_60%)]" />
            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-background mb-4">
                ¿Listo para potenciar tus ventas?
              </h2>
              <p className="text-background/60 text-lg mb-8">
                Unite a más de 50 promotores que ya confían en Tekoha para conectar con inversores calificados.
              </p>
              <button
                onClick={() => setContactOpen(true)}
                className="bg-primary text-primary-foreground px-10 py-4 rounded-xl font-medium hover:opacity-90 transition-opacity inline-flex items-center gap-2 text-base"
              >
                Comenzar ahora <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />

      <ContactDialog
        open={contactOpen}
        onClose={() => setContactOpen(false)}
        leadType="promoter_inquiry"
      />
    </main>
  );
};

export default ParaPromotores;
