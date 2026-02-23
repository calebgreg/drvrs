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
      className="min-h-screen flex flex-col justify-center py-[12vh] px-[8vw]"
      style={{ background: "var(--warm)", color: "var(--dark)" }}
    >
      <RevealOnScroll>
        <div
          className="mb-12 text-xs uppercase tracking-[0.2em]"
          style={{ color: "var(--accent)" }}
        >
          The patterns nobody talks about
        </div>
      </RevealOnScroll>

      <div className="flex flex-col">
        {patterns.map((text, i) => (
          <RevealOnScroll key={i} delay={i * 0.08}>
            <div
              className="py-10 flex flex-col md:flex-row gap-3 md:gap-12 items-baseline"
              style={{
                borderBottom: "1px solid rgba(10, 26, 20, 0.1)",
                ...(i === 0 ? { borderTop: "1px solid rgba(10, 26, 20, 0.1)" } : {}),
              }}
            >
              <div
                className="shrink-0 md:w-8"
                style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontSize: "1rem",
                  color: "var(--accent)",
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </div>
              <div
                className="leading-[1.4]"
                style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontWeight: 400,
                  fontSize: "clamp(1.3rem, 2.5vw, 1.8rem)",
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