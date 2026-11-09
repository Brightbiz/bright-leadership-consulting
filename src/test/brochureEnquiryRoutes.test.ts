import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { brochureCtaLinks } from "@/data/programmes";

describe("retained brochure programme enquiry destinations", () => {
  for (const [key, filename, title] of [
    ["executive-leadership-mastery", "executive-leadership-mastery", "Executive Leadership Mastery Programme"],
    ["future-of-work", "future-of-work", "Future Workplace and Workforce Strategy Programme"],
    ["peak-performance", "peak-performance", "Strategic Productivity and Peak Performance Accelerator"],
  ]) {
    it(`${key} selects its own programme on the same-origin enquiry form`, () => {
      const destination = new URL(brochureCtaLinks[key], "https://preview.example");
      expect(destination.origin).toBe("https://preview.example");
      expect(destination.pathname).toBe("/contact");
      expect(destination.searchParams.get("programme")).toBe(title);
      expect(destination.hash).toBe("#enquiry-form");
      const html = readFileSync(`public/brochures/${filename}-brochure.html`, "utf8");
      const href = html.match(new RegExp(`<a href="([^"]+)" data-programme="${key}"`))?.[1];
      expect(href).toBe(brochureCtaLinks[key]);
    });
  }
});