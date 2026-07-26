const steps = [
  {
    marker: "The call · 30 min",
    line: "One stuck thing on the table.",
    note: "The deal that won't close. The pipeline that went quiet. The launch that flopped. Whatever isn't moving — that's the agenda.",
  },
  {
    marker: "The dig",
    line: "Name the one thing in the way.",
    note: "Not a framework. Not a deck. A finding — specific, written down, and yours to keep either way.",
  },
  {
    marker: "The fix",
    line: "Match the fix to the problem.",
    note: "One day, one initiative, or one team. Nothing bigger than the problem needs.",
  },
];

export default function HowItWorks() {
  return (
    <div className="hiw">
      <style>{`
        .hiw { max-width: 880px; }
        .hiw-step {
          display: grid; grid-template-columns: 44px 1fr; gap: 0 2rem;
          position: relative; padding-bottom: 3.5rem;
        }
        .hiw-step:last-child { padding-bottom: 0; }
        .hiw-rail { position: relative; display: flex; justify-content: center; }
        .hiw-rail::before {
          content: ""; position: absolute; top: 34px; bottom: -10px; width: 1px;
          background: linear-gradient(to bottom, rgba(63,174,139,0.45), rgba(63,174,139,0.08));
        }
        .hiw-step:last-child .hiw-rail::before { display: none; }
        .hiw-node {
          width: 34px; height: 34px; border-radius: 50%; flex-shrink: 0;
          border: 1px solid rgba(63,174,139,0.5); display: flex; align-items: center; justify-content: center;
          font-family: 'DM Mono', monospace; font-size: 0.62rem; color: var(--accent-hi);
          background: rgba(45,138,110,0.08);
        }
        .hiw-marker {
          font-family: 'DM Mono', monospace; font-size: 0.62rem; letter-spacing: 0.22em;
          text-transform: uppercase; color: var(--accent-hi); padding-top: 0.55rem; margin-bottom: 0.6rem;
        }
        .hiw-line {
          font-family: 'DM Serif Display', serif; font-size: clamp(1.5rem, 2.8vw, 2.2rem);
          line-height: 1.15; letter-spacing: -0.01em; color: var(--cream); margin-bottom: 0.75rem;
        }
        .hiw-note { font-size: 0.95rem; line-height: 1.7; color: var(--muted); max-width: 560px; }
        @media (max-width: 640px) {
          .hiw-step { grid-template-columns: 34px 1fr; gap: 0 1.1rem; }
        }
      `}</style>
      {steps.map((s, i) => (
        <div className="hiw-step" key={i}>
          <div className="hiw-rail"><div className="hiw-node">{String(i + 1).padStart(2, "0")}</div></div>
          <div>
            <div className="hiw-marker">{s.marker}</div>
            <div className="hiw-line">{s.line}</div>
            <div className="hiw-note">{s.note}</div>
          </div>
        </div>
      ))}
    </div>
  );
}