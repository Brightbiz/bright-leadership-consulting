import { Link } from "react-router-dom";
import { useState } from "react";
import Logo from "./Logo";
import { generateStrategicLeadershipPDF, downloadStrategicLeadershipPDF } from "@/utils/strategicLeadershipPdfGenerator";

const footerLinks = [
  { label: "Executive Alignment Index™", href: "/executive-alignment-index", isRoute: true },
  { label: "Selected Engagements", href: "/selected-engagements", isRoute: true },
  { label: "Executive Alignment Brief™", href: "/downloads/executive-alignment-brief.html", isRoute: false },
  { label: "Discuss Executive Alignment", href: "/contact", isRoute: true },
];

const programmeLinks = [
  { label: "Executive Leadership Mastery", href: "/executive-leadership-mastery", isRoute: true },
  { label: "All Courses", href: "/courses", isRoute: true },
  { label: "Augmented Leadership™", href: "/augmented-leadership", isRoute: true },
];

const brochureLinks = [
  { label: "Executive Leadership Mastery", href: "/brochures/executive-leadership-mastery-brochure.html" },
  { label: "Executive Alignment Index™", href: "/brochures/executive-alignment-index-brochure.html" },
  { label: "Advanced Leadership Skills", href: "/brochures/advanced-leadership-skills-brochure.html" },
  { label: "Future of Work", href: "/brochures/future-of-work-brochure.html" },
  { label: "Peak Performance", href: "/brochures/peak-performance-brochure.html" },
  { label: "Enhanced Employability Skills", href: "/brochures/enhanced-employability-skills-brochure.html" },
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
          </nav>

          <nav className="flex flex-col gap-3">
            <span className="text-xs font-medium text-gold uppercase tracking-wider mb-1">Programme Brochures</span>
            {brochureLinks.map((link) => (
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