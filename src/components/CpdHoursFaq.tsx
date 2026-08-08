import { motion } from "framer-motion";

import cpdFaq from "@/data/cpd-faq.json";
import { programmes } from "@/data/programmes";

const fade = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7, ease: "easeOut" as const },
};

/**
 * Explains how the accredited CPD hour ranges in `src/data/programmes.ts`
 * are derived and what "completion" means for each programme. The copy lives
 * in `src/data/cpd-faq.json` — the same source the downloadable programme
 * portfolio PDF is generated from — so the two can never drift.
 */
const CpdHoursFaq = () => {
  const programmeHours = programmes
    .map((p) => `${p.title}: ${p.cpdHours ?? "on request"}`)
    .join(". ");

  const questions = cpdFaq.items.map(({ q, a }) => ({
    q,
    a: a.replace("{{PROGRAMME_HOURS}}", programmeHours),
  }));


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

export default CpdHoursFaq;
