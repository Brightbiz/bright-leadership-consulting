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
import {
  CPD_PROVIDER_STATEMENT,
  CPD_PARTICIPANT_STATEMENT,
  CPD_SCOPE_STATEMENT,
  CPD_CERTIFICATE_SCOPE_NOTE,
} from "@/data/accreditation";
import { trackCourseCtaClick, trackProgrammeView } from "@/lib/analytics";

const fade = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true } as const,
  transition: { duration: 0.7, ease: "easeOut" as const },
};

const PROGRAMME_TITLE = "Strategic Productivity and Peak Performance Accelerator";
const programme = programmes.find((p) => p.title === PROGRAMME_TITLE)!;

const audience = [
  {
    title: "Chief executives and executive directors",
    description:
      "Those whose judgement is not in question but whose available attention has become the binding constraint.",
  },
  {
    title: "Senior leaders carrying delivery load",
    description:
      "Those accountable for output across multiple functions with no further capacity to add.",
  },
  {
    title: "Leadership teams with throughput problems",
    description:
      "Teams where decisions are sound but slow, and where effort no longer converts into progress.",
  },
];

const outcomes = [
  "A diagnosis of where executive capacity is actually being consumed",
  "A designed personal operating system for decisions, attention and recovery",
  "Team throughput measures that distinguish activity from progress",
  "A defensible position on what the leader will no longer do",
];

const structure = [
  "Modular programme progressing from performance diagnosis to system design",
  "Self-directed online delivery with downloadable working documents",
  "Cohort and 1:1 delivery available for leadership teams",
  "20–25 accredited CPD hours on completion",
];

const StrategicProductivity = () => {
  useEffect(() => {
    trackProgrammeView({
      programme: PROGRAMME_TITLE,
      surface: "/strategic-productivity-peak-performance",
    });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <ProgrammeMeta
        programmeTitle={PROGRAMME_TITLE}
        title="Strategic Productivity & Peak Performance — 20–25 CPD Hours"
        description="An executive programme on performance diagnostics, attention management and team throughput for senior leaders. 20–25 accredited CPD hours. One-time fee of £499."
        path="/strategic-productivity-peak-performance"
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
                Strategic Productivity and Peak Performance Accelerator
              </motion.h1>

              <motion.div
                className="space-y-6"
                {...fade}
                transition={{ ...fade.transition, delay: 0.2 }}
              >
                <p className="text-lg leading-relaxed text-muted-foreground">
                  A programme for senior leaders whose constraint is capacity
                  rather than capability: where the decisions are correct, the
                  intent is clear, and output still fails to follow.
                </p>
                <p className="text-lg leading-relaxed text-muted-foreground">
                  Executive performance treated as a designed system, not as
                  personal discipline.
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
                {CPD_PROVIDER_STATEMENT} {CPD_SCOPE_STATEMENT}
              </motion.p>
              <motion.p
                className="body-brief mt-6"
                {...fade}
                transition={{ ...fade.transition, delay: 0.2 }}
              >
                {CPD_PARTICIPANT_STATEMENT} {CPD_CERTIFICATE_SCOPE_NOTE}
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
                  {programme.individualFee} — one-time
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground mb-6">
                  Immediate enrolment for a single executive at a one-time fee
                  of {programme.individualFee}, with full access to all modules
                  and working documents. No diagnostic and no organisational
                  sponsorship required.
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
                      surface: "/strategic-productivity-peak-performance",
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
                <p className="text-sm leading-relaxed text-muted-foreground mb-6">
                  Cohort and 1:1 delivery for a leadership team is scoped
                  individually. Where development is commissioned for a team,
                  structural alignment is measured first.
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
                {programme.description} Where throughput is limited by structure
                rather than by individual capacity, measurement precedes
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

export default StrategicProductivity;
