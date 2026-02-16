import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, CheckCircle2, BarChart3, Download, ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  AssessmentQuestion,
  getCompetencyScores,
  getOverallLevel,
  COMPETENCIES,
} from "@/data/assessmentQuestions";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AssessmentPageProps {
  title: string;
  subtitle: string;
  assessmentType: 'pre-course' | 'post-course';
  questions: AssessmentQuestion[];
}

const LIKERT_LABELS = [
  { value: 1, label: 'Strongly Disagree' },
  { value: 2, label: 'Disagree' },
  { value: 3, label: 'Neutral' },
  { value: 4, label: 'Agree' },
  { value: 5, label: 'Strongly Agree' },
];

const AssessmentPage = ({ title, subtitle, assessmentType, questions }: AssessmentPageProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [scenarioFeedback, setScenarioFeedback] = useState<Record<string, string>>({});
  const [completed, setCompleted] = useState(false);
  const [user, setUser] = useState<{ id: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const [preScores, setPreScores] = useState<Record<string, { score: number; maxScore: number; percentage: number }> | null>(null);
  const [prePercentage, setPrePercentage] = useState<number | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({ id: session.user.id });
      } else {
        navigate('/admin/login');
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      if (!session?.user) navigate('/admin/login');
      else setUser({ id: session.user.id });
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  // Load pre-course results for comparison if this is post-course
  useEffect(() => {
    if (assessmentType === 'post-course' && user) {
      supabase
        .from('assessment_results')
        .select('*')
        .eq('user_id', user.id)
        .eq('assessment_type', 'pre-course')
        .order('completed_at', { ascending: false })
        .limit(1)
        .maybeSingle()
        .then(({ data }) => {
          if (data) {
            const scores = data.competency_scores as Record<string, { score: number; maxScore: number; percentage: number }>;
            setPreScores(scores);
            setPrePercentage(Number(data.percentage));
          }
        });
    }
  }, [assessmentType, user]);

  const currentQuestion = questions[currentIndex];
  const progress = (Object.keys(answers).length / questions.length) * 100;
  const allAnswered = Object.keys(answers).length === questions.length;

  const handleAnswer = (questionId: string, score: number, feedback?: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: score }));
    if (feedback) setScenarioFeedback(prev => ({ ...prev, [questionId]: feedback }));
  };

  const handleComplete = async () => {
    if (!user) return;
    setSaving(true);

    const totalScore = Object.values(answers).reduce((a, b) => a + b, 0);
    const maxScore = questions.reduce((a, q) => a + q.maxScore, 0);
    const percentage = Math.round((totalScore / maxScore) * 100);
    const competencyScores = getCompetencyScores(questions, answers);

    try {
      const { error } = await supabase.from('assessment_results').insert({
        user_id: user.id,
        assessment_type: assessmentType,
        total_score: totalScore,
        max_score: maxScore,
        percentage,
        competency_scores: competencyScores,
        answers,
      });

      if (error) throw error;
      setCompleted(true);
      toast({ title: 'Assessment completed!', description: 'Your results have been saved.' });
    } catch (err) {
      console.error(err);
      toast({ title: 'Error saving results', description: 'Please try again.', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleExportPDF = () => {
    const totalScore = Object.values(answers).reduce((a, b) => a + b, 0);
    const maxScore = questions.reduce((a, q) => a + q.maxScore, 0);
    const percentage = Math.round((totalScore / maxScore) * 100);
    const competencyScores = getCompetencyScores(questions, answers);
    const level = getOverallLevel(percentage);

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const compRows = Object.entries(competencyScores)
      .map(([name, data]) => {
        const preData = preScores?.[name];
        return `<tr>
          <td style="padding:10px;border:1px solid #ddd;font-weight:600">${name}</td>
          ${preData ? `<td style="padding:10px;border:1px solid #ddd;text-align:center">${preData.percentage}%</td>` : ''}
          <td style="padding:10px;border:1px solid #ddd;text-align:center">${data.percentage}%</td>
          ${preData ? `<td style="padding:10px;border:1px solid #ddd;text-align:center;color:${data.percentage > preData.percentage ? '#16a34a' : data.percentage < preData.percentage ? '#dc2626' : '#666'}">${data.percentage > preData.percentage ? '+' : ''}${data.percentage - preData.percentage}%</td>` : ''}
          <td style="padding:10px;border:1px solid #ddd"><div style="background:#e5e7eb;border-radius:9999px;height:12px;overflow:hidden"><div style="background:${level.color};height:100%;width:${data.percentage}%;border-radius:9999px"></div></div></td>
        </tr>`;
      }).join('');

    printWindow.document.write(`<!DOCTYPE html><html><head><title>${title} - Results</title>
      <style>
        @page{margin:2cm;size:A4}
        body{font-family:Georgia,serif;color:#1a1a1a;line-height:1.6;margin:0;padding:20px}
        .header{background:linear-gradient(135deg,#0f4c3a,#1e6b4f);color:#fff;padding:30px;text-align:center;margin:-20px -20px 30px}
        .header h1{margin:0;font-size:24px}
        .header p{color:#c9a227;margin-top:8px}
        table{width:100%;border-collapse:collapse;margin:20px 0}
        th{background:#0f4c3a;color:#fff;padding:10px;text-align:left}
        .score-box{text-align:center;padding:20px;background:#f9f7f2;border-radius:8px;margin:20px 0}
        .score-box .number{font-size:48px;font-weight:700;color:${level.color}}
      </style>
    </head><body>
      <div class="header"><h1>Executive Leadership Mastery Program</h1><p>${title}</p></div>
      <div class="score-box"><div class="number">${percentage}%</div><p style="font-size:18px;font-weight:600;color:${level.color}">${level.level}</p><p>${level.description}</p></div>
      <h2>Competency Breakdown</h2>
      <table><thead><tr><th>Competency</th>${preScores ? '<th>Pre-Course</th>' : ''}<th>${assessmentType === 'post-course' ? 'Post-Course' : 'Score'}</th>${preScores ? '<th>Change</th>' : ''}<th>Progress</th></tr></thead><tbody>${compRows}</tbody></table>
      <div style="margin-top:40px;border-top:2px solid #0f4c3a;padding-top:20px;text-align:center;font-size:12px;color:#666"><p>&copy; Bright Leadership Consulting &bull; Executive Leadership Mastery Program</p></div>
    </body></html>`);
    printWindow.document.close();
    const check = setInterval(() => {
      try { if (printWindow.document.readyState === 'complete') { clearInterval(check); setTimeout(() => printWindow.print(), 500); } } catch { clearInterval(check); }
    }, 100);
    setTimeout(() => { clearInterval(check); try { printWindow.print(); } catch {} }, 3000);
  };

  if (!user) return null;

  // Results screen
  if (completed) {
    const totalScore = Object.values(answers).reduce((a, b) => a + b, 0);
    const maxScore = questions.reduce((a, q) => a + q.maxScore, 0);
    const percentage = Math.round((totalScore / maxScore) * 100);
    const competencyScores = getCompetencyScores(questions, answers);
    const level = getOverallLevel(percentage);

    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-16">
          <div className="container-narrow max-w-4xl mx-auto px-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              {/* Overall Score */}
              <Card className="mb-8 overflow-hidden">
                <div className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground p-8 text-center">
                  <Badge className="mb-4 bg-secondary text-secondary-foreground">{title}</Badge>
                  <div className="text-6xl font-bold mb-2">{percentage}%</div>
                  <h2 className="text-2xl font-serif font-semibold mb-2">{level.level}</h2>
                  <p className="text-primary-foreground/80 max-w-lg mx-auto">{level.description}</p>
                </div>
              </Card>

              {/* Pre/Post Comparison */}
              {preScores && prePercentage !== null && (
                <Card className="mb-8">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><BarChart3 className="h-5 w-5" /> Growth Comparison</CardTitle>
                    <CardDescription>Your leadership development progress</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 text-center gap-4 mb-6">
                      <div className="p-4 rounded-lg bg-muted">
                        <div className="text-sm text-muted-foreground mb-1">Pre-Course</div>
                        <div className="text-2xl font-bold">{prePercentage}%</div>
                      </div>
                      <div className="p-4 rounded-lg bg-primary/10">
                        <div className="text-sm text-muted-foreground mb-1">Post-Course</div>
                        <div className="text-2xl font-bold text-primary">{percentage}%</div>
                      </div>
                      <div className="p-4 rounded-lg bg-secondary/20">
                        <div className="text-sm text-muted-foreground mb-1">Growth</div>
                        <div className={`text-2xl font-bold ${percentage - prePercentage > 0 ? 'text-green-600' : 'text-destructive'}`}>
                          {percentage - prePercentage > 0 ? '+' : ''}{percentage - prePercentage}%
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Competency Breakdown */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Competency Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(competencyScores).map(([name, data]) => {
                    const preComp = preScores?.[name];
                    return (
                      <div key={name}>
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="text-sm font-medium">{name}</span>
                          <div className="flex items-center gap-2">
                            {preComp && (
                              <span className="text-xs text-muted-foreground">Pre: {preComp.percentage}%</span>
                            )}
                            <span className="text-sm font-semibold">{data.percentage}%</span>
                            {preComp && (
                              <span className={`text-xs font-medium ${data.percentage > preComp.percentage ? 'text-green-600' : data.percentage < preComp.percentage ? 'text-destructive' : 'text-muted-foreground'}`}>
                                ({data.percentage > preComp.percentage ? '+' : ''}{data.percentage - preComp.percentage}%)
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="relative">
                          {preComp && (
                            <div className="absolute inset-0 h-3 rounded-full bg-muted overflow-hidden">
                              <div className="h-full bg-muted-foreground/20 rounded-full" style={{ width: `${preComp.percentage}%` }} />
                            </div>
                          )}
                          <Progress value={data.percentage} className="h-3" />
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="flex flex-wrap gap-3 justify-center">
                <Button onClick={handleExportPDF} variant="outline" className="gap-2">
                  <Download className="h-4 w-4" /> Export PDF Summary
                </Button>
                {assessmentType === 'pre-course' && (
                  <Button variant="teal" className="gap-2" onClick={() => navigate('/courses')}>
                    Begin Your Programme <ArrowRight className="h-4 w-4" />
                  </Button>
                )}
                {assessmentType === 'post-course' && !preScores && (
                  <p className="text-sm text-muted-foreground text-center w-full mt-2">
                    No pre-course assessment found. Complete the pre-course assessment first for a growth comparison.
                  </p>
                )}
              </div>
            </motion.div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Assessment form
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container-narrow max-w-3xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-8">
            <Badge variant="secondary" className="mb-3">{subtitle}</Badge>
            <h1 className="text-3xl font-serif font-semibold text-foreground mb-2">{title}</h1>
            <p className="text-muted-foreground">Question {currentIndex + 1} of {questions.length}</p>
          </div>

          {/* Progress */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>{Object.keys(answers).length} of {questions.length} answered</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Question */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion.id}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.25 }}
            >
              <Card className="mb-6">
                <CardHeader>
                  <Badge className="w-fit mb-2" variant="outline">{currentQuestion.competency}</Badge>
                  {currentQuestion.type === 'self-rating' ? (
                    <CardTitle className="text-lg leading-relaxed">{currentQuestion.text}</CardTitle>
                  ) : (
                    <>
                      <CardDescription className="text-base leading-relaxed font-medium text-foreground">
                        {currentQuestion.scenario}
                      </CardDescription>
                    </>
                  )}
                </CardHeader>
                <CardContent>
                  {currentQuestion.type === 'self-rating' ? (
                    <RadioGroup
                      value={answers[currentQuestion.id]?.toString()}
                      onValueChange={(val) => handleAnswer(currentQuestion.id, parseInt(val))}
                      className="space-y-3"
                    >
                      {LIKERT_LABELS.map((item) => (
                        <div key={item.value} className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-accent/50 transition-colors cursor-pointer">
                          <RadioGroupItem value={item.value.toString()} id={`${currentQuestion.id}-${item.value}`} />
                          <Label htmlFor={`${currentQuestion.id}-${item.value}`} className="flex-1 cursor-pointer">
                            <span className="font-medium mr-2">{item.value}.</span> {item.label}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  ) : (
                    <RadioGroup
                      value={answers[currentQuestion.id]?.toString()}
                      onValueChange={(val) => {
                        const selectedOption = currentQuestion.options.find(o => o.score.toString() === val || currentQuestion.options.indexOf(o).toString() === val);
                        // We need index-based matching since multiple options can have same score
                      }}
                      className="space-y-3"
                    >
                      {currentQuestion.options.map((option, idx) => (
                        <div
                          key={idx}
                          className={`flex items-start space-x-3 p-3 rounded-lg border transition-colors cursor-pointer ${
                            answers[currentQuestion.id] !== undefined && scenarioFeedback[currentQuestion.id] && answers[currentQuestion.id] === option.score && scenarioFeedback[currentQuestion.id] === option.feedback
                              ? 'bg-primary/5 border-primary/30'
                              : 'hover:bg-accent/50'
                          }`}
                          onClick={() => handleAnswer(currentQuestion.id, option.score, option.feedback)}
                        >
                          <RadioGroupItem
                            value={idx.toString()}
                            id={`${currentQuestion.id}-${idx}`}
                            checked={scenarioFeedback[currentQuestion.id] === option.feedback}
                          />
                          <Label htmlFor={`${currentQuestion.id}-${idx}`} className="flex-1 cursor-pointer text-sm leading-relaxed">
                            {option.label}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  )}

                  {/* Scenario feedback */}
                  {currentQuestion.type === 'scenario' && scenarioFeedback[currentQuestion.id] && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-4 p-4 rounded-lg bg-muted border-l-4 border-primary"
                    >
                      <p className="text-sm text-muted-foreground italic">{scenarioFeedback[currentQuestion.id]}</p>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
              disabled={currentIndex === 0}
              className="gap-2"
            >
              <ChevronLeft className="h-4 w-4" /> Previous
            </Button>

            <div className="flex gap-1.5">
              {questions.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2.5 w-2.5 rounded-full transition-colors ${
                    idx === currentIndex ? 'bg-primary' : answers[questions[idx].id] !== undefined ? 'bg-primary/40' : 'bg-muted-foreground/20'
                  }`}
                />
              ))}
            </div>

            {currentIndex < questions.length - 1 ? (
              <Button
                onClick={() => setCurrentIndex(currentIndex + 1)}
                disabled={answers[currentQuestion.id] === undefined}
                className="gap-2"
              >
                Next <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={handleComplete}
                disabled={!allAnswered || saving}
                variant="teal"
                className="gap-2"
              >
                {saving ? 'Saving...' : (<><CheckCircle2 className="h-4 w-4" /> Complete Assessment</>)}
              </Button>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AssessmentPage;
