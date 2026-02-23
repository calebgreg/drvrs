import React from "react";
import RevealOnScroll from "./RevealOnScroll";

export default function Realization() {
  return (
    <section
      className="min-h-screen flex items-center py-[12vh] px-[8vw] md:px-[8vw]"
      style={{ background: "var(--cream)", color: "var(--dark)" }}
    >
      <RevealOnScroll className="max-w-[700px]">
        <h2
          className="mb-10 leading-[1.2]"
          style={{
            fontFamily: "'DM Serif Display', serif",
            fontWeight: 400,
            fontSize: "clamp(2rem, 4vw, 3.2rem)",
            letterSpacing: "-0.01em",
          }}
        >
          Think about the last deal that died.
        </h2>
        <p
          className="mb-6 leading-[1.8]"
          style={{
            fontSize: "clamp(1.05rem, 1.3vw, 1.15rem)",
            color: "var(--muted)",
          }}
        >
          It probably wasn't because of price. It wasn't because the product was wrong. It wasn't because the rep didn't follow up.
        </p>
        <p
          className="mb-6 leading-[1.8] font-normal"
          style={{
            fontSize: "clamp(1.05rem, 1.3vw, 1.15rem)",
            color: "var(--dark)",
          }}
        >
          Something shifted inside that organization. A priority changed, a stakeholder got reassigned, a budget got pulled into a different initiative. And by the time anyone on the selling side noticed, it was already over.
        </p>
        <p
          className="mb-6 leading-[1.8]"
          style={{
            fontSize: "clamp(1.05rem, 1.3vw, 1.15rem)",
            color: "var(--muted)",
          }}
        >
          This happens every day. Across every industry. In every sales org on the planet. And the response is always the same: update the CRM, adjust the forecast, move on.
        </p>
        <p
          className="leading-[1.8] font-normal"
          style={{
            fontSize: "clamp(1.05rem, 1.3vw, 1.15rem)",
            color: "var(--dark)",
          }}
        >
          Nobody stops to ask why they didn't see it coming.
        </p>
      </RevealOnScroll>
    </section>
  );
}