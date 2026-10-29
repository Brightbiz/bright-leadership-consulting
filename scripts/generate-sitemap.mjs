import { writeFileSync } from "fs";
import { resolve } from "path";

const BASE_URL = "https://brightleadershipconsulting.com";

/**
 * Each entry's lastmod is recorded by hand: update it only when that page's
 * content materially changes. Never derive it from Git, file times or the
 * build date — the publish build has no history, so those re-stamp every page.
 */
const entries = [
  { path: "/", lastmod: "2026-08-04", changefreq: "monthly", priority: "1.0" },
  { path: "/executive-alignment-index", lastmod: "2026-08-04", changefreq: "monthly", priority: "0.9" },
  { path: "/selected-engagements", lastmod: "2026-08-04", changefreq: "monthly", priority: "0.8" },
  { path: "/executive-alignment-brief", lastmod: "2026-04-08", changefreq: "monthly", priority: "0.7" },
  { path: "/contact", lastmod: "2026-10-05", changefreq: "monthly", priority: "0.8" },
  { path: "/executive-leadership-mastery", lastmod: "2026-10-05", changefreq: "monthly", priority: "0.8" },
  { path: "/strategic-leadership-ai", lastmod: "2026-10-05", changefreq: "monthly", priority: "0.8" },
  { path: "/future-of-work", lastmod: "2026-08-14", changefreq: "monthly", priority: "0.8" },
  { path: "/strategic-productivity-peak-performance", lastmod: "2026-08-14", changefreq: "monthly", priority: "0.8" },
  { path: "/strategic-ai-leadership-for-organisations", lastmod: "2026-10-05", changefreq: "monthly", priority: "0.9" },

  { path: "/courses", lastmod: "2026-08-20", changefreq: "monthly", priority: "0.7" },
  { path: "/augmented-leadership", lastmod: "2026-04-08", changefreq: "monthly", priority: "0.7" },
  { path: "/advisory-process", lastmod: "2026-08-08", changefreq: "monthly", priority: "0.8" },
  { path: "/principal", lastmod: "2026-10-05", changefreq: "yearly", priority: "0.6" },
  { path: "/insights", lastmod: "2026-10-13", changefreq: "monthly", priority: "0.6" },
  { path: "/insights/four-question-decision-test", lastmod: "2026-10-13", changefreq: "yearly", priority: "0.6" },
  { path: "/privacy", lastmod: "2026-10-29", changefreq: "yearly", priority: "0.3" },
  { path: "/terms", lastmod: "2026-09-25", changefreq: "yearly", priority: "0.3" },
  { path: "/brochures/executive-leadership-mastery-brochure.html", lastmod: "2026-10-05", changefreq: "monthly", priority: "0.6" },
  { path: "/brochures/future-of-work-brochure.html", lastmod: "2026-08-14", changefreq: "monthly", priority: "0.6" },
  { path: "/brochures/peak-performance-brochure.html", lastmod: "2026-08-14", changefreq: "monthly", priority: "0.6" },
  { path: "/brochures/executive-alignment-index-brochure.html", lastmod: "2026-08-07", changefreq: "monthly", priority: "0.6" },
];

function generateSitemap(entries) {
  const urls = entries.map((e) => {
    const lastmod = e.lastmod;
    return [
      `  <url>`,
      `    <loc>${BASE_URL}${e.path}</loc>`,
      lastmod ? `    <lastmod>${lastmod}</lastmod>` : null,
      `    <changefreq>${e.changefreq}</changefreq>`,
      `    <priority>${e.priority}</priority>`,
      `  </url>`,
    ]
      .filter(Boolean)
      .join("\n");
  });

  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
    ...urls,
    `</urlset>`,
  ].join("\n");
}

writeFileSync(resolve("public/sitemap.xml"), generateSitemap(entries));
console.log(`sitemap.xml written (${entries.length} entries)`);
