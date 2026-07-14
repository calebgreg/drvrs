import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";

const STAGES = [
  {
    num: "Stage 0",
    name: "Unaware",
    state: "The problem exists in their operation, not in their model of it. 95% of the market is here.",
    see: [
      "Symptoms treated as fixed costs",
      "Workarounds nobody questions",
      "No internal name for the problem",
    ],
    fake: "Your move: name and frame the problem.",
  },
  {
    num: "Stage 1",
    name: "Aware",
    state: "The problem is named. Not yet ranked against anything.",
    see: [
      "Their version has details you never gave them",
      "A causal story: X happens because Y",
      "They bring it up unprompted",
    ],
    fake: "Not real if they only echo your framing.",
  },
  {
    num: "Stage 2",
    name: "Prioritized",
    state: "It displaced something. Worth resources before anyone agrees what to do.",
    see: [
      "On a roadmap, OKR, or budget line",
      "A named person is accountable",
      "Survived a quarter-end reshuffle",
    ],
    fake: 'Not real if the only evidence is "high priority for us."',
  },
  {
    num: "Stage 3",
    name: "Approach approved",
    state: 'Narrowed from "should we" to "with whom."',
    see: [
      "Build, hire, do-nothing ruled out",
      "Evaluation criteria they wrote",
      "Criteria survive your disappearance",
    ],
    fake: "Not real if it just sounded good in the room.",
  },
  {
    num: "Stage 4",
    name: "Committed",
    state: "Their plans no longer work without the solution in them.",
    see: [
      "Budget moved or reserved",
      "Implementation owner named",
      "Downstream commitments made",
    ],
    fake: "Out of pipeline. Delivery's problem now.",
  },
];

const GATES = [
  "They name the problem in their own words",
  "It lands on a real internal list, with an owner",
  "They pick a solution type and kill the alternatives",
  "Cost. Date. Cell.",
];

const COLORS = {
  bg: "#0a1a14",
  surface: "#1a3a2f",
  border: "rgba(245,240,232,0.1)",
  text: "#f5f0e8",
  textMuted: "#7a8a82",
  accent: "#2d8a6e",
};

export default function StagingSheet() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(setUser);
  }, []);

  if (!user || user.role !== "admin") {
    return (
      <div style={{ minHeight: "100vh", background: COLORS.bg, display: "flex", alignItems: "center", justifyContent: "center", color: COLORS.textMuted, fontFamily: "'DM Sans', sans-serif", fontSize: 13 }}>
        Admin access required.
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: COLORS.bg, color: COLORS.text, fontFamily: "'DM Sans', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&family=DM+Serif+Display:ital@0;1&display=swap" rel="stylesheet" />

      {/* Nav */}
      <div style={{ borderBottom: `1px solid ${COLORS.border}`, padding: "20px 40px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <a href="/" style={{ display: "flex", alignItems: "center", gap: "0.7rem", textDecoration: "none" }}>
            <div style={{ width: 22, height: 10, background: COLORS.text, borderRadius: 5 }} />
            <span style={{ fontSize: "1rem", fontWeight: 400, color: COLORS.text, letterSpacing: "0.1em" }}>drvrs</span>
          </a>
          <span style={{ color: COLORS.border, fontSize: 18 }}>|</span>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: COLORS.textMuted, letterSpacing: 2, textTransform: "uppercase" }}>
            Staging Sheet
          </span>
        </div>
        <a href="/admin/rooms" style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: COLORS.textMuted, letterSpacing: 1, textTransform: "uppercase", textDecoration: "none" }}>
          ← Rooms
        </a>
      </div>

      {/* Content */}
      <div className="w-full px-6 py-12">
        <div className="max-w-7xl mx-auto">

          {/* header */}
          <div className="flex items-baseline justify-between pb-4 mb-10" style={{ borderBottom: `1px solid ${COLORS.border}` }}>
            <span className="text-xl" style={{ fontFamily: "'DM Serif Display', serif" }}>drvrs</span>
            <span className="text-sm" style={{ color: COLORS.textMuted }}>
              Stages are states. Gates are what changed. Evidence lives in their world, not your notes.
            </span>
            <span className="text-[10px] uppercase" style={{ color: COLORS.textMuted, letterSpacing: "0.22em" }}>
              Staging sheet
            </span>
          </div>

          {/* the row */}
          <div className="flex items-stretch overflow-x-auto pb-2">
            {STAGES.map((s, i) => (
              <React.Fragment key={s.name}>
                <div
                  className="flex-1 min-w-[200px] flex flex-col rounded p-5"
                  style={{
                    background: i === STAGES.length - 1 ? "#f5f0e8" : "#1a3a2f",
                    color: i === STAGES.length - 1 ? "#0a1a14" : "#f5f0e8",
                  }}
                >
                  <div className="text-[10px] uppercase mb-1.5" style={{ letterSpacing: "0.2em", color: i === STAGES.length - 1 ? "rgba(10,26,20,0.6)" : COLORS.textMuted }}>
                    {s.num}
                  </div>
                  <div className="text-2xl mb-3 leading-tight" style={{ fontFamily: "'DM Serif Display', serif", fontWeight: 400 }}>
                    {s.name}
                  </div>
                  <p className="text-[13px] leading-snug mb-4 pb-4" style={{ borderBottom: i === STAGES.length - 1 ? "1px solid rgba(10,26,20,0.18)" : `1px solid ${COLORS.border}` }}>
                    {s.state}
                  </p>
                  <div className="text-[10px] uppercase mb-2" style={{ letterSpacing: "0.18em", color: COLORS.accent, fontWeight: 600 }}>
                    You'll see
                  </div>
                  <ul className="space-y-1.5 mb-4">
                    {s.see.map((item) => (
                      <li key={item} className="text-[12px] leading-snug pl-3 relative">
                        <span className="absolute left-0" style={{ color: COLORS.accent }}>·</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <p className="text-[11px] leading-snug mt-auto" style={{ color: i === STAGES.length - 1 ? "rgba(10,26,20,0.65)" : COLORS.textMuted }}>
                    {s.fake}
                  </p>
                </div>

                {i < GATES.length && (
                  <div className="flex flex-col items-center justify-center shrink-0 w-[120px] px-3 text-center">
                    <div className="text-lg mb-1.5" style={{ fontFamily: "'DM Serif Display', serif", color: COLORS.accent }}>
                      {i + 1} →
                    </div>
                    <p className="text-[11px] leading-snug" style={{ color: COLORS.text }}>
                      {GATES[i]}
                    </p>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* gate 4 detail strip */}
          <div className="mt-10 rounded flex flex-wrap items-center gap-x-8 gap-y-3 px-6 py-4" style={{ background: "#1a3a2f" }}>
            <span className="text-[10px] uppercase" style={{ letterSpacing: "0.2em", color: COLORS.textMuted }}>Gate 4 · Three numbers</span>
            <span className="text-[13px]"><b style={{ color: COLORS.accent, fontWeight: 600 }}>Cost</b>{" "}— they told you what it costs them</span>
            <span className="text-[13px]"><b style={{ color: COLORS.accent, fontWeight: 600 }}>Date</b>{" "}— a change date is on their calendar</span>
            <span className="text-[13px]"><b style={{ color: COLORS.accent, fontWeight: 600 }}>Cell</b>{" "}— you can text the person who owns it</span>
            <span className="text-[13px] ml-auto" style={{ fontFamily: "'DM Serif Display', serif" }}>All three, it's real. Missing one, it's not.</span>
          </div>

          {/* footer */}
          <div className="flex justify-between mt-8 pt-4 text-[10px] uppercase" style={{ borderTop: `1px solid ${COLORS.border}`, letterSpacing: "0.2em", color: COLORS.textMuted }}>
            <span>drvrs</span>
            <span>Deals can move backward. States are conditions, not checkpoints.</span>
            <span>States, not meetings</span>
          </div>

        </div>
      </div>
    </div>
  );
}