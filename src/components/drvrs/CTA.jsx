import React from "react";
import { ArrowRight } from "lucide-react";
import RevealOnScroll from "./RevealOnScroll";

export default function CTA() {
  return (
    <section
      className="min-h-[70vh] flex flex-col items-center justify-center text-center py-[10vh] px-[8vw]"
      style={{ background: "var(--dark)" }}
    >
      <RevealOnScroll>
        <p
          className="max-w-[500px] leading-[1.7] mb-12"
          style={{
            fontSize: "clamp(1.05rem, 1.3vw, 1.15rem)",
            color: "var(--muted)",
          }}
        >
          drvrs is a framework, a community, and a new way of thinking about selling.
        </p>
      </RevealOnScroll>

      <RevealOnScroll delay={0.15}>
        <a
          href="#"
          className="inline-flex items-center gap-3 rounded-full no-underline transition-all duration-300 hover:-translate-y-0.5 group"
          style={{
            background: "var(--accent)",
            color: "var(--cream)",
            padding: "1rem 2.5rem",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "0.95rem",
            fontWeight: 400,
            letterSpacing: "0.02em",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#35a080")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "var(--accent)")}
        >
          Be a drvr
          <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
        </a>
      </RevealOnScroll>
    </section>
  );
}