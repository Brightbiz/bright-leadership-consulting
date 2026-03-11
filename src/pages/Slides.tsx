import { Link } from "react-router-dom";
import { FileDown, Presentation, ExternalLink } from "lucide-react";
import Footer from "@/components/Footer";

const modules = [
  {
    id: "Introduction",
    title: "Introduction",
    subtitle: "Programme overview and the leadership paradox",
    slideRange: "Slides 1–3",
    count: 3,
  },
  {
    id: "Module 1",
    title: "Module 1 — Leadership in the Age of AI",
    subtitle: "The Augmented Leader framework and three intelligences",
    slideRange: "Slides 4–12",
    count: 9,
  },
  {
    id: "Module 2",
    title: "Module 2 — AI Literacy for Executives",
    subtitle: "What executives must know about AI capabilities and limitations",
    slideRange: "Slides 13–18",
    count: 6,
  },
  {
    id: "Module 3",
    title: "Module 3 — AI as Competitive Advantage",
    subtitle: "Data strategy, industry transformation and maturity models",
    slideRange: "Slides 19–24",
    count: 6,
  },
  {
    id: "Module 4",
    title: "Module 4 — AI-Augmented Decision Making",
    subtitle: "Decision complexity, automation bias and strategic prompting",
    slideRange: "Slides 25–30",
    count: 6,
  },
  {
    id: "Module 5",
    title: "Module 5 — Human Leadership in a Machine World",
    subtitle: "Emotional intelligence, change leadership and trust",
    slideRange: "Slides 31–35",
    count: 5,
  },
  {
    id: "Module 6",
    title: "Module 6 — Cross-Functional Collaboration",
    subtitle: "AI governance groups and leadership alignment",
    slideRange: "Slides 36–40",
    count: 5,
  },
  {
    id: "Module 7",
    title: "Module 7 — Executive Communication",
    subtitle: "Communicating AI transformation to stakeholders",
    slideRange: "Slides 41–45",
    count: 5,
  },
  {
    id: "Module 8",
    title: "Module 8 — AI and Business Growth",
    subtitle: "AI-driven innovation, market expansion and ecosystems",
    slideRange: "Slides 46–49",
    count: 4,
  },
  {
    id: "Module 9",
    title: "Module 9 — Governance and Responsible AI",
    subtitle: "AI risks, ethical leadership and regulatory landscape",
    slideRange: "Slides 50–54",
    count: 5,
  },
  {
    id: "Module 10",
    title: "Module 10 — Leading the AI Transformation",
    subtitle: "Capability development, talent strategy and culture change",
    slideRange: "Slides 55–62",
    count: 8,
  },
  {
    id: "Framework Review",
    title: "Strategic Framework Review",
    subtitle: "Augmented Leadership Framework, Maturity Model and Roadmap",
    slideRange: "Slides 63–66",
    count: 4,
  },
  {
    id: "Capstone",
    title: "Capstone Project",
    subtitle: "AI Leadership Blueprint and opportunity mapping",
    slideRange: "Slides 67–72",
    count: 6,
  },
  {
    id: "Conclusion",
    title: "Reflection & Conclusion",
    subtitle: "Key takeaways, next steps and final reflection",
    slideRange: "Slides 73–80",
    count: 8,
  },
];

const Slides = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1">
        <div className="max-w-4xl mx-auto px-6 py-20">
          {/* Header */}
          <div className="mb-16">
            <Link
              to="/"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Back to site
            </Link>

            <div className="mt-10 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Presentation className="h-5 w-5 text-secondary" />
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
                  Executive Programme Materials
                </span>
              </div>
              <h1 className="font-serif text-3xl md:text-4xl font-semibold text-foreground leading-tight">
                Strategic Leadership in the Age of AI
              </h1>
              <p className="text-muted-foreground mt-3 max-w-2xl leading-relaxed">
                80-slide executive programme deck, organised by module for
                Thinkific integration. Each module can be downloaded individually
                as a print-ready PDF.
              </p>
            </div>

            {/* Full deck download */}
            <a
              href="/slides/ai-leadership-deck.html"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-secondary text-secondary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              <FileDown className="h-4 w-4" />
              Open Full Deck (80 Slides)
            </a>
          </div>

          {/* Divider */}
          <div className="border-t border-border mb-12" />

          {/* Module Grid */}
          <div className="space-y-4">
            {modules.map((mod, idx) => (
              <div
                key={mod.id}
                className="group border border-border/40 rounded-xl p-6 hover:border-secondary/30 hover:bg-muted/20 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-xs font-medium text-muted-foreground/50 tabular-nums shrink-0">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <h2 className="text-base font-semibold text-foreground truncate">
                        {mod.title}
                      </h2>
                    </div>
                    <p className="text-sm text-muted-foreground ml-8 leading-relaxed">
                      {mod.subtitle}
                    </p>
                    <p className="text-xs text-muted-foreground/50 ml-8 mt-1">
                      {mod.slideRange} · {mod.count}{" "}
                      {mod.count === 1 ? "slide" : "slides"}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 ml-8 sm:ml-0 shrink-0">
                    <a
                      href={`/slides/ai-leadership-deck.html?module=${encodeURIComponent(mod.id)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border text-sm font-medium text-foreground hover:border-secondary/50 hover:text-secondary transition-all"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      View
                    </a>
                    <a
                      href={`/slides/ai-leadership-deck.html?module=${encodeURIComponent(mod.id)}&print=1`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
                    >
                      <FileDown className="h-3.5 w-3.5" />
                      PDF
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Slides;
