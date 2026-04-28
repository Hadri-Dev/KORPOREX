import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Korporex",
  description:
    "Terms of Service for Korporex — the agreement between you and Korporex for use of the incorporation platform and related services.",
};

// NOTE TO REVIEWERS:
// This is a living draft Terms of Service for the Korporex platform. Legal
// entity name has been set to "Korporex Business Solutions Inc." (a Canadian
// corporation incorporated under the CBCA with head office in Ontario).
// Structure follows Canadian SaaS / document-preparation-service patterns and
// references Korporex's actual implemented service offerings. This document
// should be revised as operational processes solidify (real registered-office
// addresses, confirmed filing timelines, any future user-account features,
// etc.). Review by qualified legal counsel is required before deployment.

const EFFECTIVE_DATE = "April 23, 2026";

export default function TermsPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-cream-50 py-20 px-6 border-b border-gray-100">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-gold-500 mb-4">
            Legal
          </p>
          <h1 className="font-serif text-5xl md:text-6xl font-bold text-navy-900 leading-tight mb-6">
            Terms of Service
          </h1>
          <p className="text-sm text-gray-500">
            Effective: {EFFECTIVE_DATE}
          </p>
        </div>
      </section>

      {/* Body */}
      <section className="bg-white py-16 px-6">
        <div className="max-w-3xl mx-auto prose prose-sm text-gray-700 leading-relaxed">
          <p className="text-gray-700 leading-relaxed mb-8">
            These Terms of Service (the &ldquo;<strong>Terms</strong>&rdquo;) govern your access to
            and use of the Korporex website at <strong>korporex.com</strong> (the
            &ldquo;<strong>Site</strong>&rdquo;) and the incorporation preparation, filing,
            registered office, and related services we make available through it (collectively,
            the &ldquo;<strong>Services</strong>&rdquo;). By creating an order, submitting
            information through our wizard, or otherwise using the Services, you agree to be
            bound by these Terms and by our{" "}
            <Link href="/privacy" className="text-navy-900 underline underline-offset-2">Privacy Policy</Link>,
            which is incorporated by reference. If you do not agree, do not use the Services.
          </p>

          <Section n="1" title="About Korporex">
            <p>
              The Site and the Services are operated by <strong>Korporex Business Solutions Inc.</strong>,
              a Canadian corporation incorporated under the <em>Canada Business Corporations Act</em>
              with its head office in the Province of Ontario. Throughout these Terms,
              &ldquo;<strong>Korporex</strong>&rdquo;, &ldquo;<strong>we</strong>&rdquo;,
              &ldquo;<strong>us</strong>&rdquo;, and &ldquo;<strong>our</strong>&rdquo; refer to
              Korporex Business Solutions Inc. and its affiliates; &ldquo;<strong>you</strong>&rdquo;
              and &ldquo;<strong>your</strong>&rdquo; refer to the individual or entity using
              the Services.
            </p>
            <p>
              Korporex is a Canadian online platform that prepares and files business
              incorporation documents with federal and provincial corporate registries in Canada
              (currently Corporations Canada and the Ontario Business Registry). We also
              coordinate optional pass-through services such as NUANS name searches and provide
              an optional registered office address service in Ontario.
            </p>
          </Section>

          <Section n="2" title="Korporex Is Not a Law Firm">
            <p>
              <strong>
                Korporex is a document preparation and filing service. Korporex is not a law
                firm and does not provide legal advice, legal opinions, legal representation,
                or any form of professional legal service.
              </strong>{" "}
              No communication between you and Korporex, and no use of the Services, creates a
              solicitor-client relationship. Our staff are not acting as your legal
              representatives when they prepare documents or interact with government registries
              on your behalf.
            </p>
            <p>
              The information provided on the Site (including resource articles, FAQs, and the
              content of the incorporation wizard) is for general informational purposes only.
              It is not a substitute for advice from a qualified legal or tax professional who
              can assess your specific circumstances. If your situation involves complex
              shareholder arrangements, professional licensing requirements, tax planning,
              cross-border considerations, or other matters requiring professional judgement,
              you should consult a qualified professional before submitting an incorporation
              through Korporex.
            </p>
          </Section>

          <Section n="3" title="Eligibility">
            <p>
              You must be at least 18 years of age (or the age of majority in your province
              or territory of residence, whichever is older) to use the Services. You represent
              that you have the legal capacity to enter into a binding contract, and if you
              are using the Services on behalf of a corporation, partnership, or other entity,
              you represent that you are authorized to bind that entity to these Terms.
            </p>
          </Section>

          <Section n="4" title="Your Submissions and Responsibilities">
            <p>
              You are solely responsible for the accuracy, completeness, and lawfulness of all
              information you submit through the Services, including information about
              directors, officers, shareholders, registered office addresses, business
              activity, and payment details. By submitting that information, you represent and
              warrant that:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 my-4 text-gray-700">
              <li>All information is true, accurate, current, and complete;</li>
              <li>
                You have obtained all necessary consents from each individual whose personal
                information you submit (for example, each proposed director or shareholder) to
                share that information with Korporex and the applicable government registry;
              </li>
              <li>
                The proposed corporation will be operated for a lawful purpose and will comply
                with all applicable laws;
              </li>
              <li>
                You are not using the Services to launder money, finance terrorism, evade
                sanctions, or engage in any fraudulent or unlawful activity;
              </li>
              <li>
                You have independently verified any business, tax, or professional licensing
                requirements that apply to your proposed corporation.
              </li>
            </ul>
            <p>
              You are responsible for post-filing obligations (including initial returns,
              annual returns, tax registrations, business licences, and record-keeping), except
              where Korporex has expressly agreed in writing to perform a specific obligation
              as part of a purchased package or add-on.
            </p>
          </Section>

          <Section n="5" title="Fees, Taxes, and Third-Party Pass-Throughs">
            <p>
              Our current fees are displayed on the{" "}
              <Link href="/pricing" className="text-navy-900 underline underline-offset-2">Pricing</Link>{" "}
              page and on the review screen before you submit payment. All amounts are in
              Canadian dollars (CAD) unless stated otherwise.
            </p>
            <p>
              <strong>Government filing fees</strong> (e.g., federal or provincial
              incorporation fees) are included in our package prices and remitted on your
              behalf to the applicable registry. <strong>NUANS pass-through fees</strong>, where
              applicable, are charged as a separate line item and remitted to the NUANS report
              provider. <strong>Applicable sales taxes</strong> (GST, HST, or other) are added
              based on your billing address.
            </p>
            <p>
              Payment is processed by Stripe Payments Canada, Ltd. and its affiliates
              (collectively, &ldquo;Stripe&rdquo;). You agree to Stripe&rsquo;s own terms of
              service and privacy policy when you enter payment details on Stripe&rsquo;s
              hosted checkout page. Korporex does not receive, store, or process your card
              number or CVC.
            </p>
            <p>
              Fees are exclusive of any third-party charges you may incur (including your own
              bank&rsquo;s currency-conversion fees or any professional advisor fees).
            </p>
          </Section>

          <Section n="6" title="No Refunds">
            <p>
              Incorporation orders involve government filing fees, time-sensitive third-party
              services, and work that is commenced immediately upon payment. Accordingly,{" "}
              <strong>all fees are non-refundable once payment has been submitted.</strong>{" "}
              This includes package fees, NUANS pass-through fees, registered office service
              fees, and applicable taxes, whether or not filing has been completed at the time
              a cancellation is requested.
            </p>
            <p>
              <strong>Korporex-caused errors.</strong> If a filing is rejected or requires
              resubmission solely because of an error by Korporex (and not because of
              information you provided), we will re-file at no additional service cost. This
              is a rectification of our work, not a refund. Government fees retained by the
              registry in connection with the initial submission cannot be refunded by us.
            </p>
            <p>
              <strong>Exceptional circumstances.</strong> If you believe your circumstances
              warrant special consideration, you may email{" "}
              <a href="mailto:contact@korporex.ca" className="text-navy-900 underline">
                contact@korporex.ca
              </a>{" "}
              with your order reference (the <code>KPX-</code> number shown on your
              confirmation page and in your emailed receipts). We may review these requests
              on a case-by-case basis but are under no obligation to issue a refund and
              reserve the right to decline.
            </p>
          </Section>

          <Section n="7" title="Filing Timeline and Government Delays">
            <p>
              We aim to submit correctly-prepared incorporation documents to the applicable
              registry within the turnaround window stated for your package. Published
              turnaround times refer to our preparation time only. Once documents are submitted,
              issuance of the Certificate of Incorporation or equivalent depends on the
              registry&rsquo;s processing timelines, which are outside our control and may vary
              due to registry workload, system outages, name-search holds, or other factors.
              Delays caused by incomplete or inaccurate information you provided are your
              responsibility.
            </p>
          </Section>

          <Section n="8" title="Registered Office Address Service">
            <p>
              If you purchase our registered office address add-on, the following additional
              terms apply:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 my-4 text-gray-700">
              <li>
                The address will appear on your corporation&rsquo;s Articles of Incorporation
                and on the public corporate registry. You are responsible for updating any
                third parties who currently hold a different address on file for your
                corporation.
              </li>
              <li>
                Physical mail received at our address and clearly addressed to your corporation
                will be opened, scanned, and emailed to the primary director&rsquo;s email
                address on file once per calendar month. We will not forward physical mail
                unless a separate arrangement has been made in writing.
              </li>
              <li>
                Items received that are not correspondence (including parcels, items subject
                to customs, and any item requiring signed delivery outside normal mail
                handling) may be refused, returned to sender, or held at your cost. We do not
                accept goods, samples, or packages on your corporation&rsquo;s behalf.
              </li>
              <li>
                The service is for the purpose of receiving corporate and government
                correspondence only. You may not use the address as your personal or commercial
                operating address, or for any unlawful purpose.
              </li>
              <li>
                If you fail to renew the service at the end of the annual term, we will remove
                your corporation from our records and you must update your registered office
                address with the applicable registry before the term ends. Korporex is not
                responsible for mail or notices missed due to non-renewal.
              </li>
              <li>
                We may terminate this service on 30 days&rsquo; notice if volume or content of
                mail materially exceeds the scope of ordinary corporate correspondence, or if
                the service is used in breach of these Terms or applicable law.
              </li>
            </ul>
          </Section>

          <Section n="9" title="Our Intellectual Property">
            <p>
              The Site, the Services, and all associated content, software, text, graphics,
              logos, templates, and documents prepared by Korporex (excluding your own
              submitted content) are owned by Korporex or its licensors and are protected by
              Canadian and international intellectual property laws. Subject to these Terms,
              we grant you a limited, non-exclusive, non-transferable, revocable licence to
              use the Services for the purpose of preparing and filing your own incorporation
              and related documents. You may not copy, modify, distribute, resell, or create
              derivative works based on the Services or Korporex-authored templates without
              our prior written consent.
            </p>
          </Section>

          <Section n="10" title="Your Content">
            <p>
              You retain ownership of the information and documents you submit through the
              Services (&ldquo;<strong>Your Content</strong>&rdquo;). You grant Korporex a
              non-exclusive, worldwide, royalty-free licence to use Your Content for the
              purpose of providing the Services (including preparing documents, submitting
              filings, communicating with registries, and sending you communications about
              your order). This licence ends when we no longer need Your Content to provide
              the Services to you, subject to our retention obligations described in the{" "}
              <Link href="/privacy" className="text-navy-900 underline underline-offset-2">Privacy Policy</Link>.
            </p>
          </Section>

          <Section n="11" title="Third-Party Services">
            <p>
              The Services rely on a number of third-party providers, including Stripe
              (payment processing), Brevo (transactional email), Google Maps Platform (address
              autocomplete), Cloudflare (DNS and email routing), and Vercel (hosting). The
              government registries to which we submit your filings (including Corporations
              Canada and the Ontario Business Registry) are operated by federal and provincial
              authorities and are not controlled by
              Korporex. Korporex is not responsible for the availability, accuracy,
              performance, or policies of these third-party services, though we will take
              reasonable steps to select reputable providers.
            </p>
          </Section>

          <Section n="12" title="Acceptable Use">
            <p>
              You agree not to: (a) reverse engineer, decompile, or attempt to derive the
              source code of the Services; (b) use the Services to transmit malware, spam, or
              any material that is unlawful, defamatory, fraudulent, or infringing;
              (c) interfere with or disrupt the integrity or performance of the Services;
              (d) use automated means (bots, scrapers) to access the Services without our
              prior written consent; or (e) use the Services in any way that violates
              applicable Canadian or foreign law.
            </p>
          </Section>

          <Section n="13" title="Warranties and Disclaimers">
            <p>
              The Services are provided on an &ldquo;<strong>as is</strong>&rdquo; and
              &ldquo;<strong>as available</strong>&rdquo; basis. To the maximum extent
              permitted by applicable law, Korporex disclaims all warranties, express or
              implied, including any implied warranties of merchantability, fitness for a
              particular purpose, non-infringement, and accuracy or completeness. Korporex
              does not warrant that: (a) your incorporation will be approved by the applicable
              registry; (b) the Services will be uninterrupted, error-free, or secure; or
              (c) defects will be corrected on any particular schedule. Some provinces do not
              permit the exclusion of certain implied warranties, so some of the above
              exclusions may not apply to you.
            </p>
          </Section>

          <Section n="14" title="Limitation of Liability">
            <p>
              To the maximum extent permitted by applicable law, Korporex and its affiliates,
              directors, officers, employees, and agents will not be liable for any indirect,
              incidental, special, consequential, exemplary, or punitive damages (including
              loss of profits, loss of business, loss of data, or loss of goodwill) arising
              out of or related to your use of the Services, whether based in contract, tort
              (including negligence), statute, or any other legal theory, and whether or not
              we were advised of the possibility of such damages.
            </p>
            <p>
              Our aggregate liability to you for all claims arising out of or related to the
              Services in any twelve-month period will not exceed the greater of
              (i) the total fees actually paid by you to Korporex for the Services giving rise
              to the claim in that period, and (ii) one hundred Canadian dollars (CAD $100).
            </p>
            <p>
              Nothing in these Terms limits any liability that cannot be limited under
              applicable law, including liability for fraud, fraudulent misrepresentation, or
              death or personal injury caused by negligence.
            </p>
          </Section>

          <Section n="15" title="Indemnification">
            <p>
              You agree to indemnify, defend, and hold harmless Korporex and its affiliates,
              directors, officers, employees, and agents from and against any claims,
              liabilities, damages, losses, and expenses (including reasonable legal fees)
              arising out of or in any way connected with: (a) your breach of these Terms;
              (b) inaccurate, incomplete, or unlawful information you submitted through the
              Services; (c) the operation of your corporation after incorporation;
              (d) claims by any individual whose personal information you submitted that you
              did not have authority to share; and (e) your violation of any applicable law.
            </p>
          </Section>

          <Section n="16" title="Suspension and Termination">
            <p>
              We may suspend or terminate your access to the Services at any time, with or
              without notice, if we reasonably believe you have breached these Terms, if
              required by law, or if we detect fraud, misuse, or abuse. On termination, the
              sections of these Terms that by their nature should survive (including
              Intellectual Property, Warranties and Disclaimers, Limitation of Liability,
              Indemnification, Governing Law, and General Provisions) will continue to apply.
            </p>
          </Section>

          <Section n="17" title="Changes to These Terms">
            <p>
              We may update these Terms from time to time. When we do, we will change the
              Effective date at the top of this page and, for material changes, make
              reasonable efforts to notify active customers by email. Your continued use of
              the Services after the Effective date constitutes acceptance of the updated
              Terms.
            </p>
          </Section>

          <Section n="18" title="Governing Law and Jurisdiction">
            <p>
              These Terms are governed by the laws of the Province of Ontario and the federal
              laws of Canada applicable in Ontario, without regard to conflict-of-laws
              principles. You and Korporex each submit to the exclusive jurisdiction of the
              courts sitting in the City of Toronto, Ontario for any dispute arising out of
              or relating to these Terms or the Services, except that either party may seek
              injunctive or other equitable relief in any court of competent jurisdiction.
            </p>
          </Section>

          <Section n="19" title="General Provisions">
            <p>
              <strong>Entire agreement.</strong> These Terms and the Privacy Policy constitute
              the entire agreement between you and Korporex regarding the Services and
              supersede any prior agreement on the same subject matter.
            </p>
            <p>
              <strong>Severability.</strong> If any provision of these Terms is held to be
              invalid or unenforceable, that provision will be modified to the minimum extent
              necessary to make it enforceable, and the remaining provisions will remain in
              full force and effect.
            </p>
            <p>
              <strong>Waiver.</strong> Our failure to enforce any provision of these Terms is
              not a waiver of our right to enforce that or any other provision later.
            </p>
            <p>
              <strong>Assignment.</strong> You may not assign or transfer your rights under
              these Terms without our prior written consent. We may assign our rights and
              obligations under these Terms without notice in connection with a merger,
              acquisition, reorganization, or sale of assets.
            </p>
            <p>
              <strong>No partnership.</strong> Nothing in these Terms creates a partnership,
              joint venture, agency, or employment relationship between you and Korporex.
            </p>
            <p>
              <strong>Language.</strong> The parties have requested that these Terms be drawn
              up in English. Les parties ont expressément demandé que la présente entente soit
              rédigée en anglais.
            </p>
          </Section>

          <Section n="20" title="Contact">
            <p>
              Questions about these Terms should be sent to{" "}
              <a href="mailto:contact@korporex.ca" className="text-navy-900 underline">
                contact@korporex.ca
              </a>.
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
