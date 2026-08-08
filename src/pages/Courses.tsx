import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import SEOHead from "@/components/SEOHead";
import CourseSchema from "@/components/CourseSchema";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";
import CourseJourneyMap from "@/components/CourseJourneyMap";
import ProgrammeComparisonTable from "@/components/ProgrammeComparisonTable";
import ProgrammeSelector from "@/components/ProgrammeSelector";
import CpdHoursFaq from "@/components/CpdHoursFaq";

import { programmes, facilitatedEngagement } from "@/data/programmes";
import {
  CPD_PROVIDER_STATEMENT,
  CPD_PARTICIPANT_STATEMENT,
  CPD_SCOPE_STATEMENT,
  CPD_CERTIFICATE_SCOPE_NOTE,
} from "@/data/accreditation";
import { trackCourseCtaClick } from "@/lib/analytics";

const fade = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true } as const,
  transition: { duration: 0.7, ease: "easeOut" as const },
};

const Courses = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Executive Programmes | Bright Leadership Consulting"
        description="Four CPD-accredited executive programmes in AI governance, strategic leadership, workforce transformation and executive performance."
        path="/courses"
      />
      <CourseSchema />
      <ScrollProgress />
      <Header />

      <main>
        {/* Section 1 — Introduction */}
        <section className="pt-36 pb-24 lg:pt-44 lg:pb-32 bg-background">
          <div className="container-brief">
            <div className="max-w-[720px]">
              <motion.p className="kicker mb-6" {...fade}>
                Executive Programmes
              </motion.p>

              <motion.h1
                className="heading-hero mb-8"
                {...fade}
                transition={{ ...fade.transition, delay: 0.1 }}
              >
                Structured Development for Consequential Leadership
              </motion.h1>

              <motion.p
                className="text-lg leading-relaxed text-muted-foreground"
                {...fade}
                transition={{ ...fade.transition, delay: 0.2 }}
              >
                Four CPD-accredited programmes for senior leaders who require
                more than content. Individual executives enrol directly.
                Organisations commissioning development for a leadership team
                begin with structural measurement.
              </motion.p>
            </div>
          </div>
        </section>

        <div className="section-divider" />

        {/* Section 2 — Two Pathways */}
        <section className="section-brief bg-background">
          <div className="container-brief">
            <motion.p className="kicker mb-6" {...fade}>
              Two Routes In
            </motion.p>

            <motion.h2
              className="heading-section mb-4 max-w-[720px]"
              {...fade}
              transition={{ ...fade.transition, delay: 0.1 }}
            >
              Individual Enrolment or Organisational Commissioning
            </motion.h2>

            <motion.p
              className="body-brief max-w-[720px] mb-12"
              {...fade}
              transition={{ ...fade.transition, delay: 0.15 }}
            >
              The two routes are separate. No diagnostic is required to enrol
              on a programme as an individual.
            </motion.p>

            <div className="grid gap-px bg-border md:grid-cols-2 max-w-[1000px]">
              <motion.div
                className="bg-background p-8 lg:p-10 rounded-sm"
                {...fade}
                transition={{ ...fade.transition, delay: 0.1 }}
              >
                <p className="text-[10px] font-medium tracking-[0.2em] text-muted-foreground uppercase mb-3">
                  Individual Executive
                </p>
                <h3 className="font-serif text-lg font-semibold text-foreground mb-4">
                  Select a programme and enrol directly
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                  Choose an available programme and begin immediately, or
                  request the next intake or a facilitated cohort. There is no
                  prerequisite diagnostic and no organisational sponsorship
                  requirement.
                </p>
                <a href="#programme-catalogue" className="link-quiet text-sm">
                  View All Programmes
                  <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </motion.div>

              <motion.div
                className="bg-background p-8 lg:p-10 rounded-sm"
                {...fade}
                transition={{ ...fade.transition, delay: 0.18 }}
              >
                <p className="text-[10px] font-medium tracking-[0.2em] text-muted-foreground uppercase mb-3">
                  Organisation or Board
                </p>
                <h3 className="font-serif text-lg font-semibold text-foreground mb-4">
                  Measure → Install → Sustain → Develop
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                  Where development is commissioned for a leadership team,
                  structural alignment is measured first through the Executive
                  Alignment Index™ — ensuring investment targets the right
                  gaps rather than the most visible ones.
                </p>
                <Link to="/executive-alignment-index" className="link-quiet text-sm">
                  Explore the Executive Alignment Index™
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        <div className="section-divider" />

        {/* Section 3 — Programme Portfolio */}
        <section id="programme-catalogue" className="section-brief section-pearl scroll-mt-24">
          <div className="container-brief">
            <motion.p className="kicker mb-6" {...fade}>
              Programme Portfolio
            </motion.p>

            <motion.h2
              className="heading-section mb-4 max-w-[720px]"
              {...fade}
              transition={{ ...fade.transition, delay: 0.1 }}
            >
              Four Accredited Programmes
            </motion.h2>

            <motion.p
              className="body-brief max-w-[720px] mb-16"
              {...fade}
              transition={{ ...fade.transition, delay: 0.15 }}
            >
              This is the complete programme catalogue. Where an individual
              self-directed fee is published, it is stated below. Organisational,
              cohort and facilitated delivery is scoped individually and the fee
              is confirmed on request.
            </motion.p>

            <div className="max-w-[720px] space-y-0">
              {programmes.map((programme, i) => (
                <motion.div
                  key={programme.title}
                  className="py-8 border-b border-border last:border-b-0"
                  {...fade}
                  transition={{ ...fade.transition, delay: 0.1 + i * 0.08 }}
                >
                  <div className="flex items-baseline justify-between mb-3">
                    <h3 className="font-serif text-lg font-semibold text-foreground">
                      {programme.title}
                    </h3>
                  </div>

                  <p className="text-sm font-medium text-accent mb-3">
                    {programme.subtitle}
                  </p>

                  <p className="text-sm text-muted-foreground mb-3">
                    {programme.individualFee
                      ? `Individual self-directed enrolment: ${programme.individualFee}${
                          programme.paymentPlanSummary
                            ? `, with ${programme.paymentPlanSummary}`
                            : ""
                        }. Organisational, cohort and facilitated delivery: fee on request.`
                      : "Individual and organisational fees confirmed on request."}
                    {programme.enrolmentAvailable === false &&
                      " Next intake dates confirmed on request."}
                  </p>

                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    {programme.description}
                  </p>

                  <ul className="space-y-1.5 mb-5">
                    {programme.features.map((feature) => (
                      <li
                        key={feature}
                        className="text-sm text-muted-foreground flex items-start gap-2"
                      >
                        <span className="text-accent mt-1.5 w-1 h-1 rounded-full bg-accent shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                    {programme.enrolmentAvailable === false ? (
                      <Link
                        to="/contact"
                        className="link-quiet text-sm"
                        onClick={() =>
                          trackCourseCtaClick({
                            programme: programme.title,
                            url: "/contact",
                            surface: "/courses",
                            label: "Request Availability",
                          })
                        }
                      >
                        Request Availability
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    ) : (
                      <a
                        href={programme.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link-quiet text-sm"
                        onClick={() =>
                          trackCourseCtaClick({
                            programme: programme.title,
                            url: programme.link,
                            surface: "/courses",
                            label: "View Programme & Enrol",
                          })
                        }
                      >
                        View Programme &amp; Enrol
                        <span className="sr-only"> (opens in a new tab)</span>
                        <ArrowRight className="h-3 w-3" />
                      </a>
                    )}
                    {programme.detailPage && (
                      <Link to={programme.detailPage} className="link-quiet text-sm text-muted-foreground">
                        Programme Details
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    )}
                    <Link
                      to="/contact"
                      className="text-sm text-muted-foreground underline underline-offset-4 decoration-border hover:text-foreground transition-colors"
                    >
                      Request programme fees and current availability
                    </Link>
                  </div>

                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <div className="section-divider" />

        {/* Section 3b — Comparison */}
        <section id="comparison" className="section-brief bg-background scroll-mt-24">
          <div className="container-brief">
            <motion.p className="kicker mb-6" {...fade}>
              Side by Side
            </motion.p>

            <motion.h2
              className="heading-section mb-4 max-w-[720px]"
              {...fade}
              transition={{ ...fade.transition, delay: 0.1 }}
            >
              Programme Comparison
            </motion.h2>

            <motion.p
              className="body-brief max-w-[720px] mb-12"
              {...fade}
              transition={{ ...fade.transition, delay: 0.15 }}
            >
              Structure, focus, published individual fee and current
              availability across the four programmes.
            </motion.p>

            <ProgrammeComparisonTable />
          </div>
        </section>

        <div className="section-divider" />

        {/* Section 3c — Which programme is right for me */}
        <section
          id="which-programme"
          className="section-brief section-pearl scroll-mt-24"
        >
          <div className="container-brief">
            <motion.p className="kicker mb-6" {...fade}>
              Selection
            </motion.p>

            <motion.h2
              className="heading-section mb-4 max-w-[720px]"
              {...fade}
              transition={{ ...fade.transition, delay: 0.1 }}
            >
              Which Programme Is Right For Me?
            </motion.h2>

            <motion.p
              className="body-brief max-w-[720px] mb-12"
              {...fade}
              transition={{ ...fade.transition, delay: 0.15 }}
            >
              Selection follows the constraint you are actually carrying, not
              the subject that sounds most current.
            </motion.p>

            <ProgrammeSelector />
          </div>
        </section>

        <div className="section-divider" />

        {/* Section 3d — CPD hours explained */}
        <section id="cpd-hours" className="section-brief bg-background scroll-mt-24">
          <div className="container-brief">
            <motion.p className="kicker mb-6" {...fade}>
              Accreditation
            </motion.p>

            <motion.h2
              className="heading-section mb-4 max-w-[720px]"
              {...fade}
              transition={{ ...fade.transition, delay: 0.1 }}
            >
              How CPD Hours Are Determined
            </motion.h2>

            <motion.p
              className="body-brief max-w-[720px] mb-12"
              {...fade}
              transition={{ ...fade.transition, delay: 0.15 }}
            >
              Each programme carries a stated range of accredited CPD hours. The
              range, and what completion requires, is set out below.
            </motion.p>

            <motion.p
              className="body-brief max-w-[720px] mb-6"
              {...fade}
              transition={{ ...fade.transition, delay: 0.18 }}
            >
              {CPD_PROVIDER_STATEMENT} {CPD_SCOPE_STATEMENT}
            </motion.p>

            <motion.p
              className="body-brief max-w-[720px] mb-12"
              {...fade}
              transition={{ ...fade.transition, delay: 0.2 }}
            >
              {CPD_PARTICIPANT_STATEMENT} {CPD_CERTIFICATE_SCOPE_NOTE}
            </motion.p>

            <CpdHoursFaq />

            <motion.p
              className="mt-10"
              {...fade}
              transition={{ ...fade.transition, delay: 0.24 }}
            >
              <a
                href="/downloads/programme-portfolio.pdf"
                className="link-quiet"
                download
              >
                Download the Programme Portfolio (PDF)
              </a>
              <span className="block mt-2 text-sm text-muted-foreground">
                Four programmes, accredited CPD hour ranges, fees and
                certificate terms — generated from this catalogue.
              </span>
            </motion.p>

          </div>
        </section>

        <div className="section-divider" />


        {/* Section 4 — Facilitated Engagement (not a course) */}
        <section className="section-brief bg-background">
          <div className="container-brief">
            <motion.p className="kicker mb-6" {...fade}>
              Separate From the Catalogue
            </motion.p>

            <motion.h2
              className="heading-section mb-4 max-w-[720px]"
              {...fade}
              transition={{ ...fade.transition, delay: 0.1 }}
            >
              Facilitated Organisational Engagement
            </motion.h2>

            <motion.div
              className="max-w-[720px] py-8 border-t border-border"
              {...fade}
              transition={{ ...fade.transition, delay: 0.15 }}
            >
              <h3 className="font-serif text-lg font-semibold text-foreground mb-2">
                {facilitatedEngagement.title}
              </h3>
              <p className="text-sm font-medium text-accent mb-3">
                {facilitatedEngagement.subtitle}
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                {facilitatedEngagement.description} This is a commissioned
                engagement rather than a programme, and is not available for
                individual enrolment.
              </p>
              <ul className="space-y-1.5 mb-5">
                {facilitatedEngagement.features.map((feature) => (
                  <li
                    key={feature}
                    className="text-sm text-muted-foreground flex items-start gap-2"
                  >
                    <span className="text-accent mt-1.5 w-1 h-1 rounded-full bg-accent shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link to="/contact" className="link-quiet text-sm">
                Enquire Regarding a Facilitated Engagement
                <ArrowRight className="h-3 w-3" />
              </Link>
            </motion.div>
          </div>
        </section>

        <div className="section-divider" />

        {/* Section 5 — Course Journey Map */}
        <section className="section-brief section-pearl">
          <div className="container-brief">
            <motion.p className="kicker mb-6" {...fade}>
              Programme Architecture
            </motion.p>
            <motion.h2
              className="heading-section mb-4 max-w-[720px]"
              {...fade}
              transition={{ ...fade.transition, delay: 0.1 }}
            >
              Strategic Leadership in the Age of AI — Journey Map
            </motion.h2>
            <motion.p
              className="body-brief max-w-[720px] mb-12"
              {...fade}
              transition={{ ...fade.transition, delay: 0.15 }}
            >
              Six stages. Ten modules. One AI Leadership Blueprint™.
            </motion.p>
            <CourseJourneyMap />
          </div>
        </section>

        <div className="section-divider" />

        <section className="section-brief bg-background">
          <div className="container-brief">
            <div className="max-w-[720px]">
              <motion.div className="space-y-6" {...fade}>
                <p className="font-serif text-foreground font-medium text-xl leading-relaxed">
                  We are not a conventional training provider.
                </p>

                <p className="body-brief">
                  Our programmes connect executive development to the strategic,
                  governance and organisational conditions in which leadership
                  decisions are actually made. We work as an executive programme
                  facilitator and advisory partner to senior leaders, boards and
                  Chief People Officers — for leaders operating at the
                  intersection of complexity and consequence.
                </p>


                <p className="body-brief text-muted-foreground">
                  Programme enquiries are handled confidentially.
                </p>

                <Link to="/contact" className="link-quiet">
                  Initiate a Confidential Conversation
                  <ArrowRight className="h-3.5 w-3.5" />
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

export default Courses;
