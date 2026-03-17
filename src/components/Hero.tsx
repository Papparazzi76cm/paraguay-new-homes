import React from 'react';
import { useTranslation } from 'react-i18next';
// Verificamos la ruta de importación relativa para el entorno de compilación
import SearchBar from './SearchBar';

/**
 * Componente Hero optimizado para Core Web Vitals (LCP).
 * Implementa imágenes responsivas y prioridad de carga alta para el recurso principal.
 */
const Hero = () => {
  const { t } = useTranslation();

  return (
    <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden bg-slate-100">
      {/* OPTIMIZACIÓN LCP: 
          1. Usamos <picture> para servir versiones optimizadas según el ancho de pantalla.
          2. fetchpriority="high" indica al navegador que este es el recurso visual más importante.
          3. decoding="async" ayuda a liberar el hilo principal del navegador.
      */}
      <picture className="absolute inset-0 z-0">
        <source
          media="(max-width: 640px)"
          srcSet="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=800&auto=format&fit=crop"
        />
        <source
          media="(max-width: 1024px)"
          srcSet="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1200&auto=format&fit=crop"
        />
        <img
          src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1920&auto=format&fit=crop"
          alt="Vista aérea de edificios de departamentos en pozo en Asunción"
          className="w-full h-full object-cover"
          fetchpriority="high"
          decoding="async"
        />
      </picture>
      
      {/* Superposición para mejorar el contraste del texto sobre la imagen */}
      <div className="absolute inset-0 bg-black/40 z-10" />

      <div className="container relative z-20 text-center text-white px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in drop-shadow-lg">
          {t('hero.title')}
        </h1>
        <p className="text-xl md:text-2xl mb-12 max-w-2xl mx-auto opacity-90 drop-shadow-md">
          {t('hero.subtitle')}
        </p>
        
        {/* Barra de búsqueda centralizada */}
        <div className="w-full max-w-4xl mx-auto transform hover:scale-[1.01] transition-transform duration-300">
          <SearchBar />
        </div>

        {/* Indicadores de confianza y estadísticas (Social Proof) */}
        <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm font-medium opacity-80">
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold">120+</span>
            <span>{t('stats.activeProjects')}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold">35</span>
            <span>{t('stats.developers')}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold">8</span>
            <span>{t('stats.cities')}</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
