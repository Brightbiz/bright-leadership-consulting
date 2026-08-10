import { motion } from "framer-motion";

const fade = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7, ease: "easeOut" as const },
};

const questions = [
  {
    q: "Do I have a right to cancel my programme purchase?",
    a: "Individual consumers buying online may have a statutory 14-day cancellation right under the applicable law governing digital content and services. Whether that right applies to your purchase depends on what you agreed to at checkout and when access began.",
  },
  {
    q: "What does the consent and acknowledgement at checkout mean?",
    a: "By completing your purchase you expressly consent to immediate access to the digital programme materials. You acknowledge that once supply begins — that is, once you can access the programme content — your 14-day statutory cancellation right is lost. This is the standard legal position for digital content where the consumer has requested immediate supply.",
  },
  {
    q: "What if I did not give express consent or acknowledgement?",
    a: "If the required consent and acknowledgement were not obtained before you accessed the programme, your statutory cancellation rights remain unaffected. Nothing in these terms excludes any rights or remedies that cannot lawfully be limited.",
  },
  {
    q: "How do I request cancellation?",
    a: "To request cancellation, contact Bright Leadership Consulting in writing with your name, the programme purchased, the purchase date and the email address used to enrol. We will review the request and confirm your position under these terms and applicable law.",
  },
  {
    q: "Do the same rules apply to organisational or cohort purchases?",
    a: "No. Cancellation, postponement, substitution of participants and refund arrangements for organisational, cohort, facilitated or advisory-supported purchases are set out in the written proposal, order form or agreement issued for that engagement. Consumer cancellation provisions do not ordinarily apply to purchases made wholly for business purposes.",
  },
];

const CancellationFaq = () => {
  return (
    <div className="max-w-[720px]">
      <motion.div {...fade} transition={{ ...fade.transition, delay: 0.15 }}>
        {questions.map(({ q, a }) => (
          <details key={q} className="border-b border-border py-4">
            <summary className="cursor-pointer rounded-sm font-serif text-lg text-foreground marker:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background">
              {q}
            </summary>
            <p className="mt-3 leading-relaxed text-muted-foreground">{a}</p>
          </details>
        ))}
      </motion.div>
    </div>
  );
};

export default CancellationFaq;
