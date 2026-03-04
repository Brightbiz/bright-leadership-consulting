import SEOHead from "@/components/SEOHead";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";
import { Link } from "react-router-dom";
import { ArrowRight, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    discount: "15% OFF",
    link: "https://bright-leadership-consulting.thinkific.com/bundles/complete-leadership-bundle",
  },
  {
    title: "Leadership Productivity Bundle",
    courses: ["Leadership", "Transformational", "Peak Performance Accelerator"],
    discount: "15% OFF",
    link: "https://bright-leadership-consulting.thinkific.com/bundles/effective-leadership-productivity-accelerator-training-bundle",
  },
  {
    title: "Effective Management Bundle",
    courses: ["Leadership", "Transformational", "Peak Performance", "Future of Work"],
    discount: "15% OFF",
    link: "https://bright-leadership-consulting.thinkific.com/bundles/effective-management-training-bundle",
  },
  {
    title: "Complete Training Bundle",
    courses: ["Advanced Leadership", "Peak Performance", "Future of Work", "Employability Skills"],
    discount: "15% OFF",
    popular: true,
    link: "https://bright-leadership-consulting.thinkific.com/bundles/complete-training-bundle-for-transformational-leaders",
  },
  {
    title: "Ultimate Leadership Development Program",
    courses: ["All 7 Premium Courses"],
    discount: "BEST VALUE",
    link: "https://bright-leadership-consulting.thinkific.com/bundles/the-ultimate-leadership-development-program-for-leaders-managers",
  },
];

const Courses = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Courses — CPD-Accredited Leadership Development"
        description="CPD-accredited leadership courses and bundles. Self-paced, flexible learning for senior professionals."
        path="/courses"
      />
      <ScrollProgress />
      <Header />

      <main>
        {/* Hero */}
        <section className="section-brief pt-32 pb-16">
          <div className="container-brief">
            <div className="prose-narrow">
              <p className="kicker">CPD-Accredited Courses</p>
              <h1 className="heading-hero">
                Leadership Development
                <span className="block text-secondary mt-2">Programme Catalogue</span>
              </h1>
              <p className="body-brief mt-8">
                A curated selection of self-paced, CPD-accredited courses
                designed for senior professionals and high-potential leaders.
              </p>
            </div>
          </div>
        </section>

        <div className="section-divider" />

        {/* Flagship Programme Callout */}
        <section className="section-brief">
          <div className="container-brief">
            <div className="prose-narrow">
              <div className="flex items-start gap-4 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/10 shrink-0 mt-1">
                  <Crown className="h-5 w-5 text-secondary" />
                </div>
                <div>
                  <h2 className="heading-section">Executive Leadership Mastery Programme</h2>
                  <p className="body-brief mt-4">
                    Our flagship 33-module programme integrating seven leadership disciplines
                    into a single accredited development pathway. 80+ hours of content. 66 CPD points.
                  </p>
                  <div className="mt-6">
                    <Button variant="outline" className="border-primary/20" asChild>
                      <Link to="/executive-leadership-mastery">
                        View Programme Prospectus
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="section-divider" />

        {/* Individual Courses */}
        <section className="section-brief">
          <div className="container-brief">
            <div className="prose-narrow">
              <h2 className="heading-section">Individual Courses</h2>
              <p className="body-brief mt-6">
                Each course is available independently as a self-paced programme.
                All courses are CPD-accredited and include downloadable resources.
              </p>
            </div>

            <div className="prose-narrow mt-12">
              <div className="space-y-6">
                {individualCourses.map((course, index) => (
                  <div key={course.title} className="flex gap-6 items-start">
                    <span className="text-sm font-medium text-muted-foreground/50 pt-0.5 w-6 shrink-0 text-right">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="border-l border-border/60 pl-6 pb-2 flex-1">
                      <h3 className="text-base font-semibold text-foreground">{course.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                        {course.description}
                      </p>
                      <a
                        href={course.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-secondary hover:text-secondary/80 transition-colors mt-2"
                      >
                        View Course
                        <ArrowRight className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className="section-divider" />

        {/* Bundles */}
        <section className="section-brief">
          <div className="container-brief">
            <div className="prose-narrow">
              <h2 className="heading-section">Course Bundles</h2>
              <p className="body-brief mt-6">
                Discounted combinations for broader development objectives.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12 max-w-[1140px]">
              {bundles.map((bundle) => (
                <a
                  key={bundle.title}
                  href={bundle.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`block rounded-2xl border bg-card p-6 transition-colors hover:border-secondary/30 ${
                    bundle.popular ? "border-secondary/40" : "border-border/50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-foreground text-sm leading-snug pr-3">
                      {bundle.title}
                    </h3>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full shrink-0 ${
                      bundle.popular
                        ? "bg-secondary/10 text-secondary"
                        : "bg-muted text-muted-foreground"
                    }`}>
                      {bundle.discount}
                    </span>
                  </div>
                  <ul className="space-y-1.5">
                    {bundle.courses.map((course) => (
                      <li key={course} className="text-sm text-muted-foreground">
                        {course}
                      </li>
                    ))}
                  </ul>
                </a>
              ))}
            </div>
          </div>
        </section>

        <div className="section-divider" />

        {/* CTA */}
        <section className="section-brief">
          <div className="container-brief">
            <div className="prose-narrow text-center mx-auto">
              <h2 className="heading-section">Further Information</h2>
              <p className="body-brief mt-6">
                For group enrolment, bespoke delivery, or programme enquiries,
                please submit a confidential enquiry.
              </p>
              <div className="mt-10">
                <Button variant="outline" className="border-primary/20" asChild>
                  <Link to="/contact">Enquire Confidentially</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Courses;
