import { MapPin, Mail, Phone } from "lucide-react";

const Footer = () => (
  <footer className="bg-foreground py-16">
    <div className="container">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-display font-bold">N</span>
            </div>
            <span className="text-background font-display text-lg font-bold">NuevaPY</span>
          </div>
          <p className="text-background/50 text-sm leading-relaxed">
            La plataforma especializada en proyectos de obra nueva en Paraguay. Inversión segura, información verificada.
          </p>
        </div>

        {/* Explorar */}
        <div>
          <h4 className="text-background font-semibold text-sm mb-4 font-sans">Explorar</h4>
          <ul className="space-y-2.5">
            {["Proyectos", "Nuevos Lanzamientos", "Oportunidades", "Comparador", "Blog"].map((item) => (
              <li key={item}>
                <a href="#" className="text-background/50 hover:text-background text-sm transition-colors">{item}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* Para Promotores */}
        <div>
          <h4 className="text-background font-semibold text-sm mb-4 font-sans">Para Promotores</h4>
          <ul className="space-y-2.5">
            {["Publicar Proyecto", "Planes y Precios", "Dashboard", "Soporte"].map((item) => (
              <li key={item}>
                <a href="#" className="text-background/50 hover:text-background text-sm transition-colors">{item}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contacto */}
        <div>
          <h4 className="text-background font-semibold text-sm mb-4 font-sans">Contacto</h4>
          <ul className="space-y-3">
            <li className="flex items-center gap-2 text-background/50 text-sm">
              <MapPin className="w-4 h-4 shrink-0" /> Asunción, Paraguay
            </li>
            <li className="flex items-center gap-2 text-background/50 text-sm">
              <Mail className="w-4 h-4 shrink-0" /> info@nuevapy.com
            </li>
            <li className="flex items-center gap-2 text-background/50 text-sm">
              <Phone className="w-4 h-4 shrink-0" /> +595 21 000 0000
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-background/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-background/40 text-sm">© 2026 NuevaPY. Todos los derechos reservados.</p>
        <div className="flex gap-6">
          {["Términos", "Privacidad", "Cookies"].map((item) => (
            <a key={item} href="#" className="text-background/40 hover:text-background/60 text-sm transition-colors">{item}</a>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
