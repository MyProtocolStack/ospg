export const metadata = { title: "Disclaimer" };

export default function DisclaimerPage() {
  return (
    <article className="prose-doc">
      <p className="text-[12px] uppercase tracking-[0.2em] text-[var(--color-gold-400)] mb-3">
        Legal
      </p>
      <h1 className="font-display text-4xl md:text-5xl text-[var(--color-cream)] mb-3 leading-tight">
        Disclaimer
      </h1>
      <p className="text-[13px] text-[var(--color-silver-300)] mb-10">
        Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
      </p>

      <div className="space-y-6 text-[15px] text-[var(--color-silver-100)] leading-[1.8]">
        <Section title="No professional advice">
          Information provided by Ocean State Protection Group, including content
          on this website, AI-generated analysis (PRAESIDIUM), grant-application
          assistance (PILOT), and training course material, is for general
          guidance and educational purposes only. It does not constitute legal
          advice, licensed engineering opinion, medical advice, insurance
          guidance, or financial advice.
        </Section>

        <Section title="On-site walkthrough required for definitive recommendations">
          Photo-based AI analysis and remote consultation are preliminary tools
          only. Definitive vulnerability assessments and security recommendations
          require an on-site walkthrough by qualified personnel and review of
          your specific operational context. Decisions made solely on the basis
          of remote analysis are at your own risk.
        </Section>

        <Section title="Not a licensed alarm or guard company">
          Unless explicitly contracted in a separate signed engagement,
          Ocean State Protection Group is not a licensed alarm-monitoring
          company, central station, or guard agency. We provide consulting,
          assessment, training, and (where contracted) security details
          staffed by retired law enforcement and military veterans through
          our vetted operator network. We do not install, monitor, or
          maintain alarm systems.
        </Section>

        <Section title="Founder role and detail-staffing disclosure">
          Ocean State Protection Group is co-founded by two active-duty
          municipal police officers. Founder work for OSPG is limited to
          consulting activities - vulnerability assessments, written
          reports, training, program design, and grant-application
          advisory - conducted off-duty under approved extra-duty /
          outside-employment authorization in accordance with applicable
          Rhode Island General Laws and departmental policy. Active-duty
          officers, including OSPG founders, are never assigned to private
          security details. Physical detail and on-site protection
          services, where contracted, are staffed exclusively by retired
          law enforcement and military veterans through OSPG&apos;s vetted
          operator network. OSPG work is private-sector and is not
          affiliated with, endorsed by, or undertaken in the name of any
          law-enforcement agency.
        </Section>

        <Section title="No guarantee against incidents">
          Security is probabilistic. No assessment, training, technology, or
          security detail can guarantee prevention of all incidents. OSPG
          Protection Group&apos;s services are intended to reduce risk and
          improve preparedness. They do not eliminate it.
        </Section>

        <Section title="Federal grant program guidance">
          PILOT and OSPG staff provide guidance on the FEMA Nonprofit
          Security Grant Program and related federal funding opportunities.
          Eligibility, deadlines, and requirements are determined by FEMA and
          State Administrative Agencies (SAAs) - not OSPG. Final
          applications must be submitted through your state&apos;s SAA. Grant
          rules change; verify current cycle requirements at fema.gov.
          OSPG does not guarantee award.
        </Section>

        <Section title="AI-generated content limitations">
          PRAESIDIUM and PILOT use large language models that occasionally
          produce errors, omissions, or outdated information. AI output should
          be verified by a qualified human professional before reliance.
          AI-generated content is not a substitute for licensed expert review.
        </Section>

        <Section title="Third-party links and content">
          Our website and tools may reference third-party vendors, products,
          services, or articles. References are informational only and do not
          constitute endorsement. We do not receive vendor referral fees on any
          product recommendations. OSPG is not responsible for third-party
          content, policies, or practices.
        </Section>

        <Section title="Limitation of liability">
          To the maximum extent permitted by law, Ocean State Protection Group,
          its founders, employees, contractors, and affiliates shall not be
          liable for indirect, incidental, consequential, or punitive damages
          arising from your use of this website, our tools, or our services. In
          no event shall total liability exceed the fees paid by you to
          OSPG for the specific engagement giving rise to the claim.
        </Section>

        <Section title="Updates to this disclaimer">
          This disclaimer may be updated to reflect changes in our services,
          regulatory requirements, or legal review. The &quot;last updated&quot;
          date at the top reflects the most recent revision.
        </Section>

        <p className="pt-6 border-t border-white/5 text-[13px] text-[var(--color-silver-300)]">
          Questions about this disclaimer? Contact{" "}
          <a href="mailto:legal@oceanstateprotectiongroup.com" className="text-[var(--color-gold-400)]">
            legal@oceanstateprotectiongroup.com
          </a>
          .
        </p>
      </div>
    </article>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-display text-xl text-[var(--color-cream)] mb-3">
        {title}
      </h2>
      <p>{children}</p>
    </section>
  );
}
