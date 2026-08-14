import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { individualEnquiryPath, type Programme } from "@/data/programmes";
import {
  trackProgrammeEnquiryClick,
  trackProgrammeAdvisoryClick,
  trackProgrammeDetailClick,
} from "@/lib/analytics";

type Props = {
  programme: Programme;
  /** Analytics surface, e.g. "/courses#comparison" */
  surface: string;
  /** Show the supporting helper line beneath the buttons */
  helperText?: boolean;
  className?: string;
  /**
   * Optional extra analytics hook, fired alongside the enquiry/advisory events
   * when a primary/secondary CTA is used. Lets a host section (e.g. the
   * programme selector) attribute the click to its own context.
   */
  onCtaClick?: (detail: { label: string; destination: string }) => void;
};

/**
 * Primary enrolment CTA for a programme.
 *
 * Individual places are arranged directly with Bright Leadership Consulting, so
 * the only enrolment control is an in-site enquiry route with the programme
 * preselected. No self-service platform-enrolment label or external purchase
 * destination exists in this component.
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
  /** Enquiry destination, with the programme preselected on the contact form. */
  const enquiryPath = programme.link.startsWith("/")
    ? programme.link
    : individualEnquiryPath(programme.title);

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
        <Link
          to={enquiryPath}
          className="btn-brief"
          onClick={handleRequestIndividualEnrolment}
        >
          Request Individual Enrolment
          <span className="sr-only">{` for ${programme.title}`}</span>
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>

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
