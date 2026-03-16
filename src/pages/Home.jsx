import { useState, useEffect, useRef } from "react";

const navStyles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300;1,400&display=swap');

  .drvrs * { margin: 0; padding: 0; box-sizing: border-box; }

  .drvrs {
    background: #0a1a14;
    color: #f5f0e8;
    font-family: 'DM Sans', sans-serif;
    font-weight: 300;
    -webkit-font-smoothing: antialiased;
    overflow-x: clip;
    position: relative;
  }

  /* GRAIN OVERLAY */
  .drvrs::before {
    content: '';
    position: fixed;
    inset: 0;
    z-index: 1000;
    pointer-events: none;
    opacity: 0.035;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
    background-size: 200px 200px;
  }

  /* NAV — preserved exactly */
  .drvrs-nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    padding: 2rem 3rem;
    display: flex; justify-content: space-between; align-items: center;
    mix-blend-mode: difference;
  }
  .drvrs-logo {
    display: flex; align-items: center; gap: 0.6rem;
    font-family: 'DM Sans', sans-serif;
    font-size: 1.2rem; font-weight: 400; letter-spacing: 0.05em;
    color: #f5f0e8; text-decoration: none; cursor: pointer;
  }
  .drvrs-logo-pill {
    width: 28px; height: 14px;
    background: #f5f0e8; border-radius: 7px;
  }
  .drvrs-nav-links {
    display: flex; gap: 2.5rem; align-items: center;
  }
  .drvrs-nav-links a {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.85rem; font-weight: 400; letter-spacing: 0.08em;
    color: #f5f0e8; text-decoration: none; text-transform: uppercase;
    transition: opacity 0.3s ease; cursor: pointer;
  }
  .drvrs-nav-links a:hover { opacity: 0.6; }
  .drvrs-hamburger {
    display: none; flex-direction: column; gap: 5px;
    cursor: pointer; background: none; border: none; padding: 4px;
  }
  .drvrs-hamburger span {
    display: block; width: 22px; height: 1.5px;
    background: #f5f0e8; transition: all 0.3s ease;
  }
  .drvrs-mobile-menu {
    display: none; position: fixed; inset: 0;
    background: #0a1a14; z-index: 200;
    flex-direction: column; align-items: center; justify-content: center; gap: 2.5rem;
  }
  .drvrs-mobile-menu.open { display: flex; }
  .drvrs-mobile-menu a {
    font-family: 'DM Sans', sans-serif;
    font-size: 1.5rem; font-weight: 400; letter-spacing: 0.08em;
    color: #f5f0e8; text-decoration: none; text-transform: uppercase;
  }
  .drvrs-mobile-close {
    position: absolute; top: 2rem; right: 2rem;
    background: none; border: none;
    color: #f5f0e8; font-size: 2rem; cursor: pointer; line-height: 1;
  }

  /* SECTIONS */
  .sec {
    min-height: 100vh; display: flex; align-items: center; justify-content: center;
    padding: 12vh 8vw; position: relative; overflow: clip;
  }
  .sec--s { min-height: auto; padding: 8vh 8vw; }
  .sec--dark { background: #0a1a14; }
  .sec--cream { background: #f5f0e8; color: #0a1a14; }
  .sec--warm { background: #f0e6d6; color: #0a1a14; }
  .sec--green { background: #1a3a2a; }

  .sec--dark .glow-r {
    position: absolute; right: -10vw; top: 10%;
    width: 50vw; height: 70vh;
    background: radial-gradient(ellipse at center, rgba(45,138,110,0.08) 0%, transparent 65%);
    pointer-events: none;
  }
  .sec--dark .glow-l {
    position: absolute; left: -5vw; bottom: 0;
    width: 40vw; height: 50vh;
    background: radial-gradient(ellipse at center, rgba(45,138,110,0.05) 0%, transparent 65%);
    pointer-events: none;
  }
  .sec--green .glow-c {
    position: absolute; left: 50%; top: 50%;
    transform: translate(-50%, -50%);
    width: 60vw; height: 60vh;
    background: radial-gradient(ellipse at center, rgba(45,138,110,0.15) 0%, transparent 65%);
    pointer-events: none;
  }

  .serif { font-family: 'DM Serif Display', serif; font-weight: 400; }
  .muted { color: #7a8a82; }
  .accent { color: #2d8a6e; }

  .fi { opacity: 0; transform: translateY(28px); transition: opacity 0.9s cubic-bezier(0.16,1,0.3,1), transform 0.9s cubic-bezier(0.16,1,0.3,1); }
  .fi.on { opacity: 1; transform: translateY(0); }
  .fi.d1 { transition-delay: 0.1s; }
  .fi.d2 { transition-delay: 0.2s; }
  .fi.d3 { transition-delay: 0.3s; }

  /* TICKER */
  .ticker-wrap {
    width: 100%; overflow: hidden; padding: 2.5rem 0; position: relative;
    border-top: 1px solid rgba(245,240,232,0.06);
    border-bottom: 1px solid rgba(245,240,232,0.06);
  }
  .ticker-track { display: flex; gap: 3rem; animation: tickScroll 35s linear infinite; width: max-content; }
  .ticker-item {
    font-family: 'DM Serif Display', serif;
    font-size: clamp(1.1rem, 1.8vw, 1.5rem); font-style: italic;
    white-space: nowrap; color: rgba(245,240,232,0.55); transition: color 0.4s; cursor: default;
  }
  .ticker-item:hover { color: rgba(245,240,232,0.9); }
  .ticker-sep { color: rgba(45,138,110,0.4); font-size: 0.8rem; align-self: center; flex-shrink: 0; }
  @keyframes tickScroll {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }

  /* SERVICE DOORS */
  .svc-door {
    padding: clamp(3.5rem, 7vh, 5.5rem) 8vw; cursor: pointer;
    transition: background 0.4s;
    border-bottom: 1px solid rgba(245,240,232,0.06);
    display: block; text-decoration: none; color: #f5f0e8;
    position: relative; overflow: hidden;
  }
  .svc-door::after {
    content: ''; position: absolute; top: 0; left: 0; right: 0;
    height: 1px; background: #2d8a6e;
    transform: scaleX(0); transform-origin: left; transition: transform 0.5s ease;
  }
  .svc-door:hover { background: rgba(45,138,110,0.04); }
  .svc-door:hover::after { transform: scaleX(1); }
  .svc-door-inner { display: flex; align-items: center; gap: clamp(2rem, 5vw, 5rem); max-width: 900px; }
  .svc-vis { flex-shrink: 0; }
  .svc-text { flex: 1; }
  .svc-arrow { color: #2d8a6e; font-size: 1.4rem; opacity: 0; transform: translateX(-8px); transition: all 0.3s ease; flex-shrink: 0; }
  .svc-door:hover .svc-arrow { opacity: 1; transform: translateX(0); }
  .svc-title { font-family: 'DM Serif Display', serif; font-size: clamp(1.6rem, 2.8vw, 2.4rem); line-height: 1.15; margin-bottom: 0.5rem; }
  .svc-desc { font-size: clamp(0.82rem, 1vw, 0.92rem); color: #7a8a82; line-height: 1.65; }

  /* CTA */
  .d-cta {
    display: inline-flex; align-items: center; gap: 0.75rem;
    background: #2d8a6e; color: #f5f0e8;
    padding: 1rem 2.5rem; border-radius: 50px;
    font-size: 0.9rem; font-weight: 400; text-decoration: none; cursor: pointer; border: none;
    transition: all 0.3s; letter-spacing: 0.05em;
  }
  .d-cta:hover { background: #35a080; transform: translateY(-2px); }
  .d-cta svg { width: 15px; height: 15px; }

  .d-footer {
    padding: 2.5rem 8vw; display: flex; justify-content: space-between; align-items: center;
    font-size: 0.75rem; color: rgba(122,138,130,0.5);
    border-top: 1px solid rgba(245,240,232,0.06);
  }
  .d-footer .drvrs-logo { font-size: 0.95rem; opacity: 0.5; }
  .d-footer .drvrs-logo-pill { width: 20px; height: 10px; }

  .hero-bg-num {
    position: absolute; right: -2vw; bottom: -5vh;
    font-family: 'DM Serif Display', serif;
    font-size: clamp(18rem, 30vw, 38rem); line-height: 0.8;
    color: rgba(245,240,232,0.025); pointer-events: none; user-select: none; letter-spacing: -0.05em;
  }

  .statement { font-family: 'DM Serif Display', serif; font-size: clamp(3rem, 6vw, 7rem); line-height: 1.0; letter-spacing: -0.03em; }
  .statement em { font-style: italic; color: rgba(245,240,232,0.35); }
  .statement-dark { color: #0a1a14; }

  .d-rule { width: 100%; height: 1px; background: rgba(245,240,232,0.06); }
  .d-eyebrow { font-size: 0.65rem; letter-spacing: 0.22em; text-transform: uppercase; color: #2d8a6e; margin-bottom: 1.5rem; }

  .pull {
    font-family: 'DM Serif Display', serif; font-style: italic;
    font-size: clamp(1.4rem, 2.5vw, 2rem); line-height: 1.5;
    color: rgba(245,240,232,0.5);
    border-left: 2px solid rgba(45,138,110,0.5); padding-left: 1.75rem; max-width: 500px;
  }

  @keyframes heroIn { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes pulse { 0%, 100% { opacity: 0.2; } 50% { opacity: 0.8; } }

  @media (max-width: 768px) {
    .drvrs-nav { padding: 1.5rem 2rem; }
    .drvrs-nav-links { display: none; }
    .drvrs-hamburger { display: flex; }
    .sec { padding: 10vh 6vw; }
    .hero-bg-num { display: none; }
    .svc-door-inner { gap: 1.5rem; }
  }
`;

function F({ children, className = "", delay = "" }) {
  const r = useRef(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold: 0.12 });
    if (r.current) o.observe(r.current);
    return () => o.disconnect();
  }, []);
  return <div ref={r} className={`fi${v ? " on" : ""} ${delay} ${className}`}>{children}</div>;
}

function Ticker() {
  const items = [
    "A new hire joined the team", "The champion got promoted", "A reorg reshuffled priorities",
    "IT sold leadership on a competing platform", "Finance pitched a cost-freeze initiative",
    "A new VP arrived with their own vendors", "Legal sold the board on a compliance overhaul",
    "HR launched a culture initiative", "A director built a business case against you",
    "The budget committee sold a 20% reduction", "Operations sold a consolidation plan",
    "A consultant sold a 90-day transformation", "The CFO sold patience", "Procurement sold process",
    "A peer sold urgency on something else entirely",
  ];
  const doubled = [...items, ...items];
  return (
    <div className="ticker-wrap">
      <div className="ticker-track">
        {doubled.map((t, i) => (
          <span key={i} style={{display: "flex", alignItems: "center", gap: "3rem"}}>
            <span className="ticker-item">{t}</span>
            {i < doubled.length - 1 && <span className="ticker-sep">·</span>}
          </span>
        ))}
      </div>
    </div>
  );
}

function OrgSystem() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 50);
    return () => clearInterval(id);
  }, []);

  const rows = [
    { heard: '"We love the product"', reality: "VP career on the line", realtiyLabel: "Political pressure", heat: 0.92 },
    { heard: '"Budget is approved"', reality: "Split across 3 competing projects", realtiyLabel: "Resource conflict", heat: 0.74 },
    { heard: '"Just need legal sign-off"', reality: "40 contracts ahead of yours", realtiyLabel: "Queue depth", heat: 0.88 },
    { heard: '"Decision by end of month"', reality: "3 stakeholders not consulted", realtiyLabel: "Alignment gap", heat: 0.61 },
  ];

  return (
    <div style={{ width: "100%", maxWidth: "1000px", margin: "0 auto" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", marginBottom: "2px" }}>
        <div style={{ padding: "0 0 1rem 0", fontSize: "0.62rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(245,240,232,0.3)", fontFamily: "DM Sans, sans-serif" }}>What you hear</div>
        <div style={{ padding: "0 0 1rem 2rem", fontSize: "0.62rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#2d8a6e", fontFamily: "DM Sans, sans-serif" }}>What's moving</div>
      </div>
      {rows.map((row, i) => {
        const pulse = 0.5 + Math.sin(tick / 25 + i * 1.4) * 0.25;
        const barW = row.heat * 100;
        return (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderTop: "1px solid rgba(245,240,232,0.06)", minHeight: "100px" }}>
            <div style={{ padding: "2rem 2rem 2rem 0", display: "flex", alignItems: "center", borderRight: "1px solid rgba(245,240,232,0.06)" }}>
              <div style={{ fontFamily: "'DM Serif Display', serif", fontStyle: "italic", fontSize: "clamp(1.1rem, 1.8vw, 1.5rem)", lineHeight: 1.3, color: "rgba(245,240,232,0.55)", letterSpacing: "-0.01em" }}>{row.heard}</div>
            </div>
            <div style={{ padding: "2rem 0 2rem 2rem", display: "flex", flexDirection: "column", justifyContent: "center", gap: "0.75rem" }}>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(1rem, 1.6vw, 1.3rem)", fontWeight: 400, color: "#f5f0e8", lineHeight: 1.3 }}>{row.reality}</div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <div style={{ flex: 1, height: "3px", background: "rgba(45,138,110,0.12)", borderRadius: "2px", overflow: "hidden", maxWidth: "180px" }}>
                  <div style={{ height: "100%", width: `${barW}%`, background: `rgba(45,138,110,${0.4 + pulse * 0.4})`, borderRadius: "2px", boxShadow: `0 0 ${8 * pulse}px rgba(45,138,110,${pulse * 0.6})`, transition: "box-shadow 0.1s ease" }} />
                </div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.08em", color: "rgba(45,138,110,0.7)" }}>{row.realtiyLabel}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Decomp() {
  const ref = useRef(null);
  const [fired, setFired] = useState(false);

  useEffect(() => {
    const h = () => {
      if (!ref.current || fired) return;
      const rect = ref.current.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.7) setFired(true);
    };
    window.addEventListener("scroll", h, { passive: true });
    h();
    return () => window.removeEventListener("scroll", h);
  }, [fired]);

  const W = 520;
  const nodes = [
    { id: "rev",  label: "Revenue",        x: 260,  y: 48,  level: 0 },
    { id: "vol",  label: "Volume",         x: 90,   y: 175, level: 1 },
    { id: "con",  label: "Conversion",     x: 260,  y: 175, level: 1 },
    { id: "pri",  label: "Price",          x: 430,  y: 175, level: 1 },
    { id: "reach", label: "Reach",         x: 42,   y: 310, level: 2 },
    { id: "act",   label: "Relevance",     x: 138,  y: 310, level: 2 },
    { id: "qual",  label: "Qualification", x: 214,  y: 310, level: 2 },
    { id: "off",   label: "Offer",         x: 306,  y: 310, level: 2 },
    { id: "diff",  label: "Differ­entiation", x: 384, y: 310, level: 2 },
    { id: "nec",   label: "Necessity",     x: 478,  y: 310, level: 2 },
  ];
  const edges = [
    { from: "rev", to: "vol" }, { from: "rev", to: "con" }, { from: "rev", to: "pri" },
    { from: "vol", to: "reach" }, { from: "vol", to: "act" },
    { from: "con", to: "qual" }, { from: "con", to: "off" },
    { from: "pri", to: "diff" }, { from: "pri", to: "nec" },
  ];
  const getNode = id => nodes.find(n => n.id === id);
  const curvePath = (from, to) => {
    const x1 = from.x, y1 = from.y + 22, x2 = to.x, y2 = to.y - 22, my = (y1 + y2) / 2;
    return `M${x1},${y1} C${x1},${my} ${x2},${my} ${x2},${y2}`;
  };
  const edgeDelay = { vol: 0.1, con: 0.15, pri: 0.2, reach: 0.4, act: 0.42, qual: 0.44, off: 0.48, diff: 0.52, nec: 0.56 };
  const nodeDelay = { 0: 0, 1: 0.25, 2: 0.5 };

  return (
    <div ref={ref} style={{ width: "100%", maxWidth: "600px", margin: "0 auto", padding: "0 20px" }}>
      <svg viewBox={`0 0 ${W} 380`} style={{ width: "100%", height: "auto" }}>
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="4" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
          <filter id="glow-sm" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        </defs>
        {edges.map((e, i) => {
          const from = getNode(e.from), to = getNode(e.to), d = curvePath(from, to), len = 600, delay = edgeDelay[e.to];
          return (
            <g key={i}>
              <path d={d} fill="none" stroke="rgba(45,138,110,0.15)" strokeWidth="6" strokeDasharray={len} strokeDashoffset={fired ? 0 : len} style={{ transition: `stroke-dashoffset 0.6s ease ${delay}s` }} />
              <path d={d} fill="none" stroke="rgba(45,138,110,0.5)" strokeWidth="1.5" strokeDasharray={len} strokeDashoffset={fired ? 0 : len} style={{ transition: `stroke-dashoffset 0.6s ease ${delay}s` }} />
            </g>
          );
        })}
        {nodes.map(n => {
          const isRoot = n.level === 0, isMid = n.level === 1, delay = nodeDelay[n.level];
          return (
            <g key={n.id} opacity={fired ? 1 : 0} transform={fired ? `translate(0,0)` : `translate(0,12)`} style={{ transition: `opacity 0.5s ease ${delay}s, transform 0.5s cubic-bezier(0.16,1,0.3,1) ${delay}s` }}>
              {isRoot && <><rect x={n.x - 60} y={n.y - 20} width={120} height={40} rx="4" fill="rgba(45,138,110,0.18)" stroke="#2d8a6e" strokeWidth="1.5" filter="url(#glow)" /><text x={n.x} y={n.y + 5} textAnchor="middle" fill="#f5f0e8" fontSize="14" fontFamily="DM Serif Display, serif">{n.label}</text></>}
              {isMid && <><rect x={n.x - 55} y={n.y - 18} width={110} height={36} rx="3" fill="rgba(45,138,110,0.1)" stroke="rgba(45,138,110,0.5)" strokeWidth="1" /><text x={n.x} y={n.y + 4} textAnchor="middle" fill="rgba(245,240,232,0.85)" fontSize="11" fontFamily="DM Sans, sans-serif" fontWeight="300">{n.label}</text></>}
              {n.level === 2 && <><circle cx={n.x} cy={n.y - 8} r="4" fill="#2d8a6e" filter="url(#glow-sm)" /><circle cx={n.x} cy={n.y - 8} r="2" fill="#f5f0e8" opacity="0.8"/><text x={n.x} y={n.y + 10} textAnchor="middle" fill="rgba(45,138,110,0.9)" fontSize="11" fontFamily="DM Sans, sans-serif" letterSpacing="0.04em">{n.label}</text></>}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function DiagnosticCascade() {
  const outerRef = useRef(null);
  const trackRef = useRef(null);

  const cards = [
    {
      label: "GOAL", labelColor: "#2d8a6e",
      svg: (
        <svg viewBox="0 0 400 200" style={{ width: "100%", height: "100%" }}>
          <rect x="0" y="0" width="400" height="130" fill="rgba(45,138,110,0.04)" />
          <rect x="0" y="130" width="400" height="70" fill="rgba(45,138,110,0.1)" />
          <path d="M0,138 Q50,132 100,138 Q150,144 200,138 Q250,132 300,138 Q350,144 400,138" fill="none" stroke="rgba(45,138,110,0.3)" strokeWidth="1" />
          <g transform="translate(55,120)"><path d="M0,0 L18,0 L21,11 L-3,11 Z" fill="#2d8a6e" opacity="0.9" /><line x1="9" y1="0" x2="9" y2="-20" stroke="#0a1a14" strokeWidth="1" opacity="0.5" /><path d="M9,-20 L21,-13 L9,-7 Z" fill="#2d8a6e" opacity="0.7" /></g>
          <line x1="82" y1="128" x2="310" y2="128" stroke="#2d8a6e" strokeWidth="1" strokeDasharray="5 7" opacity="0.4" />
          <circle cx="330" cy="128" r="7" fill="none" stroke="#2d8a6e" strokeWidth="1.5" opacity="0.7" />
          <circle cx="330" cy="128" r="2" fill="#2d8a6e" opacity="0.8" />
          <line x1="330" y1="128" x2="330" y2="105" stroke="#2d8a6e" strokeWidth="1" opacity="0.7" />
          <path d="M330,105 L342,110 L330,115 Z" fill="#2d8a6e" opacity="0.6" />
        </svg>
      )
    },
    {
      label: "CONSTRAINTS",
      svg: (
        <svg viewBox="0 0 400 260" style={{ width: "100%", height: "100%" }}>
          <rect x="0" y="0" width="400" height="260" fill="rgba(45,138,110,0.1)" />
          <path d="M0,50 Q100,46 200,50 Q300,54 400,50" fill="none" stroke="rgba(45,138,110,0.15)" strokeWidth="1"/>
          <path d="M0,100 Q80,96 160,100 Q240,104 400,100" fill="none" stroke="rgba(45,138,110,0.1)" strokeWidth="1"/>
          <path d="M0,160 Q120,156 240,160 Q320,164 400,160" fill="none" stroke="rgba(45,138,110,0.08)" strokeWidth="1"/>
          <path d="M340,0 L355,22 L342,38 L360,50 L348,65 L370,72 L400,60 L400,0 Z" fill="rgba(200,210,195,0.7)" stroke="rgba(10,26,20,0.2)" strokeWidth="1.5"/>
          <path d="M110,95 L122,88 L133,94 L136,106 L126,113 L113,110 L107,101 Z" fill="rgba(160,175,165,0.75)" stroke="rgba(10,26,20,0.25)" strokeWidth="1"/>
          <path d="M255,155 L266,148 L276,154 L278,166 L268,172 L257,168 L251,160 Z" fill="rgba(160,175,165,0.7)" stroke="rgba(10,26,20,0.2)" strokeWidth="1"/>
          <path d="M185,210 L192,205 L199,210 L197,218 L188,220 L182,215 Z" fill="rgba(160,175,165,0.6)" stroke="rgba(10,26,20,0.18)" strokeWidth="0.8"/>
          <g transform="translate(90,170) rotate(-35)">
            <path d="M0,30 Q-14,20 -14,-10 Q-14,-35 0,-48 Q14,-35 14,-10 Q14,20 0,30 Z" fill="#2d8a6e" opacity="0.85"/>
            <line x1="0" y1="25" x2="0" y2="-42" stroke="rgba(245,240,232,0.35)" strokeWidth="1"/>
            <path d="M-10,30 Q-22,45 -30,58" fill="none" stroke="rgba(245,240,232,0.4)" strokeWidth="1.5"/>
            <path d="M10,30 Q22,45 30,58" fill="none" stroke="rgba(245,240,232,0.25)" strokeWidth="1"/>
          </g>
          <path d="M90,170 Q130,140 145,110 Q158,88 180,78 Q220,65 255,80 Q290,95 310,115" fill="none" stroke="#2d8a6e" strokeWidth="1.2" strokeDasharray="6 5" opacity="0.5"/>
        </svg>
      )
    },
    {
      label: "DRIVERS",
      svg: (
        <svg viewBox="0 0 400 260" style={{ width: "100%", height: "100%" }}>
          <rect x="0" y="0" width="400" height="260" fill="rgba(45,138,110,0.05)" />
          {[0,45,90,135,180,225,270,315].map((angle, i) => {
            const rad = (angle * Math.PI) / 180;
            return <line key={i} x1="200" y1="130" x2={200 + Math.cos(rad) * 90} y2={130 + Math.sin(rad) * 90} stroke="#2d8a6e" strokeWidth="6" opacity="0.6" strokeLinecap="round"/>;
          })}
          <circle cx="200" cy="130" r="90" fill="none" stroke="#2d8a6e" strokeWidth="10" opacity="0.35"/>
          <circle cx="200" cy="130" r="90" fill="none" stroke="#2d8a6e" strokeWidth="4" opacity="0.55"/>
          {[0,45,90,135,180,225,270,315].map((angle, i) => {
            const rad = (angle * Math.PI) / 180;
            return (
              <g key={i}>
                <line x1={200 + Math.cos(rad) * 84} y1={130 + Math.sin(rad) * 84} x2={200 + Math.cos(rad) * 108} y2={130 + Math.sin(rad) * 108} stroke="#2d8a6e" strokeWidth="8" opacity="0.7" strokeLinecap="round"/>
                <circle cx={200 + Math.cos(rad) * 110} cy={130 + Math.sin(rad) * 110} r="5" fill="#2d8a6e" opacity="0.5"/>
              </g>
            );
          })}
          <circle cx="200" cy="130" r="28" fill="rgba(45,138,110,0.12)" stroke="#2d8a6e" strokeWidth="5" opacity="0.55"/>
          <circle cx="200" cy="130" r="16" fill="rgba(45,138,110,0.2)" stroke="#2d8a6e" strokeWidth="2" opacity="0.6"/>
          {[0,60,120,180,240,300].map((angle,i) => {
            const rad = (angle * Math.PI) / 180;
            return <circle key={i} cx={200 + Math.cos(rad)*20} cy={130 + Math.sin(rad)*20} r="3" fill="#2d8a6e" opacity="0.5"/>;
          })}
          <circle cx="200" cy="130" r="6" fill="#2d8a6e" opacity="0.9"/>
        </svg>
      )
    },
    {
      label: "CONDITIONS",
      svg: (
        <svg viewBox="0 0 400 200" style={{ width: "100%", height: "100%" }}>
          <rect x="0" y="0" width="400" height="110" fill="rgba(45,138,110,0.04)" />
          <rect x="0" y="110" width="400" height="90" fill="rgba(45,138,110,0.1)" />
          <path d="M0,118 Q30,100 60,118 Q90,136 120,118 Q150,100 180,118 Q210,136 240,118 Q270,100 300,118 Q330,136 360,118 Q390,100 400,115" fill="none" stroke="rgba(45,138,110,0.5)" strokeWidth="2" />
          <path d="M0,130 Q40,118 80,130 Q120,142 160,130 Q200,118 240,130 Q280,142 320,130 Q360,118 400,128" fill="none" stroke="rgba(45,138,110,0.25)" strokeWidth="1.5" />
          <g transform="translate(185,108) rotate(-10,9,5)"><path d="M0,0 L14,0 L16,8 L-2,8 Z" fill="#2d8a6e" opacity="0.8" /><line x1="7" y1="0" x2="7" y2="-14" stroke="#0a1a14" strokeWidth="0.8" opacity="0.5" /><path d="M7,-14 L15,-9 L7,-5 Z" fill="#2d8a6e" opacity="0.6" /></g>
        </svg>
      )
    },
    {
      label: "INPUTS",
      svg: (
        <svg viewBox="0 0 400 200" style={{ width: "100%", height: "100%" }}>
          <rect x="0" y="0" width="400" height="200" fill="#e8f0ec" />
          <rect x="0" y="140" width="400" height="60" fill="rgba(45,138,110,0.13)" />
          <path d="M0,140 Q100,134 200,140 Q300,146 400,140" fill="none" stroke="rgba(45,138,110,0.25)" strokeWidth="1" />
          <path d="M120,148 Q200,155 280,148 L270,165 Q200,170 130,165 Z" fill="#2d8a6e" opacity="0.6" />
          <line x1="200" y1="148" x2="200" y2="35" stroke="#0a1a14" strokeWidth="2.5" opacity="0.5" />
          <line x1="200" y1="135" x2="270" y2="148" stroke="#0a1a14" strokeWidth="2" opacity="0.4" />
          <path d="M200,40 Q240,65 265,110 Q250,138 200,135 Z" fill="#2d8a6e" opacity="0.25" stroke="#2d8a6e" strokeWidth="1.5" />
          <path d="M200,45 Q160,75 140,130 L200,135 Z" fill="#2d8a6e" opacity="0.15" stroke="#2d8a6e" strokeWidth="1" />
          <path d="M50,55 Q75,50 95,55" fill="none" stroke="rgba(45,138,110,0.3)" strokeWidth="1" strokeDasharray="3 4" />
          <path d="M40,70 Q70,65 100,70" fill="none" stroke="rgba(45,138,110,0.2)" strokeWidth="1" strokeDasharray="3 4" />
          <path d="M55,85 Q80,80 105,85" fill="none" stroke="rgba(45,138,110,0.15)" strokeWidth="1" strokeDasharray="3 4" />
        </svg>
      )
    },
  ];

  useEffect(() => {
    const h = () => {
      const outer = outerRef.current, track = trackRef.current;
      if (!outer || !track) return;
      const rect = outer.getBoundingClientRect();
      const total = outer.offsetHeight - window.innerHeight;
      const scrolled = -rect.top;
      const p = Math.max(0, Math.min(1, scrolled / total));
      const maxShift = (cards.length - 1) * window.innerWidth;
      track.style.transform = `translateX(${-(p * maxShift)}px)`;
    };
    window.addEventListener("scroll", h, { passive: true });
    h();
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <div ref={outerRef} style={{ height: `${cards.length * 100}vh`, position: "relative" }}>
      <div style={{ position: "sticky", top: 0, height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", clipPath: "inset(0)" }}>
        <div style={{ position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: "calc(50% + min(27.5vh, 240px) - 10px)", background: "#0a1a14" }} />
          <div style={{ position: "absolute", top: "calc(50% + min(27.5vh, 240px) - 10px)", left: 0, right: 0, bottom: 0, background: "#0a1a14" }} />
          <div style={{ position: "absolute", top: "calc(50% - min(27.5vh, 240px) + 10px)", bottom: "calc(50% - min(27.5vh, 240px) + 10px)", left: 0, right: "calc(50% + min(36vw, 380px) - 10px)", background: "#0a1a14" }} />
          <div style={{ position: "absolute", top: "calc(50% - min(27.5vh, 240px) + 10px)", bottom: "calc(50% - min(27.5vh, 240px) + 10px)", left: "calc(50% + min(36vw, 380px) - 10px)", right: 0, background: "#0a1a14" }} />
          <div style={{ position: "absolute", border: "1px solid rgba(245,240,232,0.1)", borderRadius: "10px", top: "calc(50% - min(27.5vh, 240px))", left: "calc(50% - min(36vw, 380px))", width: "min(72vw, 760px)", height: "min(55vh, 480px)", pointerEvents: "none" }} />
        </div>
        <div ref={trackRef} style={{ position: "absolute", left: 0, top: 0, bottom: 0, display: "flex", willChange: "transform", zIndex: 1 }}>
          {cards.map((card, i) => (
            <div key={i} style={{ flex: "0 0 100vw", width: "100vw", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: "min(72vw, 760px)", height: "min(55vh, 480px)", background: "#f5f0e8", borderRadius: "10px", overflow: "hidden", display: "flex", flexDirection: "column" }}>
                <div style={{ flex: 1 }}>{card.svg}</div>
                <div style={{ padding: "1rem 1.75rem", fontSize: "0.6rem", letterSpacing: "0.25em", color: card.labelColor || "#2d8a6e", borderTop: "1px solid rgba(10,26,20,0.07)", fontFamily: "'DM Sans', sans-serif", textTransform: "uppercase", background: "#f5f0e8" }}>{card.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function OneDayVisual() {
  const ref = useRef(null);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const h = () => { if (!ref.current) return; const rect = ref.current.getBoundingClientRect(); setProgress(Math.max(0, Math.min(1, 1 - rect.top / window.innerHeight))); };
    window.addEventListener("scroll", h, { passive: true }); h();
    return () => window.removeEventListener("scroll", h);
  }, []);
  const clarity = Math.max(0, Math.min(1, (progress - 0.2) * 2));
  return (
    <a ref={ref} href="/OneDay" className="svc-door">
      <div className="svc-door-inner">
        <div className="svc-vis" style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          {[0,1,2,3,4].map(i => {
            const c = Math.max(0, Math.min(1, clarity * 2 - i * 0.15));
            return <div key={i} style={{ width: "clamp(28px,4vw,42px)", height: "clamp(28px,4vw,42px)", borderRadius: "50%", border: `1px solid rgba(45,138,110,${0.08 + c * 0.55})`, background: `rgba(45,138,110,${c * 0.14})`, filter: `blur(${(1 - c) * 5}px)`, transition: "all 0.35s ease", display: "flex", alignItems: "center", justifyContent: "center" }}><div style={{ width: "5px", height: "5px", borderRadius: "50%", background: `rgba(45,138,110,${c})`, transition: "all 0.35s ease" }} /></div>;
          })}
        </div>
        <div className="svc-text"><div className="svc-title">One Day</div><div className="svc-desc">Your team sees deals differently.</div></div>
        <div className="svc-arrow">→</div>
      </div>
    </a>
  );
}

function OneInitiativeVisual() {
  const ref = useRef(null);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const h = () => { if (!ref.current) return; const rect = ref.current.getBoundingClientRect(); setProgress(Math.max(0, Math.min(1, 1 - rect.top / window.innerHeight))); };
    window.addEventListener("scroll", h, { passive: true }); h();
    return () => window.removeEventListener("scroll", h);
  }, []);
  const unblock = Math.max(0, Math.min(1, (progress - 0.3) * 2.5));
  return (
    <a ref={ref} href="/OneInitiative" className="svc-door">
      <div className="svc-door-inner">
        <div className="svc-vis" style={{ display: "flex", flexDirection: "column", gap: "5px", width: "clamp(100px,18vw,180px)" }}>
          {[{ w: 80, d: 0 }, { w: 30 + unblock * 70, d: 0, accent: true }, { w: 60, d: 0.15, dim: true }, { w: 40 + unblock * 30, d: 0.3, dim: true }].map((bar, i) => (
            <div key={i} style={{ height: "10px", borderRadius: "5px", background: bar.accent ? `rgba(45,138,110,${0.2 + unblock * 0.35})` : bar.dim ? "rgba(245,240,232,0.04)" : "rgba(245,240,232,0.06)", width: `${bar.w}%`, transition: `all 0.7s cubic-bezier(0.16,1,0.3,1) ${bar.d}s`, opacity: bar.dim ? 0.4 + unblock * 0.5 : 1 }} />
          ))}
        </div>
        <div className="svc-text"><div className="svc-title">One Initiative</div><div className="svc-desc">What matters gets movement.</div></div>
        <div className="svc-arrow">→</div>
      </div>
    </a>
  );
}

function OneTeamVisual() {
  const ref = useRef(null);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const h = () => { if (!ref.current) return; const rect = ref.current.getBoundingClientRect(); setProgress(Math.max(0, Math.min(1, 1 - rect.top / window.innerHeight))); };
    window.addEventListener("scroll", h, { passive: true }); h();
    return () => window.removeEventListener("scroll", h);
  }, []);
  const layers = Math.max(0, Math.min(1, (progress - 0.2) * 2));
  return (
    <a ref={ref} href="/OneTeam" className="svc-door" style={{ borderBottom: "none" }}>
      <div className="svc-door-inner">
        <div className="svc-vis" style={{ position: "relative", width: "clamp(70px,10vw,100px)", height: "clamp(70px,10vw,100px)", flexShrink: 0 }}>
          {[0,1,2,3].map(i => {
            const lp = Math.max(0, Math.min(1, layers * 2 - i * 0.3)), size = 28 + i * 22;
            return <div key={i} style={{ position: "absolute", left: "50%", top: "50%", width: `${size}%`, height: `${size}%`, borderRadius: "50%", border: `1px solid rgba(45,138,110,${lp * (0.55 - i * 0.1)})`, background: i === 0 ? `rgba(45,138,110,${lp * 0.2})` : "transparent", transform: "translate(-50%,-50%)", transition: `all 0.6s ease ${i * 0.15}s`, opacity: lp }}>{i === 0 && <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)", width: "5px", height: "5px", borderRadius: "50%", background: `rgba(45,138,110,${lp})` }} />}</div>;
          })}
        </div>
        <div className="svc-text"><div className="svc-title">One Team</div><div className="svc-desc">A drvr inside your team.</div></div>
        <div className="svc-arrow">→</div>
      </div>
    </a>
  );
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <style>{navStyles}</style>
      <div className="drvrs">

        {/* NAV — preserved */}
        <nav className="drvrs-nav">
          <a className="drvrs-logo">
            <div className="drvrs-logo-pill" />
            drvrs
          </a>
          <div className="drvrs-nav-links">
            <a href="/OneDay">One Day</a>
            <a href="/OneInitiative">One Initiative</a>
            <a href="/OneTeam">One Team</a>
          </div>
          {!menuOpen && (
            <button className="drvrs-hamburger" onClick={() => setMenuOpen(true)}>
              <span /><span /><span />
            </button>
          )}
        </nav>

        {/* MOBILE MENU */}
        <div className={`drvrs-mobile-menu ${menuOpen ? "open" : ""}`}>
          <button className="drvrs-mobile-close" onClick={() => setMenuOpen(false)}>✕</button>
          <a href="/OneDay" onClick={() => setMenuOpen(false)}>One Day</a>
          <a href="/OneInitiative" onClick={() => setMenuOpen(false)}>One Initiative</a>
          <a href="/OneTeam" onClick={() => setMenuOpen(false)}>One Team</a>
        </div>

        {/* 1. HERO */}
        <section className="sec sec--dark">
          <div className="glow-r" /><div className="glow-l" />
          <div className="hero-bg-num">d</div>
          <div style={{ maxWidth: "820px", position: "relative", zIndex: 1 }}>
            <div style={{ opacity: 0, animation: "heroIn 1s ease-out 0.2s forwards", fontSize: "0.65rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "#2d8a6e", marginBottom: "2rem", fontFamily: "'DM Sans', sans-serif" }}>
              Everything is selling
            </div>
            <h1 className="serif" style={{ fontSize: "clamp(3rem, 6vw, 5.5rem)", lineHeight: 1.05, marginBottom: "2.25rem", letterSpacing: "-0.03em", opacity: 0, animation: "heroIn 1s ease-out 0.35s forwards" }}>
              Selling is change management.<br />
              <em style={{ color: "rgba(245,240,232,0.3)", fontStyle: "italic" }}>Nobody treats it that way.</em>
            </h1>
          </div>
        </section>

        {/* 2. TICKER */}
        <section className="sec sec--dark sec--s" style={{ flexDirection: "column", gap: "2.5rem", padding: "0" }}>
          <div style={{ textAlign: "center", padding: "5vh 0 2vh", fontSize: "0.72rem", letterSpacing: "0.28em", textTransform: "uppercase", color: "#2d8a6e", fontFamily: "'DM Sans', sans-serif" }}>
            While you were selling, so were they.
          </div>
          <Ticker />
        </section>

        {/* 3. ORG SYSTEM */}
        <section className="sec sec--dark" style={{ flexDirection: "column", gap: "4rem" }}>
          <div className="glow-r" style={{ opacity: 0.5 }} />
          <F>
            <h2 className="serif" style={{ fontSize: "clamp(2.2rem, 4.5vw, 3.8rem)", lineHeight: 1.1, textAlign: "center", maxWidth: "620px", margin: "0 auto", letterSpacing: "-0.025em" }}>
              What you hear is never<br /><em style={{ color: "rgba(245,240,232,0.35)", fontStyle: "italic" }}>the full story.</em>
            </h2>
          </F>
          <F className="d1"><OrgSystem /></F>
        </section>

        {/* 4. DECOMP */}
        <section className="sec sec--green" style={{ flexDirection: "column", gap: "4rem", isolation: "isolate", zIndex: 1, overflow: "visible" }}>
          <div className="glow-c" />
          <F>
            <div className="d-eyebrow" style={{ textAlign: "center" }}>The framework</div>
            <h2 className="serif" style={{ fontSize: "clamp(2rem, 4vw, 3.4rem)", lineHeight: 1.1, textAlign: "center", maxWidth: "580px", margin: "0 auto", letterSpacing: "-0.025em" }}>
              Everything is made<br />of components.
            </h2>
          </F>
          <Decomp />
        </section>

        {/* 5. STATEMENT */}
        <section className="sec sec--cream sec--s" style={{ padding: "10vh 8vw" }}>
          <F style={{ width: "100%", maxWidth: "900px" }}>
            <div style={{ marginBottom: "1.5rem", fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#2d8a6e" }}>The diagnostic layer</div>
            <div className="statement statement-dark" style={{ marginBottom: "3rem" }}>
              Goal → Constraints<br />→ Drivers → Conditions<br /><em style={{ color: "rgba(10,26,20,0.25)" }}>→ Inputs.</em>
            </div>
            <p style={{ fontSize: "clamp(1rem, 1.3vw, 1.1rem)", lineHeight: 1.8, color: "rgba(10,26,20,0.55)", maxWidth: "480px" }}>
              Most teams skip straight to inputs. More calls. More emails. More pipeline. But effort applied to the wrong constraint doesn't compound. It just costs more.
            </p>
          </F>
        </section>

        {/* 6. DIAGNOSTIC CASCADE */}
        <div style={{ background: "#0a1a14" }}>
          <DiagnosticCascade />
        </div>

        {/* 7. SERVICES */}
        <section className="sec sec--dark" style={{ flexDirection: "column", gap: "0", alignItems: "stretch", padding: "0", borderTop: "1px solid rgba(245,240,232,0.06)" }}>
          <div style={{ padding: "6vh 8vw 4vh" }}>
            <F>
              <h2 className="serif" style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)", lineHeight: 1.1, letterSpacing: "-0.025em", maxWidth: "500px" }}>
                Three ways in.<br /><em style={{ color: "rgba(245,240,232,0.35)", fontStyle: "italic" }}>One approach.</em>
              </h2>
            </F>
          </div>
          <OneDayVisual />
          <OneInitiativeVisual />
          <OneTeamVisual />
        </section>

        {/* 8. CTA */}
        <section className="sec sec--dark" style={{ flexDirection: "column", alignItems: "center", textAlign: "center", gap: "2rem", borderTop: "1px solid rgba(245,240,232,0.06)" }}>
          <div className="glow-r" style={{ opacity: 0.6 }} /><div className="glow-l" style={{ opacity: 0.4 }} />
          <F><h2 className="serif" style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)", lineHeight: 1.05, letterSpacing: "-0.03em", maxWidth: "600px" }}>Welcome to drvrs.</h2></F>
          <F className="d1"><p className="muted" style={{ fontSize: "clamp(1rem, 1.3vw, 1.1rem)", lineHeight: 1.75, maxWidth: "460px", marginBottom: "0.5rem" }}>A new way of seeing what's actually affecting the organizations you're trying to change.</p></F>
          <F className="d2">
            <a className="d-cta" href="https://tally.so/r/VLPjKa" target="_blank" rel="noopener noreferrer">
              Let's talk
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </a>
          </F>
        </section>

        <footer className="d-footer">
          <a className="drvrs-logo"><div className="drvrs-logo-pill" /> drvrs</a>
          <span style={{ fontSize: "0.65rem", letterSpacing: "0.08em" }}>&copy; 2026</span>
        </footer>

      </div>
    </>
  );
}