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
  goalDescription: "50 customers is not a revenue target. It is the number that tells everyone this thing works. That agencies keep paying, that the use case is real, that the pocket has been found.",
  goalCallout: "50 is a PMF signal, not a sales target.",
  goalFooter: "That distinction changes what matters. The question is not \"how do we get more leads.\" The question is \"what system produces product-market fit, and where is it stuck.\"",
  decompositionDescription: "Product-market fit is not a feeling. It is a system with three components. If any one collapses to zero, PMF is zero. It does not matter how strong the other two are.",
  constraintTitle: "CONSTRAINT IDENTIFIED",
  constraintDescription: "The current positioning leads with a feature comparison, not an outcome. When the promise is undefined, delivery is accidental and evidence is unmeasurable.",
  constraintFooter: "The product works. The problem is real. But the way it is described to the market does not name the outcome the customer experiences. That gap is where PMF stalls.",
  shiftsSection: [
    { title: "The Promise", before: "Feature comparison. Cheaper than alternatives. The conversation starts with price.", after: "A specific outcome compelling enough that agencies pay a premium for it. Price stops being the reason to buy and stops being the objection." },
    { title: "How Delivery Gets Validated", before: "Sign up customers and hope the product clicks. Adoption is passive.", after: "Engineer the outcome for early customers. Make sure the event happens. Measure whether it repeats." },
    { title: "How Evidence Gets Built", before: "Testimonials and logos. Social proof without specificity.", after: "A measurable pattern. What percentage of customers experience the outcome, how often, and how reliably." },
    { title: "How Growth Works", before: "Paid ads to a broad audience. Expensive, low signal.", after: "Early customers who experienced the outcome become the distribution channel. Their language becomes the marketing. Their networks become the pipeline." },
  ],
  workSection: [
    { number: "1", title: "Define the Promise", status: "Ready", description: "One working session to name the outcome Insurvoice produces for an agency. Not the feature. The event the customer experiences. This becomes the positioning, the demo talk track, and the outbound language. Half-day." },
    { number: "2", title: "Validate Delivery", status: "Pending", description: "Identify the agency profile most likely to experience the outcome. Get 10 of them into the product. Engineer the event with each one. Cold outbound, direct conversations, hands-on onboarding. 30 to 45 days." },
    { number: "3", title: "Build the Evidence", status: "Pending", description: "Interview the agencies that experienced the outcome. Measure the pattern. Extract their language. Their words become the marketing copy, their referrals become the pipeline, their data becomes the proof that PMF is real." },
  ],
  playbookSection: [
    { tag: "PROMISE", title: "The Outcome Already Exists", content: "An independent agency with 4 producers and no dedicated ops staff misses inbound calls after 5pm, on weekends, and during lunch. Those calls are quote requests, renewal questions, and first notice of loss. Each one has a dollar value. The agency principal knows this. It keeps them up at night. They just have not heard anyone name it back to them as a solvable problem.\n\nThe product that names the outcome the buyer already feels is the product that gets bought at a premium. The product that describes its own features gets compared on price." },
    { tag: "DISTRIBUTION", title: "How Insurance Actually Buys", content: "Agency principals do not buy from ads. They buy from peers. The buying pattern in independent insurance is: someone in the cluster group mentions it, or someone at the Big I state conference mentions it, or their carrier rep mentions it. Three touches from three different trusted sources and the principal calls.\n\nThis means the fastest path to the first 10 customers is not a funnel. It is getting inside the rooms where principals already talk to each other. Cluster group meetings. State association events. Carrier advisory councils. A warm introduction from a cluster group leader to their 15 member agencies is worth more than 1,000 impressions." },
    { tag: "OUTBOUND", title: "Conversations, Not Campaigns", content: "Paid advertising is a scale tool. It amplifies a signal that already exists. Before the signal exists, every dollar spent on ads is a guess. The signal comes from direct conversations where the reaction is visible.\n\nAn agency principal who sighs when asked about their after-hours calls is a different lead than an agency principal who clicks an ad. The sigh means they feel the problem. The click means they were curious. At this stage, the sigh is worth more.\n\nThe math on early outbound is counterintuitive. 10 deeply researched, personalized conversations per day will find the first believers faster than 500 automated emails." },
    { tag: "EVENTS", title: "The Conference Circuit Is Small", content: "Insurance is a small industry that thinks it is big. There are a finite number of events where independent agency principals gather. State Big I conferences. Applied Net. NetVu. Regional cluster group meetings. The same 200 to 300 agency principals show up repeatedly.\n\nThis is an advantage. A consistent presence at 4 to 5 events per year creates recognition that paid channels cannot replicate.\n\nThe booth is not the play. The booth is proof of existence. The play is the attendee list, the pre-scheduled conversations, and the dinner the night before with 8 principals who match the profile." },
    { tag: "SCALE", title: "Fans Write the Playbook", content: "The agency principal who experienced the outcome and kept paying is the most credible voice in the market. More credible than the website. More credible than the sales deck. More credible than the founder on a podcast.\n\nThe words fans use to describe the product to their peers are the positioning, the ad copy, and the website headline. They just need to be captured. Three questions in a 15-minute interview surface them: what was happening before, what changed, and who else should know about this.\n\nPaid advertising becomes a different instrument after this. Instead of guessing at messaging and audience, the language is proven and the targeting is specific." },
  ],
  engagementOneDayTitle: "ONE DAY",
  engagementOneDayDescription: "Name the outcome. Build the positioning, the ICP, and the outbound sequence around it. Flat fee. Everything needed to start validating delivery.",
  engagementOneInitiativeTitle: "ONE INITIATIVE",
  engagementOneInitiativeDescription: "Full 60-day engagement. Define the promise, validate delivery with early customers, build the evidence that PMF is real. Milestone-based.",
  engagementFooter: "See the proposal — pick the one that fits and sign.",
  proposalOptions: [
    {
      name: "ONE DAY",
      price: "$2,500",
      timeline: "",
      deliverables: ["Positioning statement built around the outcome", "Target agency profile with disqualifiers", "Outbound sequence ready to send", "Revised demo talk track"],
      agreementUrl: "",
      highlighted: false,
    },
    {
      name: "ONE INITIATIVE",
      price: "$6,000",
      timeline: "60 Days",
      deliverables: ["Everything in One Day", "10 target agencies identified and contacted", "Hands-on onboarding to engineer the outcome", "Fan interviews with extracted language", "Referral channel map", "Ad-ready copy from fan language"],
      agreementUrl: "",
      highlighted: true,
    },
    {
      name: "ONE TEAM",
      price: "$32,000",
      timeline: "6 Months",
      deliverables: ["A drvr embedded in the team", "GTM strategy owned end to end", "Weekly working sessions", "Outbound built and run until there is someone to hand it to", "Conference strategy and event execution", "First sales hire made when the system is ready for one", "The goal is to leave something behind that works without us"],
      agreementUrl: "",
      highlighted: false,
    },
  ],
  proposalNote: "Two ways to engage. Both are scoped, fixed-fee, and built around a single constraint.",
  emailSubject: "Your drvrs diagnostic — {{companyName}}",
  emailBody: `Hi {{prospectName}},

  Your personalized drvrs diagnostic engagement room is ready.

  Access it here:
  {{roomUrl}}

  This link is unique to you. Bookmark it for continued access.

  — drvrs`,
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
  const [data, setData] = useState(() => {
    if (!room) return { ...DEFAULT_ROOM };
    // Deep merge: DEFAULT_ROOM fills in any missing/empty fields from the saved room
    const merged = { ...DEFAULT_ROOM };
    Object.keys(room).forEach(key => {
      const val = room[key];
      if (val === null || val === undefined) return;
      if (typeof val === 'string' && val.trim() === '') return;
      if (Array.isArray(val) && val.length === 0) return;
      merged[key] = val;
    });
    return merged;
  });
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [generatingOption, setGeneratingOption] = useState(null); // index of option being generated
  const [optionPrompts, setOptionPrompts] = useState({}); // per-option prompt text
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

  const handleGenerateOption = async (index) => {
    setGeneratingOption(index);
    try {
      const prompt = optionPrompts[index] || "";
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `You are writing a single proposal option for a consulting engagement room.

Context:
- Company: ${data.companyName}
- Prospect: ${data.prospectName}
- Goal: ${data.goalTitle}
- Core constraint: ${data.constraintDescription}
- Work phases: ${(data.workSection || []).map(w => w.title + " — " + w.description).join("; ")}

${prompt ? `Additional instructions from the user: ${prompt}` : "Generate a well-scoped consulting option tailored to this company."}

Generate ONE proposal option with a compelling name, specific price, timeline, and deliverables list.`,
        response_json_schema: {
          type: "object",
          properties: {
            name: { type: "string" },
            price: { type: "string" },
            timeline: { type: "string" },
            deliverables: { type: "array", items: { type: "string" } },
          }
        }
      });
      setData(d => {
        const arr = [...(d.proposalOptions || [])];
        arr[index] = { ...arr[index], ...result };
        return { ...d, proposalOptions: arr };
      });
    } finally {
      setGeneratingOption(null);
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
    { id: "email", label: "EMAIL" },
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
          <SectionHeader label="Decomposition Tree" />
          <div style={{ fontFamily: fonts.mono, fontSize: 9, color: COLORS.textDim, marginBottom: 16, lineHeight: 1.6 }}>
            The tree diagram shown in the room. Root → Left Branch + Right Branch → each has a Leaf below it.
          </div>
          {[
            { key: "root", label: "Root Node (top)" },
            { key: "leftBranch", label: "Left Branch" },
            { key: "rightBranch", label: "Right Branch" },
            { key: "leftLeaf", label: "Left Leaf (bottom-left)" },
            { key: "rightLeaf", label: "Right Leaf (bottom-right)" },
          ].map(({ key, label }) => (
            <div key={key} style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: 16, marginBottom: 8 }}>
              <div style={{ fontFamily: fonts.mono, fontSize: 9, color: COLORS.accent, letterSpacing: 1, marginBottom: 10 }}>{label.toUpperCase()}</div>
              <Field label="Label (bold text)" value={data.decompositionTree?.[key]?.label || ""} onChange={v => setData(d => ({ ...d, decompositionTree: { ...(d.decompositionTree || {}), [key]: { ...(d.decompositionTree?.[key] || {}), label: v } } }))} mono />
              <Field label="Sublabel (small text below)" value={data.decompositionTree?.[key]?.sublabel || ""} onChange={v => setData(d => ({ ...d, decompositionTree: { ...(d.decompositionTree || {}), [key]: { ...(d.decompositionTree?.[key] || {}), sublabel: v } } }))} />
            </div>
          ))}
          <Field label="Caption (shown below diagram)" value={data.decompositionTree?.caption || ""} onChange={v => setData(d => ({ ...d, decompositionTree: { ...(d.decompositionTree || {}), caption: v } }))} />
        </div>
      )}

      {/* Constraint */}
      {activeTab === "constraint" && (
        <div>
          <SectionHeader label="Constraint Section" />
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontFamily: fonts.mono, fontSize: 9, color: COLORS.textMuted, letterSpacing: 1.5, textTransform: "uppercase", display: "block", marginBottom: 8 }}>Which branch is the constraint?</label>
            <div style={{ display: "flex", gap: 8 }}>
              {["left", "right"].map(side => (
                <button key={side} onClick={() => set("constraintBranch", side)} style={{
                  background: (data.constraintBranch || "left") === side ? "rgba(239,68,68,0.12)" : "transparent",
                  border: `1px solid ${(data.constraintBranch || "left") === side ? "rgba(239,68,68,0.5)" : COLORS.border}`,
                  borderRadius: 4, padding: "6px 16px", cursor: "pointer",
                  fontFamily: fonts.mono, fontSize: 9,
                  color: (data.constraintBranch || "left") === side ? "#EF4444" : COLORS.textMuted,
                  letterSpacing: 1, textTransform: "uppercase",
                }}>{side} branch</button>
              ))}
            </div>
          </div>
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
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontFamily: fonts.mono, fontSize: 9, color: COLORS.textMuted, letterSpacing: 1.5, textTransform: "uppercase", display: "block", marginBottom: 6 }}>AI Prompt (optional)</label>
                <div style={{ display: "flex", gap: 8 }}>
                  <input
                    value={optionPrompts[i] || ""}
                    onChange={e => setOptionPrompts(p => ({ ...p, [i]: e.target.value }))}
                    placeholder={`e.g. "a retainer option, $3k/mo, 3 month minimum"`}
                    style={{ flex: 1, background: COLORS.surfaceDeep, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: "8px 12px", color: COLORS.text, fontFamily: fonts.body, fontSize: 12, outline: "none" }}
                  />
                  <button
                    onClick={() => handleGenerateOption(i)}
                    disabled={generatingOption === i}
                    style={{
                      background: generatingOption === i ? COLORS.surfaceDeep : COLORS.accentDim,
                      border: `1px solid ${COLORS.accent}55`, borderRadius: 6,
                      padding: "8px 14px", cursor: generatingOption === i ? "not-allowed" : "pointer",
                      fontFamily: fonts.mono, fontSize: 9, color: COLORS.accent, letterSpacing: 1,
                      whiteSpace: "nowrap", opacity: generatingOption === i ? 0.7 : 1,
                    }}
                  >
                    {generatingOption === i ? "..." : "✦ AI"}
                  </button>
                </div>
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

      {/* Email */}
      {activeTab === "email" && (
        <div>
          <SectionHeader label="Invite Email" />
          <div style={{ fontFamily: fonts.mono, fontSize: 9, color: COLORS.textDim, marginBottom: 20, lineHeight: 1.8 }}>
            Available variables: <span style={{ color: COLORS.accent }}>{"{{prospectName}}"}</span> · <span style={{ color: COLORS.accent }}>{"{{companyName}}"}</span> · <span style={{ color: COLORS.accent }}>{"{{roomUrl}}"}</span>
          </div>
          <Field label="Subject" value={data.emailSubject} onChange={v => set("emailSubject", v)} />
          <Field label="Body" value={data.emailBody} onChange={v => set("emailBody", v)} multiline />
        </div>
      )}

      {/* Save */}
      <div style={{ marginTop: 40, paddingTop: 24, borderTop: `1px solid ${COLORS.border}`, display: "flex", gap: 12 }}>
        {data.slug && (
          <button onClick={() => window.open(`/room/${data.slug}?preview=1`, "_blank")} style={{
            background: "transparent", border: `1px solid ${COLORS.border}`,
            borderRadius: 6, padding: "10px 24px", cursor: "pointer",
            fontFamily: fonts.mono, fontSize: 11, color: COLORS.accent, letterSpacing: 1,
          }}>PREVIEW ↗</button>
        )}
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