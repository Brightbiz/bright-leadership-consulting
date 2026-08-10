import { Link } from "react-router-dom";
import Logo from "./Logo";
import { openCookiePreferences } from "@/lib/consent";

const footerLinks = [
  { label: "Executive Alignment Index™", href: "/executive-alignment-index", isRoute: true },
  { label: "How We Work", href: "/advisory-process", isRoute: true },
  { label: "Principal", href: "/principal", isRoute: true },
  { label: "Selected Engagements", href: "/selected-engagements", isRoute: true },
  { label: "Executive Alignment Brief™", href: "/downloads/executive-alignment-brief.html", isRoute: false },
  { label: "Discuss Executive Alignment", href: "/contact", isRoute: true },
];

const programmeLinks = [
  { label: "Executive Programmes", href: "/courses", isRoute: true },
  { label: "Executive Leadership Mastery Programme", href: "/executive-leadership-mastery", isRoute: true },
  { label: "Strategic Leadership in the Age of AI", href: "/strategic-leadership-ai", isRoute: true },
  { label: "Augmented Leadership™", href: "/augmented-leadership", isRoute: true },
];

/** Brochures mirror the authoritative four-programme catalogue only. */
const brochureLinks = [
  { label: "Executive Leadership Mastery Programme", href: "/brochures/executive-leadership-mastery-brochure.html" },
  { label: "Future Workplace and Workforce Strategy Programme", href: "/brochures/future-of-work-brochure.html" },
  { label: "Strategic Productivity and Peak Performance Accelerator", href: "/brochures/peak-performance-brochure.html" },
  { label: "Executive Alignment Index™", href: "/brochures/executive-alignment-index-brochure.html" },
];

const Footer = () => {

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

          <div className="flex flex-col gap-4 border-t border-navy-foreground/10 pt-8 md:flex-row md:items-start md:justify-between">
            <div className="space-y-1.5">
              <p className="text-xs text-navy-foreground/60">
                Bright Leadership Consulting — Confidential Executive Advisory
              </p>
              <p className="text-xs text-navy-foreground/50">
                Registered in England and Wales. Company number 07258400.
              </p>
              <p className="text-xs text-navy-foreground/50">
                <a href="mailto:info@brightleadershipconsulting.com" className="transition-colors hover:text-navy-foreground">
                  info@brightleadershipconsulting.com
                </a>
                <span className="mx-2 text-navy-foreground/25">·</span>
                <a href="tel:+443333355045" className="transition-colors hover:text-navy-foreground">
                  0333 335 5045
                </a>
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
              <Link
                to="/privacy"
                className="text-xs text-navy-foreground/60 transition-colors hover:text-navy-foreground"
              >
                Privacy Notice
              </Link>
              <Link
                to="/terms"
                className="text-xs text-navy-foreground/60 transition-colors hover:text-navy-foreground"
              >
                Terms of Use
              </Link>
              <button
                type="button"
                onClick={openCookiePreferences}
                className="text-xs text-navy-foreground/60 transition-colors hover:text-navy-foreground"
              >
                Cookie Preferences
              </button>
              <span className="text-xs text-navy-foreground/30">
                © {new Date().getFullYear()}
              </span>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;