import { useState, useEffect, useRef } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300;1,400&display=swap');

  .drvrs * { margin: 0; padding: 0; box-sizing: border-box; }

  .drvrs {
    background: #0a1a14;
    color: #f5f0e8;
    font-family: 'DM Sans', sans-serif;
    font-weight: 300;
    overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
    min-height: 100vh;
  }

  .drvrs-nav {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
    padding: 2rem 3rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    mix-blend-mode: difference;
  }

  .drvrs-logo {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    font-family: 'DM Sans', sans-serif;
    font-size: 1.2rem;
    font-weight: 400;
    letter-spacing: 0.05em;
    color: #f5f0e8;
    text-decoration: none;
    cursor: pointer;
  }

  .drvrs-logo-pill {
    width: 28px;
    height: 14px;
    background: #f5f0e8;
    border-radius: 7px;
  }

  .drvrs-hero {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 0 8vw;
    position: relative;
  }

  .drvrs-hero-text {
    max-width: 800px;
  }

  .drvrs-hero h1 {
    font-family: 'DM Serif Display', serif;
    font-weight: 400;
    font-size: clamp(2.8rem, 5.5vw, 4.5rem);
    line-height: 1.15;
    letter-spacing: -0.02em;
    margin-bottom: 2rem;
    opacity: 0;
    animation: drvrs-fadeUp 1s ease-out 0.3s forwards;
  }

  .drvrs-hero p {
    font-size: clamp(1.05rem, 1.5vw, 1.25rem);
    line-height: 1.7;
    color: #7a8a82;
    max-width: 540px;
    opacity: 0;
    animation: drvrs-fadeUp 1s ease-out 0.6s forwards;
  }

  .drvrs-scroll-hint {
    position: absolute;
    bottom: 3rem;
    left: 8vw;
    font-size: 0.75rem;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: #7a8a82;
    opacity: 0;
    animation: drvrs-fadeUp 1s ease-out 1.2s forwards;
  }

  .drvrs-scroll-hint span {
    display: block;
    width: 1px;
    height: 40px;
    background: #7a8a82;
    margin-top: 0.75rem;
    animation: drvrs-pulse 2s ease-in-out infinite;
  }

  .drvrs-section {
    padding: 12vh 8vw;
    position: relative;
  }

  .drvrs-section--cream {
    background: #f5f0e8;
    color: #0a1a14;
  }

  .drvrs-section--warm {
    background: #f0e6d6;
    color: #0a1a14;
  }

  .drvrs-section--green {
    background: #1a3a2a;
    color: #f5f0e8;
  }

  .drvrs-realization {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }

  .drvrs-realization-content {
    max-width: 700px;
  }

  .drvrs-realization h2 {
    font-family: 'DM Serif Display', serif;
    font-size: clamp(2rem, 4vw, 3.2rem);
    font-weight: 400;
    line-height: 1.2;
    margin-bottom: 2.5rem;
    letter-spacing: -0.01em;
  }

  .drvrs-realization p {
    font-size: clamp(1.05rem, 1.3vw, 1.15rem);
    line-height: 1.8;
    color: #7a8a82;
    margin-bottom: 1.5rem;
  }

  .drvrs-realization .drvrs-dark-text {
    color: #0a1a14;
    font-weight: 400;
  }

  .drvrs-patterns {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .drvrs-pattern-label {
    font-size: 0.75rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #2d8a6e;
    margin-bottom: 3rem;
  }

  .drvrs-pattern-list {
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  .drvrs-pattern-item {
    padding: 2.5rem 0;
    border-bottom: 1px solid rgba(10, 26, 20, 0.1);
    display: flex;
    gap: 3rem;
    align-items: baseline;
  }

  .drvrs-pattern-item:first-child {
    border-top: 1px solid rgba(10, 26, 20, 0.1);
  }

  .drvrs-pattern-number {
    font-family: 'DM Serif Display', serif;
    font-size: 1rem;
    color: #2d8a6e;
    flex-shrink: 0;
    width: 2rem;
  }

  .drvrs-pattern-text {
    font-family: 'DM Serif Display', serif;
    font-size: clamp(1.3rem, 2.5vw, 1.8rem);
    font-weight: 400;
    line-height: 1.4;
    color: #0a1a14;
  }

  .drvrs-philosophy {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }

  .drvrs-philosophy-content {
    max-width: 650px;
  }

  .drvrs-philosophy h2 {
    font-family: 'DM Serif Display', serif;
    font-size: clamp(2rem, 4vw, 3.2rem);
    font-weight: 400;
    line-height: 1.2;
    margin-bottom: 2.5rem;
  }

  .drvrs-philosophy p {
    font-size: clamp(1.05rem, 1.3vw, 1.15rem);
    line-height: 1.8;
    margin-bottom: 1.5rem;
  }

  .drvrs-philosophy .drvrs-muted {
    color: rgba(245, 240, 232, 0.5);
  }

  .drvrs-framework {
    padding: 15vh 8vw;
  }

  .drvrs-framework-label {
    font-size: 0.75rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #2d8a6e;
    margin-bottom: 4rem;
  }

  .drvrs-framework-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 1px;
    background: rgba(10, 26, 20, 0.1);
    margin-bottom: 4rem;
  }

  .drvrs-framework-item {
    background: #f5f0e8;
    padding: 2.5rem 2rem;
    text-align: center;
  }

  .drvrs-framework-letter {
    font-family: 'DM Serif Display', serif;
    font-size: 2.5rem;
    color: #0a1a14;
    margin-bottom: 0.75rem;
  }

  .drvrs-framework-word {
    font-size: 0.7rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #7a8a82;
    margin-bottom: 1rem;
  }

  .drvrs-framework-desc {
    font-size: 0.85rem;
    line-height: 1.6;
    color: #0a1a14;
    font-weight: 300;
  }

  .drvrs-quote-section {
    min-height: 60vh;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 10vh 8vw;
    background: #0a1a14;
  }

  .drvrs-quote-section blockquote {
    font-family: 'DM Serif Display', serif;
    font-size: clamp(1.8rem, 3.5vw, 2.8rem);
    font-weight: 400;
    line-height: 1.3;
    max-width: 750px;
    font-style: italic;
    color: #f5f0e8;
  }

  .drvrs-cta-section {
    min-height: 70vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 10vh 8vw;
    background: #0a1a14;
  }

  .drvrs-cta-section p {
    font-size: clamp(1.05rem, 1.3vw, 1.15rem);
    color: #7a8a82;
    margin-bottom: 3rem;
    max-width: 500px;
    line-height: 1.7;
  }

  .drvrs-cta-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    background: #2d8a6e;
    color: #f5f0e8;
    padding: 1rem 2.5rem;
    border-radius: 50px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.95rem;
    font-weight: 400;
    text-decoration: none;
    cursor: pointer;
    border: none;
    transition: all 0.3s ease;
    letter-spacing: 0.02em;
  }

  .drvrs-cta-btn:hover {
    background: #35a080;
    transform: translateY(-2px);
  }

  .drvrs-cta-btn svg {
    width: 16px;
    height: 16px;
    transition: transform 0.3s ease;
  }

  .drvrs-cta-btn:hover svg {
    transform: translateX(3px);
  }

  .drvrs-footer {
    padding: 3rem 8vw;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.8rem;
    color: #7a8a82;
    border-top: 1px solid rgba(245, 240, 232, 0.08);
  }

  .drvrs-footer .drvrs-logo {
    font-size: 1rem;
  }

  .drvrs-footer .drvrs-logo-pill {
    width: 22px;
    height: 11px;
    border-radius: 6px;
  }

  @keyframes drvrs-fadeUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes drvrs-pulse {
    0%, 100% { opacity: 0.3; }
    50% { opacity: 1; }
  }

  .drvrs-reveal {
    opacity: 0;
    transform: translateY(40px);
    transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .drvrs-reveal.drvrs-visible {
    opacity: 1;
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    .drvrs-nav { padding: 1.5rem 2rem; }
    .drvrs-hero { padding: 0 6vw; }
    .drvrs-section { padding: 10vh 6vw; }
    .drvrs-scroll-hint { left: 6vw; }
    .drvrs-framework-grid { grid-template-columns: 1fr; }
    .drvrs-pattern-item { flex-direction: column; gap: 0.75rem; }
    .drvrs-pattern-number { width: auto; }
  }
`;

function RevealElement({ children, className = "" }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
        }
      },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`drvrs-reveal ${visible ? "drvrs-visible" : ""} ${className}`}
    >
      {children}
    </div>
  );
}

const patterns = [
  { num: "01", text: "The champion who lost credibility internally two weeks before your proposal landed." },
  { num: "02", text: "The CFO who froze discretionary spend but told no one outside the leadership team." },
  { num: "03", text: "The legal review that was always going to take 90 days, but nobody mentioned it until day 87." },
  { num: "04", text: "The competing initiative that quietly absorbed the budget earmarked for yours." },
  { num: "05", text: "The committee that formed last Tuesday that nobody told the seller about." },
];

const framework = [
  { letter: "G", word: "Goal", desc: "The board-level initiative. What the organization needs to accomplish, and what happens if they don't." },
  { letter: "C", word: "Constraints", desc: "The organizational realities limiting their ability to reach that goal. These exist whether a seller shows up or not." },
  { letter: "D", word: "Drivers", desc: "The lever that would move a constraint, whether the organization has found it yet or not." },
  { letter: "C", word: "Conditions", desc: "The attributes of an organization that shape what a driver can achieve. Changeable, but only if visible." },
  { letter: "I", word: "Inputs", desc: "The ground-level specifics that feed a condition. The raw material that makes it strong or weak." },
];

export default function Home() {
  return (
    <>
      <style>{styles}</style>
      <div className="drvrs">
        {/* NAV */}
        <nav className="drvrs-nav">
          <a className="drvrs-logo">
            <div className="drvrs-logo-pill" />
            drvrs
          </a>
        </nav>

        {/* HERO */}
        <section className="drvrs-hero">
          <div className="drvrs-hero-text">
            <h1>
              Selling is change management.
              <br />
              Nobody treats it that way.
            </h1>
            <p>
              Every deal is an attempt to change how an organization operates.
              The seller just happens to be the one leading that change, with
              almost no visibility into the forces working for and against them.
            </p>
          </div>
          <div className="drvrs-scroll-hint">
            Scroll
            <span />
          </div>
        </section>

        {/* REALIZATION */}
        <section className="drvrs-section drvrs-section--cream drvrs-realization">
          <RevealElement>
            <div className="drvrs-realization-content">
              <h2>Think about the last deal that died.</h2>
              <p>
                It probably wasn't because of price. It wasn't because the
                product was wrong. It wasn't because the rep didn't follow up.
              </p>
              <p className="drvrs-dark-text">
                Something shifted inside that organization. A priority changed, a
                stakeholder got reassigned, a budget got pulled into a different
                initiative. And by the time anyone on the selling side noticed, it
                was already over.
              </p>
              <p>
                This happens every day. Across every industry. In every sales org
                on the planet. And the response is always the same: update the
                CRM, adjust the forecast, move on.
              </p>
              <p className="drvrs-dark-text">
                Nobody stops to ask why they didn't see it coming.
              </p>
            </div>
          </RevealElement>
        </section>

        {/* PATTERNS */}
        <section className="drvrs-section drvrs-section--warm drvrs-patterns">
          <RevealElement>
            <div className="drvrs-pattern-label">
              The patterns nobody talks about
            </div>
          </RevealElement>
          <div className="drvrs-pattern-list">
            {patterns.map((p) => (
              <RevealElement key={p.num}>
                <div className="drvrs-pattern-item">
                  <div className="drvrs-pattern-number">{p.num}</div>
                  <div>
                    <div className="drvrs-pattern-text">{p.text}</div>
                  </div>
                </div>
              </RevealElement>
            ))}
          </div>
        </section>

        {/* PHILOSOPHY */}
        <section className="drvrs-section drvrs-section--green drvrs-philosophy">
          <RevealElement>
            <div className="drvrs-philosophy-content">
              <h2>Every organization is a system of forces.</h2>
              <p>
                Goals pulling it forward. Constraints holding it back. People,
                priorities, and risks, all in motion, all the time.
              </p>
              <p className="drvrs-muted">
                Most of the people trying to create change inside these systems
                are operating on the surface. They see what they're told. They
                miss what governs.
              </p>
              <p>Want to be a driver? Find the drvrs.</p>
            </div>
          </RevealElement>
        </section>

        {/* FRAMEWORK */}
        <section className="drvrs-section drvrs-section--cream drvrs-framework">
          <RevealElement>
            <div className="drvrs-framework-label">The diagnostic layer</div>
          </RevealElement>
          <RevealElement>
            <div className="drvrs-framework-grid">
              {framework.map((f, i) => (
                <div className="drvrs-framework-item" key={i}>
                  <div className="drvrs-framework-letter">{f.letter}</div>
                  <div className="drvrs-framework-word">{f.word}</div>
                  <div className="drvrs-framework-desc">{f.desc}</div>
                </div>
              ))}
            </div>
          </RevealElement>
        </section>

        {/* CTA */}
        <section className="drvrs-cta-section">
          <RevealElement>
            <h2 style={{fontFamily: "'DM Serif Display', serif", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 400, lineHeight: 1.2, marginBottom: "1.5rem", maxWidth: "500px"}}>Welcome to drvrs.</h2>
          </RevealElement>
          <RevealElement>
            <p>
              Tools, frameworks, and community. A new way of thinking about
              selling &amp; supporting those who love to do it right.
            </p>
          </RevealElement>
          <RevealElement>
            <a className="drvrs-cta-btn" href="https://tally.so/r/VLPjKa" target="_blank" rel="noopener noreferrer">
              Be a drvr
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </a>
          </RevealElement>
        </section>

        {/* FOOTER */}
        <footer className="drvrs-footer">
          <a className="drvrs-logo">
            <div className="drvrs-logo-pill" />
            drvrs
          </a>
          <span>&copy; 2026</span>
        </footer>
      </div>
    </>
  );
}