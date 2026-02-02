import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";
import { useActiveSection } from "@/hooks/useActiveSection";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Home", href: "/", sectionId: "" },
  { label: "About Us", href: "/about", sectionId: "" },
  { label: "Services", href: "/#services", sectionId: "services" },
  { label: "Courses", href: "/courses", sectionId: "" },
  { label: "Blog", href: "/blog", sectionId: "" },
  { label: "Contact", href: "/#contact", sectionId: "contact" },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const activeSection = useActiveSection();
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (link: typeof navLinks[0]) => {
    if (link.sectionId === "" && isHomePage && !activeSection) return true;
    return isHomePage && activeSection === link.sectionId;
  };

  return (
    <header className={cn(
      "fixed left-0 right-0 top-0 z-50 transition-all duration-300",
      isScrolled 
        ? "bg-background/95 backdrop-blur-md border-b border-border shadow-md" 
        : "bg-background/80 backdrop-blur-lg border-b border-border/50"
    )}>
      <div className="container-narrow">
        <nav className={cn(
          "flex items-center justify-between transition-all duration-300",
          isScrolled ? "h-16" : "h-20"
        )}>
          <Logo isCompact={isScrolled} />

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={cn(
                  "relative text-sm font-medium transition-colors hover:text-primary",
                  isActive(link)
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                {link.label}
                {isActive(link) && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full animate-fade-in" />
                )}
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
                  className={cn(
                    "text-base font-medium",
                    isActive(link) ? "text-primary" : "text-foreground"
                  )}
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