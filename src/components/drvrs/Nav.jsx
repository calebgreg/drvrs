import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";

export default function Nav() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    base44.auth.isAuthenticated().then(authed => {
      if (authed) base44.auth.me().then(u => setIsAdmin(u?.role === "admin"));
    });
  }, []);

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
      {isAdmin && (
        <a
          href="/admin/rooms"
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "0.7rem",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "var(--cream)",
            opacity: 0.4,
            textDecoration: "none",
          }}
          onMouseEnter={e => e.target.style.opacity = 1}
          onMouseLeave={e => e.target.style.opacity = 0.4}
        >
          Rooms ↗
        </a>
      )}
    </nav>
  );
}