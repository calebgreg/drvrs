import { useState, useEffect, useRef } from "react";

const CTA_URL = "https://tally.so/r/VLPjKa";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Mono:wght@300;400&display=swap');

  .ot * { margin: 0; padding: 0; box-sizing: border-box; }
  .ot {
    --ink: #0a1a14; --panel: #10251c; --cream: #f5f0e8; --accent: #2d8a6e; --accent-hi: #3fae8b; --muted: #7a8a82;
    background: var(--ink); color: var(--cream);
    font-family: 'DM Sans', sans-serif; font-weight: 300;
    -webkit-font-smoothing: antialiased; overflow-x: clip; min-height: 100vh;
  }
  .ot-nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    padding: 2rem 3rem; display: flex; justify-content: space-between; align-items: center;
    mix-blend-mode: difference;
  }
  .ot-logo { display: flex; align-items: center; gap: 0.6rem; font-size: 1.2rem; font-weight: 400; letter-spacing: 0.05em; color: #f5f0e8; text-decoration: none; }
  .ot-logo-pill { width: 28px; height: 14px; background: #f5f0e8; border-radius: 7px; }
  .ot-nav-links { display: flex; gap: 2.5rem; align-items: center; }
  .ot-nav-links a { font-size: 0.85rem; font-weight: 400; letter-spacing: 0.08em; color: #f5f0e8; text-decoration: none; text-transform: uppercase; transition: opacity 0.3s; }
  .ot-nav-links a:hover { opacity: 0.6; }
  .ot-nav-links a.ot-active { opacity: 0.5; }
  .ot-hamburger { display: none; flex-direction: column; gap: 5px; cursor: pointer; background: none; border: none; padding: 4px; }
  .ot-hamburger span { display: block; width: 22px; height: 1.5px; background: #f5f0e8; }
  .ot-mobile-menu { display: none; position: fixed; inset: 0; background: var(--ink); z-index: 200; flex-direction: column; align-items: center; justify-content: center; gap: 2.5rem; }
  .ot-mobile-menu.open { display: flex; }
  .ot-mobile-menu a { font-size: 1.5rem; font-weight: 400; letter-spacing: 0.08em; color: #f5f0e8; text-decoration: none; text-transform: uppercase; }
  .ot-mobile-close { position: absolute; top: 2rem; right: 2rem; background: none; border: none; color: #f5f0e8; font-size: 2rem; cursor: pointer; }

  .serif { font-family: 'DM Serif Display', serif; font-weight: 400; }
  .eyebrow { font-family: 'DM Mono', monospace; font-size: 0.65rem; letter-spacing: 0.22em; text-transform: uppercase; color: var(--accent); margin-bottom: 1.5rem; }

  .fi { opacity: 0; transform: translateY(24px); transition: opacity 0.9s cubic-bezier(0.16,1,0.3,1), transform 0.9s cubic-bezier(0.16,1,0.3,1); }
  .fi.on { opacity: 1; transform: translateY(0); }
  .fi.d1 { transition-delay: 0.1s; } .fi.d2 { transition-delay: 0.2s; } .fi.d3 { transition-delay: 0.3s; }

  .hero {
    min-height: 78vh; display: flex; flex-direction: column; justify-content: center;
    padding: 16vh 8vw 8vh; position: relative; overflow: clip;
  }
  .hero-glow { position: absolute; left: 50%; top: 40%; transform: translate(-50%,-50%); width: 70vw; height: 70vh; background: radial-gradient(ellipse at center, rgba(45,138,110,0.1) 0%, transparent 65%); pointer-events: none; }
  .hero h1 { font-family: 'DM Serif Display', serif; font-weight: 400; font-size: clamp(3rem, 8vw, 6.5rem); line-height: 0.98; letter-spacing: -0.035em; animation: otIn 1s cubic-bezier(0.16,1,0.3,1) 0.2s both; }
  .hero h1 em { font-style: italic; color: var(--accent-hi); }
  .hero-sub { font-size: clamp(1rem, 1.4vw, 1.2rem); line-height: 1.7; color: var(--muted); max-width: 480px; margin-top: 1.75rem; animation: otIn 1s cubic-bezier(0.16,1,0.3,1) 0.45s both; }
  .hero-ctas { margin-top: 2.75rem; animation: otIn 1s cubic-bezier(0.16,1,0.3,1) 0.65s both; }

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

  /* CADENCE */
  .cad { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.25rem; max-width: 1020px; margin: 0 auto; }
  .cad-card {
    background: var(--panel); border: 1px solid rgba(245,240,232,0.07); border-radius: 18px;
    padding: 2.5rem 2rem; display: flex; flex-direction: column; gap: 1rem;
    position: relative; overflow: hidden;
  }
  .cad-tag { font-family: 'DM Mono', monospace; font-size: 0.62rem; letter-spacing: 0.25em; text-transform: uppercase; color: var(--accent-hi); }
  .cad-title { font-family: 'DM Serif Display', serif; font-size: clamp(1.35rem, 2.1vw, 1.75rem); line-height: 1.15; }
  .cad-line { font-size: 0.92rem; line-height: 1.7; color: var(--muted); }

  .pulse-wrap { position: relative; width: 88px; height: 88px; margin-bottom: 0.25rem; }
  .pulse-ring { position: absolute; left: 50%; top: 50%; transform: translate(-50%,-50%); border-radius: 50%; border: 1px solid rgba(45,138,110,0.4); }
  .pulse-core { position: absolute; left: 50%; top: 50%; transform: translate(-50%,-50%); width: 10px; height: 10px; border-radius: 50%; background: #3fae8b; }
  .pr1 { width: 32px; height: 32px; animation: otRing 3s ease-out infinite; }
  .pr2 { width: 32px; height: 32px; animation: otRing 3s ease-out 1s infinite; }
  .pr3 { width: 32px; height: 32px; animation: otRing 3s ease-out 2s infinite; }

  .walkaway { text-align: center; max-width: 620px; margin: 0 auto; }
  .walkaway h2 { font-family: 'DM Serif Display', serif; font-weight: 400; font-size: clamp(2rem, 4.5vw, 3.4rem); line-height: 1.1; letter-spacing: -0.025em; }
  .walkaway p { margin-top: 1.5rem; color: var(--muted); font-size: clamp(0.98rem, 1.3vw, 1.1rem); line-height: 1.75; }

  .ot-footer { padding: 2.5rem 8vw; display: flex; justify-content: space-between; align-items: center; font-size: 0.75rem; color: rgba(122,138,130,0.5); border-top: 1px solid rgba(245,240,232,0.06); }
  .ot-footer .ot-logo { font-size: 0.95rem; opacity: 0.5; }
  .ot-footer .ot-logo-pill { width: 20px; height: 10px; }

  @keyframes otIn { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes otRing { 0% { width: 24px; height: 24px; opacity: 0.9; } 100% { width: 88px; height: 88px; opacity: 0; } }

  @media (max-width: 768px) {
    .ot-nav { padding: 1.5rem 2rem; }
    .ot-nav-links { display: none; }
    .ot-hamburger { display: flex; }
    .hero { padding: 14vh 6vw 8vh; }
    .sec { padding: 9vh 6vw; }
    .cad { grid-template-columns: 1fr; }
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

function Pulse() {
  return (
    <div className="pulse-wrap">
      <div className="pulse-ring pr1" />
      <div className="pulse-ring pr2" />
      <div className="pulse-ring pr3" />
      <div className="pulse-core" />
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
          <button className="ot-hamburger" onClick={() => setMenuOpen(true)} aria-label="Open menu"><span /><span /><span /></button>
        </nav>
        <div className={`ot-mobile-menu${menuOpen ? " open" : ""}`}>
          <button className="ot-mobile-close" onClick={() => setMenuOpen(false)} aria-label="Close menu">×</button>
          <a href="/OneDay" onClick={() => setMenuOpen(false)}>One Day</a>
          <a href="/OneInitiative" onClick={() => setMenuOpen(false)}>One Initiative</a>
          <a href="/OneTeam" onClick={() => setMenuOpen(false)}>One Team</a>
        </div>

        {/* HERO */}
        <section className="hero">
          <div className="hero-glow" />
          <div className="eyebrow" style={{ animation: "otIn 1s cubic-bezier(0.16,1,0.3,1) 0.05s both" }}>One Team</div>
          <h1>A drvr,<br /><em>inside your team.</em></h1>
          <p className="hero-sub">
            Fractional and embedded. I work your deals, your numbers, and your rooms until the diagnostic way of seeing is just how your team thinks.
          </p>
          <div className="hero-ctas">
            <a className="cta-btn" href={CTA_URL} target="_blank" rel="noopener noreferrer">
              Let's talk fit
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </a>
          </div>
        </section>

        {/* CADENCE */}
        <section className="sec" style={{ paddingTop: "4vh" }}>
          <F style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <div className="eyebrow">The cadence</div>
            <h2 className="serif" style={{ fontSize: "clamp(1.9rem, 3.6vw, 3rem)", lineHeight: 1.12 }}>Where I show up.</h2>
          </F>
          <div className="cad">
            <F delay="d1">
              <div className="cad-card">
                <Pulse />
                <div className="cad-tag">In the deals</div>
                <div className="cad-title serif">Weekly</div>
                <div className="cad-line">Live reads on active accounts. Who cares, what's in the way, what we work next.</div>
              </div>
            </F>
            <F delay="d2">
              <div className="cad-card">
                <Pulse />
                <div className="cad-tag">In the numbers</div>
                <div className="cad-title serif">Monthly</div>
                <div className="cad-line">The revenue system, decomposed. Where the constraint is binding and where effort is leaking.</div>
              </div>
            </F>
            <F delay="d3">
              <div className="cad-card">
                <Pulse />
                <div className="cad-tag">In the room</div>
                <div className="cad-title serif">When it counts</div>
                <div className="cad-line">The big deal, the board prep, the hard call. A second brain that has seen this before.</div>
              </div>
            </F>
          </div>
        </section>

        {/* WALKAWAY + CTA */}
        <section className="sec" style={{ padding: "16vh 8vw", background: "var(--panel)" }}>
          <F className="walkaway">
            <div className="eyebrow" style={{ textAlign: "center" }}>The goal</div>
            <h2>Eventually you won't need me.</h2>
            <p>The engagement works when the lens becomes yours. I build toward my own exit from day one.</p>
            <div style={{ marginTop: "2.5rem" }}>
              <a className="cta-btn" href={CTA_URL} target="_blank" rel="noopener noreferrer">
                Tag me in
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </a>
            </div>
          </F>
        </section>

        <footer className="ot-footer">
          <a className="ot-logo" href="/"><div className="ot-logo-pill" /> drvrs</a>
          <span style={{ fontSize: "0.65rem", letterSpacing: "0.08em" }}>&copy; 2026</span>
        </footer>

      </div>
    </>
  );
}
