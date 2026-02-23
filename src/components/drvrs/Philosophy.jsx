import React from "react";
import RevealOnScroll from "./RevealOnScroll";

export default function Philosophy() {
  return (
    <section
      className="min-h-screen flex items-center py-[12vh] px-[8vw]"
      style={{ background: "var(--green)", color: "var(--cream)" }}
    >
      <RevealOnScroll className="max-w-[650px]">
        <h2
          className="mb-10 leading-[1.2]"
          style={{
            fontFamily: "'DM Serif Display', serif",
            fontWeight: 400,
            fontSize: "clamp(2rem, 4vw, 3.2rem)",
          }}
        >
          Every organization is a system of forces.
        </h2>
        <p
          className="mb-6 leading-[1.8]"
          style={{ fontSize: "clamp(1.05rem, 1.3vw, 1.15rem)" }}
        >
          Goals pulling it forward. Constraints holding it back. People, priorities, and risks, all in motion, all the time.
        </p>
        <p
          className="mb-6 leading-[1.8]"
          style={{
            fontSize: "clamp(1.05rem, 1.3vw, 1.15rem)",
            color: "rgba(245, 240, 232, 0.5)",
          }}
        >
          Most of the people trying to create change inside these systems are operating on the surface. They see what they're told. They miss what governs.
        </p>
        <p
          className="leading-[1.8]"
          style={{ fontSize: "clamp(1.05rem, 1.3vw, 1.15rem)" }}
        >
          Want to be a driver? Find the drvrs.
        </p>
      </RevealOnScroll>
    </section>
  );
}