import { useState, useEffect, useRef } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300;1,400&display=swap');

  .oi * { margin: 0; padding: 0; box-sizing: border-box; }
  .oi {
    background: #0a1a14; color: #f5f0e8;
    font-family: 'DM Sans', sans-serif; font-weight: 300;
    overflow-x: hidden; -webkit-font-smoothing: antialiased; min-height: 100vh;
  }

  /* NAV */
  .oi-nav { position: fixed; top: 0; left: 0; right: 0; z-index: 100; padding: 2rem 3rem; display: flex; justify-content: space-between; align-items: center; mix-blend-mode: difference; }
  .oi-logo { display: flex; align-items: center; gap: 0.6rem; font-size: 1.2rem; font-weight: 400; letter-spacing: 0.05em; color: #f5f0e8; text-decoration: none; }
  .oi-logo-pill { width: 28px; height: 14px; background: #f5f0e8; border-radius: 7px; }
  .oi-nav-links { display: flex; gap: 2.5rem; align-items: center; }
  .oi-nav-links a { font-size: 0.85rem; font-weight: 400; letter-spacing: 0.08em; color: #f5f0e8; text-decoration: none; text-transform: uppercase; transition: opacity 0.3s; }
  .oi-nav-links a:hover { opacity: 0.6; }
  .oi-nav-links a.oi-active { opacity: 0.5; }
  .oi-hamburger { display: none; flex-direction: column; gap: 5px; cursor: pointer; background: none; border: none; padding: 4px; }
  .oi-hamburger span { display: block; width: 22px; height: 1.5px; background: #f5f0e8; }
  .oi-mobile-menu { display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: #0a1a14; z-index: 200; flex-direction: column; align-items: center; justify-content: center; gap: 2.5rem; }
  .oi-mobile-menu.open { display: flex; }
  .oi-mobile-menu a { font-size: 1.5rem; font-weight: 400; letter-spacing: 0.08em; color: #f5f0e8; text-decoration: none; text-transform: uppercase; }
  .oi-mobile-close { position: absolute; top: 2rem; right: 2rem; background: none; border: none; color: #f5f0e8; font-size: 2rem; cursor: pointer; }

  /* HERO */
  .oi-hero {
    min-height: 100vh;
    display: grid; grid-template-columns: 1fr 1fr;
    align-items: center; padding: 0 8vw; gap: 4rem;
    position: relative; overflow: hidden;
  }
  .oi-hero::before {
    content: ''; position: absolute; top: -20%; left: -10%;
    width: 60vw; height: 60vw;
    background: radial-gradient(circle, rgba(45,138,110,0.07) 0%, transparent 70%);
    pointer-events: none;
  }
  .oi-hero-label { font-size: 0.75rem; letter-spacing: 0.2em; text-transform: uppercase; color: #2d8a6e; margin-bottom: 2rem; opacity: 0; animation: oi-fadeUp 1s ease-out 0.2s forwards; }
  .oi-hero h1 { font-family: 'DM Serif Display', serif; font-weight: 400; font-size: clamp(3.5rem, 7vw, 7rem); line-height: 0.95; letter-spacing: -0.04em; margin-bottom: 2rem; opacity: 0; animation: oi-fadeUp 1s ease-out 0.4s forwards; }
  .oi-hero-sub { font-size: clamp(1rem, 1.4vw, 1.15rem); line-height: 1.7; color: #7a8a82; max-width: 440px; opacity: 0; animation: oi-fadeUp 1s ease-out 0.7s forwards; }
  .oi-hero-visual { opacity: 0; animation: oi-fadeUp 1s ease-out 0.9s forwards; display: flex; align-items: center; justify-content: center; }

  /* PROBLEM SPLIT */
  .oi-problem {
    display: grid; grid-template-columns: 1fr 1fr; min-height: 70vh;
  }
  .oi-problem-left {
    background: #f5f0e8; color: #0a1a14;
    display: flex; align-items: center; padding: 12vh 8vw;
  }
  .oi-problem-right {
    background: #1a3a2a;
    display: flex; align-items: center; justify-content: center;
    padding: 6vh 5vw;
  }
  .oi-problem-left h2 { font-family: 'DM Serif Display', serif; font-size: clamp(1.6rem, 2.5vw, 2.2rem); font-weight: 400; line-height: 1.3; margin-bottom: 1.5rem; }
  .oi-problem-left p { font-size: 0.95rem; line-height: 1.8; color: #7a8a82; }

  /* CASCADE — cream */
  .oi-cascade { background: #f5f0e8; color: #0a1a14; padding: 14vh 8vw; }
  .oi-section-label { font-size: 0.75rem; letter-spacing: 0.2em; text-transform: uppercase; color: #2d8a6e; margin-bottom: 5rem; }
  .oi-cascade-stack { display: flex; flex-direction: column; }
  .oi-cascade-row {
    display: grid; grid-template-columns: 120px 1fr 1fr;
    border-top: 1px solid rgba(10,26,20,0.08);
    align-items: stretch;
  }
  .oi-cascade-row:last-child { border-bottom: 1px solid rgba(10,26,20,0.08); }
  .oi-cascade-id {
    display: flex; flex-direction: column; justify-content: center;
    padding: 2.5rem 2rem 2.5rem 0; gap: 0.2rem;
  }
  .oi-cascade-letter { font-family: 'DM Serif Display', serif; font-size: 2.8rem; color: #0a1a14; line-height: 1; }
  .oi-cascade-word { font-size: 0.65rem; letter-spacing: 0.18em; text-transform: uppercase; color: #2d8a6e; }
  .oi-cascade-text {
    padding: 2.5rem 2rem; border-left: 1px solid rgba(10,26,20,0.08);
    display: flex; align-items: center;
  }
  .oi-cascade-example { font-family: 'DM Serif Display', serif; font-size: clamp(1rem, 1.4vw, 1.2rem); line-height: 1.5; color: #0a1a14; }
  .oi-cascade-vis {
    padding: 2rem; border-left: 1px solid rgba(10,26,20,0.08);
    display: flex; align-items: center; justify-content: center;
  }

  /* connector arrow between cascade rows */
  .oi-cascade-connector {
    display: flex; align-items: center; justify-content: center;
    height: 28px; position: relative;
  }
  .oi-cascade-connector::before {
    content: ''; position: absolute; left: 59px; top: 0; bottom: 0;
    width: 1px; background: rgba(45,138,110,0.3);
  }

  /* OUTCOMES */
  .oi-outcomes { background: #0a1a14; padding: 14vh 8vw; }
  .oi-outcomes-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2px; margin-top: 4rem; }
  .oi-outcome-card { padding: 3rem 2.5rem; border-top: 1px solid rgba(245,240,232,0.08); display: flex; flex-direction: column; gap: 1.5rem; }
  .oi-outcome-vis { height: 120px; display: flex; align-items: center; }
  .oi-outcome-who { font-size: 0.7rem; letter-spacing: 0.18em; text-transform: uppercase; color: #2d8a6e; }
  .oi-outcome-text { font-family: 'DM Serif Display', serif; font-size: clamp(1.1rem, 1.6vw, 1.4rem); line-height: 1.4; color: #f5f0e8; }

  /* CTA */
  .oi-cta { min-height: 55vh; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 14vh 8vw; background: #0a1a14; position: relative; overflow: hidden; }
  .oi-cta::before { content: ''; position: absolute; bottom: -20%; left: 50%; transform: translateX(-50%); width: 70vw; height: 50vw; background: radial-gradient(circle, rgba(45,138,110,0.08) 0%, transparent 70%); pointer-events: none; }
  .oi-cta h2 { font-family: 'DM Serif Display', serif; font-size: clamp(2.5rem, 5vw, 5rem); font-weight: 400; line-height: 1.1; margin-bottom: 1rem; letter-spacing: -0.03em; }
  .oi-cta h2 em { font-style: italic; color: #2d8a6e; }
  .oi-cta-sub { font-size: 1rem; color: #7a8a82; margin-bottom: 3rem; max-width: 400px; }
  .oi-cta-btn { display: inline-flex; align-items: center; gap: 0.75rem; background: #2d8a6e; color: #f5f0e8; padding: 1rem 2.5rem; border-radius: 50px; font-size: 0.95rem; font-weight: 400; text-decoration: none; cursor: pointer; border: none; transition: all 0.3s; position: relative; z-index: 1; }
  .oi-cta-btn:hover { background: #35a080; transform: translateY(-2px); }
  .oi-cta-btn svg { width: 16px; height: 16px; transition: transform 0.3s; }
  .oi-cta-btn:hover svg { transform: translateX(3px); }

  .oi-footer { padding: 3rem 8vw; display: flex; justify-content: space-between; align-items: center; font-size: 0.8rem; color: #7a8a82; border-top: 1px solid rgba(245,240,232,0.08); }

  @keyframes oi-fadeUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
  .oi-reveal { opacity: 0; transform: translateY(40px); transition: all 0.9s cubic-bezier(0.16, 1, 0.3, 1); }
  .oi-reveal.oi-visible { opacity: 1; transform: translateY(0); }

  @media (max-width: 768px) {
    .oi-nav { padding: 1.5rem 2rem; }
    .oi-nav-links { display: none; }
    .oi-hamburger { display: flex; }
    .oi-hero { grid-template-columns: 1fr; padding-top: 10rem; gap: 2rem; }
    .oi-hero-visual { display: none; }
    .oi-problem { grid-template-columns: 1fr; }
    .oi-cascade-row { grid-template-columns: 80px 1fr; }
    .oi-cascade-vis { display: none; }
    .oi-outcomes-grid { grid-template-columns: 1fr; }
  }
`;

function Reveal({ children, delay = 0 }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.08 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={ref} className={`oi-reveal ${visible ? "oi-visible" : ""}`} style={{ transitionDelay: visible ? `${delay}ms` : "0ms" }}>
      {children}
    </div>
  );
}

/* ── Hero visual: misaligned → aligned org flow ── */
function HeroVisual() {
  const [aligned, setAligned] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setAligned(true), 1200);
    return () => clearTimeout(t1);
  }, []);

  // 3 source rows, tangled destinations, then snap to aligned
  const rows = [
    { srcY: 70,  tangleDest: 190, col: "rgba(45,138,110,0.75)" },
    { srcY: 150, tangleDest: 150, col: "rgba(45,138,110,0.5)" },
    { srcY: 230, tangleDest: 70,  col: "rgba(45,138,110,0.32)" },
  ];

  return (
    <svg viewBox="0 0 380 300" fill="none" style={{ width: "100%", maxWidth: 420 }}>
      <defs>
        <filter id="hv-glow"><feGaussianBlur stdDeviation="4" /></filter>
      </defs>

      {/* Column guides */}
      {[60, 190, 310].map((x, i) => (
        <line key={i} x1={x} y1={18} x2={x} y2={270} stroke="rgba(245,240,232,0.04)" strokeWidth="1" />
      ))}

      {/* Column labels */}
      {["GOAL","TEAM","OUTCOME"].map((lbl, i) => (
        <text key={i} x={[60,190,310][i]} y={286} textAnchor="middle"
          fill="rgba(245,240,232,0.18)" fontSize="7.5" fontFamily="DM Sans" letterSpacing="0.14em">{lbl}</text>
      ))}

      {rows.map((row, i) => {
        const destY = aligned ? row.srcY : row.tangleDest;
        // cubic bezier: from source straight, curve through midpoint to dest
        const d = `M ${67} ${row.srcY} C ${128} ${row.srcY} ${128} ${destY} ${183} ${destY} C ${248} ${destY} ${248} ${row.srcY} ${303} ${row.srcY}`;
        const isCrossed = !aligned && row.tangleDest !== row.srcY;

        return (
          <g key={i}>
            {/* Glow behind source node */}
            <circle cx={60} cy={row.srcY} r={16} fill={row.col} opacity={0.12} filter="url(#hv-glow)" />
            {/* Source node */}
            <circle cx={60} cy={row.srcY} r={7} fill={row.col} />

            {/* Path */}
            <path d={d} stroke={row.col}
              strokeWidth={aligned ? "1.8" : "1.2"}
              opacity={aligned ? 1 : 0.55}
              strokeDasharray={isCrossed ? "5 5" : "none"}
              style={{ transition: "d 1s cubic-bezier(0.16,1,0.3,1), stroke-width 1s ease, opacity 1s ease" }}
            />

            {/* Mid node — snaps into place */}
            <circle cx={190} cy={destY} r={5} fill={aligned ? row.col : "rgba(245,240,232,0.12)"}
              style={{ transition: "cy 1s cubic-bezier(0.16,1,0.3,1), fill 0.8s ease" }} />

            {/* End node */}
            <circle cx={310} cy={row.srcY} r={7} fill={row.col}
              opacity={aligned ? 1 : 0.25}
              style={{ transition: "opacity 1s ease" }} />

            {/* Block X on crossed paths */}
            {isCrossed && (
              <g style={{ transition: "opacity 0.4s ease" }}>
                <line x1={183} y1={destY - 6} x2={197} y2={destY + 6} stroke="rgba(200,80,80,0.45)" strokeWidth="1.5" strokeLinecap="round" />
                <line x1={197} y1={destY - 6} x2={183} y2={destY + 6} stroke="rgba(200,80,80,0.45)" strokeWidth="1.5" strokeLinecap="round" />
              </g>
            )}
          </g>
        );
      })}

      {/* Aligned indicator */}
      {aligned && (
        <text x={190} y={260} textAnchor="middle"
          fill="rgba(45,138,110,0.35)" fontSize="8" fontFamily="DM Sans" letterSpacing="0.2em">ALIGNED</text>
      )}
    </svg>
  );
}

/* ── Cascade row illustrations ── */
function GoalVis() {
  return (
    <svg viewBox="0 0 120 90" fill="none" style={{ width: 120 }}>
      <circle cx="60" cy="45" r="35" stroke="rgba(45,138,110,0.2)" strokeWidth="1" />
      <circle cx="60" cy="45" r="22" stroke="rgba(45,138,110,0.35)" strokeWidth="1" />
      <circle cx="60" cy="45" r="10" fill="rgba(45,138,110,0.5)" />
      <circle cx="60" cy="45" r="4" fill="#0a1a14" />
      <line x1="60" y1="10" x2="60" y2="80" stroke="rgba(10,26,20,0.08)" strokeWidth="1" />
      <line x1="25" y1="45" x2="95" y2="45" stroke="rgba(10,26,20,0.08)" strokeWidth="1" />
    </svg>
  );
}
function ConstraintVis() {
  return (
    <svg viewBox="0 0 120 90" fill="none" style={{ width: 120 }}>
      {/* Wall of blocks */}
      {[0,1,2,3].map(i => (
        <rect key={i} x={10 + i * 25} y={30} width={20} height={32} rx="2"
          fill={i === 2 ? "rgba(200,80,80,0.15)" : "rgba(10,26,20,0.1)"}
          stroke={i === 2 ? "rgba(200,80,80,0.4)" : "rgba(10,26,20,0.15)"} strokeWidth="1" />
      ))}
      {/* Arrow hitting wall */}
      <path d="M 15 16 L 60 16" stroke="rgba(45,138,110,0.5)" strokeWidth="1.5" markerEnd="url(#arr)" />
      <line x1="60" y1="10" x2="60" y2="22" stroke="rgba(200,80,80,0.5)" strokeWidth="1.5" />
      <text x="60" y="80" textAnchor="middle" fill="rgba(10,26,20,0.2)" fontSize="7" fontFamily="DM Sans" letterSpacing="0.1em">BLOCKER</text>
    </svg>
  );
}
function DriverVis() {
  return (
    <svg viewBox="0 0 120 90" fill="none" style={{ width: 120 }}>
      {/* Lever diagram */}
      <line x1="20" y1="70" x2="100" y2="70" stroke="rgba(10,26,20,0.12)" strokeWidth="1" />
      <polygon points="60,70 45,40 75,40" fill="none" stroke="rgba(10,26,20,0.15)" strokeWidth="1" />
      <line x1="20" y1="55" x2="100" y2="45" stroke="rgba(45,138,110,0.6)" strokeWidth="2" strokeLinecap="round" />
      <circle cx="20" cy="55" r="4" fill="rgba(45,138,110,0.4)" />
      <circle cx="60" cy="70" r="4" fill="rgba(45,138,110,0.7)" />
      <text x="60" y="85" textAnchor="middle" fill="rgba(10,26,20,0.2)" fontSize="7" fontFamily="DM Sans" letterSpacing="0.1em">LEVER</text>
    </svg>
  );
}
function ConditionsVis() {
  return (
    <svg viewBox="0 0 120 90" fill="none" style={{ width: 120 }}>
      {/* Interconnected conditions */}
      {[[30,30],[90,30],[60,65]].map(([cx,cy],i) => (
        <g key={i}>
          <circle cx={cx} cy={cy} r={12} fill="rgba(45,138,110,0.08)" stroke="rgba(45,138,110,0.3)" strokeWidth="1" />
          <circle cx={cx} cy={cy} r={4} fill="rgba(45,138,110,0.5)" />
        </g>
      ))}
      <line x1="42" y1="30" x2="78" y2="30" stroke="rgba(45,138,110,0.25)" strokeWidth="1" />
      <line x1="37" y1="40" x2="53" y2="56" stroke="rgba(45,138,110,0.25)" strokeWidth="1" />
      <line x1="83" y1="40" x2="67" y2="56" stroke="rgba(45,138,110,0.25)" strokeWidth="1" />
      <text x="60" y="85" textAnchor="middle" fill="rgba(10,26,20,0.2)" fontSize="7" fontFamily="DM Sans" letterSpacing="0.1em">SYSTEM</text>
    </svg>
  );
}
function InputsVis() {
  return (
    <svg viewBox="0 0 120 90" fill="none" style={{ width: 120 }}>
      {/* Funnel */}
      <path d="M 15 20 L 105 20 L 75 55 L 75 78 L 45 78 L 45 55 Z" fill="rgba(45,138,110,0.06)" stroke="rgba(45,138,110,0.3)" strokeWidth="1" />
      {[0,1,2].map(i => (
        <line key={i} x1={25 + i*25} y1={15} x2={25 + i*25} y2={25} stroke="rgba(45,138,110,0.4)" strokeWidth="1.5" strokeLinecap="round" />
      ))}
      <circle cx="60" cy="68" r="5" fill="rgba(45,138,110,0.7)" />
      <text x="60" y="88" textAnchor="middle" fill="rgba(10,26,20,0.2)" fontSize="7" fontFamily="DM Sans" letterSpacing="0.1em">INPUTS</text>
    </svg>
  );
}

/* ── Problem right-side visual: initiative stuck ── */
function StuckVisual() {
  const blockers = [
    { angle: -120, label: "COMPETING\nPRIORITIES" },
    { angle: -60,  label: "UNCLEAR\nOWNERSHIP" },
    { angle: 60,   label: "UNMET\nCONDITIONS" },
    { angle: 120,  label: "HIDDEN\nDRIVERS" },
  ];

  const cx = 200, cy = 200, innerR = 52, outerR = 130;

  return (
    <svg viewBox="0 0 400 400" fill="none" style={{ width: "100%", maxWidth: 420 }}>
      <defs>
        <radialGradient id="sv-core" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#2d8a6e" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#2d8a6e" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="sv-bg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#1a3a2a" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#1a3a2a" stopOpacity="0" />
        </radialGradient>
        <filter id="sv-blur">
          <feGaussianBlur stdDeviation="8" />
        </filter>
        <filter id="sv-soft">
          <feGaussianBlur stdDeviation="2.5" />
        </filter>
      </defs>

      {/* Ambient glow behind center */}
      <circle cx={cx} cy={cy} r="120" fill="url(#sv-bg)" />
      <circle cx={cx} cy={cy} r="80" fill="rgba(45,138,110,0.07)" filter="url(#sv-blur)" />

      {/* Orbit rings */}
      <circle cx={cx} cy={cy} r={outerR} stroke="rgba(245,240,232,0.04)" strokeWidth="1" />
      <circle cx={cx} cy={cy} r={outerR * 0.72} stroke="rgba(245,240,232,0.05)" strokeWidth="1" strokeDasharray="3 6" />
      <circle cx={cx} cy={cy} r={outerR * 0.45} stroke="rgba(45,138,110,0.12)" strokeWidth="1" strokeDasharray="2 4" />

      {/* Blocker arms */}
      {blockers.map(({ angle }, i) => {
        const rad = (angle * Math.PI) / 180;
        const x1 = cx + Math.cos(rad) * (innerR + 4);
        const y1 = cy + Math.sin(rad) * (innerR + 4);
        const x2 = cx + Math.cos(rad) * (outerR - 18);
        const y2 = cy + Math.sin(rad) * (outerR - 18);
        return (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
            stroke="rgba(200,80,80,0.18)" strokeWidth="1.5" strokeDasharray="4 5" />
        );
      })}

      {/* Blocker nodes */}
      {blockers.map(({ angle, label }, i) => {
        const rad = (angle * Math.PI) / 180;
        const nx = cx + Math.cos(rad) * (outerR - 18);
        const ny = cy + Math.sin(rad) * (outerR - 18);
        const lx = cx + Math.cos(rad) * (outerR + 14);
        const ly = cy + Math.sin(rad) * (outerR + 14);
        const lines = label.split("\n");
        return (
          <g key={i}>
            {/* Blocker halo */}
            <circle cx={nx} cy={ny} r="16" fill="rgba(200,80,80,0.06)" stroke="rgba(200,80,80,0.18)" strokeWidth="1" />
            {/* X mark */}
            <line x1={nx-5} y1={ny-5} x2={nx+5} y2={ny+5} stroke="rgba(200,80,80,0.55)" strokeWidth="1.5" strokeLinecap="round" />
            <line x1={nx+5} y1={ny-5} x2={nx-5} y2={ny+5} stroke="rgba(200,80,80,0.55)" strokeWidth="1.5" strokeLinecap="round" />
            {/* Label */}
            {lines.map((ln, li) => (
              <text key={li} x={lx} y={ly - 4 + li * 10}
                textAnchor="middle"
                fill="rgba(245,240,232,0.22)"
                fontSize="7.5" fontFamily="DM Sans" letterSpacing="0.12em">{ln}</text>
            ))}
          </g>
        );
      })}

      {/* Central goal — layered circles */}
      <circle cx={cx} cy={cy} r={innerR + 16} fill="rgba(45,138,110,0.06)" filter="url(#sv-soft)" />
      <circle cx={cx} cy={cy} r={innerR} fill="url(#sv-core)" stroke="rgba(45,138,110,0.35)" strokeWidth="1.5" />
      <circle cx={cx} cy={cy} r={innerR - 10} fill="none" stroke="rgba(45,138,110,0.15)" strokeWidth="1" strokeDasharray="3 5" />

      <text x={cx} y={cy - 7} textAnchor="middle" fill="rgba(245,240,232,0.7)" fontSize="10" fontFamily="DM Sans" letterSpacing="0.18em" fontWeight="400">GOAL</text>
      <text x={cx} y={cy + 9} textAnchor="middle" fill="rgba(45,138,110,0.6)" fontSize="7.5" fontFamily="DM Sans" letterSpacing="0.12em">SET, NOT MOVING</text>

      {/* Tension arrows pointing inward (pressure on goal) */}
      {blockers.map(({ angle }, i) => {
        const rad = (angle * Math.PI) / 180;
        const ax = cx + Math.cos(rad) * (innerR + 28);
        const ay = cy + Math.sin(rad) * (innerR + 28);
        const tipX = cx + Math.cos(rad) * (innerR + 10);
        const tipY = cy + Math.sin(rad) * (innerR + 10);
        return (
          <line key={i} x1={ax} y1={ay} x2={tipX} y2={tipY}
            stroke="rgba(200,80,80,0.22)" strokeWidth="1"
            markerEnd="url(#arrowRed)" />
        );
      })}

      <defs>
        <marker id="arrowRed" markerWidth="5" markerHeight="5" refX="3" refY="2.5" orient="auto">
          <path d="M0,0 L0,5 L5,2.5 Z" fill="rgba(200,80,80,0.4)" />
        </marker>
      </defs>

      {/* STUCK watermark */}
      <text x={cx} y={cy + 170} textAnchor="middle"
        fill="rgba(245,240,232,0.04)" fontSize="52"
        fontFamily="DM Serif Display, serif" letterSpacing="-0.03em" fontStyle="italic">stuck.</text>
    </svg>
  );
}

/* ── Outcome visuals ── */
function ClarityVis() {
  return (
    <svg viewBox="0 0 140 100" fill="none" style={{ width: 140 }}>
      <circle cx="70" cy="50" r="35" fill="none" stroke="rgba(45,138,110,0.15)" strokeWidth="1" strokeDasharray="4 4" />
      <circle cx="70" cy="50" r="22" fill="none" stroke="rgba(45,138,110,0.3)" strokeWidth="1" />
      <circle cx="70" cy="50" r="10" fill="rgba(45,138,110,0.4)" />
      <circle cx="70" cy="50" r="4" fill="#f5f0e8" />
      <line x1="70" y1="15" x2="70" y2="28" stroke="rgba(45,138,110,0.4)" strokeWidth="1" strokeDasharray="2 2" />
      <line x1="70" y1="72" x2="70" y2="85" stroke="rgba(45,138,110,0.4)" strokeWidth="1" strokeDasharray="2 2" />
      <line x1="35" y1="50" x2="48" y2="50" stroke="rgba(45,138,110,0.4)" strokeWidth="1" strokeDasharray="2 2" />
      <line x1="92" y1="50" x2="105" y2="50" stroke="rgba(45,138,110,0.4)" strokeWidth="1" strokeDasharray="2 2" />
    </svg>
  );
}
function MapVis() {
  const nodes = [[70,20],[30,60],[70,60],[110,60],[50,90],[90,90]];
  const edges = [[0,1],[0,2],[0,3],[1,4],[2,4],[2,5],[3,5]];
  return (
    <svg viewBox="0 0 140 110" fill="none" style={{ width: 140 }}>
      {edges.map(([a,b],i) => (
        <line key={i} x1={nodes[a][0]} y1={nodes[a][1]} x2={nodes[b][0]} y2={nodes[b][1]} stroke="rgba(245,240,232,0.15)" strokeWidth="1" />
      ))}
      {nodes.map(([cx,cy],i) => (
        <g key={i}>
          <circle cx={cx} cy={cy} r={i===0?8:6} fill={i===0 ? "rgba(45,138,110,0.7)" : "rgba(45,138,110,0.25)"} />
          {i===0 && <circle cx={cx} cy={cy} r={14} fill="rgba(45,138,110,0.1)" />}
        </g>
      ))}
    </svg>
  );
}
function PathVis() {
  return (
    <svg viewBox="0 0 140 100" fill="none" style={{ width: 140 }}>
      <path d="M 15 80 C 40 80 40 20 70 20 C 100 20 100 60 125 60" stroke="rgba(45,138,110,0.6)" strokeWidth="2" strokeLinecap="round" fill="none" />
      {[0,0.25,0.5,0.75,1].map((t,i) => {
        const x = 15 + t*110;
        const y = i===0?80:i===1?60:i===2?20:i===3?40:60;
        return <circle key={i} cx={x} cy={y} r={i===4?6:4} fill={i===4?"rgba(45,138,110,0.9)":"rgba(45,138,110,0.4)"} />;
      })}
      <circle cx="125" cy="60" r="10" fill="rgba(45,138,110,0.15)" stroke="rgba(45,138,110,0.4)" strokeWidth="1" />
    </svg>
  );
}

const cascade = [
  { letter: "G", word: "Goal", example: "Move upmarket by Q4. Current deal size can't sustain the business.", Vis: GoalVis },
  { letter: "C", word: "Constraint", example: "The sales team is built for SMB. Nobody has closed above $200K.", Vis: ConstraintVis },
  { letter: "D", word: "Driver", example: "Enterprise seller capacity. But leadership hasn't agreed that's the lever.", Vis: DriverVis },
  { letter: "C", word: "Conditions", example: "Comp plan doesn't incentivize larger deals. No recruiting pipeline. No enterprise reputation.", Vis: ConditionsVis },
  { letter: "I", word: "Inputs", example: "Job descriptions test for SMB hustle. Interview process filters out enterprise sellers. No executive sponsor.", Vis: InputsVis },
];

export default function OneInitiative() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <>
      <style>{styles}</style>
      <div className="oi">
        {/* NAV */}
        <nav className="oi-nav">
          <a className="oi-logo" href="/"><div className="oi-logo-pill" /> drvrs</a>
          <div className="oi-nav-links">
            <a href="/OneDay">One Day</a>
            <a href="/OneInitiative" className="oi-active">One Initiative</a>
            <a href="/OneTeam">One Team</a>
          </div>
          {!menuOpen && <button className="oi-hamburger" onClick={() => setMenuOpen(true)}><span /><span /><span /></button>}
        </nav>
        <div className={`oi-mobile-menu ${menuOpen ? "open" : ""}`}>
          <button className="oi-mobile-close" onClick={() => setMenuOpen(false)}>✕</button>
          <a href="/OneDay" onClick={() => setMenuOpen(false)}>One Day</a>
          <a href="/OneInitiative" onClick={() => setMenuOpen(false)}>One Initiative</a>
          <a href="/OneTeam" onClick={() => setMenuOpen(false)}>One Team</a>
        </div>

        {/* HERO */}
        <section className="oi-hero">
          <div>
            <div className="oi-hero-label">Initiative Alignment</div>
            <h1>One<br />Initiative.</h1>
            <p className="oi-hero-sub">Leadership set the goal. Everyone nodded. Nothing moved. Sound familiar?</p>
          </div>
          <div className="oi-hero-visual">
            <HeroVisual />
          </div>
        </section>

        {/* PROBLEM */}
        <Reveal>
          <div className="oi-problem">
            <div className="oi-problem-left">
              <div>
                <h2>The same forces that kill deals from the outside kill initiatives from the inside.</h2>
                <p>Competing priorities. Unclear ownership. Conditions nobody is addressing. Drivers that haven't been identified. The goal is clear. The path to it isn't.</p>
              </div>
            </div>
            <div className="oi-problem-right">
              <StuckVisual />
            </div>
          </div>
        </Reveal>

        {/* CASCADE */}
        <Reveal>
          <section className="oi-cascade">
            <div className="oi-section-label">drvrs applied internally</div>
            <div className="oi-cascade-stack">
              {cascade.map((c, i) => (
                <Reveal key={i} delay={i * 100}>
                  <div className="oi-cascade-row">
                    <div className="oi-cascade-id">
                      <div className="oi-cascade-letter">{c.letter}</div>
                      <div className="oi-cascade-word">{c.word}</div>
                    </div>
                    <div className="oi-cascade-text">
                      <div className="oi-cascade-example">{c.example}</div>
                    </div>
                    <div className="oi-cascade-vis">
                      <c.Vis />
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </section>
        </Reveal>

        {/* OUTCOMES */}
        <Reveal>
          <section className="oi-outcomes">
            <div className="oi-section-label">What you walk away with</div>
            <div className="oi-outcomes-grid">
              {[
                { who: "You get", text: "Clarity on exactly why the org is stuck.", Vis: ClarityVis },
                { who: "Your team gets", text: "A shared map of what needs to change, and in what order.", Vis: MapVis },
                { who: "The initiative gets", text: "A real path forward instead of another strategy deck.", Vis: PathVis },
              ].map((item, i) => (
                <Reveal key={i} delay={i * 120}>
                  <div className="oi-outcome-card">
                    <div className="oi-outcome-vis"><item.Vis /></div>
                    <div className="oi-outcome-who">{item.who}</div>
                    <div className="oi-outcome-text">{item.text}</div>
                  </div>
                </Reveal>
              ))}
            </div>
          </section>
        </Reveal>

        {/* CTA */}
        <section className="oi-cta">
          <Reveal><h2>Pick the initiative.<br /><em>We'll find the blockers.</em></h2></Reveal>
          <Reveal delay={100}><p className="oi-cta-sub">One conversation is all it takes to start.</p></Reveal>
          <Reveal delay={200}>
            <a className="oi-cta-btn" href="https://tally.so/r/VLPjKa" target="_blank" rel="noopener noreferrer">
              Start a conversation
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </a>
          </Reveal>
        </section>

        <footer className="oi-footer">
          <a className="oi-logo" href="/"><div className="oi-logo-pill" /> drvrs</a>
          <span>&copy; 2026</span>
        </footer>
      </div>
    </>
  );
}