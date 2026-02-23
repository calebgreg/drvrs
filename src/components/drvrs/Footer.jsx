import React from "react";

export default function Footer() {
  return (
    <footer
      className="flex justify-between items-center px-[8vw] py-12 text-sm"
      style={{
        color: "var(--muted)",
        borderTop: "1px solid rgba(245, 240, 232, 0.08)",
      }}
    >
      <a href="#" className="flex items-center gap-2 no-underline" style={{ color: "var(--cream)" }}>
        <div className="w-[22px] h-[11px] rounded-md" style={{ background: "var(--cream)" }} />
        <span className="font-normal text-sm tracking-wide" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          drvrs
        </span>
      </a>
      <span>© 2026</span>
    </footer>
  );
}