import React from "react";

export default function Nav() {
  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: "2rem 3rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mixBlendMode: "difference",
      }}
    >
      <a
        href="#"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.6rem",
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "1.2rem",
          fontWeight: 400,
          letterSpacing: "0.05em",
          color: "var(--cream)",
          textDecoration: "none",
        }}
      >
        <div style={{ width: 28, height: 14, background: "var(--cream)", borderRadius: 7 }} />
        drvrs
      </a>
    </nav>
  );
}