import React from "react";
import { Helmet } from "react-helmet-async";

interface SEOHeadProps {
  title?: string;
  description?: string;
  path?: string;
  type?: string;
  /** Social-preview image. Absolute https URL, or a path under /public. */
  image?: string;
}

const SITE_URL = "https://brightleadershipconsulting.com";
const DEFAULT_TITLE = "Bright Leadership Consulting | Executive Alignment Advisory";
const DEFAULT_DESCRIPTION = "Executive alignment advisory for boards and leadership teams. The Executive Alignment Index™ measures structural variance so you can act before misalignment impacts performance.";
const DEFAULT_IMAGE = "/og-image.jpg";

const SEOHead = React.forwardRef<HTMLElement, SEOHeadProps>(({
  title,
  description = DEFAULT_DESCRIPTION,
  path = "/",
  type = "website",
  image = DEFAULT_IMAGE,
}, _ref) => {
  const fullTitle = title || DEFAULT_TITLE;
  const canonicalUrl = `${SITE_URL}${path}`;
  const imageUrl = image.startsWith("http") ? image : `${SITE_URL}${image}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />

      {/* Organization/WebSite entity markup lives in OrganizationSchema (homepage) to avoid duplicate nodes. */}

    </Helmet>
  );
});

SEOHead.displayName = "SEOHead";

export default SEOHead;
