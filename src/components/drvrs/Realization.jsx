import React from "react";
import RevealOnScroll from "./RevealOnScroll";

export default function Realization() {
  return (
    <section
      style={{
        background: "var(--cream)",
        color: "var(--dark)",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        padding: "12vh 8vw",
      }}
    >
      <RevealOnScroll style={{ maxWidth: 700 }}>
        <h2
          style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: "clamp(2rem, 4vw, 3.2rem)",
            fontWeight: 400,
            lineHeight: 1.2,
            marginBottom: "2.5rem",
            letterSpacing: "-0.01em",
            color: "var(--dark)",
          }}
        >
          Think about the last deal that died.
        </h2>
        <p
          style={{
            fontSize: "clamp(1.05rem, 1.3vw, 1.15rem)",
            lineHeight: 1.8,
            color: "var(--muted)",
            marginBottom: "1.5rem",
          }}
        >
          It probably wasn't because of price. It wasn't because the product was wrong. It wasn't because the rep didn't follow up.
        </p>
        <p
          style={{
            fontSize: "clamp(1.05rem, 1.3vw, 1.15rem)",
            lineHeight: 1.8,
            color: "var(--dark)",
            fontWeight: 400,
            marginBottom: "1.5rem",
          }}
        >
          Something shifted inside that organization. A priority changed, a stakeholder got reassigned, a budget got pulled into a different initiative. And by the time anyone on the selling side noticed, it was already over.
        </p>
        <p
          style={{
            fontSize: "clamp(1.05rem, 1.3vw, 1.15rem)",
            lineHeight: 1.8,
            color: "var(--muted)",
            marginBottom: "1.5rem",
          }}
        >
          This happens every day. Across every industry. In every sales org on the planet. And the response is always the same: update the CRM, adjust the forecast, move on.
        </p>
        <p
          style={{
            fontSize: "clamp(1.05rem, 1.3vw, 1.15rem)",
            lineHeight: 1.8,
            color: "var(--dark)",
            fontWeight: 400,
          }}
        >
          Nobody stops to ask why they didn't see it coming.
        </p>
      </RevealOnScroll>
    </section>
  );
}