import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  OPEN_PREFERENCES_EVENT,
  applyStoredConsent,
  getConsent,
  hasDecided,
  setConsent,
} from "@/lib/consent";

/**
 * Cookie consent banner and preferences panel.
 *
 * Accept and Reject are rendered as equally weighted, adjacent controls.
 * Analytics and advertising are separate choices; neither is preselected. The banner is not
 * dismissible by scrolling or navigating — a decision requires a positive
 * action — and it can be reopened at any time from the footer.
 */
const CookieConsent = () => {
  const [open, setOpen] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [advertising, setAdvertising] = useState(false);

  useEffect(() => {
    applyStoredConsent();
    if (!hasDecided()) setOpen(true);
  }, []);

  useEffect(() => {
    const reopen = () => {
      const record = getConsent();
      setAnalytics(record?.analytics ?? false);
      setAdvertising(record?.advertising ?? false);
      setShowPreferences(true);
      setOpen(true);
    };
    window.addEventListener(OPEN_PREFERENCES_EVENT, reopen);
    return () => window.removeEventListener(OPEN_PREFERENCES_EVENT, reopen);
  }, []);

  const decide = useCallback((choices: { analytics: boolean; advertising: boolean }) => {
    setConsent(choices);
    setShowPreferences(false);
    setOpen(false);
  }, []);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="fixed inset-x-0 bottom-0 z-50 border-t border-navy-foreground/15 bg-navy text-navy-foreground shadow-2xl"
          role="dialog"
          aria-modal="false"
          aria-label="Cookie preferences"
        >
          <div className="container-brief py-6">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-[560px] space-y-3">
                <p className="text-sm font-medium tracking-[0.02em]">
                  Cookies, analytics and advertising measurement
                </p>
                <p className="text-[13px] leading-relaxed text-navy-foreground/70">
                  We use strictly necessary storage to operate this site. With your
                  consent we also use Google Analytics to understand how pages and
                  the webinar are used, and Google Ads conversion measurement to
                  record whether an advertising click led to an enquiry. You can
                  accept either, both or neither, and change or withdraw your
                  choice at any time.
                </p>
                <p className="text-[13px] text-navy-foreground/60">
                  <Link
                    to="/privacy"
                    className="underline underline-offset-4 transition-colors hover:text-navy-foreground"
                  >
                    Read the cookie information in our Privacy Notice
                  </Link>
                </p>
              </div>

              <div className="flex shrink-0 flex-col gap-3 sm:flex-row sm:items-center lg:flex-col lg:items-stretch">
                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => decide({ analytics: true, advertising: true })}
                    className="min-w-[190px] rounded-sm border border-[hsl(38,60%,52%)] px-6 py-3 text-sm font-medium tracking-[0.03em] text-[hsl(38,60%,52%)] transition-colors hover:bg-[hsl(38,60%,52%)] hover:text-navy"
                  >
                    Accept all
                  </button>
                  <button
                    type="button"
                    onClick={() => decide({ analytics: false, advertising: false })}
                    className="min-w-[190px] rounded-sm border border-navy-foreground/40 px-6 py-3 text-sm font-medium tracking-[0.03em] text-navy-foreground transition-colors hover:border-navy-foreground hover:bg-navy-foreground/10"
                  >
                    Reject non-essential
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPreferences((value) => !value)}
                  aria-expanded={showPreferences}
                  className="text-[13px] text-navy-foreground/70 underline underline-offset-4 transition-colors hover:text-navy-foreground"
                >
                  Manage preferences
                </button>
              </div>
            </div>

            {showPreferences && (
              <div className="mt-8 space-y-4 border-t border-navy-foreground/15 pt-6">
                <div className="flex items-start gap-4">
                  <input
                    type="checkbox"
                    checked
                    disabled
                    readOnly
                    aria-label="Strictly necessary — always active"
                    className="mt-1 h-4 w-4 accent-[hsl(38,60%,52%)]"
                  />
                  <div>
                    <p className="text-sm font-medium">Strictly necessary</p>
                    <p className="text-[13px] leading-relaxed text-navy-foreground/70">
                      Required for the site to function and to remember this cookie
                      choice. Always active; cannot be switched off.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <input
                    id="consent-analytics"
                    type="checkbox"
                    checked={analytics}
                    onChange={(event) => setAnalytics(event.target.checked)}
                    className="mt-1 h-4 w-4 accent-[hsl(38,60%,52%)]"
                  />
                  <div>
                    <label htmlFor="consent-analytics" className="text-sm font-medium">
                      Analytics
                    </label>
                    <p className="text-[13px] leading-relaxed text-navy-foreground/70">
                      Google Analytics, used to count page visits and how much of the
                      webinar is watched, in aggregate. It does not identify you and
                      is not linked to any enquiry you send. Off by default.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <input
                    id="consent-advertising"
                    type="checkbox"
                    checked={advertising}
                    onChange={(event) => setAdvertising(event.target.checked)}
                    className="mt-1 h-4 w-4 accent-[hsl(38,60%,52%)]"
                  />
                  <div>
                    <label
                      htmlFor="consent-advertising"
                      className="text-sm font-medium"
                    >
                      Advertising
                    </label>
                    <p className="text-[13px] leading-relaxed text-navy-foreground/70">
                      Google Ads conversion measurement, used only to record whether
                      an advertising click resulted in an enquiry. Off by default.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => decide({ analytics, advertising })}
                    className="rounded-sm border border-navy-foreground/40 px-6 py-2.5 text-sm font-medium tracking-[0.03em] transition-colors hover:border-navy-foreground hover:bg-navy-foreground/10"
                  >
                    Save preferences
                  </button>
                  <button
                    type="button"
                    onClick={() => decide({ analytics: false, advertising: false })}
                    className="rounded-sm px-2 py-2.5 text-sm text-navy-foreground/70 underline underline-offset-4 transition-colors hover:text-navy-foreground"
                  >
                    Withdraw consent
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;
