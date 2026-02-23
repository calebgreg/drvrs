import React from "react";

export default function Nav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-8 py-8 md:px-12 flex justify-between items-center mix-blend-difference">
      <a href="#" className="flex items-center gap-2.5 no-underline" style={{ color: "var(--cream)" }}>
        <div className="w-7 h-3.5 rounded-full" style={{ background: "var(--cream)" }} />
        <span className="font-normal text-lg tracking-wide" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          drvrs
        </span>
      </a>
    </nav>
  );
}