import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const triggers = [
  "Growth",
  "Leadership transition",
  "Post-acquisition integration",
  "AI transformation",
];

const CommissionedBySection = () => {
  return (
    <section className="py-24 lg:py-32 bg-muted/30">
      <div className="container-narrow">
        <div className="max-w-3xl mx-auto">
          <motion.p
            className="text-xs font-medium tracking-widest text-muted-foreground uppercase mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            Commissioning Context
          </motion.p>

          <motion.div
            className="space-y-8 text-lg leading-relaxed text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
          >
            <p>
              Typically commissioned by the CEO, Chair, or Chief People Officer during:
            </p>

            <div className="space-y-1.5 border-l-2 border-border pl-6">
              {triggers.map((trigger) => (
                <p key={trigger}>{trigger}</p>
              ))}
            </div>

            <p>
              Engagements are confidential and calibrated to organisational complexity.
            </p>

            <Link
              to="/contact"
              className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-300 tracking-wide"
            >
              Enquire Regarding Executive Alignment
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CommissionedBySection;
