import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play, CheckCircle, ArrowRight, Shield, Clock, Star, Sparkles,
  Award, Users, BookOpen, Target, TrendingUp, ChevronDown, X,
  Quote, ClipboardCheck,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Logo from "@/components/Logo";
import { FileText } from "lucide-react";
import ReadinessQuizModal from "@/components/ReadinessQuizModal";
import testimonialSophia from "@/assets/testimonial-sophia.jpg";
import testimonialDavid from "@/assets/testimonial-david.jpg";
import testimonialEmily from "@/assets/testimonial-emily.jpg";

const THINKIFIC_LINK =
  "https://bright-leadership-consulting.thinkific.com/courses/new-executive-leadership-mastery-program";

// CTA reveals after this many seconds of "watching"
const CTA_REVEAL_SECONDS = 300; // 5 minutes into a 7:29 video

// Evergreen countdown: 72 hours from first visit
const COUNTDOWN_KEY = "vsl_countdown_deadline";
const COUNTDOWN_HOURS = 72;

const getDeadline = (): number => {
  const stored = localStorage.getItem(COUNTDOWN_KEY);
  if (stored) return Number(stored);
  const deadline = Date.now() + COUNTDOWN_HOURS * 60 * 60 * 1000;
  localStorage.setItem(COUNTDOWN_KEY, String(deadline));
  return deadline;
};

const formatTime = (ms: number) => {
  if (ms <= 0) return { h: "00", m: "00", s: "00" };
  const totalSec = Math.floor(ms / 1000);
  const h = String(Math.floor(totalSec / 3600)).padStart(2, "0");
  const m = String(Math.floor((totalSec % 3600) / 60)).padStart(2, "0");
  const s = String(totalSec % 60).padStart(2, "0");
  return { h, m, s };
};

const modules = [
  "Strategic Leadership & Vision",
  "Emotional Intelligence Mastery",
  "High-Performance Team Building",
  "Executive Communication & Presence",
  "Decision-Making Under Pressure",
  "Change Management & Innovation",
  "Stakeholder Management",
  "Conflict Resolution & Negotiation",
];

const testimonials = [
  {
    name: "Sophia Chen",
    role: "CEO, TechVenture Inc",
    content:
      "Through the coaching program, I revamped my leadership approach, optimized team engagement, and expanded our impact. Within months, our results surged dramatically.",
    image: testimonialSophia,
  },
  {
    name: "David Patel",
    role: "Founder, InnovateLab",
    content:
      "The guidance helped me pivot my leadership style, streamline operations, and build strategic partnerships. Our company gained significant traction and attracted top talent.",
    image: testimonialDavid,
  },
  {
    name: "Emily Rodriguez",
    role: "VP Operations, GlobalCorp",
    content:
      "The coaching sessions empowered me to trust my instincts, communicate effectively, and lead with conviction. Today, I'm driving organizational success with confidence.",
    image: testimonialEmily,
  },
];

const results = [
  { stat: "33", label: "Comprehensive Modules" },
  { stat: "80+", label: "Hours of Content" },
  { stat: "66", label: "CPD Points" },
  { stat: "£200", label: "Saved vs. Original Price" },
];

// ─── Component ──────────────────────────────────────────────
const Masterclass = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [quizOpen, setQuizOpen] = useState(false);
  const [ctaRevealed, setCtaRevealed] = useState(false);
  const [timeLeft, setTimeLeft] = useState<ReturnType<typeof formatTime>>({ h: "00", m: "00", s: "00" });
  const [expired, setExpired] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  // Evergreen countdown
  useEffect(() => {
    const deadline = getDeadline();
    const tick = () => {
      const diff = deadline - Date.now();
      if (diff <= 0) {
        setExpired(true);
        setTimeLeft({ h: "00", m: "00", s: "00" });
      } else {
        setTimeLeft(formatTime(diff));
      }
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // CTA reveal timer — starts when video "plays"
  useEffect(() => {
    if (!isPlaying) return;
    timerRef.current = setTimeout(() => {
      setCtaRevealed(true);
    }, CTA_REVEAL_SECONDS * 1000);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current as unknown as number);
    };
  }, [isPlaying]);

  const scrollToCta = () => {
    ctaRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* ── Urgency bar ── */}
      {!expired && (
        <div className="sticky top-0 z-50 bg-gradient-to-r from-primary via-primary to-primary/95 text-primary-foreground">
          <div className="container-narrow flex flex-col sm:flex-row items-center justify-between gap-2 py-2 text-sm">
            <div className="flex items-center gap-2">
              <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
                <Clock className="h-4 w-4" />
              </motion.div>
              <span className="font-semibold">Launch Pricing Ends In:</span>
            </div>
            <div className="flex items-center gap-1 font-mono font-bold text-lg">
              <span className="bg-primary-foreground/20 rounded px-2 py-0.5">{timeLeft.h}</span>:
              <span className="bg-primary-foreground/20 rounded px-2 py-0.5">{timeLeft.m}</span>:
              <span className="bg-primary-foreground/20 rounded px-2 py-0.5">{timeLeft.s}</span>
            </div>
          </div>
        </div>
      )}

      {/* ── Minimal header ── */}
      <header className="py-4 border-b border-border/30">
        <div className="container-narrow flex items-center justify-between">
          <Logo />
          <Badge variant="outline" className="border-secondary/50 text-secondary">
            <Award className="h-3 w-3 mr-1" /> CPD Accredited
          </Badge>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative section-padding overflow-hidden">
        {/* BG orbs */}
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-primary/[0.06] rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] bg-secondary/[0.06] rounded-full blur-3xl" />

        <div className="container-narrow relative max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Badge className="mb-6 bg-secondary/10 text-secondary border-secondary/30">
              <Sparkles className="h-3 w-3 mr-1" /> Free Masterclass
            </Badge>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-semibold leading-tight mb-6">
              The 5 Leadership Shifts That Separate <span className="text-secondary">Executives</span> From Managers
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              Discover the exact framework used by senior leaders to step into C-Suite roles with confidence, authority, and lasting impact.
            </p>
          </motion.div>

          {/* ── Video player ── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative max-w-3xl mx-auto"
          >
            <div className="rounded-2xl p-[3px] bg-gradient-to-br from-secondary via-primary-foreground/30 to-secondary/80 shadow-2xl shadow-black/20">
              <div className="relative rounded-[calc(1rem-3px)] overflow-hidden bg-background aspect-video">
                {isPlaying ? (
                  <iframe
                    className="absolute inset-0 w-full h-full"
                    src="https://www.youtube.com/embed/iGKXCsLP4OI?autoplay=1&rel=0"
                    title="Executive Leadership Mastery Program"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div
                    className="relative cursor-pointer group h-full flex items-center justify-center bg-gradient-to-br from-primary/20 via-primary/10 to-secondary/10"
                    onClick={() => setIsPlaying(true)}
                  >
                    {/* Pulsing ring */}
                    <div className="absolute h-28 w-28 rounded-full bg-secondary/20 animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite]" />
                    <div className="relative h-20 w-20 rounded-full bg-secondary flex items-center justify-center shadow-xl shadow-secondary/40 transition-transform duration-300 group-hover:scale-110">
                      <Play className="h-9 w-9 text-secondary-foreground ml-1" fill="currentColor" />
                    </div>
                    <div className="absolute bottom-0 inset-x-0 p-5 bg-gradient-to-t from-primary/60 to-transparent text-center">
                      <p className="text-primary-foreground text-sm font-medium">▶ Watch the Free Masterclass (8 min)</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* CTA that reveals after timer */}
          <AnimatePresence>
            {ctaRevealed && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="mt-8"
              >
                <Button
                  size="lg"
                  variant="hero"
                  className="text-lg px-10 py-6 shadow-lg shadow-secondary/30"
                  onClick={scrollToCta}
                >
                  Enrol Now — Save £200 <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Social proof line */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><Users className="h-4 w-4 text-primary" /> 2,400+ enrolled</span>
            <span className="flex items-center gap-1"><Star className="h-4 w-4 text-secondary fill-secondary" /> 4.9/5 rating</span>
            <span className="flex items-center gap-1"><Award className="h-4 w-4 text-primary" /> 66 CPD points</span>
          </div>
        </div>
      </section>

      {/* ── Stats ribbon ── */}
      <section className="border-y border-border/30 bg-muted/40">
        <div className="container-narrow py-10 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {results.map((r, i) => (
            <motion.div
              key={r.label}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <p className="text-3xl sm:text-4xl font-bold text-primary">{r.stat}</p>
              <p className="text-sm text-muted-foreground mt-1">{r.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── What you'll learn ── */}
      <section className="section-padding relative">
        <div className="container-narrow max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/30">
              <BookOpen className="h-3 w-3 mr-1" /> Curriculum
            </Badge>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold mb-4">
              What You'll Master
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              33 modules across 8 core leadership disciplines — designed for senior professionals ready to lead at the highest level.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-4">
            {modules.map((mod, i) => (
              <motion.div
                key={mod}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="flex items-start gap-3 p-4 rounded-xl bg-card border border-border/50 hover:border-primary/30 transition-colors"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 flex-shrink-0 mt-0.5">
                  <Target className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{mod}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="section-padding bg-muted/30 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-80 h-80 bg-primary/[0.04] rounded-full blur-3xl" />
        <div className="container-narrow max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold mb-4">
              What Leaders Are Saying
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card rounded-2xl p-6 border border-border/50 flex flex-col"
              >
                <Quote className="h-8 w-8 text-primary/30 mb-4" />
                <p className="text-foreground leading-relaxed flex-grow mb-6">"{t.content}"</p>
                <div className="flex items-center gap-3">
                  <img src={t.image} alt={t.name} className="h-11 w-11 rounded-full object-cover ring-2 ring-primary/20" />
                  <div>
                    <p className="font-semibold text-foreground text-sm">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
                <div className="flex gap-1 mt-3">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-secondary text-secondary" />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing / CTA section ── */}
      <section ref={ctaRef} className="section-padding relative overflow-hidden">
        <div className="absolute -top-40 right-0 w-[500px] h-[500px] bg-secondary/[0.05] rounded-full blur-3xl" />

        <div className="container-narrow max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Badge className="mb-4 bg-secondary/10 text-secondary border-secondary/30">
              <Sparkles className="h-3 w-3 mr-1" /> Limited Launch Offer
            </Badge>

            <h2 className="font-serif text-3xl sm:text-4xl font-semibold mb-6">
              Start Your Leadership Transformation Today
            </h2>

            {/* Price card */}
            <div className="relative rounded-2xl border-2 border-secondary bg-card p-8 sm:p-10 shadow-xl shadow-secondary/10 max-w-lg mx-auto">
              <Badge variant="secondary" className="absolute -top-3 left-1/2 -translate-x-1/2 shadow-lg shadow-secondary/30 px-4">
                <Sparkles className="h-3 w-3 mr-1" /> Most Popular
              </Badge>

              <h3 className="font-serif text-xl font-semibold text-foreground mb-1">Self-Paced Mastery</h3>
              <p className="text-sm text-muted-foreground mb-6">Full access to all 33 modules at your own pace</p>

              <div className="flex items-baseline justify-center gap-3 mb-2">
                <span className="text-5xl font-bold text-foreground">£1,297</span>
                <span className="text-xl text-muted-foreground line-through">£1,497</span>
              </div>

              <p className="text-sm text-muted-foreground mb-6">
                Or 3 interest-free instalments of <span className="font-semibold text-foreground">£433</span>
              </p>

              <ul className="text-left space-y-3 mb-8">
                {[
                  "All 33 modules (80+ hours of content)",
                  "66 CPD points upon completion",
                  "Downloadable workbooks & templates",
                  "Real-world case studies & action plans",
                  "Certificate of completion",
                  "Lifetime access to materials",
                  "With further discounts off all training courses",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm text-foreground">
                    <CheckCircle className="h-4 w-4 text-secondary flex-shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <Button
                size="lg"
                variant="hero"
                className="w-full text-lg py-6 shadow-lg shadow-secondary/30"
                asChild
              >
                <a href={THINKIFIC_LINK} target="_blank" rel="noopener noreferrer">
                  Enrol Now — Save £200 <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>

              {/* Trust signals */}
              <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Award className="h-3 w-3 text-primary" /> CPD accredited</span>
              </div>

              {/* Brochure download */}
              <div className="mt-5">
                <Button variant="outline" size="sm" asChild className="gap-2">
                  <Link to="/brochures">
                    <FileText className="h-4 w-4" />
                    Download Course Brochure
                  </Link>
                </Button>
              </div>
            </div>

            {/* Countdown reminder */}
            {!expired && (
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="mt-8 inline-flex items-center gap-3 rounded-full bg-destructive/10 border border-destructive/20 px-5 py-2"
              >
                <Clock className="h-4 w-4 text-destructive" />
                <span className="text-sm font-semibold text-destructive">
                  Offer expires in {timeLeft.h}h {timeLeft.m}m {timeLeft.s}s
                </span>
              </motion.div>
            )}

            {/* Quiz trigger */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="mt-10"
            >
              <div className="inline-flex flex-col items-center gap-3 rounded-2xl border border-primary/20 bg-primary/5 px-6 py-5 max-w-lg mx-auto">
                <ClipboardCheck className="h-6 w-6 text-primary" />
                <p className="text-sm text-foreground font-medium leading-relaxed">
                  Not sure if this programme is right for you? Save time and money by finding out before you buy.
                </p>
                <Button
                  variant="outline"
                  size="default"
                  className="border-primary/30 text-primary hover:bg-primary/10"
                  onClick={() => setQuizOpen(true)}
                >
                  Take the 60-Second Readiness Quiz
                </Button>
              </div>
            </motion.div>

            <ReadinessQuizModal open={quizOpen} onOpenChange={setQuizOpen} />
          </motion.div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="section-padding bg-muted/30">
        <div className="container-narrow max-w-3xl mx-auto">
          <h2 className="font-serif text-3xl font-semibold text-center mb-10">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {[
              {
                q: "Who is this programme for?",
                a: "Senior executives, directors, and high-potential leaders preparing for or already in C-suite roles.",
              },
              {
                q: "How long do I have access?",
                a: "Lifetime access. Learn at your own pace — revisit modules whenever you need a refresher.",
              },
              {
                q: "Is there a guarantee?",
                a: "We're confident in the quality of our programme. If you have any concerns, please contact us before enrolling and we'll be happy to discuss.",
              },
              {
                q: "What are CPD points?",
                a: "Continuing Professional Development points are internationally recognised and demonstrate your commitment to ongoing professional growth.",
              },
              {
                q: "Can I upgrade to coaching later?",
                a: "Absolutely. You can upgrade to Group Coaching or 1:1 Executive Coaching at any time by contacting us.",
              },
            ].map((faq, i) => (
              <FaqItem key={i} question={faq.q} answer={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="py-16 bg-gradient-to-r from-primary via-primary to-primary/95 text-primary-foreground">
        <div className="container-narrow text-center max-w-2xl mx-auto">
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold mb-4">
            Ready to Lead at the Highest Level?
          </h2>
          <p className="text-primary-foreground/80 mb-8">
            Join 2,400+ leaders who have transformed their careers with our CPD-accredited programme.
          </p>
          <Button size="lg" variant="hero" className="text-lg px-10 py-6" asChild>
            <a href={THINKIFIC_LINK} target="_blank" rel="noopener noreferrer">
              Get Started Now <ArrowRight className="ml-2 h-5 w-5" />
            </a>
          </Button>
        </div>
      </section>

      {/* ── Minimal footer ── */}
      <footer className="py-6 border-t border-border/30 text-center text-xs text-muted-foreground">
        <p>© {new Date().getFullYear()} Bright Leadership Consulting. All rights reserved.</p>
      </footer>
    </div>
  );
};

// ── FAQ accordion item ──
const FaqItem = ({ question, answer }: { question: string; answer: string }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left"
      >
        <span className="font-semibold text-foreground pr-4">{question}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="h-5 w-5 text-muted-foreground flex-shrink-0" />
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Masterclass;
