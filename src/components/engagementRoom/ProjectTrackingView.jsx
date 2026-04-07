import { useState } from "react";
import { base44 } from "@/api/base44Client";

const COLORS = {
  bg: "#0a1a14",
  surface: "#0f2219",
  surfaceHover: "#122a1f",
  border: "rgba(245,240,232,0.06)",
  borderMed: "rgba(245,240,232,0.12)",
  text: "#f5f0e8",
  textMuted: "#7a8a82",
  textDim: "rgba(245,240,232,0.3)",
  accent: "#2d8a6e",
  accentDim: "rgba(45,138,110,0.15)",
  accentBorder: "rgba(45,138,110,0.3)",
};
const fonts = {
  mono: "'JetBrains Mono', 'SF Mono', monospace",
  body: "'DM Sans', 'Helvetica Neue', sans-serif",
  display: "'DM Serif Display', Georgia, serif",
};

const phaseStatusColors = {
  pending: { bg: "rgba(122,138,130,0.1)", text: COLORS.textMuted, border: "rgba(122,138,130,0.2)" },
  in_progress: { bg: "rgba(45,138,110,0.12)", text: COLORS.accent, border: COLORS.accentBorder },
  completed: { bg: "rgba(45,138,110,0.2)", text: "#5fc49a", border: "rgba(95,196,154,0.3)" },
};

const phaseStatusLabels = {
  pending: "PENDING",
  in_progress: "IN PROGRESS",
  completed: "COMPLETED",
};

export default function ProjectTrackingView({ room, isAdmin }) {
  const [phases, setPhases] = useState(room.projectTracking || []);
  const [saving, setSaving] = useState(false);

  const toggleDeliverable = async (phaseIdx, delivIdx) => {
    const updated = phases.map((phase, pi) => {
      if (pi !== phaseIdx) return phase;
      return {
        ...phase,
        deliverables: phase.deliverables.map((d, di) => {
          if (di !== delivIdx) return d;
          return { ...d, status: d.status === "done" ? "to_do" : "done" };
        }),
      };
    });

    // Recalculate phase status based on deliverables
    const withPhaseStatus = updated.map(phase => {
      const total = phase.deliverables.length;
      const done = phase.deliverables.filter(d => d.status === "done").length;
      let status = "pending";
      if (done > 0 && done < total) status = "in_progress";
      if (done === total && total > 0) status = "completed";
      return { ...phase, status };
    });

    setPhases(withPhaseStatus);
    setSaving(true);
    await base44.entities.EngagementRoom.update(room.id, { projectTracking: withPhaseStatus });
    setSaving(false);
  };

  const totalDeliverables = phases.flatMap(p => p.deliverables).length;
  const doneDeliverables = phases.flatMap(p => p.deliverables).filter(d => d.status === "done").length;
  const progressPct = totalDeliverables > 0 ? Math.round((doneDeliverables / totalDeliverables) * 100) : 0;

  return (
    <div style={{ minHeight: "100vh", background: COLORS.bg, color: COLORS.text, fontFamily: fonts.body }}>
      <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=DM+Sans:wght@300;400;500;600&family=DM+Serif+Display:ital@0;1&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        borderBottom: `1px solid ${COLORS.border}`,
        background: "rgba(10,26,20,0.95)", backdropFilter: "blur(12px)",
        padding: "0 24px", height: 56,
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.7rem" }}>
          <div style={{ width: 22, height: 10, background: COLORS.text, borderRadius: 5 }} />
          <span style={{ fontFamily: fonts.body, fontSize: "1rem", fontWeight: 400, color: COLORS.text, letterSpacing: "0.1em" }}>drvrs</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {saving && (
            <span style={{ fontFamily: fonts.mono, fontSize: 9, color: COLORS.textDim, letterSpacing: 1 }}>SAVING...</span>
          )}
          <div style={{
            fontFamily: fonts.mono, fontSize: 9, color: COLORS.accent,
            background: COLORS.accentDim, border: `1px solid ${COLORS.accentBorder}`,
            borderRadius: 4, padding: "4px 10px", letterSpacing: 1,
          }}>
            ACTIVE ENGAGEMENT
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ paddingTop: 56, maxWidth: 800, margin: "0 auto", padding: "80px 24px 80px" }}>

        {/* Header block */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontFamily: fonts.mono, fontSize: 10, color: COLORS.textDim, letterSpacing: 2, marginBottom: 16 }}>
            {room.companyName?.toUpperCase()} · PROJECT TRACKER
          </div>
          <div style={{ fontFamily: fonts.display, fontSize: 36, fontWeight: 300, color: COLORS.text, marginBottom: 8 }}>
            {room.selectedOption || "Your Engagement"}
          </div>
          <div style={{ fontFamily: fonts.body, fontSize: 14, color: COLORS.textMuted }}>
            Track deliverables and progress across all phases of the engagement.
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontFamily: fonts.mono, fontSize: 10, color: COLORS.textMuted, letterSpacing: 1 }}>OVERALL PROGRESS</span>
            <span style={{ fontFamily: fonts.mono, fontSize: 10, color: COLORS.accent, letterSpacing: 1 }}>{doneDeliverables}/{totalDeliverables} COMPLETE</span>
          </div>
          <div style={{ height: 4, background: COLORS.border, borderRadius: 2 }}>
            <div style={{
              height: "100%", borderRadius: 2, background: COLORS.accent,
              width: `${progressPct}%`, transition: "width 0.4s ease",
            }} />
          </div>
        </div>

        {/* Phases */}
        {phases.length === 0 ? (
          <div style={{
            textAlign: "center", padding: "60px 0",
            fontFamily: fonts.body, fontSize: 14, color: COLORS.textMuted,
          }}>
            No project phases have been set up yet.
            {isAdmin && " Go to Admin → Rooms to configure phases for this engagement."}
          </div>
        ) : (
          phases.map((phase, phaseIdx) => {
            const statusStyle = phaseStatusColors[phase.status] || phaseStatusColors.pending;
            const phaseDone = phase.deliverables.filter(d => d.status === "done").length;
            return (
              <div key={phaseIdx} style={{
                marginBottom: 24, border: `1px solid ${COLORS.border}`,
                borderRadius: 8, overflow: "hidden",
              }}>
                {/* Phase header */}
                <div style={{
                  padding: "16px 20px",
                  background: COLORS.surface,
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  borderBottom: phase.deliverables.length > 0 ? `1px solid ${COLORS.border}` : "none",
                }}>
                  <div>
                    <div style={{ fontFamily: fonts.body, fontSize: 15, fontWeight: 500, color: COLORS.text }}>
                      {phase.name}
                    </div>
                    <div style={{ fontFamily: fonts.mono, fontSize: 9, color: COLORS.textMuted, letterSpacing: 1, marginTop: 4 }}>
                      {phaseDone}/{phase.deliverables.length} DELIVERABLES
                    </div>
                  </div>
                  <div style={{
                    fontFamily: fonts.mono, fontSize: 9, letterSpacing: 1,
                    padding: "4px 10px", borderRadius: 4,
                    background: statusStyle.bg, color: statusStyle.text, border: `1px solid ${statusStyle.border}`,
                  }}>
                    {phaseStatusLabels[phase.status] || "PENDING"}
                  </div>
                </div>

                {/* Deliverables */}
                {phase.deliverables.map((d, delivIdx) => (
                  <div
                    key={delivIdx}
                    onClick={() => toggleDeliverable(phaseIdx, delivIdx)}
                    style={{
                      padding: "14px 20px",
                      display: "flex", alignItems: "flex-start", gap: 14,
                      borderBottom: delivIdx < phase.deliverables.length - 1 ? `1px solid ${COLORS.border}` : "none",
                      cursor: "pointer",
                      background: "transparent",
                      transition: "background 0.15s ease",
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = COLORS.surfaceHover}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    {/* Checkbox */}
                    <div style={{
                      width: 18, height: 18, borderRadius: 4, flexShrink: 0, marginTop: 1,
                      border: `1.5px solid ${d.status === "done" ? COLORS.accent : COLORS.borderMed}`,
                      background: d.status === "done" ? COLORS.accentDim : "transparent",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      transition: "all 0.15s ease",
                    }}>
                      {d.status === "done" && (
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                          <path d="M1 4L3.5 6.5L9 1" stroke={COLORS.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                    {/* Text */}
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontFamily: fonts.body, fontSize: 14, color: d.status === "done" ? COLORS.textMuted : COLORS.text,
                        textDecoration: d.status === "done" ? "line-through" : "none",
                        transition: "all 0.15s ease",
                      }}>
                        {d.name}
                      </div>
                      {d.description && (
                        <div style={{ fontFamily: fonts.body, fontSize: 12, color: COLORS.textMuted, marginTop: 2, lineHeight: 1.5 }}>
                          {d.description}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}