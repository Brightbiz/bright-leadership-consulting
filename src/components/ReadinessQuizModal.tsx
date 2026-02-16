import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, CheckCircle2, Sparkles, ShieldCheck } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
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

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg sm:max-w-xl p-0 overflow-hidden">
        {/* Progress bar */}
        <div className="px-6 pt-6">
          <Progress value={progress} className="h-1.5" />
        </div>

        <div className="px-6 pb-6 pt-4 min-h-[380px] flex flex-col">
          <AnimatePresence mode="wait">
            {/* INTRO */}
            {step === "intro" && (
              <motion.div
                key="intro"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col flex-grow"
              >
                <DialogHeader className="mb-6">
                  <DialogTitle className="font-serif text-2xl">
                    Is This Programme Right for You?
                  </DialogTitle>
                  <DialogDescription className="text-base mt-2 leading-relaxed">
                    This programme may not be for everyone. Save time and money by taking 60 seconds to discover whether the Executive Leadership Mastery Programme is the right fit for your goals — and which tier suits you best.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-3 mb-8 flex-grow">
                  <div className="flex items-start gap-3 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>6 quick questions about your goals and experience</span>
                  </div>
                  <div className="flex items-start gap-3 text-sm text-muted-foreground">
                    <Sparkles className="h-4 w-4 text-secondary mt-0.5 flex-shrink-0" />
                    <span>Get a personalised tier recommendation</span>
                  </div>
                  <div className="flex items-start gap-3 text-sm text-muted-foreground">
                    <ShieldCheck className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>No obligation — just honest guidance</span>
                  </div>
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
              </motion.div>
            )}

            {/* QUESTIONS */}
            {step === "questions" && currentQ && (
              <motion.div
                key={`q-${currentQuestion}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col flex-grow"
              >
                <DialogHeader className="mb-1">
                  <DialogTitle className="sr-only">Readiness Quiz</DialogTitle>
                  <DialogDescription className="sr-only">Answer the following question</DialogDescription>
                </DialogHeader>
                <p className="text-xs text-muted-foreground mb-2">
                  Question {currentQuestion + 1} of {totalQuestions}
                </p>
                <h3 className="font-serif text-lg font-semibold text-foreground mb-5">
                  {currentQ.question}
                </h3>

                <RadioGroup
                  value={currentAnswer || ""}
                  onValueChange={(val) => {
                    const opt = currentQ.options.find((o) => o.value === val);
                    if (opt) handleAnswer(currentQ.id, opt.value, opt.score);
                  }}
                  className="space-y-3 flex-grow"
                >
                  {currentQ.options.map((opt) => (
                    <label
                      key={opt.value}
                      className={`flex items-center gap-3 rounded-xl border-2 px-4 py-3 cursor-pointer transition-all duration-200 ${
                        currentAnswer === opt.value
                          ? "border-primary bg-primary/5"
                          : "border-border/50 hover:border-primary/30 hover:bg-muted/30"
                      }`}
                    >
                      <RadioGroupItem value={opt.value} />
                      <span className="text-sm text-foreground">{opt.label}</span>
                    </label>
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
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col flex-grow"
              >
                <DialogHeader className="mb-6">
                  <DialogTitle className="font-serif text-xl">
                    Almost There — Where Should We Send Your Results?
                  </DialogTitle>
                  <DialogDescription className="text-sm mt-2">
                    Enter your details to see your personalised recommendation. We'll also send you a summary to review later.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 flex-grow">
                  <div>
                    <Label htmlFor="quiz-name">First Name (optional)</Label>
                    <Input
                      id="quiz-name"
                      placeholder="e.g. Sarah"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="quiz-email">Email Address *</Label>
                    <Input
                      id="quiz-email"
                      type="email"
                      placeholder="you@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
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
                className="flex flex-col flex-grow text-center"
              >
                <DialogHeader className="mb-2">
                  <DialogTitle className="sr-only">Your Recommendation</DialogTitle>
                  <DialogDescription className="sr-only">Based on your quiz answers</DialogDescription>
                </DialogHeader>

                <div className="mb-4">
                  <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-primary/10 mb-3">
                    <CheckCircle2 className="h-7 w-7 text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">Your recommended tier:</p>
                  <h3 className="font-serif text-2xl font-bold text-foreground">
                    {tierDetails[recommendation].name}
                  </h3>
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed mb-6 max-w-md mx-auto">
                  {tierDetails[recommendation].description}
                </p>

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
