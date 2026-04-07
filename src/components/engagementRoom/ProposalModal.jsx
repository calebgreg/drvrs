import React from "react";

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
};

const fonts = {
  mono: "'JetBrains Mono', 'SF Mono', 'Fira Code', monospace",
  body: "'DM Sans', 'Helvetica Neue', sans-serif",
  display: "'DM Serif Display', Georgia, serif",
};

export default function ProposalModal({ isOpen, onClose, onSelect, oneDaySelected, roomSlug }) {
  if (!isOpen) return null;

  const options = [
    {
      name: "One Day",
      basePrice: 2500,
      timeline: "Half-day session",
      highlighted: false,
    },
    {
      name: "One Initiative",
      basePrice: 6000,
      timeline: "60 Days",
      highlighted: true,
    },
    {
      name: "One Team",
      basePrice: 32000,
      timeline: "6 Months",
      highlighted: false,
    },
  ];

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        padding: "20px",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: COLORS.surface,
          border: `1px solid ${COLORS.border}`,
          borderRadius: 12,
          maxWidth: 600,
          maxHeight: "80vh",
          overflowY: "auto",
          padding: "48px 40px",
          fontFamily: fonts.body,
          color: COLORS.text,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontFamily: fonts.mono, fontSize: 10, color: COLORS.accent, letterSpacing: 3, marginBottom: 12, textTransform: "uppercase" }}>
            Select Your Engagement
          </div>
          <div style={{ fontFamily: fonts.display, fontSize: 28, fontWeight: 400, color: COLORS.text, lineHeight: 1.2 }}>
            Which option fits your needs?
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 32 }}>
          {options.map((opt, i) => {
            const isOneDay = i === 0;
            const creditedPrice = oneDaySelected && !isOneDay ? opt.basePrice - 2500 : opt.basePrice;
            const displayPrice = `$${creditedPrice.toLocaleString()}`;
            const originalPrice = `$${opt.basePrice.toLocaleString()}`;

            return (
              <button
                key={i}
                onClick={() => onSelect(i)}
                style={{
                  background: opt.highlighted ? "rgba(45,138,110,0.08)" : COLORS.surface,
                  border: `1px solid ${opt.highlighted ? COLORS.accent + "55" : COLORS.border}`,
                  borderRadius: 10,
                  padding: "24px 28px",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.2s ease",
                  display: "block",
                  width: "100%",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = opt.highlighted ? "rgba(45,138,110,0.12)" : COLORS.surfaceHover;
                  e.currentTarget.style.borderColor = COLORS.accent + "77";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = opt.highlighted ? "rgba(45,138,110,0.08)" : COLORS.surface;
                  e.currentTarget.style.borderColor = opt.highlighted ? COLORS.accent + "55" : COLORS.border;
                }}
              >
                {opt.highlighted && (
                  <div style={{ fontFamily: fonts.mono, fontSize: 8, color: COLORS.accent, letterSpacing: 2, marginBottom: 8, textTransform: "uppercase" }}>
                    RECOMMENDED
                  </div>
                )}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                  <div>
                    <div style={{ fontFamily: fonts.mono, fontSize: 11, color: COLORS.textMuted, letterSpacing: 1.5, marginBottom: 4, textTransform: "uppercase" }}>
                      {opt.name}
                    </div>
                    <div style={{ fontFamily: fonts.body, fontSize: 13, color: COLORS.textMuted }}>
                      {opt.timeline}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontFamily: fonts.display, fontSize: 24, color: COLORS.text, fontWeight: 400 }}>
                      {displayPrice}
                    </div>
                    {oneDaySelected && !isOneDay && (
                      <div style={{ fontFamily: fonts.body, fontSize: 11, color: COLORS.textDim, textDecoration: "line-through", marginTop: 4 }}>
                        {originalPrice}
                      </div>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {oneDaySelected && (
          <div style={{ background: COLORS.accentDim, border: `1px solid ${COLORS.accent}33`, borderRadius: 8, padding: "16px 20px", marginBottom: 32 }}>
            <div style={{ fontFamily: fonts.mono, fontSize: 9, color: COLORS.accent, letterSpacing: 1.5, marginBottom: 6, textTransform: "uppercase" }}>
              One Day Credit Applied
            </div>
            <div style={{ fontFamily: fonts.body, fontSize: 13, color: COLORS.text }}>
              $2,500 credit from your One Day engagement applied to this option.
            </div>
          </div>
        )}

        <button
          onClick={onClose}
          style={{
            width: "100%",
            padding: "14px 24px",
            background: "transparent",
            border: `1px solid ${COLORS.border}`,
            borderRadius: 6,
            fontFamily: fonts.mono,
            fontSize: 11,
            color: COLORS.textMuted,
            letterSpacing: 1,
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = COLORS.accent;
            e.currentTarget.style.color = COLORS.text;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = COLORS.border;
            e.currentTarget.style.color = COLORS.textMuted;
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}