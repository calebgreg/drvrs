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
            <Fade show delay={1200}><div style={{ fontFamily: fonts.body, fontSize: 15, color: COLORS.textMuted, maxWidth: 420, margin: "0 auto", lineHeight: 1.7 }}>This is a diagnostic. A look at the system that should be producing product-market fit for Insurvoice, and what is in the way.</div></Fade>
          </div>
        )}

        {/* GOAL */}
        {currentId === "goal" && (
          <div>
            <Fade show delay={100}><div style={{ fontFamily: fonts.mono, fontSize: 10, color: COLORS.accent, letterSpacing: 3, marginBottom: 32 }}>01 — THE GOAL</div></Fade>
            <Fade show delay={300}><div style={{ fontFamily: fonts.display, fontSize: 40, fontWeight: 400, color: COLORS.text, marginBottom: 32, lineHeight: 1.2 }}>50 paying customers.</div></Fade>
            <Fade show delay={600}><div style={{ fontFamily: fonts.body, fontSize: 16, color: COLORS.textMuted, lineHeight: 1.8, marginBottom: 24, maxWidth: 600 }}>50 customers is not a revenue target. It is the number that tells everyone this thing works. That agencies keep paying, that the use case is real, that the pocket has been found.</div></Fade>
            <Fade show delay={900}><div style={{ fontFamily: fonts.mono, fontSize: 13, color: COLORS.accent, background: COLORS.accentDim, display: "inline-block", padding: "8px 16px", borderRadius: 4, letterSpacing: 0.5 }}>50 is a PMF signal, not a sales target.</div></Fade>
            <Fade show delay={1200}><div style={{ fontFamily: fonts.body, fontSize: 16, color: COLORS.textMuted, lineHeight: 1.8, marginTop: 32, maxWidth: 600 }}>That distinction changes what matters. The question is not "how do we get more leads." The question is "what system produces product-market fit, and where is it stuck."</div></Fade>
          </div>
        )}

        {/* DECOMP */}
        {currentId === "decomp" && (
          <div>
            <Fade show delay={100}><div style={{ fontFamily: fonts.mono, fontSize: 10, color: COLORS.accent, letterSpacing: 3, marginBottom: 24 }}>02 — THE SYSTEM</div></Fade>
            <Fade show delay={200}><div style={{ fontFamily: fonts.body, fontSize: 15, color: COLORS.textMuted, lineHeight: 1.7, marginBottom: 32, maxWidth: 560 }}>Product-market fit is not a feeling. It is a system with three components. If any one collapses to zero, PMF is zero. It does not matter how strong the other two are.</div></Fade>
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
                tag: "POSITIONING",
                title: "The Recoverable Revenue Frame",
                content: (
                  <div>
                    <div style={{ fontFamily: fonts.body, fontSize: 13.5, color: COLORS.textMuted, lineHeight: 1.7, marginTop: 16 }}>The positioning that works in insurance is not about features or price. It is about the moment an agency principal checks voicemail at 7am and sees six missed calls from last night. Name that moment and the conversation changes.</div>
                    <div style={{ fontFamily: fonts.mono, fontSize: 9, color: COLORS.accent, letterSpacing: 1.5, textTransform: "uppercase", marginTop: 20, marginBottom: 6 }}>The one-sentence position</div>
                    <div style={{ fontFamily: fonts.display, fontStyle: "italic", fontSize: 15, color: COLORS.text, lineHeight: 1.6, borderLeft: `2px solid ${COLORS.accent}44`, paddingLeft: 16, marginTop: 14, marginBottom: 6 }}>"Insurvoice captures the 30 to 40 percent of inbound revenue that independent agencies lose to after-hours calls, slow follow-up, and lapsed renewals."</div>
                    <div style={{ fontFamily: fonts.body, fontSize: 13.5, color: COLORS.textMuted, lineHeight: 1.7, marginTop: 16 }}>Notice the word "captures." It implies the revenue already exists. The agency is just not collecting it. That framing lands differently than "we are cheaper than your current solution."</div>
                    <div style={{ fontFamily: fonts.mono, fontSize: 9, color: COLORS.accent, letterSpacing: 1.5, textTransform: "uppercase", marginTop: 20, marginBottom: 6 }}>Where to use it</div>
                    <div style={{ fontFamily: fonts.body, fontSize: 13.5, color: COLORS.textMuted, lineHeight: 1.7, marginTop: 16 }}>Homepage headline. First line of every cold email. First 15 seconds of every cold call. Opening slide of every demo. If someone asks "what do you do," this is your answer. Verbatim. Every time.</div>
                  </div>
                ),
              },
              {
                tag: "ICP",
                title: "The Agency That Buys First",
                content: (
                  <div>
                    <div style={{ fontFamily: fonts.body, fontSize: 13.5, color: COLORS.textMuted, lineHeight: 1.7, marginTop: 16 }}>Not every agency is the right first customer. The one that buys first has a specific shape. Knowing that shape makes every call, email, and demo more efficient.</div>
                    <div style={{ fontFamily: fonts.mono, fontSize: 9, color: COLORS.accent, letterSpacing: 1.5, textTransform: "uppercase", marginTop: 20, marginBottom: 6 }}>The profile</div>
                    <div style={{ fontFamily: fonts.body, fontSize: 13.5, color: COLORS.textMuted, lineHeight: 1.7, marginTop: 16 }}>Independent (not captive, not cluster-owned). Personal lines heavy or balanced book. 2 to 8 producers. No dedicated ops or admin staff handling phones. High inbound call volume relative to size. Principal is still answering phones or knows they are missing calls. Located in a state with competitive personal lines markets.</div>
                    <div style={{ fontFamily: fonts.mono, fontSize: 9, color: COLORS.accent, letterSpacing: 1.5, textTransform: "uppercase", marginTop: 20, marginBottom: 6 }}>How to find them</div>
                    <div style={{ fontFamily: fonts.body, fontSize: 13.5, color: COLORS.textMuted, lineHeight: 1.7, marginTop: 16 }}>State Big I association directories. Cluster group rosters (ask the group leaders directly). Google Maps search for "insurance agency" in mid-size metros, then check reviews for complaints about responsiveness. LinkedIn Sales Navigator filtered by title "agency owner" or "principal" at companies with 2 to 10 employees.</div>
                    <div style={{ fontFamily: fonts.mono, fontSize: 9, color: COLORS.accent, letterSpacing: 1.5, textTransform: "uppercase", marginTop: 20, marginBottom: 6 }}>Disqualifiers</div>
                    <div style={{ fontFamily: fonts.body, fontSize: 13.5, color: COLORS.textMuted, lineHeight: 1.7, marginTop: 16 }}>Already has a dedicated CSR team working phones. Captive agent (State Farm, Allstate). Large agency with an ops manager. Agency that leads with commercial lines. If they have someone answering every call, the pain is not there yet.</div>
                  </div>
                ),
              },
              {
                tag: "OUTBOUND",
                title: "Cold Outreach That Finds the 10",
                content: (
                  <div>
                    <div style={{ fontFamily: fonts.body, fontSize: 13.5, color: COLORS.textMuted, lineHeight: 1.7, marginTop: 16 }}>You are not trying to close 10 agencies. You are trying to find 10 agencies that light up when they hear what you do. Different intent. You are screening for a reaction.</div>
                    <div style={{ fontFamily: fonts.mono, fontSize: 9, color: COLORS.accent, letterSpacing: 1.5, textTransform: "uppercase", marginTop: 20, marginBottom: 6 }}>Cold call framework</div>
                    <div style={{ fontFamily: fonts.display, fontStyle: "italic", fontSize: 15, color: COLORS.text, lineHeight: 1.6, borderLeft: `2px solid ${COLORS.accent}44`, paddingLeft: 16, marginTop: 14, marginBottom: 6 }}>"Hey [name], quick question. When someone calls your agency at 6pm on a Tuesday looking for a quote, what happens to that call right now?"</div>
                    <div style={{ fontFamily: fonts.body, fontSize: 13.5, color: COLORS.textMuted, lineHeight: 1.7, marginTop: 16 }}>Then shut up. If they sigh, laugh, or say "voicemail," you have a live one. If they say "our CSR handles it," they are not your buyer right now. The question does the qualifying for you.</div>
                    <div style={{ fontFamily: fonts.mono, fontSize: 9, color: COLORS.accent, letterSpacing: 1.5, textTransform: "uppercase", marginTop: 20, marginBottom: 6 }}>Loom video play</div>
                    <div style={{ fontFamily: fonts.body, fontSize: 13.5, color: COLORS.textMuted, lineHeight: 1.7, marginTop: 16 }}>Pull up the agency's website. Screen record a 90-second walkthrough. "I'm looking at your site. You have a quote request form here, which is great. But what happens at 7pm when someone calls this number instead of filling out this form? Here's what Insurvoice would do." Show the product on their actual site. Make it about them, not you. Send via LinkedIn DM or direct email to the principal. This takes 3 minutes per agency. Do 10 a day.</div>
                    <div style={{ fontFamily: fonts.mono, fontSize: 9, color: COLORS.accent, letterSpacing: 1.5, textTransform: "uppercase", marginTop: 20, marginBottom: 6 }}>LinkedIn DM</div>
                    <div style={{ fontFamily: fonts.display, fontStyle: "italic", fontSize: 15, color: COLORS.text, lineHeight: 1.6, borderLeft: `2px solid ${COLORS.accent}44`, paddingLeft: 16, marginTop: 14, marginBottom: 6 }}>"Hey [name], saw your agency does a lot of personal lines in [market]. Quick question: what happens to your after-hours calls right now? We help independent agencies capture that revenue. Happy to show you a 2-minute demo if it's relevant."</div>
                    <div style={{ fontFamily: fonts.mono, fontSize: 9, color: COLORS.accent, letterSpacing: 1.5, textTransform: "uppercase", marginTop: 20, marginBottom: 6 }}>Volume</div>
                    <div style={{ fontFamily: fonts.body, fontSize: 13.5, color: COLORS.textMuted, lineHeight: 1.7, marginTop: 16 }}>20 cold calls per day. 10 Loom videos per day. 15 LinkedIn DMs per day. At that pace, you will find 10 agencies that love you within 30 to 45 days. Probably sooner.</div>
                  </div>
                ),
              },
              {
                tag: "EVENTS",
                title: "Conference Strategy",
                content: (
                  <div>
                    <div style={{ fontFamily: fonts.body, fontSize: 13.5, color: COLORS.textMuted, lineHeight: 1.7, marginTop: 16 }}>Conferences are not lead gen. Conferences are proof of existence. The booth says "we are real." The conversations around the event are where pipeline happens.</div>
                    <div style={{ fontFamily: fonts.mono, fontSize: 9, color: COLORS.accent, letterSpacing: 1.5, textTransform: "uppercase", marginTop: 20, marginBottom: 6 }}>Which events</div>
                    <div style={{ fontFamily: fonts.body, fontSize: 13.5, color: COLORS.textMuted, lineHeight: 1.7, marginTop: 16 }}>Big I state association annual conferences. Your state first, then adjacent states. NetVu (if Vertafore users are part of your ICP). Applied Net (if Applied users are). Cluster group annual meetings. These are small enough to have real conversations and targeted enough that every person in the room is your buyer.</div>
                    <div style={{ fontFamily: fonts.mono, fontSize: 9, color: COLORS.accent, letterSpacing: 1.5, textTransform: "uppercase", marginTop: 20, marginBottom: 6 }}>How to work them</div>
                    <div style={{ fontFamily: fonts.body, fontSize: 13.5, color: COLORS.textMuted, lineHeight: 1.7, marginTop: 16 }}>Get the attendee list early. Pre-schedule 10 to 15 one-on-one conversations before you arrive. Host a dinner or a happy hour for 8 to 12 agency principals the night before. At the booth, run a live demo loop showing a real after-hours call being handled. Ask every person who stops: "What happens to your after-hours calls right now?" Collect reactions, not business cards.</div>
                    <div style={{ fontFamily: fonts.mono, fontSize: 9, color: COLORS.accent, letterSpacing: 1.5, textTransform: "uppercase", marginTop: 20, marginBottom: 6 }}>The creative play</div>
                    <div style={{ fontFamily: fonts.body, fontSize: 13.5, color: COLORS.textMuted, lineHeight: 1.7, marginTop: 16 }}>Set up a live phone number at the booth. Hand the number to people and say "Call this after 6pm tonight." Let them experience the product firsthand. Follow up the next morning with a Loom video referencing their specific call.</div>
                  </div>
                ),
              },
              {
                tag: "SCALE",
                title: "How the 10 Find the 40",
                content: (
                  <div>
                    <div style={{ fontFamily: fonts.body, fontSize: 13.5, color: COLORS.textMuted, lineHeight: 1.7, marginTop: 16 }}>Once you have 10 agencies that love the product, you stop selling. You start listening.</div>
                    <div style={{ fontFamily: fonts.mono, fontSize: 9, color: COLORS.accent, letterSpacing: 1.5, textTransform: "uppercase", marginTop: 20, marginBottom: 6 }}>Interview the 10</div>
                    <div style={{ fontFamily: fonts.body, fontSize: 13.5, color: COLORS.textMuted, lineHeight: 1.7, marginTop: 16 }}>Ask each fanatic three questions. "What were you doing before Insurvoice and why was it painful?" "What would you tell another agency principal about this?" "Who else in your cluster group or association should be using this?" Record every answer. Their words are your marketing copy. Their referrals are your pipeline. Their cluster group memberships are your distribution channel.</div>
                    <div style={{ fontFamily: fonts.mono, fontSize: 9, color: COLORS.accent, letterSpacing: 1.5, textTransform: "uppercase", marginTop: 20, marginBottom: 6 }}>Referral mechanics</div>
                    <div style={{ fontFamily: fonts.body, fontSize: 13.5, color: COLORS.textMuted, lineHeight: 1.7, marginTop: 16 }}>Ask each fanatic to introduce you to 3 agencies. Not a mass email. A personal text or call. "Hey, I've been using this thing called Insurvoice for my after-hours calls. You should talk to them." That introduction closes at 5x the rate of cold outreach. 10 fanatics times 3 referrals is 30 warm conversations. You only need 40 percent of those to convert.</div>
                    <div style={{ fontFamily: fonts.mono, fontSize: 9, color: COLORS.accent, letterSpacing: 1.5, textTransform: "uppercase", marginTop: 20, marginBottom: 6 }}>Now ads work</div>
                    <div style={{ fontFamily: fonts.body, fontSize: 13.5, color: COLORS.textMuted, lineHeight: 1.7, marginTop: 16 }}>Take the words from your fanatic interviews. Use them as YouTube ad scripts. Use them as Facebook ad copy. Use them as landing page headlines. You are not writing marketing anymore. You are amplifying the voice of people who already believe. This is when you turn the ad spend back on. Not before.</div>
                  </div>
                ),
              },
            ]} />
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
                  <div style={{ fontFamily: fonts.body, fontSize: 16, color: COLORS.text, fontWeight: 600, marginBottom: 8 }}>Define the Promise</div>
                  <div style={{ fontFamily: fonts.body, fontSize: 13, color: COLORS.textMuted, lineHeight: 1.6 }}>Name the outcome. Build the positioning, the ICP, and the outbound sequence around it. Flat fee. Everything needed to start validating delivery.</div>
                </div>
                <div style={{ flex: 1, background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: 24 }}>
                  <div style={{ fontFamily: fonts.mono, fontSize: 10, color: COLORS.warning, letterSpacing: 2, marginBottom: 12 }}>ONE INITIATIVE</div>
                  <div style={{ fontFamily: fonts.body, fontSize: 16, color: COLORS.text, fontWeight: 600, marginBottom: 8 }}>Promise Through Evidence</div>
                  <div style={{ fontFamily: fonts.body, fontSize: 13, color: COLORS.textMuted, lineHeight: 1.6 }}>Full 60-day engagement. Define the promise, validate delivery with early customers, build the evidence that PMF is real. Milestone-based.</div>
                </div>
              </div>
            </Fade>
            <Fade show delay={600}>
              <div style={{ textAlign: "center", marginTop: 24 }}>
                <div style={{ fontFamily: fonts.body, fontSize: 15, color: COLORS.textMuted, marginBottom: 24 }}>Happy to do a 30-minute call to figure out which fits.</div>
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