import React from "react";
import RevealOnScroll from "./RevealOnScroll";

const items = [
  { letter: "G", word: "Goal", desc: "The board-level initiative. What the organization needs to accomplish, and what happens if they don't." },
  { letter: "C", word: "Constraints", desc: "The organizational realities limiting their ability to reach that goal. These exist whether a seller shows up or not." },
  { letter: "D", word: "Drivers", desc: "The lever that would move a constraint, whether the organization has found it yet or not." },
  { letter: "C", word: "Conditions", desc: "The attributes of an organization that shape what a driver can achieve. Changeable, but only if visible." },
  { letter: "I", word: "Inputs", desc: "The ground-level specifics that feed a condition. The raw material that makes it strong or weak." },
];

export default function Framework() {
  return (
    <section
      className="py-[15vh] px-[8vw]"
      style={{ background: "var(--cream)", color: "var(--dark)" }}
    >
      <RevealOnScroll>
        <div
          className="mb-16 text-xs uppercase tracking-[0.2em]"
          style={{ color: "var(--accent)" }}
        >
          The diagnostic layer
        </div>
      </RevealOnScroll>

      <RevealOnScroll delay={0.1}>
        <div
          className="grid grid-cols-1 md:grid-cols-5 gap-px mb-16"
          style={{ background: "rgba(10, 26, 20, 0.1)" }}
        >
          {items.map((item, i) => (
            <div
              key={i}
              className="text-center p-8 md:p-10"
              style={{ background: "var(--cream)" }}
            >
              <div
                className="mb-3"
                style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontSize: "2.5rem",
                  color: "var(--dark)",
                }}
              >
                {item.letter}
              </div>
              <div
                className="mb-4 text-[0.7rem] uppercase tracking-[0.2em]"
                style={{ color: "var(--muted)" }}
              >
                {item.word}
              </div>
              <div
                className="text-sm leading-relaxed font-light"
                style={{ color: "var(--dark)" }}
              >
                {item.desc}
              </div>
            </div>
          ))}
        </div>
      </RevealOnScroll>

      <RevealOnScroll delay={0.2}>
        <p
          className="max-w-[600px] leading-[1.8]"
          style={{
            fontSize: "clamp(1.05rem, 1.3vw, 1.15rem)",
            color: "var(--dark)",
          }}
        >
        </p>
      </RevealOnScroll>
    </section>
  );
}