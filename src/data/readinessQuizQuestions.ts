export interface QuizQuestion {
  id: string;
  question: string;
  options: {
    label: string;
    value: string;
    score: number; // higher = more suited to premium tiers
  }[];
}

export const readinessQuizQuestions: QuizQuestion[] = [
  {
    id: "current_role",
    question: "What best describes your current role?",
    options: [
      { label: "Individual contributor / Early career", value: "individual", score: 1 },
      { label: "Team lead or first-time manager", value: "team_lead", score: 2 },
      { label: "Senior manager / Director", value: "senior_manager", score: 3 },
      { label: "C-Suite / VP / Executive", value: "executive", score: 4 },
    ],
  },
  {
    id: "team_size",
    question: "How many people do you currently lead or influence?",
    options: [
      { label: "None yet — aspiring leader", value: "none", score: 1 },
      { label: "1–5 direct reports", value: "small", score: 2 },
      { label: "6–20 people", value: "medium", score: 3 },
      { label: "20+ across teams or departments", value: "large", score: 4 },
    ],
  },
  {
    id: "primary_goal",
    question: "What is your primary leadership goal?",
    options: [
      { label: "Build foundational leadership skills", value: "foundation", score: 1 },
      { label: "Improve team performance and engagement", value: "team_performance", score: 2 },
      { label: "Prepare for a senior or executive role", value: "executive_prep", score: 3 },
      { label: "Transform my organisation's leadership culture", value: "transformation", score: 4 },
    ],
  },
  {
    id: "learning_style",
    question: "How do you prefer to develop your skills?",
    options: [
      { label: "Self-paced — I learn best on my own schedule", value: "self_paced", score: 1 },
      { label: "Structured group learning with peers", value: "group", score: 2 },
      { label: "Personalised 1:1 coaching and mentorship", value: "one_on_one", score: 4 },
    ],
  },
  {
    id: "timeline",
    question: "What is your development timeline?",
    options: [
      { label: "No rush — I want to build skills gradually", value: "flexible", score: 1 },
      { label: "Within 3–6 months for a new role or promotion", value: "medium_term", score: 3 },
      { label: "Urgently — I need to step up immediately", value: "urgent", score: 4 },
    ],
  },
  {
    id: "investment",
    question: "How important is personalised feedback to your growth?",
    options: [
      { label: "I'm self-motivated — content is enough", value: "content_only", score: 1 },
      { label: "Some feedback would help — group sessions are ideal", value: "group_feedback", score: 2 },
      { label: "Critical — I need a dedicated coach who knows my context", value: "dedicated_coach", score: 4 },
    ],
  },
];

export type TierRecommendation = "self-paced" | "group-coaching" | "executive-coaching";

export function getRecommendation(totalScore: number): TierRecommendation {
  if (totalScore >= 18) return "executive-coaching";
  if (totalScore >= 12) return "group-coaching";
  return "self-paced";
}

export const tierDetails: Record<TierRecommendation, { name: string; description: string; ctaText: string; ctaLink: string }> = {
  "self-paced": {
    name: "Self-Paced Mastery",
    description: "Based on your responses, the Self-Paced Mastery tier is the perfect starting point. You'll get full access to all 33 modules and 66 CPD points to build your leadership foundation at your own pace.",
    ctaText: "Start Learning Today — £1,297",
    ctaLink: "https://bright-leadership-consulting.thinkific.com/courses/copy-of-executive-leadership-mastery-program",
  },
  "group-coaching": {
    name: "Group Coaching",
    description: "Your goals and experience suggest you'd benefit most from structured group coaching. Live sessions with peers and expert instructors will accelerate your development and provide the accountability you need.",
    ctaText: "Enquire About Group Coaching",
    ctaLink: "#contact",
  },
  "executive-coaching": {
    name: "1:1 Executive Coaching",
    description: "With your level of responsibility and ambition, personalised 1:1 executive coaching will deliver the fastest transformation. A dedicated coach will create a bespoke development plan tailored to your specific challenges.",
    ctaText: "Apply for Executive Coaching",
    ctaLink: "#contact",
  },
};
