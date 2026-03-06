import { motion } from "framer-motion";
import { Link } from "react-router-dom";

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

      <section aria-label="Commissioning context" className="section-brief section-tinted">
        <div className="container-brief">
          <div className="max-w-[640px] mx-auto text-center">
            <motion.h2 className="heading-section mb-8" {...fade}>
              When Executive Alignment Becomes a Strategic Priority
            </motion.h2>

            <motion.div
              className="space-y-6"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
            >
              <div className="inline-block text-left">
                <div className="scan-list">
                  {contexts.map((ctx) => (
                    <motion.p
                      key={ctx}
                      variants={{
                        hidden: { opacity: 0, x: -10 },
                        visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
                      }}
                    >
                      {ctx}
                    </motion.p>
                  ))}
                </div>
              </div>

              <motion.p
                className="body-brief"
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
                }}
              >
                Typically commissioned by CEOs, Chairs, Non-Executive Directors, and Chief People Officers.
              </motion.p>

              <motion.p
                className="body-brief"
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
                }}
              >
                Engagements are confidential and calibrated to organisational complexity.
              </motion.p>

              <motion.div
                className="pt-4"
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
                }}
              >
                <Link to="/contact" className="btn-brief">
                  Enquire Regarding Executive Alignment
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
};

export default CommissionedBySection;
