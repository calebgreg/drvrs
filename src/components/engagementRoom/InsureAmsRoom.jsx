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
  { id: "engage", label: "Next" },
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
function ArgumentVisual() {
  return (
    <svg width="360" height="100" viewBox="0 0 360 100" style={{ width: "100%", maxWidth: 360 }}>
      {/* video frame */}
      <rect x="20" y="14" width="90" height="58" rx="5" fill="rgba(45,138,110,0.1)" stroke="#2d8a6e" strokeWidth="1.2" opacity="0.7" />
      <polygon points="58,32 58,54 76,43" fill="#2d8a6e" opacity="0.8" />
      {/* rays out to touchpoints */}
      {[
        { x: 200, y: 22, label: "CALLS" },
        { x: 215, y: 48, label: "GIFTS" },
        { x: 200, y: 74, label: "EMAILS" },
      ].map((t, i) => (
        <g key={i}>
          <line x1="112" y1={43} x2={t.x - 8} y2={t.y} stroke="#2d8a6e" strokeWidth="0.7" opacity="0.35" strokeDasharray="4 4" />
          <circle cx={t.x} cy={t.y} r="3" fill="#2d8a6e" opacity="0.6" />
          <text x={t.x + 10} y={t.y + 3} fontSize="7" fontFamily={fonts.mono} fill="#2d8a6e" opacity="0.7" letterSpacing="0.08em">{t.label}</text>
        </g>
      ))}
      <text x="65" y="90" textAnchor="middle" fontSize="7" fontFamily={fonts.mono}
        fill={COLORS.textDim} letterSpacing="0.14em">ONE ARGUMENT</text>
      <text x="290" y="90" textAnchor="middle" fontSize="7" fontFamily={fonts.mono}
        fill={COLORS.textDim} letterSpacing="0.14em">EVERY TOUCH POINTS BACK</text>
    </svg>
  );
}

function CouncilVisual() {
  const cx = 180, cy = 52;
  const seats = Array.from({ length: 20 }, (_, i) => {
    const angle = (i / 20) * Math.PI * 2 - Math.PI / 2;
    return { x: cx + Math.cos(angle) * 64, y: cy + Math.sin(angle) * 38 };
  });
  return (
    <svg width="360" height="120" viewBox="0 0 360 120" style={{ width: "100%", maxWidth: 360 }}>
      {seats.map((s, i) => (
        <line key={`l${i}`} x1={cx} y1={cy} x2={s.x} y2={s.y}
          stroke="#2d8a6e" strokeWidth="0.4" opacity="0.2" />
      ))}
      {seats.map((s, i) => (
        <circle key={i} cx={s.x} cy={s.y} r="3.5"
          fill="rgba(45,138,110,0.15)" stroke="#2d8a6e" strokeWidth="0.8" opacity="0.7" />
      ))}
      <circle cx={cx} cy={cy} r="14" fill="rgba(45,138,110,0.15)" stroke="#2d8a6e" strokeWidth="1.2" />
      <text x={cx} y={cy + 3} textAnchor="middle" fontSize="7" fontFamily={fonts.mono}
        fill="#2d8a6e" letterSpacing="0.05em">AMS</text>
      <text x={cx} y="112" textAnchor="middle" fontSize="7" fontFamily={fonts.mono}
        fill={COLORS.textDim} letterSpacing="0.16em">20 SEATS · ALREADY FILLED</text>
    </svg>
  );
}

function TwoHundredVisual() {
  const dots = [];
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 25; c++) {
      const i = r * 25 + c;
      dots.push({ x: 14 + c * 9.5, y: 12 + r * 9, fan: (i * 7 + 3) % 4 === 0 });
    }
  }
  return (
    <svg width="360" height="106" viewBox="0 0 360 106" style={{ width: "100%", maxWidth: 360 }}>
      {dots.map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r={d.fan ? 2.6 : 1.6}
          fill="#2d8a6e" opacity={d.fan ? 0.9 : 0.15} />
      ))}
      <text x="180" y="100" textAnchor="middle" fontSize="7" fontFamily={fonts.mono}
        fill={COLORS.textDim} letterSpacing="0.16em">200 CONVERSATIONS · 50 FANATICS INSIDE</text>
    </svg>
  );
}

function AirCoverVisual() {
  return (
    <svg width="360" height="104" viewBox="0 0 360 104" style={{ width: "100%", maxWidth: 360 }}>
      {/* wide field of faint envelopes/dots above */}
      {Array.from({ length: 40 }, (_, i) => {
        const x = 20 + (i % 20) * 17;
        const y = 14 + Math.floor(i / 20) * 14;
        return <rect key={i} x={x} y={y} width="8" height="5" rx="1"
          fill="none" stroke="#2d8a6e" strokeWidth="0.5" opacity="0.3" />;
      })}
      {/* ground level: one bright call */}
      <line x1="20" y1="62" x2="340" y2="62" stroke="rgba(245,240,232,0.08)" strokeWidth="1" />
      <circle cx="180" cy="78" r="6" fill="rgba(45,138,110,0.2)" stroke="#2d8a6e" strokeWidth="1.2" />
      <text x="194" y="81" fontSize="7" fontFamily={fonts.mono} fill="#2d8a6e" opacity="0.8" letterSpacing="0.08em">THE CALL LANDS WARM</text>
      <text x="180" y="99" textAnchor="middle" fontSize="7" fontFamily={fonts.mono}
        fill={COLORS.textDim} letterSpacing="0.16em">EDUCATION IN THE AIR · HAND-TO-HAND ON THE GROUND</text>
    </svg>
  );
}

function PlaybookText({ children }) {
  return <div style={{ fontFamily: fonts.body, fontSize: 13.5, color: COLORS.textMuted, lineHeight: 1.7, marginTop: 16 }}>{children}</div>;
}


export default function InsureAmsRoom() {
  const [stage, setStage] = useState(0);
  const [treePhase, setTreePhase] = useState(0);
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
    if (stages[stage].id === "constraint") {
      setTreePhase(4);
    }
  }, [stage]);

  const canNext = stage < stages.length - 1;
  const canPrev = stage > 0;
  const currentId = stages[stage].id;

  return (
    <div ref={containerRef} style={{
      minHeight: "100vh",
      background: COLORS.bg,
      color: COLORS.text,
      fontFamily: fonts.body,
      position: "relative",
      overflow: "hidden",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=DM+Sans:wght@300;400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap" rel="stylesheet" />

      {/* Grain overlay */}
      <div style={{
        position: "fixed", inset: 0, opacity: 0.035,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        backgroundSize: "200px 200px",
        pointerEvents: "none", zIndex: 1000,
      }} />

      {/* Top nav */}
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "2rem 3rem",
        mixBlendMode: "difference",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.7rem" }}>
          <div style={{
            width: 26, height: 12, background: COLORS.text,
            borderRadius: 6, transition: "width 0.4s ease", flexShrink: 0,
          }} />
          <span style={{
            fontFamily: fonts.body, fontSize: "1.1rem", fontWeight: 400,
            color: COLORS.text, letterSpacing: "0.1em",
          }}>
            drvrs
          </span>
        </div>
        <div style={{
          fontFamily: fonts.body, fontSize: "0.78rem", fontWeight: 400,
          letterSpacing: "0.1em", textTransform: "uppercase",
          color: COLORS.text, opacity: 0.5,
        }}>
          INSURE AMS
        </div>
      </div>

      {/* Stage indicator */}
      <div style={{
        position: "fixed", left: 32, top: "50%", transform: "translateY(-50%)", zIndex: 100,
        display: "flex", flexDirection: "column", gap: 8,
      }}>
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
          }}>
            {s.label}
          </button>
        ))}
      </div>

      {/* Main content area */}
      <div style={{
        maxWidth: 900, margin: "0 auto", padding: "100px 80px 120px 80px",
        minHeight: "100vh", display: "flex", flexDirection: "column",
        justifyContent: currentId === "playbook" ? "flex-start" : "center",
      }}>

        {/* ── INTRO ── */}
        {currentId === "intro" && (
          <div style={{ textAlign: "center" }}>
            <Fade show delay={200}>
              <div style={{
                fontFamily: fonts.mono, fontSize: 10, color: COLORS.textDim,
                letterSpacing: 3, textTransform: "uppercase", marginBottom: 48,
              }}>
                Prepared for Insure AMS
              </div>
            </Fade>
            <Fade show delay={500}>
              <div style={{
                fontFamily: fonts.display, fontSize: 48, fontWeight: 400,
                color: COLORS.text, letterSpacing: 0.5, lineHeight: 1.2,
                marginBottom: 48,
              }}>
                GTM Strategy
              </div>
            </Fade>
            <Fade show delay={800}>
              <div style={{
                fontFamily: fonts.body, fontSize: 15, color: COLORS.textMuted,
                maxWidth: 380, margin: "0 auto", lineHeight: 1.7,
              }}>
                A look at the system that should be producing your first 1,000 agencies, 
                where it is stuck, and what to do about it.
              </div>
            </Fade>
            <Fade show delay={1100}>
              <div style={{
                fontFamily: fonts.mono, fontSize: 10, color: COLORS.textDim,
                letterSpacing: 2, marginTop: 48,
              }}>
                CALEB CRAMER · DRVRS.IO
              </div>
            </Fade>
          </div>
        )}

        {/* ── GOAL ── */}
        {currentId === "goal" && (
          <div>
            <Fade show delay={100}>
              <div style={{ fontFamily: fonts.mono, fontSize: 10, color: COLORS.accent, letterSpacing: 3, marginBottom: 32 }}>
                01 — THE GOAL
              </div>
            </Fade>
            <Fade show delay={300}>
              <div style={{ fontFamily: fonts.display, fontSize: 40, fontWeight: 400, color: COLORS.text, marginBottom: 32, lineHeight: 1.2 }}>
                1,000 agencies.
              </div>
            </Fade>
            <Fade show delay={600}>
              <div style={{ fontFamily: fonts.body, fontSize: 16, color: COLORS.textMuted, lineHeight: 1.8, marginBottom: 24, maxWidth: 600 }}>
                1,000 is the estimate. The goal underneath it is enterprise value. 
                Consulting revenue, even great consulting revenue, does not compound into 
                a company someone buys. Platform revenue does.
              </div>
            </Fade>
            <Fade show delay={900}>
              <div style={{
                fontFamily: fonts.mono, fontSize: 13, color: COLORS.accent,
                background: COLORS.accentDim, display: "inline-block",
                padding: "8px 16px", borderRadius: 4, letterSpacing: 0.5,
              }}>
                The goal is enterprise value. 1,000 agencies is how it gets built.
              </div>
            </Fade>
            <Fade show delay={1200}>
              <div style={{ fontFamily: fonts.body, fontSize: 16, color: COLORS.textMuted, lineHeight: 1.8, marginTop: 32, maxWidth: 600 }}>
                That changes what matters. The question is not "when do we launch." 
                The question is "what system produces platform revenue, and where is it stuck."
              </div>
            </Fade>
          </div>
        )}

        {/* ── DECOMPOSITION ── */}
        {currentId === "decomp" && (
          <div>
            <Fade show delay={100}>
              <div style={{ fontFamily: fonts.mono, fontSize: 10, color: COLORS.accent, letterSpacing: 3, marginBottom: 24 }}>
                02 — THE SYSTEM
              </div>
            </Fade>
            <Fade show delay={200}>
              <div style={{ fontFamily: fonts.body, fontSize: 15, color: COLORS.textMuted, lineHeight: 1.7, marginBottom: 32, maxWidth: 560 }}>
                Revenue is a system. Volume × Conversion × Price. If any one collapses to zero, 
                revenue is zero. And each one is made of components. Volume is Reach × Relevance.
              </div>
            </Fade>
            <div style={{ display: "flex", justifyContent: "center", margin: "20px 0" }}>
              <svg width="520" height="330" viewBox="0 0 520 330">
                {/* Edges level 1 */}
                <TreeEdge x1={260} y1={55} x2={115} y2={165} show={treePhase >= 2} delay={0} />
                <TreeEdge x1={260} y1={55} x2={260} y2={165} show={treePhase >= 2} delay={150} />
                <TreeEdge x1={260} y1={55} x2={405} y2={165} show={treePhase >= 2} delay={300} />

                {/* Edges level 2 - Volume opens */}
                <TreeEdge x1={115} y1={165} x2={62} y2={275} show={treePhase >= 3} delay={0} />
                <TreeEdge x1={115} y1={165} x2={172} y2={275} show={treePhase >= 3} delay={150} />

                {/* Multiplication signs */}
                {treePhase >= 2 && <>
                  <text x="187" y="171" textAnchor="middle" fill={COLORS.textDim} fontSize="16" fontFamily={fonts.mono}>×</text>
                  <text x="332" y="171" textAnchor="middle" fill={COLORS.textDim} fontSize="16" fontFamily={fonts.mono}>×</text>
                </>}
                {treePhase >= 3 && (
                  <text x="117" y="281" textAnchor="middle" fill={COLORS.textDim} fontSize="14" fontFamily={fonts.mono}>×</text>
                )}

                {/* Root */}
                <TreeNode label="REVENUE" x={260} y={55} active show={treePhase >= 1} delay={0} />
                {/* Level 2 */}
                <TreeNode label="VOLUME" x={115} y={165} active show={treePhase >= 2} delay={0} />
                <TreeNode label="CONVERSION" x={260} y={165} show={treePhase >= 2} delay={150} />
                <TreeNode label="PRICE" x={405} y={165} show={treePhase >= 2} delay={300} />
                {/* Level 3 under Volume */}
                <TreeNode label="REACH" x={62} y={275} active show={treePhase >= 3} delay={0} />
                <TreeNode label="RELEVANCE" x={172} y={275} show={treePhase >= 3} delay={150} />
              </svg>
            </div>
            <Fade show delay={1600}>
              <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
                {[
                  { label: "Reach", desc: "Does the market know you exist?" },
                  { label: "Relevance", desc: "Does the message connect to a problem they feel?" },
                ].map((item, i) => (
                  <div key={i} style={{
                    flex: 1, background: COLORS.surface, border: `1px solid ${COLORS.border}`,
                    borderRadius: 6, padding: "14px 16px",
                  }}>
                    <div style={{ fontFamily: fonts.mono, fontSize: 9, color: COLORS.accent, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 6 }}>
                      {item.label}
                    </div>
                    <div style={{ fontFamily: fonts.body, fontSize: 13, color: COLORS.textMuted, lineHeight: 1.5 }}>
                      {item.desc}
                    </div>
                  </div>
                ))}
              </div>
            </Fade>
          </div>
        )}

        {/* ── CONSTRAINT ── */}
        {currentId === "constraint" && (
          <div>
            <Fade show delay={100}>
              <div style={{ fontFamily: fonts.mono, fontSize: 10, color: COLORS.constraint, letterSpacing: 3, marginBottom: 24 }}>
                03 — THE CONSTRAINT
              </div>
            </Fade>
            <div style={{ display: "flex", justifyContent: "center", margin: "0 0 24px 0" }}>
              <svg width="520" height="330" viewBox="0 0 520 330">
                <TreeEdge x1={260} y1={55} x2={115} y2={165} show delay={0} isConstraintPath />
                <TreeEdge x1={260} y1={55} x2={260} y2={165} show delay={0} />
                <TreeEdge x1={260} y1={55} x2={405} y2={165} show delay={0} />
                <TreeEdge x1={115} y1={165} x2={62} y2={275} show delay={0} isConstraintPath />
                <TreeEdge x1={115} y1={165} x2={172} y2={275} show delay={0} />

                <text x="187" y="171" textAnchor="middle" fill={COLORS.textDim} fontSize="16" fontFamily={fonts.mono}>×</text>
                <text x="332" y="171" textAnchor="middle" fill={COLORS.textDim} fontSize="16" fontFamily={fonts.mono}>×</text>
                <text x="117" y="281" textAnchor="middle" fill={COLORS.textDim} fontSize="14" fontFamily={fonts.mono}>×</text>

                <TreeNode label="REVENUE" x={260} y={55} active show delay={0} />
                <TreeNode label="VOLUME" x={115} y={165} active show delay={0} />
                <TreeNode label="CONVERSION" x={260} y={165} show delay={0} />
                <TreeNode label="PRICE" x={405} y={165} show delay={0} />
                <TreeNode label="REACH" x={62} y={275} isConstraint show delay={0} />
                <TreeNode label="RELEVANCE" x={172} y={275} show delay={0} />
              </svg>
            </div>
            <Fade show delay={300}>
              <div style={{
                background: COLORS.constraintDim, border: `1px solid ${COLORS.constraint}33`,
                borderRadius: 8, padding: "20px 24px", marginBottom: 20,
              }}>
                <div style={{ fontFamily: fonts.mono, fontSize: 10, color: COLORS.constraint, letterSpacing: 2, marginBottom: 8 }}>
                  CONSTRAINT IDENTIFIED
                </div>
                <div style={{ fontFamily: fonts.body, fontSize: 16, color: COLORS.text, lineHeight: 1.7 }}>
                  Reach is at zero. The market does not know the company exists, and the market 
                  is not looking for the category. Most agency principals are not thinking 
                  "I need to run my agency on a CRM." They think every AMS is equally broken.
                </div>
              </div>
            </Fade>
            <Fade show delay={600}>
              <div style={{ fontFamily: fonts.body, fontSize: 15, color: COLORS.textMuted, lineHeight: 1.7, maxWidth: 560 }}>
                Delivery is proven across 20 clients. The story is strong. But nothing flows 
                through a system the market cannot see, and conversion and price have nothing 
                to work with until it does. Building reach here means every touch has to teach.
              </div>
            </Fade>
          </div>
        )}

        {/* ── SHIFTS ── */}
        {currentId === "shifts" && (
          <div>
            <Fade show delay={100}>
              <div style={{ fontFamily: fonts.mono, fontSize: 10, color: COLORS.accent, letterSpacing: 3, marginBottom: 32 }}>
                04 — WHAT CHANGES
              </div>
            </Fade>
            <ShiftCard show delay={200}
              title="How the Market Hears About It"
              before="In stealth. No public presence yet."
              after="A full court press on why this exists, made by the founder. One argument, every format. A waitlist gives every touch somewhere to point."
            />
            <ShiftCard show delay={400}
              title="What the Message Teaches"
              before="The message describes the platform and what it does."
              after="Problem education. Teach why the policy-first data model is the reason everything feels stuck. Once a principal understands that, the conclusion sells itself."
            />
            <ShiftCard show delay={600}
              title="How the First Believers Are Found"
              before="No outbound motion running yet."
              after="Hand-to-hand. Roughly 200 direct conversations to find the first 50 fanatics of the product. Calls with a purpose. Gifts that earn attention."
            />
            <ShiftCard show delay={800}
              title="What the 20 Become"
              before="20 consulting clients on custom setups."
              after="An advisory council. Roadmap input, early access, first cross-sells onto the platform, and the reference base that makes the next 100 conversations easier."
            />
          </div>
        )}

        {/* ── THE WORK ── */}
        {currentId === "work" && (
          <div>
            <Fade show delay={100}>
              <div style={{ fontFamily: fonts.mono, fontSize: 10, color: COLORS.accent, letterSpacing: 3, marginBottom: 32 }}>
                05 — THE WORK
              </div>
            </Fade>
            <PhaseCard show delay={200} number="1" title="Make the Argument" status="Ready"
              description="A full court press on why this exists. The founder's argument in every format it can travel: on camera, in writing, in every conversation. Open a waitlist so the education has somewhere to send people. Form the advisory council from the 20. Half-day working session to build it, then produce."
            />
            <PhaseCard show delay={400} number="2" title="Hand-to-Hand" status="Pending"
              description="Roughly 200 direct conversations to find the first 50 fanatics of the product. Outbound calling with a purpose. Gifting for attention. Cross-sells onto the platform starting with the council. 60 to 90 days of active work."
            />
            <PhaseCard show delay={600} number="3" title="Air Cover and Channels" status="Pending"
              description="Education copy at scale through Instantly so the name is familiar before the call lands. Fan language extracted from the first 50. Referral channels built through the council and the believers. Reach starts compounding instead of resetting."
            />
          </div>
        )}

        {/* ── PLAYBOOK ── */}
        {currentId === "playbook" && (
          <div>
            <Fade show delay={100}>
              <div style={{ fontFamily: fonts.mono, fontSize: 10, color: COLORS.accent, letterSpacing: 3, marginBottom: 12 }}>
                06 — THE PLAYBOOK
              </div>
            </Fade>
            <Fade show delay={200}>
              <div style={{ fontFamily: fonts.body, fontSize: 14, color: COLORS.textMuted, lineHeight: 1.7, marginBottom: 28, maxWidth: 520 }}>
                This is yours whether we work together or not. Five plays, ready to run.
              </div>
            </Fade>
            <PlaybookSection items={[
              {
                tag: "ARGUMENT",
                title: "The Founder Makes the Case",
                visual: <ArgumentVisual />,
                content: (
                  <>
                    <PlaybookText>
                      There is no launch moment in insurance. What works instead is the founder 
                      making the argument everywhere at once: why this exists, why now. The 
                      policy-first data model was built when policy numbers were the universal 
                      key. The rest of the business world reorganized around relationships twenty 
                      years ago. Insurance is last. The argument carries because of who is making 
                      it: someone who has watched this industry run on that data model for decades.
                    </PlaybookText>
                    <PlaybookText>
                      The argument needs a destination, and that is the waitlist. A place every 
                      cold call, gift, and email can send someone who is not ready to talk yet. 
                      The list becomes the demand signal, the invite pool for the platform, and 
                      the first place the 200 conversations get drawn from.
                    </PlaybookText>
                    <PlaybookText>
                      The waitlist works because onboarding runs in cohorts. Agencies come onto 
                      the platform in groups, so every principal migrates alongside peers going 
                      through the same thing. The buddies make the change less lonely, and the 
                      cohort model creates real urgency, not manufactured scarcity: the next 
                      group starts when the next group starts. Miss it and the wait is real.
                    </PlaybookText>
                  </>
                ),
              },
              {
                tag: "COUNCIL",
                title: "The 20 Are the Beachhead",
                visual: <CouncilVisual />,
                content: (
                  <>
                    <PlaybookText>
                      Twenty consulting clients already trust the work. That trust is the most 
                      valuable asset in the building, and right now it is informal. An advisory 
                      council formalizes it: roadmap input, early access, status among their 
                      peers. Principals talk to principals. A council seat gives them a reason 
                      to talk about this.
                    </PlaybookText>
                    <PlaybookText>
                      The council is also the cross-sell path. The 20 are on custom setups 
                      today. Moving them onto the platform converts consulting relationships 
                      into recurring platform revenue, and every one that moves becomes a 
                      reference for the next hundred conversations. The install base starts 
                      at 20, not zero.
                    </PlaybookText>
                  </>
                ),
              },
              {
                tag: "OUTBOUND",
                title: "200 Conversations",
                visual: <TwoHundredVisual />,
                content: (
                  <>
                    <PlaybookText>
                      The first 50 fanatics of the product are found, not converted. Finding 
                      them takes roughly 200 direct conversations. Not 200 demos. Conversations 
                      where the reaction is visible: the principal who leans in when they hear 
                      why their AMS feels broken is a different prospect than the one who nods 
                      politely.
                    </PlaybookText>
                    <PlaybookText>
                      This is calling with a purpose. Every conversation is research that 
                      occasionally converts. The ones who light up get the video, the working 
                      session, the hands-on path onto the platform. The ones who do not are 
                      data about where the message needs work. Both outcomes move the company 
                      forward.
                    </PlaybookText>
                  </>
                ),
              },
              {
                tag: "ATTENTION",
                title: "Gifting Buys the Meeting",
                content: (
                  <>
                    <PlaybookText>
                      Agency principals are buried in cold email. They are not buried in 
                      physical packages. A well-chosen gift on a principal's desk earns 
                      something no email sequence can: a moment of genuine attention and a 
                      reason to take the call. The gift is not the pitch. It is the price 
                      of the conversation.
                    </PlaybookText>
                    <PlaybookText>
                      The math works because the target list is small and known. This is not 
                      spray gifting. It is 20 to 50 named principals who match the profile, 
                      each gift tied to the argument, each one followed by the call it paid for.
                    </PlaybookText>
                  </>
                ),
              },
              {
                tag: "AIR COVER",
                title: "Education at Scale",
                visual: <AirCoverVisual />,
                content: (
                  <>
                    <PlaybookText>
                      While the hand-to-hand work happens on the ground, education runs in the 
                      air. Highly relevant copy to a wide population of agency principals 
                      through Instantly. Not to close deals. To teach the diagnosis: your AMS 
                      feels broken because the data model is broken, and here is why.
                    </PlaybookText>
                    <PlaybookText>
                      The air cover exists so that when the call or the gift lands, the name 
                      is vaguely familiar and the idea is already planted. A cold call to 
                      someone who has read two emails about the policy-first problem is not 
                      a cold call anymore. The channels compound each other.
                    </PlaybookText>
                  </>
                ),
              },
            ]} />
          </div>
        )}

        {/* ── ENGAGE ── */}
        {currentId === "engage" && (
          <div>
            <Fade show delay={100}>
              <div style={{ fontFamily: fonts.mono, fontSize: 10, color: COLORS.accent, letterSpacing: 3, marginBottom: 32 }}>
                07 — ENGAGEMENT
              </div>
            </Fade>
            <Fade show delay={200}>
              <div style={{
                background: COLORS.surface, border: `1px solid ${COLORS.accent}33`,
                borderRadius: 8, padding: 24, marginBottom: 12,
              }}>
                <div style={{ fontFamily: fonts.mono, fontSize: 10, color: COLORS.accent, letterSpacing: 2, marginBottom: 12 }}>ONE DAY</div>
                <div style={{ fontFamily: fonts.body, fontSize: 17, color: COLORS.text, fontWeight: 600, marginBottom: 6 }}>
                  Make the Argument
                </div>
                <div style={{ fontFamily: fonts.body, fontSize: 13, color: COLORS.textMuted, lineHeight: 1.6, marginBottom: 14 }}>
                  Half-day working session. Flat fee.
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {[
                    "The education message distilled to one argument",
                    "Founder video script and structure",
                    "Waitlist page: the argument in one screen",
                    "Target agency profile with disqualifiers",
                    "Outbound calling sequence ready to run",
                  ].map((d, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 4, height: 4, borderRadius: "50%", background: COLORS.accent, opacity: 0.5, flexShrink: 0 }} />
                      <div style={{ fontFamily: fonts.body, fontSize: 12.5, color: COLORS.textMuted }}>{d}</div>
                    </div>
                  ))}
                </div>
              </div>
            </Fade>
            <Fade show delay={350}>
              <div style={{
                background: COLORS.surface, border: `1px solid ${COLORS.border}`,
                borderRadius: 8, padding: 24, marginBottom: 12,
              }}>
                <div style={{ fontFamily: fonts.mono, fontSize: 10, color: COLORS.warning, letterSpacing: 2, marginBottom: 12 }}>ONE INITIATIVE</div>
                <div style={{ fontFamily: fonts.body, fontSize: 17, color: COLORS.text, fontWeight: 600, marginBottom: 6 }}>
                  Reach Through Believers
                </div>
                <div style={{ fontFamily: fonts.body, fontSize: 13, color: COLORS.textMuted, lineHeight: 1.6, marginBottom: 14 }}>
                  60-day engagement. Milestone-based.
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {[
                    "Everything in One Day",
                    "Advisory council formed from the 20",
                    "200-conversation outbound motion built and running",
                    "Gifting campaign designed and shipped",
                    "First cross-sells onto the platform",
                    "Education air cover live in Instantly",
                  ].map((d, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 4, height: 4, borderRadius: "50%", background: COLORS.warning, opacity: 0.5, flexShrink: 0 }} />
                      <div style={{ fontFamily: fonts.body, fontSize: 12.5, color: COLORS.textMuted }}>{d}</div>
                    </div>
                  ))}
                </div>
              </div>
            </Fade>
            <Fade show delay={500}>
              <div style={{
                background: COLORS.surface, border: `1px solid rgba(245,240,232,0.12)`,
                borderRadius: 8, padding: 24, marginBottom: 12,
              }}>
                <div style={{ fontFamily: fonts.mono, fontSize: 10, color: COLORS.text, opacity: 0.5, letterSpacing: 2, marginBottom: 12 }}>ONE TEAM</div>
                <div style={{ fontFamily: fonts.body, fontSize: 17, color: COLORS.text, fontWeight: 600, marginBottom: 6 }}>
                  Fractional Revenue Leadership
                </div>
                <div style={{ fontFamily: fonts.body, fontSize: 13, color: COLORS.textMuted, lineHeight: 1.6, marginBottom: 14 }}>
                  Embedded in the team. 6-month engagement.
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {[
                    "A drvr embedded in the team",
                    "GTM strategy owned end to end",
                    "Weekly working sessions",
                    "Outbound built and run until there is someone to hand it to",
                    "Conference strategy and event execution",
                    "First sales hire made when the system is ready for one",
                    "The goal is to leave something behind that works without us",
                  ].map((d, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 4, height: 4, borderRadius: "50%", background: COLORS.text, opacity: 0.3, flexShrink: 0 }} />
                      <div style={{ fontFamily: fonts.body, fontSize: 12.5, color: COLORS.textMuted }}>{d}</div>
                    </div>
                  ))}
                </div>
              </div>
            </Fade>
            <Fade show delay={700}>
              <div style={{ textAlign: "center", marginTop: 32 }}>
                <div style={{ fontFamily: fonts.body, fontSize: 15, color: COLORS.textMuted, marginBottom: 24 }}>
                  Happy to do a 30-minute call to figure out which fits.
                </div>
                <div style={{ fontFamily: fonts.display, fontSize: 20, fontWeight: 400, color: COLORS.textDim, letterSpacing: 2 }}>
                  drvrs.io
                </div>
              </div>
            </Fade>
          </div>
        )}
      </div>

      {/* Bottom nav */}
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0,
        display: "flex", justifyContent: "center", gap: 12, padding: "24px 32px",
        background: `linear-gradient(transparent, ${COLORS.bg}ee 30%, ${COLORS.bg})`,
      }}>
        {canPrev && (
          <button onClick={() => setStage(s => s - 1)} style={{
            background: COLORS.surface, border: `1px solid ${COLORS.border}`,
            borderRadius: 6, padding: "10px 24px", cursor: "pointer",
            fontFamily: fonts.mono, fontSize: 11, color: COLORS.textMuted, letterSpacing: 1,
            transition: "all 0.2s ease",
          }}
          onMouseEnter={e => { e.target.style.borderColor = COLORS.textDim; e.target.style.color = COLORS.text; }}
          onMouseLeave={e => { e.target.style.borderColor = COLORS.border; e.target.style.color = COLORS.textMuted; }}
          >
            BACK
          </button>
        )}
        {canNext && (
          <button onClick={() => setStage(s => s + 1)} style={{
            background: COLORS.accentDim, border: `1px solid ${COLORS.accent}55`,
            borderRadius: 6, padding: "10px 32px", cursor: "pointer",
            fontFamily: fonts.mono, fontSize: 11, color: COLORS.accent, letterSpacing: 1,
            transition: "all 0.2s ease",
          }}
          onMouseEnter={e => { e.target.style.background = COLORS.accentGlow; }}
          onMouseLeave={e => { e.target.style.background = COLORS.accentDim; }}
          >
            {stage === 0 ? "BEGIN" : "CONTINUE"}
          </button>
        )}
      </div>
    </div>
  );
}