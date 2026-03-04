import { useEffect, useState, useRef } from "react";
import takohaLogo from "@/assets/takoha-logo.png";

interface AnimatedLogoProps {
  className?: string;
}

const ANIM_DURATION = 2800; // ms total

const AnimatedLogo = ({ className = "h-20 md:h-24" }: AnimatedLogoProps) => {
  const [hasPlayed, setHasPlayed] = useState(() => {
    return sessionStorage.getItem("logo-animated") === "true";
  });
  const [phase, setPhase] = useState<"drawing" | "filling" | "done">("drawing");
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (hasPlayed) return;

    // Phase transitions
    const fillTimer = setTimeout(() => setPhase("filling"), ANIM_DURATION * 0.75);
    const doneTimer = setTimeout(() => {
      setPhase("done");
      sessionStorage.setItem("logo-animated", "true");
      setHasPlayed(true);
    }, ANIM_DURATION + 400);

    return () => {
      clearTimeout(fillTimer);
      clearTimeout(doneTimer);
    };
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

  const strokeDuration = `${ANIM_DURATION * 0.65}ms`;
  const detailDelay = `${ANIM_DURATION * 0.2}ms`;
  const guidesDuration = `${ANIM_DURATION * 0.5}ms`;

  return (
    <div className={`${className} w-auto relative`} style={{ aspectRatio: "3.2 / 1" }}>
      <style>{`
        @keyframes drawStroke {
          from { stroke-dashoffset: var(--dash-length); }
          to { stroke-dashoffset: 0; }
        }
        @keyframes drawGuide {
          from { stroke-dashoffset: 600; }
          to { stroke-dashoffset: 0; }
        }
        @keyframes fadeGuide {
          0%, 70% { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes fadeInFill {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes cornerPulse {
          0% { r: 0; opacity: 0; }
          30% { r: 2; opacity: 0.7; }
          70% { r: 2; opacity: 0.7; }
          100% { r: 0; opacity: 0; }
        }
        @keyframes scanLine {
          from { transform: translateX(-100%); }
          to { transform: translateX(400%); }
        }
        @keyframes cotaAppear {
          0% { opacity: 0; }
          20% { opacity: 0.5; }
          75% { opacity: 0.5; }
          100% { opacity: 0; }
        }
        .logo-stroke-main {
          stroke-dasharray: var(--dash-length);
          stroke-dashoffset: var(--dash-length);
          animation: drawStroke ${strokeDuration} cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        .logo-stroke-detail {
          stroke-dasharray: var(--dash-length);
          stroke-dashoffset: var(--dash-length);
          animation: drawStroke ${strokeDuration} cubic-bezier(0.4, 0, 0.2, 1) ${detailDelay} forwards;
        }
        .guide-line {
          stroke-dasharray: 6 4;
          stroke-dashoffset: 600;
          animation: 
            drawGuide ${guidesDuration} ease-out forwards,
            fadeGuide ${ANIM_DURATION}ms ease-in-out forwards;
        }
        .corner-mark {
          animation: cornerPulse ${ANIM_DURATION}ms ease-in-out forwards;
        }
        .scan-line {
          animation: scanLine ${ANIM_DURATION * 0.6}ms ease-in-out forwards;
        }
        .cota-text {
          animation: cotaAppear ${ANIM_DURATION}ms ease-in-out forwards;
        }
        .fill-transition {
          animation: fadeInFill 400ms ease-in-out forwards;
        }
      `}</style>

      <svg
        ref={svgRef}
        viewBox="0 0 320 100"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Takoha"
      >
        {/* Blueprint grid */}
        <defs>
          <pattern id="bp-grid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.3" />
          </pattern>
          <pattern id="bp-grid-major" width="50" height="50" patternUnits="userSpaceOnUse">
            <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="0.4" />
          </pattern>
          <clipPath id="scan-clip">
            <rect x="0" y="0" width="80" height="100" className="scan-line" />
          </clipPath>
        </defs>

        {/* Grid background */}
        <rect width="320" height="100" fill="url(#bp-grid)" opacity="0.6" />
        <rect width="320" height="100" fill="url(#bp-grid-major)" opacity="0.4" />

        {/* Guide lines - horizontal */}
        <line
          x1="10" y1="50" x2="310" y2="50"
          stroke="rgba(255,255,255,0.12)"
          strokeWidth="0.3"
          className="guide-line"
        />
        {/* Guide lines - baseline */}
        <line
          x1="10" y1="72" x2="310" y2="72"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="0.3"
          className="guide-line"
          style={{ animationDelay: "100ms" }}
        />
        {/* Guide lines - cap height */}
        <line
          x1="10" y1="28" x2="310" y2="28"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="0.3"
          className="guide-line"
          style={{ animationDelay: "150ms" }}
        />
        {/* Vertical center */}
        <line
          x1="160" y1="5" x2="160" y2="95"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="0.3"
          className="guide-line"
          style={{ animationDelay: "200ms" }}
        />

        {/* Corner construction marks */}
        {[
          [15, 20], [305, 20], [15, 80], [305, 80]
        ].map(([cx, cy], i) => (
          <g key={i}>
            <circle
              cx={cx} cy={cy} r="0"
              fill="none"
              stroke="rgba(255,255,255,0.35)"
              strokeWidth="0.5"
              className="corner-mark"
              style={{ animationDelay: `${i * 80}ms` }}
            />
            {/* Cross hairs */}
            <line
              x1={cx as number - 4} y1={cy} x2={cx as number + 4} y2={cy}
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="0.3"
              className="guide-line"
              style={{ animationDelay: `${i * 80 + 50}ms` }}
            />
            <line
              x1={cx} y1={cy as number - 4} x2={cx} y2={cy as number + 4}
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="0.3"
              className="guide-line"
              style={{ animationDelay: `${i * 80 + 50}ms` }}
            />
          </g>
        ))}

        {/* Dimension / cota marks */}
        <g className="cota-text">
          {/* Top dimension line */}
          <line x1="38" y1="18" x2="282" y2="18" stroke="rgba(255,255,255,0.15)" strokeWidth="0.3" />
          <line x1="38" y1="16" x2="38" y2="20" stroke="rgba(255,255,255,0.2)" strokeWidth="0.3" />
          <line x1="282" y1="16" x2="282" y2="20" stroke="rgba(255,255,255,0.2)" strokeWidth="0.3" />
          <text x="160" y="16" textAnchor="middle" fill="rgba(255,255,255,0.2)" fontSize="4" fontFamily="monospace">244.0</text>
          
          {/* Side dimension */}
          <line x1="308" y1="28" x2="308" y2="72" stroke="rgba(255,255,255,0.12)" strokeWidth="0.3" />
          <line x1="306" y1="28" x2="310" y2="28" stroke="rgba(255,255,255,0.15)" strokeWidth="0.3" />
          <line x1="306" y1="72" x2="310" y2="72" stroke="rgba(255,255,255,0.15)" strokeWidth="0.3" />
          <text x="312" y="52" textAnchor="start" fill="rgba(255,255,255,0.15)" fontSize="3.5" fontFamily="monospace" transform="rotate(90, 312, 52)">44.0</text>
        </g>

        {/* ===== TAKOHA letterforms — structural strokes ===== */}
        {/* T */}
        <path
          d="M 38 30 L 68 30 M 53 30 L 53 70"
          fill="none"
          stroke="white"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="logo-stroke-main"
          style={{ "--dash-length": 110 } as React.CSSProperties}
        />

        {/* A */}
        <path
          d="M 72 70 L 87 30 L 102 70 M 78 55 L 96 55"
          fill="none"
          stroke="white"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="logo-stroke-main"
          style={{ "--dash-length": 160, animationDelay: "100ms" } as React.CSSProperties}
        />

        {/* K */}
        <path
          d="M 108 30 L 108 70 M 108 52 L 130 30 M 114 50 L 132 70"
          fill="none"
          stroke="white"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="logo-stroke-main"
          style={{ "--dash-length": 140, animationDelay: "200ms" } as React.CSSProperties}
        />

        {/* O */}
        <path
          d="M 155 30 C 140 30, 136 45, 136 50 C 136 55, 140 70, 155 70 C 170 70, 174 55, 174 50 C 174 45, 170 30, 155 30 Z"
          fill="none"
          stroke="white"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="logo-stroke-main"
          style={{ "--dash-length": 140, animationDelay: "300ms" } as React.CSSProperties}
        />

        {/* H */}
        <path
          d="M 182 30 L 182 70 M 210 30 L 210 70 M 182 50 L 210 50"
          fill="none"
          stroke="white"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="logo-stroke-detail"
          style={{ "--dash-length": 120 } as React.CSSProperties}
        />

        {/* A */}
        <path
          d="M 218 70 L 237 30 L 256 70 M 224 55 L 250 55"
          fill="none"
          stroke="white"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="logo-stroke-detail"
          style={{ "--dash-length": 160, animationDelay: "100ms" } as React.CSSProperties}
        />

        {/* Secondary detail strokes — subtle architectural serif/accent marks */}
        <g className="logo-stroke-detail" style={{ "--dash-length": 20, animationDelay: "300ms" } as React.CSSProperties}>
          {/* Small baseline accent under T */}
          <line x1="48" y1="71" x2="58" y2="71" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" strokeDasharray="20" strokeDashoffset="20">
            <animate attributeName="stroke-dashoffset" from="20" to="0" dur={strokeDuration} begin={detailDelay} fill="freeze" />
          </line>
        </g>

        {/* Fill overlay — fades in during "filling" phase */}
        {phase === "filling" && (
          <g className="fill-transition" opacity="0">
            {/* T */}
            <path d="M 38 30 L 68 30 M 53 30 L 53 70" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" />
            {/* A */}
            <path d="M 72 70 L 87 30 L 102 70 M 78 55 L 96 55" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" />
            {/* K */}
            <path d="M 108 30 L 108 70 M 108 52 L 130 30 M 114 50 L 132 70" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" />
            {/* O */}
            <path d="M 155 30 C 140 30, 136 45, 136 50 C 136 55, 140 70, 155 70 C 170 70, 174 55, 174 50 C 174 45, 170 30, 155 30 Z" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" />
            {/* H */}
            <path d="M 182 30 L 182 70 M 210 30 L 210 70 M 182 50 L 210 50" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" />
            {/* A */}
            <path d="M 218 70 L 237 30 L 256 70 M 224 55 L 250 55" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" />
          </g>
        )}

        {/* Scan line effect */}
        <rect
          x="-40"
          y="0"
          width="40"
          height="100"
          fill="url(#scan-gradient)"
          className="scan-line"
          opacity="0.15"
        >
          <defs>
            <linearGradient id="scan-gradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="white" stopOpacity="0" />
              <stop offset="50%" stopColor="white" stopOpacity="0.3" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </linearGradient>
          </defs>
        </rect>

        {/* Scale reference mark — bottom left */}
        <g className="cota-text">
          <line x1="20" y1="88" x2="50" y2="88" stroke="rgba(255,255,255,0.2)" strokeWidth="0.4" />
          <line x1="20" y1="86" x2="20" y2="90" stroke="rgba(255,255,255,0.25)" strokeWidth="0.4" />
          <line x1="50" y1="86" x2="50" y2="90" stroke="rgba(255,255,255,0.25)" strokeWidth="0.4" />
          <text x="35" y="93" textAnchor="middle" fill="rgba(255,255,255,0.18)" fontSize="3" fontFamily="monospace">1:1</text>
        </g>

        {/* Project label — architectural drawing style */}
        <g className="cota-text">
          <text x="280" y="90" textAnchor="end" fill="rgba(255,255,255,0.12)" fontSize="3" fontFamily="monospace">DWG-001 REV.A</text>
          <text x="280" y="95" textAnchor="end" fill="rgba(255,255,255,0.1)" fontSize="2.5" fontFamily="monospace">LOGOTYPE — TAKOHA ESTATE</text>
        </g>
      </svg>
    </div>
  );
};

export default AnimatedLogo;
