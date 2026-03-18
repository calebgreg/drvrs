import { useState, useEffect, useRef } from "react";

function useCountUp(target, duration = 1200, delay = 0) {
  const [val, setVal] = useState(0);
  const raf = useRef(null);
  useEffect(() => {
    if (!target) { setVal(0); return; }
    const t = setTimeout(() => {
      const s = performance.now();
      const tick = (now) => {
        const p = Math.min((now - s) / duration, 1);
        setVal(Math.round(target * (1 - Math.pow(1 - p, 4))));
        if (p < 1) raf.current = requestAnimationFrame(tick);
      };
      raf.current = requestAnimationFrame(tick);
    }, delay);
    return () => { clearTimeout(t); cancelAnimationFrame(raf.current); };
  }, [target, delay]);
  return val;
}

function fmt(n) {
  if (!n) return "$0";
  if (n >= 1000000) return "$" + (n / 1000000).toFixed(1) + "M";
  if (n >= 1000) return "$" + Math.round(n / 1000) + "K";
  return "$" + Math.round(n);
}

function CurrencyInput({ hint, sub, onConfirm }) {
  const [val, setVal] = useState("");
  const inputRef = useRef(null);
  const numeric = parseInt(val.replace(/,/g, "")) || 0;

  useEffect(() => {
    const t = setTimeout(() => { if (inputRef.current) inputRef.current.focus(); }, 50);
    return () => clearTimeout(t);
  }, []);

  return (
    <div>
      <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", color: "#f5f0e8", lineHeight: 1.15, marginBottom: "0.6rem" }}>{hint}</div>
      <div style={{ fontSize: "0.78rem", color: "rgba(245,240,232,0.25)", marginBottom: "2.5rem", lineHeight: 1.7, maxWidth: "440px" }}>{sub}</div>
      <div style={{ display: "flex", alignItems: "center", borderBottom: "1px solid rgba(45,138,110,0.3)", paddingBottom: "0.5rem", maxWidth: "400px", marginBottom: "2.5rem" }}>
        <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(2rem, 4vw, 3.5rem)", color: "rgba(245,240,232,0.25)", marginRight: "0.25rem" }}>$</span>
        <input
          ref={inputRef}
          type="text"
          value={val}
          onChange={e => { const digits = e.target.value.replace(/[^0-9]/g, ""); setVal(digits ? parseInt(digits).toLocaleString() : ""); }}
          onKeyDown={e => e.key === "Enter" && numeric > 0 && onConfirm(numeric)}
          placeholder="0"
          style={{
            background: "transparent",
            border: "none",
            outline: "none",
            fontFamily: "'DM Serif Display', serif",
            fontSize: "clamp(2rem, 4vw, 3.5rem)",
            color: "#f5f0e8",
            width: "100%",
            caretColor: "#2d8a6e",
          }}
        />
      </div>
      <button onClick={() => numeric > 0 && onConfirm(numeric)} style={{ padding: "0.85rem 1.75rem", background: "transparent", border: "1px solid rgba(45,138,110,0.35)", color: "#2d8a6e", fontFamily: "'DM Sans', sans-serif", fontSize: "0.62rem", letterSpacing: "0.18em", textTransform: "uppercase", cursor: "pointer" }}>
        Continue →
      </button>
    </div>
  );
}

function NumberInput({ hint, sub, unit, onConfirm }) {
  const [val, setVal] = useState("");
  const inputRef = useRef(null);
  const numeric = parseInt(val.replace(/,/g, "")) || 0;

  useEffect(() => {
    const t = setTimeout(() => { if (inputRef.current) inputRef.current.focus(); }, 50);
    return () => clearTimeout(t);
  }, []);

  return (
    <div>
      <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)", color: "#f5f0e8", lineHeight: 1.15, marginBottom: "0.6rem" }}>{hint}</div>
      <div style={{ fontSize: "0.78rem", color: "rgba(245,240,232,0.25)", marginBottom: "2.5rem", lineHeight: 1.7, maxWidth: "440px" }}>{sub}</div>
      <div style={{ display: "flex", alignItems: "center", borderBottom: "1px solid rgba(45,138,110,0.3)", paddingBottom: "0.5rem", maxWidth: "400px", marginBottom: "2.5rem" }}>
        <input
          ref={inputRef}
          type="text"
          value={val}
          onChange={e => { const digits = e.target.value.replace(/[^0-9]/g, ""); setVal(digits ? parseInt(digits).toLocaleString() : ""); }}
          onKeyDown={e => e.key === "Enter" && numeric > 0 && onConfirm(numeric)}
          placeholder="0"
          style={{
            background: "transparent",
            border: "none",
            outline: "none",
            fontFamily: "'DM Serif Display', serif",
            fontSize: "clamp(2rem, 4vw, 3.5rem)",
            color: "#f5f0e8",
            width: "100%",
            caretColor: "#2d8a6e",
          }}
        />
        {unit && <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.8rem", color: "rgba(245,240,232,0.2)", marginLeft: "0.75rem", whiteSpace: "nowrap" }}>{unit}</span>}
      </div>
      <button onClick={() => numeric > 0 && onConfirm(numeric)} style={{ padding: "0.85rem 1.75rem", background: "transparent", border: "1px solid rgba(45,138,110,0.35)", color: "#2d8a6e", fontFamily: "'DM Sans', sans-serif", fontSize: "0.62rem", letterSpacing: "0.18em", textTransform: "uppercase", cursor: "pointer" }}>
        Continue →
      </button>
    </div>
  );
}

function Decomp({ best, avg, deals, reps }) {
  const teamAvg = avg * deals;
  const teamPotential = best * deals;
  const gap = teamPotential - teamAvg;
  const annualGap = gap * 4;

  const [phase, setPhase] = useState(0);
  const animRevenue = useCountUp(phase >= 1 ? teamAvg : 0, 1400);
  const animGap = useCountUp(phase >= 2 ? gap : 0, 1400);
  const animAnnual = useCountUp(phase >= 3 ? annualGap : 0, 1400);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 300),
      setTimeout(() => setPhase(2), 2000),
      setTimeout(() => setPhase(3), 3600),
      setTimeout(() => setPhase(4), 5000),
      setTimeout(() => setPhase(5), 6200),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div>
      <div style={{ fontSize: "0.58rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "#2d8a6e", marginBottom: "2rem" }}>
        One Day — the cost of the gap
      </div>

      <div style={{ opacity: phase >= 1 ? 1 : 0, transition: "opacity 0.6s ease", marginBottom: "3rem" }}>
        <div style={{ fontSize: "0.6rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(245,240,232,0.2)", marginBottom: "0.75rem" }}>
          Your team's quarterly revenue
        </div>
        <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(3rem, 7vw, 5.5rem)", color: "#f5f0e8", lineHeight: 1, letterSpacing: "-0.03em", marginBottom: "0.75rem" }}>
          {fmt(animRevenue)}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
          {[
            { label: "Volume", val: deals + " deals / quarter" },
            { label: "×" },
            { label: "Price", val: fmt(avg) + " avg deal size" },
          ].map((item, i) => item.label === "×" ? (
            <span key={i} style={{ color: "rgba(45,138,110,0.4)", fontFamily: "'DM Serif Display', serif", fontSize: "1.2rem" }}>×</span>
          ) : (
            <div key={i} style={{ padding: "4px 10px", border: "1px solid rgba(45,138,110,0.15)", background: "rgba(45,138,110,0.04)" }}>
              <div style={{ fontSize: "0.52rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(45,138,110,0.5)", marginBottom: "2px" }}>{item.label}</div>
              <div style={{ fontSize: "0.72rem", color: "rgba(245,240,232,0.5)" }}>{item.val}</div>
            </div>
          ))}
        </div>
      </div>

      {phase >= 2 && (
        <div style={{ animation: "fadeUp 0.6s ease", marginBottom: "3rem" }}>
          <div style={{ marginBottom: "1.5rem" }}>
            <div style={{ fontSize: "0.6rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(245,240,232,0.2)", marginBottom: "0.4rem" }}>
              Per deal gap — best vs average
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: "1rem", flexWrap: "wrap" }}>
              <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(3rem, 6vw, 4.5rem)", color: "#2d8a6e", lineHeight: 1, letterSpacing: "-0.02em" }}>{fmt(best - avg)}</div>
              <div style={{ fontSize: "0.75rem", color: "rgba(45,138,110,0.5)", letterSpacing: "0.08em" }}>per deal · {Math.round(((best - avg) / avg) * 100)}%</div>
            </div>
          </div>
          <div style={{ fontSize: "0.6rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(245,240,232,0.2)", marginBottom: "0.75rem" }}>
            Your best deal closed bigger because something different happened inside that account
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "2px", marginBottom: "1.5rem" }}>
            {[
              { label: "Volume", components: "Reach × Relevance", sub: "Relevance can't be manufactured. It can be found. Reps who know how to look for what an account already cares about close more of what they touch.", color: "rgba(45,138,110,0.6)" },
              { label: "Conversion", components: "Qualification × Offer", sub: "Most reps can qualify a contact. Few can qualify a moment — whether this org, right now, actually needs to move. That's the difference between a deal and a conversation.", color: "rgba(45,138,110,0.75)" },
              { label: "Price", components: "Differentiation × Necessity", sub: "Reps who can't articulate why you and why now end up negotiating on price. The ones who can attach their deal to something the org has to do don't.", color: "#2d8a6e" },
            ].map((d, i) => (
              <div key={i} style={{ padding: "1.25rem", background: "rgba(45,138,110,0.05)", borderTop: `2px solid ${d.color}` }}>
                <div style={{ fontSize: "0.55rem", letterSpacing: "0.14em", textTransform: "uppercase", color: d.color, marginBottom: "0.35rem" }}>{d.label}</div>
                <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: "0.9rem", color: "rgba(245,240,232,0.6)", marginBottom: "0.6rem" }}>{d.components}</div>
                <div style={{ fontSize: "0.68rem", color: "rgba(245,240,232,0.3)", lineHeight: 1.6 }}>{d.sub}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {phase >= 3 && (
        <div style={{ animation: "fadeUp 0.6s ease", marginBottom: "1.5rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2px" }}>
            <div style={{ padding: "1.5rem", borderTop: "1px solid rgba(245,240,232,0.08)", background: "rgba(245,240,232,0.02)" }}>
              <div style={{ fontSize: "0.55rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(245,240,232,0.2)", marginBottom: "0.5rem" }}>This quarter</div>
              <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(2rem, 4vw, 3rem)", color: "#2d8a6e", lineHeight: 1 }}>{fmt(animGap)}</div>
              <div style={{ fontSize: "0.68rem", color: "rgba(245,240,232,0.2)", marginTop: "0.3rem" }}>left on the table</div>
            </div>
            <div style={{ padding: "1.5rem", borderTop: "2px solid #2d8a6e", background: "rgba(45,138,110,0.06)" }}>
              <div style={{ fontSize: "0.55rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "#2d8a6e", marginBottom: "0.5rem" }}>Annualized</div>
              <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(2rem, 4vw, 3rem)", color: "#f5f0e8", lineHeight: 1 }}>{fmt(animAnnual)}</div>
              <div style={{ fontSize: "0.68rem", color: "rgba(245,240,232,0.3)", marginTop: "0.3rem" }}>the real cost of the gap</div>
            </div>
          </div>
        </div>
      )}

      {phase >= 4 && (
        <div style={{ animation: "fadeUp 0.6s ease", marginBottom: "2rem" }}>
          <div style={{ display: "flex", gap: "2rem", alignItems: "flex-start", flexWrap: "wrap", marginBottom: "1.5rem" }}>
            <div style={{ flex: "1", minWidth: "220px" }}>
              <div style={{ fontSize: "0.55rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "#2d8a6e", marginBottom: "1rem" }}>Crucial deal</div>
              <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(1.6rem, 3vw, 2.2rem)", color: "#f5f0e8", lineHeight: 1, marginBottom: "1.5rem" }}>{fmt(best)}</div>
              <svg viewBox="-40 -20 360 270" width="100%" style={{ maxWidth: "280px", display: "block" }}>
                <polygon points="140,50 250,200 30,200" fill="rgba(45,138,110,0.1)" stroke="#2d8a6e" strokeWidth="1.5"/>
                <circle cx="140" cy="50" r="6" fill="#2d8a6e"/>
                <circle cx="250" cy="200" r="6" fill="#2d8a6e"/>
                <circle cx="30" cy="200" r="6" fill="#2d8a6e"/>
                <text x="140" y="28" textAnchor="middle" fill="#2d8a6e" fontSize="11" fontFamily="DM Sans" letterSpacing="2">EASY</text>
                <text x="262" y="218" textAnchor="middle" fill="#2d8a6e" fontSize="11" fontFamily="DM Sans" letterSpacing="2">FAST</text>
                <text x="18" y="218" textAnchor="middle" fill="#2d8a6e" fontSize="11" fontFamily="DM Sans" letterSpacing="2">BIG</text>
              </svg>
            </div>
            <div style={{ flex: "1", minWidth: "220px" }}>
              <div style={{ fontSize: "0.55rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(245,240,232,0.3)", marginBottom: "1rem" }}>Useful deal</div>
              <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(1.6rem, 3vw, 2.2rem)", color: "rgba(245,240,232,0.4)", lineHeight: 1, marginBottom: "1.5rem" }}>{fmt(avg)}</div>
              <svg viewBox="-40 -20 360 270" width="100%" style={{ maxWidth: "280px", display: "block" }}>
                <line x1="30" y1="200" x2="250" y2="200" stroke="rgba(245,240,232,0.35)" strokeWidth="1.5"/>
                <line x1="30" y1="200" x2="140" y2="50" stroke="rgba(245,240,232,0.1)" strokeWidth="1" strokeDasharray="3 6"/>
                <line x1="250" y1="200" x2="140" y2="50" stroke="rgba(245,240,232,0.1)" strokeWidth="1" strokeDasharray="3 6"/>
                <circle cx="140" cy="50" r="6" fill="none" stroke="rgba(245,240,232,0.15)" strokeWidth="1" strokeDasharray="2 3"/>
                <circle cx="250" cy="200" r="6" fill="rgba(245,240,232,0.35)"/>
                <circle cx="30" cy="200" r="6" fill="rgba(245,240,232,0.35)"/>
                <text x="140" y="28" textAnchor="middle" fill="rgba(245,240,232,0.15)" fontSize="11" fontFamily="DM Sans" letterSpacing="2">EASY</text>
                <text x="262" y="218" textAnchor="middle" fill="rgba(245,240,232,0.5)" fontSize="11" fontFamily="DM Sans" letterSpacing="2">FAST</text>
                <text x="18" y="218" textAnchor="middle" fill="rgba(245,240,232,0.5)" fontSize="11" fontFamily="DM Sans" letterSpacing="2">BIG</text>
              </svg>
              <div style={{ fontSize: "0.65rem", color: "rgba(245,240,232,0.25)", marginTop: "0.5rem", fontStyle: "italic" }}>pick two</div>
            </div>
          </div>
          <div style={{ fontSize: "0.78rem", color: "rgba(245,240,232,0.3)", lineHeight: 1.7, maxWidth: "480px" }}>
            Most teams can't build crucial deliberately. One Day changes that.
          </div>
        </div>
      )}

      {phase >= 5 && (
        <div style={{ animation: "fadeUp 0.5s ease", display: "flex", gap: "10px" }}>
          <a href="https://tally.so/r/VLPjKa" target="_blank" rel="noopener noreferrer" style={{ padding: "1rem 2rem", background: "#2d8a6e", border: "none", color: "#f5f0e8", fontFamily: "'DM Sans', sans-serif", fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer", textDecoration: "none", display: "inline-block" }}>
            Book One Day →
          </a>
        </div>
      )}
    </div>
  );
}

export default function OneDayCTA() {
  const [step, setStep] = useState(0);
  const [best, setBest] = useState(0);
  const [avg, setAvg] = useState(0);
  const [deals, setDeals] = useState(0);
  const [reps, setReps] = useState(0);

  return (
    <div style={{ background: "#0a1a14", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "4rem 2.5rem", fontFamily: "'DM Sans', sans-serif", color: "#f5f0e8" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300;1,400&display=swap');
        @keyframes fadeUp { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        input[type=number]::-webkit-outer-spin-button,
        input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
        input[type=number] { -moz-appearance: textfield; }
      `}</style>
      <div style={{ width: "100%", maxWidth: "760px" }}>
        <div style={{ display: "flex", gap: "4px", marginBottom: "3rem" }}>
          {[0,1,2,3,4].map(i => (
            <div key={i} style={{ flex: 1, height: "2px", background: i <= step ? "#2d8a6e" : "rgba(45,138,110,0.1)", transition: "background 0.5s ease" }} />
          ))}
        </div>

        {step === 0 && (
          <div style={{ animation: "fadeUp 0.4s ease" }}>
            <div style={{ fontSize: "0.58rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "#2d8a6e", marginBottom: "1.5rem" }}>One Day — the cost of the gap</div>
            <CurrencyInput
              hint="What's your biggest confirmed deal this year?"
              sub="The one that closed at a number that surprised everyone. The proof of what's possible."
              onConfirm={v => { setBest(v); setStep(1); }}
            />
          </div>
        )}

        {step === 1 && (
          <div style={{ animation: "fadeUp 0.4s ease" }}>
            <CurrencyInput
              hint="What does the average deal actually close at?"
              sub="Not forecast. Not pipeline. What actually lands — confirmed, closed, recognized."
              onConfirm={v => { if (v < best) { setAvg(v); setStep(2); } }}
            />
          </div>
        )}

        {step === 2 && (
          <div style={{ animation: "fadeUp 0.4s ease" }}>
            <NumberInput
              hint="How many deals did your team close last quarter?"
              sub="Total across the whole team. Closed, recognized, done."
              unit="deals total"
              onConfirm={v => { setDeals(v); setStep(3); }}
            />
          </div>
        )}

        {step === 3 && (
          <div style={{ animation: "fadeUp 0.4s ease" }}>
            <NumberInput
              hint="How many reps on the team?"
              sub=""
              unit="reps"
              onConfirm={v => { setReps(v); setStep(4); }}
            />
          </div>
        )}

        {step === 4 && (
          <div style={{ animation: "fadeUp 0.4s ease" }}>
            <Decomp best={best} avg={avg} deals={deals} reps={reps} />
          </div>
        )}
      </div>
    </div>
  );
}