import SEOHead from "@/components/SEOHead";
import { getProgrammeMetaByTitle } from "@/data/programmes";

interface ProgrammeMetaProps {
  /** Catalogue title, must match src/data/programmes.ts */
  programmeTitle: string;
  /** Optional overrides for page-specific framing */
  title?: string;
  description?: string;
  path?: string;
}

/**
 * Per-course Open Graph / Twitter Card tags derived from the programme
 * catalogue, so social previews can never drift from the portfolio data.
 */
const ProgrammeMeta = ({ programmeTitle, title, description, path }: ProgrammeMetaProps) => {
  const meta = getProgrammeMetaByTitle(programmeTitle);
  if (!meta) return null;

  return (
    <SEOHead
      title={title ?? meta.title}
      description={description ?? meta.description}
      path={path ?? meta.path}
      image={meta.image}
      type="article"
    />
  );
};

export default ProgrammeMeta;
