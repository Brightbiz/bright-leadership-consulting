import { Link } from "react-router-dom";
import Logo from "./Logo";

const footerLinks = [
  { label: "Executive Alignment Index™", href: "/executive-alignment-index", isRoute: true },
  { label: "Selected Engagements", href: "/selected-engagements", isRoute: true },
  { label: "Executive Alignment Brief™ (PDF)", href: "/downloads/executive-alignment-brief.html", isRoute: false },
  { label: "Enquire Confidentially", href: "/contact", isRoute: true },
];

const Footer = () => {
  return (
    <footer className="border-t border-border/60">
      <div className="container-brief py-16">
        <div className="flex flex-col gap-12 md:flex-row md:items-start md:justify-between">
          {/* Logo */}
          <div>
            <Logo />
          </div>

          {/* Links */}
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
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-border/40">
          <p className="text-xs text-muted-foreground/50 mb-1">
            Confidential Executive Advisory
          </p>
          <p className="text-xs text-muted-foreground/40">
            © {new Date().getFullYear()} Bright Leadership Consulting. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
