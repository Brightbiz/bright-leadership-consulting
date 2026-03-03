import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, BarChart3, Target, Sparkles, Brain, Users, Cpu, CheckCircle, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import AnimatedSection from "@/components/AnimatedSection";
import { skillsGapQuestions, analyseResults, type SkillResult } from "@/data/skillsGapQuestions";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const categoryLabels = {
  human: { label: "Human Skills", icon: Users, color: "text-primary" },
  strategic: { label: "Strategic Skills", icon: Target, color: "text-secondary" },
  "ai-ready": { label: "AI-Ready Skills", icon: Cpu, color: "text-primary" },
};

const levelColors = {
  Gap: "bg-destructive/20 text-destructive border-destructive/30",
  Developing: "bg-orange-500/20 text-orange-600 border-orange-500/30",
  Proficient: "bg-primary/20 text-primary border-primary/30",
  Advanced: "bg-secondary/20 text-secondary border-secondary/30",
};

const SkillsGapAssessment = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [leadCaptured, setLeadCaptured] = useState(false);

  const question = skillsGapQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / skillsGapQuestions.length) * 100;
  const isLastQuestion = currentQuestion === skillsGapQuestions.length - 1;

  const handleAnswer = (score: number) => {
    const newAnswers = { ...answers, [question.id]: score };
    setAnswers(newAnswers);

    if (isLastQuestion) {
      setShowResults(true);
    } else {
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) setCurrentQuestion((prev) => prev - 1);
  };

  const handleLeadCapture = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await supabase.from("lead_magnet_downloads").insert({
        email,
        name,
        lead_magnet_name: "Skills Gap Assessment 2026",
      });
      setLeadCaptured(true);
      toast.success("Results saved! Check your recommendations below.");
    } catch {
      setLeadCaptured(true);
    }
  };

  const results = showResults ? analyseResults(answers) : null;

  if (showResults && results) {
    return (
      <div className="min-h-screen bg-background">
        <SEOHead title="Your Skills Gap Results" description="Your personalised leadership skills gap analysis based on LinkedIn's 2026 rising skills." path="/skills-assessment" />
        <Header />
        <main className="pt-28 pb-20">
          <div className="container-narrow max-w-3xl mx-auto">
            <AnimatedSection className="text-center mb-12">
              <Badge className="mb-4 bg-secondary/10 text-secondary border-secondary/30">
                <BarChart3 className="h-3 w-3 mr-1" /> Your Results
              </Badge>
              <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-foreground mb-4">
                Your Leadership Skills Gap Analysis
              </h1>
              <p className="text-muted-foreground text-lg">
                Based on LinkedIn's 2026 fastest-rising skills framework
              </p>
            </AnimatedSection>

            {/* Overall Score */}
            <AnimatedSection delay={100}>
              <div className="rounded-2xl bg-gradient-to-br from-primary via-primary/95 to-primary/90 p-8 text-center mb-8 shadow-xl">
                <p className="text-primary-foreground/70 text-sm uppercase tracking-wider mb-2">Overall Score</p>
                <p className="text-5xl font-bold text-primary-foreground mb-2">
                  {results.overallScore} <span className="text-2xl text-primary-foreground/60">/ {results.maxScore}</span>
                </p>
                <p className="text-primary-foreground/80">
                  {results.overallScore >= 28 ? "Advanced Leader" : results.overallScore >= 20 ? "Developing Leader" : "Emerging Leader"}
                </p>
              </div>
            </AnimatedSection>

            {/* Skill Breakdown */}
            <AnimatedSection delay={200}>
              <h2 className="font-serif text-2xl font-semibold mb-6">Skill-by-Skill Breakdown</h2>
              <div className="space-y-4 mb-10">
                {results.results.map((result, i) => {
                  const catInfo = categoryLabels[result.category];
                  return (
                    <motion.div
                      key={result.skill}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border/50"
                    >
                      <catInfo.icon className={`h-5 w-5 ${catInfo.color} flex-shrink-0`} />
                      <div className="flex-grow min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-medium text-foreground text-sm truncate">{result.skill}</p>
                          <Badge variant="outline" className={`text-xs ${levelColors[result.level]} ml-2 flex-shrink-0`}>
                            {result.level}
                          </Badge>
                        </div>
                        <Progress value={(result.score / result.maxScore) * 100} className="h-2" />
                      </div>
                      <span className="text-sm font-bold text-muted-foreground flex-shrink-0">{result.score}/4</span>
                    </motion.div>
                  );
                })}
              </div>
            </AnimatedSection>

            {/* Top Gaps */}
            <AnimatedSection delay={300}>
              <div className="rounded-2xl bg-destructive/5 border border-destructive/20 p-6 mb-10">
                <h3 className="font-semibold text-foreground flex items-center gap-2 mb-4">
                  <Target className="h-5 w-5 text-destructive" />
                  Your Top Development Priorities
                </h3>
                <div className="space-y-3">
                  {results.topGaps.map((gap) => (
                    <div key={gap.skill} className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-destructive flex-shrink-0" />
                      <span className="text-foreground text-sm">{gap.skill}</span>
                      <Badge variant="outline" className={`text-xs ${levelColors[gap.level]} ml-auto`}>
                        {gap.level}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>

            {/* Recommended Course */}
            <AnimatedSection delay={400}>
              <div className="rounded-2xl bg-gradient-to-br from-secondary/10 to-primary/10 border-2 border-secondary/30 p-8 text-center mb-10">
                <Sparkles className="h-8 w-8 text-secondary mx-auto mb-3" />
                <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
                  Recommended For You
                </h3>
                <p className="text-lg font-medium text-secondary mb-2">{results.recommendedCourse.name}</p>
                <p className="text-sm text-muted-foreground mb-6">
                  Based on your skills profile, this programme addresses your biggest development areas.
                </p>
                <Button variant="hero" size="lg" className="shadow-lg shadow-secondary/30" asChild>
                  <a href={results.recommendedCourse.link} target="_blank" rel="noopener noreferrer">
                    Explore This Programme
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </a>
                </Button>
              </div>
            </AnimatedSection>

            {/* Lead Capture */}
            {!leadCaptured && (
              <AnimatedSection delay={500}>
                <div className="rounded-2xl bg-card border border-border/50 p-8 text-center">
                  <h3 className="font-semibold text-foreground mb-2">Save Your Results & Get Our Free Guide</h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    Enter your details to save your skills gap analysis and receive our "5 Leadership Secrets" PDF.
                  </p>
                  <form onSubmit={handleLeadCapture} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
                    <input
                      type="text"
                      placeholder="Your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="flex-1 px-4 py-3 rounded-xl bg-background border border-border/50 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                    <input
                      type="email"
                      placeholder="Your email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex-1 px-4 py-3 rounded-xl bg-background border border-border/50 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                    <Button type="submit" variant="default">
                      <Download className="h-4 w-4 mr-2" /> Save Results
                    </Button>
                  </form>
                </div>
              </AnimatedSection>
            )}

            {leadCaptured && (
              <AnimatedSection delay={500}>
                <div className="rounded-2xl bg-primary/5 border border-primary/20 p-6 text-center">
                  <CheckCircle className="h-8 w-8 text-primary mx-auto mb-2" />
                  <p className="text-foreground font-medium">Results saved! Your free guide is on its way.</p>
                </div>
              </AnimatedSection>
            )}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Leadership Skills Gap Assessment"
        description="Discover your leadership skill gaps based on LinkedIn's 2026 fastest-rising skills. Free assessment with personalised course recommendations."
        path="/skills-assessment"
      />
      <Header />
      <main className="pt-28 pb-20">
        <div className="container-narrow max-w-2xl mx-auto">
          <AnimatedSection className="text-center mb-10">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/30">
              <Brain className="h-3 w-3 mr-1" /> Based on LinkedIn 2026 Data
            </Badge>
            <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-foreground mb-3">
              Leadership Skills Gap Assessment
            </h1>
            <p className="text-muted-foreground">
              Discover how your skills stack up against LinkedIn's fastest-rising skills for 2026.
            </p>
          </AnimatedSection>

          {/* Progress */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>Question {currentQuestion + 1} of {skillsGapQuestions.length}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Question */}
          <AnimatePresence mode="wait">
            <motion.div
              key={question.id}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.3 }}
            >
              <div className="rounded-2xl bg-card border border-border/50 p-8 shadow-lg">
                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="outline" className="capitalize text-xs">
                    {categoryLabels[question.category].label}
                  </Badge>
                  <span className="text-xs text-muted-foreground">· {question.skill}</span>
                </div>

                <h2 className="font-serif text-xl font-semibold text-foreground mb-6">
                  {question.question}
                </h2>

                <div className="space-y-3">
                  {question.options.map((option, i) => (
                    <button
                      key={i}
                      onClick={() => handleAnswer(option.score)}
                      className={`w-full text-left p-4 rounded-xl border transition-all duration-300 group hover:border-primary/50 hover:bg-primary/5 hover:shadow-md ${
                        answers[question.id] === option.score
                          ? "border-primary bg-primary/10 shadow-md"
                          : "border-border/50 bg-background"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-colors ${
                          answers[question.id] === option.score
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary"
                        }`}>
                          {String.fromCharCode(65 + i)}
                        </div>
                        <span className="text-sm text-foreground">{option.label}</span>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Navigation */}
                <div className="flex justify-between mt-8">
                  <Button
                    variant="ghost"
                    onClick={handleBack}
                    disabled={currentQuestion === 0}
                    className="gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" /> Back
                  </Button>
                  <span className="text-xs text-muted-foreground self-center">
                    Click an answer to continue
                  </span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SkillsGapAssessment;
