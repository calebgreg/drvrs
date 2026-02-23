import React from "react";
import RevealOnScroll from "./RevealOnScroll";

const patterns = [
  "The champion who lost credibility internally two weeks before your proposal landed.",
  "The CFO who froze discretionary spend but told no one outside the leadership team.",
  "The legal review that was always going to take 90 days, but nobody mentioned it until day 87.",
  "The competing initiative that quietly absorbed the budget earmarked for yours.",
  "The committee that formed last Tuesday that nobody told the seller about.",
];

export default function Patterns() {
  return (
    <section
      style={{
        background: "var(--warm)",
        color: "var(--dark)",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "12vh 8vw",
      }}
    >
      <RevealOnScroll>
        <div
          style={{
            fontSize: "0.75rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "var(--accent)",
            marginBottom: "3rem",
          }}
        >
          The patterns nobody talks about
        </div>
      </RevealOnScroll>

      <div>
        {patterns.map((text, i) => (
          <RevealOnScroll key={i} delay={i * 0.08}>
            <div
              style={{
                padding: "2.5rem 0",
                borderBottom: "1px solid rgba(10, 26, 20, 0.1)",
                ...(i === 0 ? { borderTop: "1px solid rgba(10, 26, 20, 0.1)" } : {}),
                display: "flex",
                gap: "3rem",
                alignItems: "baseline",
              }}
            >
              <div
                style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontSize: "1rem",
                  color: "var(--accent)",
                  flexShrink: 0,
                  width: "2rem",
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </div>
              <div
                style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontSize: "clamp(1.3rem, 2.5vw, 1.8rem)",
                  fontWeight: 400,
                  lineHeight: 1.4,
                  color: "var(--dark)",
                }}
              >
                {text}
              </div>
            </div>
          </RevealOnScroll>
        ))}
      </div>
    </section>
  );
}