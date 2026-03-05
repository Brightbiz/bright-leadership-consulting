import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const contexts = [
  "Strategic planning cycles",
  "Leadership transitions",
  "AI transformation initiatives",
  "Post-acquisition integration",
  "Rapid organisational growth",
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
      <div className="section-divider" />

      <section className="section-brief bg-background">
        <div className="container-brief">
          <div className="max-w-[640px] mx-auto text-center">
            <motion.h2 className="heading-section mb-8" {...fade}>
              When Executive Alignment Becomes a Strategic Priority
            </motion.h2>

            <motion.div
              className="space-y-6"
              {...fade}
              transition={{ ...fade.transition, delay: 0.15 }}
            >
              <div className="inline-block text-left">
                <div className="scan-list">
                  {contexts.map((ctx) => (
                    <p key={ctx}>{ctx}</p>
                  ))}
                </div>
              </div>

              <p className="body-brief">
                Engagements are confidential and calibrated to organisational complexity.
              </p>

              <div className="pt-4">
                <Link to="/contact" className="btn-brief">
                  Enquire Regarding Executive Alignment
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
};

export default CommissionedBySection;
