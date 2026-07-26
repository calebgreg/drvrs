const steps = [
  {
    n: "01",
    title: "Book a call",
    body: "30 minutes, free. Tell me where revenue is stuck — a deal that won't close, a pipeline that dried up, a launch that flopped.",
  },
  {
    n: "02",
    title: "Get the diagnosis",
    body: "I dig into it and tell you the specific thing in the way. Not a framework. Not a deck. A finding you can act on.",
  },
  {
    n: "03",
    title: "Fix it",
    body: "You pick how much help you want: one working day, a 60-day sprint on one initiative, or me embedded with your team.",
  },
];

export default function HowItWorks() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1px", background: "rgba(245,240,232,0.08)", border: "1px solid rgba(245,240,232,0.08)", borderRadius: "16px", overflow: "hidden" }}>
      {steps.map((s) => (
        <div key={s.n} style={{ background: "var(--ink)", padding: "2.5rem 2rem", display: "flex", flexDirection: "column", gap: "0.9rem" }}>
          <div className="mono" style={{ fontSize: "0.68rem", letterSpacing: "0.2em", color: "var(--accent-hi)" }}>{s.n}</div>
          <div className="serif" style={{ fontSize: "1.5rem", lineHeight: 1.15 }}>{s.title}</div>
          <div style={{ fontSize: "0.92rem", lineHeight: 1.7, color: "var(--muted)" }}>{s.body}</div>
        </div>
      ))}
    </div>
  );
}