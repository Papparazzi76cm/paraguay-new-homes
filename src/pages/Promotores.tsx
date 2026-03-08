import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { developers } from "@/data/developers";
import { Globe, Mail, Phone, ArrowRight } from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: { duration: 0.55 },
};

const Promotores = () => {
  return (
    <main className="min-h-screen">
      <Helmet>
        <title>Promotores Inmobiliarios | Tekoha</title>
        <meta
          name="description"
          content="Directorio completo de promotores y desarrolladores inmobiliarios en Paraguay. Conocé cada empresa, sus proyectos y datos de contacto."
        />
        <link rel="canonical" href="https://tekoha.estate/promotores" />
      </Helmet>

      <Navbar />

      <section className="pt-28 pb-16 md:pt-36 md:pb-20">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Promotores Inmobiliarios
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Directorio de {developers.length} empresas constructoras y desarrolladoras en Paraguay
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {developers.map((dev, i) => {
              const initials = dev.name
                .split(" ")
                .slice(0, 2)
                .map((w) => w[0])
                .join("")
                .toUpperCase();

              return (
                <motion.div
                  key={dev.slug}
                  {...fadeUp}
                  transition={{ duration: 0.5, delay: (i % 6) * 0.08 }}
                >
                  <Link
                    to={`/promotor/${dev.slug}`}
                    className="group block bg-card border border-border rounded-2xl p-6 hover:shadow-[var(--shadow-card-hover)] transition-shadow h-full"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      {dev.logo ? (
                        <img
                          src={dev.logo}
                          alt={dev.name}
                          className="h-12 w-12 object-contain rounded-lg"
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                          {initials}
                        </div>
                      )}
                      <h2 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 text-sm">
                        {dev.name}
                      </h2>
                    </div>

                    <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                      {dev.description}
                    </p>

                    <div className="space-y-1.5 text-xs text-muted-foreground mb-4">
                      {dev.website && (
                        <div className="flex items-center gap-1.5 truncate">
                          <Globe className="w-3.5 h-3.5 text-primary shrink-0" />
                          <span className="truncate">{dev.website.replace(/https?:\/\//, "").replace(/\/$/, "")}</span>
                        </div>
                      )}
                      {dev.email && (
                        <div className="flex items-center gap-1.5 truncate">
                          <Mail className="w-3.5 h-3.5 text-primary shrink-0" />
                          <span className="truncate">{dev.email}</span>
                        </div>
                      )}
                      {dev.phone && (
                        <div className="flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-primary shrink-0" />
                          {dev.phone}
                        </div>
                      )}
                    </div>

                    <span className="text-primary text-xs font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                      Ver ficha <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Promotores;
