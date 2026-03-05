import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
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

const disciplines = [
  {
    title: "Advanced Leadership Development",
    description: "Strategic leadership frameworks for complex organisational environments.",
  },
  {
    title: "Transformational Leadership",
    description: "Leading change, building coalitions, and inspiring collective action.",
  },
  {
    title: "Peak Performance Accelerator",
    description: "Decision-making, operational efficiency, and sustained personal productivity.",
  },
  {
    title: "Building Professional & Personal Value",
    description: "Client relations, strategic networking, and professional influence.",
  },
  {
    title: "Future of Work & AI-Ready Leadership",
    description: "Navigating AI integration, digital transformation, and distributed teams.",
  },
  {
    title: "Enhanced Employability Skills",
    description: "Emotional intelligence, adaptability, and the human skills AI cannot replicate.",
  },
  {
    title: "Executive Presence & Communication",
    description: "Board-level communication, stakeholder management, and executive gravitas.",
  },
];

const tiers = [
  {
    name: "Self-Directed Executive Programme",
    description: "Complete programme access. Master the full executive curriculum at your own pace.",
    inclusions: [
      "All 33 modules (80+ hours)",
      "66 CPD points upon completion",
      "Downloadable workbooks and templates",
      "Case studies and action plans",
      "Certificate of completion",
      "Lifetime access to materials",
    ],
    cta: "Begin Your Programme",
    link: "https://bright-leadership-consulting.thinkific.com/courses/new-executive-leadership-mastery-program",
  },
  {
    name: "Cohort-Based Development",
    description: "Facilitated cohort sessions and structured peer learning alongside the full curriculum.",
    inclusions: [
      "Everything in Self-Directed",
      "6 live facilitated sessions",
      "Peer learning community",
      "Monthly Q&A with facilitators",
      "Cohort accountability partners",
      "Priority email support",
    ],
    cta: "Enquire About Availability",
    link: "/contact",
  },
  {
    name: "1:1 Advisory & Development",
    description: "Dedicated advisory support with personalised development planning.",
    inclusions: [
      "Everything in Cohort-Based",
      "6 private 1:1 advisory sessions",
      "360-degree leadership diagnostic",
      "Personalised development plan",
      "Direct access to your advisor",
      "Executive network introductions",
    ],
    cta: "Enquire About Availability",
    link: "/contact",
  },
];

const ExecutiveLeadershipMastery = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Executive Leadership Mastery | Bright Leadership"
        description="CPD-accredited 33-module executive programme. 80+ hours, 66 CPD points. Seven integrated disciplines for senior leaders and board-level executives."
        path="/executive-leadership-mastery"
      />
      <ScrollProgress />
      <Header />

      <main>
        {/* Section 1 — Introduction */}
        <section className="pt-36 pb-24 lg:pt-44 lg:pb-32 bg-background">
          <div className="container-brief">
            <div className="max-w-[680px]">
              <motion.p className="kicker mb-6" {...fade}>
                CPD-Accredited Programme
              </motion.p>

              <motion.h1
                className="heading-hero mb-8"
                {...fade}
                transition={{ ...fade.transition, delay: 0.1 }}
              >
                Executive Leadership Mastery
              </motion.h1>

              <motion.div
                className="space-y-6 body-brief"
                {...fade}
                transition={{ ...fade.transition, delay: 0.2 }}
              >
                <p className="text-lg leading-relaxed text-muted-foreground">
                  A structured 33-module programme designed for senior leaders
                  and high-potential executives who require a comprehensive,
                  accredited development pathway.
                </p>

                <p className="text-lg leading-relaxed text-muted-foreground">
                  80+ hours of content. 66 CPD points. Seven integrated disciplines.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        <div className="section-divider" />

        {/* Section 2 — Seven Disciplines */}
        <section className="section-brief bg-background">
          <div className="container-brief">
            <motion.p className="kicker mb-6" {...fade}>
              Programme Structure
            </motion.p>

            <motion.h2
              className="heading-section mb-4 max-w-[680px]"
              {...fade}
              transition={{ ...fade.transition, delay: 0.1 }}
            >
              Seven Leadership Disciplines
            </motion.h2>

            <motion.p
              className="body-brief max-w-[680px] mb-16"
              {...fade}
              transition={{ ...fade.transition, delay: 0.15 }}
            >
              The programme integrates seven leadership disciplines into a
              single, coherent development pathway. Each discipline comprises
              multiple modules with case studies, exercises, and structured
              reflection.
            </motion.p>

            <div className="max-w-[680px] space-y-0">
              {disciplines.map((discipline, i) => (
                <motion.div
                  key={discipline.title}
                  className="flex gap-6 items-start py-5 border-b border-border last:border-b-0"
                  {...fade}
                  transition={{ ...fade.transition, delay: 0.1 + i * 0.05 }}
                >
                  <span className="text-sm font-medium text-muted-foreground/40 pt-0.5 w-6 shrink-0 text-right tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-serif text-base font-semibold text-foreground">
                      {discipline.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
                      {discipline.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <div className="section-divider" />

        {/* Section 3 — Programme Inclusions */}
        <section className="section-brief bg-background">
          <div className="container-brief">
            <div className="max-w-[680px]">
              <motion.p className="kicker mb-6" {...fade}>
                Programme Detail
              </motion.p>

              <motion.h2
                className="heading-section mb-4"
                {...fade}
                transition={{ ...fade.transition, delay: 0.1 }}
              >
                Programme Inclusions
              </motion.h2>

              <motion.div
                className="space-y-1.5 border-l-2 border-border pl-6 mt-10"
                {...fade}
                transition={{ ...fade.transition, delay: 0.15 }}
              >
                <p>33 comprehensive modules across 7 disciplines</p>
                <p>80+ hours of structured executive content</p>
                <p>66 CPD points upon completion</p>
                <p>Downloadable workbooks, templates and action plans</p>
                <p>Real-world capstone project</p>
                <p>Flexible self-paced learning</p>
              </motion.div>
            </div>
          </div>
        </section>

        <div className="section-divider" />

        {/* Section 4 — Engagement Tiers */}
        <section className="section-brief bg-background">
          <div className="container-brief">
            <motion.p className="kicker mb-6" {...fade}>
              Engagement Options
            </motion.p>

            <motion.h2
              className="heading-section mb-4 max-w-[680px]"
              {...fade}
              transition={{ ...fade.transition, delay: 0.1 }}
            >
              Three Levels of Engagement
            </motion.h2>

            <motion.p
              className="body-brief max-w-[680px] mb-16"
              {...fade}
              transition={{ ...fade.transition, delay: 0.15 }}
            >
              All tiers include the complete 33-module curriculum and CPD
              accreditation. Select the level of advisory support appropriate
              to your development objectives.
            </motion.p>

            <div className="grid md:grid-cols-3 gap-px bg-border max-w-[1100px]">
              {tiers.map((tier, i) => (
                <motion.div
                  key={tier.name}
                  className="bg-background p-8 lg:p-10 flex flex-col"
                  {...fade}
                  transition={{ ...fade.transition, delay: 0.1 + i * 0.08 }}
                >
                  <h3 className="font-serif text-lg font-semibold text-foreground mb-3">
                    {tier.name}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-8">
                    {tier.description}
                  </p>

                  <div className="space-y-2 mb-10 flex-grow">
                    {tier.inclusions.map((item) => (
                      <p key={item} className="text-sm text-muted-foreground leading-relaxed">
                        {item}
                      </p>
                    ))}
                  </div>

                  {tier.link.startsWith("http") ? (
                    <a
                      href={tier.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-quiet text-sm"
                    >
                      {tier.cta}
                      <ArrowRight className="h-3.5 w-3.5" />
                    </a>
                  ) : (
                    <Link to={tier.link} className="link-quiet text-sm">
                      {tier.cta}
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <div className="section-divider" />

        {/* Section 5 — CTA */}
        <section className="section-brief bg-background">
          <div className="container-brief">
            <div className="max-w-[680px]">
              <motion.div className="space-y-6" {...fade}>
                <p className="font-serif text-foreground font-medium text-xl leading-relaxed">
                  Programme enquiries are handled confidentially.
                </p>

                <p className="body-brief">
                  For availability, group enrolment, or bespoke delivery,
                  please submit an enquiry.
                </p>

                <div className="flex flex-wrap gap-8 pt-2">
                  <Link to="/contact" className="link-quiet">
                    Enquire Confidentially
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                  <Link to="/courses" className="link-quiet">
                    View All Courses
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

export default ExecutiveLeadershipMastery;
