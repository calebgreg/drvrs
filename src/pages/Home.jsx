import { useState, useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";
import HowItWorks from "@/components/drvrs/HowItWorks";

const CTA_URL = "https://tally.so/r/VLPjKa";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Mono:wght@300;400&display=swap');

  .drvrs * { margin: 0; padding: 0; box-sizing: border-box; }

  .drvrs {
    --bg: #F8FAFC;
    --panel: #EEF3FA;
    --card: #FFFFFF;
    --ink: #0B1220;
    --accent: #1D4ED8;
    --accent-hi: #2563EB;
    --muted: #5B6472;
    --line: #DCE4F0;
    --line-hi: rgba(29,78,216,0.35);
    background: var(--bg);
    color: var(--ink);
    font-family: 'DM Sans', sans-serif;
    font-weight: 300;
    -webkit-font-smoothing: antialiased;
    overflow-x: clip;
    position: relative;
  }

  .dots {
    background-image: radial-gradient(rgba(29,78,216,0.13) 1px, transparent 1px);
    background-size: 18px 18px;
  }

  /* NAV */
  .drvrs-nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    padding: 1.25rem 3rem;
    display: flex; justify-content: space-between; align-items: center;
    background: rgba(248,250,252,0.85); backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--line);
  }
  .drvrs-logo {
    display: flex; align-items: center; gap: 0.6rem;
    font-size: 1.2rem; font-weight: 500; letter-spacing: 0.05em;
    color: var(--ink); text-decoration: none; cursor: pointer;
  }
  .drvrs-logo-pill { width: 28px; height: 14px; background: var(--ink); border-radius: 7px; }
  .drvrs-nav-links { display: flex; gap: 2.5rem; align-items: center; }
  .drvrs-nav-links a {
    font-family: 'DM Mono', monospace;
    font-size: 0.72rem; font-weight: 400; letter-spacing: 0.14em;
    color: var(--ink); text-decoration: none; text-transform: uppercase;
    transition: color 0.3s ease; cursor: pointer;
  }
  .drvrs-nav-links a:hover { color: var(--accent); }
  .drvrs-hamburger { display: none; flex-direction: column; gap: 5px; cursor: pointer; background: none; border: none; padding: 4px; }
  .drvrs-hamburger span { display: block; width: 22px; height: 1.5px; background: var(--ink); transition: all 0.3s ease; }
  .drvrs-mobile-menu { display: none; position: fixed; inset: 0; background: var(--bg); z-index: 200; flex-direction: column; align-items: center; justify-content: center; gap: 2.5rem; }
  .drvrs-mobile-menu.open { display: flex; }
  .drvrs-mobile-menu a { font-size: 1.5rem; font-weight: 400; letter-spacing: 0.08em; color: var(--ink); text-decoration: none; text-transform: uppercase; }
  .drvrs-mobile-close { position: absolute; top: 2rem; right: 2rem; background: none; border: none; color: var(--ink); font-size: 2rem; cursor: pointer; line-height: 1; }

  .serif { font-family: 'DM Serif Display', serif; font-weight: 400; }
  .mono { font-family: 'DM Mono', monospace; }
  .d-eyebrow { font-family: 'DM Mono', monospace; font-size: 0.65rem; letter-spacing: 0.22em; text-transform: uppercase; color: var(--accent); margin-bottom: 1.5rem; }

  .fi { opacity: 0; transform: translateY(24px); transition: opacity 0.9s cubic-bezier(0.16,1,0.3,1), transform 0.9s cubic-bezier(0.16,1,0.3,1); }
  .fi.on { opacity: 1; transform: translateY(0); }
  .fi.d1 { transition-delay: 0.1s; } .fi.d2 { transition-delay: 0.2s; } .fi.d3 { transition-delay: 0.3s; }

  /* HERO */
  .hero-wrap { padding: 9rem 4vw 5vh; }
  .hero {
    min-height: 74vh; display: flex; flex-direction: column; justify-content: center;
    padding: clamp(2.5rem, 6vw, 5rem);
    position: relative; overflow: clip;
    background: var(--card);
    border: 1px solid var(--line-hi);
    border-radius: 12px;
    box-shadow: 0 1px 3px rgba(11,18,32,0.04);
  }
  .hero h1 {
    font-family: 'DM Serif Display', serif; font-weight: 400;
    font-size: clamp(2.9rem, 6vw, 5.2rem);
    line-height: 1.06; letter-spacing: -0.025em;
    max-width: 820px;
    color: var(--ink);
    animation: heroIn 1s cubic-bezier(0.16,1,0.3,1) 0.2s both;
  }
  .hero h1 em { font-style: italic; color: var(--accent); }
  .hero-sub {
    font-size: clamp(1.02rem, 1.4vw, 1.2rem); line-height: 1.7; color: var(--muted);
    max-width: 480px; margin-top: 2rem;
    animation: heroIn 1s cubic-bezier(0.16,1,0.3,1) 0.45s both;
  }
  .hero-ctas { display: flex; gap: 1.5rem; align-items: center; margin-top: 3rem; flex-wrap: wrap; animation: heroIn 1s cubic-bezier(0.16,1,0.3,1) 0.65s both; }
  .hero-hint {
    font-family: 'DM Mono', monospace; font-size: 0.68rem; letter-spacing: 0.14em; text-transform: uppercase;
    color: var(--muted); text-decoration: none; cursor: pointer; transition: color 0.3s;
  }
  .hero-hint:hover { color: var(--accent); }

  /* CTA BUTTON */
  .d-cta {
    display: inline-flex; align-items: center; gap: 0.75rem;
    background: var(--accent); color: #fff;
    padding: 1rem 2.4rem; border-radius: 50px;
    font-size: 0.9rem; font-weight: 400; text-decoration: none; cursor: pointer; border: none;
    transition: all 0.3s; letter-spacing: 0.05em;
  }
  .d-cta:hover { background: var(--accent-hi); transform: translateY(-2px); box-shadow: 0 6px 16px rgba(29,78,216,0.25); }
  .d-cta svg { width: 15px; height: 15px; }

  /* SECTION SHELL */
  .sec { padding: 12vh 8vw; position: relative; }
  .sec-head { max-width: 700px; margin-bottom: 4rem; }
  .sec-head h2 { font-family: 'DM Serif Display', serif; font-weight: 400; font-size: clamp(1.9rem, 3.6vw, 3rem); line-height: 1.12; letter-spacing: -0.02em; color: var(--ink); }
  .sec-head p { margin-top: 1.25rem; font-size: clamp(0.95rem, 1.2vw, 1.05rem); line-height: 1.7; color: var(--muted); max-width: 460px; }

  /* DECOMP — signature */
  .decomp-panel {
    background: var(--card); border: 1px solid var(--line-hi); border-radius: 12px;
    padding: clamp(2rem, 5vw, 4rem);
  }
  .decomp-stage { width: 100%; max-width: 720px; margin: 0 auto; }
  .decomp-node { cursor: pointer; }
  .decomp-node:focus { outline: none; }
  .decomp-node:focus-visible circle, .decomp-node:focus-visible rect { stroke: var(--accent-hi); stroke-width: 2.5; }
  .decomp-read {
    max-width: 560px; margin: 2.5rem auto 0; min-height: 92px;
    border: 1px solid var(--line-hi); border-radius: 10px;
    background: rgba(29,78,216,0.04);
    padding: 1.4rem 1.75rem;
    display: flex; flex-direction: column; gap: 0.5rem; justify-content: center;
    transition: border-color 0.4s;
  }
  .decomp-read-label { font-family: 'DM Mono', monospace; font-size: 0.62rem; letter-spacing: 0.22em; text-transform: uppercase; color: var(--accent); }
  .decomp-read-line { font-family: 'DM Serif Display', serif; font-size: clamp(1.1rem, 1.8vw, 1.4rem); line-height: 1.4; color: var(--ink); }
  .decomp-read-line.idle { color: var(--muted); font-style: italic; }

  /* PROOF STRIP */
  .proof-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; }
  .proof-cell {
    background: var(--card); border: 1px solid var(--line); border-radius: 10px;
    padding: 2.25rem 1.75rem; display: flex; flex-direction: column; gap: 0.6rem;
    transition: border-color 0.3s;
  }
  .proof-cell:hover { border-color: var(--line-hi); }
  .proof-big { font-family: 'DM Serif Display', serif; font-size: clamp(1.5rem, 2.4vw, 2.1rem); line-height: 1.1; color: var(--ink); }
  .proof-small { font-family: 'DM Mono', monospace; font-size: 0.68rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--accent); line-height: 1.6; }

  /* SERVICE DOORS */
  .doors { padding: 0 8vw 12vh; }
  .doors-head { padding: 0 0 4vh; }
  .doors-list { display: flex; flex-direction: column; gap: 1rem; }
  .svc-door {
    padding: clamp(2rem, 4vh, 3rem) clamp(1.75rem, 4vw, 3.5rem); cursor: pointer;
    background: var(--card);
    border: 1px solid var(--line-hi); border-radius: 12px;
    transition: box-shadow 0.4s, transform 0.4s;
    display: block; text-decoration: none; color: var(--ink);
    position: relative; overflow: hidden;
  }
  .svc-door:hover { box-shadow: 0 8px 24px rgba(29,78,216,0.1); transform: translateY(-2px); }
  .svc-door-inner { display: flex; align-items: center; gap: clamp(2rem, 5vw, 5rem); max-width: 900px; }
  .svc-vis { flex-shrink: 0; }
  .svc-text { flex: 1; }
  .svc-arrow { color: var(--accent); font-size: 1.4rem; opacity: 0; transform: translateX(-8px); transition: all 0.3s ease; flex-shrink: 0; }
  .svc-door:hover .svc-arrow { opacity: 1; transform: translateX(0); }
  .svc-title { font-family: 'DM Serif Display', serif; font-size: clamp(1.6rem, 2.8vw, 2.4rem); line-height: 1.15; margin-bottom: 0.5rem; color: var(--ink); }
  .svc-desc { font-size: clamp(0.82rem, 1vw, 0.92rem); color: var(--muted); line-height: 1.65; }

  /* FINAL CTA */
  .final {
    padding: 16vh 8vw; text-align: center; position: relative; overflow: clip;
    display: flex; flex-direction: column; align-items: center; gap: 1.75rem;
  }
  .final h2 { font-family: 'DM Serif Display', serif; font-weight: 400; font-size: clamp(3rem, 7vw, 6rem); line-height: 1; letter-spacing: -0.03em; color: var(--ink); }
  .final p { color: var(--muted); font-size: clamp(1rem, 1.3vw, 1.15rem); line-height: 1.7; max-width: 440px; }

  .d-footer {
    padding: 2.5rem 8vw; display: flex; justify-content: space-between; align-items: center;
    font-size: 0.75rem; color: var(--muted);
    border-top: 1px solid var(--line);
    background: var(--card);
  }
  .d-footer .drvrs-logo { font-size: 0.95rem; }
  .d-footer .drvrs-logo-pill { width: 20px; height: 10px; }

  @keyframes heroIn { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: translateY(0); } }

  @media (max-width: 768px) {
    .drvrs-nav { padding: 1rem 1.5rem; }
    .drvrs-nav-links { display: none; }
    .drvrs-hamburger { display: flex; }
    .hero-wrap { padding: 6.5rem 4vw 4vh; }
    .hero { padding: 2rem 1.5rem; min-height: 70vh; }
    .sec { padding: 9vh 6vw; }
    .doors { padding: 0 6vw 9vh; }
    .svc-door-inner { gap: 1.5rem; flex-direction: column; align-items: flex-start; }
    .svc-arrow { display: none; }
    .proof-grid { grid-template-columns: 1fr 1fr; }
    .final { padding: 12vh 6vw; }
  }
  @media (max-width: 480px) {
    .proof-grid { grid-template-columns: 1fr; }
  }
`;

function F({ children, className = "", delay = "", style }) {
  const r = useRef(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold: 0.12 });
    if (r.current) o.observe(r.current);
    return () => o.disconnect();
  }, []);
  return <div ref={r} className={`fi${v ? " on" : ""} ${delay} ${className}`} style={style}>{children}</div>;
}

/* ============ INTERACTIVE DECOMP (signature) ============ */
function Decomp() {
  const ref = useRef(null);
  const [fired, setFired] = useState(false);
  const [active, setActive] = useState(null);

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
    { id: "rev",   label: "Revenue",        x: 260, y: 48,  level: 0 },
    { id: "vol",   label: "Volume",         x: 90,  y: 175, level: 1 },
    { id: "con",   label: "Conversion",     x: 260, y: 175, level: 1 },
    { id: "pri",   label: "Price",          x: 430, y: 175, level: 1 },
    { id: "reach", label: "Reach",          x: 42,  y: 310, level: 2, parent: "vol", read: "Not enough of the right people know you exist." },
    { id: "act",   label: "Relevance",      x: 138, y: 310, level: 2, parent: "vol", read: "They know you. They don't see themselves in you." },
    { id: "qual",  label: "Qualification",  x: 214, y: 310, level: 2, parent: "con", read: "Pipeline full of deals that were never going to close." },
    { id: "off",   label: "Offer",          x: 306, y: 310, level: 2, parent: "con", read: "The deal asks for too much change at once." },
    { id: "diff",  label: "Differentiation", x: 384, y: 310, level: 2, parent: "pri", read: "They like you. They can't say why you over anyone else." },
    { id: "nec",   label: "Necessity",      x: 478, y: 310, level: 2, parent: "pri", read: "Nice to have. Nothing forces the decision." },
  ];
  const edges = [
    { from: "rev", to: "vol" }, { from: "rev", to: "con" }, { from: "rev", to: "pri" },
    { from: "vol", to: "reach" }, { from: "vol", to: "act" },
    { from: "con", to: "qual" }, { from: "con", to: "off" },
    { from: "pri", to: "diff" }, { from: "pri", to: "nec" },
  ];
  const getNode = id => nodes.find(n => n.id === id);
  const activeNode = active ? getNode(active) : null;
  const activePath = activeNode ? [active, activeNode.parent, "rev"] : [];
  const isHot = id => activePath.includes(id);
  const edgeHot = e => activePath.includes(e.from) && activePath.includes(e.to);

  const orthoPath = (from, to) => {
    const x1 = from.x, y1 = from.y + (from.level === 0 ? 16 : 12);
    const x2 = to.x, y2 = to.y - (to.level === 1 ? 24 : 16);
    if (Math.abs(x2 - x1) < 1) return `M${x1},${y1} L${x2},${y2}`;
    const my = (y1 + y2) / 2, d = x2 > x1 ? 1 : -1, r = Math.min(9, Math.abs(x2 - x1) / 2);
    return `M${x1},${y1} L${x1},${my - 9} Q${x1},${my} ${x1 + d * r},${my} L${x2 - d * r},${my} Q${x2},${my} ${x2},${my + 9} L${x2},${y2}`;
  };
  const mono = "'JetBrains Mono', monospace";
  const edgeDelay = { vol: 0.1, con: 0.15, pri: 0.2, reach: 0.4, act: 0.42, qual: 0.44, off: 0.48, diff: 0.52, nec: 0.56 };
  const nodeDelay = { 0: 0, 1: 0.25, 2: 0.5 };

  return (
    <div ref={ref} className="decomp-stage">
      <svg viewBox={`0 0 ${W} 380`} style={{ width: "100%", height: "auto", overflow: "visible" }}>
        {edges.map((e, i) => {
          const from = getNode(e.from), to = getNode(e.to), d = orthoPath(from, to), len = 600, delay = edgeDelay[e.to];
          const hot = edgeHot(e);
          const dim = active && !hot;
          return (
            <g key={i} style={{ opacity: dim ? 0.2 : 1, transition: "opacity 0.4s ease" }}>
              <path d={d} fill="none" stroke={hot ? "#2563eb" : "rgba(11,18,32,0.22)"} strokeWidth={hot ? 1.5 : 1} strokeDasharray={len} strokeDashoffset={fired ? 0 : len} style={{ transition: `stroke-dashoffset 0.6s ease ${delay}s, stroke 0.4s ease` }} />
            </g>
          );
        })}
        {nodes.map(n => {
          const isRoot = n.level === 0, isMid = n.level === 1, isLeaf = n.level === 2;
          const delay = nodeDelay[n.level];
          const hot = isHot(n.id);
          const dim = active && !hot;
          const inner = (
            <g opacity={fired ? (dim ? 0.35 : 1) : 0} transform={fired ? "translate(0,0)" : "translate(0,12)"} style={{ transition: `opacity 0.5s ease ${fired ? 0 : delay}s, transform 0.5s cubic-bezier(0.16,1,0.3,1) ${delay}s` }}>
              {isRoot && <>
                <text x={n.x} y={n.y + 2} textAnchor="middle" fill="#0B1220" fontSize="13" fontFamily={mono} fontWeight="600" letterSpacing="0.16em">{n.label.toUpperCase()}</text>
                <line x1={n.x - 44} y1={n.y + 9} x2={n.x + 44} y2={n.y + 9} stroke={hot ? "#2563eb" : "#0B1220"} strokeWidth="1.5" style={{ transition: "stroke 0.4s" }} />
                <rect x={n.x - 8} y={n.y + 13} width="16" height="8" rx="4" fill={hot ? "#2563eb" : "#0B1220"} style={{ transition: "fill 0.4s" }} />
              </>}
              {isMid && <>
                <rect x={n.x - 6} y={n.y - 26} width="12" height="6" rx="3" fill={hot ? "#2563eb" : "#FFFFFF"} stroke={hot ? "#2563eb" : "rgba(11,18,32,0.5)"} strokeWidth="1" style={{ transition: "fill 0.4s, stroke 0.4s" }} />
                <text x={n.x} y={n.y + 2} textAnchor="middle" fill={hot ? "#2563eb" : "rgba(11,18,32,0.8)"} fontSize="10" fontFamily={mono} fontWeight="500" letterSpacing="0.14em" style={{ transition: "fill 0.4s" }}>{n.label.toUpperCase()}</text>
              </>}
              {isLeaf && <>
                <rect x={n.x - 42} y={n.y - 24} width={84} height={48} rx="4" fill="transparent" />
                <rect x={n.x - 6} y={n.y - 11} width="12" height="6" rx="3" fill={hot ? "#2563eb" : "#FFFFFF"} stroke="#2563eb" strokeWidth="1.2" style={{ transition: "fill 0.3s" }} />
                <text x={n.x} y={n.y + 10} textAnchor="middle" fill={hot ? "#2563eb" : "rgba(11,18,32,0.6)"} fontSize="8.5" fontFamily={mono} letterSpacing="0.1em" style={{ transition: "fill 0.3s" }}>{n.label.toUpperCase()}</text>
              </>}
            </g>
          );
          return isLeaf ? (
            <g key={n.id} className="decomp-node" role="button" tabIndex={0} aria-label={`Diagnose ${n.label}`}
              onClick={() => setActive(active === n.id ? null : n.id)}
              onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setActive(active === n.id ? null : n.id); } }}>
              {inner}
            </g>
          ) : <g key={n.id}>{inner}</g>;
        })}
      </svg>
      <div className="decomp-read" style={activeNode ? { borderColor: "#2563eb" } : {}}>
        {activeNode ? (
          <>
            <div className="decomp-read-label">{activeNode.label} → {getNode(activeNode.parent).label} → Revenue</div>
            <div className="decomp-read-line">{activeNode.read}</div>
          </>
        ) : (
          <div className="decomp-read-line idle">Select a branch to see how that problem usually shows up.</div>
        )}
      </div>
    </div>
  );
}

/* ============ SERVICE DOORS (preserved) ============ */
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
            return <div key={i} style={{ width: "clamp(28px,4vw,42px)", height: "clamp(28px,4vw,42px)", borderRadius: "50%", border: `1px solid rgba(29,78,216,${0.12 + c * 0.55})`, background: `rgba(29,78,216,${c * 0.08})`, filter: `blur(${(1 - c) * 5}px)`, transition: "all 0.35s ease", display: "flex", alignItems: "center", justifyContent: "center" }}><div style={{ width: "5px", height: "5px", borderRadius: "50%", background: `rgba(29,78,216,${c})`, transition: "all 0.35s ease" }} /></div>;
          })}
        </div>
        <div className="svc-text"><div className="svc-title">One Day</div><div className="svc-desc">Your team walks out seeing deals differently.</div></div>
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
            <div key={i} style={{ height: "10px", borderRadius: "5px", background: bar.accent ? `rgba(29,78,216,${0.35 + unblock * 0.45})` : bar.dim ? "rgba(11,18,32,0.06)" : "rgba(11,18,32,0.1)", width: `${bar.w}%`, transition: `all 0.7s cubic-bezier(0.16,1,0.3,1) ${bar.d}s`, opacity: bar.dim ? 0.4 + unblock * 0.5 : 1 }} />
          ))}
        </div>
        <div className="svc-text"><div className="svc-title">One Initiative</div><div className="svc-desc">The stuck thing gets unstuck.</div></div>
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
    <a ref={ref} href="/OneTeam" className="svc-door">
      <div className="svc-door-inner">
        <div className="svc-vis" style={{ position: "relative", width: "clamp(70px,10vw,100px)", height: "clamp(70px,10vw,100px)", flexShrink: 0 }}>
          {[0,1,2,3].map(i => {
            const lp = Math.max(0, Math.min(1, layers * 2 - i * 0.3)), size = 28 + i * 22;
            return <div key={i} style={{ position: "absolute", left: "50%", top: "50%", width: `${size}%`, height: `${size}%`, borderRadius: "50%", border: `1px solid rgba(29,78,216,${lp * (0.55 - i * 0.1)})`, background: i === 0 ? `rgba(29,78,216,${lp * 0.12})` : "transparent", transform: "translate(-50%,-50%)", transition: `all 0.6s ease ${i * 0.15}s`, opacity: lp }}>{i === 0 && <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)", width: "5px", height: "5px", borderRadius: "50%", background: `rgba(29,78,216,${lp})` }} />}</div>;
          })}
        </div>
        <div className="svc-text"><div className="svc-title">One Team</div><div className="svc-desc">A drvr embedded in your team.</div></div>
        <div className="svc-arrow">→</div>
      </div>
    </a>
  );
}

/* ============ PAGE ============ */
export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    base44.auth.isAuthenticated().then(authed => {
      if (authed) base44.auth.me().then(u => setIsAdmin(u?.role === "admin"));
    });
  }, []);

  return (
    <>
      <style>{styles}</style>
      <div className="drvrs">

        {/* NAV — preserved */}
        <nav className="drvrs-nav">
          <a className="drvrs-logo" href="/"><div className="drvrs-logo-pill" /> drvrs</a>
          <div className="drvrs-nav-links">
            <a href="/OneDay">One Day</a>
            <a href="/OneInitiative">One Initiative</a>
            <a href="/OneTeam">One Team</a>
          </div>
          <button className="drvrs-hamburger" onClick={() => setMenuOpen(true)} aria-label="Open menu">
            <span /><span /><span />
          </button>
        </nav>

        {/* MOBILE MENU */}
        <div className={`drvrs-mobile-menu${menuOpen ? " open" : ""}`}>
          <button className="drvrs-mobile-close" onClick={() => setMenuOpen(false)} aria-label="Close menu">×</button>
          <a href="/OneDay" onClick={() => setMenuOpen(false)}>One Day</a>
          <a href="/OneInitiative" onClick={() => setMenuOpen(false)}>One Initiative</a>
          <a href="/OneTeam" onClick={() => setMenuOpen(false)}>One Team</a>
        </div>

        {/* 1. HERO */}
        <div className="hero-wrap dots">
          <section className="hero">
            <h1>
              Deals stall for a reason.<br />
              <em>Find it. Fix it.</em>
            </h1>
            <p className="hero-sub">
              Somewhere in your stalled deal there's one specific reason it stopped. You can't see it from inside. Finding it is the work.
            </p>
            <div className="hero-ctas">
              <a className="d-cta" href={CTA_URL} target="_blank" rel="noopener noreferrer">
                Book a 30-minute call
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </a>
              <a className="hero-hint" href="#diagnostic">See the diagnostic ↓</a>
            </div>
          </section>
        </div>

        {/* 3. HOW IT WORKS */}
        <section className="sec">
          <F className="sec-head">
            <div className="d-eyebrow">How it works</div>
            <h2>Three steps. No mystery.</h2>
          </F>
          <F delay="d1"><HowItWorks /></F>
        </section>

        {/* 4. INTERACTIVE DECOMP — signature */}
        <section className="sec dots" id="diagnostic">
          <F className="sec-head" style={{ textAlign: "center", margin: "0 auto 3.5rem" }}>
            <div className="d-eyebrow">The diagnostic</div>
            <h2>Where is your revenue<br />breaking down?</h2>
          </F>
          <F delay="d1"><div className="decomp-panel"><Decomp /></div></F>
          <F delay="d2">
            <p style={{ textAlign: "center", marginTop: "2rem", fontSize: "0.9rem", color: "var(--muted)", maxWidth: "420px", marginLeft: "auto", marginRight: "auto", lineHeight: 1.7 }}>
              Most stalled deals trace back to one of these six. The first call is about figuring out which one applies to you.
            </p>
          </F>
        </section>

        {/* 5. PROOF STRIP */}
        <section className="sec">
          <F className="sec-head">
            <div className="d-eyebrow">Why me</div>
            <h2>I've run this play from inside.</h2>
          </F>
          <F delay="d1">
            <div className="proof-grid">
              <div className="proof-cell">
                <div className="proof-big">15 years</div>
                <div className="proof-small">Running growth. Not advising it.</div>
              </div>
              <div className="proof-cell">
                <div className="proof-big">2x early</div>
                <div className="proof-small">First GTM seats at venture-backed startups.</div>
              </div>
              <div className="proof-cell">
                <div className="proof-big">Today</div>
                <div className="proof-small">Still in the seat. Growth at a live startup.</div>
              </div>
              <div className="proof-cell">
                <div className="proof-big">1 lens</div>
                <div className="proof-small">Who cares. What's in the way.</div>
              </div>
            </div>
          </F>
        </section>

        {/* 6. THREE DOORS */}
        <section className="doors">
          <div className="doors-head">
            <F>
              <div className="d-eyebrow">Three ways in</div>
              <h2 className="serif" style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)", lineHeight: 1.1, letterSpacing: "-0.025em", maxWidth: "500px" }}>
                Pick your dose.
              </h2>
            </F>
          </div>
          <div className="doors-list">
            <OneDayVisual />
            <OneInitiativeVisual />
            <OneTeamVisual />
          </div>
        </section>

        {/* 7. FINAL CTA */}
        <section className="final dots">
          <F><h2>Start with a call.</h2></F>
          <F className="d1"><p>30 minutes, free. Bring the thing that's stuck. Worst case, you leave with a clearer read on it than you walked in with.</p></F>
          <F className="d2">
            <a className="d-cta" href={CTA_URL} target="_blank" rel="noopener noreferrer">
              Book a 30-minute call
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </a>
          </F>
        </section>

        <footer className="d-footer">
          <a className="drvrs-logo"><div className="drvrs-logo-pill" /> drvrs</a>
          <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
            {isAdmin && <a href="/AdminRooms" style={{ color: "var(--ink)", fontSize: "0.75rem", letterSpacing: "0.08em", textTransform: "uppercase", textDecoration: "none" }}>Rooms</a>}
            <button onClick={() => base44.auth.redirectToLogin()} style={{ background: "none", border: "none", color: "var(--ink)", fontSize: "0.75rem", letterSpacing: "0.08em", cursor: "pointer", textTransform: "uppercase", transition: "opacity 0.3s ease" }} onMouseEnter={(e) => e.target.style.opacity = "0.6"} onMouseLeave={(e) => e.target.style.opacity = "1"}>Log In</button>
            <span style={{ fontSize: "0.65rem", letterSpacing: "0.08em" }}>&copy; 2026</span>
          </div>
        </footer>

      </div>
    </>
  );
}