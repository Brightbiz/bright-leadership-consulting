import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import ProgrammeMeta from "@/components/ProgrammeMeta";
import CourseSchema from "@/components/CourseSchema";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";
import CourseJourneyMap from "@/components/CourseJourneyMap";
import { programmes } from "@/data/programmes";
import { trackCourseCtaClick } from "@/lib/analytics";

const fade = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true } as const,
  transition: { duration: 0.7, ease: "easeOut" as const },
};

const PROGRAMME_TITLE = "Strategic Leadership in the Age of AI";
const programme = programmes.find((p) => p.title === PROGRAMME_TITLE)!;

const audience = [
  {
    title: "Chairs and non-executive directors",
    description:
      "Those accountable for oversight of artificial intelligence adoption and its governance implications.",
  },
  {
    title: "Chief executives and executive directors",
    description:
      "Those directing organisational AI strategy and answerable for its consequences at board level.",
  },
  {
    title: "Functional leaders with AI exposure",
    description:
      "Technology, risk, people and operations leaders required to translate AI capability into governed decisions.",
  },
];

const outcomes = [
  "A written AI Leadership Blueprint™ specific to the organisation",
  "A governance framework covering accountability, escalation and review",
  "An assessment of organisational AI maturity and material exposure",
  "A defensible position on responsible adoption for board discussion",
];

const structure = [
  "Ten modules across six stages, from awareness to integration",
  "Self-paced online delivery with downloadable working documents",
  "Capstone: the AI Leadership Blueprint™ Canvas",
  "66 CPD points on completion of the wider accredited pathway",
];

const StrategicLeadershipAI = () => {
  return (
    <div className="min-h-screen bg-background">
      <ProgrammeMeta
        programmeTitle={PROGRAMME_TITLE}
        title="Strategic Leadership in the Age of AI | Bright Leadership"
        description="A board-level programme in AI governance and strategy: ten modules, six stages, and a written AI Leadership Blueprint™. Individual enrolment £895; organisational delivery on request."
        path="/strategic-leadership-ai"
      />
      <CourseSchema programmeTitle={PROGRAMME_TITLE} />
      <ScrollProgress />
      <Header />

      <main>
        {/* Section 1 — Introduction */}
        <section className="pt-36 pb-24 lg:pt-44 lg:pb-32 bg-background">
          <div className="container-brief">
            <div className="max-w-[680px]">
              <motion.p className="kicker mb-6" {...fade}>
                Executive Programme
              </motion.p>

              <motion.h1
                className="heading-hero mb-8"
                {...fade}
                transition={{ ...fade.transition, delay: 0.1 }}
              >
                Strategic Leadership in the Age of AI
              </motion.h1>

              <motion.div
                className="space-y-6"
                {...fade}
                transition={{ ...fade.transition, delay: 0.2 }}
              >
                <p className="text-lg leading-relaxed text-muted-foreground">
                  A programme for senior leaders who are accountable for
                  artificial intelligence adoption rather than for building it.
                  It addresses the governance structures, decision rights and
                  strategic judgement required to direct AI at board level.
                </p>
                <p className="text-lg leading-relaxed text-muted-foreground">
                  Ten modules. Six stages. One written AI Leadership Blueprint™.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        <div className="section-divider" />

        {/* Section 2 — Audience */}
        <section className="section-brief section-pearl">
          <div className="container-brief">
            <motion.p className="kicker mb-6" {...fade}>
              Intended Participants
            </motion.p>
            <motion.h2
              className="heading-section mb-12 max-w-[680px]"
              {...fade}
              transition={{ ...fade.transition, delay: 0.1 }}
            >
              Who the Programme Is For
            </motion.h2>

            <div className="max-w-[680px]">
              {audience.map((a, i) => (
                <motion.div
                  key={a.title}
                  className="py-5 border-b border-border last:border-b-0"
                  {...fade}
                  transition={{ ...fade.transition, delay: 0.1 + i * 0.06 }}
                >
                  <h3 className="font-serif text-base font-semibold text-foreground">
                    {a.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
                    {a.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <div className="section-divider" />

        {/* Section 3 — Outcomes */}
        <section className="section-brief bg-background">
          <div className="container-brief">
            <div className="max-w-[680px]">
              <motion.p className="kicker mb-6" {...fade}>
                Outcomes
              </motion.p>
              <motion.h2
                className="heading-section mb-4"
                {...fade}
                transition={{ ...fade.transition, delay: 0.1 }}
              >
                What Participants Leave With
              </motion.h2>
              <motion.div
                className="space-y-1.5 border-l-2 border-border pl-6 mt-10"
                {...fade}
                transition={{ ...fade.transition, delay: 0.15 }}
              >
                {outcomes.map((o) => (
                  <p key={o} className="text-sm text-muted-foreground leading-relaxed">
                    {o}
                  </p>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        <div className="section-divider" />

        {/* Section 4 — Structure */}
        <section className="section-brief section-pearl">
          <div className="container-brief">
            <motion.p className="kicker mb-6" {...fade}>
              Programme Architecture
            </motion.p>
            <motion.h2
              className="heading-section mb-4 max-w-[680px]"
              {...fade}
              transition={{ ...fade.transition, delay: 0.1 }}
            >
              Structure and Format
            </motion.h2>
            <motion.div
              className="max-w-[680px] space-y-1.5 border-l-2 border-border pl-6 mb-14"
              {...fade}
              transition={{ ...fade.transition, delay: 0.15 }}
            >
              {structure.map((s) => (
                <p key={s} className="text-sm text-muted-foreground leading-relaxed">
                  {s}
                </p>
              ))}
            </motion.div>
            <CourseJourneyMap />
          </div>
        </section>

        <div className="section-divider" />

        {/* Section 5 — Accreditation */}
        <section className="section-brief bg-background">
          <div className="container-brief">
            <div className="max-w-[680px]">
              <motion.p className="kicker mb-6" {...fade}>
                Accreditation
              </motion.p>
              <motion.h2
                className="heading-section mb-6"
                {...fade}
                transition={{ ...fade.transition, delay: 0.1 }}
              >
                CPD Position
              </motion.h2>
              <motion.p
                className="body-brief"
                {...fade}
                transition={{ ...fade.transition, delay: 0.15 }}
              >
                Bright Leadership Consulting's programmes are accredited by The
                CPD Standards Office (Provider Number 50838) as Accredited CPD
                Activity for the 2025–2026 period. Accreditation applies to the
                programmes only; the Executive Alignment Index™ and advisory
                engagements are proprietary instruments and are not externally
                accredited.
              </motion.p>
            </div>
          </div>
        </section>

        <div className="section-divider" />

        {/* Section 6 — Fees and routes */}
        <section className="section-brief section-pearl">
          <div className="container-brief">
            <motion.p className="kicker mb-6" {...fade}>
              Fees and Delivery
            </motion.p>
            <motion.h2
              className="heading-section mb-12 max-w-[680px]"
              {...fade}
              transition={{ ...fade.transition, delay: 0.1 }}
            >
              Two Routes In
            </motion.h2>

            <div className="grid gap-px bg-border md:grid-cols-2 max-w-[1000px]">
              <motion.div
                className="bg-background p-8 lg:p-10 rounded-sm"
                {...fade}
                transition={{ ...fade.transition, delay: 0.1 }}
              >
                <p className="text-[10px] font-medium tracking-[0.2em] text-muted-foreground uppercase mb-3">
                  Individual, Self-Directed
                </p>
                <h3 className="font-serif text-lg font-semibold text-foreground mb-4">
                  {programme.individualFee}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                  Immediate enrolment for a single executive, with full access
                  to all ten modules and the blueprint materials. No diagnostic
                  and no organisational sponsorship required.
                </p>
                <a
                  href={programme.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-quiet text-sm"
                  onClick={() =>
                    trackCourseCtaClick({
                      programme: programme.title,
                      url: programme.link,
                      surface: "/strategic-leadership-ai",
                      label: "Enrol as an individual",
                    })
                  }
                >
                  Enrol as an individual
                  <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </motion.div>

              <motion.div
                className="bg-background p-8 lg:p-10 rounded-sm"
                {...fade}
                transition={{ ...fade.transition, delay: 0.18 }}
              >
                <p className="text-[10px] font-medium tracking-[0.2em] text-muted-foreground uppercase mb-3">
                  Organisational and Cohort
                </p>
                <h3 className="font-serif text-lg font-semibold text-foreground mb-4">
                  Fee on request
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                  Cohort delivery, facilitated sessions and board-level
                  adaptation are scoped individually. Where development is
                  commissioned for a leadership team, structural alignment is
                  measured first.
                </p>
                <Link to="/contact" className="link-quiet text-sm">
                  Request organisational delivery and fees
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        <div className="section-divider" />

        {/* Section 7 — FAQ */}
        <section className="section-brief bg-background">
          <div className="container-brief">
            <div className="max-w-[680px]">
              <motion.p className="kicker mb-6" {...fade}>
                Common Questions
              </motion.p>
              <motion.h2
                className="heading-section mb-10"
                {...fade}
                transition={{ ...fade.transition, delay: 0.1 }}
              >
                What Enrollees Ask
              </motion.h2>

              <motion.div
                className="space-y-0"
                {...fade}
                transition={{ ...fade.transition, delay: 0.15 }}
              >
                <details name="ai-faq" className="border-b border-border py-4">
                  <summary className="cursor-pointer font-serif text-lg text-foreground marker:text-foreground">
                    How many CPD points does the programme carry?
                  </summary>
                  <p className="mt-3 leading-relaxed text-muted-foreground">
                    Completion of the wider accredited pathway confers 66 CPD points. The
                    programme is accredited by The CPD Standards Office (Provider Number 50838) as
                    Accredited CPD Activity for the 2025–2026 period. Participants are responsible
                    for recording CPD with their own professional body.
                  </p>
                </details>

                <details name="ai-faq" className="border-b border-border py-4">
                  <summary className="cursor-pointer font-serif text-lg text-foreground marker:text-foreground">
                    Is the programme delivered live or self-paced?
                  </summary>
                  <p className="mt-3 leading-relaxed text-muted-foreground">
                    The individual route is self-paced online, with immediate access to all ten
                    modules and downloadable working documents. Organisational cohorts can include
                    facilitated sessions and board-level adaptation; those are scoped and scheduled
                    on request.
                  </p>
                </details>

                <details name="ai-faq" className="border-b border-border py-4">
                  <summary className="cursor-pointer font-serif text-lg text-foreground marker:text-foreground">
                    What happens after I enrol?
                  </summary>
                  <p className="mt-3 leading-relaxed text-muted-foreground">
                    Enrolment is handled through the Thinkific learning platform. You will receive
                    login credentials and immediate access to the first module. You can progress
                    through the ten modules at your own pace, complete the capstone AI Leadership
                    Blueprint™ Canvas, and download your certificate on completion.
                  </p>
                </details>

                <details name="ai-faq" className="border-b border-border py-4">
                  <summary className="cursor-pointer font-serif text-lg text-foreground marker:text-foreground">
                    Can a board or executive team take this together?
                  </summary>
                  <p className="mt-3 leading-relaxed text-muted-foreground">
                    Yes. The organisational route is designed for cohorts and can be adapted to a
                    board or senior team. Fees and delivery structure are agreed on request; where
                    the development is part of a wider advisory mandate, structural alignment is
                    measured first.
                  </p>
                </details>

                <details name="ai-faq" className="border-b border-border py-4">
                  <summary className="cursor-pointer font-serif text-lg text-foreground marker:text-foreground">
                    What do I receive on completion?
                  </summary>
                  <p className="mt-3 leading-relaxed text-muted-foreground">
                    A completed AI Leadership Blueprint™ Canvas, a board-ready governance framework
                    for AI adoption, and a CPD certificate confirming 66 points for the accredited
                    pathway. Individual module completion records are also available within the
                    learning platform.
                  </p>
                </details>
              </motion.div>
            </div>
          </div>
        </section>

        <div className="section-divider" />

        {/* Section 8 — CTA */}
        <section className="section-brief bg-background">
          <div className="container-brief">
            <div className="max-w-[680px]">
              <motion.div className="space-y-6" {...fade}>
                <p className="font-serif text-foreground font-medium text-xl leading-relaxed">
                  Programme enquiries are handled confidentially.
                </p>
                <div className="flex flex-wrap gap-8 pt-2">
                  <Link to="/contact" className="link-quiet">
                    Discuss Executive Alignment
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                  <Link to="/courses" className="link-quiet">
                    View all programmes
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default StrategicLeadershipAI;
