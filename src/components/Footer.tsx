import { Link } from "react-router-dom";
import Logo from "./Logo";

const footerLinks = [
  { label: "Executive Alignment Index™", href: "/executive-alignment-index", isRoute: true },
  { label: "Selected Engagements", href: "/selected-engagements", isRoute: true },
  { label: "Executive Alignment Brief™", href: "/downloads/executive-alignment-brief.html", isRoute: false },
  { label: "Enquire Confidentially", href: "/contact", isRoute: true },
];

const programmeLinks = [
  { label: "Executive Leadership Mastery", href: "/executive-leadership-mastery", isRoute: true },
  { label: "All Courses", href: "/courses", isRoute: true },
  { label: "AI Leadership Slides", href: "/slides", isRoute: true },
];

const Footer = () => {
  return (
    <footer className="border-t border-border">
      <div className="container-brief py-16">
        <div className="flex flex-col gap-12 md:flex-row md:items-start md:justify-between">
          <div>
            <Logo />
          </div>

          <nav className="flex flex-col gap-3">
            {footerLinks.map((link) =>
              link.isRoute ? (
                <Link
                  key={link.label}
                  to={link.href}
                  className="text-sm text-muted-foreground tracking-wide transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground tracking-wide transition-colors hover:text-foreground"
                >
                  {link.label}
                </a>
              )
            )}
          </nav>

          <nav className="flex flex-col gap-3">
            <span className="text-xs font-medium text-muted-foreground/60 uppercase tracking-wider mb-1">Programmes</span>
            {programmeLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="text-sm text-muted-foreground tracking-wide transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-xs text-muted-foreground">
            Bright Leadership Consulting — Confidential Executive Advisory
          </p>
          <p className="text-xs text-muted-foreground/60 mt-1">
            © {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
