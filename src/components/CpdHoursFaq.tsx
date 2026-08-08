import { motion } from "framer-motion";

import { programmes } from "@/data/programmes";

const fade = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7, ease: "easeOut" as const },
};

/**
 * Explains how the accredited CPD hour ranges in `src/data/programmes.ts`
 * are derived and what "completion" means for each programme. Ranges are
 * read from the catalogue so the copy can never drift from the data.
 */
const CpdHoursFaq = () => {
  const questions = [
    {
      q: "Why are CPD hours stated as a range rather than a fixed number?",
      a: "Accredited CPD hours reflect verifiable learning time, and that time varies with how deeply a participant engages the working documents, diagnostics and capstone exercises. The lower bound is the structured content itself; the upper bound includes the applied work, written reflections and capstone submission. Both bounds fall within the accredited range recorded with The CPD Standards Office (Provider Number 50838, 2025–2026).",
    },
    {
      q: "How is the range for each programme determined?",
      a: `Each range is set at programme level from module count, taught content length and the applied work attached to it. ${programmes
        .map((p) => `${p.title}: ${p.cpdHours ?? "on request"}`)
        .join(". ")}.`,
    },
    {
      q: "What counts as completion?",
      a: "Completion means every module in the programme has been worked through and the capstone or closing exercise has been submitted within the learning platform. For the Executive Leadership Mastery Programme this is all thirty-three modules; for Strategic Leadership in the Age of AI it is the ten modules plus the AI Leadership Blueprint™ Canvas; for the Future Workplace and Workforce Strategy Programme and the Strategic Productivity and Peak Performance Accelerator it is the full module sequence plus the closing applied exercise. Partial completion is recorded module by module but does not carry the full accredited range.",
    },
    {
      q: "Who records the hours?",
      a: "Participants who satisfy the approved completion requirements receive the official CPDSO Certificate of Attendance manually from Bright Leadership Consulting, using the standard template supplied by CPDSO. Certificates are not generated or downloaded automatically. The Certificate of Attendance records participation in an accredited CPD activity; it is not a qualification, professional certification or academic award. Participants remain responsible for recording those hours with their own professional body, in line with that body's own CPD scheme.",
    },
  ];

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
