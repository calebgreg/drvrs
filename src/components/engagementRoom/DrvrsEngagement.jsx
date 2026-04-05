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
  { id: "proposal", label: "Proposal" },
];

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
    <div style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(12px)", transition: "opacity 0.6s ease, transform 0.6s ease", ...style }}>
      {children}
    </div>
  );
}

function TreeNode({ label, sublabel, x, y, active, isConstraint, delay = 0, show }) {
  const [vis, setVis] = useState(false);
  useEffect(() => {
    if (show) { const t = setTimeout(() => setVis(true), delay); return () => clearTimeout(t); }
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
        fontSize="11" fontFamily={fonts.mono} fontWeight="600" letterSpacing="0.5">{label}</text>
      {sublabel && (
        <text x={x} y={y + 12} textAnchor="middle" dominantBaseline="middle"
          fill={COLORS.textDim} fontSize="8" fontFamily={fonts.mono}>{sublabel}</text>
      )}
    </g>
  );
}

function TreeEdge({ x1, y1, x2, y2, show, delay = 0, isConstraintPath }) {
  const [vis, setVis] = useState(false);
  useEffect(() => {
    if (show) { const t = setTimeout(() => setVis(true), delay); return () => clearTimeout(t); }
  }, [show, delay]);
  const midY = (y1 + y2) / 2;
  const path = `M${x1},${y1 + 44} C${x1},${midY} ${x2},${midY} ${x2},${y2 - 44}`;
  return (
    <path d={path} fill="none"
      stroke={isConstraintPath ? COLORS.constraint : COLORS.textDim}
      strokeWidth={isConstraintPath ? "1.5" : "1"}
      strokeDasharray={vis ? "none" : "4 4"}
      opacity={vis ? (isConstraintPath ? 0.8 : 0.4) : 0}
      style={{ transition: "opacity 0.5s ease" }} />
  );
}

function PhaseCard({ number, title, description, status, delay, show }) {
  return (
    <Fade show={show} delay={delay}>
      <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: "20px 24px", marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <span style={{ fontFamily: fonts.mono, fontSize: 11, color: COLORS.accent, background: COLORS.accentDim, padding: "3px 8px", borderRadius: 4, letterSpacing: 1 }}>PHASE {number}</span>
          <span style={{ fontFamily: fonts.mono, fontSize: 10, color: COLORS.textDim, marginLeft: "auto", textTransform: "uppercase", letterSpacing: 1 }}>{status}</span>
        </div>
        <div style={{ fontFamily: fonts.body, fontSize: 17, color: COLORS.text, fontWeight: 600, marginBottom: 6 }}>{title}</div>
        <div style={{ fontFamily: fonts.body, fontSize: 14, color: COLORS.textMuted, lineHeight: 1.6 }}>{description}</div>
      </div>
    </Fade>
  );
}

function ShiftCard({ title, before, after, delay, show }) {
  return (
    <Fade show={show} delay={delay}>
      <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: "20px 24px", marginBottom: 12 }}>
        <div style={{ fontFamily: fonts.body, fontSize: 15, color: COLORS.text, fontWeight: 600, marginBottom: 12 }}>{title}</div>
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

function PlaybookSection({ items }) {
  const [open, setOpen] = useState(null);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <Fade key={i} show delay={150 + i * 100}>
            <div style={{ background: COLORS.surface, border: `1px solid ${isOpen ? COLORS.accent + "44" : COLORS.border}`, borderRadius: 8, overflow: "hidden", transition: "border-color 0.3s ease" }}>
              <button onClick={() => setOpen(isOpen ? null : i)} style={{ width: "100%", background: "none", border: "none", cursor: "pointer", padding: "18px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontFamily: fonts.mono, fontSize: 9, color: COLORS.accent, background: COLORS.accentDim, padding: "3px 8px", borderRadius: 4, letterSpacing: 1.5, textTransform: "uppercase" }}>{item.tag}</span>
                  <span style={{ fontFamily: fonts.body, fontSize: 15, color: COLORS.text, fontWeight: 500 }}>{item.title}</span>
                </div>
                <span style={{ fontFamily: fonts.body, fontSize: 18, color: COLORS.accent, transform: isOpen ? "rotate(45deg)" : "rotate(0deg)", transition: "transform 0.3s ease" }}>+</span>
              </button>
              <div style={{ maxHeight: isOpen ? 800 : 0, opacity: isOpen ? 1 : 0, overflow: "hidden", transition: "max-height 0.5s cubic-bezier(0.16,1,0.3,1), opacity 0.4s ease" }}>
                <div style={{ padding: "0 24px 24px 24px", borderTop: `1px solid ${COLORS.border}` }}>
                  <div style={{ fontFamily: fonts.body, fontSize: 13.5, color: COLORS.textMuted, lineHeight: 1.7, marginTop: 16 }}>
                    {item.content}
                  </div>
                </div>
              </div>
            </div>
          </Fade>
        );
      })}
    </div>
  );
}

export default function DrvrsEngagement({ room }) {
  const [stage, setStage] = useState(0);
  const [treePhase, setTreePhase] = useState(0);

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
    <div style={{ minHeight: "100vh", background: COLORS.bg, color: COLORS.text, fontFamily: fonts.body, position: "relative", overflow: "hidden" }}>
      <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=DM+Sans:wght@300;400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap" rel="stylesheet" />

      {/* Grain */}
      <div style={{ position: "fixed", inset: 0, opacity: 0.035, backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`, backgroundSize: "200px 200px", pointerEvents: "none", zIndex: 1000 }} />

      {/* Top nav */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "2rem 3rem", mixBlendMode: "difference" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.7rem" }}>
          <div style={{ width: 26, height: 12, background: COLORS.text, borderRadius: 6 }} />
          <span style={{ fontFamily: fonts.body, fontSize: "1.1rem", fontWeight: 400, color: COLORS.text, letterSpacing: "0.1em" }}>drvrs</span>
          <span style={{ fontFamily: fonts.body, fontSize: "0.65rem", letterSpacing: "0.18em", textTransform: "uppercase", color: COLORS.text, opacity: 0.35, marginLeft: 8 }}>diagnostic engagement</span>
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
            <Fade show delay={200}><div style={{ fontFamily: fonts.mono, fontSize: 10, color: COLORS.textDim, letterSpacing: 3, textTransform: "uppercase", marginBottom: 40 }}>Prepared for {room?.companyName}</div></Fade>
            <Fade show delay={500}><div style={{ fontFamily: fonts.display, fontSize: 56, fontWeight: 300, color: COLORS.text, letterSpacing: 1, lineHeight: 1.1, marginBottom: 16 }}>Find the constraint.</div></Fade>
            <Fade show delay={800}><div style={{ fontFamily: fonts.display, fontSize: 56, fontWeight: 300, color: COLORS.textDim, letterSpacing: 1, lineHeight: 1.1, marginBottom: 48 }}>Remove it.</div></Fade>
            <Fade show delay={1200}><div style={{ fontFamily: fonts.body, fontSize: 15, color: COLORS.textMuted, maxWidth: 420, margin: "0 auto", lineHeight: 1.7 }}>This is not a proposal. This is a diagnostic of your go-to-market system. Every business has one constraint that, once identified and removed, unlocks everything downstream of it.</div></Fade>
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
            <Fade show delay={100}><div style={{ fontFamily: fonts.mono, fontSize: 10, color: COLORS.accent, letterSpacing: 3, marginBottom: 24 }}>02 — THE DECOMPOSITION</div></Fade>
            <Fade show delay={200}><div style={{ fontFamily: fonts.body, fontSize: 15, color: COLORS.textMuted, lineHeight: 1.7, marginBottom: 32, maxWidth: 560 }}>{room?.decompositionDescription}</div></Fade>
            <div style={{ display: "flex", justifyContent: "center", margin: "20px 0" }}>
              <svg width="520" height="320" viewBox="0 0 520 320">
                <TreeEdge x1={260} y1={60} x2={150} y2={190} show={treePhase >= 2} delay={0} />
                <TreeEdge x1={260} y1={60} x2={370} y2={190} show={treePhase >= 2} delay={200} />
                <TreeEdge x1={150} y1={190} x2={150} y2={280} show={treePhase >= 3} delay={0} />
                <TreeEdge x1={370} y1={190} x2={370} y2={280} show={treePhase >= 3} delay={200} />
                <TreeNode label="PMF" sublabel="50 customers" x={260} y={60} active show={treePhase >= 1} delay={0} />
                <TreeNode label="10" sublabel="FANATICS" x={150} y={190} active show={treePhase >= 2} delay={0} />
                <TreeNode label="40" sublabel="REFERRALS" x={370} y={190} show={treePhase >= 2} delay={200} />
                <TreeNode label="ACTIVE" sublabel="OUTBOUND" x={150} y={280} active show={treePhase >= 3} delay={0} />
                <TreeNode label="NETWORK" sublabel="LEVERAGE" x={370} y={280} show={treePhase >= 3} delay={200} />
              </svg>
            </div>
            <Fade show delay={1600}><div style={{ textAlign: "center", fontFamily: fonts.mono, fontSize: 12, color: COLORS.textMuted, letterSpacing: 0.5 }}>50 = 10 who find 40. The 10 is the real target.</div></Fade>
          </div>
        )}

        {/* CONSTRAINT */}
        {currentId === "constraint" && (
          <div>
            <Fade show delay={100}><div style={{ fontFamily: fonts.mono, fontSize: 10, color: COLORS.constraint, letterSpacing: 3, marginBottom: 24 }}>03 — THE CONSTRAINT</div></Fade>
            <div style={{ display: "flex", justifyContent: "center", margin: "0 0 24px 0" }}>
              <svg width="520" height="320" viewBox="0 0 520 320">
                <TreeEdge x1={260} y1={60} x2={150} y2={190} show delay={0} isConstraintPath />
                <TreeEdge x1={260} y1={60} x2={370} y2={190} show delay={0} />
                <TreeEdge x1={150} y1={190} x2={150} y2={280} show delay={0} isConstraintPath />
                <TreeEdge x1={370} y1={190} x2={370} y2={280} show delay={0} />
                <TreeNode label="PMF" sublabel="50 customers" x={260} y={60} active show delay={0} />
                <TreeNode label="10" sublabel="FANATICS" x={150} y={190} isConstraint show delay={0} />
                <TreeNode label="40" sublabel="REFERRALS" x={370} y={190} show delay={0} />
                <TreeNode label="ACTIVE" sublabel="OUTBOUND" x={150} y={280} isConstraint show delay={0} />
                <TreeNode label="NETWORK" sublabel="LEVERAGE" x={370} y={280} show delay={0} />
              </svg>
            </div>
            <Fade show delay={300}>
              <div style={{ background: COLORS.constraintDim, border: `1px solid ${COLORS.constraint}33`, borderRadius: 8, padding: "20px 24px", marginBottom: 20 }}>
                <div style={{ fontFamily: fonts.mono, fontSize: 10, color: COLORS.constraint, letterSpacing: 2, marginBottom: 8 }}>{room?.constraintTitle}</div>
                <div style={{ fontFamily: fonts.body, fontSize: 16, color: COLORS.text, lineHeight: 1.7 }}>{room?.constraintDescription}</div>
              </div>
            </Fade>
            <Fade show delay={600}><div style={{ fontFamily: fonts.body, fontSize: 15, color: COLORS.textMuted, lineHeight: 1.7, maxWidth: 560 }}>{room?.constraintFooter}</div></Fade>
          </div>
        )}

        {/* SHIFTS */}
        {currentId === "shifts" && (
          <div>
            <Fade show delay={100}><div style={{ fontFamily: fonts.mono, fontSize: 10, color: COLORS.accent, letterSpacing: 3, marginBottom: 32 }}>04 — WHAT CHANGES</div></Fade>
            {(room?.shiftsSection || []).map((shift, i) => (
              <ShiftCard key={i} show delay={200 + i * 200} title={shift.title} before={shift.before} after={shift.after} />
            ))}
          </div>
        )}

        {/* WORK */}
        {currentId === "work" && (
          <div>
            <Fade show delay={100}><div style={{ fontFamily: fonts.mono, fontSize: 10, color: COLORS.accent, letterSpacing: 3, marginBottom: 32 }}>05 — THE WORK</div></Fade>
            {(room?.workSection || []).map((phase, i) => (
              <PhaseCard key={i} show delay={200 + i * 200} number={phase.number || String(i + 1)} title={phase.title} status={phase.status} description={phase.description} />
            ))}
          </div>
        )}

        {/* PLAYBOOK */}
        {currentId === "playbook" && (
          <div>
            <Fade show delay={100}><div style={{ fontFamily: fonts.mono, fontSize: 10, color: COLORS.accent, letterSpacing: 3, marginBottom: 12 }}>06 — THE PLAYBOOK</div></Fade>
            <Fade show delay={200}><div style={{ fontFamily: fonts.body, fontSize: 14, color: COLORS.textMuted, lineHeight: 1.7, marginBottom: 28, maxWidth: 520 }}>This is yours whether we work together or not.</div></Fade>
            <PlaybookSection items={room?.playbookSection || []} />
          </div>
        )}

        {/* PROPOSAL */}
        {currentId === "proposal" && (
          <div>
            <Fade show delay={100}>
              <div style={{ fontFamily: fonts.mono, fontSize: 10, color: COLORS.accent, letterSpacing: 3, marginBottom: 8 }}>08 — THE PROPOSAL</div>
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
              {(room?.proposalOptions || []).map((opt, i) => (
                <Fade key={i} show delay={400 + i * 200}>
                  <div style={{
                    background: opt.highlighted ? "rgba(45,138,110,0.08)" : COLORS.surface,
                    border: `1px solid ${opt.highlighted ? COLORS.accent + "55" : COLORS.border}`,
                    borderRadius: 10, padding: "28px 32px",
                    position: "relative",
                  }}>
                    {opt.highlighted && (
                      <div style={{ position: "absolute", top: -1, right: 24, background: COLORS.accent, color: "#0a1a14", fontFamily: fonts.mono, fontSize: 8, letterSpacing: 2, padding: "3px 10px", borderRadius: "0 0 6px 6px" }}>
                        RECOMMENDED
                      </div>
                    )}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16, flexWrap: "wrap", gap: 12 }}>
                      <div>
                        <div style={{ fontFamily: fonts.mono, fontSize: 10, color: opt.highlighted ? COLORS.accent : COLORS.textMuted, letterSpacing: 2, marginBottom: 6 }}>{opt.name?.toUpperCase()}</div>
                        <div style={{ fontFamily: fonts.body, fontSize: 14, color: COLORS.textMuted }}>{opt.timeline}</div>
                      </div>
                      <div style={{ fontFamily: fonts.display, fontSize: 32, color: COLORS.text, fontWeight: 400 }}>{opt.price}</div>
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

                    {opt.agreementUrl ? (
                      <a
                        href={opt.agreementUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: "inline-block",
                          background: opt.highlighted ? COLORS.accentDim : "transparent",
                          border: `1px solid ${opt.highlighted ? COLORS.accent : COLORS.border}`,
                          borderRadius: 6, padding: "10px 24px",
                          fontFamily: fonts.mono, fontSize: 11,
                          color: opt.highlighted ? COLORS.accent : COLORS.textMuted,
                          letterSpacing: 1, textDecoration: "none",
                          transition: "all 0.2s ease",
                        }}
                      >
                        ACCEPT &amp; SIGN →
                      </a>
                    ) : (
                      <div style={{ fontFamily: fonts.mono, fontSize: 9, color: COLORS.textDim, letterSpacing: 1 }}>AGREEMENT LINK COMING</div>
                    )}
                  </div>
                </Fade>
              ))}
            </div>

            {room?.proposalNote && (
              <Fade show delay={800}>
                <div style={{ fontFamily: fonts.body, fontSize: 13, color: COLORS.textDim, lineHeight: 1.7, textAlign: "center", maxWidth: 480, margin: "0 auto" }}>
                  {room.proposalNote}
                </div>
              </Fade>
            )}
          </div>
        )}

        {/* ENGAGE */}
        {currentId === "engage" && (
          <div>
            <Fade show delay={100}><div style={{ fontFamily: fonts.mono, fontSize: 10, color: COLORS.accent, letterSpacing: 3, marginBottom: 32 }}>07 — ENGAGEMENT</div></Fade>
            <Fade show delay={300}>
              <div style={{ display: "flex", gap: 16, marginBottom: 32 }}>
                <div style={{ flex: 1, background: COLORS.surface, border: `1px solid ${COLORS.accent}33`, borderRadius: 8, padding: 24 }}>
                  <div style={{ fontFamily: fonts.mono, fontSize: 10, color: COLORS.accent, letterSpacing: 2, marginBottom: 12 }}>ONE DAY</div>
                  <div style={{ fontFamily: fonts.body, fontSize: 16, color: COLORS.text, fontWeight: 600, marginBottom: 8 }}>{room?.engagementOneDayTitle}</div>
                  <div style={{ fontFamily: fonts.body, fontSize: 13, color: COLORS.textMuted, lineHeight: 1.6 }}>{room?.engagementOneDayDescription}</div>
                </div>
                <div style={{ flex: 1, background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: 24 }}>
                  <div style={{ fontFamily: fonts.mono, fontSize: 10, color: COLORS.warning, letterSpacing: 2, marginBottom: 12 }}>ONE INITIATIVE</div>
                  <div style={{ fontFamily: fonts.body, fontSize: 16, color: COLORS.text, fontWeight: 600, marginBottom: 8 }}>{room?.engagementOneInitiativeTitle}</div>
                  <div style={{ fontFamily: fonts.body, fontSize: 13, color: COLORS.textMuted, lineHeight: 1.6 }}>{room?.engagementOneInitiativeDescription}</div>
                </div>
              </div>
            </Fade>
            <Fade show delay={600}>
              <div style={{ textAlign: "center", marginTop: 24 }}>
                <div style={{ fontFamily: fonts.body, fontSize: 15, color: COLORS.textMuted, marginBottom: 24 }}>{room?.engagementFooter}</div>
                <div style={{ fontFamily: fonts.display, fontSize: 20, fontWeight: 300, color: COLORS.textDim, letterSpacing: 2 }}>drvrs.io</div>
              </div>
            </Fade>
          </div>
        )}
      </div>

      {/* Bottom nav */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 12, padding: "24px 32px", background: `linear-gradient(transparent, ${COLORS.bg}ee 30%, ${COLORS.bg})` }}>
        {canPrev && (
          <button onClick={() => setStage(s => s - 1)} style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: "10px 24px", cursor: "pointer", fontFamily: fonts.mono, fontSize: 11, color: COLORS.textMuted, letterSpacing: 1 }}>BACK</button>
        )}
        {canNext && (
          <button onClick={() => setStage(s => s + 1)} style={{ background: COLORS.accentDim, border: `1px solid ${COLORS.accent}55`, borderRadius: 6, padding: "10px 32px", cursor: "pointer", fontFamily: fonts.mono, fontSize: 11, color: COLORS.accent, letterSpacing: 1 }}>
            {stage === 0 ? "BEGIN DIAGNOSTIC" : "CONTINUE"}
          </button>
        )}
      </div>
    </div>
  );
}