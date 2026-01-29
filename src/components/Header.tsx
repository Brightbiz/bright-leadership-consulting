import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Programs", href: "/#programs" },
  { label: "Coaching", href: "/#coaching" },
  { label: "About", href: "/#about" },
  { label: "Leadership Checklist", href: "/leadership-checklist" },
  { label: "Contact", href: "/#contact" },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed left-0 right-0 top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
      <div className="container-narrow">
        <nav className="flex h-20 items-center justify-between">
          <Logo />

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <ThemeToggle />
            <Button variant="ghost" size="sm">
              My Account
            </Button>
            <Button variant="teal" size="default" asChild>
              <a href="#contact">Contact Us</a>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted md:hidden"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="absolute left-0 right-0 top-20 border-b border-border bg-background p-6 shadow-lg md:hidden">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-base font-medium text-foreground"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <div className="mt-4 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Theme</span>
                  <ThemeToggle />
                </div>
                <Button variant="outline" className="w-full">
                  My Account
                </Button>
                <Button variant="teal" className="w-full" asChild>
                  <a href="#contact" onClick={() => setIsMenuOpen(false)}>Contact Us</a>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;