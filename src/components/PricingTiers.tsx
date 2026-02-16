import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Clock, Sparkles, Users, User, Crown, ClipboardCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import MagneticButton from "./MagneticButton";
import ReadinessQuizModal from "./ReadinessQuizModal";

const tiers = [
  {
    name: "Self-Paced Executive Training",
    icon: User,
    price: 1297,
    originalPrice: 1497,
    period: "one-time",
    installments: 3,
    description: "Master leadership at your own pace with full programme access.",
    features: [
      "All 33 modules (80+ hours of content)",
      "66 CPD points upon completion",
      "Downloadable workbooks & templates",
      "Case studies & action plans",
      "Certificate of completion",
      "Lifetime access to materials",
    ],
    accent: "primary" as const,
    popular: true,
    limited: false,
    cta: "Start Learning Today",
    link: "https://bright-leadership-consulting.thinkific.com/courses/copy-of-executive-leadership-mastery-program",
  },
  {
    name: "Group Coaching",
    icon: Users,
    price: 1497,
    originalPrice: 1797,
    period: "one-time",
    description: "Accelerate your growth with expert-led group coaching sessions.",
    features: [
      "Everything in Self-Paced Mastery",
      "6 live group coaching sessions",
      "Peer learning community access",
      "Monthly Q&A with instructors",
      "Group accountability partners",
      "Priority email support",
    ],
    accent: "secondary" as const,
    popular: false,
    limited: true,
    cta: "Enquire About Availability",
    link: "#contact",
  },
  {
    name: "1:1 Executive Coaching",
    icon: Crown,
    price: 2197,
    originalPrice: 2997,
    period: "one-time",
    description: "The ultimate transformation with dedicated personal coaching.",
    features: [
      "Everything in Group Coaching",
      "6 private 1:1 coaching sessions",
      "360° leadership assessment",
      "Personalised development plan",
      "Direct access to your coach",
      "Executive network introductions",
    ],
    accent: "primary" as const,
    popular: false,
    limited: true,
    cta: "Enquire About Availability",
    link: "#contact",
  },
];

const PricingTiers = () => {
  const [quizOpen, setQuizOpen] = useState(false);

  return (
    <div id="pricing-tiers" className="mt-16">
      <ReadinessQuizModal open={quizOpen} onOpenChange={setQuizOpen} />
      {/* Section header */}
      <div className="text-center mb-10 animate-fade-in">
        {/* Urgency banner */}
        <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-destructive/10 border border-destructive/20">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <Clock className="h-4 w-4 text-destructive" />
          </motion.div>
          <span className="text-sm font-semibold text-destructive">
            Launch Pricing — Limited Time Only
          </span>
        </div>

        <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-foreground mb-3">
          Choose Your Path to Leadership Excellence
        </h3>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Invest in yourself with our CPD-accredited programme. All tiers include the full 33-module curriculum with 66 CPD points.
        </p>
      </div>

      {/* Pricing cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {tiers.map((tier, index) => (
          <div
            key={tier.name}
            className="relative animate-fade-in"
            style={{ animationDelay: `${index * 100}ms`, animationFillMode: "both" }}
          >
            {tier.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                <Badge variant="secondary" className="shadow-lg shadow-secondary/30 px-4 py-1">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Most Popular
                </Badge>
              </div>
            )}
            {tier.limited && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                <Badge variant="outline" className="shadow-lg px-4 py-1 border-amber-500/50 bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400">
                  <Clock className="h-3 w-3 mr-1" />
                  Limited Availability
                </Badge>
              </div>
            )}

            <motion.div
              whileHover={{ y: -4 }}
              className={`relative h-full rounded-2xl border-2 bg-card p-6 flex flex-col transition-shadow duration-300 ${
                tier.popular
                  ? "border-secondary shadow-xl shadow-secondary/10"
                  : tier.limited
                  ? "border-border/30 opacity-90 hover:opacity-100 hover:border-primary/20 hover:shadow-md"
                  : "border-border/50 hover:border-primary/30 hover:shadow-lg"
              }`}
            >
              {/* Tier header */}
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                      tier.popular ? "bg-secondary/20" : "bg-primary/10"
                    }`}
                  >
                    <tier.icon
                      className={`h-5 w-5 ${
                        tier.popular ? "text-secondary" : "text-primary"
                      }`}
                    />
                  </div>
                  <h4 className="font-semibold text-foreground text-lg">{tier.name}</h4>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {tier.description}
                </p>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-foreground">
                    {tier.limited && <span className="text-lg font-normal text-muted-foreground">from </span>}
                    £{tier.price.toLocaleString()}
                  </span>
                  <span className="text-lg text-muted-foreground line-through">
                    £{tier.originalPrice.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Badge
                    variant="outline"
                    className="text-xs border-primary/30 text-primary bg-primary/5"
                  >
                    Save £{(tier.originalPrice - tier.price).toLocaleString()}
                  </Badge>
                  <span className="text-xs text-muted-foreground">one-time payment</span>
                </div>
                {"installments" in tier && tier.installments && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Or 3 interest-free instalments of{" "}
                    <span className="font-semibold text-foreground">
                      £{Math.ceil(tier.price / tier.installments).toLocaleString()}
                    </span>
                  </p>
                )}
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8 flex-grow">
                {tier.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check
                      className={`h-4 w-4 mt-0.5 flex-shrink-0 ${
                        tier.popular ? "text-secondary" : "text-primary"
                      }`}
                    />
                    <span className="text-sm text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
              {tier.limited && (
                <p className="text-xs text-muted-foreground italic mb-4 px-1">
                  Due to high demand, coaching places fill quickly. Submit an enquiry and we'll contact you if a slot becomes available.
                </p>
              )}

              {/* CTA */}
              <MagneticButton
                variant={tier.popular ? "hero" : "teal"}
                size="lg"
                className="w-full"
                href={tier.link}
                target={tier.link.startsWith("http") ? "_blank" : undefined}
                rel={tier.link.startsWith("http") ? "noopener noreferrer" : undefined}
              >
                {tier.cta}
              </MagneticButton>
            </motion.div>
          </div>
        ))}
      </div>

      {/* Readiness qualifier — premium CTA */}
      <div
        className="mt-14 animate-fade-in"
        style={{ animationDelay: "300ms", animationFillMode: "both" }}
      >
        <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/5 via-primary/10 to-secondary/5 px-8 py-10 sm:px-12 sm:py-12">
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 -mt-8 -mr-8 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 -mb-8 -ml-8 h-32 w-32 rounded-full bg-secondary/10 blur-3xl" />
          
          <div className="relative flex flex-col items-center gap-6 text-center">
            <motion.div
              animate={{ rotate: [0, -5, 5, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 ring-4 ring-primary/10"
            >
              <ClipboardCheck className="h-7 w-7 text-primary" />
            </motion.div>
            
            <div className="max-w-xl space-y-2">
              <h4 className="font-serif text-xl sm:text-2xl font-semibold text-foreground">
                Not Sure Which Path Is Right for You?
              </h4>
              <p className="text-muted-foreground leading-relaxed">
                Answer 6 quick questions and we'll recommend the best programme tier based on your goals, experience, and learning style.
              </p>
            </div>

            <MagneticButton
              variant="hero"
              size="lg"
              className="mt-2 px-8 shadow-lg shadow-primary/20"
              onClick={() => setQuizOpen(true)}
            >
              <ClipboardCheck className="h-5 w-5 mr-2" />
              Take the 60-Second Readiness Quiz
            </MagneticButton>

            <p className="text-xs text-muted-foreground">
              Free · No sign-up required · Instant recommendation
            </p>
          </div>
        </div>
      </div>

      {/* Trust signals */}
      <div
        className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground animate-fade-in"
        style={{ animationDelay: "400ms", animationFillMode: "both" }}
      >
        <div className="flex items-center gap-2">
          <Check className="h-4 w-4 text-primary" />
          <span>66 CPD points included</span>
        </div>
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <span>With further discounts off all training courses</span>
        </div>
      </div>
    </div>
  );
};

export default PricingTiers;
