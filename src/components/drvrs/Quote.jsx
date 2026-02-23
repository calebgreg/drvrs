import React from "react";
import RevealOnScroll from "./RevealOnScroll";

export default function Quote() {
  return (
    <section
      className="min-h-[60vh] flex items-center justify-center text-center py-[10vh] px-[8vw]"
      style={{ background: "var(--dark)" }}
    >
      <RevealOnScroll>
        <blockquote
          className="max-w-[750px] leading-[1.3] italic"
          style={{
            fontFamily: "'DM Serif Display', serif",
            fontWeight: 400,
            fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)",
            color: "var(--cream)",
          }}
        >
          Sellers are change managers who have no idea what they're managing.
        </blockquote>
      </RevealOnScroll>
    </section>
  );
}