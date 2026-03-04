import { Mail, Phone, MapPin, Linkedin, Twitter, Instagram } from "lucide-react";
import { Link } from "react-router-dom";
import Logo from "./Logo";
import cpdBadge from "@/assets/cpd-badge.png";

const structuralLinks = [
  { label: "Executive Alignment Index", href: "/executive-alignment-index", isRoute: true },
  { label: "Selected Engagements", href: "/selected-engagements", isRoute: true },
  { label: "Executive Alignment Brief (PDF)", href: "/downloads/executive-alignment-brief.html", isRoute: false, external: true },
  { label: "Enquire Confidentially", href: "/contact", isRoute: true },
];

const Footer = () => {
  return (
    <footer className="bg-foreground text-background">
      <div className="container-narrow section-padding pb-10">
        <div className="grid gap-12 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <Logo className="brightness-0 invert" />
            </div>
            <p className="mb-6 max-w-sm text-background/70 leading-relaxed">
              Strategic advisory and executive development for organisations 
              navigating complexity, growth, and governance change.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-background/70">
                <Mail className="h-4 w-4 text-secondary" />
                info@brightleadershipconsulting.com
              </div>
              <div className="flex items-center gap-3 text-sm text-background/70">
                <Phone className="h-4 w-4 text-secondary" />
                0333 335 5045
              </div>
              <div className="flex items-center gap-3 text-sm text-background/70">
                <MapPin className="h-4 w-4 text-secondary" />
                London, United Kingdom
              </div>
            </div>
          </div>

          {/* Structural Links */}
          <div className="lg:col-span-3 flex items-start justify-end">
            <ul className="space-y-3">
              {structuralLinks.map((link) => (
                <li key={link.label}>
                  {link.isRoute ? (
                    <Link
                      to={link.href}
                      className="text-sm text-background/70 transition-colors hover:text-secondary tracking-wide"
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-background/70 transition-colors hover:text-secondary tracking-wide"
                    >
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 border-t border-background/10 pt-8">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <img
                src={cpdBadge}
                alt="CPD Standards Office Accredited - Provider 50838"
                className="h-24 w-auto bg-white rounded-lg p-2"
              />
              <p className="text-sm text-background/50 text-center sm:text-left">
                © {new Date().getFullYear()} Bright Leadership Consulting. All rights reserved.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex gap-3">
                {[Linkedin, Twitter, Instagram].map((Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-background/10 text-background/70 transition-colors hover:bg-secondary hover:text-secondary-foreground"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;