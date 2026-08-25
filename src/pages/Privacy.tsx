import { motion } from "framer-motion";
import SEOHead from "@/components/SEOHead";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const fade = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true } as const,
  transition: { duration: 0.6, ease: "easeOut" as const },
};

const sections = [
  {
    heading: "Who we are",
    body: [
      "Irene A. Agunbiade trading as Bright Leadership Consulting. Correspondence address: 82 James Carter Road, Mildenhall, England IP28 7DE.",
      "Irene A. Agunbiade trading as Bright Leadership Consulting is the data controller for personal information collected through this website and through advisory engagements.",
      "Privacy enquiries and data-rights requests may be directed to info@brightleadershipconsulting.com. Programme and account support is handled at admin@brightleadershipconsulting.com.",
    ],
  },
  {
    heading: "Information we collect",
    body: [
      "Enquiry information you provide voluntarily: name, organisation, role, email address, telephone number and the content of your message.",
      "Diagnostic response data submitted by participants during an Executive Alignment Index™ deployment, held under the terms of the commissioning engagement.",
      "Basic technical information generated when you visit the site, such as pages viewed and referring source, used only in aggregate to understand site performance.",
    ],
  },
  {
    heading: "How we use it",
    body: [
      "To respond to advisory and programme enquiries, and to conduct any engagement subsequently agreed.",
      "To produce aggregated diagnostic reporting for the commissioning party. Individual diagnostic responses are never disclosed to a client organisation.",
      "To meet legal, accounting and professional record-keeping obligations.",
      "We do not sell personal information, and we do not use enquiry data for unrelated marketing.",
    ],
  },
  {
    heading: "Lawful basis",
    body: [
      "We process enquiry data on the basis of legitimate interests in responding to a request you have made, and engagement data on the basis of the contract with the commissioning organisation.",
    ],
  },
  {
    heading: "Retention and deletion",
    body: [
      "Two distinct rules apply to the AI Leadership Readiness Audit, and they are not the same period.",
      "Audit answers, the readiness score, band and dimension scores, the buyer classification and the recommendation are held for 90 days from completion, and are then deleted.",
      "Where you ask us to raise an invoice or purchase order, or to provide a decision pack or scoping discussion, that request record and the associated organisational contact are held for 24 months from our last meaningful contact, unless a longer period is legally required following a transaction or contract.",
      "Enquiry records from other forms are retained for up to 24 months from last contact unless an engagement follows.",
      "Individual diagnostic response data from commissioned instruments is deleted within 90 days of report delivery unless the commissioning party requests retention for comparative re-measurement.",
      "Engagement records required for legal or accounting purposes are retained for the statutory period.",
      "Records held on our learning platform, including course accounts, payments and progress, are governed by that platform's own retention arrangements and are handled through a separate process.",
    ],
  },

  {
    heading: "Confidentiality and sharing",
    body: [
      "Advisory engagements are conducted under strict confidentiality. We do not disclose client identities, and case material published on this site consists of composite examples with identifying detail removed or adapted.",
      "We share personal information with third parties only where necessary to operate the site and our systems (for example hosting, email and course delivery providers), and only under appropriate data-processing terms.",
    ],
  },
  {
    heading: "Your rights",
    body: [
      "You may request access to the personal information we hold about you, ask for it to be corrected or deleted, object to processing, or request that it be transferred. Requests may be made to info@brightleadershipconsulting.com.",
      "You also have the right to complain to the Information Commissioner's Office (ico.org.uk).",
    ],
  },
  {
    heading: "Cookies and similar technologies",
    body: [
      "Strictly necessary storage is used to operate this site and to remember your cookie choice. This includes a consent-preference item (blc.cookie-consent.v1) held in your browser's local storage, which persists until you clear your browser storage, and a session item used only when signing in to the administrative area.",
      "No non-essential cookies or similar technologies are set before you give consent. Consent requires a clear positive action; continuing to browse does not constitute consent.",
    ],
  },
  {
    heading: "Google Ads conversion measurement on this website",
    body: [
      "brightleadershipconsulting.com uses one consent-controlled Google Ads tag (a single Google Ads base tag, and no other measurement tag). It is provided by Google Ireland Limited. Its sole purpose is to record whether a click on one of our advertisements resulted in a completed organisational, cohort or in-house programme enquiry, so that advertising expenditure can be assessed. It is not used to build profiles for unrelated purposes.",
      "All four Google Consent Mode v2 signals — ad_storage, analytics_storage, ad_user_data and ad_personalization — are set to denied by default, before the Google tag loads. They are set to granted only if you accept advertising measurement, and returned to denied if you reject or later withdraw consent. When advertising measurement is accepted, Google may set conversion-linker cookies in the _gcl family on this domain, which typically expire up to 90 days after they are set. If consent is not given, no such cookies are set.",
      "No Google Analytics property and no Google Tag Manager container is active on the Bright website. No Enhanced Conversions data is transmitted; the content of your enquiry is not sent to Google.",
      "One conversion is currently configured: an organisational enquiry. It is recorded only after our server has successfully accepted a qualifying organisational, cohort or in-house programme enquiry, and only subject to the consent controls described in this notice. It is not recorded on a page view, a form interaction, a button click, a validation failure, a server failure or a general contact enquiry.",
      "The categories of information processed for this purpose are: a Google advertising click identifier present in the landing page address (for example gclid, gbraid or wbraid), campaign parameters such as utm_source and utm_campaign, the page address and referring source, approximate location derived from IP address, and general device and browser information.",
      "Google's own information about how it processes advertising data is available in the Google Privacy Policy (policies.google.com/privacy) and in Google's description of how it uses cookies and similar technologies in advertising (policies.google.com/technologies/ads).",
    ],
  },
  {
    heading: "Accepting, rejecting and withdrawing consent",
    body: [
      "When you first visit the site a banner offers Accept all, Reject non-essential and Manage preferences. The advertising measurement category is switched off by default and is never preselected.",
      "You may change or withdraw your choice at any time by selecting Cookie Preferences in the footer of any page, which reopens the same panel. Withdrawing consent returns all four Google consent signals to denied for subsequent activity. You may also delete cookies and local storage through your browser settings.",
      "This control governs brightleadershipconsulting.com only. It does not govern the separately hosted learning platform, which operates under its own cookie and privacy arrangements.",
    ],
  },
  {
    heading: "The learning platform and payment providers",
    body: [
      "Self-directed executive programmes are hosted on a separate learning platform provided by Thinkific Labs Inc. When you register or browse on that platform, your information is processed there under its own privacy notice and cookie arrangements, not through this website. Bright Leadership Consulting receives enrolment, progress and completion information from the platform in order to administer programmes and issue certificates of attendance.",
      "The learning platform currently has no installed Google Analytics, Google Ads or Google Tag Manager integration. Its site footer, order tracking and signup tracking code fields are empty, and no replacement analytics tag, tag-management container or consent-management platform has been installed in their place. The platform provider may still use storage strictly necessary to operate its own service, as described in its notice.",
      "No individual-enrolment-click measurement and no learning-platform purchase conversion measurement is currently implemented, on either domain.",
      "Payments made on the learning platform are processed by the platform's payment providers. Bright Leadership Consulting does not receive or store full card details.",
      "The learning platform and payment providers may process information outside the United Kingdom. Where personal information is transferred internationally, we rely on the transfer safeguards required by UK data-protection law, such as the International Data Transfer Agreement or the UK Addendum to the European Commission's standard contractual clauses.",
    ],
  },
  {
    heading: "Measurement we may introduce later",
    body: [
      "The technologies currently active on brightleadershipconsulting.com are the strictly necessary storage described above and, where consented, the single Google Ads tag used for the organisational-enquiry conversion.",
      "We may in future introduce measurement of individual-enrolment link clicks or of purchases completed on the learning platform. No such measurement is active today, and it would only be introduced once appropriate consent controls have been implemented on the relevant domain. This notice would be updated before that happens.",
    ],
  },



];

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Privacy Notice | Bright Leadership Consulting"
        description="How Bright Leadership Consulting collects, uses, retains and protects personal and diagnostic information."
        path="/privacy"
      />
      <Header />

      <main>
        <section className="pt-36 pb-20 lg:pt-44 lg:pb-24">
          <div className="container-brief">
            <div className="max-w-[680px]">
              <motion.p className="kicker mb-6" {...fade}>
                Legal
              </motion.p>
              <motion.h1 className="heading-hero mb-8" {...fade}>
                Privacy Notice
              </motion.h1>
              <motion.p className="body-brief text-muted-foreground" {...fade}>
                This notice explains what information Bright Leadership
                Consulting holds, why it is held, and how it is protected.
              </motion.p>
            </div>
          </div>
        </section>

        <section className="pb-32">
          <div className="container-brief">
            <div className="max-w-[680px] border-t border-border">
              {sections.map((section) => (
                <motion.div
                  key={section.heading}
                  className="border-b border-border py-10"
                  {...fade}
                >
                  <h2 className="font-serif text-xl font-medium text-foreground mb-4">
                    {section.heading}
                  </h2>
                  <div className="space-y-4">
                    {section.body.map((paragraph) => (
                      <p key={paragraph} className="text-[15px] leading-relaxed text-muted-foreground">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Privacy;
