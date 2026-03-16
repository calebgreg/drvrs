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
  .od-logo {
    display: flex; align-items: center; gap: 0.6rem;
    font-family: 'DM Sans', sans-serif; font-size: 1.2rem;
    font-weight: 400; letter-spacing: 0.05em;
    color: #f5f0e8; text-decoration: none; cursor: pointer;
  }
  .od-logo-pill { width: 28px; height: 14px; background: #f5f0e8; border-radius: 7px; }
  .od-nav-links { display: flex; gap: 2.5rem; align-items: center; }
  .od-nav-links a {
    font-family: 'DM Sans', sans-serif; font-size: 0.85rem;
    font-weight: 400; letter-spacing: 0.08em;
    color: #f5f0e8; text-decoration: none;
    text-transform: uppercase; transition: opacity 0.3s ease;
  }
  .od-nav-links a:hover { opacity: 0.6; }
  .od-nav-links a.od-active { opacity: 0.5; }
  .od-hamburger {
    display: none; flex-direction: column; gap: 5px;
    cursor: pointer; background: none; border: none; padding: 4px;
  }
  .od-hamburger span { display: block; width: 22px; height: 1.5px; background: #f5f0e8; }
  .od-mobile-menu {
    display: none; position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: #0a1a14; z-index: 200;
    flex-direction: column; align-items: center; justify-content: center; gap: 2.5rem;
  }
  .od-mobile-menu.open { display: flex; }
  .od-mobile-menu a {
    font-family: 'DM Sans', sans-serif; font-size: 1.5rem;
    font-weight: 400; letter-spacing: 0.08em;
    color: #f5f0e8; text-decoration: none; text-transform: uppercase;
  }
  .od-mobile-close {
    position: absolute; top: 2rem; right: 2rem;
    background: none; border: none; color: #f5f0e8; font-size: 2rem; cursor: pointer;
  }

  /* HERO */
  .od-hero {
    min-height: 100vh;
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: center;
    padding: 0 8vw;
    gap: 4rem;
    position: relative;
    overflow: hidden;
  }
  .od-hero::before {
    content: '';
    position: absolute;
    top: -20%; right: -10%;
    width: 60vw; height: 60vw;
    background: radial-gradient(circle, rgba(45,138,110,0.08) 0%, transparent 70%);
    pointer-events: none;
  }
  .od-hero-text { position: relative; z-index: 2; }
  .od-hero-label {
    font-size: 0.75rem; letter-spacing: 0.2em;
    text-transform: uppercase; color: #2d8a6e;
    margin-bottom: 2rem;
    opacity: 0; animation: od-fadeUp 1s ease-out 0.2s forwards;
  }
  .od-hero h1 {
    font-family: 'DM Serif Display', serif;
    font-weight: 400;
    font-size: clamp(3.5rem, 7vw, 7rem);
    line-height: 1.0;
    letter-spacing: -0.03em;
    margin-bottom: 2rem;
    opacity: 0; animation: od-fadeUp 1s ease-out 0.4s forwards;
  }
  .od-hero-sub {
    font-size: clamp(1rem, 1.4vw, 1.2rem);
    line-height: 1.7; color: #7a8a82;
    max-width: 480px;
    opacity: 0; animation: od-fadeUp 1s ease-out 0.7s forwards;
  }
  .od-hero-visual {
    position: relative; z-index: 2;
    opacity: 0; animation: od-fadeUp 1s ease-out 0.9s forwards;
    display: flex; align-items: center; justify-content: center;
  }

  /* ARC VISUAL */
  .od-arc-svg { width: 100%; max-width: 440px; height: auto; }

  /* WHAT WE DIAL IN — full dark with large numbers */
  .od-three {
    padding: 15vh 8vw;
    background: #0a1a14;
  }
  .od-section-label {
    font-size: 0.75rem; letter-spacing: 0.2em;
    text-transform: uppercase; color: #2d8a6e;
    margin-bottom: 5rem;
  }
  .od-three-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2px;
  }
  .od-three-item {
    padding: 3rem 2.5rem 3rem 0;
    border-top: 1px solid rgba(245,240,232,0.1);
    position: relative;
  }
  .od-three-num {
    font-family: 'DM Serif Display', serif;
    font-size: 5rem;
    color: rgba(45,138,110,0.15);
    line-height: 1;
    margin-bottom: 1rem;
    letter-spacing: -0.05em;
  }
  .od-three-title {
    font-family: 'DM Serif Display', serif;
    font-size: clamp(1.4rem, 2vw, 1.8rem);
    color: #f5f0e8;
    margin-bottom: 1rem;
    line-height: 1.2;
  }
  .od-three-desc {
    font-size: 0.9rem; line-height: 1.7;
    color: #7a8a82; font-weight: 300;
  }

  /* TIMELINE — cream section */
  .od-timeline {
    padding: 15vh 8vw;
    background: #f5f0e8;
    color: #0a1a14;
  }
  .od-timeline .od-section-label { color: #2d8a6e; }
  .od-timeline-track {
    position: relative;
    padding-top: 3rem;
  }
  .od-timeline-line {
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: rgba(10,26,20,0.12);
  }
  .od-timeline-items {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 3rem;
  }
  .od-timeline-item { position: relative; }
  .od-timeline-dot {
    position: absolute;
    top: -3rem; left: 0;
    width: 8px; height: 8px;
    border-radius: 50%;
    background: #2d8a6e;
    transform: translateY(-50%);
    margin-top: 1px;
  }
  .od-timeline-time {
    font-family: 'DM Serif Display', serif;
    font-size: clamp(2.5rem, 4vw, 4rem);
    color: #0a1a14;
    line-height: 1;
    margin-bottom: 0.5rem;
    letter-spacing: -0.03em;
  }
  .od-timeline-period {
    font-size: 0.7rem; letter-spacing: 0.2em;
    text-transform: uppercase; color: #2d8a6e;
    margin-bottom: 1.5rem;
  }
  .od-timeline-desc {
    font-size: 0.9rem; line-height: 1.6;
    color: #4a5a52; font-weight: 300;
  }

  /* BEFORE / AFTER — full width split */
  .od-ba {
    display: grid;
    grid-template-columns: 1fr 1fr;
    min-height: 90vh;
  }
  .od-ba-panel {
    display: flex; flex-direction: column;
    justify-content: center;
    padding: 12vh 7vw;
  }
  .od-ba-before { background: #0d1f18; }
  .od-ba-after { background: #1a3a2a; }
  .od-ba-eyebrow {
    font-size: 0.7rem; letter-spacing: 0.2em;
    text-transform: uppercase; margin-bottom: 3rem;
    display: flex; align-items: center; gap: 0.75rem;
  }
  .od-ba-eyebrow-dot { width: 6px; height: 6px; border-radius: 50%; }
  .od-ba-before .od-ba-eyebrow { color: #7a8a82; }
  .od-ba-before .od-ba-eyebrow-dot { background: #7a8a82; }
  .od-ba-after .od-ba-eyebrow { color: #2d8a6e; }
  .od-ba-after .od-ba-eyebrow-dot { background: #2d8a6e; }
  .od-ba-item {
    font-family: 'DM Serif Display', serif;
    font-size: clamp(1rem, 1.5vw, 1.25rem);
    line-height: 1.45;
    padding: 1.5rem 0;
    border-bottom: 1px solid rgba(245,240,232,0.06);
  }
  .od-ba-before .od-ba-item { color: rgba(245,240,232,0.3); font-style: italic; }
  .od-ba-after .od-ba-item { color: #f5f0e8; }

  /* CTA */
  .od-cta {
    min-height: 50vh;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    text-align: center; padding: 15vh 8vw;
    background: #0a1a14;
    position: relative; overflow: hidden;
  }
  .od-cta::before {
    content: '';
    position: absolute;
    bottom: -20%; left: 50%;
    transform: translateX(-50%);
    width: 60vw; height: 60vw;
    background: radial-gradient(circle, rgba(45,138,110,0.07) 0%, transparent 70%);
    pointer-events: none;
  }
  .od-cta h2 {
    font-family: 'DM Serif Display', serif;
    font-size: clamp(2.5rem, 5vw, 4.5rem);
    font-weight: 400; line-height: 1.1;
    margin-bottom: 1rem; letter-spacing: -0.02em;
  }
  .od-cta-sub {
    font-size: 1rem; color: #7a8a82;
    margin-bottom: 3rem; max-width: 400px;
  }
  .od-cta-btn {
    display: inline-flex; align-items: center; gap: 0.75rem;
    background: #2d8a6e; color: #f5f0e8;
    padding: 1rem 2.5rem; border-radius: 50px;
    font-family: 'DM Sans', sans-serif; font-size: 0.95rem;
    font-weight: 400; text-decoration: none; cursor: pointer; border: none;
    transition: all 0.3s ease; letter-spacing: 0.02em; position: relative; z-index: 1;
  }
  .od-cta-btn:hover { background: #35a080; transform: translateY(-2px); }
  .od-cta-btn svg { width: 16px; height: 16px; transition: transform 0.3s ease; }
  .od-cta-btn:hover svg { transform: translateX(3px); }

  /* FOOTER */
  .od-footer {
    padding: 3rem 8vw;
    display: flex; justify-content: space-between; align-items: center;
    font-size: 0.8rem; color: #7a8a82;
    border-top: 1px solid rgba(245,240,232,0.08);
  }

  @keyframes od-fadeUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .od-reveal {
    opacity: 0; transform: translateY(40px);
    transition: all 0.9s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .od-reveal.od-visible { opacity: 1; transform: translateY(0); }

  @media (max-width: 768px) {
    .od-nav { padding: 1.5rem 2rem; }
    .od-nav-links { display: none; }
    .od-hamburger { display: flex; }
    .od-hero { grid-template-columns: 1fr; padding-top: 10rem; gap: 2rem; }
    .od-hero-visual { display: none; }
    .od-three-grid { grid-template-columns: 1fr; }
    .od-ba { grid-template-columns: 1fr; }
    .od-timeline-items { grid-template-columns: 1fr; gap: 4rem; }
  }
`;

function Reveal({ children, delay = 0 }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={`od-reveal ${visible ? "od-visible" : ""}`}
      style={{ transitionDelay: visible ? `${delay}ms` : "0ms" }}
    >
      {children}
    </div>
  );
}

/* Arc / Sun SVG visual for hero */
function ArcVisual() {
  return (
    <svg className="od-arc-svg" viewBox="0 0 440 400" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="arc-glow" cx="50%" cy="60%" r="50%">
          <stop offset="0%" stopColor="#2d8a6e" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#2d8a6e" stopOpacity="0" />
        </radialGradient>
        <filter id="arc-blur">
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>

      {/* Horizon line */}
      <line x1="40" y1="300" x2="400" y2="300" stroke="rgba(245,240,232,0.08)" strokeWidth="1" />

      {/* Ground glow */}
      <ellipse cx="220" cy="300" rx="160" ry="20" fill="url(#arc-glow)" filter="url(#arc-blur)" />

      {/* Arc path – sun's journey */}
      <path
        d="M 60 300 Q 220 60 380 300"
        stroke="rgba(45,138,110,0.25)"
        strokeWidth="1"
        strokeDasharray="4 6"
        fill="none"
      />

      {/* Sun glow behind */}
      <circle cx="220" cy="168" r="52" fill="rgba(45,138,110,0.08)" filter="url(#arc-blur)" />

      {/* Sun core */}
      <circle cx="220" cy="168" r="32" fill="none" stroke="rgba(45,138,110,0.5)" strokeWidth="1.5" />
      <circle cx="220" cy="168" r="18" fill="rgba(45,138,110,0.2)" />
      <circle cx="220" cy="168" r="7" fill="#2d8a6e" />

      {/* Tick marks on arc */}
      {[0.15, 0.3, 0.5, 0.7, 0.85].map((t, i) => {
        // Parametric point on the arc
        const x = 60 + t * 320;
        const arcY = 300 - (300 - 60) * 4 * t * (1 - t); // parabola
        const nx = -(1 - 2 * t); // tangent → normal
        const ny = -(4 * (300 - 60) * (1 - 2 * t));
        const len = Math.sqrt(nx * nx + ny * ny);
        const tickLen = 6;
        return (
          <line
            key={i}
            x1={x - (nx / len) * tickLen}
            y1={arcY - (ny / len) * tickLen}
            x2={x + (nx / len) * tickLen}
            y2={arcY + (ny / len) * tickLen}
            stroke="rgba(45,138,110,0.4)"
            strokeWidth="1"
          />
        );
      })}

      {/* AM label */}
      <text x="72" y="320" fill="rgba(245,240,232,0.3)" fontSize="10" fontFamily="DM Sans, sans-serif" letterSpacing="0.1em">AM</text>
      {/* PM label */}
      <text x="368" y="320" fill="rgba(245,240,232,0.3)" fontSize="10" fontFamily="DM Sans, sans-serif" letterSpacing="0.1em">PM</text>

      {/* Vertical lines from ground */}
      {[100, 160, 220, 280, 340].map((x, i) => (
        <line key={i} x1={x} y1="300" x2={x} y2="310" stroke="rgba(245,240,232,0.1)" strokeWidth="1" />
      ))}

      {/* "ONE DAY" text arc ghost */}
      <text
        x="220" y="365"
        textAnchor="middle"
        fill="rgba(245,240,232,0.05)"
        fontSize="52"
        fontFamily="DM Serif Display, serif"
        letterSpacing="-0.03em"
      >
        ONE DAY
      </text>
    </svg>
  );
}

export default function OneDay() {
  const [menuOpen, setMenuOpen] = useState(false);
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
          {!menuOpen && (
            <button className="od-hamburger" onClick={() => setMenuOpen(true)}>
              <span /><span /><span />
            </button>
          )}
        </nav>
        <div className={`od-mobile-menu ${menuOpen ? "open" : ""}`}>
          <button className="od-mobile-close" onClick={() => setMenuOpen(false)}>✕</button>
          <a href="/OneDay" onClick={() => setMenuOpen(false)}>One Day</a>
          <a href="/OneInitiative" onClick={() => setMenuOpen(false)}>One Initiative</a>
          <a href="/OneTeam" onClick={() => setMenuOpen(false)}>One Team</a>
        </div>

        {/* HERO */}
        <section className="od-hero">
          <div className="od-hero-text">
            <div className="od-hero-label">Workshop</div>
            <h1>One<br />Day.</h1>
            <p className="od-hero-sub">Your team walks in seeing deals one way. They walk out seeing the forces behind them.</p>
          </div>
          <div className="od-hero-visual">
            <ArcVisual />
          </div>
        </section>

        {/* WHAT WE DIAL IN */}
        <Reveal>
          <section className="od-three">
            <div className="od-section-label">What we dial in</div>
            <div className="od-three-grid">
              {[
                { num: "01", title: "Your market.", desc: "We map the organizational forces your buyers are actually navigating — the goals, constraints, and pressures that make your solution matter or not. Your value prop stops being generic and starts being specific to the world your buyers live in." },
                { num: "02", title: "Your accounts.", desc: "We run your live deals through the diagnostic. What's really happening inside each account. What's blocking movement. What your team needs to find out and how to find it. The deals that matter most get a map, not a guess." },
                { num: "03", title: "Your stakeholders.", desc: "Whether you're B2B, B2C, or B2B2C, you're serving a person. That person has a boss, a budget, competing priorities, and a problem they need to solve. Your team needs to understand all of it, not just the person who showed up to the demo." },
              ].map((item, i) => (
                <Reveal key={i} delay={i * 100}>
                  <div className="od-three-item">
                    <div className="od-three-num">{item.num}</div>
                    <div className="od-three-title">{item.title}</div>
                    <div className="od-three-desc">{item.desc}</div>
                  </div>
                </Reveal>
              ))}
            </div>
          </section>
        </Reveal>

        {/* BEFORE / AFTER */}
        <Reveal>
          <div className="od-ba">
            <div className="od-ba-panel od-ba-before">
              <div className="od-ba-eyebrow">
                <span className="od-ba-eyebrow-dot" />
                How deals look now
              </div>
              {[
                '"They loved the demo."',
                '"The champion is excited."',
                '"We just need to get past procurement."',
                '"They said they\'ll have budget next quarter."',
                '"It\'s looking good."',
              ].map((t, i) => <div key={i} className="od-ba-item">{t}</div>)}
            </div>
            <div className="od-ba-panel od-ba-after">
              <div className="od-ba-eyebrow">
                <span className="od-ba-eyebrow-dot" />
                How deals look after
              </div>
              {[
                "Their ops team is drowning. This solves a problem their VP committed to fixing by Q3.",
                "The champion owns the initiative this ties to. If it fails, that's on them.",
                "We solve the problem their CEO put on the board deck. Procurement isn't going to hold that up.",
                "They're trying to go upmarket by Q4. The money will find us.",
                "The problem we solve is blocking an initiative the CEO owns. They can't move forward without fixing it.",
              ].map((t, i) => <div key={i} className="od-ba-item">{t}</div>)}
            </div>
          </div>
        </Reveal>

        {/* TIMELINE */}
        <Reveal>
          <section className="od-timeline">
            <div className="od-section-label">What happens</div>
            <div className="od-timeline-track">
              <div className="od-timeline-line" />
              <div className="od-timeline-items">
                {[
                  { time: "AM", period: "Morning", desc: "The framework. What drvrs is, why it exists, and how the five lenses work. Applied to a real scenario, not a textbook." },
                  { time: "PM", period: "Afternoon", desc: "Your pipeline. Pick real deals. Run them through the diagnostic. Get action plans. The team leaves knowing how to do this themselves." },
                  { time: "∞", period: "Beyond", desc: "A shared language. Deal reviews stop being stories and start being diagnostics. The way the team talks about deals changes permanently." },
                ].map((item, i) => (
                  <Reveal key={i} delay={i * 120}>
                    <div className="od-timeline-item">
                      <div className="od-timeline-dot" />
                      <div className="od-timeline-time">{item.time}</div>
                      <div className="od-timeline-period">{item.period}</div>
                      <div className="od-timeline-desc">{item.desc}</div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        </Reveal>

        {/* CTA */}
        <section className="od-cta">
          <Reveal>
            <h2>One day changes<br /><em>everything.</em></h2>
          </Reveal>
          <Reveal delay={100}>
            <p className="od-cta-sub">Six to eight hours. Your team, your deals, your market.</p>
          </Reveal>
          <Reveal delay={200}>
            <a className="od-cta-btn" href="https://tally.so/r/VLPjKa" target="_blank" rel="noopener noreferrer">
              Book a workshop
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
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