import { useState, useEffect, useRef } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300;1,400&display=swap');

  .od * { margin: 0; padding: 0; box-sizing: border-box; }
  .od {
    background: #0a1a14;
    color: #f5f0e8;
    font-family: 'DM Sans', sans-serif;
    font-weight: 300;
    overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
    min-height: 100vh;
  }

  /* NAV */
  .od-nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    padding: 2rem 3rem;
    display: flex; justify-content: space-between; align-items: center;
    mix-blend-mode: difference;
  }
  .od-logo { display: flex; align-items: center; gap: 0.6rem; font-family: 'DM Sans', sans-serif; font-size: 1.2rem; font-weight: 400; letter-spacing: 0.05em; color: #f5f0e8; text-decoration: none; }
  .od-logo-pill { width: 28px; height: 14px; background: #f5f0e8; border-radius: 7px; }
  .od-nav-links { display: flex; gap: 2.5rem; align-items: center; }
  .od-nav-links a { font-size: 0.85rem; font-weight: 400; letter-spacing: 0.08em; color: #f5f0e8; text-decoration: none; text-transform: uppercase; transition: opacity 0.3s; }
  .od-nav-links a:hover { opacity: 0.6; }
  .od-nav-links a.od-active { opacity: 0.5; }
  .od-hamburger { display: none; flex-direction: column; gap: 5px; cursor: pointer; background: none; border: none; padding: 4px; }
  .od-hamburger span { display: block; width: 22px; height: 1.5px; background: #f5f0e8; }
  .od-mobile-menu { display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: #0a1a14; z-index: 200; flex-direction: column; align-items: center; justify-content: center; gap: 2.5rem; }
  .od-mobile-menu.open { display: flex; }
  .od-mobile-menu a { font-size: 1.5rem; font-weight: 400; letter-spacing: 0.08em; color: #f5f0e8; text-decoration: none; text-transform: uppercase; }
  .od-mobile-close { position: absolute; top: 2rem; right: 2rem; background: none; border: none; color: #f5f0e8; font-size: 2rem; cursor: pointer; }

  /* HERO */
  .od-hero {
    min-height: 100vh;
    display: flex; flex-direction: column;
    align-items: center; justify-content: flex-end;
    padding-bottom: 8vh;
    position: relative; overflow: hidden;
    text-align: center;
  }
  .od-hero-bg {
    position: absolute; inset: 0;
    background: radial-gradient(ellipse 80% 60% at 50% 80%, rgba(45,138,110,0.12) 0%, transparent 70%);
    pointer-events: none;
  }
  .od-hero-arc {
    position: absolute; bottom: 0; left: 0; right: 0;
    width: 100%; height: 80%;
  }
  .od-hero-text {
    position: relative; z-index: 2;
    opacity: 0; animation: od-fadeUp 1s ease-out 1.2s forwards;
  }
  .od-hero-label {
    font-size: 0.75rem; letter-spacing: 0.2em; text-transform: uppercase; color: #2d8a6e;
    margin-bottom: 1.5rem;
    opacity: 0; animation: od-fadeUp 1s ease-out 0.3s forwards;
  }
  .od-hero h1 {
    font-family: 'DM Serif Display', serif; font-weight: 400;
    font-size: clamp(4rem, 10vw, 9rem);
    line-height: 0.95; letter-spacing: -0.04em;
    opacity: 0; animation: od-fadeUp 1s ease-out 0.5s forwards;
  }
  .od-hero-sub {
    font-size: clamp(1rem, 1.4vw, 1.15rem); line-height: 1.7; color: #7a8a82;
    max-width: 520px; margin: 2rem auto 0;
    opacity: 0; animation: od-fadeUp 1s ease-out 0.8s forwards;
  }

  /* SUN PATH ANIMATION */
  @keyframes od-sun-travel {
    from { offset-distance: 0%; }
    to   { offset-distance: 100%; }
  }

  /* PILLARS */
  .od-pillars {
    padding: 14vh 8vw;
    background: #0a1a14;
  }
  .od-section-label { font-size: 0.75rem; letter-spacing: 0.2em; text-transform: uppercase; color: #2d8a6e; margin-bottom: 5rem; }
  .od-pillars-grid {
    display: grid; grid-template-columns: repeat(3, 1fr); gap: 2px;
  }
  .od-pillar {
    padding: 3rem 2.5rem;
    border-top: 1px solid rgba(245,240,232,0.08);
    display: flex; flex-direction: column; gap: 1.5rem;
  }
  .od-pillar-visual {
    width: 100%; aspect-ratio: 4/3;
    display: flex; align-items: center; justify-content: center;
  }
  .od-pillar-title { font-family: 'DM Serif Display', serif; font-size: clamp(1.3rem, 1.8vw, 1.7rem); color: #f5f0e8; line-height: 1.2; }
  .od-pillar-desc { font-size: 0.9rem; line-height: 1.7; color: #7a8a82; }

  /* TRANSFORMATION */
  .od-transform {
    background: #f5f0e8; color: #0a1a14;
    padding: 14vh 8vw;
  }
  .od-transform .od-section-label { color: #2d8a6e; }
  .od-transform-header {
    display: grid; grid-template-columns: 1fr 60px 1fr;
    margin-bottom: 0;
  }
  .od-transform-col-label {
    font-size: 0.7rem; letter-spacing: 0.2em; text-transform: uppercase;
    padding-bottom: 1.5rem;
    display: flex; align-items: center; gap: 0.6rem;
    border-bottom: 1px solid rgba(10,26,20,0.08);
  }
  .od-transform-col-label span { width: 20px; height: 1px; display: inline-block; }
  .od-col-before-label { color: #b0b8b2; }
  .od-col-before-label span { background: #b0b8b2; }
  .od-col-after-label { color: #2d8a6e; }
  .od-col-after-label span { background: #2d8a6e; }
  .od-transform-row {
    display: grid; grid-template-columns: 1fr 60px 1fr;
    align-items: stretch;
    border-bottom: 1px solid rgba(10,26,20,0.08);
  }
  .od-transform-item {
    font-family: 'DM Serif Display', serif;
    font-size: clamp(0.95rem, 1.3vw, 1.15rem);
    line-height: 1.5;
    padding: 1.4rem 0;
  }
  .od-col-before .od-transform-item { color: #b0b8b2; font-style: italic; }
  .od-col-after .od-transform-item { color: #0a1a14; }
  .od-transform-arrow-cell {
    display: flex; align-items: center; justify-content: center;
  }
  .od-arrow-icon { color: rgba(45,138,110,0.5); font-size: 1rem; }

  /* TIMELINE */
  .od-timeline { padding: 14vh 8vw; background: #0a1a14; }
  .od-timeline-track { margin-top: 5rem; position: relative; }
  .od-timeline-ruler {
    display: flex; align-items: flex-end; gap: 0; margin-bottom: 5rem;
    border-bottom: 1px solid rgba(245,240,232,0.12);
    padding-bottom: 0;
  }
  .od-timeline-items {
    display: grid; grid-template-columns: repeat(3, 1fr); gap: 3rem;
  }
  .od-tl-item {}
  .od-tl-time { font-family: 'DM Serif Display', serif; font-size: clamp(3rem, 5vw, 5rem); line-height: 1; letter-spacing: -0.04em; color: #f5f0e8; margin-bottom: 0.4rem; }
  .od-tl-period { font-size: 0.7rem; letter-spacing: 0.2em; text-transform: uppercase; color: #2d8a6e; margin-bottom: 1.2rem; }
  .od-tl-desc { font-size: 0.9rem; line-height: 1.65; color: #7a8a82; }

  /* CTA */
  .od-cta {
    min-height: 55vh; display: flex; flex-direction: column; align-items: center; justify-content: center;
    text-align: center; padding: 14vh 8vw; background: #0a1a14; position: relative; overflow: hidden;
  }
  .od-cta::before { content: ''; position: absolute; bottom: -20%; left: 50%; transform: translateX(-50%); width: 70vw; height: 50vw; background: radial-gradient(circle, rgba(45,138,110,0.08) 0%, transparent 70%); pointer-events: none; }
  .od-cta h2 { font-family: 'DM Serif Display', serif; font-size: clamp(2.5rem, 5vw, 5rem); font-weight: 400; line-height: 1.1; margin-bottom: 1rem; letter-spacing: -0.03em; }
  .od-cta h2 em { font-style: italic; color: #2d8a6e; }
  .od-cta-sub { font-size: 1rem; color: #7a8a82; margin-bottom: 3rem; max-width: 400px; }
  .od-cta-btn { display: inline-flex; align-items: center; gap: 0.75rem; background: #2d8a6e; color: #f5f0e8; padding: 1rem 2.5rem; border-radius: 50px; font-size: 0.95rem; font-weight: 400; text-decoration: none; cursor: pointer; border: none; transition: all 0.3s; position: relative; z-index: 1; }
  .od-cta-btn:hover { background: #35a080; transform: translateY(-2px); }
  .od-cta-btn svg { width: 16px; height: 16px; transition: transform 0.3s; }
  .od-cta-btn:hover svg { transform: translateX(3px); }

  /* FOOTER */
  .od-footer { padding: 3rem 8vw; display: flex; justify-content: space-between; align-items: center; font-size: 0.8rem; color: #7a8a82; border-top: 1px solid rgba(245,240,232,0.08); }

  @keyframes od-fadeUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
  .od-reveal { opacity: 0; transform: translateY(40px); transition: all 0.9s cubic-bezier(0.16, 1, 0.3, 1); }
  .od-reveal.od-visible { opacity: 1; transform: translateY(0); }

  @media (max-width: 768px) {
    .od-nav { padding: 1.5rem 2rem; }
    .od-nav-links { display: none; }
    .od-hamburger { display: flex; }
    .od-pillars-grid { grid-template-columns: 1fr; }
    .od-transform-grid { grid-template-columns: 1fr; }
    .od-transform-arrow-col { display: none; }
    .od-timeline-items { grid-template-columns: 1fr; gap: 3rem; }
  }
`;

function Reveal({ children, delay = 0 }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={ref} className={`od-reveal ${visible ? "od-visible" : ""}`} style={{ transitionDelay: visible ? `${delay}ms` : "0ms" }}>
      {children}
    </div>
  );
}

/* ─── Hero Arc Animation ─── */
function HeroArc() {
  const sunRef = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let start = null;
    const duration = 2800;
    const ease = t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    const animate = (ts) => {
      if (!start) start = ts;
      const t = Math.min((ts - start) / duration, 1);
      setProgress(ease(t));
      if (t < 1) requestAnimationFrame(animate);
    };
    const raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, []);

  const W = 1200, H = 500;
  const cx = W / 2, groundY = H - 60;
  const arcLeft = 80, arcRight = W - 80, peakY = 80;

  // Quadratic bezier point
  const t = progress;
  const bx = (1 - t) * (1 - t) * arcLeft + 2 * (1 - t) * t * cx + t * t * arcRight;
  const by = (1 - t) * (1 - t) * groundY + 2 * (1 - t) * t * peakY + t * t * groundY;

  return (
    <svg
      className="od-hero-arc"
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMax meet"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id="hero-ground" cx="50%" cy="100%" r="50%">
          <stop offset="0%" stopColor="#2d8a6e" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#2d8a6e" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="sun-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#2d8a6e" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#2d8a6e" stopOpacity="0" />
        </radialGradient>
        <filter id="sun-blur" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="18" />
        </filter>
        <filter id="sun-blur-sm" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" />
        </filter>
      </defs>

      {/* Ground glow */}
      <ellipse cx={W / 2} cy={groundY} rx={W * 0.45} ry={60} fill="url(#hero-ground)" />

      {/* Ground line */}
      <line x1={60} y1={groundY} x2={W - 60} y2={groundY} stroke="rgba(245,240,232,0.07)" strokeWidth="1" />

      {/* Hour ticks */}
      {Array.from({ length: 13 }).map((_, i) => {
        const tx = arcLeft + (i / 12) * (arcRight - arcLeft);
        return <line key={i} x1={tx} y1={groundY} x2={tx} y2={groundY + (i % 4 === 0 ? 12 : 6)} stroke="rgba(245,240,232,0.12)" strokeWidth="1" />;
      })}

      {/* AM / PM labels */}
      <text x={arcLeft} y={groundY + 30} textAnchor="middle" fill="rgba(245,240,232,0.25)" fontSize="13" fontFamily="DM Sans, sans-serif" letterSpacing="0.15em">AM</text>
      <text x={arcRight} y={groundY + 30} textAnchor="middle" fill="rgba(245,240,232,0.25)" fontSize="13" fontFamily="DM Sans, sans-serif" letterSpacing="0.15em">PM</text>

      {/* Arc path */}
      <path
        d={`M ${arcLeft} ${groundY} Q ${cx} ${peakY} ${arcRight} ${groundY}`}
        stroke="rgba(45,138,110,0.2)"
        strokeWidth="1.5"
        strokeDasharray="5 7"
      />

      {/* Traveled arc (solid, glowing) */}
      {progress > 0.01 && (
        <path
          d={`M ${arcLeft} ${groundY} Q ${cx} ${peakY} ${bx} ${by}`}
          stroke="rgba(45,138,110,0.55)"
          strokeWidth="1.5"
          fill="none"
        />
      )}

      {/* Sun glow halo */}
      <circle cx={bx} cy={by} r={60} fill="url(#sun-glow)" filter="url(#sun-blur)" />

      {/* Sun rings */}
      <circle cx={bx} cy={by} r={28} fill="rgba(45,138,110,0.06)" stroke="rgba(45,138,110,0.25)" strokeWidth="1" />
      <circle cx={bx} cy={by} r={16} fill="rgba(45,138,110,0.12)" stroke="rgba(45,138,110,0.5)" strokeWidth="1" />
      <circle cx={bx} cy={by} r={7} fill="#2d8a6e" opacity="0.9" />
      <circle cx={bx} cy={by} r={3} fill="#f5f0e8" />

      {/* Vertical drop line */}
      <line x1={bx} y1={by + 8} x2={bx} y2={groundY} stroke="rgba(45,138,110,0.15)" strokeWidth="1" strokeDasharray="3 4" />
    </svg>
  );
}

/* ─── Pillar Illustrations ─── */
function MarketIllustration() {
  return (
    <svg viewBox="0 0 200 150" fill="none" style={{ width: "100%", maxWidth: 220 }}>
      <defs>
        <radialGradient id="m-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#2d8a6e" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#2d8a6e" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* Concentric market rings */}
      <circle cx="100" cy="75" r="60" stroke="rgba(45,138,110,0.15)" strokeWidth="1" fill="url(#m-glow)" />
      <circle cx="100" cy="75" r="40" stroke="rgba(45,138,110,0.25)" strokeWidth="1" fill="none" />
      <circle cx="100" cy="75" r="20" stroke="rgba(45,138,110,0.45)" strokeWidth="1" fill="rgba(45,138,110,0.08)" />
      <circle cx="100" cy="75" r="5" fill="#2d8a6e" />
      {/* Axis cross */}
      <line x1="40" y1="75" x2="160" y2="75" stroke="rgba(245,240,232,0.1)" strokeWidth="1" />
      <line x1="100" y1="15" x2="100" y2="135" stroke="rgba(245,240,232,0.1)" strokeWidth="1" />
      {/* Dots on rings */}
      {[[60,75],[100,35],[140,75],[100,115],[72,47],[128,103]].map(([x,y],i)=>(
        <circle key={i} cx={x} cy={y} r="3" fill="rgba(45,138,110,0.6)" />
      ))}
      {/* Labels */}
      <text x="100" y="148" textAnchor="middle" fill="rgba(245,240,232,0.2)" fontSize="8" fontFamily="DM Sans" letterSpacing="0.15em">MARKET FORCES</text>
    </svg>
  );
}

function AccountsIllustration() {
  const bars = [0.3, 0.55, 0.4, 0.75, 0.6, 0.85, 0.45];
  return (
    <svg viewBox="0 0 200 150" fill="none" style={{ width: "100%", maxWidth: 220 }}>
      {/* Pipeline bars */}
      {bars.map((h, i) => {
        const barH = h * 80;
        const x = 20 + i * 24;
        return (
          <g key={i}>
            <rect x={x} y={120 - barH} width="16" height={barH} fill={i === 5 ? "rgba(45,138,110,0.6)" : "rgba(45,138,110,0.15)"} rx="2" />
            <rect x={x} y={120 - barH} width="16" height="2" fill={i === 5 ? "#2d8a6e" : "rgba(45,138,110,0.4)"} rx="1" />
          </g>
        );
      })}
      {/* Baseline */}
      <line x1="16" y1="121" x2="184" y2="121" stroke="rgba(245,240,232,0.1)" strokeWidth="1" />
      {/* Magnifier over highlighted bar */}
      <circle cx="141" cy="68" r="22" stroke="rgba(45,138,110,0.5)" strokeWidth="1.5" fill="rgba(45,138,110,0.05)" />
      <line x1="157" y1="84" x2="170" y2="97" stroke="rgba(45,138,110,0.5)" strokeWidth="2" strokeLinecap="round" />
      <text x="100" y="148" textAnchor="middle" fill="rgba(245,240,232,0.2)" fontSize="8" fontFamily="DM Sans" letterSpacing="0.15em">PIPELINE DIAGNOSTIC</text>
    </svg>
  );
}

function StakeholderIllustration() {
  const nodes = [
    { x: 100, y: 30, r: 7, label: "CEO", opacity: 0.9 },
    { x: 60, y: 75, r: 6, label: "VP", opacity: 0.7 },
    { x: 140, y: 75, r: 6, label: "CFO", opacity: 0.7 },
    { x: 40, y: 118, r: 5, label: "", opacity: 0.45 },
    { x: 80, y: 118, r: 5, label: "", opacity: 0.45 },
    { x: 120, y: 118, r: 5, label: "", opacity: 0.45 },
    { x: 160, y: 118, r: 5, label: "", opacity: 0.45 },
  ];
  const edges = [[0,1],[0,2],[1,3],[1,4],[2,5],[2,6]];
  return (
    <svg viewBox="0 0 200 150" fill="none" style={{ width: "100%", maxWidth: 220 }}>
      {edges.map(([a,b],i) => (
        <line key={i} x1={nodes[a].x} y1={nodes[a].y} x2={nodes[b].x} y2={nodes[b].y} stroke="rgba(45,138,110,0.25)" strokeWidth="1" />
      ))}
      {nodes.map((n,i) => (
        <g key={i}>
          <circle cx={n.x} cy={n.y} r={n.r + 4} fill="rgba(45,138,110,0.05)" />
          <circle cx={n.x} cy={n.y} r={n.r} fill={`rgba(45,138,110,${n.opacity})`} />
          {n.label && <text x={n.x} y={n.y - n.r - 4} textAnchor="middle" fill="rgba(245,240,232,0.4)" fontSize="7" fontFamily="DM Sans">{n.label}</text>}
        </g>
      ))}
      <text x="100" y="148" textAnchor="middle" fill="rgba(245,240,232,0.2)" fontSize="8" fontFamily="DM Sans" letterSpacing="0.15em">STAKEHOLDER MAP</text>
    </svg>
  );
}

/* ─── Main Page ─── */
export default function OneDay() {
  const [menuOpen, setMenuOpen] = useState(false);

  const beforeItems = [
    '"They loved the demo."',
    '"The champion is excited."',
    '"We just need to get past procurement."',
    '"They said they\'ll have budget next quarter."',
    '"It\'s looking good."',
  ];
  const afterItems = [
    "Their ops team is drowning. This solves what the VP committed to fixing by Q3.",
    "The champion owns the initiative. If it fails, that's on them.",
    "We solve the problem on the CEO's board deck. Procurement won't hold that up.",
    "They need to go upmarket by Q4. The money will find us.",
    "The problem we solve is blocking an initiative the CEO owns. They can't move without fixing it.",
  ];

  return (
    <>
      <style>{styles}</style>
      <div className="od">
        {/* NAV */}
        <nav className="od-nav">
          <a className="od-logo" href="/"><div className="od-logo-pill" /> drvrs</a>
          <div className="od-nav-links">
            <a href="/OneDay" className="od-active">One Day</a>
            <a href="/OneInitiative">One Initiative</a>
            <a href="/OneTeam">One Team</a>
          </div>
          {!menuOpen && <button className="od-hamburger" onClick={() => setMenuOpen(true)}><span /><span /><span /></button>}
        </nav>
        <div className={`od-mobile-menu ${menuOpen ? "open" : ""}`}>
          <button className="od-mobile-close" onClick={() => setMenuOpen(false)}>✕</button>
          <a href="/OneDay" onClick={() => setMenuOpen(false)}>One Day</a>
          <a href="/OneInitiative" onClick={() => setMenuOpen(false)}>One Initiative</a>
          <a href="/OneTeam" onClick={() => setMenuOpen(false)}>One Team</a>
        </div>

        {/* HERO */}
        <section className="od-hero">
          <div className="od-hero-bg" />
          <HeroArc />
          <div style={{ position: "relative", zIndex: 2, textAlign: "center" }}>
            <div className="od-hero-label">Workshop</div>
            <h1>One Day.</h1>
            <p className="od-hero-sub">Your team walks in seeing deals one way.<br />They walk out seeing the forces behind them.</p>
          </div>
        </section>

        {/* PILLARS */}
        <Reveal>
          <section className="od-pillars">
            <div className="od-section-label">What we dial in</div>
            <div className="od-pillars-grid">
              {[
                { Vis: MarketIllustration, title: "Your market.", desc: "We map the organizational forces your buyers navigate — the goals, constraints, and pressures that make your solution matter or not. Your value prop stops being generic." },
                { Vis: AccountsIllustration, title: "Your accounts.", desc: "We run live deals through the diagnostic. What's blocking movement. What your team needs to find out. The deals that matter most get a map, not a guess." },
                { Vis: StakeholderIllustration, title: "Your stakeholders.", desc: "You're serving a person with a boss, a budget, competing priorities, and a problem to solve. Your team needs to understand all of it — not just who showed up to the demo." },
              ].map(({ Vis, title, desc }, i) => (
                <Reveal key={i} delay={i * 120}>
                  <div className="od-pillar">
                    <div className="od-pillar-visual"><Vis /></div>
                    <div className="od-pillar-title">{title}</div>
                    <div className="od-pillar-desc">{desc}</div>
                  </div>
                </Reveal>
              ))}
            </div>
          </section>
        </Reveal>

        {/* TRANSFORMATION */}
        <Reveal>
          <section className="od-transform">
            <div className="od-section-label">The shift</div>
            <div style={{ marginTop: "4rem" }}>
              <div className="od-transform-header">
                <div className="od-col-before-label od-transform-col-label"><span />How deals look now</div>
                <div />
                <div className="od-col-after-label od-transform-col-label"><span />How deals look after</div>
              </div>
              {beforeItems.map((before, i) => (
                <div key={i} className="od-transform-row">
                  <div className="od-col-before od-transform-item">{before}</div>
                  <div className="od-transform-arrow-cell">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="rgba(45,138,110,0.5)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                  <div className="od-col-after od-transform-item">{afterItems[i]}</div>
                </div>
              ))}
            </div>
          </section>
        </Reveal>

        {/* TIMELINE */}
        <Reveal>
          <section className="od-timeline">
            <div className="od-section-label">What happens</div>
            <div className="od-timeline-track">
              <div className="od-timeline-items">
                {[
                  { time: "AM", period: "Morning", desc: "The framework. What drvrs is, why it exists, and how the five lenses work. Applied to a real scenario, not a textbook." },
                  { time: "PM", period: "Afternoon", desc: "Your pipeline. Pick real deals. Run them through the diagnostic. Get action plans. The team leaves knowing how to do this themselves." },
                  { time: "∞", period: "Beyond", desc: "A shared language. Deal reviews stop being stories and start being diagnostics. The way the team talks about deals changes permanently." },
                ].map((item, i) => (
                  <Reveal key={i} delay={i * 130}>
                    <div className="od-tl-item">
                      <div className="od-tl-time">{item.time}</div>
                      <div className="od-tl-period">{item.period}</div>
                      <div className="od-tl-desc">{item.desc}</div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        </Reveal>

        {/* CTA */}
        <section className="od-cta">
          <Reveal><h2>One day changes<br /><em>everything.</em></h2></Reveal>
          <Reveal delay={100}><p className="od-cta-sub">Six to eight hours. Your team, your deals, your market.</p></Reveal>
          <Reveal delay={200}>
            <a className="od-cta-btn" href="https://tally.so/r/VLPjKa" target="_blank" rel="noopener noreferrer">
              Book a workshop
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </a>
          </Reveal>
        </section>

        <footer className="od-footer">
          <a className="od-logo" href="/"><div className="od-logo-pill" /> drvrs</a>
          <span>&copy; 2026</span>
        </footer>
      </div>
    </>
  );
}