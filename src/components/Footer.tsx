import { Link } from "react-router-dom";
import { useState } from "react";
import Logo from "./Logo";
import { generateStrategicLeadershipPDF, downloadStrategicLeadershipPDF } from "@/utils/strategicLeadershipPdfGenerator";

const footerLinks = [
  { label: "Executive Alignment Index™", href: "/executive-alignment-index", isRoute: true },
  { label: "Selected Engagements", href: "/selected-engagements", isRoute: true },
  { label: "Executive Alignment Brief™", href: "/downloads/executive-alignment-brief.html", isRoute: false },
  { label: "Enquire Confidentially", href: "/contact", isRoute: true },
];

const programmeLinks = [
  { label: "Executive Leadership Mastery", href: "/executive-leadership-mastery", isRoute: true },
  { label: "All Courses", href: "/courses", isRoute: true },
  { label: "Augmented Leadership™", href: "/augmented-leadership", isRoute: true },
];

const downloadLinks = [
  { label: "AI Opportunity Worksheet", href: "/downloads/ai-opportunity-worksheet.html" },
  { label: "AI Strategy Canvas", href: "/downloads/ai-strategy-canvas.html" },
  { label: "Executive AI Prompt Library", href: "/downloads/executive-ai-prompt-library.html" },
  { label: "AI Taskforce Template", href: "/downloads/ai-taskforce-template.html" },
  { label: "Responsible AI Governance", href: "/downloads/responsible-ai-governance-framework.html" },
  { label: "AI Transformation Roadmap", href: "/downloads/ai-transformation-leadership-roadmap.html" },
  { label: "AI Leadership Blueprint™ Template", href: "/downloads/ai-leadership-blueprint-template.html" },
  { label: "Capstone Project Guide", href: "/downloads/capstone-project-guide.html" },
  { label: "Augmented Leadership System Map", href: "/downloads/augmented-leadership-system-map.html" },
];

const exerciseLinks = [
  { label: "Leadership Reflection Exercises", href: "/downloads/exercise-leadership-reflection.html" },
  { label: "Leadership Speech Exercise", href: "/downloads/exercise-leadership-speech.html" },
  { label: "Exercise 1: AI Opportunity Mapping", href: "/downloads/exercise-ai-opportunity-mapping.html" },
  { label: "Exercise 2: AI Strategy Canvas", href: "/downloads/exercise-ai-strategy-canvas.html" },
  { label: "Exercise 3: Responsible AI Governance", href: "/downloads/exercise-responsible-ai-governance.html" },
  { label: "AI Leadership Blueprint™ Canvas", href: "/downloads/exercise-ai-leadership-blueprint.html" },
  { label: "Growth Opportunity Mapping", href: "/downloads/exercise-growth-opportunity-mapping.html" },
];

const Footer = () => {
  const [generating, setGenerating] = useState(false);

  const handleWorkbookDownload = async () => {
    setGenerating(true);
    try {
      const pdfBytes = await generateStrategicLeadershipPDF();
      downloadStrategicLeadershipPDF(pdfBytes);
    } catch (e) {
      console.error('Workbook generation failed:', e);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <footer className="bg-navy text-navy-foreground">
      <div className="container-brief py-16">
        <div className="flex flex-col gap-12 md:flex-row md:items-start md:justify-between">
          <div>
            <Logo variant="light" />
          </div>

          <nav className="flex flex-col gap-3">
            {footerLinks.map((link) =>
              link.isRoute ? (
                <Link
                  key={link.label}
                  to={link.href}
                  className="text-sm text-navy-foreground/70 tracking-wide transition-colors hover:text-navy-foreground"
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-navy-foreground/70 tracking-wide transition-colors hover:text-navy-foreground"
                >
                  {link.label}
                </a>
              )
            )}
          </nav>

          <nav className="flex flex-col gap-3">
            <span className="text-xs font-medium text-gold uppercase tracking-wider mb-1">Programmes</span>
            {programmeLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="text-sm text-navy-foreground/70 tracking-wide transition-colors hover:text-navy-foreground"
              >
                {link.label}
              </Link>
            ))}
            <button
              onClick={handleWorkbookDownload}
              disabled={generating}
              className="text-sm text-navy-foreground/70 tracking-wide transition-colors hover:text-navy-foreground text-left disabled:opacity-50"
            >
              {generating ? "Generating…" : "Executive Workbook (PDF)"}
            </button>
          </nav>

          <nav className="flex flex-col gap-3">
            <span className="text-xs font-medium text-gold uppercase tracking-wider mb-1">Course Downloads</span>
            {downloadLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-navy-foreground/70 tracking-wide transition-colors hover:text-navy-foreground"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <nav className="flex flex-col gap-3">
            <span className="text-xs font-medium text-gold uppercase tracking-wider mb-1">Executive Exercises</span>
            {exerciseLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-navy-foreground/70 tracking-wide transition-colors hover:text-navy-foreground"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="mt-12 pt-8 border-t border-navy-foreground/15 flex flex-col gap-3">

          {/* Gold CTA */}
          <div className="pt-8 pb-4">
            <Link
              to="/contact"
              className="inline-block border border-[hsl(38,60%,52%)] text-[hsl(38,60%,52%)] px-8 py-3 text-sm font-medium tracking-[0.03em] rounded-sm transition-colors hover:bg-[hsl(38,60%,52%)] hover:text-navy"
            >
              Initiate a Confidential Conversation
            </Link>
          </div>

          <p className="text-xs text-navy-foreground/60">
            Bright Leadership Consulting — Confidential Executive Advisory
          </p>
          <p className="text-xs text-navy-foreground/30 mt-1">
            © {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;