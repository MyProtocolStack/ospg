import { Check, X } from "lucide-react";

export const metadata = { title: "Scope of Services" };

export default function ScopeOfServicesPage() {
  return (
    <article>
      <p className="text-[12px] uppercase tracking-[0.2em] text-[var(--color-gold-400)] mb-3">
        Legal
      </p>
      <h1 className="font-display text-4xl md:text-5xl text-[var(--color-cream)] mb-3 leading-tight">
        Scope of Services
      </h1>
      <p className="text-[13px] text-[var(--color-silver-300)] mb-10">
        What OSPG does - and what we do not do.
      </p>

      <div className="space-y-6 text-[15px] text-[var(--color-silver-100)] leading-[1.8]">
        <Section title="What we do">
          <ul className="list-none space-y-2 mt-3">
            {[
              "Vulnerability assessments via on-site walkthrough (SHIELD Assessment)",
              "AI-assisted preliminary photo analysis (SHIELD AI)",
              "FEMA NSGP grant application support and document generation (PILOT)",
              "Security details staffed by vetted retired law enforcement and military veterans (active-duty officers are never assigned to private detail work)",
              "Threat assessment and incident-response training for staff and volunteers",
              "Liaison facilitation between client organizations and local law enforcement",
              "Threat-trend briefings for subscribers",
              "Custom security curriculum for groups of 10+",
            ].map((item) => (
              <li key={item} className="flex gap-3 items-start">
                <Check className="h-4 w-4 text-[var(--color-gold-400)] shrink-0 mt-1.5" strokeWidth={2} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="What we explicitly do not do">
          <ul className="list-none space-y-2 mt-3">
            {[
              "Sell, install, monitor, or maintain alarm systems or central-station services",
              "Provide armed protection beyond contracted veteran-staffed details",
              "Use active-duty law enforcement officers to staff private security details (founders included)",
              "Provide cybersecurity penetration testing or IT security audits",
              "Provide background checks or pre-employment screening",
              "Conduct private investigations or surveillance of individuals",
              "Provide medical, legal, or licensed engineering advice",
              "Receive or pay vendor referral fees (we are vendor-agnostic)",
              "Provide weapon training or firearms instruction",
            ].map((item) => (
              <li key={item} className="flex gap-3 items-start">
                <X className="h-4 w-4 text-[var(--color-crimson-500)] shrink-0 mt-1.5" strokeWidth={2} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Founder role boundary">
          OSPG is co-founded by two active-duty Cranston Police Department
          officers. Their work for OSPG is limited to consulting activities
          - vulnerability assessments, written reports, training delivery,
          program design, and grant-application advisory - conducted
          off-duty under approved extra-duty / outside-employment
          authorization in accordance with applicable Rhode Island General
          Laws and departmental policy. Active-duty officers, including
          OSPG founders, are never assigned to private security detail or
          guard work. OSPG is private-sector consulting; it is not
          affiliated with, endorsed by, or undertaken on behalf of any
          law-enforcement agency.
        </Section>

        <Section title="Detail staffing model">
          Physical security details, on-site coverage, event protection,
          and any uniformed presence are staffed exclusively by retired law
          enforcement officers and military veterans contracted through
          OSPG's vetted operator network. Each operator is screened for
          credentials, prior conduct, and current insurability before
          being eligible for assignment. The client contracts with OSPG;
          OSPG dispatches and manages the operator.
        </Section>

        <Section title="Engagement structure">
          Each consulting engagement is governed by a separate written
          engagement letter. The engagement letter specifies scope,
          deliverables, timeline, fees, and any exclusions or carve-outs from
          this general scope. In the event of conflict between this page and
          your specific engagement letter, the engagement letter controls.
        </Section>

        <Section title="Insurance and bonding">
          OSPG maintains general liability insurance appropriate to its
          consulting scope. Veteran-staffed security details are covered
          under OSPG&apos;s commercial security-services policy for the
          duration of each engagement. Certificate of insurance available
          on request for active engagements.
        </Section>

        <Section title="Out of scope: vendor procurement">
          When SHIELD Assessment recommendations require physical hardware
          (cameras, access control, glazing film, etc.), OSPG provides
          three competitive vendor options per recommendation. The client
          contracts directly with chosen vendors. OSPG does not procure,
          install, or warrant third-party hardware. OSPG does not
          receive referral fees from any vendor.
        </Section>
      </div>
    </article>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-display text-xl text-[var(--color-cream)] mb-3">{title}</h2>
      <div>{children}</div>
    </section>
  );
}
