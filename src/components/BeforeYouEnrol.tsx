import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import { programmes } from "@/data/programmes";
import {
  CPD_CERTIFICATE_SCOPE_NOTE,
  CPD_PARTICIPANT_STATEMENT,
} from "@/data/accreditation";

const fade = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true } as const,
  transition: { duration: 0.7, ease: "easeOut" as const },
};

type Props = {
  /** Catalogue title, so fee and CPD hours can never drift from the source. */
  programmeTitle: string;
};

/**
 * Concise purchasing information shown on every programme detail page:
 * access duration, completion time, support, tax, invoicing, cancellation,
 * completion approval and certificate timing.
 *
 * Every commercial statement here must remain defensible. Do not add
 * indefinite or "lifetime" access wording unless the enrolment duration
 * configured on the learning platform has been confirmed as indefinite.
 */
const TAX =
  "Fees are stated in GBP. Any applicable tax and the payment arrangements are confirmed before payment. A receipt is issued following payment.";

const BeforeYouEnrol = ({ programmeTitle }: Props) => {
  const programme = programmes.find((p) => p.title === programmeTitle);
  const fee = programme?.individualFee;
  const hours = programme?.cpdHours;

  const items: { q: string; a: string }[] = [
    {
      q: "How do I secure a place?",
      a: "Individual places are arranged directly with Bright Leadership Consulting. Submit an enrolment enquiry and we will confirm availability, payment arrangements and access.",
    },
    {
      q: "How long do I have access?",
      a: "Access is issued once enrolment and payment arrangements have been confirmed, and is currently not subject to a fixed expiry date on the learning platform.",
    },
    {
      q: "How long does completion usually take?",
      a: hours
        ? `Most participants complete in line with the accredited range of ${hours}, spread across the enrolment period. The lower bound is the structured content; the upper bound includes the applied work and closing exercise.`
        : "Completion time reflects the structured content plus the applied work and closing exercise, spread across the enrolment period.",
    },
    {
      q: "What support is included?",
      a: "Self-directed study includes email support for access and content queries, normally answered within one working day. Facilitated, cohort and organisational delivery includes a named point of contact, confirmed at scoping.",
    },
    {
      q: "How is payment taken, and is tax included?",
      a: fee
        ? `Individual fee: ${fee}. Individual places are arranged directly with Bright Leadership Consulting. ${TAX}`
        : `Individual places are arranged directly with Bright Leadership Consulting. ${TAX}`,
    },
    {
      q: "Can I have an invoice or use a purchase order?",
      a: "A receipt is issued following payment. For organisational purchases, invoices and purchase-order arrangements are confirmed as part of the enquiry, so the purchase is raised correctly.",
    },
    {
      q: "What are the cancellation terms?",
      a: "Cancellation and refund arrangements are set out in our Terms. If you need to cancel, contact us in writing as soon as possible and we will confirm the position for your purchase.",
    },
    {
      q: "How is completion approved?",
      a: "Completion means every module has been worked through and the capstone or closing exercise has been submitted within the learning platform. Completion is reviewed and approved by Bright Leadership Consulting.",
    },
    {
      q: "When is the certificate issued?",
      a: `${CPD_PARTICIPANT_STATEMENT} Certificates are normally issued within ten working days of approved completion. ${CPD_CERTIFICATE_SCOPE_NOTE}`,
    },
  ];

  return (
    <>
      <div className="section-divider" />
      <section className="section-brief bg-background" id="before-you-enrol">
        <div className="container-brief">
          <motion.p className="kicker mb-6" {...fade}>
            Before You Enrol
          </motion.p>

          <motion.h2
            className="heading-section mb-4 max-w-[680px]"
            {...fade}
            transition={{ ...fade.transition, delay: 0.1 }}
          >
            Access, Payment and Certification Terms
          </motion.h2>

          <motion.p
            className="body-brief max-w-[680px] mb-12"
            {...fade}
            transition={{ ...fade.transition, delay: 0.15 }}
          >
            The practical information an executive needs before submitting an
            enrolment enquiry.
          </motion.p>

          <dl className="max-w-[720px] divide-y divide-border border-y border-border">
            {items.map((item, i) => (
              <motion.div
                key={item.q}
                className="py-6"
                {...fade}
                transition={{ ...fade.transition, delay: 0.05 + i * 0.04 }}
              >
                <dt className="font-serif text-base font-semibold text-foreground mb-2">
                  {item.q}
                </dt>
                <dd className="text-sm leading-relaxed text-muted-foreground">
                  {item.a}
                </dd>
              </motion.div>
            ))}
          </dl>

          <motion.p
            className="mt-8 text-xs leading-relaxed text-muted-foreground max-w-[680px]"
            {...fade}
            transition={{ ...fade.transition, delay: 0.2 }}
          >
            Full terms are set out on the{" "}
            <Link to="/terms" className="link-quiet">
              Terms
            </Link>{" "}
            page. For anything not covered here,{" "}
            <Link to="/contact" className="link-quiet">
              enquire directly
            </Link>
            .
          </motion.p>
        </div>
      </section>
    </>
  );
};

export default BeforeYouEnrol;
