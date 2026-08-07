import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "./Logo";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Executive Alignment Index™", href: "/executive-alignment-index" },
  { label: "Executive Programmes", href: "/courses" },
  { label: "How We Work", href: "/advisory-process" },
  { label: "Selected Engagements", href: "/selected-engagements" },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
    <a
      href="#main-content"
      className="skip-link"
      onClick={(e) => {
        const main = document.querySelector("main");
        if (main) {
          e.preventDefault();
          main.setAttribute("tabindex", "-1");
          (main as HTMLElement).focus();
          main.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }}
    >
      Skip to main content
    </a>
    <header className={cn(
      "fixed left-0 right-0 top-0 z-50 transition-all duration-300",
      isScrolled
        ? "bg-background/95 backdrop-blur-md border-b border-border shadow-sm"
        : "bg-background border-b border-border/40"
    )}>
      <div className="container-brief">
        <nav className={cn(
          "flex items-center justify-between transition-all duration-300",
          isScrolled ? "h-16" : "h-20"
        )}>
          <Logo isCompact={isScrolled} variant="horizontal" />

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-7 lg:gap-9 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className={cn(
                  "text-sm tracking-[0.03em] transition-colors hover:text-foreground",
                  location.pathname === link.href
                    ? "text-foreground font-medium"
                    : "text-muted-foreground font-normal"
                )}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/contact"
              className="btn-brief text-sm py-2 px-5"
            >
              Discuss Executive Alignment
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex h-11 w-11 items-center justify-center rounded md:hidden"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              id="mobile-navigation"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="absolute left-0 right-0 top-full overflow-hidden border-b border-border bg-background shadow-sm md:hidden"
            >
              <div className="flex flex-col gap-6 p-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    to={link.href}
                    className={cn(
                      "text-base font-medium tracking-wide",
                      location.pathname === link.href ? "text-foreground" : "text-muted-foreground"
                    )}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  to="/contact"
                  className="btn-brief w-full text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Discuss Executive Alignment
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
    </>
  );
};

export default Header;
