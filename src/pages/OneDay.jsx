import { useState, useEffect, useRef } from "react";

const CTA_URL = "https://tally.so/r/VLPjKa";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Mono:wght@300;400&display=swap');

  .od * { margin: 0; padding: 0; box-sizing: border-box; }
  .od {
    --ink: #0a1a14; --panel: #10251c; --cream: #f5f0e8; --accent: #2d8a6e; --accent-hi: #3fae8b; --muted: #7a8a82;
    background: var(--ink); color: var(--cream);
    font-family: 'DM Sans', sans-serif; font-weight: 300;
    -webkit-font-smoothing: antialiased; overflow-x: clip; min-height: 100vh;
  }
  .od-nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    padding: 2rem 3rem; display: flex; justify-content: space-between; align-items: center;
    mix-blend-mode: difference;
  }
  .od-logo { display: flex; align-items: center; gap: 0.6rem; font-size: 1.2rem; font-weight: 400; letter-spacing: 0.05em; color: #f5f0e8; text-decoration: none; }
  .od-logo-pill { width: 28px; height: 14px; background: #f5f0e8; border-radius: 7px; }
  .od-nav-links { display: flex; gap: 2.5rem; align-items: center; }
  .od-nav-links a { font-size: 0.85rem; font-weight: 400; letter-spacing: 0.08em; color: #f5f0e8; text-decoration: none; text-transform: uppercase; transition: opacity 0.3s; }
  .od-nav-links a:hover { opacity: 0.6; }
  .od-nav-links a.od-active { opacity: 0.5; }
  .od-hamburger { display: none; flex-direction: column; gap: 5px; cursor: pointer; background: none; border: none; padding: 4px; }
  .od-hamburger span { display: block; width: 22px; height: 1.5px; background: #f5f0e8; }
  .od-mobile-menu { display: none; position: fixed; inset: 0; background: var(--ink); z-index: 200; flex-direction: column; align-items: center; justify-content: center; gap: 2.5rem; }
  .od-mobile-menu.open { display: flex; }
  .od-mobile-menu a { font-size: 1.5rem; font-weight: 400; letter-spacing: 0.08em; color: #f5f0e8; text-decoration: none; text-transform: uppercase; }
  .od-mobile-close { position: absolute; top: 2rem; right: 2rem; background: none; border: none; color: #f5f0e8; font-size: 2rem; cursor: pointer; }

  .serif { font-family: 'DM Serif Display', serif; font-weight: 400; }
  .eyebrow { font-family: 'DM Mono', monospace; font-size: 0.65rem; letter-spacing: 0.22em; text-transform: uppercase; color: var(--accent); margin-bottom: 1.5rem; }

  .fi { opacity: 0; transform: translateY(24px); transition: opacity 0.9s cubic-bezier(0.16,1,0.3,1), transform 0.9s cubic-bezier(0.16,1,0.3,1); }
  .fi.on { opacity: 1; transform: translateY(0); }
  .fi.d1 { transition-delay: 0.1s; } .fi.d2 { transition-delay: 0.2s; }

  .hero {
    min-height: 78vh; display: flex; flex-direction: column; justify-content: center;
    padding: 16vh 8vw 8vh; position: relative; overflow: clip;
  }
  .hero-glow { position: absolute; left: 50%; bottom: -30%; transform: translateX(-50%); width: 80vw; height: 70vh; background: radial-gradient(ellipse at center, rgba(45,138,110,0.12) 0%, transparent 65%); pointer-events: none; }
  .hero h1 { font-family: 'DM Serif Display', serif; font-weight: 400; font-size: clamp(3rem, 8vw, 6.5rem); line-height: 0.98; letter-spacing: -0.035em; animation: odIn 1s cubic-bezier(0.16,1,0.3,1) 0.2s both; }
  .hero h1 em { font-style: italic; color: var(--accent-hi); }
  .hero-sub { font-size: clamp(1rem, 1.4vw, 1.2rem); line-height: 1.7; color: var(--muted); max-width: 480px; margin-top: 1.75rem; animation: odIn 1s cubic-bezier(0.16,1,0.3,1) 0.45s both; }
  .hero-ctas { margin-top: 2.75rem; animation: odIn 1s cubic-bezier(0.16,1,0.3,1) 0.65s both; }

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

  /* AM / PM */
  .ampm { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; max-width: 980px; margin: 0 auto; }
  .ampm-card {
    background: var(--panel); border: 1px solid rgba(245,240,232,0.07); border-radius: 18px;
    padding: 2.5rem 2.25rem; display: flex; flex-direction: column; gap: 1rem;
    position: relative; overflow: hidden;
  }
  .ampm-tag { font-family: 'DM Mono', monospace; font-size: 0.62rem; letter-spacing: 0.25em; text-transform: uppercase; color: var(--accent-hi); }
  .ampm-title { font-family: 'DM Serif Display', serif; font-size: clamp(1.5rem, 2.4vw, 2rem); line-height: 1.15; }
  .ampm-line { font-size: 0.95rem; line-height: 1.7; color: var(--muted); max-width: 340px; }
  .ampm-arc { position: absolute; right: -30px; top: -30px; opacity: 0.5; pointer-events: none; }

  /* BEFORE / AFTER READ */
  .ba { max-width: 980px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; border: 1px solid rgba(10,26,20,0.12); border-radius: 18px; overflow: hidden; background: rgba(10,26,20,0.12); gap: 1px; }
  .ba-col { background: var(--cream); padding: 2.5rem 2.25rem; display: flex; flex-direction: column; gap: 1.25rem; }
  .ba-tag { font-family: 'DM Mono', monospace; font-size: 0.62rem; letter-spacing: 0.25em; text-transform: uppercase; }
  .ba-quote { font-family: 'DM Serif Display', serif; font-style: italic; font-size: clamp(1.15rem, 1.9vw, 1.5rem); line-height: 1.45; color: #0a1a14; }
  .ba-note { font-size: 0.85rem; line-height: 1.65; color: rgba(10,26,20,0.5); }

  .walkaway { text-align: center; max-width: 620px; margin: 0 auto; }
  .walkaway h2 { font-family: 'DM Serif Display', serif; font-weight: 400; font-size: clamp(2rem, 4.5vw, 3.4rem); line-height: 1.1; letter-spacing: -0.025em; }
  .walkaway p { margin-top: 1.5rem; color: var(--muted); font-size: clamp(0.98rem, 1.3vw, 1.1rem); line-height: 1.75; }

  .od-footer { padding: 2.5rem 8vw; display: flex; justify-content: space-between; align-items: center; font-size: 0.75rem; color: rgba(122,138,130,0.5); border-top: 1px solid rgba(245,240,232,0.06); }
  .od-footer .od-logo { font-size: 0.95rem; opacity: 0.5; }
  .od-footer .od-logo-pill { width: 20px; height: 10px; }

  @keyframes odIn { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: translateY(0); } }

  @media (max-width: 768px) {
    .od-nav { padding: 1.5rem 2rem; }
    .od-nav-links { display: none; }
    .od-hamburger { display: flex; }
    .hero { padding: 14vh 6vw 8vh; }
    .sec { padding: 9vh 6vw; }
    .ampm { grid-template-columns: 1fr; }
    .ba { grid-template-columns: 1fr; }
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

function SunArc({ pm }) {
  return (
    <svg className="ampm-arc" width="140" height="140" viewBox="0 0 140 140">
      <path d="M10,120 Q70,10 130,120" fill="none" stroke="rgba(45,138,110,0.35)" strokeWidth="1.5" strokeDasharray="4 6" />
      <circle cx={pm ? 108 : 32} cy={pm ? 78 : 78} r="9" fill="none" stroke="#3fae8b" strokeWidth="1.5" />
      <circle cx={pm ? 108 : 32} cy={pm ? 78 : 78} r="3" fill="#3fae8b" />
    </svg>
  );
}

export default function OneDay() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <style>{styles}</style>
      <div className="od">

        <nav className="od-nav">
          <a className="od-logo" href="/"><div className="od-logo-pill" /> drvrs</a>
          <div className="od-nav-links">
            <a href="/OneDay" className="od-active">One Day</a>
            <a href="/OneInitiative">One Initiative</a>
            <a href="/OneTeam">One Team</a>
          </div>
          <button className="od-hamburger" onClick={() => setMenuOpen(true)} aria-label="Open menu"><span /><span /><span /></button>
        </nav>
        <div className={`od-mobile-menu${menuOpen ? " open" : ""}`}>
          <button className="od-mobile-close" onClick={() => setMenuOpen(false)} aria-label="Close menu">×</button>
          <a href="/OneDay" onClick={() => setMenuOpen(false)}>One Day</a>
          <a href="/OneInitiative" onClick={() => setMenuOpen(false)}>One Initiative</a>
          <a href="/OneTeam" onClick={() => setMenuOpen(false)}>One Team</a>
        </div>

        {/* HERO */}
        <section className="hero">
          <div className="hero-glow" />
          <div className="eyebrow" style={{ animation: "odIn 1s cubic-bezier(0.16,1,0.3,1) 0.05s both" }}>One Day</div>
          <h1>One day.<br /><em>New eyes.</em></h1>
          <p className="hero-sub">
            I spend a day with your revenue team. Morning on the framework. Afternoon on your live deals. Nobody leaves seeing them the same way.
          </p>
          <div className="hero-ctas">
            <a className="cta-btn" href={CTA_URL} target="_blank" rel="noopener noreferrer">
              Book the day
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </a>
          </div>
        </section>

        {/* AM / PM */}
        <section className="sec" style={{ paddingTop: "4vh" }}>
          <F>
            <div className="ampm">
              <div className="ampm-card">
                <SunArc />
                <div className="ampm-tag">AM</div>
                <div className="ampm-title serif">The lens</div>
                <div className="ampm-line">The drvrs framework, applied to a real scenario. Who cares. What's in the way. Where deals actually die.</div>
              </div>
              <div className="ampm-card">
                <SunArc pm />
                <div className="ampm-tag">PM</div>
                <div className="ampm-title serif">Your deals</div>
                <div className="ampm-line">We run your live pipeline through the lens. Real accounts, real reads, in the room, together.</div>
              </div>
            </div>
          </F>
        </section>

        {/* BEFORE / AFTER */}
        <section className="sec" style={{ background: "var(--panel)" }}>
          <F style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <div className="eyebrow">The shift</div>
            <h2 className="serif" style={{ fontSize: "clamp(1.9rem, 3.6vw, 3rem)", lineHeight: 1.12 }}>Same deal. Different read.</h2>
          </F>
          <F delay="d1">
            <div className="ba">
              <div className="ba-col">
                <div className="ba-tag" style={{ color: "rgba(10,26,20,0.35)" }}>Before</div>
                <div className="ba-quote">"They love the demo. Waiting on legal. Should close this quarter."</div>
                <div className="ba-note">Hope, dressed up as a forecast.</div>
              </div>
              <div className="ba-col">
                <div className="ba-tag" style={{ color: "#2d8a6e" }}>After</div>
                <div className="ba-quote">"The VP's credibility is riding on this. Legal has 40 contracts queued. Here's who cares and here's the blocker we work first."</div>
                <div className="ba-note">A read you can act on.</div>
              </div>
            </div>
          </F>
        </section>

        {/* WALKAWAY + CTA */}
        <section className="sec" style={{ padding: "16vh 8vw" }}>
          <F className="walkaway">
            <div className="eyebrow" style={{ textAlign: "center" }}>What you keep</div>
            <h2>The lens stays after I leave.</h2>
            <p>Your team walks out with a shared language for reading deals and a fresh read on every account we touched.</p>
            <div style={{ marginTop: "2.5rem" }}>
              <a className="cta-btn" href={CTA_URL} target="_blank" rel="noopener noreferrer">
                Tag me in
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </a>
            </div>
          </F>
        </section>

        <footer className="od-footer">
          <a className="od-logo" href="/"><div className="od-logo-pill" /> drvrs</a>
          <span style={{ fontSize: "0.65rem", letterSpacing: "0.08em" }}>&copy; 2026</span>
        </footer>

      </div>
    </>
  );
}
