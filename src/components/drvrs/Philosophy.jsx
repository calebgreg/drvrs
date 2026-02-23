import React from "react";
import RevealOnScroll from "./RevealOnScroll";

export default function Philosophy() {
  return (
    <section
      style={{
        background: "var(--green)",
        color: "var(--cream)",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        padding: "12vh 8vw",
      }}
    >
      <RevealOnScroll style={{ maxWidth: 650 }}>
        <h2
          style={{
            fontFamily: "'DM Serif Display', serif",
            fontWeight: 400,
            fontSize: "clamp(2rem, 4vw, 3.2rem)",
            lineHeight: 1.2,
            marginBottom: "2.5rem",
          }}
        >
          Every organization is a system of forces.
        </h2>
        <p style={{ fontSize: "clamp(1.05rem, 1.3vw, 1.15rem)", lineHeight: 1.8, marginBottom: "1.5rem" }}>
          Goals pulling it forward. Constraints holding it back. People, priorities, and risks, all in motion, all the time.
        </p>
        <p style={{ fontSize: "clamp(1.05rem, 1.3vw, 1.15rem)", lineHeight: 1.8, color: "rgba(245, 240, 232, 0.5)", marginBottom: "1.5rem" }}>
          Most of the people trying to create change inside these systems are operating on the surface. They see what they're told. They miss what governs.
        </p>
        <p style={{ fontSize: "clamp(1.05rem, 1.3vw, 1.15rem)", lineHeight: 1.8 }}>
          Want to be a driver? Find the drvrs.
        </p>
      </RevealOnScroll>
    </section>
  );
}