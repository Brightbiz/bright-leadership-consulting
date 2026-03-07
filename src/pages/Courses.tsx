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

const individualCourses = [
  {
    title: "Transformational Leadership Skills",
    description: "Cross-team collaboration, change leadership, and the ability to inspire collective action.",
    link: "https://bright-leadership-consulting.thinkific.com/courses/transformational-leadership",
  },
  {
    title: "Peak Performance Accelerator",
    description: "Strategic decision-making, operational efficiency, and sustained personal productivity.",
    link: "https://bright-leadership-consulting.thinkific.com/courses/achieving-peak-performance",
  },
  {
    title: "Building Professional & Personal Value",
    description: "Client relations, strategic networking, and professional influence.",
    link: "https://bright-leadership-consulting.thinkific.com/courses/building-professional-and-personal-value",
  },
  {
    title: "Future of Work & AI-Ready Leadership",
    description: "AI integration, remote collaboration, and digital transformation.",
    link: "https://bright-leadership-consulting.thinkific.com/courses/the-future-of-work",
  },
  {
    title: "Enhanced Employability Skills",
    description: "Emotional intelligence, adaptability, and the human skills AI cannot replicate.",
    link: "https://bright-leadership-consulting.thinkific.com/courses/employability-skills-for-employees",
  },
];

const bundles = [
  {
    title: "Leadership + Transformational Bundle",
    courses: ["Advanced Leadership Development", "Transformational Leadership"],
    link: "https://bright-leadership-consulting.thinkific.com/bundles/complete-leadership-bundle",
  },
  {
    title: "Leadership Productivity Bundle",
    courses: ["Leadership", "Transformational", "Peak Performance Accelerator"],
    link: "https://bright-leadership-consulting.thinkific.com/bundles/effective-leadership-productivity-accelerator-training-bundle",
  },
  {
    title: "Effective Management Bundle",
    courses: ["Leadership", "Transformational", "Peak Performance", "Future of Work"],
    link: "https://bright-leadership-consulting.thinkific.com/bundles/effective-management-training-bundle",
  },
  {
    title: "Complete Development Bundle",
    courses: ["Advanced Leadership", "Peak Performance", "Future of Work", "Employability Skills"],
    link: "https://bright-leadership-consulting.thinkific.com/bundles/complete-training-bundle-for-transformational-leaders",
  },
  {
    title: "Ultimate Leadership Development Program",
    courses: ["All 7 Premium Courses"],
    link: "https://bright-leadership-consulting.thinkific.com/bundles/the-ultimate-leadership-development-program-for-leaders-managers",
  },
];

const Courses = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Courses | Bright Leadership Consulting"
        description="CPD-accredited leadership courses and bundles. Self-paced, flexible learning for senior professionals."
        path="/courses"
      />
      <ScrollProgress />
      <Header />

      <main>
        {/* Section 1 — Introduction */}
        <section className="pt-36 pb-24 lg:pt-44 lg:pb-32 bg-background">
          <div className="container-brief">
            <div className="max-w-[680px]">
              <motion.p className="kicker mb-6" {...fade}>
                CPD-Accredited Courses
              </motion.p>

              <motion.h1
                className="heading-hero mb-8"
                {...fade}
                transition={{ ...fade.transition, delay: 0.1 }}
              >
                Programme Catalogue
              </motion.h1>

              <motion.p
                className="text-lg leading-relaxed text-muted-foreground"
                {...fade}
                transition={{ ...fade.transition, delay: 0.2 }}
              >
                A curated selection of self-paced, CPD-accredited courses
                designed for senior professionals and high-potential leaders.
              </motion.p>
            </div>
          </div>
        </section>

        <div className="section-divider" />

        {/* Section 2 — Flagship Programme */}
        <section className="section-brief bg-background">
          <div className="container-brief">
            <div className="max-w-[680px]">
              <motion.p className="kicker mb-6" {...fade}>
                Flagship Programme
              </motion.p>

              <motion.h2
                className="heading-section mb-4"
                {...fade}
                transition={{ ...fade.transition, delay: 0.1 }}
              >
                Executive Leadership Mastery
              </motion.h2>

              <motion.div
                className="space-y-6 body-brief"
                {...fade}
                transition={{ ...fade.transition, delay: 0.15 }}
              >
                <p>
                  Our flagship 33-module programme integrating seven leadership
                  disciplines into a single accredited development pathway.
                  80+ hours of content. 66 CPD points.
                </p>

                <Link
                  to="/executive-leadership-mastery"
                  className="link-quiet"
                >
                  View Programme Prospectus
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        <div className="section-divider" />

        {/* Section 3 — Individual Courses */}
        <section className="section-brief bg-background">
          <div className="container-brief">
            <motion.p className="kicker mb-6" {...fade}>
              Individual Courses
            </motion.p>

            <motion.h2
              className="heading-section mb-4 max-w-[680px]"
              {...fade}
              transition={{ ...fade.transition, delay: 0.1 }}
            >
              Self-Paced Leadership Development
            </motion.h2>

            <motion.p
              className="body-brief max-w-[680px] mb-16"
              {...fade}
              transition={{ ...fade.transition, delay: 0.15 }}
            >
              Each course is available independently as a self-paced programme.
              All courses are CPD-accredited and include downloadable resources.
            </motion.p>

            <div className="max-w-[680px] space-y-0">
              {individualCourses.map((course, i) => (
                <motion.div
                  key={course.title}
                  className="flex gap-6 items-start py-5 border-b border-border last:border-b-0"
                  {...fade}
                  transition={{ ...fade.transition, delay: 0.1 + i * 0.05 }}
                >
                  <span className="text-sm font-medium text-muted-foreground/40 pt-0.5 w-6 shrink-0 text-right tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-serif text-base font-semibold text-foreground">
                      {course.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
                      {course.description}
                    </p>
                    <a
                      href={course.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-quiet text-sm mt-3"
                    >
                      View Course
                      <ArrowRight className="h-3 w-3" />
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <div className="section-divider" />

        {/* Section 4 — Bundles */}
        <section className="section-brief bg-background">
          <div className="container-brief">
            <motion.p className="kicker mb-6" {...fade}>
              Course Bundles
            </motion.p>

            <motion.h2
              className="heading-section mb-4 max-w-[680px]"
              {...fade}
              transition={{ ...fade.transition, delay: 0.1 }}
            >
              Combined Development Pathways
            </motion.h2>

            <motion.p
              className="body-brief max-w-[680px] mb-16"
              {...fade}
              transition={{ ...fade.transition, delay: 0.15 }}
            >
              Discounted combinations for broader development objectives.
            </motion.p>

            <div className="max-w-[680px] space-y-0">
              {bundles.map((bundle, i) => (
                <motion.a
                  key={bundle.title}
                  href={bundle.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block py-6 border-b border-border last:border-b-0 group"
                  {...fade}
                  transition={{ ...fade.transition, delay: 0.1 + i * 0.05 }}
                >
                  <h3 className="font-serif text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                    {bundle.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
                    {bundle.courses.join(" · ")}
                  </p>
                </motion.a>
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
                  For group enrolment, bespoke delivery, or programme enquiries,
                  please submit an enquiry.
                </p>

                <Link to="/contact" className="link-quiet">
                  Enquire Confidentially
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
