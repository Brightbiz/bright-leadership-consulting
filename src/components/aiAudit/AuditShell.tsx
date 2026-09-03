import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Logo from "@/components/Logo";
import { openCookiePreferences } from "@/lib/consent";

interface AuditShellProps {
  /** Completion percentage, 0–100. */
  progress: number;
  /** Announced screen name for assistive technology. */
  stepLabel: string;
  children: React.ReactNode;
}

/**
 * Dark board-pack frame for the audit journey. Single <main>, single <h1> per
 * screen, and a progress bar exposed as a progressbar to assistive technology.
 */
const AuditShell = ({ progress, stepLabel, children }: AuditShellProps) => (
  <div className="min-h-dvh bg-navy text-navy-foreground">
    <header className="mx-auto flex w-full max-w-[760px] items-center justify-between px-5 pt-6">
      <Logo variant="light" isCompact />
      <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-navy-note">
        AI Leadership Readiness Audit
      </p>
    </header>


    <div className="mx-auto mt-6 w-full max-w-[760px] px-5">
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress}
        aria-label="Audit progress"
        className="h-[2px] w-full overflow-hidden rounded bg-navy-foreground/15"
      >
        <motion.div
          className="h-full bg-gold"
          initial={false}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
        />
      </div>
    </div>

    <p aria-live="polite" className="sr-only">
      {stepLabel}
    </p>

    <main className="mx-auto w-full max-w-[760px] px-5 pb-16 pt-12">{children}</main>

    <div className="mx-auto w-full max-w-[760px] px-5 pb-16">
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-navy-foreground/15 pt-6">
        <Link
          to="/privacy"
          className="inline-flex min-h-11 items-center rounded-sm py-3 text-xs text-navy-foreground/60 underline underline-offset-4 transition-colors hover:text-navy-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
        >
          Privacy Notice
        </Link>
        <button
          type="button"
          onClick={openCookiePreferences}
          className="inline-flex min-h-11 items-center rounded-sm py-3 text-xs text-navy-foreground/60 underline underline-offset-4 transition-colors hover:text-navy-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
        >
          Cookie Preferences
        </button>
      </div>
    </div>
  </div>
);

export default AuditShell;
