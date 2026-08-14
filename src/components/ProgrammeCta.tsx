import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Loader2 } from "lucide-react";
import { individualEnquiryPath, type Programme } from "@/data/programmes";
import {
  trackCourseCtaClick,
  trackProgrammeEnrolClick,
  trackProgrammeEnquiryClick,
  trackProgrammeAdvisoryClick,
  trackProgrammeDetailClick,
  trackEvent,
} from "@/lib/analytics";

type Props = {
  programme: Programme;
  /** Analytics surface, e.g. "/courses#comparison" */
  surface: string;
  /** Show the supporting helper line beneath the buttons */
  helperText?: boolean;
  className?: string;
  /**
   * Optional extra analytics hook, fired alongside `course_cta_click` when a
   * primary/secondary CTA is used. Lets a host section (e.g. the programme
   * selector) attribute the click to its own context.
   */
  onCtaClick?: (detail: { label: string; destination: string }) => void;
};

/** A usable enrolment destination is an absolute https URL on the platform. */
const isUsableEnrolmentUrl = (url: unknown): url is string => {
  if (typeof url !== "string" || url.trim() === "") return false;
  try {
    return new URL(url).protocol === "https:";
  } catch {
    return false;
  }
};

/**
 * Primary enrolment CTA for a programme.
 *
 * Individual places are currently arranged directly, so the primary control is
 * an in-site enquiry route. Three states, so no control can ever lead to a
 * dead end:
 *  - arranged directly (default) → "Request Individual Enrolment" → /contact
 *    with the programme preselected.
 *  - self-service purchase live + valid https URL → the platform link.
 *  - purchase marked live but the URL is missing or malformed → the same
 *    enquiry route, with fallback messaging.
 *
 * Every control carries the programme title in its accessible name, so a
 * screen-reader user moving link-by-link can tell repeated CTAs apart.
 */
const ProgrammeCta = ({
  programme,
  surface,
  helperText = true,
  className = "",
  onCtaClick,
}: Props) => {
  const intakeOpen = programme.enrolmentAvailable !== false;
  const linkUsable = isUsableEnrolmentUrl(programme.link);
  const live = intakeOpen && linkUsable;
  /** Intake is open but we have no working destination to send people to. */
  const linkUnavailable = intakeOpen && !linkUsable;

  /** Enquiry destination, with the programme preselected on the contact form. */
  const enquiryPath = programme.link.startsWith("/")
    ? programme.link
    : individualEnquiryPath(programme.title);

  const [opening, setOpening] = useState(false);

  const handleEnrol = () => {
    trackCourseCtaClick({
      programme: programme.title,
      url: programme.link,
      surface,
      label: "Enrol on the Programme Platform",
    });
    trackProgrammeEnrolClick({
      programme: programme.title,
      destination: programme.link,
      surface,
      label: "Enrol on the Programme Platform",
    });
    onCtaClick?.({ label: "Enrol on the Programme Platform", destination: programme.link });
    // The new tab takes a moment to hand off; show progress so the click is
    // acknowledged and repeat clicks are prevented.
    setOpening(true);
    window.setTimeout(() => setOpening(false), 2500);
  };

  const handleUnavailable = () => {
    trackEvent("course_cta_unavailable", {
      programme_name: programme.title,
      cta_surface: surface,
      reason: "missing_or_invalid_enrolment_url",
    });
    trackProgrammeEnquiryClick({
      programme: programme.title,
      destination: "/contact",
      surface,
      label: "Request Individual Enrolment",
    });
    onCtaClick?.({
      label: "Request Individual Enrolment",
      destination: enquiryPath,
    });
  };

  const handleRequestIndividualEnrolment = () => {
    trackProgrammeEnquiryClick({
      programme: programme.title,
      destination: enquiryPath,
      surface,
      label: "Request Individual Enrolment",
    });
    onCtaClick?.({
      label: "Request Individual Enrolment",
      destination: enquiryPath,
    });
  };

  const handleAdvisory = () => {
    trackProgrammeAdvisoryClick({
      programme: programme.title,
      destination: "/contact",
      surface,
      label: "Discuss Executive Alignment",
    });
    onCtaClick?.({ label: "Discuss Executive Alignment", destination: "/contact" });
  };

  return (
    <div className={className}>
      {/* Grouped so a screen reader announces which programme the repeated
          controls belong to, and so keyboard users landing mid-table have
          context for the next few tab stops. */}
      <div
        role="group"
        aria-label={`Next steps for ${programme.title}`}
        className="flex flex-wrap items-center gap-3"
      >
        {live && (
          <a
            href={programme.link}
            target="_blank"
            rel="noopener noreferrer"
            className={`btn-brief ${opening ? "pointer-events-none opacity-70" : ""}`}
            aria-busy={opening || undefined}
            onClick={handleEnrol}
          >
            {opening ? "Opening enrolment" : "Enrol on the Programme Platform"}
            <span className="sr-only">
              {` in ${programme.title} (opens in a new tab)`}
            </span>
            {opening ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
            ) : (
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            )}
          </a>
        )}

        {linkUnavailable && (
          <Link
            to={enquiryPath}
            className="btn-brief"
            onClick={handleUnavailable}
          >
            Request Individual Enrolment
            <span className="sr-only">{` for ${programme.title}`}</span>
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        )}

        {!intakeOpen && (
          <Link
            to={enquiryPath}
            className="btn-brief"
            onClick={handleRequestIndividualEnrolment}
          >
            Request Individual Enrolment
            <span className="sr-only">{` for ${programme.title}`}</span>
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        )}

        <Link
          to="/contact"
          className="link-quiet text-sm"
          onClick={handleAdvisory}
        >
          Discuss Executive Alignment
          <span className="sr-only">{` regarding ${programme.title}`}</span>
          <ArrowRight className="h-3 w-3" aria-hidden="true" />
        </Link>

        {programme.detailPage && (
          <Link
            to={programme.detailPage}
            className="link-quiet text-sm"
            onClick={() =>
              trackProgrammeDetailClick({
                programme: programme.title,
                surface,
                destination: programme.detailPage!,
                control: "cta-detail-link",
              })
            }
          >
            View programme detail
            <span className="sr-only">{` for ${programme.title}`}</span>
            <ArrowRight className="h-3 w-3" aria-hidden="true" />
          </Link>
        )}
      </div>

      {/* Announced to screen readers without moving focus. */}
      <p role="status" aria-live="polite" className="sr-only">
        {opening ? `Opening enrolment for ${programme.title} in a new tab.` : ""}
      </p>

      {helperText && (
        <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
          {"Individual places are currently arranged directly. Submit an enquiry and we will confirm availability, payment arrangements and access."}
          {programme.individualFee
            ? ` Individual fee: ${programme.individualFee}.`
            : ""}
          {" For team, board or organisational delivery, choose Discuss Executive Alignment."}
        </p>
      )}
    </div>
  );
};



export default ProgrammeCta;
