import { motion } from "framer-motion";
import { Check, Clock, Shield, Sparkles, Users, User, Crown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import MagneticButton from "./MagneticButton";

const tiers = [
  {
    name: "Self-Paced Mastery",
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
  return (
    <div id="pricing-tiers" className="mt-16">
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-10"
      >
        {/* Urgency banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-destructive/10 border border-destructive/20"
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <Clock className="h-4 w-4 text-destructive" />
          </motion.div>
          <span className="text-sm font-semibold text-destructive">
            Launch Pricing — Limited Time Only
          </span>
        </motion.div>

        <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-foreground mb-3">
          Choose Your Path to Leadership Excellence
        </h3>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Invest in yourself with our CPD-accredited programme. All tiers include the full 33-module curriculum with 66 CPD points.
        </p>
      </motion.div>

      {/* Pricing cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {tiers.map((tier, index) => (
          <motion.div
            key={tier.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="relative"
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
          </motion.div>
        ))}
      </div>

      {/* Trust signals */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
        className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground"
      >
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-primary" />
          <span>30-day money-back guarantee</span>
        </div>
        <div className="flex items-center gap-2">
          <Check className="h-4 w-4 text-primary" />
          <span>66 CPD points included</span>
        </div>
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <span>Bonus: 50% off all training courses</span>
        </div>
      </motion.div>
    </div>
  );
};

export default PricingTiers;
