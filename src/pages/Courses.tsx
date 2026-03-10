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

const executiveProgrammes = [
  {
    title: "Executive Leadership Mastery",
    subtitle: "Flagship 33-Module Programme",
    description:
      "Our comprehensive 33-module pathway integrating seven leadership disciplines into a single CPD-accredited development architecture. 80+ hours of structured content. 66 CPD points.",
    features: [
      "7 Integrated Leadership Disciplines",
      "80+ Hours of Executive Content",
      "66 CPD Points Accredited",
      "Self-Directed or Cohort-Based",
    ],
    link: "/executive-leadership-mastery",
    internal: true,
  },
  {
    title: "Strategic Leadership in the Age of AI",
    subtitle: "AI Governance & Leadership Framework",
    description:
      "Artificial intelligence is reshaping industries and redefining how organisations compete. This programme equips senior leaders with the knowledge, governance frameworks, and strategic clarity needed to lead confidently in this new environment.",
    features: [
      "AI Strategic Implications Assessment",
      "Governance Framework Development",
      "AI Leadership Blueprint Creation",
      "Responsible Adoption Protocols",
    ],
    link: "#", // Placeholder - to be updated when programme page created
    internal: false,
    comingSoon: false,
  },
  {
    title: "Corporate Retreats",
    subtitle: "2–3 Day Facilitated Engagements",
    description:
      "Intensive facilitated engagements for leadership teams and boards. Diagnostic-led design. Outcome-focused facilitation. Confidential delivery for immediate, intensive strategic alignment.",
    features: [
      "Diagnostic-Led Programme Design",
      "Board & Leadership Team Focus",
      "Outcome-Focused Facilitation",
      "Confidential Engagement Protocol",
    ],
    link: "/contact",
    internal: true,
  },
];

const Courses = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownloadWorkbook = async () => {
    setIsGenerating(true);
    try {
      const pdfBytes = await generateStrategicLeadershipPDF();
      downloadStrategicLeadershipPDF(pdfBytes);
    } catch {
      toast({ title: "Download failed", description: "Please try again.", variant: "destructive" });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Executive Programmes | Bright Leadership Consulting"
        description="CPD-accredited executive leadership programmes for senior professionals. Flagship development pathways, AI governance, and facilitated corporate retreats."
        path="/courses"
      />
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
                We deliver through three integrated programme streams—each designed
                for senior leaders who require more than content. They require
                transformation with accountability.
              </motion.p>
            </div>
          </div>
        </section>

        <div className="section-divider" />

        {/* Section 2 — Programme Cards */}
        <section className="section-brief bg-background">
          <div className="container-brief">
            <motion.p className="kicker mb-6" {...fade}>
              Programme Portfolio
            </motion.p>

            <motion.h2
              className="heading-section mb-4 max-w-[720px]"
              {...fade}
              transition={{ ...fade.transition, delay: 0.1 }}
            >
              Three Pathways. One Objective.
            </motion.h2>

            <motion.p
              className="body-brief max-w-[720px] mb-16"
              {...fade}
              transition={{ ...fade.transition, delay: 0.15 }}
            >
              Each programme is grounded in the Executive Alignment Index—our
              proprietary diagnostic that measures structural leadership health
              before intervention begins.
            </motion.p>

            <div className="max-w-[720px] space-y-0">
              {executiveProgrammes.map((programme, i) => (
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
                    {programme.internal ? (
                      <span className="text-xs font-medium text-muted-foreground/60 uppercase tracking-wider">
                        Internal
                      </span>
                    ) : (
                      <span className="text-xs font-medium text-accent uppercase tracking-wider">
                        Programme
                      </span>
                    )}
                  </div>

                  <p className="text-sm font-medium text-accent mb-3">
                    {programme.subtitle}
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

                  {programme.internal ? (
                    <Link to={programme.link} className="link-quiet text-sm">
                      View Programme Details
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  ) : (
                    <a
                      href={programme.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-quiet text-sm"
                    >
                      Enquire Confidentially
                      <ArrowRight className="h-3 w-3" />
                    </a>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <div className="section-divider" />

        {/* Section 3 — Positioning Statement */}
        <section className="section-brief bg-background">
          <div className="container-brief">
            <div className="max-w-[720px]">
              <motion.div className="space-y-6" {...fade}>
                <p className="font-serif text-foreground font-medium text-xl leading-relaxed">
                  We are not a training provider.
                </p>

                <p className="body-brief">
                  We are an executive programme facilitator and strategic advisory
                  partner to senior leaders, boards, and Chief People Officers. Our
                  programmes are designed for leaders who operate at the intersection
                  of complexity and consequence.
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
