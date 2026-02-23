import React from "react";

export default function Footer() {
  return (
    <footer
      style={{
        padding: "3rem 8vw",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        fontSize: "0.8rem",
        color: "var(--muted)",
        borderTop: "1px solid rgba(245, 240, 232, 0.08)",
      }}
    >
      <a
        href="#"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.6rem",
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "1rem",
          fontWeight: 400,
          letterSpacing: "0.05em",
          color: "var(--cream)",
          textDecoration: "none",
        }}
      >
        <div style={{ width: 22, height: 11, background: "var(--cream)", borderRadius: 6 }} />
        drvrs
      </a>
      <span>© 2026</span>
    </footer>
  );
}