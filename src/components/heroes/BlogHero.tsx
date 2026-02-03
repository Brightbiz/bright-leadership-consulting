import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Newspaper, BookOpen, TrendingUp, Feather, ArrowRight, Mail, Sparkles } from "lucide-react";
import TextReveal from "@/components/TextReveal";
import AnimatedGradient from "@/components/AnimatedGradient";
import { useMouseParallax, ParallaxLayer } from "@/hooks/useMouseParallax";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const BlogHero = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const containerRef = useRef<HTMLElement>(null);
  const parallax = useMouseParallax(containerRef, { sensitivity: 0.02, maxMovement: 25 });

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedEmail = email.trim();
    if (!trimmedEmail) return;
    
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from("newsletter_subscribers")
        .insert({ email: trimmedEmail, source: "blog" });
      
      if (error) {
        if (error.code === "23505") {
          // Unique constraint violation - already subscribed
          toast({
            title: "Already subscribed!",
            description: "This email is already on our list.",
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: "Welcome aboard! 🎉",
          description: "You've successfully subscribed to our newsletter.",
        });
        setEmail("");
      }
    } catch (error) {
      console.error("Newsletter signup error:", error);
      toast({
        title: "Something went wrong",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const featuredTopics = [
    { icon: TrendingUp, label: "Strategy", color: "from-primary to-primary/70" },
    { icon: BookOpen, label: "Learning", color: "from-secondary to-secondary/70" },
    { icon: Feather, label: "Insights", color: "from-primary to-primary/70" },
  ];

  return (
    <section ref={containerRef} className="relative min-h-[85vh] overflow-hidden flex items-center">
      {/* Animated Gradient Background - same as homepage */}
      <AnimatedGradient />

      {/* Floating article previews */}
      <ParallaxLayer parallax={parallax} depth={0.8} className="absolute top-20 right-[8%] hidden xl:block">
        <motion.div
          initial={{ opacity: 0, y: 40, rotate: 8 }}
          animate={{ opacity: 1, y: 0, rotate: 8 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="w-48 h-64 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-4 shadow-2xl"
        >
          <div className="h-20 bg-gradient-to-br from-secondary/30 to-primary/20 rounded-lg mb-3" />
          <div className="space-y-2">
            <div className="h-2 w-full bg-white/20 rounded" />
            <div className="h-2 w-3/4 bg-white/15 rounded" />
            <div className="h-2 w-1/2 bg-white/10 rounded" />
          </div>
          <motion.div 
            className="absolute -bottom-3 -right-3 w-8 h-8 rounded-full bg-secondary flex items-center justify-center"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Newspaper className="h-4 w-4 text-secondary-foreground" />
          </motion.div>
        </motion.div>
      </ParallaxLayer>

      <ParallaxLayer parallax={parallax} depth={1.2} className="absolute bottom-32 right-[18%] hidden lg:block">
        <motion.div
          initial={{ opacity: 0, y: 40, rotate: -5 }}
          animate={{ opacity: 1, y: 0, rotate: -5 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="w-40 h-52 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-3 shadow-2xl"
        >
          <div className="h-16 bg-gradient-to-br from-primary/40 to-secondary/20 rounded-lg mb-2" />
          <div className="space-y-1.5">
            <div className="h-1.5 w-full bg-white/15 rounded" />
            <div className="h-1.5 w-2/3 bg-white/10 rounded" />
          </div>
        </motion.div>
      </ParallaxLayer>

      {/* Content */}
      <div className="container-narrow relative py-24 pt-32 z-10">
        <div className="max-w-3xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8 inline-flex items-center gap-3 rounded-full bg-white/10 backdrop-blur-md px-5 py-2.5 border border-white/20 shadow-lg"
          >
            <Newspaper className="h-4 w-4 text-secondary" />
            <span className="text-sm font-semibold text-primary-foreground">
              The Journal
            </span>
          </motion.div>

          <h1 className="mb-8 font-serif text-5xl font-bold leading-[1.05] text-primary-foreground sm:text-6xl lg:text-7xl">
            <TextReveal delay={0.2}>
              Ideas That
            </TextReveal>
            <span className="block text-secondary">
              <TextReveal delay={0.4}>
                Shape Leaders
              </TextReveal>
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-lg text-primary-foreground/85 leading-relaxed sm:text-xl max-w-xl mb-12"
          >
            Curated perspectives on leadership, strategy, and growth from 
            industry experts and thought leaders.
          </motion.p>

          {/* Topic pills with icons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex flex-wrap gap-4 mb-12"
          >
            {featuredTopics.map((topic, index) => (
              <motion.div
                key={topic.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.9 + index * 0.1 }}
                className="group flex items-center gap-3 px-5 py-3 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer"
              >
                <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${topic.color} flex items-center justify-center`}>
                  <topic.icon className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="text-sm font-semibold text-primary-foreground group-hover:text-secondary transition-colors">
                  {topic.label}
                </span>
              </motion.div>
            ))}
          </motion.div>

          {/* Newsletter Signup Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            className="mb-10"
          >
            <div className="relative max-w-md">
              <div className="absolute -inset-1 bg-gradient-to-r from-secondary/50 via-primary/30 to-secondary/50 rounded-2xl blur-lg opacity-60" />
              <form 
                onSubmit={handleNewsletterSubmit}
                className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-4"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center">
                    <Sparkles className="h-4 w-4 text-secondary" />
                  </div>
                  <span className="text-sm font-medium text-primary-foreground/80">Get weekly insights</span>
                </div>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary-foreground/50" />
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 bg-white/10 border-white/20 text-primary-foreground placeholder:text-primary-foreground/40 focus:border-secondary"
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    variant="hero"
                    disabled={isSubmitting}
                    className="shrink-0"
                  >
                    {isSubmitting ? "..." : "Subscribe"}
                  </Button>
                </div>
                <p className="text-xs text-primary-foreground/50 mt-2">
                  Join 2,500+ leaders. Unsubscribe anytime.
                </p>
              </form>
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
          >
            <a 
              href="#articles" 
              className="inline-flex items-center gap-3 text-secondary font-semibold group"
            >
              <span>Explore Articles</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </a>
          </motion.div>
        </div>
      </div>

      {/* Bottom wave - same as homepage */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 100" fill="none" className="w-full">
          <path
            d="M0 50C360 100 720 0 1080 50C1260 75 1380 75 1440 50V100H0V50Z"
            className="fill-background"
          />
        </svg>
      </div>
    </section>
  );
};

export default BlogHero;
