import fs from "fs";
import path from "path";
import type { Plugin } from "vite";
import { brochureCtaLinks, brochureCtaLabels } from "../src/data/programmes";

const BROCHURE_DIR = path.resolve(__dirname, "../public/brochures");

/**
 * Rewrites the `href` of every brochure CTA anchor carrying a
 * `data-programme="<key>"` attribute so it matches `brochureCtaLinks`
 * in src/data/programmes.ts. Runs on dev-server start and on every build,
 * so the static brochures can never drift from the programme catalogue.
 */
export function brochureLinkSync(): Plugin {
  const sync = () => {
    if (!fs.existsSync(BROCHURE_DIR)) return;
    const changed: string[] = [];

    for (const file of fs.readdirSync(BROCHURE_DIR)) {
      if (!file.endsWith(".html")) continue;
      const filePath = path.join(BROCHURE_DIR, file);
      const original = fs.readFileSync(filePath, "utf8");

      // Rewrite both the href and, where a label is managed, the CTA text —
      // so a Thinkific purchase URL or an "Enrol Now" label can never be
      // reintroduced into a catalogue brochure by an edit to the HTML.
      let updated = original.replace(
        /<a\s+href="([^"]*)"\s+data-programme="([^"]+)"/g,
        (match, href: string, key: string) => {
          const canonical = brochureCtaLinks[key];
          if (!canonical || canonical === href) return match;
          return `<a href="${canonical}" data-programme="${key}"`;
        },
      );

      updated = updated.replace(
        /(<a\s+href="[^"]*"\s+data-programme="([^"]+)"[^>]*>)([\s\S]*?)(<\/a>)/g,
        (match, open: string, key: string, inner: string, close: string) => {
          const label = brochureCtaLabels[key];
          if (!label) return match;
          const arrow = /&rarr;/.test(inner) ? " &rarr;" : "";
          return `${open}${label}${arrow}${close}`;
        },
      );

      if (updated !== original) {
        fs.writeFileSync(filePath, updated);
        changed.push(file);
      }
    }

    if (changed.length) {
      console.log(
        `[brochure-links] synced CTA links from src/data/programmes.ts: ${changed.join(", ")}`,
      );
    }
  };

  return {
    name: "brochure-link-sync",
    buildStart: sync,
    configureServer: sync,
  };
}
