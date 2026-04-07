import React, { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { base44 } from "@/api/base44Client";

const COLORS = {
  bg: "#0a1a14",
  surface: "#0f2219",
  border: "rgba(245,240,232,0.06)",
  borderStrong: "rgba(245,240,232,0.12)",
  text: "#f5f0e8",
  textMuted: "#7a8a82",
  textDim: "rgba(245,240,232,0.3)",
  accent: "#2d8a6e",
  accentDim: "rgba(45,138,110,0.15)",
  accentGlow: "rgba(45,138,110,0.3)",
};

const fonts = {
  mono: "'JetBrains Mono', 'SF Mono', 'Fira Code', monospace",
  body: "'DM Sans', 'Helvetica Neue', sans-serif",
  display: "'DM Serif Display', Georgia, serif",
};

export default function ESignPage() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const optionIndex = parseInt(searchParams.get("option") || "0");

  const [room, setRoom] = useState(null);
  const [agreement, setAgreement] = useState(null);
  const [signedName, setSignedName] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      const rooms = await base44.entities.EngagementRoom.filter({ slug });
      if (!rooms.length) { setError("Room not found"); setLoading(false); return; }
      setRoom(rooms[0]);
      const templates = await base44.entities.AgreementTemplate.list();
      if (templates.length) setAgreement(templates[0]);
      setLoading(false);
    };
    load();
  }, [slug]);

  const option = room?.proposalOptions?.[optionIndex];

  const interpolate = (html) => {
    if (!html || !room) return html;
    return html
      .replace(/\{\{companyName\}\}/g, room.companyName || "")
      .replace(/\{\{prospectName\}\}/g, room.prospectName || "")
      .replace(/\{\{optionName\}\}/g, option?.name || "")
      .replace(/\{\{price\}\}/g, option?.price || "")
      .replace(/\{\{timeline\}\}/g, option?.timeline || "")
      .replace(/\{\{date\}\}/g, new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }));
  };

  const handleSign = async () => {
    if (!signedName.trim() || !agreed) return;
    setSubmitting(true);

    const record = await base44.entities.SignatureRecord.create({
      roomId: room.id,
      roomSlug: slug,
      prospectName: room.prospectName,
      prospectEmail: room.prospectEmail,
      companyName: room.companyName,
      optionName: option?.name,
      optionPrice: option?.price,
      signedName: signedName.trim(),
      signedAt: new Date().toISOString(),
      agreementContent: interpolate(agreement?.content || ""),
      paymentStatus: "pending",
    });

    const res = await base44.functions.invoke("createCheckoutSession", {
      signatureRecordId: record.id,
      roomSlug: slug,
      optionName: option?.name,
      optionPrice: option?.price,
      prospectEmail: room.prospectEmail,
      companyName: room.companyName,
    });

    if (res.data?.url) {
      window.location.href = res.data.url;
    } else {
      setError("Failed to create payment session. Please try again.");
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div style={{ background: COLORS.bg, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: fonts.mono }}>
      <div style={{ color: COLORS.textDim, fontSize: 11, letterSpacing: 3 }}>LOADING</div>
    </div>
  );

  if (error) return (
    <div style={{ background: COLORS.bg, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ color: "#ef4444", fontFamily: fonts.body, fontSize: 14 }}>{error}</div>
    </div>
  );

  const canSubmit = signedName.trim().length > 0 && agreed && !submitting;

  return (
    <div style={{ background: COLORS.bg, minHeight: "100vh", fontFamily: fonts.body, color: COLORS.text, position: "relative" }}>
      <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=DM+Sans:wght@300;400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap" rel="stylesheet" />

      {/* Grain */}
      <div style={{ position: "fixed", inset: 0, opacity: 0.035, backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`, backgroundSize: "200px 200px", pointerEvents: "none", zIndex: 1000 }} />

      {/* Top nav */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "2rem 3rem", mixBlendMode: "difference" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.7rem" }}>
          <div style={{ width: 26, height: 12, background: COLORS.text, borderRadius: 6, flexShrink: 0 }} />
          <span style={{ fontFamily: fonts.body, fontSize: "1.1rem", fontWeight: 400, color: COLORS.text, letterSpacing: "0.1em" }}>drvrs</span>
        </div>
        <div style={{ fontFamily: fonts.mono, fontSize: "0.7rem", fontWeight: 400, letterSpacing: "0.15em", textTransform: "uppercase", color: COLORS.text, opacity: 0.5 }}>
          {room?.companyName?.toUpperCase()}
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "120px 40px 80px", boxSizing: "border-box" }}>

        {/* Title block */}
        <div style={{ marginBottom: 52 }}>
          <div style={{ fontFamily: fonts.mono, fontSize: 10, color: COLORS.accent, letterSpacing: 3, textTransform: "uppercase", marginBottom: 16 }}>
            SERVICE AGREEMENT
          </div>
          <div style={{ fontFamily: fonts.display, fontSize: 36, fontWeight: 400, color: COLORS.text, lineHeight: 1.2, marginBottom: 12 }}>
            {room?.companyName}
          </div>
          {option && (
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 12 }}>
              <span style={{ fontFamily: fonts.mono, fontSize: 9, color: COLORS.accent, background: COLORS.accentDim, padding: "4px 10px", borderRadius: 4, letterSpacing: 1.5, textTransform: "uppercase" }}>
                {option.name}
              </span>
              <span style={{ fontFamily: fonts.display, fontSize: 20, color: COLORS.text }}>{option.price}</span>
              {option.timeline && <span style={{ fontFamily: fonts.mono, fontSize: 9, color: COLORS.textDim, letterSpacing: 1 }}>{option.timeline}</span>}
            </div>
          )}
          <div style={{ fontFamily: fonts.mono, fontSize: 10, color: COLORS.textDim, marginTop: 16, letterSpacing: 1 }}>
            {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </div>
        </div>

        {/* Agreement content */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontFamily: fonts.mono, fontSize: 9, color: COLORS.textDim, letterSpacing: 2, textTransform: "uppercase", marginBottom: 16 }}>
            TERMS & CONDITIONS
          </div>
          <div
            style={{
              background: COLORS.surface,
              border: `1px solid ${COLORS.border}`,
              borderRadius: 8,
              padding: "28px 32px",
              maxHeight: 400,
              overflowY: "auto",
              fontSize: 13.5,
              lineHeight: 1.85,
              color: COLORS.textMuted,
            }}
            dangerouslySetInnerHTML={{ __html: interpolate(agreement?.content) || defaultAgreement(room, option) }}
          />
        </div>

        {/* Signature block */}
        <div style={{ borderTop: `1px solid ${COLORS.border}`, paddingTop: 48 }}>
          <div style={{ fontFamily: fonts.mono, fontSize: 9, color: COLORS.accent, letterSpacing: 2, textTransform: "uppercase", marginBottom: 28 }}>
            ELECTRONIC SIGNATURE
          </div>

          <div style={{ marginBottom: 28 }}>
            <label style={{ display: "block", fontFamily: fonts.mono, fontSize: 9, letterSpacing: 1.5, color: COLORS.textDim, marginBottom: 12, textTransform: "uppercase" }}>
              Type your full name to sign
            </label>
            <input
              type="text"
              value={signedName}
              onChange={e => setSignedName(e.target.value)}
              placeholder={room?.prospectName || "Your full name"}
              style={{
                width: "100%",
                background: "transparent",
                border: `1px solid ${signedName.trim() ? COLORS.accent + "55" : COLORS.border}`,
                borderRadius: 6,
                padding: "14px 18px",
                fontFamily: fonts.display,
                fontSize: 22,
                color: COLORS.text,
                outline: "none",
                boxSizing: "border-box",
                transition: "border-color 0.2s ease",
              }}
              onFocus={e => e.target.style.borderColor = COLORS.accent + "88"}
              onBlur={e => e.target.style.borderColor = signedName.trim() ? COLORS.accent + "55" : COLORS.border}
            />
          </div>

          {/* Checkbox */}
          <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 36 }}>
            <div
              onClick={() => setAgreed(!agreed)}
              style={{
                width: 18,
                height: 18,
                border: `1px solid ${agreed ? COLORS.accent : COLORS.borderStrong}`,
                borderRadius: 3,
                flexShrink: 0,
                marginTop: 2,
                cursor: "pointer",
                background: agreed ? COLORS.accentDim : "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s ease",
              }}
            >
              {agreed && <span style={{ color: COLORS.accent, fontSize: 11, lineHeight: 1 }}>✓</span>}
            </div>
            <div style={{ fontFamily: fonts.body, fontSize: 13, color: COLORS.textMuted, lineHeight: 1.7 }}>
              I have read and agree to the terms of this agreement. I understand that typing my name above constitutes a legally binding electronic signature.
            </div>
          </div>

          {/* CTA button */}
          <button
            onClick={handleSign}
            disabled={!canSubmit}
            style={{
              width: "100%",
              padding: "18px",
              background: canSubmit ? COLORS.accentDim : "transparent",
              color: canSubmit ? COLORS.accent : COLORS.textDim,
              border: `1px solid ${canSubmit ? COLORS.accent + "55" : COLORS.border}`,
              borderRadius: 6,
              fontFamily: fonts.mono,
              fontSize: 11,
              letterSpacing: 2,
              cursor: canSubmit ? "pointer" : "not-allowed",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={e => { if (canSubmit) e.currentTarget.style.background = COLORS.accentGlow; }}
            onMouseLeave={e => { if (canSubmit) e.currentTarget.style.background = COLORS.accentDim; }}
          >
            {submitting ? "REDIRECTING TO PAYMENT..." : "SIGN & PROCEED TO PAYMENT →"}
          </button>

          <div style={{ fontFamily: fonts.mono, fontSize: 9, color: COLORS.textDim, textAlign: "center", marginTop: 16, letterSpacing: 1 }}>
            SECURED BY STRIPE · PAYMENT REQUIRED TO COMPLETE ENGAGEMENT
          </div>
        </div>
      </div>
    </div>
  );
}

function defaultAgreement(room, option) {
  return `
    <p>This Service Agreement ("Agreement") is entered into as of ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })} between <strong>drvrs</strong> ("Service Provider") and <strong>${room?.companyName || "[Client]"}</strong> ("Client").</p>
    <p><strong>Scope of Work</strong><br/>Service Provider agrees to deliver the services outlined in the <strong>${option?.name || "[Selected Option]"}</strong> engagement, as described in the proposal presented to Client.</p>
    <p><strong>Fees</strong><br/>Client agrees to pay <strong>${option?.price || "[Price]"}</strong> upon execution of this agreement. Payment is due immediately and will be processed via Stripe.</p>
    <p><strong>Timeline</strong><br/>${option?.timeline ? `Services will be delivered within <strong>${option.timeline}</strong>.` : "Timeline to be agreed upon project kickoff."}</p>
    <p><strong>Confidentiality</strong><br/>Both parties agree to maintain the confidentiality of any proprietary information shared during the engagement.</p>
    <p><strong>Governing Law</strong><br/>This Agreement shall be governed by the laws of the State of Delaware.</p>
    <p>By signing below, Client acknowledges they have read, understood, and agree to be bound by the terms of this Agreement.</p>
  `;
}