import { writeFileSync, statSync } from "fs";
import { resolve } from "path";
import { execSync } from "child_process";

const BASE_URL = "https://brightleadershipconsulting.com";

/**
 * Derive a page-specific <lastmod> value from the source file's last Git
 * commit date. Falls back to filesystem mtime when Git is unavailable or the
 * file is untracked. This keeps the sitemap in sync with actual content
 * changes rather than build time.
 */
function getLastModified(filePath) {
  try {
    const gitDate = execSync(`git log -1 --format=%cI -- "${filePath}"`, {
      encoding: "utf-8",
      stdio: ["pipe", "pipe", "ignore"],
      timeout: 5000,
    }).trim();
    if (gitDate) return gitDate.slice(0, 10); // YYYY-MM-DD
  } catch {
    // Git unavailable or file not tracked — fall through to mtime.
  }

  try {
    const stats = statSync(filePath);
    return stats.mtime.toISOString().slice(0, 10);
  } catch {
    return undefined;
  }
}

const entries = [
  { path: "/", source: "src/pages/Index.tsx", changefreq: "monthly", priority: "1.0" },
  { path: "/executive-alignment-index", source: "src/pages/ExecutiveAlignmentIndex.tsx", changefreq: "monthly", priority: "0.9" },
  { path: "/selected-engagements", source: "src/pages/SelectedEngagements.tsx", changefreq: "monthly", priority: "0.8" },
  { path: "/executive-alignment-brief", source: "src/pages/ExecutiveAlignmentBrief.tsx", changefreq: "monthly", priority: "0.7" },
  { path: "/contact", source: "src/pages/Contact.tsx", changefreq: "monthly", priority: "0.8" },
  { path: "/executive-leadership-mastery", source: "src/pages/ExecutiveLeadershipMastery.tsx", changefreq: "monthly", priority: "0.8" },
  { path: "/strategic-leadership-ai", source: "src/pages/StrategicLeadershipAI.tsx", changefreq: "monthly", priority: "0.8" },
  { path: "/courses", source: "src/pages/Courses.tsx", changefreq: "monthly", priority: "0.7" },
  { path: "/augmented-leadership", source: "src/pages/AugmentedLeadership.tsx", changefreq: "monthly", priority: "0.7" },
  { path: "/advisory-process", source: "src/pages/AdvisoryProcess.tsx", changefreq: "monthly", priority: "0.8" },
  { path: "/principal", source: "src/pages/Principal.tsx", changefreq: "yearly", priority: "0.6" },
  { path: "/privacy", source: "src/pages/Privacy.tsx", changefreq: "yearly", priority: "0.3" },
  { path: "/terms", source: "src/pages/Terms.tsx", changefreq: "yearly", priority: "0.3" },
  { path: "/brochures/executive-leadership-mastery-brochure.html", source: "public/brochures/executive-leadership-mastery-brochure.html", changefreq: "monthly", priority: "0.6" },
  { path: "/brochures/advanced-leadership-skills-brochure.html", source: "public/brochures/advanced-leadership-skills-brochure.html", changefreq: "monthly", priority: "0.6" },
  { path: "/brochures/future-of-work-brochure.html", source: "public/brochures/future-of-work-brochure.html", changefreq: "monthly", priority: "0.6" },
  { path: "/brochures/peak-performance-brochure.html", source: "public/brochures/peak-performance-brochure.html", changefreq: "monthly", priority: "0.6" },
  { path: "/brochures/enhanced-employability-skills-brochure.html", source: "public/brochures/enhanced-employability-skills-brochure.html", changefreq: "monthly", priority: "0.6" },
  { path: "/brochures/executive-alignment-index-brochure.html", source: "public/brochures/executive-alignment-index-brochure.html", changefreq: "monthly", priority: "0.6" },
];

function generateSitemap(entries) {
  const urls = entries.map((e) => {
    const lastmod = getLastModified(e.source);
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
