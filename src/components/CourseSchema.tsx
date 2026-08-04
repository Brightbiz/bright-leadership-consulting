import { Helmet } from "react-helmet-async";
import { programmes, type Programme } from "@/data/programmes";

const SITE_URL = "https://brightleadershipconsulting.com";
const PROVIDER = {
  "@type": "Organization",
  name: "Bright Leadership Consulting",
  url: SITE_URL,
} as const;

/** Canonical URL for a programme: in-site detail page if present, else the enrolment link. */
const programmeUrl = (p: Programme) =>
  p.detailPage ? `${SITE_URL}${p.detailPage}` : p.link;

const courseNode = (p: Programme) => ({
  "@type": "Course",
  name: p.title,
  description: p.description,
  url: programmeUrl(p),
  provider: PROVIDER,
  hasCourseInstance: {
    "@type": "CourseInstance",
    courseMode: "online",
    courseWorkload: "PT10H",
  },
  ...(p.detailPage ? { sameAs: p.link } : {}),
});

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
