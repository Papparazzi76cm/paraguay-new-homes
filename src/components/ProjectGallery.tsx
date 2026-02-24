import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

import project1 from "@/assets/project-1.jpg";
import project2 from "@/assets/project-2.jpg";
import project3 from "@/assets/project-3.jpg";

const fallbackImages = [
  { url: project1, alt: "Vista del proyecto" },
  { url: project2, alt: "Interior del proyecto" },
  { url: project3, alt: "Amenities del proyecto" },
];

interface ProjectGalleryProps {
  images?: { image_url: string; alt_text: string | null }[];
  coverUrl?: string | null;
  title: string;
}

const ProjectGallery = ({ images, coverUrl, title }: ProjectGalleryProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  const gallery =
    images && images.length > 0
      ? images.map((img) => ({ url: img.image_url, alt: img.alt_text || title }))
      : coverUrl
        ? [{ url: coverUrl, alt: title }, ...fallbackImages.slice(1)]
        : fallbackImages;

  const navigate = (dir: 1 | -1) => {
    setActiveIndex((prev) => (prev + dir + gallery.length) % gallery.length);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-2 rounded-2xl overflow-hidden h-[320px] md:h-[480px]">
        {/* Main image */}
        <div
          className="md:col-span-3 md:row-span-2 relative cursor-pointer group"
          onClick={() => setLightbox(true)}
        >
          <img
            src={gallery[activeIndex].url}
            alt={gallery[activeIndex].alt}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors" />
        </div>

        {/* Thumbnails */}
        {gallery.slice(0, 3).map((img, i) => (
          <div
            key={i}
            className={`hidden md:block relative cursor-pointer group ${i === 0 ? "" : ""}`}
            onClick={() => {
              setActiveIndex(i);
              if (i === activeIndex) setLightbox(true);
            }}
          >
            <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
            <div
              className={`absolute inset-0 transition-colors ${
                i === activeIndex
                  ? "ring-2 ring-inset ring-primary"
                  : "bg-foreground/0 group-hover:bg-foreground/10"
              }`}
            />
            {i === 2 && gallery.length > 3 && (
              <div className="absolute inset-0 bg-foreground/50 flex items-center justify-center">
                <span className="text-background font-semibold text-sm">+{gallery.length - 3} fotos</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-foreground/90 flex items-center justify-center"
            onClick={() => setLightbox(false)}
          >
            <button
              className="absolute top-6 right-6 text-background/80 hover:text-background"
              onClick={() => setLightbox(false)}
            >
              <X className="w-7 h-7" />
            </button>
            <button
              className="absolute left-4 md:left-8 text-background/80 hover:text-background"
              onClick={(e) => { e.stopPropagation(); navigate(-1); }}
            >
              <ChevronLeft className="w-10 h-10" />
            </button>
            <motion.img
              key={activeIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              src={gallery[activeIndex].url}
              alt={gallery[activeIndex].alt}
              className="max-h-[85vh] max-w-[90vw] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              className="absolute right-4 md:right-8 text-background/80 hover:text-background"
              onClick={(e) => { e.stopPropagation(); navigate(1); }}
            >
              <ChevronRight className="w-10 h-10" />
            </button>
            <div className="absolute bottom-6 text-background/70 text-sm">
              {activeIndex + 1} / {gallery.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ProjectGallery;
