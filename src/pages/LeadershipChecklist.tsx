import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, Target, TrendingUp, Award, Save, Loader2, LogIn, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useChecklistProgress } from "@/hooks/useChecklistProgress";
import SocialShare from "@/components/SocialShare";
import AnimatedSection from "@/components/AnimatedSection";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ChecklistHero from "@/components/heroes/ChecklistHero";

interface ChecklistItem {
  id: string;
  text: string;
}

interface ChecklistSection {
  title: string;
  subtitle: string;
  items: ChecklistItem[];
}

const checklistData: ChecklistSection[] = [
  {
    title: "1. Communication Mastery",
    subtitle: "Great leaders don't just speak; they ensure they are understood.",
    items: [
      { id: "comm-1", text: "I practice active listening. I listen to understand rather than to respond, giving my full attention without interrupting." },
      { id: "comm-2", text: "I clearly articulate the \"why.\" When assigning tasks, I explain the purpose and impact behind the work." },
      { id: "comm-3", text: "I adapt my communication style. I adjust my tone and delivery method based on the individual needs of my team members." },
      { id: "comm-4", text: "I encourage open dialogue. I create a safe space where team members feel comfortable voicing concerns or dissenting opinions." },
    ],
  },
  {
    title: "2. Emotional Intelligence (EQ)",
    subtitle: "Leadership is about managing people, and people are emotional beings.",
    items: [
      { id: "eq-1", text: "I am self-aware. I recognize my own emotional triggers and understand how my mood affects the team." },
      { id: "eq-2", text: "I practice empathy. I actively try to understand my team members' perspectives and challenges before judging performance." },
      { id: "eq-3", text: "I manage stress effectively. I remain calm under pressure and do not project anxiety onto my team." },
      { id: "eq-4", text: "I accept feedback graciously. I view constructive criticism as an opportunity to grow rather than a personal attack." },
    ],
  },
  {
    title: "3. Decisive Action & Problem Solving",
    subtitle: "In the face of uncertainty, a leader provides direction.",
    items: [
      { id: "action-1", text: "I avoid \"analysis paralysis.\" I gather necessary data but make timely decisions even when information is imperfect." },
      { id: "action-2", text: "I focus on solutions, not blame. When problems arise, my energy goes toward fixing the issue rather than finding a scapegoat." },
      { id: "action-3", text: "I delegate effectively. I trust my team with responsibility and avoid micromanaging their process." },
      { id: "action-4", text: "I own the outcomes. I take full responsibility for my team's failures while giving them credit for the successes." },
    ],
  },
  {
    title: "4. Team Building & Development",
    subtitle: "A leader's legacy is the success of those they lead.",
    items: [
      { id: "team-1", text: "I recognize achievements. I regularly give specific, positive feedback to acknowledge good work." },
      { id: "team-2", text: "I invest in growth. I actively identify development opportunities and training for my direct reports." },
      { id: "team-3", text: "I foster collaboration. I break down silos and encourage cross-functional cooperation among team members." },
      { id: "team-4", text: "I build trust. I am transparent, keep my promises, and act with integrity in all interactions." },
    ],
  },
  {
    title: "5. Strategic Thinking",
    subtitle: "Management focuses on today; leadership focuses on tomorrow.",
    items: [
      { id: "strategy-1", text: "I align daily work with long-term goals. I ensure every project connects to the organization's broader vision." },
      { id: "strategy-2", text: "I anticipate change. I stay informed about industry trends and prepare my team for future shifts." },
      { id: "strategy-3", text: "I prioritize high-impact tasks. I know the difference between \"urgent\" and \"important\" and focus my energy accordingly." },
      { id: "strategy-4", text: "I innovate. I challenge the status quo and encourage my team to suggest process improvements." },
    ],
  },
];

const getScoreLevel = (score: number) => {
  if (score >= 16) {
    return {
      level: "Leadership Master",
      description: "You are operating at a high level. Focus on mentoring others and sharing your expertise.",
      icon: Award,
      color: "text-score-master-foreground",
      bgColor: "bg-score-master-bg",
      borderColor: "border-score-master-border",
    };
  } else if (score >= 11) {
    return {
      level: "Emerging Leader",
      description: "You have a strong foundation but need consistency in key areas. Keep developing!",
      icon: TrendingUp,
      color: "text-score-emerging-foreground",
      bgColor: "bg-score-emerging-bg",
      borderColor: "border-score-emerging-border",
    };
  } else {
    return {
      level: "Aspiring Leader",
      description: "Prioritize foundational skills training immediately. Every expert was once a beginner!",
      icon: Target,
      color: "text-score-aspiring-foreground",
      bgColor: "bg-score-aspiring-bg",
      borderColor: "border-score-aspiring-border",
    };
  }
};

const LeadershipChecklist = () => {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [showResults, setShowResults] = useState(false);
  const [hasLoadedProgress, setHasLoadedProgress] = useState(false);
  const { user, isLoading, isSaving, lastSaved, loadProgress, saveProgress } = useChecklistProgress();

  const totalItems = checklistData.reduce((acc, section) => acc + section.items.length, 0);
  const score = checkedItems.size;
  const progress = (score / totalItems) * 100;
  const scoreLevel = useMemo(() => getScoreLevel(score), [score]);

  useEffect(() => {
    if (user && !hasLoadedProgress) {
      loadProgress().then((savedItems) => {
        if (savedItems && savedItems.length > 0) {
          setCheckedItems(new Set(savedItems));
        }
        setHasLoadedProgress(true);
      });
    }
  }, [user, hasLoadedProgress, loadProgress]);

  const handleToggle = (itemId: string) => {
    setCheckedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const handleReset = () => {
    setCheckedItems(new Set());
    setShowResults(false);
  };

  const handleShowResults = async () => {
    if (user) {
      await saveProgress(Array.from(checkedItems), score);
    }
    setShowResults(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSaveProgress = async () => {
    await saveProgress(Array.from(checkedItems), score);
  };

  const ScoreIcon = scoreLevel.icon;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <ChecklistHero 
        isLoggedIn={!!user} 
        hasLastSaved={!!lastSaved} 
      />

      {/* Progress Bar */}
      <div className="sticky top-20 left-0 right-0 z-40 border-b border-border/50 bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3 sm:gap-4">
            <span className="text-xs sm:text-sm font-medium text-foreground">
              {score} / {totalItems}
            </span>
            <Progress value={progress} className="w-24 sm:w-40 h-2.5" />
            <span className="text-xs text-muted-foreground hidden sm:inline">
              {Math.round(progress)}% complete
            </span>
          </div>
          {user ? (
            <Button
              variant="outline"
              size="sm"
              onClick={handleSaveProgress}
              disabled={isSaving}
              className="rounded-xl"
            >
              {isSaving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Save Progress
            </Button>
          ) : (
            <Link to="/admin/login">
              <Button variant="outline" size="sm" className="rounded-xl">
                <LogIn className="mr-2 h-4 w-4" />
                Sign in to save
              </Button>
            </Link>
          )}
        </div>
      </div>

      <main className="container mx-auto px-4 py-10 md:py-16 max-w-4xl">

        {/* Results Card */}
        {showResults && (
          <AnimatedSection>
            <div className={cn("mb-12 rounded-3xl border-2 p-8 md:p-12 text-center overflow-hidden relative", scoreLevel.borderColor, scoreLevel.bgColor)}>
              <div className="absolute -top-20 -right-20 w-48 h-48 bg-primary/5 rounded-full blur-3xl" />
              <div className={cn("mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-2xl shadow-lg", scoreLevel.bgColor)}>
                <ScoreIcon className={cn("h-10 w-10", scoreLevel.color)} />
              </div>
              <h2 className={cn("text-3xl md:text-4xl font-bold mb-2", scoreLevel.color)}>
                {scoreLevel.level}
              </h2>
              <p className="text-lg text-muted-foreground mb-2">
                You scored <span className="font-bold text-foreground">{score}</span> out of {totalItems}
              </p>
              <p className="text-muted-foreground mb-8 max-w-lg mx-auto">{scoreLevel.description}</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
                <Button variant="outline" onClick={handleReset} className="rounded-xl">
                  Reset & Try Again
                </Button>
                <Link to="/#contact">
                  <Button variant="teal" className="rounded-xl group">
                    Get Leadership Coaching
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
              <SocialShare
                title="Leadership Skills Assessment"
                text={`I scored ${score}/${totalItems} on the Leadership Skills Checklist and achieved "${scoreLevel.level}" level! Take the assessment to discover your leadership strengths.`}
                url={`${window.location.origin}/leadership-checklist`}
              />
            </div>
          </AnimatedSection>
        )}

        {/* Scoring Guide */}
        {!showResults && (
          <AnimatedSection>
            <div className="mb-12 rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm overflow-hidden shadow-sm">
              <div className="p-6 border-b border-border/50 bg-muted/30">
                <h3 className="text-lg font-semibold font-serif">Scoring Guide</h3>
              </div>
              <div className="p-6">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-score-master-bg border border-score-master-border">
                    <Award className="h-5 w-5 text-score-master mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-score-master-foreground">16-20 Checks</p>
                      <p className="text-sm text-score-master">Leadership Master</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-score-emerging-bg border border-score-emerging-border">
                    <TrendingUp className="h-5 w-5 text-score-emerging mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-score-emerging-foreground">11-15 Checks</p>
                      <p className="text-sm text-score-emerging">Emerging Leader</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-score-aspiring-bg border border-score-aspiring-border">
                    <Target className="h-5 w-5 text-score-aspiring mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-score-aspiring-foreground">0-10 Checks</p>
                      <p className="text-sm text-score-aspiring">Aspiring Leader</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        )}

        {/* Checklist Sections */}
        <div className="space-y-8">
          {checklistData.map((section, sectionIndex) => (
            <AnimatedSection key={section.title} delay={sectionIndex * 50}>
              <div className="rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="p-6 md:p-8 bg-gradient-to-r from-muted/50 to-muted/30 border-b border-border/50">
                  <h3 className="font-serif text-xl md:text-2xl font-semibold text-foreground">{section.title}</h3>
                  <p className="text-muted-foreground mt-1 italic">{section.subtitle}</p>
                </div>
                <ul className="divide-y divide-border/50">
                  {section.items.map((item) => {
                    const isChecked = checkedItems.has(item.id);
                    return (
                      <li
                        key={item.id}
                        className={cn(
                          "flex items-start gap-4 p-5 md:p-6 transition-all cursor-pointer hover:bg-muted/20",
                          isChecked && "bg-primary/5"
                        )}
                        onClick={() => handleToggle(item.id)}
                      >
                        <Checkbox
                          id={item.id}
                          checked={isChecked}
                          onCheckedChange={() => handleToggle(item.id)}
                          onClick={(e) => e.stopPropagation()}
                          className="mt-1 h-5 w-5 flex-shrink-0 rounded-md"
                        />
                        <label
                          htmlFor={item.id}
                          className={cn(
                            "text-sm md:text-base cursor-pointer select-none transition-colors leading-relaxed",
                            isChecked ? "text-foreground" : "text-muted-foreground"
                          )}
                        >
                          {item.text}
                        </label>
                        {isChecked && (
                          <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 ml-auto" />
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </AnimatedSection>
          ))}
        </div>

        {/* Submit Button */}
        <div className="mt-12 text-center">
          <Button
            variant="teal"
            size="xl"
            onClick={handleShowResults}
            className="px-10 rounded-xl group shadow-lg shadow-primary/20"
          >
            View My Results
            <CheckCircle2 className="ml-2 h-5 w-5" />
          </Button>
          {score > 0 && !showResults && (
            <p className="mt-4 text-sm text-muted-foreground">
              Current score: <span className="font-semibold text-foreground">{score}</span> / {totalItems}
            </p>
          )}
        </div>
      </main>

      {/* Footer CTA */}
      <section className="relative overflow-hidden border-t border-border bg-muted/30 py-16 mt-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(var(--primary)/0.04),transparent_60%)]" />
        <div className="container mx-auto px-4 text-center relative">
          <h2 className="font-serif text-2xl md:text-3xl font-semibold text-foreground mb-4">
            Ready to Fill the Gaps in Your Checklist?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto leading-relaxed">
            Take the next step in your professional journey with our Executive Leadership Mastery Program.
          </p>
          <Link to="/#contact">
            <Button variant="teal" size="lg" className="rounded-xl group shadow-lg shadow-primary/20">
              Get Started Today
              <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default LeadershipChecklist;
