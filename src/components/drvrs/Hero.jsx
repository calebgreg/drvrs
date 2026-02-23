import React from "react";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="min-h-screen flex flex-col justify-center px-[8vw] relative">
      <div className="max-w-[800px]">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          className="mb-8 leading-[1.15] tracking-tight"
          style={{
            fontFamily: "'DM Serif Display', serif",
            fontWeight: 400,
            fontSize: "clamp(2.8rem, 5.5vw, 4.5rem)",
            letterSpacing: "-0.02em",
          }}
        >
          Selling is change management.
          <br />
          Nobody treats it that way.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
          className="max-w-[540px] leading-[1.7]"
          style={{
            fontSize: "clamp(1.05rem, 1.5vw, 1.25rem)",
            color: "var(--muted)",
          }}
        >
          Every deal is an attempt to change how an organization operates. The seller just happens to be the one leading that change, with almost no visibility into the forces working for and against them.
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 1.2 }}
        className="absolute bottom-12 left-[8vw]"
        style={{ color: "var(--muted)" }}
      >
        <span className="text-xs uppercase tracking-[0.15em]">Scroll</span>
        <span
          className="block w-px h-10 mt-3"
          style={{
            background: "var(--muted)",
            animation: "pulse-line 2s ease-in-out infinite",
          }}
        />
      </motion.div>
    </section>
  );
}