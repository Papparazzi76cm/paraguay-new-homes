import { useEffect, useState } from "react";
import tekohaLogo from "@/assets/tekoha-logo.png";

interface AnimatedLogoProps {
  className?: string;
}

const ANIM_DURATION = 2800;

const AnimatedLogo = ({ className = "h-20 md:h-24" }: AnimatedLogoProps) => {
  const [hasPlayed, setHasPlayed] = useState(() => {
    return sessionStorage.getItem("logo-animated") === "true";
  });
  const [phase, setPhase] = useState<"construction" | "reveal" | "done">("construction");

  useEffect(() => {
    if (hasPlayed) return;

    const revealTimer = setTimeout(() => setPhase("reveal"), ANIM_DURATION * 0.35);
    const doneTimer = setTimeout(() => {
      setPhase("done");
      sessionStorage.setItem("logo-animated", "true");
      setHasPlayed(true);
    }, ANIM_DURATION + 600);

    return () => {
      clearTimeout(revealTimer);
      clearTimeout(doneTimer);
    };
  }, [hasPlayed]);

  if (hasPlayed) {
    return (
      <img
        src={tekohaLogo}
        alt="Tekoha"
        className={`${className} w-auto brightness-0 invert`}
      />
    );
  }

  const guideDur = `${ANIM_DURATION * 0.4}ms`;
  const revealDur = `${ANIM_DURATION * 0.55}ms`;
  const revealDelay = `${ANIM_DURATION * 0.35}ms`;
  const fadeOutDelay = `${ANIM_DURATION * 0.7}ms`;
  const fadeOutDur = `${ANIM_DURATION * 0.3}ms`;

  return (
    <div className={`${className} w-auto relative`} style={{ aspectRatio: "1 / 1" }}>
      <style>{`
        @keyframes drawGuide {
          from { stroke-dashoffset: 800; }
          to { stroke-dashoffset: 0; }
        }
        @keyframes fadeOutGuide {
          0% { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes cornerPulse {
          0% { r: 0; opacity: 0; }
          25% { r: 3; opacity: 0.6; }
          75% { r: 3; opacity: 0.6; }
          100% { r: 0; opacity: 0; }
        }
        @keyframes cotaAppear {
          0% { opacity: 0; }
          15% { opacity: 0.5; }
          70% { opacity: 0.5; }
          100% { opacity: 0; }
        }
        @keyframes revealLogo {
          0% { clip-path: inset(0 100% 0 0); }
          100% { clip-path: inset(0 0% 0 0); }
        }
        @keyframes revealLogoFinal {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        .anim-guide {
          stroke-dasharray: 8 5;
          stroke-dashoffset: 800;
          animation: 
            drawGuide ${guideDur} ease-out forwards,
            fadeOutGuide ${fadeOutDur} ease-in ${fadeOutDelay} forwards;
        }
        .anim-corner {
          animation: cornerPulse ${ANIM_DURATION}ms ease-in-out forwards;
        }
        .anim-cota {
          animation: cotaAppear ${ANIM_DURATION}ms ease-in-out forwards;
        }
        .anim-reveal {
          clip-path: inset(0 100% 0 0);
          animation: revealLogo ${revealDur} cubic-bezier(0.25, 0.1, 0.25, 1) ${revealDelay} forwards;
        }
        .anim-grid-fade {
          animation: fadeOutGuide ${fadeOutDur} ease-in ${fadeOutDelay} forwards;
        }
      `}</style>

      {/* SVG construction overlay */}
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 w-full h-full anim-grid-fade"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Blueprint grid */}
        <defs>
          <pattern id="anim-grid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.3" />
          </pattern>
          <pattern id="anim-grid-lg" width="25" height="25" patternUnits="userSpaceOnUse">
            <path d="M 25 0 L 0 0 0 25" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.4" />
          </pattern>
        </defs>

        <rect width="100" height="100" fill="url(#anim-grid)" />
        <rect width="100" height="100" fill="url(#anim-grid-lg)" />

        {/* Horizontal guides */}
        <line x1="5" y1="30" x2="95" y2="30" stroke="rgba(255,255,255,0.15)" strokeWidth="0.3" className="anim-guide" />
        <line x1="5" y1="50" x2="95" y2="50" stroke="rgba(255,255,255,0.12)" strokeWidth="0.3" className="anim-guide" style={{ animationDelay: "80ms" }} />
        <line x1="5" y1="70" x2="95" y2="70" stroke="rgba(255,255,255,0.15)" strokeWidth="0.3" className="anim-guide" style={{ animationDelay: "160ms" }} />

        {/* Vertical guides */}
        <line x1="15" y1="5" x2="15" y2="95" stroke="rgba(255,255,255,0.1)" strokeWidth="0.3" className="anim-guide" style={{ animationDelay: "120ms" }} />
        <line x1="50" y1="5" x2="50" y2="95" stroke="rgba(255,255,255,0.1)" strokeWidth="0.3" className="anim-guide" style={{ animationDelay: "200ms" }} />
        <line x1="85" y1="5" x2="85" y2="95" stroke="rgba(255,255,255,0.1)" strokeWidth="0.3" className="anim-guide" style={{ animationDelay: "240ms" }} />

        {/* Corner crosshairs */}
        {[
          [15, 30], [85, 30], [15, 70], [85, 70]
        ].map(([cx, cy], i) => (
          <g key={i}>
            <circle cx={cx} cy={cy} r="0" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="0.5" className="anim-corner" style={{ animationDelay: `${i * 60}ms` }} />
            <line x1={cx as number - 5} y1={cy} x2={cx as number + 5} y2={cy} stroke="rgba(255,255,255,0.25)" strokeWidth="0.3" className="anim-guide" style={{ animationDelay: `${i * 60 + 40}ms` }} />
            <line x1={cx} y1={cy as number - 5} x2={cx} y2={cy as number + 5} stroke="rgba(255,255,255,0.25)" strokeWidth="0.3" className="anim-guide" style={{ animationDelay: `${i * 60 + 40}ms` }} />
          </g>
        ))}

        {/* Dimension marks */}
        <g className="anim-cota">
          <line x1="15" y1="22" x2="85" y2="22" stroke="rgba(255,255,255,0.18)" strokeWidth="0.3" />
          <line x1="15" y1="20" x2="15" y2="24" stroke="rgba(255,255,255,0.25)" strokeWidth="0.4" />
          <line x1="85" y1="20" x2="85" y2="24" stroke="rgba(255,255,255,0.25)" strokeWidth="0.4" />
          <text x="50" y="20" textAnchor="middle" fill="rgba(255,255,255,0.22)" fontSize="3" fontFamily="monospace">70.0</text>

          <line x1="92" y1="30" x2="92" y2="70" stroke="rgba(255,255,255,0.15)" strokeWidth="0.3" />
          <line x1="90" y1="30" x2="94" y2="30" stroke="rgba(255,255,255,0.2)" strokeWidth="0.3" />
          <line x1="90" y1="70" x2="94" y2="70" stroke="rgba(255,255,255,0.2)" strokeWidth="0.3" />
          <text x="95" y="52" textAnchor="start" fill="rgba(255,255,255,0.18)" fontSize="2.5" fontFamily="monospace" transform="rotate(90, 95, 52)">40.0</text>
        </g>

        {/* Scale mark */}
        <g className="anim-cota">
          <line x1="8" y1="90" x2="28" y2="90" stroke="rgba(255,255,255,0.2)" strokeWidth="0.4" />
          <line x1="8" y1="88" x2="8" y2="92" stroke="rgba(255,255,255,0.3)" strokeWidth="0.4" />
          <line x1="28" y1="88" x2="28" y2="92" stroke="rgba(255,255,255,0.3)" strokeWidth="0.4" />
          <text x="18" y="95" textAnchor="middle" fill="rgba(255,255,255,0.2)" fontSize="2.5" fontFamily="monospace">1:1</text>
        </g>

        {/* Drawing label */}
        <g className="anim-cota">
          <text x="88" y="90" textAnchor="end" fill="rgba(255,255,255,0.14)" fontSize="2.5" fontFamily="monospace">DWG-001 REV.A</text>
          <text x="88" y="94" textAnchor="end" fill="rgba(255,255,255,0.11)" fontSize="2" fontFamily="monospace">LOGOTYPE — TEKOHA</text>
        </g>
      </svg>

      {/* Actual logo image — revealed progressively */}
      <img
        src={tekohaLogo}
        alt="Tekoha"
        className="absolute inset-0 w-full h-full object-contain brightness-0 invert anim-reveal"
      />
    </div>
  );
};

export default AnimatedLogo;
