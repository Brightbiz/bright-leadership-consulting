import { Link } from "react-router-dom";
import Logo from "./Logo";
import { Button } from "@/components/ui/button";
import { openCookiePreferences } from "@/lib/consent";

const footerLinks = [
  { label: "Executive Alignment Index™", href: "/executive-alignment-index", isRoute: true },
  { label: "How We Work", href: "/advisory-process", isRoute: true },
  { label: "Principal", href: "/principal", isRoute: true },
  { label: "Insights", href: "/insights", isRoute: true },
  { label: "Selected Engagements", href: "/selected-engagements", isRoute: true },
  { label: "Executive Alignment Brief™", href: "/downloads/executive-alignment-brief.html", isRoute: false },
  { label: "Discuss Executive Alignment", href: "/contact", isRoute: true },
];

const programmeLinks = [
  { label: "Bright Leadership Academy", href: "/academy", isRoute: true },
  { label: "Leading People", href: "/leading-people", isRoute: true },
  { label: "Executive Programmes", href: "/courses", isRoute: true },
  { label: "Executive Leadership Mastery Programme", href: "/executive-leadership-mastery", isRoute: true },
  { label: "Strategic Leadership in the Age of AI", href: "/strategic-leadership-ai", isRoute: true },
  { label: "Strategic AI Leadership for Organisations", href: "/strategic-ai-leadership-for-organisations", isRoute: true },
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
                  className="text-sm text-navy-note tracking-wide transition-colors hover:text-navy-foreground"
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-navy-note tracking-wide transition-colors hover:text-navy-foreground"
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
                className="text-sm text-navy-note tracking-wide transition-colors hover:text-navy-foreground"
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
                className="text-sm text-navy-note tracking-wide transition-colors hover:text-navy-foreground"
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
              <p className="text-xs text-navy-note">
                Bright Leadership Consulting
              </p>
              <p className="text-xs text-navy-note">
                Principal-led executive advisory and development
              </p>
              <p className="text-xs text-navy-note">
                Correspondence address: 82 James Carter Road, Mildenhall, England IP28 7DE.
              </p>


              <p className="text-xs text-navy-note">
                <a href="mailto:info@brightleadershipconsulting.com" className="transition-colors hover:text-navy-foreground">
                  info@brightleadershipconsulting.com
                </a>
              </p>
            </div>


            <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
              <Link
                to="/privacy"
                className="text-xs text-navy-note transition-colors hover:text-navy-foreground"
              >
                Privacy Notice
              </Link>
              <Link
                to="/terms"
                className="text-xs text-navy-note transition-colors hover:text-navy-foreground"
              >
                Terms of Use
              </Link>
              <Button
                variant="link"
                type="button"
                onClick={openCookiePreferences}
                className="h-auto p-0 text-xs font-normal text-navy-note transition-colors hover:text-navy-foreground"
              >
                Cookie Preferences
              </Button>
              <span className="text-xs text-navy-note">
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