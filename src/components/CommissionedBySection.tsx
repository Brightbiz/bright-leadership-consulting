import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const triggers = [
  "Growth",
  "Leadership transition",
  "Post-acquisition integration",
  "AI transformation",
];

const fade = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7, ease: "easeOut" as const },
};

const CommissionedBySection = () => {
  return (
    <>
      {/* Section divider */}
      <div className="section-divider" />

      <section className="section-brief bg-background">
        <div className="container-brief">
          <div className="prose-narrow mx-auto">
            <motion.p className="kicker mb-6" {...fade}>
              Commissioning Context
            </motion.p>

            <motion.div
              className="space-y-6 body-brief"
              {...fade}
              transition={{ ...fade.transition, delay: 0.15 }}
            >
              <p>
                Typically commissioned by the CEO, Chair, or Chief People Officer during:
              </p>

              <div className="scan-list">
                {triggers.map((trigger) => (
                  <p key={trigger}>{trigger}</p>
                ))}
              </div>

              <p>
                Engagements are confidential and calibrated to organisational complexity.
              </p>

              <Link
                to="/contact"
                className="link-quiet"
              >
                Enquire Regarding Executive Alignment
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
};

export default CommissionedBySection;
