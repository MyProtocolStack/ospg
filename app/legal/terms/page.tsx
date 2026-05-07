export const metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <article>
      <p className="text-[12px] uppercase tracking-[0.2em] text-[var(--color-gold-400)] mb-3">
        Legal
      </p>
      <h1 className="font-display text-4xl md:text-5xl text-[var(--color-cream)] mb-3 leading-tight">
        Terms of Service
      </h1>
      <p className="text-[13px] text-[var(--color-silver-300)] mb-10">
        Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
      </p>

      <div className="space-y-6 text-[15px] text-[var(--color-silver-100)] leading-[1.8]">
        <Section title="Acceptance">
          By creating an account or using Ocean State Protection Group services
          (the &quot;Service&quot;), you agree to these Terms of Service. If
          you don&apos;t agree, don&apos;t use the Service.
        </Section>

        <Section title="Account responsibility">
          You are responsible for maintaining the confidentiality of your
          account credentials and for all activity under your account. Notify
          us immediately if you suspect unauthorized access. You must be at
          least 18 years old (or the legal age of majority in your jurisdiction)
          to create an account.
        </Section>

        <Section title="Acceptable use">
          You may not use the Service to: (a) violate any law; (b) upload
          content you don&apos;t have the right to share; (c) interfere with
          the Service&apos;s operation; (d) attempt to gain unauthorized access
          to other accounts or systems; (e) use SHIELD AI or PILOT to plan,
          facilitate, or commit acts of violence; (f) misrepresent your
          identity or organizational affiliation.
        </Section>

        <Section title="Subscription billing">
          Subscriptions auto-renew until cancelled. You can cancel at any time
          through the billing portal. Refunds: monthly subscriptions are
          non-refundable for the current period; annual subscriptions are
          pro-rated refundable within 30 days of purchase. SHIELD Assessment
          one-time purchases are non-refundable once we begin the engagement
          (initial scheduling and intake).
        </Section>

        <Section title="Intellectual property">
          We retain all rights to the Service, course content, and software
          we develop. You retain rights to your photos, organizational data,
          and assessment outputs. We grant you a limited license to use the
          Service for your organization&apos;s internal security purposes
          for the duration of your subscription.
        </Section>

        <Section title="Service names and trademarks">
          &quot;SHIELD&quot; is used by Ocean State Protection Group as a
          descriptive acronym for our assessment methodology - Site
          walkthrough, Hardening recommendations, Incident-response review,
          Emergency communication, Liaison building, and Documentation
          package. We do not currently hold a registered United States
          trademark on the SHIELD name; no trademark, registered or
          otherwise, is claimed in this term as it appears on this site.
          Third-party marks referenced on our site (vendor names, equipment
          brands, software products) belong to their respective owners and
          are referenced for descriptive purposes only.
        </Section>

        <Section title="Confidentiality">
          We treat your organizational and security information as confidential
          and disclose it only as required to deliver the Service, comply with
          law, or with your written consent. You agree to treat any
          OSPG-provided non-public methodology or training material as
          confidential.
        </Section>

        <Section title="Service changes">
          We may modify, suspend, or discontinue features at any time with
          reasonable notice. We may change pricing for subscriptions with 30
          days&apos; notice; existing terms apply through the end of your
          current billing period.
        </Section>

        <Section title="Termination">
          You may terminate your account at any time. We may terminate or
          suspend your account for material breach of these terms with notice,
          or immediately for activities described in &quot;Acceptable use&quot;
          above. On termination, your data is retained per the Privacy Policy
          retention schedule.
        </Section>

        <Section title="Disclaimers">
          The Service is provided &quot;as is&quot; without warranties of any
          kind. See our{" "}
          <a href="/legal/disclaimer" className="text-[var(--color-gold-400)]">
            Disclaimer
          </a>{" "}
          for additional limitations applicable to consulting, AI analysis, and
          grant guidance.
        </Section>

        <Section title="Limitation of liability">
          To the maximum extent permitted by law, our total liability for any
          claim arising out of or relating to these Terms or the Service shall
          not exceed the amount you paid us in the 12 months preceding the
          claim. We are not liable for indirect, incidental, consequential, or
          punitive damages.
        </Section>

        <Section title="Governing law">
          These terms are governed by the laws of the State of Rhode Island,
          without regard to its conflict-of-laws principles. Any dispute shall
          be resolved in the state or federal courts located in Providence
          County, Rhode Island.
        </Section>

        <Section title="Contact">
          Questions:{" "}
          <a href="mailto:legal@oceanstateprotectiongroup.com" className="text-[var(--color-gold-400)]">
            legal@oceanstateprotectiongroup.com
          </a>
          .
        </Section>
      </div>
    </article>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-display text-xl text-[var(--color-cream)] mb-3">{title}</h2>
      <p>{children}</p>
    </section>
  );
}
