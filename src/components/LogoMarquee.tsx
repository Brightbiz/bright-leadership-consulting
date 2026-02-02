import { motion } from "framer-motion";

const logos = [
  { name: "Fortune 500", icon: "🏢" },
  { name: "Tech Leaders", icon: "💻" },
  { name: "Healthcare", icon: "🏥" },
  { name: "Finance", icon: "📊" },
  { name: "Consulting", icon: "🎯" },
  { name: "Manufacturing", icon: "🏭" },
  { name: "Education", icon: "🎓" },
  { name: "Non-Profit", icon: "❤️" },
];

const LogoMarquee = () => {
  const duplicatedLogos = [...logos, ...logos];

  return (
    <section className="py-16 bg-muted/30 border-y border-border/50 overflow-hidden">
      <div className="container-narrow mb-8">
        <p className="text-center text-sm font-medium uppercase tracking-widest text-muted-foreground">
          Trusted by leaders from
        </p>
      </div>
      
      <div className="relative">
        {/* Gradient masks */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-muted/30 to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-muted/30 to-transparent z-10" />
        
        <motion.div
          className="flex gap-16 items-center"
          animate={{
            x: [0, -50 * logos.length * 8],
          }}
          transition={{
            x: {
              duration: 30,
              repeat: Infinity,
              ease: "linear",
            },
          }}
        >
          {duplicatedLogos.map((logo, index) => (
            <div
              key={`${logo.name}-${index}`}
              className="flex items-center gap-3 shrink-0 px-6 py-3 rounded-full bg-background/80 backdrop-blur-sm border border-border/50 shadow-sm hover:shadow-md transition-shadow"
            >
              <span className="text-2xl">{logo.icon}</span>
              <span className="text-sm font-medium text-foreground whitespace-nowrap">
                {logo.name}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default LogoMarquee;
