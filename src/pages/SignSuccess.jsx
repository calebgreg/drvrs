import React from "react";
import { useParams, useSearchParams } from "react-router-dom";

const COLORS = {
  bg: "#0a1a14",
  surface: "#0f2219",
  border: "rgba(245,240,232,0.06)",
  text: "#f5f0e8",
  textMuted: "#7a8a82",
  textDim: "rgba(245,240,232,0.3)",
  accent: "#2d8a6e",
  accentDim: "rgba(45,138,110,0.15)",
};

const fonts = {
  mono: "'JetBrains Mono', 'SF Mono', 'Fira Code', monospace",
  body: "'DM Sans', 'Helvetica Neue', sans-serif",
  display: "'DM Serif Display', Georgia, serif",
};

export default function SignSuccess() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");

  return (
    <div style={{ background: COLORS.bg, minHeight: "100vh", fontFamily: fonts.body, color: COLORS.text, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
      <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=DM+Sans:wght@300;400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap" rel="stylesheet" />

      {/* Grain */}
      <div style={{ position: "fixed", inset: 0, opacity: 0.035, backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`, backgroundSize: "200px 200px", pointerEvents: "none", zIndex: 1000 }} />

      {/* Top nav */}
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "2rem 3rem", mixBlendMode: "difference" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.7rem" }}>
          <div style={{ width: 26, height: 12, background: COLORS.text, borderRadius: 6, flexShrink: 0 }} />
          <span style={{ fontFamily: fonts.body, fontSize: "1.1rem", fontWeight: 400, color: COLORS.text, letterSpacing: "0.1em" }}>drvrs</span>
        </div>
      </div>

      <div style={{ textAlign: "center", maxWidth: 480, padding: "0 40px", position: "relative", zIndex: 10 }}>
        {/* Success indicator */}
        <div style={{ width: 48, height: 48, border: `1px solid ${COLORS.accent}55`, borderRadius: "50%", background: COLORS.accentDim, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 32px" }}>
          <span style={{ color: COLORS.accent, fontSize: 20 }}>✓</span>
        </div>

        <div style={{ fontFamily: fonts.mono, fontSize: 10, letterSpacing: 3, color: COLORS.accent, marginBottom: 20, textTransform: "uppercase" }}>
          Agreement Confirmed
        </div>
        <div style={{ fontFamily: fonts.display, fontSize: 40, fontWeight: 400, margin: "0 0 20px", lineHeight: 1.2, color: COLORS.text }}>
          You're in.
        </div>
        <div style={{ fontFamily: fonts.body, fontSize: 15, color: COLORS.textMuted, lineHeight: 1.8, margin: "0 0 48px" }}>
          Payment received and agreement signed. You'll receive a confirmation email shortly. Expect to hear from Caleb within 24 hours.
        </div>
        <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: "20px 24px", fontFamily: fonts.mono, fontSize: 9, letterSpacing: 1.5, color: COLORS.textDim, textTransform: "uppercase" }}>
          DRVRS · {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
        </div>
      </div>
    </div>
  );
}