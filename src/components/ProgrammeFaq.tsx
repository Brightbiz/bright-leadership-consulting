import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { programmes } from "@/data/programmes";
import {
  CPD_CERTIFICATE_SCOPE_NOTE,
  CPD_PARTICIPANT_STATEMENT,
  CPD_PROVIDER_STATEMENT,
} from "@/data/accreditation";

const fade = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true } as const,
  transition: { duration: 0.7, ease: "easeOut" as const },
};

type Props = {
  /** Catalogue title, so fee, hours and enrolment state can never drift. */
  programmeTitle: string;
};

type Faq = { q: string; a: string };

/**
 * Admissions, access and delivery FAQ for a programme detail page.
 *
 * Every answer must remain defensible against the catalogue in
 * src/data/programmes.ts and the approved accreditation wording in
 * src/data/accreditation.ts. Do not add cohort dates, outcome claims,
 * "open cohort", "lifetime access" or certification wording here.
 */
const ProgrammeFaq = ({ programmeTitle }: Props) => {
  const programme = programmes.find((p) => p.title === programmeTitle);
  const fee = programme?.individualFee;
  const hours = programme?.cpdHours;
  const enrolmentAvailable = programme?.enrolmentAvailable === true;

  const admissions: Faq[] = [
    {
      q: "Who is this programme for?",
      a: "Senior leaders carrying organisational consequence — chief executives, directors, senior functional leaders and those being prepared for board-level responsibility. It assumes existing leadership experience rather than teaching leadership from first principles.",
    },
    {
      q: "Are there any entry requirements or an application process?",
      a: enrolmentAvailable
        ? "There is no application, interview or academic prerequisite for individual enrolment. You enrol directly and begin. Organisational and facilitated delivery is scoped with us first, so the content can be set against the leadership context it is intended to serve."
        : "There is no application, interview or academic prerequisite. Availability for this programme is confirmed on enquiry, and delivery is scoped with us before enrolment.",
    },
    {
      q: "Do I need to complete the Executive Alignment Index™ first?",
      a: "No. The diagnostic is not a prerequisite for individual enrolment. It applies where an organisation is commissioning development for a leadership team and wants investment directed at measured structural gaps rather than assumed ones.",
    },
    {
      q: "Can my organisation enrol a group of leaders?",
      a: "Yes. Group, cohort and bespoke delivery are arranged through enquiry rather than checkout, so scope, sequencing and the fee can be confirmed before commitment.",
    },
  ];

  const access: Faq[] = [
    {
      q: "When can I start?",
      a: enrolmentAvailable
        ? "Individual enrolment gives immediate self-directed access on the programme platform once payment is confirmed. This is not an open cohort with fixed start dates."
        : "Start timing for this programme is confirmed on enquiry, alongside availability and delivery format.",
    },
    {
      q: "How long will I have access to the materials?",
      a: "Access to programme materials is currently not subject to a fixed expiry date on the programme platform. If you need assistance regaining access at any point, contact us directly.",
    },
    {
      q: "How is the programme delivered, and on what devices?",
      a: "Materials are hosted on the programme platform and are worked through in a browser on desktop, tablet or mobile. No specialist software is required.",
    },
    {
      q: "What does it cost, and can I pay in instalments?",
      a: fee
        ? `The individual self-directed fee is ${fee}, taken securely at checkout on the programme platform. ${
            programme?.paymentPlanDetail
              ? programme.paymentPlanDetail
              : "Fees are stated in GBP, and any applicable tax is calculated at checkout."
          }`
        : "The fee for this programme is confirmed on enquiry, as delivery is scoped individually. Fees are stated in GBP.",
    },
  ];

  const delivery: Faq[] = [
    {
      q: "How much time should I set aside?",
      a: hours
        ? `The accredited range is ${hours}. The lower bound reflects the structured content; the upper bound includes the applied work and closing exercise. Most participants spread this across the enrolment period rather than working through it continuously.`
        : "Time commitment reflects the structured content plus the applied work and closing exercise, spread across the enrolment period.",
    },
    {
      q: "What is the difference between self-directed and facilitated delivery?",
      a: "Self-directed enrolment gives you the full structured programme to work through at your own pace, with email support for access and content queries. Facilitated, cohort and organisational delivery adds scheduled discussion and a named point of contact, and is confirmed at scoping rather than at checkout.",
    },
    {
      q: "Is this programme CPD accredited?",
      a: `${CPD_PROVIDER_STATEMENT}${hours ? ` This programme carries ${hours}.` : ""}`,
    },
    {
      q: "What do I receive on completion?",
      a: `Completion means every module has been worked through and the capstone or closing exercise has been submitted within the learning platform, then reviewed and approved by Bright Leadership Consulting. ${CPD_PARTICIPANT_STATEMENT} ${CPD_CERTIFICATE_SCOPE_NOTE}`,
    },
  ];

  const groups: { label: string; items: Faq[] }[] = [
    { label: "Admissions", items: admissions },
    { label: "Access and Enrolment", items: access },
    { label: "Delivery and Completion", items: delivery },
  ];

  const allItems = groups.flatMap((g) => g.items);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    name: `${programmeTitle} — Admissions, Access and Delivery`,
    mainEntity: allItems.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <>
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <div className="section-divider" />

      <section
        className="section-brief bg-background"
        id="programme-faq"
        aria-labelledby="programme-faq-heading"
      >
        <div className="container-brief">
          <motion.p className="kicker mb-6" {...fade}>
            Frequently Asked
          </motion.p>

          <motion.h2
            id="programme-faq-heading"
            className="heading-section mb-4 max-w-[680px]"
            {...fade}
            transition={{ ...fade.transition, delay: 0.1 }}
          >
            Admissions, Access and Delivery
          </motion.h2>

          <motion.p
            className="body-brief max-w-[680px] mb-12"
            {...fade}
            transition={{ ...fade.transition, delay: 0.15 }}
          >
            The questions senior leaders ask before enrolling, answered
            directly.
          </motion.p>

          <div className="max-w-[720px] space-y-12">
            {groups.map((group, gi) => (
              <motion.div
                key={group.label}
                {...fade}
                transition={{ ...fade.transition, delay: 0.1 + gi * 0.06 }}
              >
                <h3 className="kicker mb-4">{group.label}</h3>

                <Accordion type="single" collapsible className="border-t border-border">
                  {group.items.map((item) => (
                    <AccordionItem
                      key={item.q}
                      value={item.q}
                      className="border-b border-border"
                    >
                      <AccordionTrigger className="py-5 text-left font-serif text-base font-semibold text-foreground hover:no-underline">
                        {item.q}
                      </AccordionTrigger>
                      <AccordionContent className="pb-6 text-sm leading-relaxed text-muted-foreground">
                        {item.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </motion.div>
            ))}
          </div>

          <motion.p
            className="mt-10 text-xs leading-relaxed text-muted-foreground max-w-[680px]"
            {...fade}
            transition={{ ...fade.transition, delay: 0.25 }}
          >
            Anything not answered here can be raised on the{" "}
            <Link to="/contact" className="link-quiet">
              enquiry page
            </Link>
            . Commercial terms are set out in full on the{" "}
            <Link to="/terms" className="link-quiet">
              Terms
            </Link>{" "}
            page.
          </motion.p>
        </div>
      </section>
    </>
  );
};

export default ProgrammeFaq;
