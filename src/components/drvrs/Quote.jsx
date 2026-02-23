import React from "react";
import RevealOnScroll from "./RevealOnScroll";

export default function Quote() {
  return (
    <section
      style={{
        background: "var(--dark)",
        minHeight: "60vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "10vh 8vw",
      }}
    >
      <RevealOnScroll>
        <blockquote
          style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)",
            fontWeight: 400,
            lineHeight: 1.3,
            maxWidth: 750,
            fontStyle: "italic",
            color: "var(--cream)",
          }}
        >
          Sellers are change managers who have no idea what they're managing.
        </blockquote>
      </RevealOnScroll>
    </section>
  );
}