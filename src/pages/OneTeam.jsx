import { useState, useEffect, useRef } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300;1,400&display=swap');

  .ot * { margin: 0; padding: 0; box-sizing: border-box; }

  .ot {
    background: #0a1a14;
    color: #f5f0e8;
    font-family: 'DM Sans', sans-serif;
    font-weight: 300;
    overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
    min-height: 100vh;
  }

  .ot-nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    padding: 2rem 3rem;
    display: flex; justify-content: space-between; align-items: center;
    mix-blend-mode: difference;
  }

  .ot-logo {
    display: flex; align-items: center; gap: 0.6rem;
    font-family: 'DM Sans', sans-serif; font-size: 1.2rem;
    font-weight: 400; letter-spacing: 0.05em;
    color: #f5f0e8; text-decoration: none; cursor: pointer;
  }

  .ot-logo-pill { width: 28px; height: 14px; background: #f5f0e8; border-radius: 7px; }

  .ot-nav-links { display: flex; gap: 2.5rem; align-items: center; }

  .ot-nav-links a {
    font-family: 'DM Sans', sans-serif; font-size: 0.85rem;
    font-weight: 400; letter-spacing: 0.08em;
    color: #f5f0e8; text-decoration: none;
    text-transform: uppercase; transition: opacity 0.3s ease; cursor: pointer;
  }

  .ot-nav-links a:hover { opacity: 0.6; }
  .ot-nav-links a.ot-active { opacity: 0.5; }

  .ot-hamburger {
    display: none; flex-direction: column; gap: 5px;
    cursor: pointer; background: none; border: none; padding: 4px;
  }
  .ot-hamburger span { display: block; width: 22px; height: 1.5px; background: #f5f0e8; }

  .ot-mobile-menu {
    display: none; position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: #0a1a14; z-index: 200;
    flex-direction: column; align-items: center; justify-content: center; gap: 2.5rem;
  }
  .ot-mobile-menu.open { display: flex; }
  .ot-mobile-menu a {
    font-family: 'DM Sans', sans-serif; font-size: 1.5rem;
    font-weight: 400; letter-spacing: 0.08em;
    color: #f5f0e8; text-decoration: none; text-transform: uppercase;
  }
  .ot-mobile-close {
    position: absolute; top: 2rem; right: 2rem;
    background: none; border: none; color: #f5f0e8; font-size: 2rem; cursor: pointer;
  }

  .ot-hero {
    min-height: 100vh;
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: center;
    padding: 0 8vw;
    gap: 6vw;
  }

  .ot-hero-text { display: flex; flex-direction: column; }
  .ot-hero-visual { display: flex; align-items: center; justify-content: center; }

  .ot-hero-label {
    font-size: 0.75rem; letter-spacing: 0.2em;
    text-transform: uppercase; color: #2d8a6e;
    margin-bottom: 2rem;
    opacity: 0; animation: ot-fadeUp 1s ease-out 0.2s forwards;
  }

  .ot-hero h1 {
    font-family: 'DM Serif Display', serif;
    font-weight: 400;
    font-size: clamp(3rem, 7vw, 6rem);
    line-height: 1.05;
    letter-spacing: -0.03em;
    margin-bottom: 2rem;
    opacity: 0; animation: ot-fadeUp 1s ease-out 0.4s forwards;
  }

  .ot-hero p {
    font-size: clamp(1.05rem, 1.5vw, 1.25rem);
    line-height: 1.7; color: #7a8a82;
    max-width: 480px;
    opacity: 0; animation: ot-fadeUp 1s ease-out 0.7s forwards;
  }

  .ot-evolution {
    background: #f5f0e8;
    color: #0a1a14;
    padding: 0;
  }

  .ot-evo-phase {
    display: grid;
    grid-template-columns: 280px 1fr;
    min-height: 80vh;
    border-bottom: 1px solid rgba(10, 26, 20, 0.08);
  }

  .ot-evo-phase:last-child { border-bottom: none; }

  .ot-evo-left {
    padding: 8vh 4vw;
    display: flex; flex-direction: column;
    justify-content: center;
    border-right: 1px solid rgba(10, 26, 20, 0.08);
  }

  .ot-evo-time {
    font-family: 'DM Serif Display', serif;
    font-size: clamp(2.5rem, 4vw, 3.5rem);
    color: #0a1a14;
    margin-bottom: 0.5rem;
  }

  .ot-evo-period {
    font-size: 0.7rem; letter-spacing: 0.15em;
    text-transform: uppercase; color: #2d8a6e;
  }

  .ot-evo-right {
    padding: 8vh 5vw;
    display: grid;
    grid-template-columns: 1fr 160px;
    gap: 2rem;
    align-items: center;
  }

  .ot-evo-right-text { display: flex; flex-direction: column; gap: 2rem; }
  .ot-evo-embed { display: flex; flex-direction: column; align-items: center; gap: 0.5rem; }

  .ot-evo-headline {
    font-family: 'DM Serif Display', serif;
    font-size: clamp(1.5rem, 2.5vw, 2rem);
    font-weight: 400; line-height: 1.3;
    color: #0a1a14;
  }

  .ot-evo-details { display: flex; flex-direction: column; gap: 1rem; }

  .ot-evo-detail { display: flex; align-items: baseline; gap: 1rem; }

  .ot-evo-dot {
    width: 6px; height: 6px;
    background: #2d8a6e;
    border-radius: 50%;
    flex-shrink: 0;
    margin-top: 0.5rem;
  }

  .ot-evo-detail-text {
    font-size: 0.95rem; line-height: 1.6;
    color: #7a8a82;
  }

  .ot-result {
    background: #1a3a2a;
    color: #f5f0e8;
    padding: 15vh 8vw;
    display: flex; align-items: center;
    justify-content: center;
    text-align: center;
    min-height: 60vh;
  }

  .ot-result-content { max-width: 600px; }

  .ot-result h2 {
    font-family: 'DM Serif Display', serif;
    font-size: clamp(2rem, 3.5vw, 2.8rem);
    font-weight: 400; line-height: 1.25;
    margin-bottom: 2rem;
  }

  .ot-result p {
    font-size: clamp(1rem, 1.2vw, 1.1rem);
    line-height: 1.8;
    color: rgba(245, 240, 232, 0.6);
  }

  .ot-cta {
    min-height: 50vh;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    text-align: center; padding: 10vh 8vw;
    background: #0a1a14;
  }

  .ot-cta h2 {
    font-family: 'DM Serif Display', serif;
    font-size: clamp(2rem, 4vw, 3rem);
    font-weight: 400; line-height: 1.2;
    margin-bottom: 2.5rem;
  }

  .ot-cta-btn {
    display: inline-flex; align-items: center; gap: 0.75rem;
    background: #2d8a6e; color: #f5f0e8;
    padding: 1rem 2.5rem; border-radius: 50px;
    font-family: 'DM Sans', sans-serif; font-size: 0.95rem;
    font-weight: 400; text-decoration: none; cursor: pointer; border: none;
    transition: all 0.3s ease; letter-spacing: 0.02em;
  }

  .ot-cta-btn:hover { background: #35a080; transform: translateY(-2px); }
  .ot-cta-btn svg { width: 16px; height: 16px; transition: transform 0.3s ease; }
  .ot-cta-btn:hover svg { transform: translateX(3px); }

  .ot-footer {
    padding: 3rem 8vw;
    display: flex; justify-content: space-between; align-items: center;
    font-size: 0.8rem; color: #7a8a82;
    border-top: 1px solid rgba(245, 240, 232, 0.08);
  }

  .ot-footer .ot-logo { font-size: 1rem; }
  .ot-footer .ot-logo-pill { width: 22px; height: 11px; border-radius: 6px; }

  @keyframes ot-fadeUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .ot-reveal {
    opacity: 0; transform: translateY(40px);
    transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .ot-reveal.ot-visible { opacity: 1; transform: translateY(0); }

  @media (max-width: 768px) {
    .ot-nav { padding: 1.5rem 2rem; }
    .ot-nav-links { display: none; }
    .ot-hamburger { display: flex; }
    .ot-hero { grid-template-columns: 1fr; padding-top: 8rem; padding-bottom: 4rem; }
    .ot-hero-visual { justify-content: flex-start; }
    .ot-evo-phase { grid-template-columns: 1fr; min-height: auto; }
    .ot-evo-left { border-right: none; border-bottom: 1px solid rgba(10, 26, 20, 0.08); padding: 4vh 6vw 2vh; }
    .ot-evo-right { grid-template-columns: 1fr; padding: 2vh 6vw 6vh; }
    .ot-evo-embed { align-items: flex-start; flex-direction: row; gap: 1rem; }
  }
`;

const phases = [
  {
    time: "Week 1", period: "The audit",
    headline: "Every active deal gets run through the drvrs lens.",
    details: [
      "Which deals are attached to real organizational forces?",
      "Which ones are floating on hope?",
      "Where are the gaps in what the team actually knows?",
    ],
    embedLevel: 1, embedLabel: "Observing"
  },
  {
    time: "Month 1", period: "The shift",
    headline: "Deal reviews stop being storytelling sessions.",
    details: [
      "Reps start asking different questions on calls.",
      "Pipeline starts reflecting reality instead of optimism.",
      "The team develops a shared language for what's actually happening.",
    ],
    embedLevel: 2, embedLabel: "Shaping"
  },
  {
    time: "Month 3", period: "The muscle",
    headline: "The team can diagnose a deal without prompting.",
    details: [
      "Forecasts get honest.",
      "Surprises drop.",
      "Reps know when to walk away and when to push.",
    ],
    embedLevel: 3, embedLabel: "Embedded"
  },
  {
    time: "Month 6", period: "The handoff",
    headline: "drvrs becomes how the team thinks. Not something someone taught them.",
    details: [
      "New hires learn the diagnostic language from day one.",
      "Deal reviews run themselves.",
      "The framework is embedded. You don't need us anymore.",
    ],
    embedLevel: 4, embedLabel: "Autonomous"
  },
];

/* Hero visual — a "brain" being embedded into an org structure */
function EmbedVisual() {
  return (
    <svg viewBox="0 0 300 320" fill="none" style={{ width: "100%", maxWidth: 340 }}>
      <defs>
        <radialGradient id="ev-glow" cx="50%" cy="45%" r="50%">
          <stop offset="0%" stopColor="#2d8a6e" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#2d8a6e" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="150" cy="140" r="110" fill="url(#ev-glow)" />

      {/* Org chart — three layers of boxes */}
      {/* Top (CEO) */}
      <rect x="110" y="20" width="80" height="32" rx="3" fill="none" stroke="rgba(245,240,232,0.12)" strokeWidth="1" />
      <line x1="150" y1="52" x2="150" y2="70" stroke="rgba(245,240,232,0.1)" strokeWidth="1" />

      {/* Mid row */}
      {[60, 150, 240].map((x, i) => (
        <g key={i}>
          <rect x={x - 30} y="70" width="60" height="28" rx="3"
            fill={i === 1 ? "rgba(45,138,110,0.12)" : "none"}
            stroke={i === 1 ? "rgba(45,138,110,0.4)" : "rgba(245,240,232,0.1)"}
            strokeWidth="1" />
          {i !== 1 && <line x1={x} y1="98" x2={x} y2="116" stroke="rgba(245,240,232,0.08)" strokeWidth="1" />}
        </g>
      ))}
      {/* Connector lines from top to mid */}
      <line x1="90" y1="70" x2="150" y2="52" stroke="rgba(245,240,232,0.08)" strokeWidth="1" />
      <line x1="270" y1="70" x2="150" y2="52" stroke="rgba(245,240,232,0.08)" strokeWidth="1" />

      {/* drvrs center node */}
      <circle cx="150" cy="84" r="10" fill="rgba(45,138,110,0.3)" stroke="rgba(45,138,110,0.6)" strokeWidth="1" />
      <text x="150" y="88" textAnchor="middle" fill="rgba(45,138,110,0.9)" fontSize="7" fontFamily="DM Sans" letterSpacing="0.05em">d</text>

      {/* Pulsing rings */}
      <circle cx="150" cy="84" r="18" fill="none" stroke="rgba(45,138,110,0.15)" strokeWidth="1" strokeDasharray="3 4" />
      <circle cx="150" cy="84" r="28" fill="none" stroke="rgba(45,138,110,0.07)" strokeWidth="1" strokeDasharray="2 6" />

      {/* Deal flow — horizontal lanes */}
      <text x="24" y="148" fill="rgba(245,240,232,0.18)" fontSize="7" fontFamily="DM Sans" letterSpacing="0.12em">DEAL FLOW</text>
      {[160, 178, 196, 214].map((y, i) => {
        const barWidth = [140, 100, 180, 70][i];
        const opacity = [0.18, 0.12, 0.22, 0.1][i];
        const accent = i === 2;
        return (
          <g key={i}>
            <rect x="24" y={y} width={barWidth} height="10" rx="2"
              fill={accent ? "rgba(45,138,110,0.18)" : `rgba(245,240,232,${opacity})`}
              stroke={accent ? "rgba(45,138,110,0.3)" : "none"} />
            {accent && (
              <circle cx={24 + barWidth + 8} cy={y + 5} r="4"
                fill="none" stroke="rgba(45,138,110,0.5)" strokeWidth="1" />
            )}
          </g>
        );
      })}

      {/* Diagnostic tag on accent row */}
      <rect x="212" y="192" width="60" height="16" rx="8"
        fill="none" stroke="rgba(45,138,110,0.3)" strokeWidth="1" />
      <text x="242" y="204" textAnchor="middle" fill="rgba(45,138,110,0.6)" fontSize="7" fontFamily="DM Sans" letterSpacing="0.1em">FLAGGED</text>

      {/* Signal lines from drvrs node down to deal rows */}
      <line x1="150" y1="112" x2="150" y2="158" stroke="rgba(45,138,110,0.15)" strokeWidth="1" strokeDasharray="3 4" />
      <line x1="150" y1="158" x2="114" y2="164" stroke="rgba(45,138,110,0.1)" strokeWidth="1" />
      <line x1="150" y1="158" x2="114" y2="201" stroke="rgba(45,138,110,0.1)" strokeWidth="1" />

      {/* Bottom label */}
      <text x="150" y="280" textAnchor="middle" fill="rgba(245,240,232,0.04)" fontSize="42"
        fontFamily="DM Serif Display, serif" fontStyle="italic" letterSpacing="-0.03em">embedded.</text>
    </svg>
  );
}

/* Per-phase embed depth bar */
function EmbedDepth({ level, label }) {
  // level 1–4
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.4rem" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
        {[4, 3, 2, 1].map(l => (
          <div key={l} style={{
            width: "28px", height: "6px", borderRadius: "2px",
            background: l <= level ? "rgba(45,138,110,0.7)" : "rgba(245,240,232,0.08)",
            transition: "background 0.3s"
          }} />
        ))}
      </div>
      <div style={{
        fontSize: "0.6rem", letterSpacing: "0.12em", textTransform: "uppercase",
        color: "rgba(45,138,110,0.5)", textAlign: "center"
      }}>{label}</div>
    </div>
  );
}

function Reveal({ children, className = "" }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={ref} className={`ot-reveal ${visible ? "ot-visible" : ""} ${className}`}>
      {children}
    </div>
  );
}

export default function OneTeam() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <>
      <style>{styles}</style>
      <div className="ot">
        <nav className="ot-nav">
          <a className="ot-logo" href="/"><div className="ot-logo-pill" /> drvrs</a>
          <div className="ot-nav-links">
            <a href="/OneDay">One Day</a>
            <a href="/OneInitiative">One Initiative</a>
            <a href="/OneTeam" className="ot-active">One Team</a>
          </div>
          {!menuOpen && (
            <button className="ot-hamburger" onClick={() => setMenuOpen(true)}>
              <span /><span /><span />
            </button>
          )}
        </nav>
        <div className={`ot-mobile-menu ${menuOpen ? "open" : ""}`}>
          <button className="ot-mobile-close" onClick={() => setMenuOpen(false)}>✕</button>
          <a href="/OneDay" onClick={() => setMenuOpen(false)}>One Day</a>
          <a href="/OneInitiative" onClick={() => setMenuOpen(false)}>One Initiative</a>
          <a href="/OneTeam" onClick={() => setMenuOpen(false)}>One Team</a>
        </div>

        <section className="ot-hero">
          <div className="ot-hero-text">
            <div className="ot-hero-label">Fractional Leadership</div>
            <h1>One Team.</h1>
            <p>Not a workshop. Not a consultant on the sideline. A diagnostic brain embedded in how your team operates.</p>
          </div>
          <div className="ot-hero-visual">
            <EmbedVisual />
          </div>
        </section>

        <section className="ot-evolution">
          {phases.map((phase, i) => (
            <Reveal key={i}>
              <div className="ot-evo-phase">
                <div className="ot-evo-left">
                  <div className="ot-evo-time">{phase.time}</div>
                  <div className="ot-evo-period">{phase.period}</div>
                </div>
                <div className="ot-evo-right">
                  <div className="ot-evo-right-text">
                    <div className="ot-evo-headline">{phase.headline}</div>
                    <div className="ot-evo-details">
                      {phase.details.map((d, j) => (
                        <div className="ot-evo-detail" key={j}>
                          <div className="ot-evo-dot" />
                          <div className="ot-evo-detail-text">{d}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="ot-evo-embed">
                    <EmbedDepth level={phase.embedLevel} label={phase.embedLabel} />
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </section>

        <Reveal>
          <section className="ot-result">
            <div className="ot-result-content">
              <h2>The goal isn't to stay. The goal is to leave something behind that works without us.</h2>
              <p>A team that sees deals differently. A process that surfaces truth instead of stories. A language that makes the invisible visible.</p>
            </div>
          </section>
        </Reveal>

        <section className="ot-cta">
          <Reveal><h2>Ready to change how your team sees deals?</h2></Reveal>
          <Reveal>
            <a className="ot-cta-btn" href="https://tally.so/r/VLPjKa" target="_blank" rel="noopener noreferrer">
              Let's talk
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </a>
          </Reveal>
        </section>

        <footer className="ot-footer">
          <a className="ot-logo" href="/"><div className="ot-logo-pill" /> drvrs</a>
          <span>&copy; 2026</span>
        </footer>
      </div>
    </>
  );
}