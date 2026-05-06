import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { Hero } from "./components/Hero";
import { SectionThreatLandscape } from "./components/SectionThreatLandscape";
import { SectionShield } from "./components/SectionShield";
import { SectionAIDemo } from "./components/SectionAIDemo";
import { SectionPilot } from "./components/SectionPilot";
import { SectionPricing } from "./components/SectionPricing";
import { SectionFounders } from "./components/SectionFounders";
import { SectionCTA } from "./components/SectionCTA";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <SectionThreatLandscape />
        <SectionShield />
        <SectionAIDemo />
        <SectionPilot />
        <SectionPricing />
        <SectionFounders />
        <SectionCTA />
      </main>
      <Footer />
    </>
  );
}
