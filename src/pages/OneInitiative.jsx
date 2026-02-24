import { useState, useEffect, useRef } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300;1,400&display=swap');

  .oi * { margin: 0; padding: 0; box-sizing: border-box; }

  .oi {
    background: #0a1a14;
    color: #f5f0e8;
    font-family: 'DM Sans', sans-serif;
    font-weight: 300;
    overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
    min-height: 100vh;
  }

  .oi-nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    padding: 2rem 3rem;
    display: flex; justify-content: space-between; align-items: center;
    mix-blend-mode: difference;
  }

  .oi-logo {
    display: flex; align-items: center; gap: 0.6rem;
    font-family: 'DM Sans', sans-serif; font-size: 1.2rem;
    font-weight: 400; letter-spacing: 0.05em;
    color: #f5f0e8; text-decoration: none; cursor: pointer;
  }

  .oi-logo-pill { width: 28px; height: 14px; background: #f5f0e8; border-radius: 7px; }

  .oi-nav-links { display: flex; gap: 2.5rem; align-items: center; }

  .oi-nav-links a {
    font-family: 'DM Sans', sans-serif; font-size: 0.85rem;
    font-weight: 400; letter-spacing: 0.08em;
    color: #f5f0e8; text-decoration: none;
    text-transform: uppercase; transition: opacity 0.3s ease; cursor: pointer;
  }

  .oi-nav-links a:hover { opacity: 0.6; }
  .oi-nav-links a.oi-active { opacity: 0.5; }

  .oi-hamburger {
    display: none; flex-direction: column; gap: 5px;
    cursor: pointer; background: none; border: none; padding: 4px;
  }
  .oi-hamburger span { display: block; width: 22px; height: 1.5px; background: #f5f0e8; }

  .oi-mobile-menu {
    display: none; position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: #0a1a14; z-index: 99;
    flex-direction: column; align-items: center; justify-content: center; gap: 2.5rem;
  }
  .oi-mobile-menu.open { display: flex; }
  .oi-mobile-menu a {
    font-family: 'DM Sans', sans-serif; font-size: 1.5rem;
    font-weight: 400; letter-spacing: 0.08em;
    color: #f5f0e8; text-decoration: none; text-transform: uppercase;
  }
  .oi-mobile-close {
    position: absolute; top: 2rem; right: 2rem;
    background: none; border: none; color: #f5f0e8; font-size: 2rem; cursor: pointer;
  }

  .oi-hero {
    min-height: 100vh;
    display: flex; flex-direction: column;
    justify-content: center;
    padding: 0 8vw;
  }

  .oi-hero-label {
    font-size: 0.75rem; letter-spacing: 0.2em;
    text-transform: uppercase; color: #2d8a6e;
    margin-bottom: 2rem;
    opacity: 0; animation: oi-fadeUp 1s ease-out 0.2s forwards;
  }

  .oi-hero h1 {
    font-family: 'DM Serif Display', serif;
    font-weight: 400;
    font-size: clamp(3rem, 7vw, 6rem);
    line-height: 1.05;
    letter-spacing: -0.03em;
    margin-bottom: 2rem;
    opacity: 0; animation: oi-fadeUp 1s ease-out 0.4s forwards;
  }

  .oi-hero p {
    font-size: clamp(1.05rem, 1.5vw, 1.25rem);
    line-height: 1.7; color: #7a8a82;
    max-width: 480px;
    opacity: 0; animation: oi-fadeUp 1s ease-out 0.7s forwards;
  }

  .oi-problem {
    min-height: 60vh;
    display: flex; align-items: center;
    padding: 15vh 8vw;
    background: #f5f0e8; color: #0a1a14;
  }

  .oi-problem-text { max-width: 600px; }

  .oi-problem-text h2 {
    font-family: 'DM Serif Display', serif;
    font-size: clamp(1.8rem, 3vw, 2.5rem);
    font-weight: 400; line-height: 1.25;
    margin-bottom: 2rem;
  }

  .oi-problem-text p {
    font-size: clamp(1rem, 1.2vw, 1.1rem);
    line-height: 1.8; color: #7a8a82;
  }

  .oi-cascade {
    background: #f0e6d6;
    padding: 10vh 8vw;
  }

  .oi-cascade-label {
    font-size: 0.75rem; letter-spacing: 0.2em;
    text-transform: uppercase; color: #2d8a6e;
    margin-bottom: 4rem;
  }

  .oi-cascade-stack { display: flex; flex-direction: column; }

  .oi-cascade-item {
    display: grid;
    grid-template-columns: 200px 1fr;
    border-bottom: 1px solid rgba(10, 26, 20, 0.1);
  }

  .oi-cascade-item:first-child { border-top: 1px solid rgba(10, 26, 20, 0.1); }

  .oi-cascade-lens {
    padding: 3rem 2rem 3rem 0;
    display: flex; flex-direction: column; gap: 0.25rem;
  }

  .oi-cascade-letter {
    font-family: 'DM Serif Display', serif;
    font-size: 2rem; color: #0a1a14;
  }

  .oi-cascade-word {
    font-size: 0.65rem; letter-spacing: 0.15em;
    text-transform: uppercase; color: #2d8a6e;
  }

  .oi-cascade-content {
    padding: 3rem 2rem;
    border-left: 1px solid rgba(10, 26, 20, 0.1);
  }

  .oi-cascade-example {
    font-family: 'DM Serif Display', serif;
    font-size: clamp(1.1rem, 1.5vw, 1.3rem);
    line-height: 1.5;
    color: #0a1a14;
  }

  .oi-outcome {
    min-height: 60vh;
    display: flex; align-items: center;
    padding: 15vh 8vw;
    background: #1a3a2a; color: #f5f0e8;
  }

  .oi-outcome-grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 4rem; width: 100%;
  }

  .oi-outcome-label {
    font-size: 0.7rem; letter-spacing: 0.15em;
    text-transform: uppercase; color: #2d8a6e;
    margin-bottom: 1.5rem;
  }

  .oi-outcome-text {
    font-family: 'DM Serif Display', serif;
    font-size: clamp(1.2rem, 1.8vw, 1.5rem);
    line-height: 1.4;
  }

  .oi-cta {
    min-height: 50vh;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    text-align: center; padding: 10vh 8vw;
    background: #0a1a14;
  }

  .oi-cta h2 {
    font-family: 'DM Serif Display', serif;
    font-size: clamp(2rem, 4vw, 3rem);
    font-weight: 400; line-height: 1.2;
    margin-bottom: 2.5rem;
  }

  .oi-cta-btn {
    display: inline-flex; align-items: center; gap: 0.75rem;
    background: #2d8a6e; color: #f5f0e8;
    padding: 1rem 2.5rem; border-radius: 50px;
    font-family: 'DM Sans', sans-serif; font-size: 0.95rem;
    font-weight: 400; text-decoration: none; cursor: pointer; border: none;
    transition: all 0.3s ease; letter-spacing: 0.02em;
  }

  .oi-cta-btn:hover { background: #35a080; transform: translateY(-2px); }
  .oi-cta-btn svg { width: 16px; height: 16px; transition: transform 0.3s ease; }
  .oi-cta-btn:hover svg { transform: translateX(3px); }

  .oi-footer {
    padding: 3rem 8vw;
    display: flex; justify-content: space-between; align-items: center;
    font-size: 0.8rem; color: #7a8a82;
    border-top: 1px solid rgba(245, 240, 232, 0.08);
  }

  .oi-footer .oi-logo { font-size: 1rem; }
  .oi-footer .oi-logo-pill { width: 22px; height: 11px; border-radius: 6px; }

  @keyframes oi-fadeUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .oi-reveal {
    opacity: 0; transform: translateY(40px);
    transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .oi-reveal.oi-visible { opacity: 1; transform: translateY(0); }

  @media (max-width: 768px) {
    .oi-nav { padding: 1.5rem 2rem; }
    .oi-nav-links { display: none; }
    .oi-hamburger { display: flex; }
    .oi-cascade-item { grid-template-columns: 1fr; }
    .oi-cascade-content { border-left: none; border-top: 1px solid rgba(10, 26, 20, 0.1); }
    .oi-cascade-lens { padding: 2rem 0 0.5rem 0; }
    .oi-cascade-content { padding: 1rem 0 2rem 0; }
    .oi-outcome-grid { grid-template-columns: 1fr; gap: 3rem; }
  }
`;

const cascade = [
  { letter: "G", word: "Goal", example: "Move upmarket by Q4. Current deal size can't sustain the business." },
  { letter: "C", word: "Constraint", example: "The sales team is built for SMB. Nobody has closed above $200K." },
  { letter: "D", word: "Driver", example: "Enterprise seller capacity. But leadership hasn't agreed that's the lever." },
  { letter: "C", word: "Conditions", example: "Comp plan doesn't incentivize larger deals. No recruiting pipeline. No reputation in the enterprise market." },
  { letter: "I", word: "Inputs", example: "Job descriptions test for SMB hustle. Interview process filters out enterprise sellers. No executive sponsor for the shift." },
];

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
    <div ref={ref} className={`oi-reveal ${visible ? "oi-visible" : ""} ${className}`}>
      {children}
    </div>
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
        </nav>

        <section className="oi-hero">
          <div className="oi-hero-label">Initiative Alignment</div>
          <h1>One Initiative.</h1>
          <p>Leadership set the goal. Everyone nodded. Nothing moved. Sound familiar?</p>
        </section>

        <Reveal>
          <section className="oi-problem">
            <div className="oi-problem-text">
              <h2>The same forces that kill deals from the outside kill initiatives from the inside.</h2>
              <p>Competing priorities. Unclear ownership. Conditions nobody is addressing. Drivers that haven't been identified. The goal is clear. The path to it isn't.</p>
            </div>
          </section>
        </Reveal>

        <Reveal>
          <section className="oi-cascade">
            <div className="oi-cascade-label">drvrs applied internally</div>
            <div className="oi-cascade-stack">
              {cascade.map((c, i) => (
                <div className="oi-cascade-item" key={i}>
                  <div className="oi-cascade-lens">
                    <div className="oi-cascade-letter">{c.letter}</div>
                    <div className="oi-cascade-word">{c.word}</div>
                  </div>
                  <div className="oi-cascade-content">
                    <div className="oi-cascade-example">{c.example}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </Reveal>

        <Reveal>
          <section className="oi-outcome">
            <div className="oi-outcome-grid">
              <div>
                <div className="oi-outcome-label">You get</div>
                <div className="oi-outcome-text">Clarity on why the org is stuck.</div>
              </div>
              <div>
                <div className="oi-outcome-label">Your team gets</div>
                <div className="oi-outcome-text">A shared map of what needs to change and in what order.</div>
              </div>
              <div>
                <div className="oi-outcome-label">The initiative gets</div>
                <div className="oi-outcome-text">A real path forward instead of another strategy deck.</div>
              </div>
            </div>
          </section>
        </Reveal>

        <section className="oi-cta">
          <Reveal><h2>Pick the initiative. We'll find the blockers.</h2></Reveal>
          <Reveal>
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