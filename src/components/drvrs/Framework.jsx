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
      style={{
        background: "var(--cream)",
        color: "var(--dark)",
        padding: "15vh 8vw",
      }}
    >
      <RevealOnScroll>
        <div
          style={{
            fontSize: "0.75rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "var(--accent)",
            marginBottom: "4rem",
          }}
        >
          The diagnostic layer
        </div>
      </RevealOnScroll>

      <RevealOnScroll delay={0.1}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: "1px",
            background: "rgba(10, 26, 20, 0.1)",
            marginBottom: "4rem",
          }}
          className="framework-grid"
        >
          {items.map((item, i) => (
            <div
              key={i}
              style={{
                background: "var(--cream)",
                padding: "2.5rem 2rem",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontSize: "2.5rem",
                  color: "var(--dark)",
                  marginBottom: "0.75rem",
                }}
              >
                {item.letter}
              </div>
              <div
                style={{
                  fontSize: "0.7rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "var(--muted)",
                  marginBottom: "1rem",
                }}
              >
                {item.word}
              </div>
              <div
                style={{
                  fontSize: "0.85rem",
                  lineHeight: 1.6,
                  color: "var(--dark)",
                  fontWeight: 300,
                }}
              >
                {item.desc}
              </div>
            </div>
          ))}
        </div>
      </RevealOnScroll>
    </section>
  );
}