import { useState, useEffect, useRef } from "react";

const CTA_URL = "https://tally.so/r/VLPjKa";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Mono:wght@300;400&display=swap');

  .oi * { margin: 0; padding: 0; box-sizing: border-box; }
  .oi {
    --ink: #0a1a14; --panel: #10251c; --cream: #f5f0e8; --accent: #2d8a6e; --accent-hi: #3fae8b; --muted: #7a8a82;
    background: var(--ink); color: var(--cream);
    font-family: 'DM Sans', sans-serif; font-weight: 300;
    -webkit-font-smoothing: antialiased; overflow-x: clip; min-height: 100vh;
  }
  .oi-nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    padding: 2rem 3rem; display: flex; justify-content: space-between; align-items: center;
    mix-blend-mode: difference;
  }
  .oi-logo { display: flex; align-items: center; gap: 0.6rem; font-size: 1.2rem; font-weight: 400; letter-spacing: 0.05em; color: #f5f0e8; text-decoration: none; }
  .oi-logo-pill { width: 28px; height: 14px; background: #f5f0e8; border-radius: 7px; }
  .oi-nav-links { display: flex; gap: 2.5rem; align-items: center; }
  .oi-nav-links a { font-size: 0.85rem; font-weight: 400; letter-spacing: 0.08em; color: #f5f0e8; text-decoration: none; text-transform: uppercase; transition: opacity 0.3s; }
  .oi-nav-links a:hover { opacity: 0.6; }
  .oi-nav-links a.oi-active { opacity: 0.5; }
  .oi-hamburger { display: none; flex-direction: column; gap: 5px; cursor: pointer; background: none; border: none; padding: 4px; }
  .oi-hamburger span { display: block; width: 22px; height: 1.5px; background: #f5f0e8; }
  .oi-mobile-menu { display: none; position: fixed; inset: 0; background: var(--ink); z-index: 200; flex-direction: column; align-items: center; justify-content: center; gap: 2.5rem; }
  .oi-mobile-menu.open { display: flex; }
  .oi-mobile-menu a { font-size: 1.5rem; font-weight: 400; letter-spacing: 0.08em; color: #f5f0e8; text-decoration: none; text-transform: uppercase; }
  .oi-mobile-close { position: absolute; top: 2rem; right: 2rem; background: none; border: none; color: #f5f0e8; font-size: 2rem; cursor: pointer; }

  .serif { font-family: 'DM Serif Display', serif; font-weight: 400; }
  .eyebrow { font-family: 'DM Mono', monospace; font-size: 0.65rem; letter-spacing: 0.22em; text-transform: uppercase; color: var(--accent); margin-bottom: 1.5rem; }

  .fi { opacity: 0; transform: translateY(24px); transition: opacity 0.9s cubic-bezier(0.16,1,0.3,1), transform 0.9s cubic-bezier(0.16,1,0.3,1); }
  .fi.on { opacity: 1; transform: translateY(0); }
  .fi.d1 { transition-delay: 0.1s; } .fi.d2 { transition-delay: 0.2s; } .fi.d3 { transition-delay: 0.3s; }

  .hero {
    min-height: 78vh; display: flex; flex-direction: column; justify-content: center;
    padding: 16vh 8vw 8vh; position: relative; overflow: clip;
  }
  .hero-glow { position: absolute; right: -15vw; top: 10%; width: 60vw; height: 70vh; background: radial-gradient(ellipse at center, rgba(45,138,110,0.11) 0%, transparent 65%); pointer-events: none; }
  .hero h1 { font-family: 'DM Serif Display', serif; font-weight: 400; font-size: clamp(3rem, 8vw, 6.5rem); line-height: 0.98; letter-spacing: -0.035em; animation: oiIn 1s cubic-bezier(0.16,1,0.3,1) 0.2s both; }
  .hero h1 em { font-style: italic; color: var(--accent-hi); }
  .hero-sub { font-size: clamp(1rem, 1.4vw, 1.2rem); line-height: 1.7; color: var(--muted); max-width: 480px; margin-top: 1.75rem; animation: oiIn 1s cubic-bezier(0.16,1,0.3,1) 0.45s both; }
  .hero-ctas { margin-top: 2.75rem; animation: oiIn 1s cubic-bezier(0.16,1,0.3,1) 0.65s both; }

  .cta-btn {
    display: inline-flex; align-items: center; gap: 0.75rem;
    background: var(--accent); color: var(--cream);
    padding: 1rem 2.4rem; border-radius: 50px;
    font-size: 0.9rem; text-decoration: none; cursor: pointer; border: none;
    transition: all 0.3s; letter-spacing: 0.05em;
  }
  .cta-btn:hover { background: var(--accent-hi); transform: translateY(-2px); }
  .cta-btn svg { width: 15px; height: 15px; }

  .sec { padding: 12vh 8vw; }

  /* PLAY STEPS */
  .play { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.25rem; max-width: 1020px; margin: 0 auto; }
  .play-card {
    background: var(--panel); border: 1px solid rgba(245,240,232,0.07); border-radius: 18px;
    padding: 2.5rem 2rem; display: flex; flex-direction: column; gap: 1rem;
  }
  .play-tag { font-family: 'DM Mono', monospace; font-size: 0.62rem; letter-spacing: 0.25em; text-transform: uppercase; color: var(--accent-hi); }
  .play-title { font-family: 'DM Serif Display', serif; font-size: clamp(1.35rem, 2.1vw, 1.75rem); line-height: 1.15; }
  .play-line { font-size: 0.92rem; line-height: 1.7; color: var(--muted); }
  .play-vis { height: 64px; display: flex; align-items: center; }

  .walkaway { text-align: center; max-width: 620px; margin: 0 auto; }
  .walkaway h2 { font-family: 'DM Serif Display', serif; font-weight: 400; font-size: clamp(2rem, 4.5vw, 3.4rem); line-height: 1.1; letter-spacing: -0.025em; }
  .walkaway p { margin-top: 1.5rem; color: var(--muted); font-size: clamp(0.98rem, 1.3vw, 1.1rem); line-height: 1.75; }

  .oi-footer { padding: 2.5rem 8vw; display: flex; justify-content: space-between; align-items: center; font-size: 0.75rem; color: rgba(122,138,130,0.5); border-top: 1px solid rgba(245,240,232,0.06); }
  .oi-footer .oi-logo { font-size: 0.95rem; opacity: 0.5; }
  .oi-footer .oi-logo-pill { width: 20px; height: 10px; }

  @keyframes oiIn { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes oiPulse { 0%, 100% { opacity: 0.35; } 50% { opacity: 0.9; } }

  @media (max-width: 768px) {
    .oi-nav { padding: 1.5rem 2rem; }
    .oi-nav-links { display: none; }
    .oi-hamburger { display: flex; }
    .hero { padding: 14vh 6vw 8vh; }
    .sec { padding: 9vh 6vw; }
    .play { grid-template-columns: 1fr; }
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

function VisFind() {
  return (
    <svg width="150" height="56" viewBox="0 0 150 56">
      {[0, 1, 2, 3].map(i => (
        <rect key={i} x="0" y={i * 14} width={[110, 58, 86, 42][i]} height="8" rx="4"
          fill={i === 1 ? "#2d8a6e" : "rgba(245,240,232,0.08)"}
          style={i === 1 ? { animation: "oiPulse 2.2s ease-in-out infinite" } : {}} />
      ))}
      <circle cx="70" cy="18" r="13" fill="none" stroke="#3fae8b" strokeWidth="1.5" />
      <line x1="80" y1="28" x2="90" y2="38" stroke="#3fae8b" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
function VisName() {
  return (
    <svg width="150" height="56" viewBox="0 0 150 56">
      <line x1="10" y1="44" x2="120" y2="16" stroke="#2d8a6e" strokeWidth="3" strokeLinecap="round" />
      <polygon points="98,36 112,30 106,44" fill="rgba(45,138,110,0.5)" />
      <circle cx="88" cy="38" r="5" fill="#3fae8b" />
      <rect x="118" y="6" width="22" height="18" rx="3" fill="rgba(245,240,232,0.08)" />
    </svg>
  );
}
function VisRun() {
  return (
    <svg width="150" height="56" viewBox="0 0 150 56">
      {[0, 1, 2].map(i => (
        <g key={i}>
          <line x1={12 + i * 46} y1="28" x2={44 + i * 46} y2="28" stroke={i < 2 ? "#2d8a6e" : "rgba(45,138,110,0.3)"} strokeWidth="1.5" strokeDasharray={i === 2 ? "4 5" : "none"} />
          <circle cx={12 + i * 46} cy="28" r="5" fill={i === 0 ? "#3fae8b" : "rgba(45,138,110,0.6)"} />
        </g>
      ))}
      <circle cx="150" cy="28" r="5" fill="none" stroke="#3fae8b" strokeWidth="1.5" transform="translate(-8,0)" />
    </svg>
  );
}

export default function OneInitiative() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <style>{styles}</style>
      <div className="oi">

        <nav className="oi-nav">
          <a className="oi-logo" href="/"><div className="oi-logo-pill" /> drvrs</a>
          <div className="oi-nav-links">
            <a href="/OneDay">One Day</a>
            <a href="/OneInitiative" className="oi-active">One Initiative</a>
            <a href="/OneTeam">One Team</a>
          </div>
          <button className="oi-hamburger" onClick={() => setMenuOpen(true)} aria-label="Open menu"><span /><span /><span /></button>
        </nav>
        <div className={`oi-mobile-menu${menuOpen ? " open" : ""}`}>
          <button className="oi-mobile-close" onClick={() => setMenuOpen(false)} aria-label="Close menu">×</button>
          <a href="/OneDay" onClick={() => setMenuOpen(false)}>One Day</a>
          <a href="/OneInitiative" onClick={() => setMenuOpen(false)}>One Initiative</a>
          <a href="/OneTeam" onClick={() => setMenuOpen(false)}>One Team</a>
        </div>

        {/* HERO */}
        <section className="hero">
          <div className="hero-glow" />
          <div className="eyebrow" style={{ animation: "oiIn 1s cubic-bezier(0.16,1,0.3,1) 0.05s both" }}>One Initiative</div>
          <h1>You have a stuck thing.<br /><em>Bring it.</em></h1>
          <p className="hero-sub">
            A launch that stalled. A segment that won't convert. A pipeline that looks full and closes empty. I embed on that one thing until it moves.
          </p>
          <div className="hero-ctas">
            <a className="cta-btn" href={CTA_URL} target="_blank" rel="noopener noreferrer">
              Bring the stuck thing
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </a>
          </div>
        </section>

        {/* THE PLAY */}
        <section className="sec" style={{ paddingTop: "4vh" }}>
          <F style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <div className="eyebrow">The play</div>
            <h2 className="serif" style={{ fontSize: "clamp(1.9rem, 3.6vw, 3rem)", lineHeight: 1.12 }}>Find it. Name it. Move it.</h2>
          </F>
          <div className="play">
            <F delay="d1">
              <div className="play-card">
                <div className="play-vis"><VisFind /></div>
                <div className="play-tag">01 · Find</div>
                <div className="play-title serif">The real constraint</div>
                <div className="play-line">Effort applied to the wrong constraint just costs more. We find the one that's actually binding.</div>
              </div>
            </F>
            <F delay="d2">
              <div className="play-card">
                <div className="play-vis"><VisName /></div>
                <div className="play-tag">02 · Name</div>
                <div className="play-title serif">The driver</div>
                <div className="play-line">The lever that moves it. Named plainly, so the whole team can push in the same direction.</div>
              </div>
            </F>
            <F delay="d3">
              <div className="play-card">
                <div className="play-vis"><VisRun /></div>
                <div className="play-tag">03 · Move</div>
                <div className="play-title serif">The plan</div>
                <div className="play-line">A sequence your team runs, with me in the room until it has momentum of its own.</div>
              </div>
            </F>
          </div>
        </section>

        {/* WALKAWAY + CTA */}
        <section className="sec" style={{ padding: "16vh 8vw", background: "var(--panel)" }}>
          <F className="walkaway">
            <div className="eyebrow" style={{ textAlign: "center" }}>What you keep</div>
            <h2>Movement, and the map that made it.</h2>
            <p>The initiative moves. Your team keeps the diagnosis, the plan, and the way of finding both next time.</p>
            <div style={{ marginTop: "2.5rem" }}>
              <a className="cta-btn" href={CTA_URL} target="_blank" rel="noopener noreferrer">
                Tag me in
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </a>
            </div>
          </F>
        </section>

        <footer className="oi-footer">
          <a className="oi-logo" href="/"><div className="oi-logo-pill" /> drvrs</a>
          <span style={{ fontSize: "0.65rem", letterSpacing: "0.08em" }}>&copy; 2026</span>
        </footer>

      </div>
    </>
  );
}
