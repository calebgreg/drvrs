import { useState, useEffect, useRef } from "react";

const COLORS = {
  bg: "#0a1a14",
  surface: "#0f2219",
  surfaceHover: "#142a20",
  border: "rgba(245,240,232,0.06)",
  text: "#f5f0e8",
  textMuted: "#7a8a82",
  textDim: "rgba(245,240,232,0.3)",
  accent: "#2d8a6e",
  accentDim: "rgba(45,138,110,0.15)",
  accentGlow: "rgba(45,138,110,0.3)",
  warning: "#F59E0B",
  warningDim: "rgba(245, 158, 11, 0.15)",
  warningGlow: "rgba(245, 158, 11, 0.3)",
  constraint: "#EF4444",
  constraintDim: "rgba(239, 68, 68, 0.12)",
  constraintGlow: "rgba(239, 68, 68, 0.3)",
};

const fonts = {
  mono: "'JetBrains Mono', 'SF Mono', 'Fira Code', monospace",
  body: "'DM Sans', 'Helvetica Neue', sans-serif",
  display: "'DM Serif Display', Georgia, serif",
};

const stages = [
  { id: "intro", label: "Start" },
  { id: "goal", label: "Goal" },
  { id: "decomp", label: "System" },
  { id: "constraint", label: "Block" },
  { id: "shifts", label: "Shifts" },
  { id: "work", label: "Work" },
  { id: "playbook", label: "Plays" },
  { id: "proposal", label: "Proposal" },
];

// ─── Fade wrapper ───
function Fade({ show, delay = 0, children, style = {} }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (show) {
      const t = setTimeout(() => setVisible(true), delay);
      return () => clearTimeout(t);
    }
    setVisible(false);
  }, [show, delay]);
  return (
    <div style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(12px)",
      transition: "opacity 0.6s ease, transform 0.6s ease",
      ...style,
    }}>
      {children}
    </div>
  );
}

// ─── Tree Node ───
function TreeNode({ label, sublabel, x, y, active, isConstraint, delay = 0, show }) {
  const [vis, setVis] = useState(false);
  useEffect(() => {
    if (show) {
      const t = setTimeout(() => setVis(true), delay);
      return () => clearTimeout(t);
    }
  }, [show, delay]);

  const glowColor = isConstraint ? COLORS.constraintGlow : COLORS.accentGlow;
  const borderColor = isConstraint ? COLORS.constraint : active ? COLORS.accent : COLORS.border;
  const bgColor = isConstraint ? COLORS.constraintDim : active ? COLORS.accentDim : COLORS.surface;

  return (
    <g style={{ opacity: vis ? 1 : 0, transition: "opacity 0.5s ease" }}>
      {(active || isConstraint) && vis && (
        <circle cx={x} cy={y} r="52" fill="none" stroke={glowColor} strokeWidth="1" opacity="0.5">
          <animate attributeName="r" values="48;56;48" dur="3s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.5;0.2;0.5" dur="3s" repeatCount="indefinite" />
        </circle>
      )}
      <circle cx={x} cy={y} r="44" fill={bgColor} stroke={borderColor} strokeWidth="1.5" />
      <text x={x} y={sublabel ? y - 4 : y + 1} textAnchor="middle" dominantBaseline="middle"
        fill={isConstraint ? COLORS.constraint : active ? COLORS.accent : COLORS.text}
        fontSize="11" fontFamily={fonts.mono} fontWeight="600" letterSpacing="0.5">
        {label}
      </text>
      {sublabel && (
        <text x={x} y={y + 12} textAnchor="middle" dominantBaseline="middle"
          fill={COLORS.textDim} fontSize="8" fontFamily={fonts.mono}>
          {sublabel}
        </text>
      )}
    </g>
  );
}

// ─── Tree Edge ───
function TreeEdge({ x1, y1, x2, y2, show, delay = 0, isConstraintPath }) {
  const [vis, setVis] = useState(false);
  useEffect(() => {
    if (show) {
      const t = setTimeout(() => setVis(true), delay);
      return () => clearTimeout(t);
    }
  }, [show, delay]);

  const midY = (y1 + y2) / 2;
  const path = `M${x1},${y1 + 44} C${x1},${midY} ${x2},${midY} ${x2},${y2 - 44}`;

  return (
    <path d={path} fill="none"
      stroke={isConstraintPath ? COLORS.constraint : COLORS.textDim}
      strokeWidth={isConstraintPath ? "1.5" : "1"}
      strokeDasharray={vis ? "none" : "4 4"}
      opacity={vis ? (isConstraintPath ? 0.8 : 0.4) : 0}
      style={{ transition: "opacity 0.5s ease" }}
    />
  );
}

// ─── Phase Card ───
function PhaseCard({ number, title, description, status, delay, show }) {
  return (
    <Fade show={show} delay={delay}>
      <div style={{
        background: COLORS.surface,
        border: `1px solid ${COLORS.border}`,
        borderRadius: 8,
        padding: "20px 24px",
        marginBottom: 12,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <span style={{
            fontFamily: fonts.mono, fontSize: 11, color: COLORS.accent,
            background: COLORS.accentDim, padding: "3px 8px", borderRadius: 4, letterSpacing: 1,
          }}>PHASE {number}</span>
          <span style={{
            fontFamily: fonts.mono, fontSize: 10, color: COLORS.textDim,
            marginLeft: "auto", textTransform: "uppercase", letterSpacing: 1,
          }}>{status}</span>
        </div>
        <div style={{ fontFamily: fonts.body, fontSize: 17, color: COLORS.text, fontWeight: 600, marginBottom: 6 }}>
          {title}
        </div>
        <div style={{ fontFamily: fonts.body, fontSize: 14, color: COLORS.textMuted, lineHeight: 1.6 }}>
          {description}
        </div>
      </div>
    </Fade>
  );
}

// ─── Shift Card ───
function ShiftCard({ title, before, after, delay, show }) {
  return (
    <Fade show={show} delay={delay}>
      <div style={{
        background: COLORS.surface,
        border: `1px solid ${COLORS.border}`,
        borderRadius: 8,
        padding: "20px 24px",
        marginBottom: 12,
      }}>
        <div style={{ fontFamily: fonts.body, fontSize: 15, color: COLORS.text, fontWeight: 600, marginBottom: 12 }}>
          {title}
        </div>
        <div style={{ display: "flex", gap: 16 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: fonts.mono, fontSize: 9, color: COLORS.constraint, letterSpacing: 1.5, marginBottom: 6, textTransform: "uppercase" }}>Current</div>
            <div style={{ fontFamily: fonts.body, fontSize: 13, color: COLORS.textMuted, lineHeight: 1.5 }}>{before}</div>
          </div>
          <div style={{ width: 1, background: COLORS.border }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: fonts.mono, fontSize: 9, color: COLORS.accent, letterSpacing: 1.5, marginBottom: 6, textTransform: "uppercase" }}>Shift</div>
            <div style={{ fontFamily: fonts.body, fontSize: 13, color: COLORS.textMuted, lineHeight: 1.5 }}>{after}</div>
          </div>
        </div>
      </div>
    </Fade>
  );
}

// ─── Playbook helper components ───
function PlaybookText({ children }) {
  return <div style={{ fontFamily: fonts.body, fontSize: 13.5, color: COLORS.textMuted, lineHeight: 1.7, marginTop: 16 }}>{children}</div>;
}
function PlaybookLabel({ children }) {
  return <div style={{ fontFamily: fonts.mono, fontSize: 9, color: COLORS.accent, letterSpacing: 1.5, textTransform: "uppercase", marginTop: 20, marginBottom: 6 }}>{children}</div>;
}
function PlaybookQuote({ children }) {
  return (
    <div style={{
      fontFamily: fonts.display, fontStyle: "italic", fontSize: 15,
      color: COLORS.text, lineHeight: 1.6,
      borderLeft: `2px solid ${COLORS.accent}44`, paddingLeft: 16,
      marginTop: 14, marginBottom: 6,
    }}>{children}</div>
  );
}

// ─── Playbook Section ───
function PlaybookSection({ items }) {
  const [open, setOpen] = useState(null);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <Fade key={i} show delay={150 + i * 100}>
            <div style={{
              background: COLORS.surface,
              border: `1px solid ${isOpen ? COLORS.accent + "44" : COLORS.border}`,
              borderRadius: 8,
              overflow: "hidden",
              transition: "border-color 0.3s ease",
            }}>
              <button onClick={() => setOpen(isOpen ? null : i)} style={{
                width: "100%", background: "none", border: "none", cursor: "pointer",
                padding: "18px 24px",
                display: "flex", alignItems: "center", justifyContent: "space-between",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{
                    fontFamily: fonts.mono, fontSize: 9, color: COLORS.accent,
                    background: COLORS.accentDim, padding: "3px 8px", borderRadius: 4,
                    letterSpacing: 1.5, textTransform: "uppercase",
                  }}>{item.tag}</span>
                  <span style={{ fontFamily: fonts.body, fontSize: 15, color: COLORS.text, fontWeight: 500 }}>
                    {item.title}
                  </span>
                </div>
                <span style={{
                  fontFamily: fonts.body, fontSize: 18, color: COLORS.accent,
                  transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                  transition: "transform 0.3s ease",
                }}>+</span>
              </button>
              <div style={{
                maxHeight: isOpen ? 2000 : 0,
                opacity: isOpen ? 1 : 0,
                overflow: "hidden",
                transition: "max-height 0.5s cubic-bezier(0.16,1,0.3,1), opacity 0.4s ease",
              }}>
                <div style={{
                  padding: "0 24px 24px 24px",
                  borderTop: `1px solid ${COLORS.border}`,
                }}>
                  {item.visual && (
                    <div style={{ margin: "20px 0 8px", display: "flex", justifyContent: "center" }}>
                      {item.visual}
                    </div>
                  )}
                  {item.content}
                </div>
              </div>
            </div>
          </Fade>
        );
      })}
    </div>
  );
}

// ─── Playbook Visuals ───
function MissedCallsVisual() {
  const hours = ["5pm", "6pm", "7pm", "8pm", "9pm", "Sat", "Sun"];
  const calls = [
    { h: 0, val: "$340" },
    { h: 1, val: "$220" },
    { h: 1, val: "$180" },
    { h: 2, val: "$510" },
    { h: 3, val: "$290" },
    { h: 4, val: "$175" },
    { h: 5, val: "$420" },
    { h: 5, val: "$315" },
    { h: 6, val: "$260" },
  ];
  const positions = [
    { left: 1, top: 4 }, { left: 15, top: 20 }, { left: 13, top: 36 },
    { left: 29, top: 8 }, { left: 43, top: 28 }, { left: 57, top: 12 },
    { left: 71, top: 4 }, { left: 73, top: 28 }, { left: 86, top: 16 },
  ];
  return (
    <div style={{ width: "100%", maxWidth: 440 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
        {hours.map(h => (
          <div key={h} style={{
            fontFamily: fonts.mono, fontSize: 8, color: COLORS.textDim,
            letterSpacing: "0.05em", textAlign: "center", flex: 1,
          }}>{h}</div>
        ))}
      </div>
      <div style={{ position: "relative", height: 48, borderBottom: `1px solid ${COLORS.border}` }}>
        {calls.map((c, i) => (
          <div key={i} style={{
            position: "absolute", left: `${positions[i].left}%`, top: positions[i].top,
            display: "flex", alignItems: "center", gap: 4,
          }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: COLORS.constraint, opacity: 0.6 }} />
            <span style={{ fontFamily: fonts.mono, fontSize: 8, color: COLORS.constraint, opacity: 0.5 }}>{c.val}</span>
          </div>
        ))}
      </div>
      <div style={{ fontFamily: fonts.mono, fontSize: 8, color: COLORS.textDim, marginTop: 8, textAlign: "center", letterSpacing: "0.1em" }}>
        MISSED INBOUND · ONE WEEK · ONE AGENCY
      </div>
    </div>
  );
}

function NetworkVisual() {
  const cx = 200, cy = 70;
  const members = Array.from({ length: 12 }, (_, i) => {
    const angle = (i / 12) * Math.PI * 2 - Math.PI / 2;
    return { x: cx + Math.cos(angle) * 55, y: cy + Math.sin(angle) * 45 };
  });
  return (
    <svg width="400" height="150" viewBox="0 0 400 150" style={{ width: "100%", maxWidth: 400 }}>
      {members.map((m, i) => (
        <line key={i} x1={cx} y1={cy} x2={m.x} y2={m.y} stroke="#2d8a6e" strokeWidth="0.5" opacity="0.3" />
      ))}
      {members.map((m, i) => (
        <circle key={`n${i}`} cx={m.x} cy={m.y} r="4" fill="#0a1a14" stroke="#2d8a6e" strokeWidth="1" opacity="0.6" />
      ))}
      <circle cx={cx} cy={cy} r="10" fill="rgba(45,138,110,0.15)" stroke="#2d8a6e" strokeWidth="1.5" />
      <text x={cx} y={cy + 3} textAnchor="middle" fontSize="6" fontFamily={fonts.mono} fill="#2d8a6e" letterSpacing="0.05em">CG</text>
      <line x1="320" y1="45" x2={cx + 10} y2={cy} stroke="#2d8a6e" strokeWidth="0.5" opacity="0.2" strokeDasharray="3 3" />
      <circle cx="340" cy="40" r="8" fill="rgba(45,138,110,0.08)" stroke="#2d8a6e" strokeWidth="1" opacity="0.4" />
      <text x="340" y="43" textAnchor="middle" fontSize="5" fontFamily={fonts.mono} fill="#2d8a6e" opacity="0.6">MGA</text>
      <line x1="60" y1="45" x2={cx - 10} y2={cy} stroke="#2d8a6e" strokeWidth="0.5" opacity="0.2" strokeDasharray="3 3" />
      <circle cx="40" cy="40" r="8" fill="rgba(45,138,110,0.08)" stroke="#2d8a6e" strokeWidth="1" opacity="0.4" />
      <text x="40" y="43" textAnchor="middle" fontSize="5" fontFamily={fonts.mono} fill="#2d8a6e" opacity="0.6">BIG I</text>
      <text x={cx} y="138" textAnchor="middle" fontSize="7" fontFamily={fonts.mono} fill={COLORS.textDim} letterSpacing="0.15em">TRUST FLOWS THROUGH NODES</text>
    </svg>
  );
}

function ConversationVisual() {
  return (
    <div style={{ display: "flex", gap: 24, alignItems: "flex-end", width: "100%", maxWidth: 360 }}>
      <div style={{ flex: 1, textAlign: "center" }}>
        <div style={{
          height: 48, background: "rgba(45,138,110,0.06)",
          borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center",
          border: `1px solid ${COLORS.border}`,
        }}>
          <span style={{ fontFamily: fonts.mono, fontSize: 20, color: COLORS.textDim }}>500</span>
        </div>
        <div style={{ fontFamily: fonts.mono, fontSize: 8, color: COLORS.textDim, marginTop: 8, letterSpacing: "0.1em" }}>AUTOMATED EMAILS</div>
        <div style={{ fontFamily: fonts.mono, fontSize: 8, color: COLORS.textDim, marginTop: 2, opacity: 0.5 }}>CURIOUS CLICKS</div>
      </div>
      <div style={{ fontFamily: fonts.display, fontSize: 14, color: COLORS.textDim, paddingBottom: 28 }}>vs</div>
      <div style={{ flex: 1, textAlign: "center" }}>
        <div style={{
          height: 48, background: COLORS.accentDim,
          borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center",
          border: `1px solid ${COLORS.accent}33`,
        }}>
          <span style={{ fontFamily: fonts.mono, fontSize: 20, color: COLORS.accent }}>10</span>
        </div>
        <div style={{ fontFamily: fonts.mono, fontSize: 8, color: COLORS.accent, marginTop: 8, letterSpacing: "0.1em" }}>REAL CONVERSATIONS</div>
        <div style={{ fontFamily: fonts.mono, fontSize: 8, color: COLORS.accent, marginTop: 2, opacity: 0.6 }}>VISIBLE REACTIONS</div>
      </div>
    </div>
  );
}

function CircuitVisual() {
  return (
    <svg width="420" height="180" viewBox="0 0 420 180" style={{ width: "100%", maxWidth: 420 }}>
      <defs>
        <clipPath id="circClip"><rect x="0" y="0" width="420" height="160" /></clipPath>
      </defs>
      <g clipPath="url(#circClip)">
        <circle cx="130" cy="80" r="72" fill="rgba(45,138,110,0.07)" stroke="#2d8a6e" strokeWidth="1" opacity="0.5" />
        <circle cx="195" cy="72" r="65" fill="rgba(45,138,110,0.07)" stroke="#2d8a6e" strokeWidth="1" opacity="0.45" />
        <circle cx="255" cy="78" r="60" fill="rgba(45,138,110,0.07)" stroke="#2d8a6e" strokeWidth="1" opacity="0.4" />
        <circle cx="310" cy="85" r="55" fill="rgba(45,138,110,0.07)" stroke="#2d8a6e" strokeWidth="1" opacity="0.35" />
        <circle cx="210" cy="78" r="30" fill="rgba(45,138,110,0.12)" stroke="none" />
        {[
          [145,55],[155,95],[120,72],[138,110],[168,60],[175,88],[185,42],
          [200,68],[210,90],[195,105],[218,55],[230,78],[240,95],[225,110],
          [255,62],[268,85],[275,105],[290,70],[305,90],[315,110],[298,55],
          [160,75],[190,72],[220,82],[250,75],[280,80],[205,78],[215,70],
          [170,48],[235,50],[260,100],[140,88],[300,100],[180,110],[245,42],
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="2" fill="#2d8a6e" opacity={0.25 + (x > 175 && x < 250 ? 0.25 : 0)} />
        ))}
        <text x="80" y="80" textAnchor="middle" fontSize="8" fontFamily={fonts.mono} fill="#2d8a6e" opacity="0.7" letterSpacing="0.06em">BIG I</text>
        <text x="80" y="90" textAnchor="middle" fontSize="8" fontFamily={fonts.mono} fill="#2d8a6e" opacity="0.7" letterSpacing="0.06em">STATE</text>
        <text x="195" y="22" textAnchor="middle" fontSize="8" fontFamily={fonts.mono} fill="#2d8a6e" opacity="0.6" letterSpacing="0.06em">APPLIED</text>
        <text x="195" y="32" textAnchor="middle" fontSize="8" fontFamily={fonts.mono} fill="#2d8a6e" opacity="0.6" letterSpacing="0.06em">NET</text>
        <text x="290" y="22" textAnchor="middle" fontSize="8" fontFamily={fonts.mono} fill="#2d8a6e" opacity="0.5" letterSpacing="0.06em">NETVU</text>
        <text x="350" y="78" textAnchor="middle" fontSize="8" fontFamily={fonts.mono} fill="#2d8a6e" opacity="0.45" letterSpacing="0.06em">CLUSTER</text>
        <text x="350" y="88" textAnchor="middle" fontSize="8" fontFamily={fonts.mono} fill="#2d8a6e" opacity="0.45" letterSpacing="0.06em">MTG</text>
      </g>
      <text x="210" y="172" textAnchor="middle" fontSize="8" fontFamily={fonts.mono} fill={COLORS.textDim} letterSpacing="0.18em">THE OVERLAP IS THE OPPORTUNITY</text>
    </svg>
  );
}

function FanAmplifyVisual() {
  return (
    <svg width="360" height="80" viewBox="0 0 360 80" style={{ width: "100%", maxWidth: 360 }}>
      <circle cx="30" cy="40" r="10" fill="rgba(45,138,110,0.15)" stroke="#2d8a6e" strokeWidth="1.5" />
      <text x="30" y="43" textAnchor="middle" fontSize="7" fontFamily={fonts.mono} fill="#2d8a6e">1</text>
      <line x1="45" y1="40" x2="85" y2="40" stroke="#2d8a6e" strokeWidth="1" opacity="0.4" />
      <text x="65" y="32" textAnchor="middle" fontSize="6" fontFamily={fonts.mono} fill={COLORS.textDim}>tells</text>
      {[0, 1, 2].map(i => {
        const y = 20 + i * 20;
        return (
          <g key={i}>
            <circle cx="105" cy={y} r="7" fill="rgba(45,138,110,0.08)" stroke="#2d8a6e" strokeWidth="1" opacity="0.6" />
            <line x1="115" y1={y} x2="145" y2={y} stroke="#2d8a6e" strokeWidth="0.5" opacity="0.3" />
            {[0, 1, 2].map(j => {
              const y2 = y - 8 + j * 8;
              return (
                <g key={j}>
                  <line x1="145" y1={y} x2="165" y2={y2} stroke="#2d8a6e" strokeWidth="0.5" opacity="0.2" />
                  <circle cx="170" cy={y2} r="4" fill="rgba(45,138,110,0.04)" stroke="#2d8a6e" strokeWidth="0.5" opacity="0.4" />
                </g>
              );
            })}
          </g>
        );
      })}
      <line x1="195" y1="40" x2="230" y2="40" stroke="#2d8a6e" strokeWidth="1" opacity="0.3" strokeDasharray="3 3" />
      <text x="213" y="32" textAnchor="middle" fontSize="6" fontFamily={fonts.mono} fill={COLORS.textDim}>then</text>
      <rect x="240" y="25" width="100" height="30" rx="4" fill="rgba(45,138,110,0.08)" stroke="#2d8a6e" strokeWidth="0.5" opacity="0.5" />
      <text x="290" y="43" textAnchor="middle" fontSize="7" fontFamily={fonts.mono} fill="#2d8a6e" opacity="0.7" letterSpacing="0.08em">ADS COMPOUND</text>
    </svg>
  );
}

export default function DrvrsEngagement({ room }) {
  const [stage, setStage] = useState(0);
  const [treePhase, setTreePhase] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (stages[stage].id === "decomp") {
      const timers = [
        setTimeout(() => setTreePhase(1), 400),
        setTimeout(() => setTreePhase(2), 900),
        setTimeout(() => setTreePhase(3), 1400),
      ];
      return () => timers.forEach(clearTimeout);
    }
    if (stages[stage].id === "constraint") setTreePhase(4);
  }, [stage]);

  const canNext = stage < stages.length - 1;
  const canPrev = stage > 0;
  const currentId = stages[stage].id;

  return (
    <div ref={containerRef} style={{ minHeight: "100vh", background: COLORS.bg, color: COLORS.text, fontFamily: fonts.body, position: "relative", overflow: "hidden" }}>
      <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=DM+Sans:wght@300;400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap" rel="stylesheet" />

      {/* Grain */}
      <div style={{ position: "fixed", inset: 0, opacity: 0.035, backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`, backgroundSize: "200px 200px", pointerEvents: "none", zIndex: 1000 }} />

      {/* Top nav */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "2rem 3rem", mixBlendMode: "difference" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.7rem" }}>
          <div style={{ width: 26, height: 12, background: COLORS.text, borderRadius: 6, flexShrink: 0 }} />
          <span style={{ fontFamily: fonts.body, fontSize: "1.1rem", fontWeight: 400, color: COLORS.text, letterSpacing: "0.1em" }}>drvrs</span>

        </div>
        <div style={{ fontFamily: fonts.body, fontSize: "0.78rem", fontWeight: 400, letterSpacing: "0.1em", textTransform: "uppercase", color: COLORS.text, opacity: 0.5 }}>
          {room?.companyName?.toUpperCase()}
        </div>
      </div>

      {/* Stage indicator */}
      <div style={{ position: "fixed", left: 32, top: "50%", transform: "translateY(-50%)", zIndex: 100, display: "flex", flexDirection: "column", gap: 8 }}>
        {stages.map((s, i) => (
          <button key={s.id} onClick={() => setStage(i)} style={{
            padding: "6px 0", width: 48, borderRadius: 4,
            background: i === stage ? COLORS.accentDim : "transparent",
            border: `1px solid ${i === stage ? COLORS.accent : i < stage ? COLORS.textDim : COLORS.border}`,
            color: i === stage ? COLORS.accent : i < stage ? COLORS.textMuted : COLORS.textDim,
            fontFamily: fonts.mono, fontSize: 8, letterSpacing: "0.05em",
            textTransform: "uppercase", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "all 0.3s ease",
          }}>{s.label}</button>
        ))}
      </div>

      {/* Main */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "100px 80px 120px 80px", minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: currentId === "playbook" ? "flex-start" : "center" }}>

        {/* INTRO */}
        {currentId === "intro" && (
          <div style={{ textAlign: "center" }}>
            <Fade show delay={200}>
              <div style={{ fontFamily: fonts.mono, fontSize: 10, color: COLORS.textDim, letterSpacing: 3, textTransform: "uppercase", marginBottom: 48 }}>
                Prepared for {room?.companyName}
              </div>
            </Fade>
            <Fade show delay={500}>
              <div style={{ fontFamily: fonts.display, fontSize: 48, fontWeight: 400, color: COLORS.text, letterSpacing: 0.5, lineHeight: 1.2, marginBottom: 48 }}>
                GTM Strategy
              </div>
            </Fade>
            <Fade show delay={800}>
              <div style={{ fontFamily: fonts.body, fontSize: 15, color: COLORS.textMuted, maxWidth: 380, margin: "0 auto", lineHeight: 1.7 }}>
                A look at the system that should be producing your first 50 customers, where it is stuck, and what to do about it.
              </div>
            </Fade>
            <Fade show delay={1100}>
              <div style={{ fontFamily: fonts.mono, fontSize: 10, color: COLORS.textDim, letterSpacing: 2, marginTop: 48 }}>
                CALEB CRAMER · DRVRS.IO
              </div>
            </Fade>
          </div>
        )}

        {/* GOAL */}
        {currentId === "goal" && (
          <div>
            <Fade show delay={100}><div style={{ fontFamily: fonts.mono, fontSize: 10, color: COLORS.accent, letterSpacing: 3, marginBottom: 32 }}>01 — THE GOAL</div></Fade>
            <Fade show delay={300}><div style={{ fontFamily: fonts.display, fontSize: 40, fontWeight: 400, color: COLORS.text, marginBottom: 32, lineHeight: 1.2 }}>{room?.goalTitle}</div></Fade>
            <Fade show delay={600}><div style={{ fontFamily: fonts.body, fontSize: 16, color: COLORS.textMuted, lineHeight: 1.8, marginBottom: 24, maxWidth: 600 }}>{room?.goalDescription}</div></Fade>
            <Fade show delay={900}><div style={{ fontFamily: fonts.mono, fontSize: 13, color: COLORS.accent, background: COLORS.accentDim, display: "inline-block", padding: "8px 16px", borderRadius: 4, letterSpacing: 0.5 }}>{room?.goalCallout}</div></Fade>
            <Fade show delay={1200}><div style={{ fontFamily: fonts.body, fontSize: 16, color: COLORS.textMuted, lineHeight: 1.8, marginTop: 32, maxWidth: 600 }}>{room?.goalFooter}</div></Fade>
          </div>
        )}

        {/* DECOMP */}
        {currentId === "decomp" && (
          <div>
            <Fade show delay={100}><div style={{ fontFamily: fonts.mono, fontSize: 10, color: COLORS.accent, letterSpacing: 3, marginBottom: 24 }}>02 — THE SYSTEM</div></Fade>
            <Fade show delay={200}><div style={{ fontFamily: fonts.body, fontSize: 15, color: COLORS.textMuted, lineHeight: 1.7, marginBottom: 32, maxWidth: 560 }}>{room?.decompositionDescription}</div></Fade>
            <div style={{ display: "flex", justifyContent: "center", margin: "20px 0" }}>
              <svg width="520" height="240" viewBox="0 0 520 240">
                <TreeEdge x1={260} y1={60} x2={110} y2={180} show={treePhase >= 2} delay={0} />
                <TreeEdge x1={260} y1={60} x2={260} y2={180} show={treePhase >= 2} delay={150} />
                <TreeEdge x1={260} y1={60} x2={410} y2={180} show={treePhase >= 2} delay={300} />
                {treePhase >= 2 && <>
                  <text x="185" y="186" textAnchor="middle" fill={COLORS.textDim} fontSize="16" fontFamily={fonts.mono}>×</text>
                  <text x="335" y="186" textAnchor="middle" fill={COLORS.textDim} fontSize="16" fontFamily={fonts.mono}>×</text>
                </>}
                <TreeNode label="PMF" x={260} y={60} active show={treePhase >= 1} delay={0} />
                <TreeNode label="PROMISE" x={110} y={180} active show={treePhase >= 2} delay={0} />
                <TreeNode label="DELIVERY" x={260} y={180} active show={treePhase >= 2} delay={150} />
                <TreeNode label="EVIDENCE" x={410} y={180} active show={treePhase >= 2} delay={300} />
              </svg>
            </div>
            <Fade show delay={1200}>
              <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
                {[
                  { label: "Promise", desc: "Can you name the outcome you produce?" },
                  { label: "Delivery", desc: "Does the product produce it on purpose?" },
                  { label: "Evidence", desc: "Can you prove it happened?" },
                ].map((item, i) => (
                  <div key={i} style={{ flex: 1, background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: "14px 16px" }}>
                    <div style={{ fontFamily: fonts.mono, fontSize: 9, color: COLORS.accent, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 6 }}>{item.label}</div>
                    <div style={{ fontFamily: fonts.body, fontSize: 13, color: COLORS.textMuted, lineHeight: 1.5 }}>{item.desc}</div>
                  </div>
                ))}
              </div>
            </Fade>
          </div>
        )}

        {/* CONSTRAINT */}
        {currentId === "constraint" && (
          <div>
            <Fade show delay={100}><div style={{ fontFamily: fonts.mono, fontSize: 10, color: COLORS.constraint, letterSpacing: 3, marginBottom: 24 }}>03 — THE CONSTRAINT</div></Fade>
            <div style={{ display: "flex", justifyContent: "center", margin: "0 0 24px 0" }}>
              <svg width="520" height="240" viewBox="0 0 520 240">
                <TreeEdge x1={260} y1={60} x2={110} y2={180} show delay={0} isConstraintPath />
                <TreeEdge x1={260} y1={60} x2={260} y2={180} show delay={0} />
                <TreeEdge x1={260} y1={60} x2={410} y2={180} show delay={0} />
                <text x="185" y="186" textAnchor="middle" fill={COLORS.textDim} fontSize="16" fontFamily={fonts.mono}>×</text>
                <text x="335" y="186" textAnchor="middle" fill={COLORS.textDim} fontSize="16" fontFamily={fonts.mono}>×</text>
                <TreeNode label="PMF" x={260} y={60} active show delay={0} />
                <TreeNode label="PROMISE" x={110} y={180} isConstraint show delay={0} />
                <TreeNode label="DELIVERY" x={260} y={180} active show delay={0} />
                <TreeNode label="EVIDENCE" x={410} y={180} show delay={0} />
              </svg>
            </div>
            <Fade show delay={300}>
              <div style={{ background: COLORS.constraintDim, border: `1px solid ${COLORS.constraint}33`, borderRadius: 8, padding: "20px 24px", marginBottom: 20 }}>
                <div style={{ fontFamily: fonts.mono, fontSize: 10, color: COLORS.constraint, letterSpacing: 2, marginBottom: 8 }}>CONSTRAINT IDENTIFIED</div>
                <div style={{ fontFamily: fonts.body, fontSize: 16, color: COLORS.text, lineHeight: 1.7 }}>The current positioning leads with a feature comparison, not an outcome. When the promise is undefined, delivery is accidental and evidence is unmeasurable.</div>
              </div>
            </Fade>
            <Fade show delay={600}><div style={{ fontFamily: fonts.body, fontSize: 15, color: COLORS.textMuted, lineHeight: 1.7, maxWidth: 560 }}>The product works. The problem is real. But the way it is described to the market does not name the outcome the customer experiences. That gap is where PMF stalls.</div></Fade>
          </div>
        )}

        {/* SHIFTS */}
        {currentId === "shifts" && (
          <div>
            <Fade show delay={100}><div style={{ fontFamily: fonts.mono, fontSize: 10, color: COLORS.accent, letterSpacing: 3, marginBottom: 32 }}>04 — WHAT CHANGES</div></Fade>
            <ShiftCard show delay={200} title="The Promise" before="Feature comparison. Cheaper than alternatives. The conversation starts with price." after="A specific outcome compelling enough that agencies pay a premium for it. Price stops being the reason to buy and stops being the objection." />
            <ShiftCard show delay={400} title="How Delivery Gets Validated" before="Sign up customers and hope the product clicks. Adoption is passive." after="Engineer the outcome for early customers. Make sure the event happens. Measure whether it repeats." />
            <ShiftCard show delay={600} title="How Evidence Gets Built" before="Testimonials and logos. Social proof without specificity." after="A measurable pattern. What percentage of customers experience the outcome, how often, and how reliably." />
            <ShiftCard show delay={800} title="How Growth Works" before="Paid ads to a broad audience. Expensive, low signal." after="Early customers who experienced the outcome become the distribution channel. Their language becomes the marketing. Their networks become the pipeline." />
          </div>
        )}

        {/* WORK */}
        {currentId === "work" && (
          <div>
            <Fade show delay={100}><div style={{ fontFamily: fonts.mono, fontSize: 10, color: COLORS.accent, letterSpacing: 3, marginBottom: 32 }}>05 — THE WORK</div></Fade>
            <PhaseCard show delay={200} number="1" title="Define the Promise" status="Ready" description="One working session to name the outcome Insurvoice produces for an agency. Not the feature. The event the customer experiences. This becomes the positioning, the demo talk track, and the outbound language. Half-day." />
            <PhaseCard show delay={400} number="2" title="Validate Delivery" status="Pending" description="Identify the agency profile most likely to experience the outcome. Get 10 of them into the product. Engineer the event with each one. Cold outbound, direct conversations, hands-on onboarding. 30 to 45 days." />
            <PhaseCard show delay={600} number="3" title="Build the Evidence" status="Pending" description="Interview the agencies that experienced the outcome. Measure the pattern. Extract their language. Their words become the marketing copy, their referrals become the pipeline, their data becomes the proof that PMF is real." />
          </div>
        )}

        {/* PLAYBOOK */}
        {currentId === "playbook" && (
          <div>
            <Fade show delay={100}><div style={{ fontFamily: fonts.mono, fontSize: 10, color: COLORS.accent, letterSpacing: 3, marginBottom: 12 }}>06 — THE PLAYBOOK</div></Fade>
            <Fade show delay={200}><div style={{ fontFamily: fonts.body, fontSize: 14, color: COLORS.textMuted, lineHeight: 1.7, marginBottom: 28, maxWidth: 520 }}>This is yours whether we work together or not. Five plays, ready to run.</div></Fade>
            <PlaybookSection items={[
              {
                tag: "PROMISE",
                title: "The Outcome Already Exists",
                visual: <MissedCallsVisual />,
                content: (
                  <>
                    <PlaybookText>An independent agency with 4 producers and no dedicated ops staff misses inbound calls after 5pm, on weekends, and during lunch. Those calls are quote requests, renewal questions, and first notice of loss. Each one has a dollar value. The agency principal knows this. It keeps them up at night. They just have not heard anyone name it back to them as a solvable problem.</PlaybookText>
                    <PlaybookText>The product that names the outcome the buyer already feels is the product that gets bought at a premium. The product that describes its own features gets compared on price.</PlaybookText>
                  </>
                ),
              },
              {
                tag: "DISTRIBUTION",
                title: "How Insurance Actually Buys",
                visual: <NetworkVisual />,
                content: (
                  <>
                    <PlaybookText>Agency principals do not buy from ads. They buy from peers. The buying pattern in independent insurance is: someone in the cluster group mentions it, or someone at the Big I state conference mentions it, or their carrier rep mentions it. Three touches from three different trusted sources and the principal calls.</PlaybookText>
                    <PlaybookText>This means the fastest path to the first 10 customers is not a funnel. It is getting inside the rooms where principals already talk to each other. Cluster group meetings. State association events. Carrier advisory councils. A warm introduction from a cluster group leader to their 15 member agencies is worth more than 1,000 impressions.</PlaybookText>
                    <PlaybookText>The people who control these rooms are findable. There are roughly 40 to 50 meaningful cluster groups in the US, a Big I association in every state, and a handful of MGA and carrier relationships in every region who want their appointed agencies performing better. These are the nodes.</PlaybookText>
                  </>
                ),
              },
              {
                tag: "OUTBOUND",
                title: "Conversations, Not Campaigns",
                visual: <ConversationVisual />,
                content: (
                  <>
                    <PlaybookText>Paid advertising is a scale tool. It amplifies a signal that already exists. Before the signal exists, every dollar spent on ads is a guess. The signal comes from direct conversations where the reaction is visible.</PlaybookText>
                    <PlaybookText>An agency principal who sighs when asked about their after-hours calls is a different lead than an agency principal who clicks an ad. The sigh means they feel the problem. The click means they were curious. At this stage, the sigh is worth more. It can only be found in a real conversation.</PlaybookText>
                    <PlaybookText>The math on early outbound is counterintuitive. 10 deeply researched, personalized conversations per day will find the first believers faster than 500 automated emails. The believers are not hiding. They are just not being asked the right question by someone who understands their day.</PlaybookText>
                  </>
                ),
              },
              {
                tag: "EVENTS",
                title: "The Conference Circuit Is Small",
                visual: <CircuitVisual />,
                content: (
                  <>
                    <PlaybookText>Insurance is a small industry that thinks it is big. There are a finite number of events where independent agency principals gather. State Big I conferences. Applied Net. NetVu. Regional cluster group meetings. The same 200 to 300 agency principals show up repeatedly.</PlaybookText>
                    <PlaybookText>This is an advantage. A consistent presence at 4 to 5 events per year creates recognition that paid channels cannot replicate. The principal who sees the same company at three different events in six months starts to think "they are everywhere" even though the audience is the same 400 people.</PlaybookText>
                    <PlaybookText>The booth is not the play. The booth is proof of existence. The play is the attendee list, the pre-scheduled conversations, and the dinner the night before with 8 principals who match the profile. The event is a magnet that gathers the right people in one place. Everything around the event is where the work happens.</PlaybookText>
                  </>
                ),
              },
              {
                tag: "SCALE",
                title: "Fans Write the Playbook",
                visual: <FanAmplifyVisual />,
                content: (
                  <>
                    <PlaybookText>The agency principal who experienced the outcome and kept paying is the most credible voice in the market. More credible than the website. More credible than the sales deck. More credible than the founder on a podcast. When that principal tells a peer "this thing caught a call last Tuesday that would have been a lost policy," that is the most effective marketing that exists.</PlaybookText>
                    <PlaybookText>The words fans use to describe the product to their peers are the positioning, the ad copy, and the website headline. They just need to be captured. Three questions in a 15-minute interview surface them: what was happening before, what changed, and who else should know about this.</PlaybookText>
                    <PlaybookText>Paid advertising becomes a different instrument after this. Instead of guessing at messaging and audience, the language is proven and the targeting is specific. This is when ad spend starts compounding instead of burning.</PlaybookText>
                  </>
                ),
              },
            ]} />
          </div>
        )}

        {/* PROPOSAL */}
        {currentId === "proposal" && (
          <div>
            <Fade show delay={100}>
              <div style={{ fontFamily: fonts.mono, fontSize: 10, color: COLORS.accent, letterSpacing: 3, marginBottom: 8 }}>07 — THE PROPOSAL</div>
            </Fade>
            <Fade show delay={200}>
              <div style={{ fontFamily: fonts.display, fontSize: 36, fontWeight: 300, color: COLORS.text, marginBottom: 8, lineHeight: 1.2 }}>
                What working together looks like.
              </div>
            </Fade>
            <Fade show delay={350}>
              <div style={{ fontFamily: fonts.body, fontSize: 14, color: COLORS.textMuted, lineHeight: 1.7, marginBottom: 40, maxWidth: 520 }}>
                Two ways to engage. Both are scoped, fixed-fee, and built around a single constraint.
              </div>
            </Fade>
            <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 32 }}>
             {[
               {
                 name: "One Day",
                 basePrice: 2500,
                 timeline: "Half-day session",
                 deliverables: [
                   "Positioning statement built around the outcome",
                   "Target agency profile with disqualifiers",
                   "Outbound sequence ready to send",
                   "Revised demo talk track"
                 ],
                 highlighted: false
               },
               {
                 name: "One Initiative",
                 basePrice: 6000,
                 timeline: "60 Days",
                 deliverables: [
                   "Everything in One Day",
                   "10 target agencies identified and contacted",
                   "Hands-on onboarding to engineer the outcome",
                   "Fan interviews with extracted language",
                   "Referral channel map",
                   "Ad-ready copy from fan language"
                 ],
                 highlighted: true
               },
               {
                 name: "One Team",
                 basePrice: 32000,
                 timeline: "6 Months",
                 deliverables: [
                   "A drvr embedded in the team",
                   "GTM strategy owned end to end",
                   "Weekly working sessions",
                   "Outbound built and run until there is someone to hand it to",
                   "Conference strategy and event execution",
                   "First sales hire made when the system is ready for one",
                   "The goal is to leave something behind that works without us"
                 ],
                 highlighted: false
               }
             ].map((opt, i) => {
               const isOneDay = i === 0;
               const isSelected = selectedOption === i;
               const oneDaySelected = selectedOption === 0;
               const creditedPrice = oneDaySelected && !isOneDay ? opt.basePrice - 2500 : opt.basePrice;
               const displayPrice = `$${creditedPrice.toLocaleString()}`;
               const originalPrice = `$${opt.basePrice.toLocaleString()}`;

               return (
                <Fade key={i} show delay={400 + i * 200}>
                  <div style={{
                    background: isSelected ? COLORS.accentDim : (opt.highlighted ? "rgba(45,138,110,0.08)" : COLORS.surface),
                    border: `1px solid ${isSelected ? COLORS.accent : (opt.highlighted ? COLORS.accent + "55" : COLORS.border)}`,
                    borderRadius: 10, padding: "28px 32px", position: "relative",
                    cursor: "pointer",
                    transition: "all 0.2s ease"
                  }}>
                    {opt.highlighted && !isSelected && (
                      <div style={{ position: "absolute", top: -1, right: 24, background: COLORS.accent, color: "#0a1a14", fontFamily: fonts.mono, fontSize: 8, letterSpacing: 2, padding: "3px 10px", borderRadius: "0 0 6px 6px" }}>
                        RECOMMENDED
                      </div>
                    )}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16, flexWrap: "wrap", gap: 12 }}>
                      <div>
                        <div style={{ fontFamily: fonts.mono, fontSize: 10, color: opt.highlighted && !oneDaySelected ? COLORS.accent : COLORS.textMuted, letterSpacing: 2, marginBottom: 6 }}>{opt.name?.toUpperCase()}</div>
                        <div style={{ fontFamily: fonts.body, fontSize: 14, color: COLORS.textMuted }}>{opt.timeline}</div>
                      </div>
                      <div>
                        <div style={{ fontFamily: fonts.display, fontSize: 32, color: COLORS.text, fontWeight: 400 }}>
                          {displayPrice}
                        </div>
                        {oneDaySelected && !isOneDay && (
                          <div style={{ fontFamily: fonts.body, fontSize: 12, color: COLORS.textDim, textDecoration: "line-through", marginTop: 4 }}>
                            {originalPrice}
                          </div>
                        )}
                      </div>
                    </div>
                    {(opt.deliverables || []).length > 0 && (
                      <ul style={{ listStyle: "none", padding: 0, margin: "0 0 24px 0", display: "flex", flexDirection: "column", gap: 8 }}>
                        {opt.deliverables.filter(d => d.trim()).map((d, j) => (
                          <li key={j} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                            <span style={{ color: COLORS.accent, fontSize: 12, marginTop: 2, flexShrink: 0 }}>—</span>
                            <span style={{ fontFamily: fonts.body, fontSize: 14, color: COLORS.textMuted, lineHeight: 1.5 }}>{d}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    <a
                      href={`/room/${room?.slug}/sign?option=${i}${selectedOption === 0 && i !== 0 ? '&oneday=true' : ''}`}
                      onClick={(e) => {
                        setSelectedOption(i);
                      }}
                      style={{
                        display: "inline-block",
                        background: isSelected ? COLORS.accent : (opt.highlighted ? COLORS.accentDim : "transparent"),
                        border: `1px solid ${isSelected ? COLORS.accent : (opt.highlighted ? COLORS.accent : COLORS.border)}`,
                        borderRadius: 6, padding: "10px 24px",
                        fontFamily: fonts.mono, fontSize: 11,
                        color: isSelected ? "#0a1a14" : (opt.highlighted ? COLORS.accent : COLORS.textMuted),
                        letterSpacing: 1, textDecoration: "none", transition: "all 0.2s ease",
                      }}
                    >
                      REVIEW &amp; SIGN →
                    </a>
                  </div>
                </Fade>
              );
             })}
            </div>
            {room?.proposalNote && (
              <Fade show delay={800}>
                <div style={{ fontFamily: fonts.body, fontSize: 13, color: COLORS.textDim, lineHeight: 1.7, textAlign: "center", maxWidth: 480, margin: "0 auto 32px" }}>
                  {room.proposalNote}
                </div>
              </Fade>
            )}
            <Fade show delay={1000}>
              <div style={{ borderTop: `1px solid ${COLORS.border}`, paddingTop: 24, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
                <div style={{ fontFamily: fonts.body, fontSize: 13, color: COLORS.textDim, lineHeight: 1.6 }}>
                  Questions before signing? Let's talk through it.
                </div>
                <a
                  href="https://cal.com/calebcramer"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    flexShrink: 0,
                    background: "transparent",
                    border: `1px solid ${COLORS.border}`,
                    borderRadius: 6,
                    padding: "10px 24px",
                    fontFamily: fonts.mono,
                    fontSize: 10,
                    color: COLORS.textMuted,
                    letterSpacing: 1,
                    textDecoration: "none",
                    whiteSpace: "nowrap",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = COLORS.textDim; e.currentTarget.style.color = COLORS.text; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = COLORS.border; e.currentTarget.style.color = COLORS.textMuted; }}
                >
                  BOOK A CALL →
                </a>
              </div>
            </Fade>
          </div>
        )}
      </div>

      {/* Bottom nav */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 12, padding: "24px 32px", background: `linear-gradient(transparent, ${COLORS.bg}ee 30%, ${COLORS.bg})` }}>
        {canPrev && (
          <button
            onClick={() => setStage(s => s - 1)}
            onMouseEnter={e => { e.target.style.borderColor = COLORS.textDim; e.target.style.color = COLORS.text; }}
            onMouseLeave={e => { e.target.style.borderColor = COLORS.border; e.target.style.color = COLORS.textMuted; }}
            style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: "10px 24px", cursor: "pointer", fontFamily: fonts.mono, fontSize: 11, color: COLORS.textMuted, letterSpacing: 1, transition: "all 0.2s ease" }}
          >BACK</button>
        )}
        {canNext && (
          <button
            onClick={() => setStage(s => s + 1)}
            onMouseEnter={e => { e.target.style.background = COLORS.accentGlow; }}
            onMouseLeave={e => { e.target.style.background = COLORS.accentDim; }}
            style={{ background: COLORS.accentDim, border: `1px solid ${COLORS.accent}55`, borderRadius: 6, padding: "10px 32px", cursor: "pointer", fontFamily: fonts.mono, fontSize: 11, color: COLORS.accent, letterSpacing: 1, transition: "all 0.2s ease" }}
          >{stage === 0 ? "BEGIN" : "CONTINUE"}</button>
        )}
      </div>
    </div>
  );
}