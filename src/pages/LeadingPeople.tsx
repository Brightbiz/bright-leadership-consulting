import { motion } from "framer-motion";
import SEOHead from "@/components/SEOHead";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";

const fade = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true } as const,
  transition: { duration: 0.7, ease: "easeOut" as const },
};

const ENQUIRY_EMAIL = "info@brightleadershipconsulting.com";
const ENQUIRY_SUBJECT = "Leading People — employer cohort enquiry";
const ENQUIRY_BODY = [
  "Organisation:",
  "Approximate number of managers:",
  "Main development need:",
  "Preferred timing:",
].join("\n");
const enquiryHref = `mailto:${ENQUIRY_EMAIL}?subject=${encodeURIComponent(
  ENQUIRY_SUBJECT,
)}&body=${encodeURIComponent(ENQUIRY_BODY)}`;

const workshops = [
  {
    title: "From expert to manager",
    practise:
      "Clarifying responsibility, decision authority, consultation and escalation",
    prepare: "A role and decision map",
  },
  {
    title: "Delegation and follow through",
    practise:
      "Agreeing an outcome, authority, capacity, support and review",
    prepare: "A delegation brief",
  },
  {
    title: "Feedback and accountability",
    practise:
      "Describing an observable issue, exploring context and agreeing action and support",
    prepare: "A conversation and agreement",
  },
  {
    title: "Team priorities and routines",
    practise:
      "Turning priorities into owned actions and running a useful progress review",
    prepare: "A priority plan and thirty-day application plan",
  },
];

const formatPoints = [
  "Four facilitated online workshops of two hours each, delivered over six weeks.",
  "Approximately 30–45 minutes weekly for preparation and workplace application outside the workshops.",
  "An employer cohort of 8–12 managers. A smaller suitable cohort may be agreed at the same fee.",
  "Dates agreed with the employer before booking.",
  "Participant workbook, workshop resources, practice and feedback included.",
];

const employerQuestions = [
  {
    question: "Who should attend?",
    answer:
      "Managers with direct reports who are establishing effective people-management routines. People without a team may need a different version. Executive Leadership Mastery remains Bright's separate programme for experienced and aspiring senior leaders.",
  },
  {
    question: "What does the employer provide?",
    answer:
      "A sponsor, suitable participant selection, time to attend and apply the learning, line-manager support and relevant workplace procedures. We discuss access needs and necessary adjustments before delivery.",
  },
  {
    question: "Is this a qualification?",
    answer:
      "This is practical professional development, not a formal qualification. No external accreditation or CPD-hours claim is made for this offer.",
  },
  {
    question: "How is progress considered?",
    answer:
      "Participants practise specific tasks and review examples of their application. The follow-up considers what changed, supporting evidence and remaining difficulties. It does not promise a particular business result.",
  },
];

const LeadingPeople = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Leading People | Employer Management Development | Bright Leadership Consulting"
        description="A six-week online programme for managers with direct reports. Four practical workshops, workplace application and sponsor reviews. £4,800 per employer cohort."
        path="/leading-people"
        noindex
      />
      <ScrollProgress />
      <Header />

      <main>
        {/* Introduction */}
        <section className="pt-36 pb-24 lg:pt-44 lg:pb-32 bg-background">
          <div className="container-brief">
            <div className="max-w-[680px]">
              <motion.p className="kicker mb-6" {...fade}>
                Leading People
              </motion.p>
              <motion.h1
                className="heading-hero mb-8"
                {...fade}
                transition={{ ...fade.transition, delay: 0.1 }}
              >
                Practical management in action
              </motion.h1>
              <motion.div
                className="space-y-6"
                {...fade}
                transition={{ ...fade.transition, delay: 0.2 }}
              >
                <p className="text-lg leading-relaxed text-muted-foreground">
                  A six-week online programme for new and developing managers
                  who already supervise people.
                </p>
                <p className="text-lg leading-relaxed text-muted-foreground">
                  Help your managers practise the conversations and routines
                  their responsibilities require: clarifying authority,
                  delegating work, addressing an observable issue and turning
                  team priorities into action.
                </p>
                <p className="text-base font-medium text-foreground">
                  Four two-hour workshops · One employer cohort of 8–12
                  managers · £4,800 total, no VAT added
                </p>
              </motion.div>
              <motion.div
                className="mt-10"
                {...fade}
                transition={{ ...fade.transition, delay: 0.3 }}
              >
                <a href={enquiryHref} className="btn-brief">
                  Discuss an employer cohort
                </a>
              </motion.div>
            </div>
          </div>
        </section>

        <div className="section-divider" />

        {/* When the role changes */}
        <section className="section-brief section-pearl">
          <div className="container-brief">
            <div className="max-w-[680px]">
              <motion.h2
                className="heading-section mb-8"
                {...fade}
                transition={{ ...fade.transition, delay: 0.1 }}
              >
                When the role changes, everyday management changes too
              </motion.h2>
              <motion.div
                className="space-y-6"
                {...fade}
                transition={{ ...fade.transition, delay: 0.15 }}
              >
                <p className="body-brief">
                  A capable specialist may now need to coordinate colleagues,
                  explain decisions, agree standards and follow through on work
                  they no longer do personally.
                </p>
                <p className="body-brief">
                  Leading People gives managers a structured setting to practise
                  those tasks, receive feedback and apply suitable learning in
                  their own teams. It is designed for managers with direct
                  reports, including those taking responsibility for former
                  peers.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        <div className="section-divider" />

        {/* Workshops */}
        <section className="section-brief bg-background">
          <div className="container-brief">
            <motion.p className="kicker mb-6" {...fade}>
              Programme Structure
            </motion.p>
            <motion.h2
              className="heading-section mb-12 max-w-[680px]"
              {...fade}
              transition={{ ...fade.transition, delay: 0.1 }}
            >
              Four workshops, practical outputs
            </motion.h2>

            {/* Desktop table */}
            <motion.div
              className="hidden md:block overflow-hidden rounded-sm border border-border"
              {...fade}
              transition={{ ...fade.transition, delay: 0.15 }}
            >
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="px-6 py-4 text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
                      Workshop
                    </th>
                    <th className="px-6 py-4 text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
                      What participants practise
                    </th>
                    <th className="px-6 py-4 text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
                      What they prepare
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {workshops.map((w) => (
                    <tr
                      key={w.title}
                      className="border-b border-border last:border-b-0"
                    >
                      <td className="px-6 py-5 align-top font-serif text-base font-semibold text-foreground">
                        {w.title}
                      </td>
                      <td className="px-6 py-5 align-top text-sm leading-relaxed text-muted-foreground">
                        {w.practise}
                      </td>
                      <td className="px-6 py-5 align-top text-sm leading-relaxed text-muted-foreground">
                        {w.prepare}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>

            {/* Stacked layout on phones */}
            <div className="md:hidden space-y-px bg-border rounded-sm overflow-hidden">
              {workshops.map((w, i) => (
                <motion.div
                  key={w.title}
                  className="bg-background p-6"
                  {...fade}
                  transition={{ ...fade.transition, delay: 0.1 + i * 0.06 }}
                >
                  <h3 className="font-serif text-base font-semibold text-foreground mb-3">
                    {w.title}
                  </h3>
                  <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground mb-1.5">
                    What participants practise
                  </p>
                  <p className="text-sm leading-relaxed text-muted-foreground mb-4">
                    {w.practise}
                  </p>
                  <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground mb-1.5">
                    What they prepare
                  </p>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {w.prepare}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <div className="section-divider" />

        {/* Practice and application */}
        <section className="section-brief section-pearl">
          <div className="container-brief">
            <div className="max-w-[680px]">
              <motion.h2
                className="heading-section mb-8"
                {...fade}
                transition={{ ...fade.transition, delay: 0.1 }}
              >
                Built around practice and application
              </motion.h2>
              <motion.div
                className="space-y-6"
                {...fade}
                transition={{ ...fade.transition, delay: 0.15 }}
              >
                <p className="body-brief">
                  Participants prepare fictional or anonymised cases, practise
                  with feedback and apply suitable tasks between workshops.
                  Their line manager supports review of agreed behaviours.
                </p>
                <p className="body-brief">
                  The programme includes an initial sponsor briefing and a
                  sponsor follow-up approximately thirty days after the final
                  workshop. Bright and the sponsor agree what learning evidence
                  will be shared. Private employee case records are not
                  required.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        <div className="section-divider" />

        {/* Format and commitment */}
        <section className="section-brief bg-background">
          <div className="container-brief">
            <div className="max-w-[680px]">
              <motion.p className="kicker mb-6" {...fade}>
                Delivery
              </motion.p>
              <motion.h2
                className="heading-section mb-4"
                {...fade}
                transition={{ ...fade.transition, delay: 0.1 }}
              >
                Format and commitment
              </motion.h2>
              <motion.div
                className="space-y-1.5 border-l-2 border-border pl-6 mt-10"
                {...fade}
                transition={{ ...fade.transition, delay: 0.15 }}
              >
                {formatPoints.map((point) => (
                  <p
                    key={point}
                    className="text-sm text-muted-foreground leading-relaxed"
                  >
                    {point}
                  </p>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        <div className="section-divider" />

        {/* Fee */}
        <section className="section-brief section-pearl">
          <div className="container-brief">
            <div className="max-w-[680px]">
              <motion.p className="kicker mb-6" {...fade}>
                Employer Cohort Fee
              </motion.p>
              <motion.h2
                className="heading-section mb-8"
                {...fade}
                transition={{ ...fade.transition, delay: 0.1 }}
              >
                £4,800 total for the cohort.
              </motion.h2>
              <motion.div
                className="space-y-6"
                {...fade}
                transition={{ ...fade.transition, delay: 0.15 }}
              >
                <p className="body-brief">
                  Bright Leadership Consulting is not VAT-registered; no VAT is
                  added. The fee is for the cohort, not per participant.
                </p>
                <p className="body-brief">
                  The fee includes the four workshops, participant workbook and
                  workshop resources, practice and feedback, an initial sponsor
                  briefing and a follow-up sponsor review approximately thirty
                  days after the final workshop.
                </p>
                <p className="body-brief">
                  Individual coaching, substantial tailoring, extra workshops,
                  more than twelve participants and in-person delivery require a
                  separate quotation. Scope, dates, payment and cancellation
                  arrangements are agreed before you commit.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        <div className="section-divider" />

        {/* Employer questions */}
        <section className="section-brief bg-background">
          <div className="container-brief">
            <motion.p className="kicker mb-6" {...fade}>
              Employer Questions
            </motion.p>
            <motion.h2
              className="heading-section mb-12 max-w-[680px]"
              {...fade}
              transition={{ ...fade.transition, delay: 0.1 }}
            >
              What employers usually ask
            </motion.h2>
            <div className="grid gap-px bg-border md:grid-cols-2 max-w-[1000px]">
              {employerQuestions.map((q, i) => (
                <motion.div
                  key={q.question}
                  className="bg-background p-8 lg:p-10 rounded-sm"
                  {...fade}
                  transition={{ ...fade.transition, delay: 0.1 + i * 0.06 }}
                >
                  <h3 className="font-serif text-base font-semibold text-foreground mb-3">
                    {q.question}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {q.answer}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <div className="section-divider" />

        {/* CTA */}
        <section className="section-brief section-pearl">
          <div className="container-brief">
            <div className="max-w-[680px]">
              <motion.h2
                className="heading-section mb-8"
                {...fade}
                transition={{ ...fade.transition, delay: 0.1 }}
              >
                Discuss an employer cohort
              </motion.h2>
              <motion.p
                className="body-brief mb-10"
                {...fade}
                transition={{ ...fade.transition, delay: 0.15 }}
              >
                Tell us your organisation, approximate number of managers, main
                development need and preferred timing. Bright will discuss
                programme fit and confirm the scope and booking arrangements
                before you commit.
              </motion.p>
              <motion.div
                className="space-y-6"
                {...fade}
                transition={{ ...fade.transition, delay: 0.2 }}
              >
                <a href={enquiryHref} className="btn-brief">
                  Discuss an employer cohort
                </a>
                <p className="text-sm text-muted-foreground">
                  Or email{" "}
                  <a
                    href={`mailto:${ENQUIRY_EMAIL}`}
                    className="text-foreground underline underline-offset-4 decoration-border hover:decoration-foreground transition-colors"
                  >
                    {ENQUIRY_EMAIL}
                  </a>
                  .
                </p>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  Irene A. Agunbiade, operating under the business name Bright
                  Leadership Consulting · 82 James Carter Road, Mildenhall,
                  England IP28 7DE.
                </p>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default LeadingPeople;
