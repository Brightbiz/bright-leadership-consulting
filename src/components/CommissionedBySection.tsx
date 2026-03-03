import { motion } from "framer-motion";

const roles = [
  {
    title: "Chief Executive Officers",
    context: "Seeking structural clarity across the executive team during growth, integration, or strategic transition.",
  },
  {
    title: "Chairs & Non-Executive Directors",
    context: "Requiring independent, board-ready visibility into executive alignment and governance coherence.",
  },
  {
    title: "Chief People Officers",
    context: "Building the structural foundations for executive capability — beyond development programmes alone.",
  },
];

const CommissionedBySection = () => {
  return (
    <section className="py-24 lg:py-32 bg-background">
      <div className="container-narrow">
        <motion.div
          className="max-w-3xl mx-auto text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase mb-6">
            Commissioned By
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-[2.75rem] font-semibold text-foreground leading-tight">
            Engagements Begin at Board Level
          </h2>
        </motion.div>

        <div className="grid gap-px lg:grid-cols-3 max-w-5xl mx-auto bg-border">
          {roles.map((role, index) => (
            <motion.div
              key={role.title}
              className="bg-background p-10 lg:p-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
            >
              <h3 className="font-serif text-lg font-semibold text-foreground mb-4">
                {role.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {role.context}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CommissionedBySection;
