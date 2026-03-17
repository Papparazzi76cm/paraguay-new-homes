import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Linkedin, Twitter, Mail, Phone } from 'lucide-react';
import { useTranslation } from 'react-i18next';

/**
 * Footer optimizado para accesibilidad (ARIA) y SEO.
 */
const Footer = () => {
  const { t } = useTranslation();
  
  return (
    <footer className="bg-slate-900 text-slate-300 py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Sección de Marca e Información */}
          <div className="space-y-6">
            <Link to="/" className="text-white text-2xl font-bold tracking-tight">
              Tekoha
            </Link>
            <p className="text-sm leading-relaxed">
              {t('footer.description')}
            </p>
            <div className="flex space-x-4">
              {/* ACCESIBILIDAD: Se agregan aria-labels para navegación asistida */}
              <a href="#" className="hover:text-white transition-colors" aria-label="Visitar nuestra página de Facebook">
                <Facebook size={20} />
              </a>
              <a href="#" className="hover:text-white transition-colors" aria-label="Visitar nuestro perfil de Instagram">
                <Instagram size={20} />
              </a>
              <a href="#" className="hover:text-white transition-colors" aria-label="Conectar con nosotros en LinkedIn">
                <Linkedin size={20} />
              </a>
              <a href="#" className="hover:text-white transition-colors" aria-label="Seguirnos en Twitter">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Enlaces de Navegación Rápida */}
          <div>
            <h4 className="text-white font-semibold mb-6 uppercase tracking-wider text-sm">
              {t('footer.quickLinks')}
            </h4>
            <nav aria-label="Menú secundario de enlaces rápidos">
              <ul className="space-y-4 text-sm">
                <li><Link to="/proyectos" className="hover:text-white transition-colors">Todos los Proyectos</Link></li>
                <li><Link to="/inversion" className="hover:text-white transition-colors">Guía de Inversión</Link></li>
                <li><Link to="/promotores" className="hover:text-white transition-colors">Para Promotores</Link></li>
                <li><Link to="/blog" className="hover:text-white transition-colors">Blog y Noticias</Link></li>
              </ul>
            </nav>
          </div>

          {/* Información Legal */}
          <div>
            <h4 className="text-white font-semibold mb-6 uppercase tracking-wider text-sm">
              {t('footer.legal')}
            </h4>
            <ul className="space-y-4 text-sm">
              <li><Link to="/legal" className="hover:text-white transition-colors">Aviso Legal</Link></li>
              <li><Link to="/privacy" className="hover:text-white transition-colors">Privacidad</Link></li>
              <li><Link to="/cookies" className="hover:text-white transition-colors">Política de Cookies</Link></li>
            </ul>
          </div>

          {/* Datos de Contacto */}
          <div>
            <h4 className="text-white font-semibold mb-6 uppercase tracking-wider text-sm">
              {t('footer.contact')}
            </h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-center space-x-3">
                <Mail size={16} className="text-teal-500" />
                <a href="mailto:info@tekoha.estate" className="hover:text-white transition-colors">info@tekoha.estate</a>
              </li>
              <li className="flex items-center space-x-3">
                <Phone size={16} className="text-teal-500" />
                <a href="tel:+595900000000" className="hover:text-white transition-colors">+595 9XX XXX XXX</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-16 pt-8 text-sm text-center">
          <p>© {new Date().getFullYear()} Tekoha. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
