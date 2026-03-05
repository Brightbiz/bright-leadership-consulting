import React from "react";
import { Helmet } from "react-helmet-async";

interface SEOHeadProps {
  title?: string;
  description?: string;
  path?: string;
  type?: string;
}

const SITE_URL = "https://brightleadershipconsulting.com";
const DEFAULT_TITLE = "Bright Leadership Consulting | Executive Alignment Advisory";
const DEFAULT_DESCRIPTION = "Governance-level advisory measuring executive variance across decision rights, strategic interpretation, and escalation architecture.";

const SEOHead = React.forwardRef<HTMLElement, SEOHeadProps>(({
  title,
  description = DEFAULT_DESCRIPTION,
  path = "/",
  type = "website",
}, _ref) => {
  const fullTitle = title || DEFAULT_TITLE;
  const canonicalUrl = `${SITE_URL}${path}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={`${SITE_URL}/og-image.jpg`} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
    </Helmet>
  );
});

SEOHead.displayName = "SEOHead";

export default SEOHead;
