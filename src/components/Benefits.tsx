import { motion } from "framer-motion";
import { ShieldCheck, Cuboid, GitCompare, BadgeCheck, TrendingUp, CreditCard } from "lucide-react";

const benefits = [
  {
    icon: ShieldCheck,
    title: "Solo Obra Nueva",
    description: "Nos enfocamos exclusivamente en proyectos nuevos verificados. Sin reventa, sin intermediarios innecesarios.",
  },
  {
    icon: BadgeCheck,
    title: "Información Verificada",
    description: "Cada proyecto pasa por un proceso de verificación. Datos reales, desarrolladores confirmados.",
  },
  {
    icon: Cuboid,
    title: "Renders y Recorridos 3D",
    description: "Visualizá cada proyecto con renders profesionales, planos interactivos y tours virtuales.",
  },
  {
    icon: GitCompare,
    title: "Comparador de Proyectos",
    description: "Compará hasta 3 proyectos lado a lado: precios, amenities, rentabilidad y más.",
  },
  {
    icon: TrendingUp,
    title: "Simulador de Rentabilidad",
    description: "Calculá el retorno estimado de tu inversión con datos del mercado local.",
  },
  {
    icon: CreditCard,
    title: "Opciones de Financiación",
    description: "Conocé las opciones de financiamiento directo y bancario de cada proyecto.",
  },
];

const Benefits = () => (
  <section className="py-20 md:py-28 bg-secondary">
    <div className="container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-14"
      >
        <span className="text-accent font-semibold text-sm uppercase tracking-wider">¿Por qué ProyectPY?</span>
        <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">
          La plataforma que necesitabas
        </h2>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto">
          Herramientas diseñadas para inversores y compradores exigentes que buscan obra nueva en Paraguay.
        </p>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {benefits.map((benefit, i) => (
          <motion.div
            key={benefit.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.5 }}
            className="bg-card rounded-2xl p-7 shadow-card hover:shadow-card-hover transition-shadow duration-300"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
              <benefit.icon className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-display text-lg font-semibold text-foreground mb-2">{benefit.title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{benefit.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Benefits;
