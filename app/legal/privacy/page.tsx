export const metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <article>
      <p className="text-[12px] uppercase tracking-[0.2em] text-[var(--color-gold-400)] mb-3">
        Legal
      </p>
      <h1 className="font-display text-4xl md:text-5xl text-[var(--color-cream)] mb-3 leading-tight">
        Privacy Policy
      </h1>
      <p className="text-[13px] text-[var(--color-silver-300)] mb-10">
        Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
      </p>

      <div className="space-y-6 text-[15px] text-[var(--color-silver-100)] leading-[1.8]">
        <Section title="What we collect">
          When you create a OSPG account, we collect: name, work email,
          organization name, organization type, location (city, state),
          approximate population, and any photos or documents you upload for
          VIGIL analysis. When you contact us, we collect the information
          you provide (name, email, phone, message). We log standard server
          information (IP address, user agent, request timing) for security and
          performance.
        </Section>

        <Section title="How we use information">
          We use account information to provide the service, deliver
          AI-generated assessments, process payments through Stripe, send
          transactional email (assessment delivery, course completion,
          subscription receipts), and communicate about service updates. We use
          aggregate, de-identified usage data to improve the platform.
        </Section>

        <Section title="What we don't do">
          We do not sell your data. We do not share your photos, assessments,
          or organizational details with third parties for marketing. We do not
          use customer data to train AI models. We never use customer data to
          identify or surveil specific individuals beyond the explicit purpose
          of the engagement.
        </Section>

        <Section title="Photos and VIGIL">
          Photos uploaded to VIGIL are processed by Anthropic&apos;s Claude
          API for vulnerability analysis. Anthropic does not retain customer
          API content for model training (per their no-retention business
          terms). Photos are stored in your private Supabase Storage bucket
          accessible only to authenticated members of your organization. You
          can delete photos and assessments at any time from your dashboard.
        </Section>

        <Section title="Cookies">
          We use session cookies for authentication (Supabase) and a single
          anonymous analytics cookie. We do not use advertising cookies or
          third-party tracking pixels. You can clear cookies at any time
          through your browser settings.
        </Section>

        <Section title="Data retention">
          We retain account information for as long as your account is active,
          plus 90 days after deletion (in case you change your mind), then
          purge. Assessments and photos are retained per your account&apos;s
          retention setting (default: keep until deleted). Lead inquiries from
          contact forms are retained for two years from the date of inquiry.
        </Section>

        <Section title="Children's privacy">
          OSPG services are intended for organizations and adults. We do
          not knowingly collect personal information from children under 13. If
          you believe we have inadvertently collected a child&apos;s
          information, contact{" "}
          <a href="mailto:privacy@oceanstateprotectiongroup.com" className="text-[var(--color-gold-400)]">
            privacy@oceanstateprotectiongroup.com
          </a>
          .
        </Section>

        <Section title="Your rights">
          You can access, correct, export, or delete your personal information
          at any time through your dashboard or by contacting us. EU/UK
          residents have rights under GDPR including portability, restriction,
          and the right to be forgotten. California residents have rights under
          CCPA including disclosure and deletion.
        </Section>

        <Section title="Contact">
          Privacy questions:{" "}
          <a href="mailto:privacy@oceanstateprotectiongroup.com" className="text-[var(--color-gold-400)]">
            privacy@oceanstateprotectiongroup.com
          </a>
          . Postal: Ocean State Protection Group, c/o Ocean State Protection
          Group, Rhode Island.
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
