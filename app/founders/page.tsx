import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { SectionFounders } from "../components/SectionFounders";
import { SectionCTA } from "../components/SectionCTA";

export const metadata = {
  title: "Founders",
  description: "Meet the Ocean State Protection Group founders.",
};

export default function FoundersPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20">
        <SectionFounders />
        <SectionCTA />
      </main>
      <Footer />
    </>
  );
}
