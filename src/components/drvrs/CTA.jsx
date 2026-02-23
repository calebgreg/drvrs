import React from "react";
import RevealOnScroll from "./RevealOnScroll";

export default function CTA() {
  return (
    <section
      style={{
        background: "var(--dark)",
        minHeight: "70vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "10vh 8vw",
      }}
    >
      <RevealOnScroll>
        <p
          style={{
            fontSize: "clamp(1.05rem, 1.3vw, 1.15rem)",
            color: "var(--muted)",
            marginBottom: "3rem",
            maxWidth: 500,
            lineHeight: 1.7,
          }}
        >
          drvrs is a framework, a community, and a new way of thinking about selling.
        </p>
      </RevealOnScroll>

      <RevealOnScroll delay={0.15}>
        <a
          href="#"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.75rem",
            background: "var(--accent)",
            color: "var(--cream)",
            padding: "1rem 2.5rem",
            borderRadius: "50px",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "0.95rem",
            fontWeight: 400,
            textDecoration: "none",
            transition: "all 0.3s ease",
            letterSpacing: "0.02em",
          }}
          onMouseEnter={e => { e.currentTarget.style.background = "#35a080"; e.currentTarget.style.transform = "translateY(-2px)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "var(--accent)"; e.currentTarget.style.transform = "translateY(0)"; }}
        >
          Be a drvr
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ width: 16, height: 16 }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </a>
      </RevealOnScroll>
    </section>
  );
}