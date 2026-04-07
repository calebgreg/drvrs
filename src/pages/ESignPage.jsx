import React, { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { base44 } from "@/api/base44Client";

const COLORS = {
  bg: "#0d0d0d",
  surface: "#141414",
  border: "#222",
  text: "#f0ede6",
  textMuted: "#555",
  textDim: "#888",
  accent: "#f0ede6",
};

const fonts = {
  body: "'DM Sans', sans-serif",
  serif: "'DM Serif Display', serif",
  mono: "'DM Mono', 'Courier New', monospace",
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

  // Interpolate variables in agreement
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

    // Create signature record
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

    // Create Stripe checkout session
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
    <div style={{ background: COLORS.bg, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ color: COLORS.textDim, fontFamily: fonts.mono, fontSize: 12, letterSpacing: 2 }}>LOADING</div>
    </div>
  );

  if (error) return (
    <div style={{ background: COLORS.bg, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ color: "#e55", fontFamily: fonts.body, fontSize: 14 }}>{error}</div>
    </div>
  );

  return (
    <div style={{ background: COLORS.bg, minHeight: "100vh", fontFamily: fonts.body, color: COLORS.text }}>
      {/* Header */}
      <div style={{ borderBottom: `1px solid ${COLORS.border}`, padding: "20px 40px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ fontFamily: fonts.mono, fontSize: 11, letterSpacing: 2, color: COLORS.textDim }}>DRVRS · AGREEMENT</div>
        {option && (
          <div style={{ fontFamily: fonts.mono, fontSize: 11, letterSpacing: 1, color: COLORS.textDim }}>
            {option.name} · {option.price}
          </div>
        )}
      </div>

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "60px 40px" }}>
        {/* Title */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontFamily: fonts.mono, fontSize: 10, letterSpacing: 2, color: COLORS.textDim, marginBottom: 12 }}>SERVICE AGREEMENT</div>
          <h1 style={{ fontFamily: fonts.serif, fontSize: 32, fontWeight: 400, margin: 0, lineHeight: 1.2 }}>
            {room?.companyName}
          </h1>
          <div style={{ fontFamily: fonts.body, fontSize: 13, color: COLORS.textDim, marginTop: 8 }}>
            {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </div>
        </div>

        {/* Agreement content */}
        <div
          style={{
            background: COLORS.surface,
            border: `1px solid ${COLORS.border}`,
            borderRadius: 8,
            padding: "32px 40px",
            marginBottom: 40,
            maxHeight: 480,
            overflowY: "auto",
            fontSize: 14,
            lineHeight: 1.8,
            color: COLORS.textDim,
          }}
          dangerouslySetInnerHTML={{ __html: interpolate(agreement?.content) || defaultAgreement(room, option) }}
        />

        {/* Signature block */}
        <div style={{ borderTop: `1px solid ${COLORS.border}`, paddingTop: 40 }}>
          <div style={{ fontFamily: fonts.mono, fontSize: 10, letterSpacing: 2, color: COLORS.textDim, marginBottom: 24 }}>ELECTRONIC SIGNATURE</div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "block", fontFamily: fonts.mono, fontSize: 10, letterSpacing: 1, color: COLORS.textDim, marginBottom: 10 }}>
              TYPE YOUR FULL NAME TO SIGN
            </label>
            <input
              type="text"
              value={signedName}
              onChange={e => setSignedName(e.target.value)}
              placeholder={room?.prospectName || "Your full name"}
              style={{
                width: "100%",
                background: "transparent",
                border: `1px solid ${COLORS.border}`,
                borderRadius: 6,
                padding: "14px 16px",
                fontFamily: fonts.serif,
                fontSize: 20,
                color: COLORS.text,
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 32 }}>
            <div
              onClick={() => setAgreed(!agreed)}
              style={{
                width: 18,
                height: 18,
                border: `1px solid ${agreed ? COLORS.text : COLORS.border}`,
                borderRadius: 3,
                flexShrink: 0,
                marginTop: 2,
                cursor: "pointer",
                background: agreed ? COLORS.text : "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {agreed && <span style={{ color: COLORS.bg, fontSize: 12, lineHeight: 1 }}>✓</span>}
            </div>
            <div style={{ fontFamily: fonts.body, fontSize: 13, color: COLORS.textDim, lineHeight: 1.6 }}>
              I have read and agree to the terms of this agreement. I understand that typing my name above constitutes a legally binding electronic signature.
            </div>
          </div>

          <button
            onClick={handleSign}
            disabled={!signedName.trim() || !agreed || submitting}
            style={{
              width: "100%",
              padding: "18px",
              background: signedName.trim() && agreed ? COLORS.text : COLORS.surface,
              color: signedName.trim() && agreed ? COLORS.bg : COLORS.textMuted,
              border: `1px solid ${signedName.trim() && agreed ? COLORS.text : COLORS.border}`,
              borderRadius: 6,
              fontFamily: fonts.mono,
              fontSize: 11,
              letterSpacing: 2,
              cursor: signedName.trim() && agreed ? "pointer" : "not-allowed",
              transition: "all 0.2s ease",
            }}
          >
            {submitting ? "REDIRECTING TO PAYMENT..." : "SIGN & PROCEED TO PAYMENT →"}
          </button>

          <div style={{ fontFamily: fonts.body, fontSize: 12, color: COLORS.textMuted, textAlign: "center", marginTop: 16 }}>
            Secured by Stripe · Payment required to complete engagement
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