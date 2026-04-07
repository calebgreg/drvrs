import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import ReactQuill from "react-quill";

const COLORS = {
  bg: "#0d0d0d",
  surface: "#141414",
  border: "#222",
  text: "#f0ede6",
  textMuted: "#555",
  textDim: "#888",
};

const fonts = {
  body: "'DM Sans', sans-serif",
  mono: "'DM Mono', 'Courier New', monospace",
  serif: "'DM Serif Display', serif",
};

const DEFAULT_CONTENT = `<p>This Service Agreement ("Agreement") is entered into as of <strong>{{date}}</strong> between <strong>drvrs</strong> ("Service Provider") and <strong>{{companyName}}</strong> ("Client").</p>

<p><strong>Scope of Work</strong><br/>Service Provider agrees to deliver the services outlined in the <strong>{{optionName}}</strong> engagement, as described in the proposal presented to Client.</p>

<p><strong>Fees</strong><br/>Client agrees to pay <strong>{{price}}</strong> upon execution of this agreement. Payment is due immediately and will be processed via Stripe.</p>

<p><strong>Timeline</strong><br/>Services will be delivered within <strong>{{timeline}}</strong> of the agreement date.</p>

<p><strong>Confidentiality</strong><br/>Both parties agree to maintain the confidentiality of any proprietary information shared during the engagement.</p>

<p><strong>Governing Law</strong><br/>This Agreement shall be governed by the laws of the State of Delaware.</p>

<p>By signing below, Client acknowledges they have read, understood, and agree to be bound by the terms of this Agreement.</p>`;

export default function AgreementEditor() {
  const [content, setContent] = useState(DEFAULT_CONTENT);
  const [templateId, setTemplateId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    base44.entities.AgreementTemplate.list().then(templates => {
      if (templates.length) {
        setContent(templates[0].content || DEFAULT_CONTENT);
        setTemplateId(templates[0].id);
      }
    });
  }, []);

  const save = async () => {
    setSaving(true);
    if (templateId) {
      await base44.entities.AgreementTemplate.update(templateId, { content });
    } else {
      const t = await base44.entities.AgreementTemplate.create({ content, version: 1 });
      setTemplateId(t.id);
    }
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const variables = ["{{companyName}}", "{{prospectName}}", "{{optionName}}", "{{price}}", "{{timeline}}", "{{date}}"];

  return (
    <div style={{ background: COLORS.bg, minHeight: "100vh", fontFamily: fonts.body, color: COLORS.text, padding: 40 }}>
      <div style={{ maxWidth: 860, margin: "0 auto" }}>
        <div style={{ marginBottom: 32, display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontFamily: fonts.mono, fontSize: 10, letterSpacing: 2, color: COLORS.textDim, marginBottom: 8 }}>GLOBAL AGREEMENT TEMPLATE</div>
            <h1 style={{ fontFamily: fonts.serif, fontSize: 28, fontWeight: 400, margin: 0 }}>Service Agreement Editor</h1>
          </div>
          <button
            onClick={save}
            disabled={saving}
            style={{
              background: COLORS.text,
              color: COLORS.bg,
              border: "none",
              borderRadius: 6,
              padding: "12px 28px",
              fontFamily: fonts.mono,
              fontSize: 10,
              letterSpacing: 2,
              cursor: "pointer",
            }}
          >
            {saving ? "SAVING..." : saved ? "SAVED ✓" : "SAVE TEMPLATE"}
          </button>
        </div>

        {/* Variable tags */}
        <div style={{ marginBottom: 20, display: "flex", flexWrap: "wrap", gap: 8 }}>
          <span style={{ fontFamily: fonts.mono, fontSize: 10, color: COLORS.textDim, marginRight: 4, lineHeight: "26px" }}>VARIABLES:</span>
          {variables.map(v => (
            <span
              key={v}
              onClick={() => navigator.clipboard.writeText(v)}
              title="Click to copy"
              style={{
                fontFamily: fonts.mono,
                fontSize: 10,
                color: COLORS.textDim,
                background: COLORS.surface,
                border: `1px solid ${COLORS.border}`,
                borderRadius: 4,
                padding: "4px 10px",
                cursor: "pointer",
                letterSpacing: 0.5,
              }}
            >
              {v}
            </span>
          ))}
        </div>

        {/* Editor */}
        <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 8, overflow: "hidden" }}>
          <style>{`
            .ql-toolbar { background: #1a1a1a !important; border-color: #222 !important; }
            .ql-toolbar .ql-stroke { stroke: #888 !important; }
            .ql-toolbar .ql-fill { fill: #888 !important; }
            .ql-toolbar button:hover .ql-stroke { stroke: #f0ede6 !important; }
            .ql-container { background: #141414 !important; border-color: #222 !important; min-height: 500px; }
            .ql-editor { color: #888 !important; font-family: 'DM Sans', sans-serif !important; font-size: 14px !important; line-height: 1.8 !important; }
            .ql-editor p { margin-bottom: 12px; }
            .ql-editor strong { color: #f0ede6 !important; }
          `}</style>
          <ReactQuill
            value={content}
            onChange={setContent}
            theme="snow"
            modules={{ toolbar: [["bold", "italic", "underline"], [{ list: "ordered" }, { list: "bullet" }], ["clean"]] }}
          />
        </div>

        <div style={{ marginTop: 16, fontFamily: fonts.mono, fontSize: 10, color: COLORS.textMuted, lineHeight: 1.6 }}>
          Variables above are replaced automatically when the prospect views their agreement (e.g. {"{{companyName}}"} → their company name).
        </div>
      </div>
    </div>
  );
}