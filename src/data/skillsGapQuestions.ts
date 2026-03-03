export interface SkillsGapQuestion {
  id: string;
  skill: string;
  category: "human" | "strategic" | "ai-ready";
  question: string;
  options: {
    label: string;
    score: number;
  }[];
}

export const skillsGapQuestions: SkillsGapQuestion[] = [
  {
    id: "cross_team",
    skill: "Cross-Team Collaboration",
    category: "human",
    question: "How effectively do you collaborate with people outside your immediate team?",
    options: [
      { label: "I mostly work within my own team", score: 1 },
      { label: "I collaborate cross-functionally when required", score: 2 },
      { label: "I regularly lead cross-functional initiatives", score: 3 },
      { label: "I build bridges across departments and drive alignment", score: 4 },
    ],
  },
  {
    id: "emotional_intelligence",
    skill: "Emotional Intelligence",
    category: "human",
    question: "How well do you read and respond to the emotions of others in professional settings?",
    options: [
      { label: "I focus on facts and data, not emotions", score: 1 },
      { label: "I'm aware of others' feelings but don't always act on it", score: 2 },
      { label: "I adapt my communication style based on emotional cues", score: 3 },
      { label: "I use emotional awareness to build trust and resolve conflict", score: 4 },
    ],
  },
  {
    id: "client_relations",
    skill: "Client Relations",
    category: "human",
    question: "How would you rate your ability to build and maintain strategic client relationships?",
    options: [
      { label: "I have limited client-facing experience", score: 1 },
      { label: "I maintain relationships but don't proactively develop them", score: 2 },
      { label: "I build strong relationships that drive repeat business", score: 3 },
      { label: "I'm a trusted advisor who clients seek out for strategic input", score: 4 },
    ],
  },
  {
    id: "strategic_decision",
    skill: "Strategic Decision-Making",
    category: "strategic",
    question: "When facing complex decisions with incomplete information, how do you typically respond?",
    options: [
      { label: "I wait for more data before acting", score: 1 },
      { label: "I follow established processes and precedent", score: 2 },
      { label: "I weigh trade-offs and make informed judgment calls", score: 3 },
      { label: "I synthesise diverse inputs and lead decisive action with confidence", score: 4 },
    ],
  },
  {
    id: "change_leadership",
    skill: "Change Leadership",
    category: "strategic",
    question: "How do you lead your team through periods of significant change?",
    options: [
      { label: "Change is uncomfortable — I prefer stability", score: 1 },
      { label: "I communicate changes but struggle with resistance", score: 2 },
      { label: "I create clear plans and bring most people along", score: 3 },
      { label: "I champion change, turn resisters into advocates, and maintain morale", score: 4 },
    ],
  },
  {
    id: "business_fundamentals",
    skill: "Revenue & Efficiency Strategy",
    category: "strategic",
    question: "How confident are you in developing new revenue streams or operational efficiencies?",
    options: [
      { label: "That's not part of my role", score: 1 },
      { label: "I contribute ideas but don't lead these initiatives", score: 2 },
      { label: "I've successfully driven efficiency or revenue improvements", score: 3 },
      { label: "I consistently identify and execute strategic growth opportunities", score: 4 },
    ],
  },
  {
    id: "ai_leadership",
    skill: "AI-Ready Leadership",
    category: "ai-ready",
    question: "How prepared are you to lead teams through AI-driven transformation?",
    options: [
      { label: "I haven't thought much about AI's impact on my work", score: 1 },
      { label: "I'm aware of AI trends but unsure how they affect my team", score: 2 },
      { label: "I actively experiment with AI tools and discuss implications with my team", score: 3 },
      { label: "I'm shaping our AI strategy and helping my team adapt proactively", score: 4 },
    ],
  },
  {
    id: "interpersonal",
    skill: "Interpersonal Influence",
    category: "human",
    question: "How effectively do you influence stakeholders without formal authority?",
    options: [
      { label: "I rely on my position or title to get things done", score: 1 },
      { label: "I can persuade within my immediate circle", score: 2 },
      { label: "I influence across levels using compelling arguments", score: 3 },
      { label: "I build coalitions and drive alignment even in politically complex environments", score: 4 },
    ],
  },
];

export interface SkillResult {
  skill: string;
  category: "human" | "strategic" | "ai-ready";
  score: number;
  maxScore: number;
  level: "Gap" | "Developing" | "Proficient" | "Advanced";
}

export function analyseResults(answers: Record<string, number>): {
  results: SkillResult[];
  overallScore: number;
  maxScore: number;
  topGaps: SkillResult[];
  recommendedCourse: { name: string; link: string };
} {
  const results: SkillResult[] = skillsGapQuestions.map((q) => {
    const score = answers[q.id] || 1;
    const level: SkillResult["level"] =
      score <= 1 ? "Gap" : score <= 2 ? "Developing" : score <= 3 ? "Proficient" : "Advanced";
    return { skill: q.skill, category: q.category, score, maxScore: 4, level };
  });

  const overallScore = results.reduce((sum, r) => sum + r.score, 0);
  const maxScore = results.length * 4;
  const topGaps = [...results].sort((a, b) => a.score - b.score).slice(0, 3);

  // Recommend course based on weakest category
  const categoryScores = { human: 0, strategic: 0, "ai-ready": 0 };
  const categoryCounts = { human: 0, strategic: 0, "ai-ready": 0 };
  results.forEach((r) => {
    categoryScores[r.category] += r.score;
    categoryCounts[r.category]++;
  });

  const categoryAvg = Object.fromEntries(
    Object.entries(categoryScores).map(([k, v]) => [k, v / (categoryCounts[k as keyof typeof categoryCounts] || 1)])
  );

  const weakest = Object.entries(categoryAvg).sort(([, a], [, b]) => a - b)[0][0];

  const courseMap: Record<string, { name: string; link: string }> = {
    human: {
      name: "Enhanced Employability Skills",
      link: "https://bright-leadership-consulting.thinkific.com/courses/employability-skills-for-employees",
    },
    strategic: {
      name: "Executive Leadership Mastery Program",
      link: "https://bright-leadership-consulting.thinkific.com/courses/new-executive-leadership-mastery-program",
    },
    "ai-ready": {
      name: "Future of Work & AI-Ready Leadership",
      link: "https://bright-leadership-consulting.thinkific.com/courses/the-future-of-work",
    },
  };

  return {
    results,
    overallScore,
    maxScore,
    topGaps,
    recommendedCourse: courseMap[weakest] || courseMap.strategic,
  };
}
