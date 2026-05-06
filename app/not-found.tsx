import Link from "next/link";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { ArrowRight, Home, MessageCircle } from "lucide-react";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="bg-hero-gradient grain min-h-screen flex items-center justify-center pt-32 pb-20 px-6">
        <div className="max-w-2xl text-center">
          <p className="font-display text-[120px] md:text-[180px] leading-none text-gradient-gold mb-4 select-none">
            404
          </p>
          <h1 className="font-display text-3xl md:text-4xl text-[var(--color-cream)] mb-4 leading-tight">
            That page is not on the map.
          </h1>
          <p className="text-[var(--color-silver-200)] mb-10 max-w-lg mx-auto leading-relaxed">
            Either the link is stale or the page moved. No threats, no
            casualties - just a missing route. Pick one of these instead.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/" className="btn-primary">
              <Home className="h-4 w-4" />
              Back to Home
            </Link>
            <Link href="/contact" className="btn-secondary">
              <MessageCircle className="h-4 w-4" />
              Contact Us
            </Link>
            <Link href="/walkthrough" className="btn-secondary">
              Book a Walkthrough
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
