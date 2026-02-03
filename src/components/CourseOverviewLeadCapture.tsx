import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText, Download, ArrowRight, Clock, Award, BookOpen, Target, Check, Loader2, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import AnimatedSection from "@/components/AnimatedSection";
import RecentActivityNotification from "@/components/RecentActivityNotification";
import { motion, useInView, useSpring, useTransform } from "framer-motion";

const AnimatedCounter = ({ value }: { value: number }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  
  const spring = useSpring(0, { duration: 2000, bounce: 0 });
  const display = useTransform(spring, (current) => Math.floor(current).toLocaleString());
  
  useEffect(() => {
    if (isInView) {
      spring.set(value);
    }
  }, [isInView, value, spring]);

  return <motion.span ref={ref}>{display}</motion.span>;
};

const CourseOverviewLeadCapture = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [downloadCount, setDownloadCount] = useState<number | null>(null);

  useEffect(() => {
    const fetchDownloadCount = async () => {
      const { count } = await supabase
        .from("lead_magnet_downloads")
        .select("*", { count: "exact", head: true })
        .eq("lead_magnet_name", "Executive Leadership Course Overview");
      
      // Add a base number to make it look more established
      setDownloadCount((count || 0) + 847);
    };
    fetchDownloadCount();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from("lead_magnet_downloads")
        .insert({
          name: name.trim(),
          email: email.trim(),
          lead_magnet_name: "Executive Leadership Course Overview",
        });

      if (error) throw error;

      setIsUnlocked(true);
      toast({
        title: "Access granted!",
        description: "Your download is ready. Check your email for more resources.",
      });
    } catch (error) {
      console.error("Error saving lead:", error);
      toast({
        title: "Something went wrong",
        description: "Please try again or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const phases = [
    { phase: "Foundation", modules: "1-8", topics: "Leadership Philosophy, Self-Awareness, Emotional Intelligence, Communication" },
    { phase: "Core Skills", modules: "9-17", topics: "Strategic Thinking, Decision Making, Team Dynamics, Conflict Resolution" },
    { phase: "Advanced", modules: "18-25", topics: "Change Management, Innovation, Stakeholder Management, Negotiation" },
    { phase: "Mastery", modules: "26-33", topics: "Crisis Management, Global Leadership, Personal Branding, Legacy Building" },
  ];

  return (
    <section className="section-padding relative overflow-hidden bg-muted/20">
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-secondary/5 rounded-full blur-3xl" />
      
      <div className="container-narrow relative">
        <AnimatedSection className="mx-auto mb-12 max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary/15 to-secondary/15 px-5 py-2.5 border border-primary/20">
            <FileText className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold text-primary">
              Free Resource
            </span>
          </div>
          
          {/* Social Proof Badge */}
          {downloadCount !== null && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ 
                opacity: 1, 
                scale: [1, 1.02, 1],
                boxShadow: [
                  "0 0 0 0 hsl(var(--secondary) / 0)",
                  "0 0 0 8px hsl(var(--secondary) / 0.1)",
                  "0 0 0 0 hsl(var(--secondary) / 0)"
                ]
              }}
              transition={{ 
                opacity: { delay: 0.3, duration: 0.4 },
                scale: { delay: 1, duration: 2, repeat: Infinity, repeatDelay: 3 },
                boxShadow: { delay: 1, duration: 2, repeat: Infinity, repeatDelay: 3 }
              }}
              className="mb-4 inline-flex items-center gap-2 rounded-full bg-secondary/10 px-4 py-2 ml-3 border border-secondary/20"
            >
              <Users className="h-4 w-4 text-secondary" />
              <span className="text-sm font-medium text-foreground">
                <span className="font-bold"><AnimatedCounter value={downloadCount} /></span> leaders downloaded
              </span>
            </motion.div>
          )}
          <h2 className="mb-6 font-serif text-3xl font-semibold text-foreground sm:text-4xl">
            Download the Complete <span className="text-primary">Course Overview</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Get a detailed breakdown of all 33 modules, learning objectives, and time estimates for the Executive Leadership Mastery Program.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={100}>
          <div className="relative rounded-3xl bg-card border border-border/50 overflow-hidden shadow-xl">
            {/* Stats Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-border/30">
              <div className="bg-card p-6 flex flex-col items-center text-center">
                <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <span className="text-3xl font-bold text-foreground">33</span>
                <span className="text-sm text-muted-foreground">Comprehensive Modules</span>
              </div>
              
              <div className="bg-card p-6 flex flex-col items-center text-center">
                <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/10">
                  <Clock className="h-6 w-6 text-secondary" />
                </div>
                <span className="text-3xl font-bold text-foreground">80+</span>
                <span className="text-sm text-muted-foreground">Hours of Content</span>
              </div>
              
              <div className="bg-card p-6 flex flex-col items-center text-center">
                <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <span className="text-3xl font-bold text-foreground">66</span>
                <span className="text-sm text-muted-foreground">CPD Points</span>
              </div>
              
              <div className="bg-card p-6 flex flex-col items-center text-center">
                <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/10">
                  <Target className="h-6 w-6 text-secondary" />
                </div>
                <span className="text-3xl font-bold text-foreground">4</span>
                <span className="text-sm text-muted-foreground">Learning Phases</span>
              </div>
            </div>
            
            {/* Module Preview */}
            <div className="p-8 md:p-10 bg-gradient-to-b from-muted/30 to-transparent">
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {phases.map((section, index) => (
                  <div 
                    key={section.phase}
                    className="group relative p-5 rounded-xl bg-card border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
                        {index + 1}
                      </span>
                      <div>
                        <h4 className="font-semibold text-foreground">{section.phase}</h4>
                        <span className="text-xs text-muted-foreground">Modules {section.modules}</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {section.topics}
                    </p>
                  </div>
                ))}
              </div>
              
              {/* Conditional: Form or Download */}
              {isUnlocked ? (
                <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <Check className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="mb-2 font-serif text-xl font-semibold text-foreground">
                    Your download is ready!
                  </h3>
                  <p className="mb-6 text-muted-foreground">
                    Thank you, {name}! Click below to download your course overview.
                  </p>
                  <Button 
                    size="xl" 
                    className="group shadow-lg shadow-primary/20"
                    asChild
                  >
                    <a href="/downloads/executive-leadership-mastery-overview.html" download="Executive-Leadership-Mastery-Overview.html">
                      <Download className="h-5 w-5 mr-2" />
                      Download Course Overview
                      <ArrowRight className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1" />
                    </a>
                  </Button>
                  <p className="mt-4 text-sm text-muted-foreground">
                    HTML format • Optimized for printing as PDF
                  </p>
                </div>
              ) : (
                <div className="max-w-md mx-auto">
                  <div className="text-center mb-6">
                    <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
                      Get Instant Access
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Enter your details to unlock the complete course overview
                    </p>
                  </div>
                  
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="overview-name">Your Name</Label>
                      <Input
                        id="overview-name"
                        type="text"
                        placeholder="John Smith"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        disabled={isSubmitting}
                        className="h-12"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="overview-email">Work Email</Label>
                      <Input
                        id="overview-email"
                        type="email"
                        placeholder="john@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={isSubmitting}
                        className="h-12"
                      />
                    </div>
                    
                    <Button
                      type="submit"
                      size="xl"
                      className="w-full group shadow-lg shadow-primary/20"
                      disabled={isSubmitting || !name.trim() || !email.trim()}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin mr-2" />
                          Unlocking...
                        </>
                      ) : (
                        <>
                          <Download className="h-5 w-5 mr-2" />
                          Unlock Free Download
                          <ArrowRight className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1" />
                        </>
                      )}
                    </Button>
                    
                    <p className="text-xs text-center text-muted-foreground">
                      We respect your privacy. Unsubscribe at any time.
                    </p>
                  </form>
                </div>
              )}
            </div>
          </div>
        </AnimatedSection>
      </div>
      
      {/* Recent Activity Notifications */}
      <RecentActivityNotification />
    </section>
  );
};

export default CourseOverviewLeadCapture;
