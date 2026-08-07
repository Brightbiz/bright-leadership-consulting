import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import ProgrammeMeta from "@/components/ProgrammeMeta";
import CourseSchema from "@/components/CourseSchema";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";
import { programmes } from "@/data/programmes";
import { trackProgrammeView } from "@/lib/analytics";

const fade = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true } as const,
  transition: { duration: 0.7, ease: "easeOut" as const },
};

const PROGRAMME_TITLE = "The Future of Work";
const programme = programmes.find((p) => p.title === PROGRAMME_TITLE)!;

const audience = [
  {
    title: "Chief executives and executive directors",
    description:
      "Those answerable for an operating model that was designed for a different set of working assumptions.",
  },
  {
    title: "Chief people officers and HR directors",
    description:
      "Those required to convert workforce policy into structural decisions the board can defend.",
  },
  {
    title: "Divisional and functional leaders",
    description:
      "Those carrying delivery accountability across distributed, hybrid or restructured teams.",
  },
];

const outcomes = [
  "A written workforce strategy position aligned to the operating model",
  "A defensible hybrid and distributed working structure, not a policy statement",
  "An assessment of where talent loss originates structurally rather than culturally",
  "Organisational design principles that survive board scrutiny",
];

const structure = [
  "Modular programme progressing from workforce diagnosis to organisational design",
  "Self-directed online delivery with downloadable working documents",
  "Cohort and facilitated delivery available for leadership teams",
  "Accredited CPD Activity as part of the wider accredited pathway",
];

const FutureOfWork = () => {
  useEffect(() => {
    trackProgrammeView({
      programme: PROGRAMME_TITLE,
      surface: "/future-of-work",
    });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <ProgrammeMeta
        programmeTitle={PROGRAMME_TITLE}
        title="The Future of Work | Bright Leadership Consulting"
        description="A board-level programme on workforce transformation: hybrid and distributed structures, talent retention and organisational design. Next intake dates confirmed on request."
        path="/future-of-work"
      />
      <CourseSchema programmeTitle={PROGRAMME_TITLE} />
      <ScrollProgress />
      <Header />

      <main>
        {/* Introduction */}
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
                The Future of Work
              </motion.h1>

              <motion.div
                className="space-y-6"
                {...fade}
                transition={{ ...fade.transition, delay: 0.2 }}
              >
                <p className="text-lg leading-relaxed text-muted-foreground">
                  A programme for senior leaders whose constraint is the
                  operating model itself: how work is distributed, where
                  authority sits, and why capable people leave organisations
                  that appear to be functioning.
                </p>
                <p className="text-lg leading-relaxed text-muted-foreground">
                  Workforce transformation treated as organisational design,
                  not as employee engagement.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        <div className="section-divider" />

        {/* Audience */}
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

            <div className="grid gap-px bg-border md:grid-cols-3">
              {audience.map((a, i) => (
                <motion.div
                  key={a.title}
                  className="bg-background p-8 lg:p-10 rounded-sm"
                  {...fade}
                  transition={{ ...fade.transition, delay: 0.1 + i * 0.08 }}
                >
                  <h3 className="font-serif text-base font-semibold text-foreground mb-3">
                    {a.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {a.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <div className="section-divider" />

        {/* Outcomes */}
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

        {/* Structure */}
        <section className="section-brief section-pearl">
          <div className="container-brief">
            <div className="max-w-[680px]">
              <motion.p className="kicker mb-6" {...fade}>
                Programme Architecture
              </motion.p>
              <motion.h2
                className="heading-section mb-4"
                {...fade}
                transition={{ ...fade.transition, delay: 0.1 }}
              >
                Structure and Format
              </motion.h2>
              <motion.div
                className="space-y-1.5 border-l-2 border-border pl-6 mt-10"
                {...fade}
                transition={{ ...fade.transition, delay: 0.15 }}
              >
                {structure.map((s) => (
                  <p key={s} className="text-sm text-muted-foreground leading-relaxed">
                    {s}
                  </p>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        <div className="section-divider" />

        {/* Accreditation */}
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

        {/* Availability and routes */}
        <section className="section-brief section-pearl">
          <div className="container-brief">
            <motion.p className="kicker mb-6" {...fade}>
              Availability and Delivery
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
                  Next intake on request
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground mb-6">
                  The individual route is not currently open for direct
                  enrolment. Intake dates are confirmed on enquiry, and
                  enquiries are handled confidentially.
                </p>
                <Link to="/contact" className="link-quiet text-sm">
                  Request availability
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
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
                <p className="text-sm leading-relaxed text-muted-foreground mb-6">
                  Cohort delivery and board-level adaptation are scoped
                  individually. Where development is commissioned for a
                  leadership team, structural alignment is measured first.
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

        {/* Related */}
        <section className="section-brief bg-background">
          <div className="container-brief">
            <div className="max-w-[680px]">
              <motion.p className="kicker mb-6" {...fade}>
                Sequence
              </motion.p>
              <motion.h2
                className="heading-section mb-6"
                {...fade}
                transition={{ ...fade.transition, delay: 0.1 }}
              >
                Where This Sits
              </motion.h2>
              <motion.p
                className="body-brief mb-8"
                {...fade}
                transition={{ ...fade.transition, delay: 0.15 }}
              >
                {programme.description} Where the question is whether the
                operating model is the constraint at all, measurement precedes
                development.
              </motion.p>
              <motion.div
                className="flex flex-wrap gap-6"
                {...fade}
                transition={{ ...fade.transition, delay: 0.2 }}
              >
                <Link to="/executive-alignment-index" className="link-quiet text-sm">
                  Explore the Executive Alignment Index™
                  <ArrowRight className="h-3 w-3" />
                </Link>
                <Link to="/courses" className="link-quiet text-sm">
                  Compare all programmes
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default FutureOfWork;
