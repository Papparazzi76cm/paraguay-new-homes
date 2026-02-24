import { useState } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="absolute top-0 left-0 right-0 z-50"
    >
      <div className="container flex items-center justify-between py-5">
        <a href="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-display font-bold text-lg">N</span>
          </div>
          <span className="text-primary-foreground font-display text-xl font-bold tracking-tight">
            NuevaPY
          </span>
        </a>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {[
            { label: "Proyectos", href: "/#proyectos" },
            { label: "Inversión", href: "/inversion" },
            { label: "Para Promotores", href: "/para-promotores" },
            { label: "Blog", href: "/blog" },
          ].map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-primary-foreground/80 hover:text-primary-foreground text-sm font-medium transition-colors"
            >
              {item.label}
            </a>
          ))}
          <button className="bg-primary-foreground/10 backdrop-blur-sm text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-medium border border-primary-foreground/20 hover:bg-primary-foreground/20 transition-colors">
            Publicar Proyecto
          </button>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-primary-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="md:hidden bg-foreground/95 backdrop-blur-xl px-6 pb-6"
        >
          <div className="flex flex-col gap-4">
            {[
              { label: "Proyectos", href: "/#proyectos" },
              { label: "Inversión", href: "/inversion" },
              { label: "Para Promotores", href: "/para-promotores" },
              { label: "Blog", href: "/blog" },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-primary-foreground/80 hover:text-primary-foreground text-base font-medium py-2"
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <button className="bg-primary text-primary-foreground px-5 py-3 rounded-xl text-sm font-medium mt-2">
              Publicar Proyecto
            </button>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;
