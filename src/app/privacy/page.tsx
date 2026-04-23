import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Korporex",
  description:
    "Privacy Policy for Korporex — how we collect, use, share, and protect personal information in connection with our Canadian incorporation and registered office services.",
};

// NOTE TO REVIEWERS:
// This is a draft Privacy Policy prepared for the Korporex incorporation
// platform. It is structured to address PIPEDA (Personal Information Protection
// and Electronic Documents Act) obligations and documents the actual third-
// party data flows implemented in the codebase (Stripe, Brevo, Google Maps
// Platform, Cloudflare, Vercel, federal/provincial registries). Review by
// qualified legal counsel is required before deployment. The legal entity
// name "Korporex" should be replaced with the actual incorporated entity's
// full legal name before launch, and the Privacy Officer contact should be
// verified.

const EFFECTIVE_DATE = "April 23, 2026";

export default function PrivacyPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-cream-50 py-20 px-6 border-b border-gray-100">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-gold-500 mb-4">
            Legal
          </p>
          <h1 className="font-serif text-5xl md:text-6xl font-bold text-navy-900 leading-tight mb-6">
            Privacy Policy
          </h1>
          <p className="text-sm text-gray-500">
            Effective: {EFFECTIVE_DATE}
          </p>
        </div>
      </section>

      {/* Body */}
      <section className="bg-white py-16 px-6">
        <div className="max-w-3xl mx-auto text-gray-700 leading-relaxed">
          <p className="mb-8">
            Korporex operates an online platform at <strong>korporex.com</strong> that prepares
            and files business incorporation documents with Canadian federal and provincial
            corporate registries and offers related services, including an optional registered
            office address service. This Privacy Policy describes what personal information we
            collect, how we use and share it, how long we keep it, and the rights you have
            over it. It applies to individuals in Canada and elsewhere who interact with
            Korporex through the Site or as a named director, officer, or shareholder in an
            incorporation we prepare. Our practices are designed to meet the requirements of
            the Personal Information Protection and Electronic Documents Act (PIPEDA) and
            substantially similar provincial privacy legislation.
          </p>

          <Section n="1" title="Information We Collect">
            <p>We collect personal information in the following categories:</p>
            <p>
              <strong>(a) Incorporation wizard data.</strong> When you submit an incorporation,
              we collect information about the proposed corporation and the individuals named
              in the application. This typically includes: proposed corporate name or number,
              jurisdiction of incorporation, NAICS industry classification, description of
              business activity, fiscal year end, and for each director and shareholder: full
              name, email address, date of birth, Canadian residency status, residential
              address, share class, and number of shares. It also includes the corporation&rsquo;s
              registered office address.
            </p>
            <p>
              <strong>(b) Payment and billing data.</strong> We collect the billing name and
              address you enter on the review step. Payment card details (card number,
              expiry, and security code) are collected directly by our payment processor,
              Stripe, on Stripe&rsquo;s own hosted checkout page. Korporex does not see,
              receive, or store full card numbers. We receive a limited summary from Stripe
              (including the last four digits of the card, card brand, payment status, and the
              Stripe identifiers for the session and payment intent).
            </p>
            <p>
              <strong>(c) Registered office service data.</strong> If you purchase our
              registered office add-on, we receive and handle physical mail addressed to your
              corporation at our address. The content of that mail is opened, scanned, and
              emailed to the primary director&rsquo;s email address on file as described in the{" "}
              <Link href="/terms" className="text-navy-900 underline underline-offset-2">Terms of Service</Link>.
              Scanned copies of mail and a log of items received are retained as described in
              Section 6.
            </p>
            <p>
              <strong>(d) Communications.</strong> If you contact us (for example, by email to{" "}
              <a href="mailto:contact@korporex.com" className="text-navy-900 underline">contact@korporex.com</a>{" "}
              or through a form on the Site), we collect your name, email address, the content
              of your message, and any other information you choose to include.
            </p>
            <p>
              <strong>(e) Technical and usage data.</strong> When you visit the Site, our
              hosting provider and DNS/CDN provider automatically receive limited technical
              information including your IP address, approximate geographic location derived
              from that IP address, browser type and version, device type, referring URL, and
              timestamps of requests. This information is used for infrastructure security,
              abuse prevention, and performance monitoring. The Site does not currently deploy
              advertising cookies, behavioural tracking, or third-party analytics.
            </p>
          </Section>

          <Section n="2" title="How We Use Your Information">
            <p>We use personal information to:</p>
            <ul className="list-disc list-inside space-y-2 ml-4 my-4 text-gray-700">
              <li>
                Prepare and file your incorporation documents with the applicable Canadian
                federal or provincial corporate registry;
              </li>
              <li>
                Coordinate optional pass-through services you select, including NUANS name
                searches;
              </li>
              <li>
                Process payment and calculate applicable sales taxes based on your billing
                address;
              </li>
              <li>
                Communicate with you about your order, send receipts, deliver filed documents,
                respond to your questions, and handle refund or cancellation requests;
              </li>
              <li>
                Operate the registered office address service (receiving, scanning, and
                forwarding corporate correspondence);
              </li>
              <li>
                Maintain security of the Site, detect and prevent fraud, and enforce our{" "}
                <Link href="/terms" className="text-navy-900 underline underline-offset-2">Terms of Service</Link>;
              </li>
              <li>
                Comply with legal, tax, and regulatory obligations, including record-keeping
                requirements under corporate and tax law;
              </li>
              <li>
                Improve and develop the Services, in aggregated or de-identified form where
                practicable.
              </li>
            </ul>
          </Section>

          <Section n="3" title="Legal Basis and Consent">
            <p>
              We collect, use, and disclose personal information based on your consent, which
              is implied when you submit information through the wizard for the purpose of
              completing an incorporation. Consent for specific purposes (such as email
              marketing, where we choose to offer it in the future) will be obtained expressly.
              You may withdraw your consent at any time, subject to legal or contractual
              restrictions and reasonable notice, by contacting us at{" "}
              <a href="mailto:contact@korporex.com" className="text-navy-900 underline">contact@korporex.com</a>.
              Withdrawing consent may mean we cannot continue to provide some or all of the
              Services to you.
            </p>
          </Section>

          <Section n="4" title="How We Share Your Information">
            <p>
              We do not sell personal information. We share information only with the
              following categories of recipients, and only to the extent necessary:
            </p>
            <p>
              <strong>(a) Government registries.</strong> Information about your corporation
              (including the names and addresses of directors, shareholders, and the
              registered office) is submitted to the applicable corporate registry as part of
              the filing. Some of this information becomes part of a public corporate record
              maintained by the registry and may be accessible through public search tools
              operated by Corporations Canada, the Ontario Business Registry, the BC
              Corporate Registry, or other authorities, in accordance with the legislation
              under which the corporation is created. You should review the public-disclosure
              rules of the chosen jurisdiction before incorporating.
            </p>
            <p>
              <strong>(b) Payment processor.</strong> Stripe Payments Canada, Ltd. and its
              affiliates process payments on our behalf. Your card details are provided
              directly to Stripe and handled under Stripe&rsquo;s terms and privacy policy.
            </p>
            <p>
              <strong>(c) Transactional email provider.</strong> Brevo (operated by Sendinblue
              SAS, based in France) transmits receipts, order confirmations, filed documents,
              and scanned mail (for registered office customers) to you and to our operations
              inbox.
            </p>
            <p>
              <strong>(d) Address autocomplete.</strong> When you type an address into the
              wizard, partial text and selected place identifiers are sent to Google Maps
              Platform (operated by Google LLC, based in the United States) to generate
              suggestions and structured address fields. This feature can be disabled at the
              infrastructure level; the wizard falls back to plain text inputs when it is
              unavailable.
            </p>
            <p>
              <strong>(e) Infrastructure providers.</strong> Our Site is hosted by Vercel Inc.
              (United States). DNS, email routing, and content delivery are handled by
              Cloudflare, Inc. (United States). These providers process technical data
              required to serve requests and deliver inbound email to our mailbox.
            </p>
            <p>
              <strong>(f) Professional and business advisors.</strong> We may share limited
              information with our accountants, auditors, legal advisors, and insurers as
              necessary for them to provide services to Korporex, under appropriate
              confidentiality obligations.
            </p>
            <p>
              <strong>(g) Legal process and protection.</strong> We may disclose personal
              information if required by law, court order, or other legal process, or where
              we reasonably believe disclosure is necessary to investigate or prevent fraud,
              enforce our Terms of Service, or protect the rights, property, or safety of
              Korporex, our customers, or others.
            </p>
            <p>
              <strong>(h) Corporate transactions.</strong> If Korporex is involved in a
              merger, acquisition, financing, reorganization, or sale of all or part of its
              assets, personal information may be transferred to the counterparty as part of
              the transaction, subject to appropriate confidentiality protections and
              continued application of this Privacy Policy or an equivalent.
            </p>
          </Section>

          <Section n="5" title="International Transfers of Personal Information">
            <p>
              Several of the service providers we use (including Stripe, Google, Cloudflare,
              and Vercel) are based outside Canada or process data on servers located outside
              Canada, principally in the United States. Brevo is based in France and may
              process data in the European Economic Area. When personal information is
              transferred outside Canada, it becomes subject to the laws of the jurisdiction
              in which it is stored or processed, and foreign governments, courts, or law
              enforcement agencies may be able to obtain access to it under applicable foreign
              law. By using the Services, you acknowledge this cross-border transfer. We
              select providers that offer contractual commitments to protect personal
              information to a standard comparable to Canadian requirements.
            </p>
          </Section>

          <Section n="6" title="How Long We Keep Information">
            <p>
              We retain personal information only as long as necessary for the purposes
              described in this Privacy Policy or as required by law. Retention periods vary
              by category:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 my-4 text-gray-700">
              <li>
                <strong>Incorporation records:</strong> retained for at least seven (7) years
                from the date of filing, consistent with tax and corporate record-keeping
                requirements. Some records that form part of the public registry are retained
                indefinitely by the government and remain publicly accessible.
              </li>
              <li>
                <strong>Payment records:</strong> retained for at least seven (7) years for
                tax and accounting purposes. Full card numbers are never retained by
                Korporex.
              </li>
              <li>
                <strong>Scanned mail (registered office customers):</strong> retained for the
                duration of the service plus twelve (12) months after termination or
                non-renewal, to allow for post-termination retrieval.
              </li>
              <li>
                <strong>Email correspondence:</strong> retained in our mailbox as long as
                reasonably useful for customer service and disputes, typically up to seven
                (7) years.
              </li>
              <li>
                <strong>Technical and usage data:</strong> retained for the shorter of the
                retention period set by the provider (typically 30–90 days) and our own
                operational need.
              </li>
            </ul>
            <p>
              When personal information is no longer needed, we either securely delete it or
              de-identify it. Information that has been filed with a government registry
              cannot be removed from the public record by Korporex.
            </p>
          </Section>

          <Section n="7" title="Your Rights">
            <p>
              Subject to certain exceptions provided by law, you have the right to:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 my-4 text-gray-700">
              <li>
                <strong>Access</strong> the personal information we hold about you and obtain
                information about how it has been used and to whom it has been disclosed;
              </li>
              <li>
                <strong>Correct</strong> inaccurate or incomplete personal information we
                hold about you;
              </li>
              <li>
                <strong>Withdraw your consent</strong> to our continued collection, use, or
                disclosure of personal information (subject to legal or contractual
                restrictions and reasonable notice);
              </li>
              <li>
                <strong>Receive a response</strong> from us to any reasonable privacy-related
                request within thirty (30) days (or such longer period as permitted by law,
                with notice to you);
              </li>
              <li>
                <strong>File a complaint</strong> with the Office of the Privacy Commissioner
                of Canada (<a href="https://www.priv.gc.ca" className="text-navy-900 underline">priv.gc.ca</a>) or
                the privacy regulator in your province if you believe we have not addressed
                your concern adequately.
              </li>
            </ul>
            <p>
              To exercise any of these rights, email us at{" "}
              <a href="mailto:contact@korporex.com" className="text-navy-900 underline">contact@korporex.com</a>.
              We may need to verify your identity before responding. There is generally no
              fee for reasonable requests; we will let you know in advance if a fee would
              apply to an unusually burdensome request.
            </p>
          </Section>

          <Section n="8" title="Cookies and Tracking">
            <p>
              The Site uses only strictly necessary cookies and session storage required to
              operate the incorporation wizard and maintain state during your session. We do
              not use third-party advertising cookies, behavioural tracking, or cross-site
              tracking technologies, and we do not participate in advertising networks. If we
              introduce analytics or tracking in the future, we will update this Privacy
              Policy and, where required, obtain your consent before activating them.
            </p>
          </Section>

          <Section n="9" title="Security">
            <p>
              We take reasonable technical and organizational measures to protect personal
              information against loss, theft, unauthorized access, disclosure, copying, use,
              or modification. These measures include transport-layer encryption (HTTPS) for
              all Site traffic, encryption of sensitive data in transit to third-party
              providers, access controls on our internal systems, the use of reputable
              infrastructure providers, and PCI-DSS-compliant handling of card data by
              Stripe. No method of transmission or storage is completely secure, and we
              cannot guarantee absolute security.
            </p>
            <p>
              If a privacy breach occurs that creates a real risk of significant harm to
              affected individuals, we will notify those individuals and the Office of the
              Privacy Commissioner of Canada as required by law, and will maintain records of
              all breaches for the period required by law.
            </p>
          </Section>

          <Section n="10" title="Children">
            <p>
              The Services are not directed at children, and we do not knowingly collect
              personal information from individuals under the age of 18. If we become aware
              that we have inadvertently collected information from a child, we will delete
              it.
            </p>
          </Section>

          <Section n="11" title="Changes to This Privacy Policy">
            <p>
              We may update this Privacy Policy from time to time. When we do, we will change
              the Effective date at the top of this page. For material changes that affect
              how we use your personal information, we will make reasonable efforts to notify
              active customers by email or by prominent notice on the Site before the change
              takes effect.
            </p>
          </Section>

          <Section n="12" title="Contact and Privacy Officer">
            <p>
              Questions about this Privacy Policy, requests to exercise your rights, or
              complaints about our privacy practices should be directed to our Privacy Officer
              at{" "}
              <a href="mailto:contact@korporex.com" className="text-navy-900 underline">contact@korporex.com</a>.
              We will acknowledge receipt and respond within the time limits described above.
            </p>
          </Section>
        </div>
      </section>
    </>
  );
}

function Section({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <div className="mt-12 first:mt-0">
      <h2 className="font-serif text-2xl font-bold text-navy-900 mb-4">
        <span className="text-gold-500 font-sans text-lg mr-2">{n}.</span>
        {title}
      </h2>
      <div className="space-y-4 text-gray-700 leading-relaxed">{children}</div>
    </div>
  );
}
