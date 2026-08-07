import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import type { Programme } from "@/data/programmes";
import { trackCourseCtaClick, trackProgrammeDetailClick } from "@/lib/analytics";

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

/**
 * Primary enrolment CTA for a programme.
 * Live programmes route to the enrolment platform; unpublished programmes
 * route to /contact so no CTA can lead to a dead end.
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
  const live = programme.enrolmentAvailable !== false;

  const handleCta = (label: string, destination: string) => {
    trackCourseCtaClick({ programme: programme.title, url: destination, surface, label });
    onCtaClick?.({ label, destination });
  };

  return (
    <div className={className}>
      <div className="flex flex-wrap items-center gap-3">
        {live ? (
          <a
            href={programme.link}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-brief"
            onClick={() => handleCta("Enrol Now", programme.link)}
          >
            Enrol Now
            <span className="sr-only">
              {` in ${programme.title} (opens in a new tab)`}
            </span>
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        ) : (
          <Link
            to="/contact"
            className="btn-brief"
            onClick={() => handleCta("Request Availability", "/contact")}
          >
            Request Availability
            <span className="sr-only">{` for ${programme.title}`}</span>
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        )}

        <Link
          to="/contact"
          className="link-quiet text-sm"
          onClick={() => handleCta("Discuss Executive Alignment", "/contact")}
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
          {live
            ? `Individual enrolment completes on the programme platform${
                programme.individualFee ? ` (${programme.individualFee})` : ""
              }. Cohort, organisational and 1:1 delivery is scoped directly — use the second route.`
            : "Not currently open for direct enrolment. Enquire for the next intake date and organisational delivery options; enquiries are handled confidentially."}
        </p>
      )}
    </div>
  );
};

export default ProgrammeCta;
