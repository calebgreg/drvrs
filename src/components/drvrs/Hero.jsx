import React from "react";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section
      className="relative flex flex-col justify-center px-[8vw]"
      style={{ minHeight: "100vh", background: "var(--dark)" }}
    >
      <div style={{ maxWidth: 800 }}>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          style={{
            fontFamily: "'DM Serif Display', serif",
            fontWeight: 400,
            fontSize: "clamp(2.8rem, 5.5vw, 4.5rem)",
            lineHeight: 1.15,
            letterSpacing: "-0.02em",
            marginBottom: "2rem",
            color: "var(--cream)",
          }}
        >
          Selling is change management.<br />
          Nobody treats it that way.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
          style={{
            fontSize: "clamp(1.05rem, 1.5vw, 1.25rem)",
            lineHeight: 1.7,
            color: "var(--muted)",
            maxWidth: 540,
          }}
        >
          Every deal is an attempt to change how an organization operates. The seller just happens to be the one leading that change, with almost no visibility into the forces working for and against them.
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 1.2 }}
        style={{
          position: "absolute",
          bottom: "3rem",
          left: "8vw",
          color: "var(--muted)",
        }}
      >
        <span style={{ fontSize: "0.75rem", letterSpacing: "0.15em", textTransform: "uppercase" }}>Scroll</span>
        <span
          style={{
            display: "block",
            width: 1,
            height: 40,
            background: "var(--muted)",
            marginTop: "0.75rem",
            animation: "pulse-line 2s ease-in-out infinite",
          }}
        />
      </motion.div>
    </section>
  );
}