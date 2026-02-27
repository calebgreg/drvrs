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
    text-transform: uppercase; transition: opacity 0.3s ease; cursor: pointer;
  }

  .od-nav-links a:hover { opacity: 0.6; }
  .od-nav-links a.od-active { opacity: 0.5; }

  .od-hamburger {
    display: none;
    flex-direction: column;
    gap: 5px;
    cursor: pointer;
    background: none;
    border: none;
    padding: 4px;
  }
  .od-hamburger span { display: block; width: 22px; height: 1.5px; background: #f5f0e8; }

  .od-mobile-menu {
    display: none;
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: #0a1a14;
    z-index: 200;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2.5rem;
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

  .od-hero {
    min-height: 100vh;
    display: flex; flex-direction: column;
    justify-content: center;
    padding: 0 8vw;
  }

  .od-hero-label {
    font-size: 0.75rem; letter-spacing: 0.2em;
    text-transform: uppercase; color: #2d8a6e;
    margin-bottom: 2rem;
    opacity: 0; animation: od-fadeUp 1s ease-out 0.2s forwards;
  }

  .od-hero h1 {
    font-family: 'DM Serif Display', serif;
    font-weight: 400;
    font-size: clamp(3rem, 7vw, 6rem);
    line-height: 1.05;
    letter-spacing: -0.03em;
    margin-bottom: 2rem;
    opacity: 0; animation: od-fadeUp 1s ease-out 0.4s forwards;
  }

  .od-hero p {
    font-size: clamp(1.05rem, 1.5vw, 1.25rem);
    line-height: 1.7; color: #7a8a82;
    max-width: 560px;
    opacity: 0; animation: od-fadeUp 1s ease-out 0.7s forwards;
  }

  .od-three {
    padding: 15vh 8vw;
    background: #f5f0e8;
    color: #0a1a14;
  }

  .od-three-label {
    font-size: 0.75rem; letter-spacing: 0.2em;
    text-transform: uppercase; color: #2d8a6e;
    margin-bottom: 5rem;
  }

  .od-three-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1px;
    background: rgba(10, 26, 20, 0.1);
  }

  .od-three-item {
    background: #f5f0e8;
    padding: 3rem 2.5rem;
  }

  .od-three-title {
    font-family: 'DM Serif Display', serif;
    font-size: clamp(1.4rem, 2vw, 1.8rem);
    color: #0a1a14;
    margin-bottom: 1.25rem;
    line-height: 1.2;
  }

  .od-three-desc {
    font-size: 0.95rem; line-height: 1.7;
    color: #7a8a82; font-weight: 300;
  }

  .od-before-after {
    display: grid;
    grid-template-columns: 1fr 1fr;
    min-height: 80vh;
  }

  .od-ba-panel {
    display: flex; flex-direction: column;
    justify-content: center;
    padding: 10vh 6vw;
  }

  .od-ba-before { background: #0a1a14; }
  .od-ba-after { background: #1a3a2a; }

  .od-ba-label {
    font-size: 0.7rem; letter-spacing: 0.2em;
    text-transform: uppercase; margin-bottom: 3rem;
  }

  .od-ba-label-before { color: #7a8a82; }
  .od-ba-label-after { color: #2d8a6e; }

  .od-ba-item {
    font-family: 'DM Serif Display', serif;
    font-size: clamp(1.1rem, 1.8vw, 1.4rem);
    line-height: 1.4;
    padding: 1.5rem 0;
    border-bottom: 1px solid rgba(245, 240, 232, 0.08);
  }

  .od-ba-before .od-ba-item { color: #7a8a82; }
  .od-ba-after .od-ba-item { color: #f5f0e8; }

  .od-timeline {
    padding: 15vh 8vw;
    background: #f5f0e8;
    color: #0a1a14;
  }

  .od-timeline-label {
    font-size: 0.75rem; letter-spacing: 0.2em;
    text-transform: uppercase; color: #2d8a6e;
    margin-bottom: 5rem;
  }

  .od-timeline-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1px;
    background: rgba(10, 26, 20, 0.1);
  }

  .od-timeline-item {
    background: #f5f0e8;
    padding: 3rem 2rem;
  }

  .od-timeline-time {
    font-family: 'DM Serif Display', serif;
    font-size: 1.8rem;
    color: #0a1a14;
    margin-bottom: 0.5rem;
  }

  .od-timeline-period {
    font-size: 0.7rem; letter-spacing: 0.15em;
    text-transform: uppercase; color: #2d8a6e;
    margin-bottom: 1.5rem;
  }

  .od-timeline-desc {
    font-size: 0.9rem; line-height: 1.6;
    color: #0a1a14; font-weight: 300;
  }

  .od-cta {
    min-height: 50vh;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    text-align: center; padding: 10vh 8vw;
    background: #0a1a14;
  }

  .od-cta h2 {
    font-family: 'DM Serif Display', serif;
    font-size: clamp(2rem, 4vw, 3rem);
    font-weight: 400; line-height: 1.2;
    margin-bottom: 2.5rem;
  }

  .od-cta-btn {
    display: inline-flex; align-items: center; gap: 0.75rem;
    background: #2d8a6e; color: #f5f0e8;
    padding: 1rem 2.5rem; border-radius: 50px;
    font-family: 'DM Sans', sans-serif; font-size: 0.95rem;
    font-weight: 400; text-decoration: none; cursor: pointer; border: none;
    transition: all 0.3s ease; letter-spacing: 0.02em;
  }

  .od-cta-btn:hover { background: #35a080; transform: translateY(-2px); }
  .od-cta-btn svg { width: 16px; height: 16px; transition: transform 0.3s ease; }
  .od-cta-btn:hover svg { transform: translateX(3px); }

  .od-footer {
    padding: 3rem 8vw;
    display: flex; justify-content: space-between; align-items: center;
    font-size: 0.8rem; color: #7a8a82;
    border-top: 1px solid rgba(245, 240, 232, 0.08);
  }

  .od-footer .od-logo { font-size: 1rem; }
  .od-footer .od-logo-pill { width: 22px; height: 11px; border-radius: 6px; }

  @keyframes od-fadeUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .od-reveal {
    opacity: 0; transform: translateY(40px);
    transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .od-reveal.od-visible { opacity: 1; transform: translateY(0); }

  @media (max-width: 768px) {
    .od-nav { padding: 1.5rem 2rem; }
    .od-nav-links { display: none; }
    .od-hamburger { display: flex; }
    .od-three-grid { grid-template-columns: 1fr; }
    .od-before-after { grid-template-columns: 1fr; }
    .od-timeline-grid { grid-template-columns: 1fr 1fr; }
  }
`;

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
    <div ref={ref} className={`od-reveal ${visible ? "od-visible" : ""} ${className}`}>
      {children}
    </div>
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

        <section className="od-hero">
          <div className="od-hero-label">Workshop</div>
          <h1>One Day.</h1>
          <p>Your team walks in seeing deals one way. They walk out seeing the forces behind them.</p>
        </section>

        <Reveal>
          <section className="od-three">
            <div className="od-three-label">What we dial in</div>
            <div className="od-three-grid">
              <div className="od-three-item">
                <div className="od-three-title">Your market.</div>
                <div className="od-three-desc">We map the organizational forces your buyers are actually navigating — the goals, constraints, and pressures that make your solution matter or not. Your value prop stops being generic and starts being specific to the world your buyers live in.</div>
              </div>
              <div className="od-three-item">
                <div className="od-three-title">Your prospects.</div>
                <div className="od-three-desc">We run your live deals through the diagnostic. What's really happening inside each account. What's blocking movement. What your team needs to find out and how to find it. The deals that matter most get a map, not a guess.</div>
              </div>
              <div className="od-three-item">
                <div className="od-three-title">Your stakeholders.</div>
                <div className="od-three-desc">B2B is person to person to more people. We identify who actually holds influence, who's threatened, who's a passenger, and who can move this. Your team learns to sell to the room, not just the champion.</div>
              </div>
            </div>
          </section>
        </Reveal>

        <Reveal>
          <section className="od-timeline">
            <div className="od-timeline-label">What happens</div>
            <div className="od-timeline-grid">
              <div className="od-timeline-item">
                <div className="od-timeline-time">AM</div>
                <div className="od-timeline-period">Morning</div>
                <div className="od-timeline-desc">The framework. What drvrs is, why it exists, and how the five lenses work. Applied to a real scenario, not a textbook.</div>
              </div>
              <div className="od-timeline-item">
                <div className="od-timeline-time">PM</div>
                <div className="od-timeline-period">Afternoon</div>
                <div className="od-timeline-desc">Your pipeline. Pick real deals. Run them through the diagnostic. Find what's actually happening and what's missing.</div>
              </div>
              <div className="od-timeline-item">
                <div className="od-timeline-time">3pm</div>
                <div className="od-timeline-period">Late afternoon</div>
                <div className="od-timeline-desc">Action plans. Real deals, run through the diagnostic live. The team leaves knowing how to do this themselves — not just what to do next.</div>
              </div>
              <div className="od-timeline-item">
                <div className="od-timeline-time">&infin;</div>
                <div className="od-timeline-period">After</div>
                <div className="od-timeline-desc">A shared language. Deal reviews stop being stories and start being diagnostics. The way the team talks about deals changes permanently.</div>
              </div>
            </div>
          </section>
        </Reveal>

        <Reveal>
          <div className="od-before-after">
            <div className="od-ba-panel od-ba-before">
              <div className="od-ba-label od-ba-label-before">How deals look now</div>
              <div className="od-ba-item">"They loved the demo."</div>
              <div className="od-ba-item">"The champion is excited."</div>
              <div className="od-ba-item">"We just need to get past procurement."</div>
              <div className="od-ba-item">"They said they'll have budget next quarter."</div>
              <div className="od-ba-item">"It's looking good."</div>
            </div>
            <div className="od-ba-panel od-ba-after">
              <div className="od-ba-label od-ba-label-after">How deals look after</div>
              <div className="od-ba-item">Their ops team is drowning. This solves a problem their VP committed to fixing by Q3.</div>
              <div className="od-ba-item">The champion owns the initiative this ties to. If it fails, that's on them.</div>
              <div className="od-ba-item">We solve the problem their CEO put on the board deck. Procurement isn't going to hold that up.</div>
              <div className="od-ba-item">They're trying to go upmarket by Q4. If they don't, their deal size can't sustain the business. The money will find us.</div>
              <div className="od-ba-item">The problem we solve is blocking an initiative the CEO owns. They can't move forward without fixing it.</div>
            </div>
          </div>
        </Reveal>

        <section className="od-cta">
          <Reveal><h2>One day changes everything.</h2></Reveal>
          <Reveal>
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