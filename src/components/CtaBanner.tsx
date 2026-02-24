import { motion } from "framer-motion";

const CtaBanner = () => (
  <section className="py-20 md:py-28 bg-primary">
    <div className="container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center max-w-2xl mx-auto"
      >
        <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-5">
          ¿Sos desarrollador inmobiliario?
        </h2>
        <p className="text-primary-foreground/75 text-lg mb-8">
          Publicá tus proyectos en la plataforma especializada de obra nueva más importante de Paraguay. Llegá a inversores calificados.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button className="bg-primary-foreground text-primary px-8 py-3.5 rounded-xl font-medium hover:opacity-90 transition-opacity w-full sm:w-auto">
            Publicar mi desarrollo
          </button>
          <button className="border border-primary-foreground/30 text-primary-foreground px-8 py-3.5 rounded-xl font-medium hover:bg-primary-foreground/10 transition-colors w-full sm:w-auto">
            Ver planes y precios
          </button>
        </div>
      </motion.div>
    </div>
  </section>
);

export default CtaBanner;
