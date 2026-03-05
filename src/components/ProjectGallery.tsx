import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useTranslation } from "react-i18next";

import project1 from "@/assets/project-1.jpg";
import project2 from "@/assets/project-2.jpg";
import project3 from "@/assets/project-3.jpg";
import project4 from "@/assets/project-4.jpg";
import project5 from "@/assets/project-5.jpg";

const fallbackImages = [
  { url: project1, alt: "Vista del proyecto" },
  { url: project2, alt: "Interior del proyecto" },
  { url: project3, alt: "Amenities del proyecto" },
  { url: project4, alt: "Exterior del proyecto" },
  { url: project5, alt: "Living del proyecto" },
];

interface ProjectGalleryProps {
  images?: { image_url: string; alt_text: string | null }[];
  coverUrl?: string | null;
  title: string;
}

const ProjectGallery = ({ images, coverUrl, title }: ProjectGalleryProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const { t } = useTranslation();

  const gallery =
    images && images.length > 0
      ? images.map((img) => ({ url: img.image_url, alt: img.alt_text || title }))
      : coverUrl
        ? [{ url: coverUrl, alt: title }, ...fallbackImages.slice(1)]
        : fallbackImages;

  const sideThumbs = gallery.slice(1, 6);
  const topRow = sideThumbs.slice(0, 3);
  const bottomRow = sideThumbs.slice(3, 5);
  const extraCount = gallery.length - 6;

  const navigate = (dir: 1 | -1) => {
    setActiveIndex((prev) => (prev + dir + gallery.length) % gallery.length);
  };

  const openLightbox = (index: number) => {
    setActiveIndex(index);
    setLightbox(true);
  };

  return (
    <>
      <div className="flex gap-2 rounded-2xl overflow-hidden h-[320px] md:h-[480px]">
        {/* Main image — ~60% width */}
        <div className="flex-[3] relative cursor-pointer group" onClick={() => openLightbox(0)}>
          <img src={gallery[0].url} alt={gallery[0].alt} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors" />
        </div>

        {/* Side thumbnails — ~40% width, 2 rows */}
        {sideThumbs.length > 0 && (
          <div className="hidden md:flex flex-col gap-2 flex-[2]">
            {/* Top row: up to 3 images */}
            <div className="flex gap-2 flex-1 min-h-0">
              {topRow.map((img, i) => {
                const realIndex = i + 1;
                return (
                  <div key={realIndex} className="flex-1 relative cursor-pointer group" onClick={() => openLightbox(realIndex)}>
                    <img src={img.url} alt={img.alt} className="w-full h-full object-cover rounded-sm" />
                    <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors" />
                  </div>
                );
              })}
            </div>
            {/* Bottom row: up to 2 images */}
            {bottomRow.length > 0 && (
              <div className="flex gap-2 flex-1 min-h-0">
                {bottomRow.map((img, i) => {
                  const realIndex = i + 4;
                  const isLast = i === bottomRow.length - 1;
                  return (
                    <div key={realIndex} className="flex-1 relative cursor-pointer group" onClick={() => openLightbox(realIndex)}>
                      <img src={img.url} alt={img.alt} className="w-full h-full object-cover rounded-sm" />
                      <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors" />
                      {isLast && extraCount > 0 && (
                        <div className="absolute inset-0 bg-foreground/50 flex items-center justify-center">
                          <span className="text-background font-semibold text-sm">+{extraCount} {t("detail.photos")}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      <AnimatePresence>
        {lightbox && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-foreground/90 flex items-center justify-center" onClick={() => setLightbox(false)}>
            <button className="absolute top-6 right-6 text-background/80 hover:text-background" onClick={() => setLightbox(false)}><X className="w-7 h-7" /></button>
            <button className="absolute left-4 md:left-8 text-background/80 hover:text-background" onClick={(e) => { e.stopPropagation(); navigate(-1); }}><ChevronLeft className="w-10 h-10" /></button>
            <motion.img key={activeIndex} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} src={gallery[activeIndex].url} alt={gallery[activeIndex].alt} className="max-h-[85vh] max-w-[90vw] object-contain rounded-lg" onClick={(e) => e.stopPropagation()} />
            <button className="absolute right-4 md:right-8 text-background/80 hover:text-background" onClick={(e) => { e.stopPropagation(); navigate(1); }}><ChevronRight className="w-10 h-10" /></button>
            <div className="absolute bottom-6 text-background/70 text-sm">{activeIndex + 1} / {gallery.length}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ProjectGallery;
