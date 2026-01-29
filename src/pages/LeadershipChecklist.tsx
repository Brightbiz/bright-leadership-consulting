import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Target, TrendingUp, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

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
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
    };
  } else if (score >= 11) {
    return {
      level: "Emerging Leader",
      description: "You have a strong foundation but need consistency in key areas. Keep developing!",
      icon: TrendingUp,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
    };
  } else {
    return {
      level: "Aspiring Leader",
      description: "Prioritize foundational skills training immediately. Every expert was once a beginner!",
      icon: Target,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    };
  }
};

const LeadershipChecklist = () => {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [showResults, setShowResults] = useState(false);

  const totalItems = checklistData.reduce((acc, section) => acc + section.items.length, 0);
  const score = checkedItems.size;
  const progress = (score / totalItems) * 100;
  const scoreLevel = useMemo(() => getScoreLevel(score), [score]);

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

  const handleShowResults = () => {
    setShowResults(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const ScoreIcon = scoreLevel.icon;

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/30 to-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <Link to="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {score} / {totalItems} checked
            </span>
            <Progress value={progress} className="w-24 h-2" />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 md:py-12">
        {/* Title Section */}
        <div className="mb-10 text-center">
          <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            The Ultimate Leadership Skills Checklist
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg">
            Honestly assess your current leadership strengths and areas for development. 
            Check each box where you feel confident, then view your score to understand where you stand.
          </p>
        </div>

        {/* Results Card (shown when showResults is true) */}
        {showResults && (
          <Card className={cn("mb-10 border-2", scoreLevel.borderColor, scoreLevel.bgColor)}>
            <CardHeader className="text-center pb-4">
              <div className={cn("mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full", scoreLevel.bgColor)}>
                <ScoreIcon className={cn("h-8 w-8", scoreLevel.color)} />
              </div>
              <CardTitle className={cn("text-2xl md:text-3xl", scoreLevel.color)}>
                {scoreLevel.level}
              </CardTitle>
              <CardDescription className="text-base mt-2">
                You scored <span className="font-bold text-foreground">{score}</span> out of {totalItems}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-6">{scoreLevel.description}</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button variant="outline" onClick={handleReset}>
                  Reset & Try Again
                </Button>
                <Link to="/#contact">
                  <Button variant="teal">
                    Get Leadership Coaching
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Scoring Guide */}
        {!showResults && (
          <Card className="mb-10 border-dashed">
            <CardHeader>
              <CardTitle className="text-lg">Scoring Guide</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                  <Award className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-emerald-700">16-20 Checks</p>
                    <p className="text-sm text-emerald-600">Leadership Master</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-50 border border-amber-200">
                  <TrendingUp className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-amber-700">11-15 Checks</p>
                    <p className="text-sm text-amber-600">Emerging Leader</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 border border-blue-200">
                  <Target className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-blue-700">0-10 Checks</p>
                    <p className="text-sm text-blue-600">Aspiring Leader</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Checklist Sections */}
        <div className="space-y-8">
          {checklistData.map((section) => (
            <Card key={section.title} className="overflow-hidden">
              <CardHeader className="bg-muted/50">
                <CardTitle className="font-serif text-xl md:text-2xl">{section.title}</CardTitle>
                <CardDescription className="text-base italic">{section.subtitle}</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <ul className="divide-y divide-border">
                  {section.items.map((item) => {
                    const isChecked = checkedItems.has(item.id);
                    return (
                      <li
                        key={item.id}
                        className={cn(
                          "flex items-start gap-4 p-4 md:p-6 transition-colors cursor-pointer hover:bg-muted/30",
                          isChecked && "bg-primary/5"
                        )}
                        onClick={() => handleToggle(item.id)}
                      >
                        <Checkbox
                          id={item.id}
                          checked={isChecked}
                          onCheckedChange={() => handleToggle(item.id)}
                          className="mt-1 h-5 w-5 flex-shrink-0"
                        />
                        <label
                          htmlFor={item.id}
                          className={cn(
                            "text-sm md:text-base cursor-pointer select-none transition-colors",
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
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Submit Button */}
        <div className="mt-10 text-center">
          <Button
            variant="teal"
            size="lg"
            onClick={handleShowResults}
            className="px-8"
          >
            View My Results
            <CheckCircle2 className="ml-2 h-5 w-5" />
          </Button>
          {score > 0 && !showResults && (
            <p className="mt-3 text-sm text-muted-foreground">
              Current score: {score} / {totalItems}
            </p>
          )}
        </div>
      </main>

      {/* Footer CTA */}
      <section className="border-t border-border bg-muted/30 py-12 mt-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-serif text-2xl md:text-3xl font-semibold text-foreground mb-4">
            Ready to Fill the Gaps in Your Checklist?
          </h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Take the next step in your professional journey with our Executive Leadership Mastery Program.
          </p>
          <Link to="/#contact">
            <Button variant="teal" size="lg">
              Get Started Today
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default LeadershipChecklist;
