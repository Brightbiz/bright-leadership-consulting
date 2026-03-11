import { Link } from "react-router-dom";
import { ArrowRight, Presentation, FileDown } from "lucide-react";

const modules = [
  {
    section: "Introduction",
    slides: [
      { n: 1, title: "Strategic Leadership in the Age of AI" },
      { n: 2, title: "The Leadership Paradox" },
      { n: 3, title: "Program Outcomes" },
    ],
  },
  {
    section: "Module 1 — Leadership in the Age of AI",
    slides: [
      { n: 4, title: "Module Title: Leadership in the Age of AI" },
      { n: 5, title: "AI Is Transforming Work" },
      { n: 6, title: "The Leadership Challenge" },
      { n: 7, title: "Why Leadership Matters More" },
      { n: 8, title: "The Augmented Leader" },
      { n: 9, title: "Human Intelligence" },
      { n: 10, title: "Artificial Intelligence" },
      { n: 11, title: "Organisational Intelligence" },
      { n: 12, title: "Case Example: Microsoft" },
    ],
  },
  {
    section: "Module 2 — AI Literacy for Executives",
    slides: [
      { n: 13, title: "Module Title: AI Literacy for Executives" },
      { n: 14, title: "What Is Artificial Intelligence?" },
      { n: 15, title: "Generative AI" },
      { n: 16, title: "AI Capabilities" },
      { n: 17, title: "AI Limitations" },
      { n: 18, title: "AI Tools Leaders Should Know" },
    ],
  },
  {
    section: "Module 3 — AI as Competitive Advantage",
    slides: [
      { n: 19, title: "Module Title: AI as Competitive Advantage" },
      { n: 20, title: "AI as Competitive Advantage" },
      { n: 21, title: "Data as Strategic Asset" },
      { n: 22, title: "Industry Transformation" },
      { n: 23, title: "Case Example: Netflix" },
      { n: 24, title: "AI Leadership Maturity Model" },
    ],
  },
  {
    section: "Module 4 — AI-Augmented Decision Making",
    slides: [
      { n: 25, title: "Module Title: AI-Augmented Decision Making" },
      { n: 26, title: "Decision Complexity" },
      { n: 27, title: "AI Decision Support" },
      { n: 28, title: "Automation Bias" },
      { n: 29, title: "Human Judgment" },
      { n: 30, title: "Strategic Prompting & Scenario Analysis" },
    ],
  },
  {
    section: "Module 5 — Human Leadership in a Machine World",
    slides: [
      { n: 31, title: "Module Title: Human Leadership" },
      { n: 32, title: "People Skills Are Rising" },
      { n: 33, title: "Emotional Intelligence" },
      { n: 34, title: "Leading Through Change" },
      { n: 35, title: "Building Trust" },
    ],
  },
  {
    section: "Module 6 — Cross-Functional Collaboration",
    slides: [
      { n: 36, title: "Module Title: Cross-Functional Collaboration" },
      { n: 37, title: "AI Requires Collaboration" },
      { n: 38, title: "Cross-Functional Teams" },
      { n: 39, title: "AI Governance Groups" },
      { n: 40, title: "Leadership Alignment" },
    ],
  },
  {
    section: "Module 7 — Executive Communication",
    slides: [
      { n: 41, title: "Module Title: Executive Communication" },
      { n: 42, title: "Communicating AI Transformation" },
      { n: 43, title: "Leadership Narrative" },
      { n: 44, title: "Addressing Job Concerns" },
      { n: 45, title: "Stakeholder Communication" },
    ],
  },
  {
    section: "Module 8 — AI and Business Growth",
    slides: [
      { n: 46, title: "Module Title: AI and Business Growth" },
      { n: 47, title: "AI-Driven Innovation" },
      { n: 48, title: "Market Expansion" },
      { n: 49, title: "AI Ecosystems" },
    ],
  },
  {
    section: "Module 9 — Governance and Responsible AI",
    slides: [
      { n: 50, title: "Module Title: Governance and Responsible AI" },
      { n: 51, title: "AI Risks" },
      { n: 52, title: "Ethical Leadership" },
      { n: 53, title: "Regulatory Landscape" },
      { n: 54, title: "Responsible AI Governance" },
    ],
  },
  {
    section: "Module 10 — Leading the AI Transformation",
    slides: [
      { n: 55, title: "Module Title: Leading the AI Transformation" },
      { n: 56, title: "AI Transformation" },
      { n: 57, title: "Capability Development" },
      { n: 58, title: "Talent Strategy" },
      { n: 59, title: "Culture Change" },
      { n: 60, title: "Transformation Leadership" },
      { n: 61, title: "Common AI Transformation Challenges" },
      { n: 62, title: "Case Example: AI in Healthcare" },
    ],
  },
  {
    section: "Strategic Framework Review",
    slides: [
      { n: 63, title: "Framework Review" },
      { n: 64, title: "Augmented Leadership Framework" },
      { n: 65, title: "AI Leadership Maturity Model" },
      { n: 66, title: "AI Transformation Roadmap" },
    ],
  },
  {
    section: "Capstone Project",
    slides: [
      { n: 67, title: "AI Leadership Blueprint" },
      { n: 68, title: "AI Opportunity Mapping" },
      { n: 69, title: "Leadership Capability Assessment" },
      { n: 70, title: "Governance and Responsible AI" },
      { n: 71, title: "AI Transformation Roadmap" },
      { n: 72, title: "Strategic Outcome" },
    ],
  },
  {
    section: "Reflection & Conclusion",
    slides: [
      { n: 73, title: "Reflection: Strategic Value" },
      { n: 74, title: "Reflection: Leadership Capability" },
      { n: 75, title: "Course Conclusion" },
      { n: 76, title: "Three Key Takeaways" },
      { n: 77, title: "The Augmented Leader" },
      { n: 78, title: "Next Steps" },
      { n: 79, title: "Final Message" },
      { n: 80, title: "Thank You" },
    ],
  },
];

const Slides = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-6 py-20">
        <div className="mb-12">
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            ← Back to site
          </Link>
          <div className="flex items-center gap-3 mt-6">
            <Presentation className="h-6 w-6 text-secondary" />
            <h1 className="text-2xl font-semibold text-foreground">AI Leadership Slide Deck</h1>
          </div>
          <p className="text-muted-foreground mt-2">
            Strategic Leadership in the Age of AI — 80-slide executive programme deck.
          </p>

          <a
            href="/slides/ai-leadership-deck.html"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 rounded-lg bg-secondary text-secondary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            <FileDown className="h-4 w-4" />
            Open Full Deck (Print / Export PDF)
          </a>
        </div>

        <div className="space-y-10">
          {modules.map((mod) => (
            <div key={mod.section}>
              <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/60 mb-3">
                {mod.section}
              </h2>
              <div className="space-y-1">
                {mod.slides.map((slide) => (
                  <a
                    key={slide.n}
                    href={`/slides/ai-leadership-deck.html#slide-${slide.n}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 px-4 py-3 rounded-lg border border-border/30 hover:border-secondary/40 hover:bg-muted/30 transition-all group"
                  >
                    <span className="text-xs font-medium text-muted-foreground/40 w-7 text-right shrink-0 tabular-nums">
                      {String(slide.n).padStart(2, "0")}
                    </span>
                    <span className="flex-1 text-sm font-medium text-foreground group-hover:text-secondary transition-colors">
                      {slide.title}
                    </span>
                    <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/30 group-hover:text-secondary transition-colors shrink-0" />
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Slides;
