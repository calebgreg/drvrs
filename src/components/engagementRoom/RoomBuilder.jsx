import { useState } from "react";
import { base44 } from "@/api/base44Client";

const COLORS = {
  surface: "#0f2219",
  surfaceDeep: "#0a1a14",
  border: "rgba(245,240,232,0.06)",
  borderFocus: "rgba(45,138,110,0.4)",
  text: "#f5f0e8",
  textMuted: "#7a8a82",
  textDim: "rgba(245,240,232,0.3)",
  accent: "#2d8a6e",
  accentDim: "rgba(45,138,110,0.15)",
};
const fonts = {
  mono: "'JetBrains Mono', 'SF Mono', monospace",
  body: "'DM Sans', 'Helvetica Neue', sans-serif",
};

const DEFAULT_ROOM = {
  prospectName: "",
  prospectEmail: "",
  companyName: "",
  slug: "",
  goalTitle: "50 paying customers.",
  goalDescription: "You are not raising. So 50 is not a revenue milestone. 50 is the number that tells you this thing works.",
  goalCallout: "50 is a PMF signal, not a sales target.",
  goalFooter: "That distinction changes everything about how you get there. We do not optimize a funnel. We find the pattern.",
  decompositionDescription: "If the goal were revenue, we would decompose revenue. But the goal is proof. Proof has a different structure.",
  constraintTitle: "CONSTRAINT IDENTIFIED",
  constraintDescription: "You are using broadcast channels to do discovery work. Ads are scale tools. They amplify a signal that already exists. You cannot scale what you have not found yet.",
  constraintFooter: "Finding the first 10 is a hand-to-hand job. Cold calls. DMs. Personalized video. You are looking for a specific reaction.",
  shiftsSection: [
    { title: "Value Prop", before: "Competing on price.", after: "Recoverable revenue. Quantify the bleed before pitching the fix." },
    { title: "Outreach Method", before: "Passive ads.", after: "Cold calls. Personalized video to their own domain. DMs. The first 10 come from conversations." },
    { title: "Conference Strategy", before: "No presence.", after: "Get the booth. Signal you exist. Conversations are pipeline." },
    { title: "Scaling Trigger", before: "Writing your own copy.", after: "Your 10 fanatics write your ads for you. Scale after the signal exists." },
  ],
  workSection: [
    { number: "1", title: "Reframe", status: "Ready", description: "One working session to rebuild positioning. Produces a positioning statement, demo talk track, and outbound language." },
    { number: "2", title: "Hunt the 10", status: "Pending", description: "Define the exact buyer profile. Build the hit list. Cold outbound your way to 10 agencies willing to pay anything." },
    { number: "3", title: "Let Them Find the 40", status: "Pending", description: "Interview the 10. Extract their language. Map their networks. Build referral channels through people who already believe." },
  ],
  playbookSection: [
    { tag: "POSITIONING", title: "The Revenue Frame", content: "Stop saying cheaper. Start saying what the buyer feels when they are losing money. Describe their Tuesday morning." },
    { tag: "ICP", title: "The Buyer That Buys First", content: "Not every prospect is your customer now. Find the specific profile and stop wasting calls on deals that won't close at this stage." },
    { tag: "OUTBOUND", title: "Cold Outreach That Finds the 10", content: "You are not trying to close. You are screening for a reaction. One question, then shut up." },
    { tag: "EVENTS", title: "Conference Strategy", content: "Conferences are proof of existence. Pre-schedule conversations. Host a dinner. The booth is presence. Conversations are pipeline." },
    { tag: "SCALE", title: "How the 10 Find the 40", content: "Once you have 10 who love the product, interview them. Their words are your marketing copy. Their referrals are your pipeline." },
  ],
  engagementOneDayTitle: "Phase 1 Only",
  engagementOneDayDescription: "Positioning reframe. ICP definition. Outbound sequence built. Flat fee. Walk away with the tools to hunt the 10 yourself.",
  engagementOneInitiativeTitle: "Phases 1 through 3",
  engagementOneInitiativeDescription: "Full 60-day engagement from positioning through the first 10 and the referral infrastructure to reach 40. Milestone-based.",
  engagementFooter: "Happy to do a 30-minute call to figure out which fits.",
  proposalOptions: [
    {
      name: "One Day",
      price: "",
      timeline: "Half-day session",
      deliverables: ["Positioning statement", "Demo talk track", "Outbound sequence"],
      agreementUrl: "",
      highlighted: false,
    },
    {
      name: "One Initiative",
      price: "",
      timeline: "60-day engagement",
      deliverables: ["Full positioning reframe", "ICP definition", "Outbound build", "Referral infrastructure"],
      agreementUrl: "",
      highlighted: true,
    },
  ],
  proposalNote: "Both options include a 30-day check-in. No retainer. No ongoing obligation.",
};

function Field({ label, value, onChange, multiline = false, mono = false }) {
  const inputStyle = {
    width: "100%",
    background: COLORS.surfaceDeep,
    border: `1px solid ${COLORS.border}`,
    borderRadius: 6,
    padding: "10px 14px",
    color: COLORS.text,
    fontFamily: mono ? fonts.mono : fonts.body,
    fontSize: mono ? 11 : 13,
    outline: "none",
    resize: multiline ? "vertical" : "none",
    minHeight: multiline ? 80 : "auto",
    boxSizing: "border-box",
  };

  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ fontFamily: fonts.mono, fontSize: 9, color: COLORS.textMuted, letterSpacing: 1.5, textTransform: "uppercase", display: "block", marginBottom: 6 }}>
        {label}
      </label>
      {multiline ? (
        <textarea value={value || ""} onChange={e => onChange(e.target.value)} style={inputStyle} />
      ) : (
        <input value={value || ""} onChange={e => onChange(e.target.value)} style={inputStyle} />
      )}
    </div>
  );
}

function SectionHeader({ label }) {
  return (
    <div style={{
      fontFamily: fonts.mono, fontSize: 9, color: COLORS.accent, letterSpacing: 2,
      textTransform: "uppercase", marginBottom: 16, marginTop: 32,
      paddingBottom: 8, borderBottom: `1px solid ${COLORS.border}`,
    }}>
      {label}
    </div>
  );
}

export default function RoomBuilder({ room, onSaved }) {
  const [data, setData] = useState(room || { ...DEFAULT_ROOM });
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState("basics");

  const set = (key, value) => setData(d => ({ ...d, [key]: value }));

  const setArrayItem = (key, index, field, value) => {
    setData(d => {
      const arr = [...(d[key] || [])];
      arr[index] = { ...arr[index], [field]: value };
      return { ...d, [key]: arr };
    });
  };

  const addArrayItem = (key, template) => {
    setData(d => ({ ...d, [key]: [...(d[key] || []), { ...template }] }));
  };

  const removeArrayItem = (key, index) => {
    setData(d => {
      const arr = [...(d[key] || [])];
      arr.splice(index, 1);
      return { ...d, [key]: arr };
    });
  };

  const autoSlug = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const handleGenerateProposal = async () => {
    setGenerating(true);
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `You are writing a proposal for a consulting engagement room.

Here is the context about this prospect:
- Company: ${data.companyName}
- Prospect: ${data.prospectName}
- Goal: ${data.goalTitle}
- Goal description: ${data.goalDescription}
- Core constraint: ${data.constraintDescription}
- Shifts planned: ${(data.shiftsSection || []).map(s => s.title + ": " + s.after).join("; ")}
- Work phases: ${(data.workSection || []).map(w => w.title + " — " + w.description).join("; ")}

Generate exactly 2 proposal options tailored to this company and context. One should be a focused, shorter engagement ("One Day") and one a fuller initiative engagement. Make pricing, timelines, and deliverables feel specific to their situation. Also write a short closing note (1-2 sentences, warm but direct).`,
        response_json_schema: {
          type: "object",
          properties: {
            proposalOptions: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  price: { type: "string" },
                  timeline: { type: "string" },
                  deliverables: { type: "array", items: { type: "string" } },
                  agreementUrl: { type: "string" },
                  highlighted: { type: "boolean" }
                }
              }
            },
            proposalNote: { type: "string" }
          }
        }
      });
      setData(d => ({
        ...d,
        proposalOptions: result.proposalOptions || d.proposalOptions,
        proposalNote: result.proposalNote || d.proposalNote,
      }));
    } finally {
      setGenerating(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (room) {
        await base44.entities.EngagementRoom.update(room.id, data);
      } else {
        await base44.entities.EngagementRoom.create(data);
      }
      onSaved();
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: "basics", label: "BASICS" },
    { id: "goal", label: "GOAL" },
    { id: "constraint", label: "CONSTRAINT" },
    { id: "shifts", label: "SHIFTS" },
    { id: "work", label: "WORK" },
    { id: "playbook", label: "PLAYBOOK" },
    { id: "engagement", label: "CLOSE" },
    { id: "proposal", label: "PROPOSAL" },
  ];

  return (
    <div style={{ maxWidth: 720 }}>
      <div style={{ marginBottom: 8 }}>
        <div style={{ fontFamily: fonts.mono, fontSize: 11, color: COLORS.textMuted, letterSpacing: 1, marginBottom: 4 }}>
          {room ? `Editing — ${room.companyName}` : "New Engagement Room"}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, marginBottom: 32, flexWrap: "wrap" }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
            background: activeTab === t.id ? COLORS.accentDim : "transparent",
            border: `1px solid ${activeTab === t.id ? COLORS.accent + "55" : COLORS.border}`,
            borderRadius: 4, padding: "6px 14px", cursor: "pointer",
            fontFamily: fonts.mono, fontSize: 9,
            color: activeTab === t.id ? COLORS.accent : COLORS.textMuted,
            letterSpacing: 1,
          }}>{t.label}</button>
        ))}
      </div>

      {/* Basics */}
      {activeTab === "basics" && (
        <div>
          <SectionHeader label="Prospect" />
          <Field label="Company Name" value={data.companyName} onChange={v => {
            set("companyName", v);
            if (!room) set("slug", autoSlug(v));
          }} />
          <Field label="Prospect Name" value={data.prospectName} onChange={v => set("prospectName", v)} />
          <Field label="Prospect Email" value={data.prospectEmail} onChange={v => set("prospectEmail", v)} />
          <SectionHeader label="Room URL" />
          <Field label="Slug (e.g. insurvoice-q2)" value={data.slug} onChange={v => set("slug", autoSlug(v))} mono />
          <div style={{ fontFamily: fonts.mono, fontSize: 9, color: COLORS.textDim, marginTop: -8, marginBottom: 16 }}>
            Room URL: /room/{data.slug || "your-slug"}
          </div>
        </div>
      )}

      {/* Goal */}
      {activeTab === "goal" && (
        <div>
          <SectionHeader label="Goal Section" />
          <Field label="Goal Headline" value={data.goalTitle} onChange={v => set("goalTitle", v)} />
          <Field label="Body Text" value={data.goalDescription} onChange={v => set("goalDescription", v)} multiline />
          <Field label="Callout Box" value={data.goalCallout} onChange={v => set("goalCallout", v)} />
          <Field label="Footer Text" value={data.goalFooter} onChange={v => set("goalFooter", v)} multiline />
          <SectionHeader label="Decomposition Section" />
          <Field label="Intro Text" value={data.decompositionDescription} onChange={v => set("decompositionDescription", v)} multiline />
        </div>
      )}

      {/* Constraint */}
      {activeTab === "constraint" && (
        <div>
          <SectionHeader label="Constraint Section" />
          <Field label="Constraint Title" value={data.constraintTitle} onChange={v => set("constraintTitle", v)} />
          <Field label="Constraint Body" value={data.constraintDescription} onChange={v => set("constraintDescription", v)} multiline />
          <Field label="Footer Paragraph" value={data.constraintFooter} onChange={v => set("constraintFooter", v)} multiline />
        </div>
      )}

      {/* Shifts */}
      {activeTab === "shifts" && (
        <div>
          <SectionHeader label="Shift Cards" />
          {(data.shiftsSection || []).map((shift, i) => (
            <div key={i} style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: 20, marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <span style={{ fontFamily: fonts.mono, fontSize: 9, color: COLORS.accent, letterSpacing: 1 }}>SHIFT {i + 1}</span>
                <button onClick={() => removeArrayItem("shiftsSection", i)} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: fonts.mono, fontSize: 9, color: "rgba(239,68,68,0.6)", letterSpacing: 1 }}>REMOVE</button>
              </div>
              <Field label="Title" value={shift.title} onChange={v => setArrayItem("shiftsSection", i, "title", v)} />
              <Field label="Current State" value={shift.before} onChange={v => setArrayItem("shiftsSection", i, "before", v)} multiline />
              <Field label="After Shift" value={shift.after} onChange={v => setArrayItem("shiftsSection", i, "after", v)} multiline />
            </div>
          ))}
          <button onClick={() => addArrayItem("shiftsSection", { title: "", before: "", after: "" })} style={{
            background: COLORS.accentDim, border: `1px solid ${COLORS.accent}44`, borderRadius: 6,
            padding: "8px 16px", cursor: "pointer", fontFamily: fonts.mono, fontSize: 9, color: COLORS.accent, letterSpacing: 1,
          }}>+ ADD SHIFT</button>
        </div>
      )}

      {/* Work */}
      {activeTab === "work" && (
        <div>
          <SectionHeader label="Work Phases" />
          {(data.workSection || []).map((phase, i) => (
            <div key={i} style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: 20, marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <span style={{ fontFamily: fonts.mono, fontSize: 9, color: COLORS.accent, letterSpacing: 1 }}>PHASE {i + 1}</span>
                <button onClick={() => removeArrayItem("workSection", i)} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: fonts.mono, fontSize: 9, color: "rgba(239,68,68,0.6)", letterSpacing: 1 }}>REMOVE</button>
              </div>
              <Field label="Title" value={phase.title} onChange={v => setArrayItem("workSection", i, "title", v)} />
              <Field label="Status" value={phase.status} onChange={v => setArrayItem("workSection", i, "status", v)} />
              <Field label="Description" value={phase.description} onChange={v => setArrayItem("workSection", i, "description", v)} multiline />
            </div>
          ))}
          <button onClick={() => addArrayItem("workSection", { number: String((data.workSection || []).length + 1), title: "", status: "Pending", description: "" })} style={{
            background: COLORS.accentDim, border: `1px solid ${COLORS.accent}44`, borderRadius: 6,
            padding: "8px 16px", cursor: "pointer", fontFamily: fonts.mono, fontSize: 9, color: COLORS.accent, letterSpacing: 1,
          }}>+ ADD PHASE</button>
        </div>
      )}

      {/* Playbook */}
      {activeTab === "playbook" && (
        <div>
          <SectionHeader label="Playbook Items" />
          {(data.playbookSection || []).map((item, i) => (
            <div key={i} style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: 20, marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <span style={{ fontFamily: fonts.mono, fontSize: 9, color: COLORS.accent, letterSpacing: 1 }}>PLAY {i + 1}</span>
                <button onClick={() => removeArrayItem("playbookSection", i)} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: fonts.mono, fontSize: 9, color: "rgba(239,68,68,0.6)", letterSpacing: 1 }}>REMOVE</button>
              </div>
              <Field label="Tag" value={item.tag} onChange={v => setArrayItem("playbookSection", i, "tag", v)} mono />
              <Field label="Title" value={item.title} onChange={v => setArrayItem("playbookSection", i, "title", v)} />
              <Field label="Content" value={item.content} onChange={v => setArrayItem("playbookSection", i, "content", v)} multiline />
            </div>
          ))}
          <button onClick={() => addArrayItem("playbookSection", { tag: "", title: "", content: "" })} style={{
            background: COLORS.accentDim, border: `1px solid ${COLORS.accent}44`, borderRadius: 6,
            padding: "8px 16px", cursor: "pointer", fontFamily: fonts.mono, fontSize: 9, color: COLORS.accent, letterSpacing: 1,
          }}>+ ADD PLAY</button>
        </div>
      )}

      {/* Engagement */}
      {activeTab === "engagement" && (
        <div>
          <SectionHeader label="One Day Option" />
          <Field label="Title" value={data.engagementOneDayTitle} onChange={v => set("engagementOneDayTitle", v)} />
          <Field label="Description" value={data.engagementOneDayDescription} onChange={v => set("engagementOneDayDescription", v)} multiline />
          <SectionHeader label="One Initiative Option" />
          <Field label="Title" value={data.engagementOneInitiativeTitle} onChange={v => set("engagementOneInitiativeTitle", v)} />
          <Field label="Description" value={data.engagementOneInitiativeDescription} onChange={v => set("engagementOneInitiativeDescription", v)} multiline />
          <SectionHeader label="Footer" />
          <Field label="Footer Message" value={data.engagementFooter} onChange={v => set("engagementFooter", v)} />
        </div>
      )}

      {/* Proposal */}
      {activeTab === "proposal" && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
            <div style={{ fontFamily: fonts.mono, fontSize: 9, color: COLORS.accent, letterSpacing: 2, textTransform: "uppercase" }}>Proposal Options</div>
            <button
              onClick={handleGenerateProposal}
              disabled={generating}
              style={{
                background: generating ? COLORS.surfaceDeep : COLORS.accentDim,
                border: `1px solid ${COLORS.accent}55`,
                borderRadius: 6, padding: "8px 18px", cursor: generating ? "not-allowed" : "pointer",
                fontFamily: fonts.mono, fontSize: 9, color: COLORS.accent, letterSpacing: 1,
                display: "flex", alignItems: "center", gap: 8, opacity: generating ? 0.7 : 1,
              }}
            >
              <span style={{ fontSize: 12 }}>✦</span>
              {generating ? "GENERATING..." : "GENERATE WITH AI"}
            </button>
          </div>
          <SectionHeader label="Proposal Options" />
          {(data.proposalOptions || []).map((opt, i) => (
            <div key={i} style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: 20, marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <span style={{ fontFamily: fonts.mono, fontSize: 9, color: COLORS.accent, letterSpacing: 1 }}>OPTION {i + 1}</span>
                <button onClick={() => removeArrayItem("proposalOptions", i)} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: fonts.mono, fontSize: 9, color: "rgba(239,68,68,0.6)", letterSpacing: 1 }}>REMOVE</button>
              </div>
              <Field label="Option Name" value={opt.name} onChange={v => setArrayItem("proposalOptions", i, "name", v)} />
              <Field label="Price (e.g. $4,500)" value={opt.price} onChange={v => setArrayItem("proposalOptions", i, "price", v)} mono />
              <Field label="Timeline (e.g. Half-day session)" value={opt.timeline} onChange={v => setArrayItem("proposalOptions", i, "timeline", v)} />
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontFamily: fonts.mono, fontSize: 9, color: COLORS.textMuted, letterSpacing: 1.5, textTransform: "uppercase", display: "block", marginBottom: 6 }}>Deliverables (one per line)</label>
                <textarea
                  value={(opt.deliverables || []).join("\n")}
                  onChange={e => setArrayItem("proposalOptions", i, "deliverables", e.target.value.split("\n"))}
                  style={{ width: "100%", background: COLORS.surfaceDeep, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: "10px 14px", color: COLORS.text, fontFamily: fonts.body, fontSize: 13, outline: "none", resize: "vertical", minHeight: 80, boxSizing: "border-box" }}
                />
              </div>
              <Field label="Agreement / E-sign URL" value={opt.agreementUrl} onChange={v => setArrayItem("proposalOptions", i, "agreementUrl", v)} mono />
              <div style={{ marginBottom: 8 }}>
                <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                  <input type="checkbox" checked={!!opt.highlighted} onChange={e => setArrayItem("proposalOptions", i, "highlighted", e.target.checked)} />
                  <span style={{ fontFamily: fonts.mono, fontSize: 9, color: COLORS.textMuted, letterSpacing: 1 }}>HIGHLIGHT AS RECOMMENDED</span>
                </label>
              </div>
            </div>
          ))}
          <button onClick={() => addArrayItem("proposalOptions", { name: "", price: "", timeline: "", deliverables: [], agreementUrl: "", highlighted: false })} style={{
            background: COLORS.accentDim, border: `1px solid ${COLORS.accent}44`, borderRadius: 6,
            padding: "8px 16px", cursor: "pointer", fontFamily: fonts.mono, fontSize: 9, color: COLORS.accent, letterSpacing: 1,
          }}>+ ADD OPTION</button>
          <SectionHeader label="Closing Note" />
          <Field label="Note below options" value={data.proposalNote} onChange={v => set("proposalNote", v)} multiline />
        </div>
      )}

      {/* Save */}
      <div style={{ marginTop: 40, paddingTop: 24, borderTop: `1px solid ${COLORS.border}`, display: "flex", gap: 12 }}>
        <button onClick={handleSave} disabled={saving} style={{
          background: COLORS.accentDim, border: `1px solid ${COLORS.accent}55`,
          borderRadius: 6, padding: "10px 32px", cursor: "pointer",
          fontFamily: fonts.mono, fontSize: 11, color: COLORS.accent, letterSpacing: 1,
          opacity: saving ? 0.6 : 1,
        }}>
          {saving ? "SAVING..." : room ? "SAVE CHANGES" : "CREATE ROOM"}
        </button>
      </div>
    </div>
  );
}