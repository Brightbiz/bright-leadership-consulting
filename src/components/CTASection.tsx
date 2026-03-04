import { forwardRef } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const fade = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7, ease: "easeOut" as const },
};

const CTASection = forwardRef<HTMLElement>((_, ref) => {
  return (
    <>
      <div className="section-divider" />

      <section ref={ref} className="section-brief bg-background">
        <div className="container-brief">
          <div className="prose-narrow mx-auto text-center">
            <motion.p className="kicker mb-6" {...fade}>
              Confidential Enquiry
            </motion.p>

            <motion.h2
              className="heading-section mb-8"
              {...fade}
              transition={{ ...fade.transition, delay: 0.1 }}
            >
              The Right Conversation Starts Here
            </motion.h2>

            <motion.p
              className="body-brief mb-10"
              {...fade}
              transition={{ ...fade.transition, delay: 0.15 }}
            >
              Executive alignment engagements are discussed confidentially and by arrangement.
            </motion.p>

            <motion.div
              {...fade}
              transition={{ ...fade.transition, delay: 0.2 }}
            >
              <Link
                to="/contact"
                className="link-quiet"
              >
                Enquire Confidentially
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
});

CTASection.displayName = "CTASection";

export default CTASection;
