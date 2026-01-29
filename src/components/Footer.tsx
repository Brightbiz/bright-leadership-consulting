import { Mail, Phone, MapPin, Linkedin, Twitter, Instagram } from "lucide-react";
import { Link } from "react-router-dom";
import Logo from "./Logo";
import cpdBadge from "@/assets/cpd-badge.png";

const footerLinks = {
  programs: [
    { label: "Leadership Training", href: "#" },
    { label: "Executive Coaching", href: "#" },
    { label: "Corporate Retreats", href: "#" },
    { label: "Course Bundles", href: "#" },
  ],
  company: [
    { label: "About Us", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Contact", href: "#" },
  ],
  resources: [
    { label: "Leadership Checklist", href: "/leadership-checklist", isRoute: true },
    { label: "Free Resources", href: "#" },
    { label: "Case Studies", href: "#" },
    { label: "FAQ", href: "#" },
    { label: "Privacy Policy", href: "#" },
  ],
};

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
              Empowering leaders to achieve extraordinary results through 
              personalized coaching and transformative training programs.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-background/70">
                <Mail className="h-4 w-4 text-secondary" />
                info@bbsconsultinggroup.com
              </div>
              <div className="flex items-center gap-3 text-sm text-background/70">
                <Phone className="h-4 w-4 text-secondary" />
                +44 (0) 123 456 7890
              </div>
              <div className="flex items-center gap-3 text-sm text-background/70">
                <MapPin className="h-4 w-4 text-secondary" />
                London, United Kingdom
              </div>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="mb-4 font-semibold text-background">Programs</h4>
            <ul className="space-y-3">
              {footerLinks.programs.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-background/70 transition-colors hover:text-secondary"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-background">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-background/70 transition-colors hover:text-secondary"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-background">Resources</h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.label}>
                  {link.isRoute ? (
                    <Link
                      to={link.href}
                      className="text-sm text-background/70 transition-colors hover:text-secondary"
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <a
                      href={link.href}
                      className="text-sm text-background/70 transition-colors hover:text-secondary"
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
        <div className="mt-16 flex flex-col items-center justify-between gap-6 border-t border-background/10 pt-8 md:flex-row">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <img
              src={cpdBadge}
              alt="CPD Standards Office Accredited - Provider 50838"
              className="h-24 w-auto bg-white rounded-lg p-2"
            />
            <p className="text-sm text-background/50 text-center sm:text-left">
              © {new Date().getFullYear()} BBS Consulting Group. All rights reserved.
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
    </footer>
  );
};

export default Footer;