import { Helmet } from "react-helmet-async";

const SITE_URL = "https://brightleadershipconsulting.com";
const ORG_ID = `${SITE_URL}/#organization`;
const SITE_ID = `${SITE_URL}/#website`;

const DESCRIPTION =
  "Executive alignment advisory for boards and leadership teams. The Executive Alignment Index™ measures structural variance so boards can act before misalignment impacts performance.";

/**
 * Site-level Organization + WebSite JSON-LD, emitted once on the homepage.
 * Uses @id references so course and engagement schema can attach to the same entity.
 */
const OrganizationSchema = () => {
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Organization", "ProfessionalService"],
        "@id": ORG_ID,
        name: "Bright Leadership Consulting",
        alternateName: "Bright Leadership",
        url: `${SITE_URL}/`,
        description: DESCRIPTION,
        slogan: "Executive alignment rarely breaks — it drifts.",
        founder: {
          "@type": "Person",
          name: "Irene A. Agunbiade",
          jobTitle: "Principal",
        },
        logo: {
          "@type": "ImageObject",
          "@id": `${SITE_URL}/#logo`,
          url: `${SITE_URL}/favicon.png`,
          contentUrl: `${SITE_URL}/favicon.png`,
          width: 512,
          height: 512,
          caption: "Bright Leadership Consulting",
        },
        image: { "@id": `${SITE_URL}/#logo` },
        email: "info@brightleadershipconsulting.com",
        address: {
          "@type": "PostalAddress",
          streetAddress: "82 James Carter Road",
          addressLocality: "Mildenhall",
          addressRegion: "England",
          postalCode: "IP28 7DE",
          addressCountry: "GB",
        },
        areaServed: [
          { "@type": "Country", name: "United Kingdom" },
          { "@type": "Place", name: "Worldwide" },
        ],
        knowsAbout: [
          "Executive alignment diagnostic",
          "Board-level governance instrument",
          "Leadership team variance",
          "Executive programmes",
        ],
        contactPoint: [
          {
            "@type": "ContactPoint",
            contactType: "executive enquiries",
            email: "info@brightleadershipconsulting.com",
            areaServed: "GB",
            availableLanguage: "English",
          },
        ],
      },
      {
        "@type": "WebSite",
        "@id": SITE_ID,
        url: `${SITE_URL}/`,
        name: "Bright Leadership Consulting",
        description: DESCRIPTION,
        inLanguage: "en-GB",
        publisher: { "@id": ORG_ID },
      },
    ],
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(graph)}</script>
    </Helmet>
  );
};

export default OrganizationSchema;
