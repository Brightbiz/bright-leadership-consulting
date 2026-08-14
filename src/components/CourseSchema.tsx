import { Helmet } from "react-helmet-async";
import { programmes, type Programme } from "@/data/programmes";

const SITE_URL = "https://brightleadershipconsulting.com";
const PROVIDER = {
  "@type": "Organization",
  name: "Bright Leadership Consulting",
  url: SITE_URL,
} as const;

/** Canonical URL for a programme: in-site detail page if present, else /courses. */
const programmeUrl = (p: Programme) =>
  `${SITE_URL}${p.detailPage ?? "/courses"}`;

/** Parses "50–66 CPD hours" (en dash or hyphen) into its numeric bounds. */
const cpdRange = (cpdHours?: string) => {
  const match = cpdHours?.match(/(\d+(?:\.\d+)?)\s*[–-]\s*(\d+(?:\.\d+)?)/);
  if (!match) return null;
  return { min: Number(match[1]), max: Number(match[2]) };
};

/**
 * Accredited CPD hours expressed for search engines:
 *  - timeRequired / courseWorkload as ISO 8601 durations (lower and upper bound)
 *  - educationalCredentialAwarded naming the accredited hours
 *  - an additionalProperty carrying the human-readable range
 */
const cpdNodes = (p: Programme) => {
  const range = cpdRange(p.cpdHours);
  if (!range) return { workload: "PT10H", extra: {} };

  return {
    workload: `PT${range.max}H`,
    extra: {
      timeRequired: `PT${range.min}H`,
      educationalCredentialAwarded: `CPDSO Certificate of Attendance — ${p.cpdHours}, accredited by The CPD Standards Office (Provider 50838). Not a qualification, professional certification or academic award.`,
      additionalProperty: [
        {
          "@type": "PropertyValue",
          name: "Accredited CPD hours",
          value: p.cpdHours,
          minValue: range.min,
          maxValue: range.max,
          unitText: "HUR",
        },
      ],
    },
  };
};

const courseNode = (p: Programme) => {
  const { workload, extra } = cpdNodes(p);
  return {
    "@type": "Course",
    name: p.title,
    description: p.description,
    url: programmeUrl(p),
    provider: PROVIDER,
    ...extra,
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "online",
      courseWorkload: workload,
    },
    // No `sameAs` while individual places are arranged directly: the
    // catalogue link is an in-site enquiry path, not an external course page.
    ...(p.detailPage && /^https:/.test(p.link) ? { sameAs: p.link } : {}),
  };
};


interface CourseSchemaProps {
  /** Emit a single Course node for this programme title; omit for the full catalogue list. */
  programmeTitle?: string;
  /** Canonical path of the listing page (used when emitting the ItemList). */
  listPath?: string;
  listName?: string;
}

/**
 * JSON-LD structured data for the executive programmes.
 * Sourced from src/data/programmes.ts so schema can never drift from the catalogue.
 */
const CourseSchema = ({
  programmeTitle,
  listPath = "/courses",
  listName = "Executive Programmes",
}: CourseSchemaProps) => {
  let data: Record<string, unknown> | null = null;

  if (programmeTitle) {
    const programme = programmes.find((p) => p.title === programmeTitle);
    if (!programme) return null;
    data = { "@context": "https://schema.org", ...courseNode(programme) };
  } else {
    data = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: listName,
      url: `${SITE_URL}${listPath}`,
      numberOfItems: programmes.length,
      itemListElement: programmes.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: programmeUrl(p),
        item: courseNode(p),
      })),
    };
  }

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(data)}</script>
    </Helmet>
  );
};

export default CourseSchema;
