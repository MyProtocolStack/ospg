import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { Mail, Phone, MapPin } from "lucide-react";
import { ContactForm } from "./form";
import { BRAND } from "@/lib/brand";

export const metadata = {
  title: "Contact",
  description: "Talk to a Lighthouse Protection Group founder directly.",
};

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="bg-hero-gradient grain pt-36 pb-20 relative overflow-hidden">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-[var(--color-gold-400)]/10 blur-[120px] pointer-events-none" />
          <div className="relative mx-auto max-w-4xl px-6 lg:px-10 text-center">
            <p className="text-[12px] uppercase tracking-[0.2em] text-[var(--color-gold-400)] mb-4">
              Contact
            </p>
            <h1 className="font-display text-4xl md:text-6xl text-[var(--color-cream)] leading-[1.05] tracking-tight mb-6">
              Talk to a{" "}
              <span className="italic text-gradient-gold">founder.</span>
            </h1>
            <p className="text-lg text-[var(--color-silver-100)] max-w-2xl mx-auto leading-relaxed">
              We answer every inquiry personally. No call center. No assistant.
              Just one of us.
            </p>
          </div>
        </section>

        <section className="py-20">
          <div className="mx-auto max-w-5xl px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Direct contacts */}
            <div className="space-y-6">
              <ContactCard
                icon={Mail}
                label="Email"
                value={BRAND.email}
                href={`mailto:${BRAND.email}`}
              />
              <ContactCard
                icon={Phone}
                label="Phone"
                value={BRAND.phone}
                href={`tel:${BRAND.phone}`}
              />
              <ContactCard
                icon={MapPin}
                label="Service Area"
                value="Rhode Island + New England"
                href="/about"
              />

              <div className="surface-card p-5">
                <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--color-gold-400)] mb-2">
                  Response time
                </p>
                <p className="text-[14px] text-[var(--color-cream)] mb-1">
                  &lt; 24 hours
                </p>
                <p className="text-[12px] text-[var(--color-silver-300)] leading-relaxed">
                  We confirm every inquiry within 24 hours, including weekends.
                  Active credible threats: call directly.
                </p>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-2">
              <div className="surface-card-elevated p-8">
                <h3 className="font-display text-2xl text-[var(--color-cream)] mb-2">
                  Send a message.
                </h3>
                <p className="text-[14px] text-[var(--color-silver-200)] mb-6">
                  Tell us about your situation. We&apos;ll get back to you within
                  24 hours.
                </p>
                <ContactForm />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function ContactCard({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  href: string;
}) {
  return (
    <a
      href={href}
      className="surface-card p-5 block hover:surface-card-elevated transition-all duration-300 group"
    >
      <Icon
        className="h-5 w-5 text-[var(--color-gold-400)] mb-3"
        strokeWidth={1.5}
      />
      <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--color-silver-300)] mb-1">
        {label}
      </p>
      <p className="text-[14px] text-[var(--color-cream)] group-hover:text-gradient-gold transition-all">
        {value}
      </p>
    </a>
  );
}
