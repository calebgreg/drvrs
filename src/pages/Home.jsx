import React from "react";
import Nav from "../components/drvrs/Nav";
import Hero from "../components/drvrs/Hero";
import Realization from "../components/drvrs/Realization";
import Patterns from "../components/drvrs/Patterns";
import Philosophy from "../components/drvrs/Philosophy";
import Framework from "../components/drvrs/Framework";
import Quote from "../components/drvrs/Quote";
import CTA from "../components/drvrs/CTA";
import Footer from "../components/drvrs/Footer";

export default function Home() {
  return (
    <div className="min-h-screen" style={{ background: "var(--dark)" }}>
      <Nav />
      <Hero />
      <Realization />
      <Patterns />
      <Philosophy />
      <Framework />
      <Quote />
      <CTA />
      <Footer />
    </div>
  );
}