import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";

const COLORS = {
  bg: "#0d0d0d",
  border: "#222",
  text: "#f0ede6",
  textDim: "#888",
  textMuted: "#555",
};

const fonts = {
  body: "'DM Sans', sans-serif",
  serif: "'DM Serif Display', serif",
  mono: "'DM Mono', 'Courier New', monospace",
};

export default function SignSuccess() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");

  return (
    <div style={{ background: COLORS.bg, minHeight: "100vh", fontFamily: fonts.body, color: COLORS.text, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center", maxWidth: 480, padding: "0 40px" }}>
        <div style={{ fontFamily: fonts.mono, fontSize: 10, letterSpacing: 3, color: COLORS.textDim, marginBottom: 24 }}>AGREEMENT CONFIRMED</div>
        <h1 style={{ fontFamily: fonts.serif, fontSize: 40, fontWeight: 400, margin: "0 0 20px", lineHeight: 1.2 }}>
          You're in.
        </h1>
        <p style={{ fontFamily: fonts.body, fontSize: 15, color: COLORS.textDim, lineHeight: 1.7, margin: "0 0 40px" }}>
          Payment received and agreement signed. You'll receive a confirmation email shortly. Expect to hear from Caleb within 24 hours.
        </p>
        <div style={{ border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: "20px 24px", fontFamily: fonts.mono, fontSize: 10, letterSpacing: 1, color: COLORS.textMuted }}>
          DRVRS · {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
        </div>
      </div>
    </div>
  );
}