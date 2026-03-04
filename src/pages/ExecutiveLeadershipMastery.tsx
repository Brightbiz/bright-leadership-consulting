import SEOHead from "@/components/SEOHead";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";
import { Link } from "react-router-dom";
import { Check, Clock, Crown, Users, User, ArrowRight, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const programmeHighlights = [
  "33 comprehensive modules across 7 disciplines",
  "80+ hours of structured executive content",
  "66 CPD points upon completion",
  "Downloadable workbooks, templates and action plans",
  "Real-world capstone project",
  "Flexible self-paced learning",
];

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
    name: "Self-Directed Programme",
    icon: User,
    price: 1297,
    originalPrice: 1497,
    installments: 3,
    description: "Master the full executive curriculum at your own pace with complete programme access.",
    features: [
      "All 33 modules (80+ hours)",
      "66 CPD points upon completion",
      "Downloadable workbooks & templates",
      "Case studies & action plans",
      "Certificate of completion",
      "Lifetime access to materials",
    ],
    popular: true,
    cta: "Begin Your Programme",
    link: "https://bright-leadership-consulting.thinkific.com/courses/new-executive-leadership-mastery-program",
  },
  {
    name: "Cohort-Based Development",
    icon: Users,
    price: 1497,
    originalPrice: 1797,
    description: "Facilitated cohort sessions and structured peer learning.",
    features: [
      "Everything in Self-Directed",
      "6 live facilitated sessions",
      "Peer learning community",
      "Monthly Q&A with facilitators",
      "Cohort accountability partners",
      "Priority email support",
    ],
    popular: false,
    limited: true,
    cta: "Enquire About Availability",
    link: "/contact",
  },
  {
    name: "1:1 Advisory & Development",
    icon: Crown,
    price: 2197,
    originalPrice: 2997,
    description: "Dedicated advisory support with personalised development planning.",
    features: [
      "Everything in Cohort-Based",
      "6 private 1:1 advisory sessions",
      "360° leadership diagnostic",
      "Personalised development plan",
      "Direct access to your advisor",
      "Executive network introductions",
    ],
    popular: false,
    limited: true,
    cta: "Enquire About Availability",
    link: "/contact",
  },
];

const ExecutiveLeadershipMastery = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Executive Leadership Mastery Programme"
        description="CPD-accredited 33-module executive programme. 80+ hours, 66 CPD points. Develop the leadership capabilities required at senior and board level."
        path="/executive-leadership-mastery"
      />
      <ScrollProgress />
      <Header />

      <main>
        {/* Hero */}
        <section className="section-brief pt-32 pb-16">
          <div className="container-brief">
            <div className="prose-narrow">
              <p className="kicker">CPD-Accredited Programme</p>
              <h1 className="heading-hero">
                Executive Leadership
                <span className="block text-secondary mt-2">Mastery Programme</span>
              </h1>
              <p className="body-brief mt-8">
                A structured 33-module programme designed for senior leaders and high-potential
                executives who require a comprehensive, accredited development pathway.
              </p>
              <p className="body-brief mt-4">
                80+ hours of content. 66 CPD points. Seven integrated disciplines.
              </p>
            </div>
          </div>
        </section>

        <div className="section-divider" />

        {/* Programme Overview */}
        <section className="section-brief">
          <div className="container-brief">
            <div className="prose-narrow">
              <h2 className="heading-section">Programme Structure</h2>
              <p className="body-brief mt-6">
                The programme integrates seven leadership disciplines into a single, coherent
                development pathway. Each discipline comprises multiple modules with case studies,
                exercises, and structured reflection.
              </p>
            </div>

            <div className="prose-narrow mt-12">
              <div className="space-y-6">
                {disciplines.map((discipline, index) => (
                  <div key={discipline.title} className="flex gap-6 items-start">
                    <span className="text-sm font-medium text-muted-foreground/50 pt-0.5 w-6 shrink-0 text-right">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="border-l border-border/60 pl-6 pb-2">
                      <h3 className="text-base font-semibold text-foreground">{discipline.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                        {discipline.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className="section-divider" />

        {/* What's Included */}
        <section className="section-brief">
          <div className="container-brief">
            <div className="prose-narrow">
              <h2 className="heading-section">Programme Inclusions</h2>
              <ul className="scan-list mt-8">
                {programmeHighlights.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <div className="section-divider" />

        {/* Engagement Tiers */}
        <section className="section-brief">
          <div className="container-brief">
            <div className="prose-narrow mb-12">
              <h2 className="heading-section">Engagement Options</h2>
              <p className="body-brief mt-6">
                Three levels of engagement. All include the complete 33-module curriculum
                and CPD accreditation. Select the level of advisory support appropriate to
                your development objectives.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-[1140px]">
              {tiers.map((tier) => (
                <div
                  key={tier.name}
                  className={`relative rounded-2xl border bg-card p-6 flex flex-col ${
                    tier.popular
                      ? "border-secondary/40 shadow-sm"
                      : "border-border/50"
                  }`}
                >
                  {tier.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge variant="secondary" className="px-4 py-1 text-xs">
                        Most Selected
                      </Badge>
                    </div>
                  )}
                  {tier.limited && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge variant="outline" className="px-4 py-1 text-xs border-muted-foreground/30">
                        <Clock className="h-3 w-3 mr-1" />
                        Limited Availability
                      </Badge>
                    </div>
                  )}

                  <div className="mb-6 pt-2">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                        <tier.icon className="h-4 w-4 text-foreground" />
                      </div>
                      <h3 className="font-semibold text-foreground">{tier.name}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {tier.description}
                    </p>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-foreground">
                        £{tier.price.toLocaleString()}
                      </span>
                      <span className="text-sm text-muted-foreground line-through">
                        £{tier.originalPrice.toLocaleString()}
                      </span>
                    </div>
                    {"installments" in tier && tier.installments && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Or 3 instalments of £{Math.ceil(tier.price / tier.installments).toLocaleString()}
                      </p>
                    )}
                  </div>

                  <ul className="space-y-2.5 mb-8 flex-grow">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5">
                        <Check className="h-4 w-4 mt-0.5 shrink-0 text-secondary" />
                        <span className="text-sm text-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    variant={tier.popular ? "default" : "outline"}
                    className="w-full"
                    asChild
                  >
                    {tier.link.startsWith("http") ? (
                      <a href={tier.link} target="_blank" rel="noopener noreferrer">
                        {tier.cta}
                      </a>
                    ) : (
                      <Link to={tier.link}>{tier.cta}</Link>
                    )}
                  </Button>
                </div>
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
                Programme enquiries are handled confidentially.
                For availability, group enrolment, or bespoke delivery,
                please submit an enquiry.
              </p>
              <div className="mt-10 flex flex-wrap justify-center gap-4">
                <Button variant="outline" className="border-primary/20" asChild>
                  <Link to="/contact">
                    Enquire Confidentially
                  </Link>
                </Button>
                <Button variant="ghost" className="text-muted-foreground" asChild>
                  <Link to="/courses">
                    View All Courses
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
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

export default ExecutiveLeadershipMastery;
