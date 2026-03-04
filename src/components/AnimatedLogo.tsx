import { motion, useAnimation } from "framer-motion";
import { useEffect, useState } from "react";
import takohaLogo from "@/assets/takoha-logo.png";

interface AnimatedLogoProps {
  className?: string;
}

const AnimatedLogo = ({ className = "h-20 md:h-24" }: AnimatedLogoProps) => {
  const [hasPlayed, setHasPlayed] = useState(() => {
    return sessionStorage.getItem("logo-animated") === "true";
  });

  useEffect(() => {
    if (!hasPlayed) {
      const timer = setTimeout(() => {
        sessionStorage.setItem("logo-animated", "true");
        setHasPlayed(true);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [hasPlayed]);

  if (hasPlayed) {
    return (
      <img
        src={takohaLogo}
        alt="Takoha"
        className={`${className} w-auto brightness-0 invert`}
      />
    );
  }

  return (
    <div className={`${className} w-auto relative`}>
      {/* Blueprint grid background */}
      <motion.div
        className="absolute inset-0 rounded-lg overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.3, 0.3, 0] }}
        transition={{ duration: 3.5, times: [0, 0.1, 0.7, 1] }}
      >
        <svg width="100%" height="100%" className="absolute inset-0">
          <defs>
            <pattern id="grid" width="8" height="8" patternUnits="userSpaceOnUse">
              <path d="M 8 0 L 0 0 0 8" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </motion.div>

      {/* Technical drawing scan line */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white/60 to-transparent z-20"
        initial={{ top: "0%" }}
        animate={{ top: ["0%", "100%", "0%", "100%"] }}
        transition={{ duration: 2.5, ease: "linear", times: [0, 0.4, 0.6, 1] }}
      />

      {/* Logo reveal with technical drawing stages */}
      <div className="relative w-full h-full">
        {/* Stage 1: Wireframe/outline version (sketch lines) */}
        <motion.img
          src={takohaLogo}
          alt="Takoha"
          className={`${className} w-auto absolute inset-0`}
          style={{
            filter: "brightness(0) invert(1)",
            opacity: 0,
          }}
          initial={{
            opacity: 0,
            filter: "brightness(0) invert(1) contrast(3) blur(1px)",
            clipPath: "inset(0 100% 0 0)",
          }}
          animate={{
            opacity: [0, 0.15, 0.3, 0.3],
            filter: [
              "brightness(0) invert(1) contrast(3) blur(1.5px)",
              "brightness(0) invert(1) contrast(3) blur(1px)",
              "brightness(0) invert(1) contrast(2) blur(0.5px)",
              "brightness(0) invert(1) contrast(2) blur(0.5px)",
            ],
            clipPath: [
              "inset(0 100% 0 0)",
              "inset(0 50% 0 0)",
              "inset(0 0% 0 0)",
              "inset(0 0% 0 0)",
            ],
          }}
          transition={{ duration: 1.5, ease: "easeOut", times: [0, 0.4, 0.8, 1] }}
        />

        {/* Stage 2: Detail lines appearing */}
        <motion.img
          src={takohaLogo}
          alt=""
          className={`${className} w-auto absolute inset-0`}
          style={{ filter: "brightness(0) invert(1)" }}
          initial={{
            opacity: 0,
            filter: "brightness(0) invert(1) contrast(1.5) blur(0.5px)",
            clipPath: "polygon(0 0, 0 0, 0 100%, 0 100%)",
          }}
          animate={{
            opacity: [0, 0, 0.5, 0.8],
            filter: [
              "brightness(0) invert(1) contrast(1.5) blur(0.5px)",
              "brightness(0) invert(1) contrast(1.5) blur(0.5px)",
              "brightness(0) invert(1) contrast(1.2) blur(0.3px)",
              "brightness(0) invert(1) contrast(1.1) blur(0px)",
            ],
            clipPath: [
              "polygon(0 0, 0 0, 0 100%, 0 100%)",
              "polygon(0 0, 0 0, 0 100%, 0 100%)",
              "polygon(0 0, 60% 0, 60% 100%, 0 100%)",
              "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
            ],
          }}
          transition={{
            duration: 2.8,
            ease: [0.25, 0.1, 0.25, 1],
            times: [0, 0.35, 0.65, 1],
          }}
        />

        {/* Stage 3: Final clean logo */}
        <motion.img
          src={takohaLogo}
          alt=""
          className={`${className} w-auto absolute inset-0`}
          initial={{
            opacity: 0,
            filter: "brightness(0) invert(1) blur(2px)",
          }}
          animate={{
            opacity: [0, 0, 0, 1],
            filter: [
              "brightness(0) invert(1) blur(2px)",
              "brightness(0) invert(1) blur(2px)",
              "brightness(0) invert(1) blur(1px)",
              "brightness(0) invert(1) blur(0px)",
            ],
          }}
          transition={{
            duration: 3.5,
            ease: "easeInOut",
            times: [0, 0.6, 0.8, 1],
          }}
        />

        {/* Construction guide lines */}
        <svg className="absolute inset-0 w-full h-full z-10" viewBox="0 0 200 80">
          {/* Horizontal guide */}
          <motion.line
            x1="0" y1="40" x2="200" y2="40"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="0.3"
            strokeDasharray="4 2"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: [0, 1, 1, 0], opacity: [0, 0.4, 0.4, 0] }}
            transition={{ duration: 3, times: [0, 0.3, 0.7, 1] }}
          />
          {/* Vertical center guide */}
          <motion.line
            x1="100" y1="0" x2="100" y2="80"
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="0.3"
            strokeDasharray="4 2"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: [0, 1, 1, 0], opacity: [0, 0.3, 0.3, 0] }}
            transition={{ duration: 2.8, times: [0, 0.35, 0.7, 1] }}
          />
          {/* Corner marks */}
          {[[5, 5], [195, 5], [5, 75], [195, 75]].map(([cx, cy], i) => (
            <motion.circle
              key={i}
              cx={cx} cy={cy} r="1.5"
              fill="none"
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="0.4"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: [0, 0.5, 0.5, 0], scale: [0, 1, 1, 0] }}
              transition={{ duration: 3, delay: i * 0.1, times: [0, 0.2, 0.7, 1] }}
            />
          ))}
        </svg>
      </div>
    </div>
  );
};

export default AnimatedLogo;
