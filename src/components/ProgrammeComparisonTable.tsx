import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { programmes } from "@/data/programmes";
import { trackCourseCtaClick } from "@/lib/analytics";

const rows: { label: string; value: (i: number) => string }[] = [
  {
    label: "Structure",
    value: (i) => programmes[i].subtitle,
  },
  {
    label: "Primary Focus",
    value: (i) => programmes[i].features[0],
  },
  {
    label: "Individual Fee",
    value: (i) => programmes[i].individualFee ?? "On request",
  },
  {
    label: "Availability",
    value: (i) =>
      programmes[i].enrolmentAvailable === false
        ? "Next intake on request"
        : "Open for enrolment",
  },
];

const ProgrammeComparisonTable = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="overflow-x-auto"
    >
      <table className="w-full min-w-[720px] border-collapse text-left">
        <caption className="sr-only">
          Comparison of the four executive programmes
        </caption>
        <thead>
          <tr className="border-b border-border">
            <th
              scope="col"
              className="py-4 pr-6 align-bottom text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground"
            >
              Programme
            </th>
            {programmes.map((p) => (
              <th
                key={p.title}
                scope="col"
                className="py-4 pr-6 align-bottom font-serif text-sm font-semibold text-foreground"
              >
                {p.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="border-b border-border">
              <th
                scope="row"
                className="py-5 pr-6 align-top text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground"
              >
                {row.label}
              </th>
              {programmes.map((p, i) => (
                <td
                  key={p.title}
                  className="py-5 pr-6 align-top text-sm leading-relaxed text-muted-foreground"
                >
                  {row.value(i)}
                </td>
              ))}
            </tr>
          ))}
          <tr>
            <th
              scope="row"
              className="py-6 pr-6 align-top text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground"
            >
              Next Step
            </th>
            {programmes.map((p) => (
              <td key={p.title} className="py-6 pr-6 align-top">
                <ProgrammeCta
                  programme={p}
                  surface="/courses#comparison"
                  helperText={false}
                />
                <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                  {p.enrolmentAvailable === false
                    ? "Intake dates confirmed on enquiry."
                    : "Individual enrolment completes on the programme platform."}
                </p>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </motion.div>
  );
};

export default ProgrammeComparisonTable;
