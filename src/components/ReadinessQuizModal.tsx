import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, CheckCircle2, Sparkles, ShieldCheck, Award, Zap } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import {
  readinessQuizQuestions,
  getRecommendation,
  tierDetails,
  type TierRecommendation,
} from "@/data/readinessQuizQuestions";

interface ReadinessQuizModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type Step = "intro" | "questions" | "email" | "result";

const ReadinessQuizModal = ({ open, onOpenChange }: ReadinessQuizModalProps) => {
  const [step, setStep] = useState<Step>("intro");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, { value: string; score: number }>>({});
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recommendation, setRecommendation] = useState<TierRecommendation | null>(null);

  const totalQuestions = readinessQuizQuestions.length;
  const progress = step === "intro" ? 0 : step === "questions" ? ((currentQuestion + 1) / totalQuestions) * 80 : step === "email" ? 90 : 100;

  const reset = () => {
    setStep("intro");
    setCurrentQuestion(0);
    setAnswers({});
    setEmail("");
    setName("");
    setRecommendation(null);
  };

  const handleClose = (open: boolean) => {
    if (!open) reset();
    onOpenChange(open);
  };

  const handleAnswer = (questionId: string, value: string, score: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: { value, score } }));
  };

  const handleNext = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion((p) => p + 1);
    } else {
      setStep("email");
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) setCurrentQuestion((p) => p - 1);
    else setStep("intro");
  };

  const handleSubmit = async () => {
    if (!email.trim()) return;
    setIsSubmitting(true);

    const totalScore = Object.values(answers).reduce((sum, a) => sum + a.score, 0);
    const rec = getRecommendation(totalScore);
    setRecommendation(rec);

    try {
      const answersJson: Record<string, string> = {};
      Object.entries(answers).forEach(([k, v]) => {
        answersJson[k] = v.value;
      });

      await supabase.from("readiness_quiz_results").insert({
        email: email.trim(),
        name: name.trim() || null,
        answers: answersJson,
        recommended_tier: rec,
        total_score: totalScore,
      });
    } catch {
      // silently fail — don't block the user experience
    }

    setIsSubmitting(false);
    setStep("result");
  };

  const currentQ = readinessQuizQuestions[currentQuestion];
  const currentAnswer = currentQ ? answers[currentQ.id]?.value : undefined;

  const tierResultColors: Record<TierRecommendation, string> = {
    "self-paced": "from-primary/20 to-primary/5",
    "group-coaching": "from-secondary/20 to-secondary/5",
    "executive-coaching": "from-primary/30 via-secondary/10 to-primary/5",
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg sm:max-w-xl p-0 overflow-hidden border-primary/20 shadow-2xl shadow-primary/10">
        {/* Decorative top gradient bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-primary via-secondary to-primary" />

        {/* Step progress dots */}
        <div className="px-6 pt-5 flex items-center justify-center gap-2">
          {["intro", "questions", "email", "result"].map((s, i) => {
            const stepOrder = ["intro", "questions", "email", "result"];
            const currentIdx = stepOrder.indexOf(step);
            const isActive = i <= currentIdx;
            return (
              <div key={s} className="flex items-center gap-2">
                <motion.div
                  className={`h-2.5 rounded-full transition-all duration-500 ${
                    i === currentIdx
                      ? "w-8 bg-gradient-to-r from-primary to-secondary"
                      : isActive
                      ? "w-2.5 bg-primary/60"
                      : "w-2.5 bg-muted-foreground/20"
                  }`}
                  layout
                />
              </div>
            );
          })}
        </div>

        <div className="px-6 pb-6 pt-4 min-h-[420px] flex flex-col">
          <AnimatePresence mode="wait">
            {/* INTRO */}
            {step === "intro" && (
              <motion.div
                key="intro"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col flex-grow"
              >
                <DialogHeader className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                      <Zap className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <span className="text-xs font-semibold tracking-wider uppercase text-primary">
                      60-Second Assessment
                    </span>
                  </div>
                  <DialogTitle className="font-serif text-2xl leading-tight">
                    Is This Programme Right for You?
                  </DialogTitle>
                  <DialogDescription className="text-base mt-2 leading-relaxed">
                    Save time and money — discover which tier matches your goals before you invest.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-3 mb-8 flex-grow">
                  {[
                    { icon: CheckCircle2, color: "text-primary", text: "6 quick questions about your goals and experience" },
                    { icon: Sparkles, color: "text-secondary", text: "Get a personalised tier recommendation" },
                    { icon: ShieldCheck, color: "text-primary", text: "No obligation — just honest guidance" },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.15 + i * 0.1 }}
                      className="flex items-center gap-3 text-sm text-muted-foreground rounded-lg border border-border/40 bg-muted/20 px-4 py-3"
                    >
                      <item.icon className={`h-4 w-4 ${item.color} flex-shrink-0`} />
                      <span>{item.text}</span>
                    </motion.div>
                  ))}
                </div>

                <Button
                  variant="hero"
                  size="lg"
                  className="w-full"
                  onClick={() => setStep("questions")}
                >
                  Find Out in 60 Seconds
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
                <Button
                  variant="ghost"
                  className="w-full text-muted-foreground text-sm mt-1"
                  asChild
                >
                  <a
                    href="https://bright-leadership-consulting.thinkific.com/courses/copy-of-executive-leadership-mastery-program"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handleClose(false)}
                  >
                    Skip — I'm ready to enrol
                  </a>
                </Button>
              </motion.div>
            )}

            {/* QUESTIONS */}
            {step === "questions" && currentQ && (
              <motion.div
                key={`q-${currentQuestion}`}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.25 }}
                className="flex flex-col flex-grow"
              >
                <DialogHeader className="mb-1">
                  <DialogTitle className="sr-only">Readiness Quiz</DialogTitle>
                  <DialogDescription className="sr-only">Answer the following question</DialogDescription>
                </DialogHeader>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-medium text-muted-foreground bg-muted/40 px-3 py-1 rounded-full">
                    {currentQuestion + 1} of {totalQuestions}
                  </span>
                  <div className="flex gap-1">
                    {Array.from({ length: totalQuestions }).map((_, i) => (
                      <div
                        key={i}
                        className={`h-1 w-6 rounded-full transition-all duration-300 ${
                          i < currentQuestion
                            ? "bg-primary"
                            : i === currentQuestion
                            ? "bg-gradient-to-r from-primary to-secondary"
                            : "bg-muted-foreground/15"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <h3 className="font-serif text-lg font-semibold text-foreground mb-5">
                  {currentQ.question}
                </h3>

                <RadioGroup
                  value={currentAnswer || ""}
                  onValueChange={(val) => {
                    const opt = currentQ.options.find((o) => o.value === val);
                    if (opt) handleAnswer(currentQ.id, opt.value, opt.score);
                  }}
                  className="space-y-2.5 flex-grow"
                >
                  {currentQ.options.map((opt, i) => (
                    <motion.label
                      key={opt.value}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.06 }}
                      className={`flex items-center gap-3 rounded-xl border-2 px-4 py-3.5 cursor-pointer transition-all duration-200 ${
                        currentAnswer === opt.value
                          ? "border-primary bg-primary/8 shadow-sm shadow-primary/10"
                          : "border-border/40 hover:border-primary/30 hover:bg-muted/30"
                      }`}
                    >
                      <RadioGroupItem value={opt.value} />
                      <span className="text-sm text-foreground leading-snug">{opt.label}</span>
                    </motion.label>
                  ))}
                </RadioGroup>

                <div className="flex gap-3 mt-6">
                  <Button variant="outline" onClick={handleBack} className="flex-1">
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Back
                  </Button>
                  <Button
                    variant="hero"
                    onClick={handleNext}
                    disabled={!currentAnswer}
                    className="flex-1"
                  >
                    {currentQuestion < totalQuestions - 1 ? "Next" : "See My Results"}
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* EMAIL CAPTURE */}
            {step === "email" && (
              <motion.div
                key="email"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col flex-grow"
              >
                <DialogHeader className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-secondary to-secondary/60 flex items-center justify-center">
                      <Sparkles className="h-5 w-5 text-secondary-foreground" />
                    </div>
                    <span className="text-xs font-semibold tracking-wider uppercase text-secondary">
                      Almost Done
                    </span>
                  </div>
                  <DialogTitle className="font-serif text-xl">
                    Where Should We Send Your Results?
                  </DialogTitle>
                  <DialogDescription className="text-sm mt-2">
                    Enter your details to see your personalised recommendation. We'll also send a summary to review later.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 flex-grow">
                  <div>
                    <Label htmlFor="quiz-name" className="text-sm font-medium">First Name (optional)</Label>
                    <Input
                      id="quiz-name"
                      placeholder="e.g. Sarah"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label htmlFor="quiz-email" className="text-sm font-medium">Email Address *</Label>
                    <Input
                      id="quiz-email"
                      type="email"
                      placeholder="you@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="mt-1.5"
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <Button variant="outline" onClick={() => setStep("questions")} className="flex-1">
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Back
                  </Button>
                  <Button
                    variant="hero"
                    onClick={handleSubmit}
                    disabled={!email.trim() || isSubmitting}
                    className="flex-1"
                  >
                    {isSubmitting ? "Analysing…" : "Show My Recommendation"}
                    <Sparkles className="h-4 w-4 ml-1" />
                  </Button>
                </div>

                <p className="text-xs text-muted-foreground text-center mt-3">
                  We respect your privacy. Unsubscribe anytime.
                </p>
              </motion.div>
            )}

            {/* RESULT */}
            {step === "result" && recommendation && (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, type: "spring", damping: 20 }}
                className="flex flex-col flex-grow text-center"
              >
                <DialogHeader className="mb-2">
                  <DialogTitle className="sr-only">Your Recommendation</DialogTitle>
                  <DialogDescription className="sr-only">Based on your quiz answers</DialogDescription>
                </DialogHeader>

                <div className={`mb-5 rounded-2xl bg-gradient-to-br ${tierResultColors[recommendation]} p-6`}>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", damping: 12 }}
                    className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-secondary mb-4 shadow-lg shadow-primary/20"
                  >
                    <Award className="h-8 w-8 text-primary-foreground" />
                  </motion.div>
                  <motion.p
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-xs font-semibold tracking-wider uppercase text-primary mb-2"
                  >
                    Your recommended tier
                  </motion.p>
                  <motion.h3
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="font-serif text-2xl font-bold text-foreground"
                  >
                    {tierDetails[recommendation].name}
                  </motion.h3>
                </div>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-sm text-muted-foreground leading-relaxed mb-6 max-w-md mx-auto"
                >
                  {tierDetails[recommendation].description}
                </motion.p>

                <div className="space-y-3 mt-auto">
                  <Button
                    variant="hero"
                    size="lg"
                    className="w-full"
                    asChild
                  >
                    <a
                      href={tierDetails[recommendation].ctaLink}
                      target={tierDetails[recommendation].ctaLink.startsWith("http") ? "_blank" : undefined}
                      rel={tierDetails[recommendation].ctaLink.startsWith("http") ? "noopener noreferrer" : undefined}
                      onClick={() => handleClose(false)}
                    >
                      {tierDetails[recommendation].ctaText}
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </a>
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full text-muted-foreground"
                    onClick={() => handleClose(false)}
                  >
                    I'll decide later
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReadinessQuizModal;
