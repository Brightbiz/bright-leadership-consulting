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
const DEFAULT_DESCRIPTION = "Executive alignment rarely breaks — it drifts. We measure executive variance through the Executive Alignment Index™, helping leadership teams maintain structural clarity.";

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
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${SITE_URL}/og-image.jpg`} />
      <script type="application/ld+json">{JSON.stringify({
        "@context": "https://schema.org",
        "@type": "ProfessionalService",
        "name": "Bright Leadership Consulting",
        "description": DEFAULT_DESCRIPTION,
        "url": SITE_URL,
        "serviceType": "Executive Alignment Advisory",
        "areaServed": "Worldwide",
        "logo": `${SITE_URL}/favicon.png`
      })}</script>
    </Helmet>
  );
});

SEOHead.displayName = "SEOHead";

export default SEOHead;
