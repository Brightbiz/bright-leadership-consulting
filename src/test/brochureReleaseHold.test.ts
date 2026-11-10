import { describe, it, expect } from "vitest";
import { readFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";

const sha256 = (path: string) =>
  createHash("sha256").update(readFileSync(path)).digest("hex");

describe("legacy brochure release holds", () => {
  it("keeps enhanced-employability-skills revisions outside the public release without removing existing access", () => {
    const name = "enhanced-employability-skills-brochure.html";
    expect(sha256(`public/brochures/${name}`)).toBe(
      "7a1d5d80031333ca415ffd4d477d9967a2ad1a8d92d5174a65a8baba66225657",
    );
    const held = `on-hold/brochure-review/legacy/${name}`;
    expect(existsSync(held)).toBe(true);
    expect(readFileSync(held).equals(readFileSync(`public/brochures/${name}`))).toBe(false);
  });

  it("serves the approved retirement notice for advanced-leadership-skills and preserves the published brochure internally", () => {
    // Retirement approved for preview 10 Nov 2026: the public URL now serves a
    // brief withdrawal notice linking to /courses, with no enquiry action and
    // no accreditation presentation. The published brochure is preserved
    // internally at its recorded baseline hash.
    expect(sha256("public/brochures/advanced-leadership-skills-brochure.html")).toBe(
      "e0482bd10693dd907ba5db06b66e903d06393965ae1f4bceb936ea1ce4cf6add",
    );
    const preserved =
      "on-hold/brochure-review/legacy/advanced-leadership-skills-brochure-published-2026-11-04.html";
    expect(existsSync(preserved)).toBe(true);
    expect(sha256(preserved)).toBe(
      "c26f88e79ad846a496dce9bbc13e4997dd6f2793073c7fba4f46962d41d45f57",
    );
    // The earlier held revision remains on hold, untouched by the retirement.
    const heldRevision = "on-hold/brochure-review/legacy/advanced-leadership-skills-brochure.html";
    expect(existsSync(heldRevision)).toBe(true);
    expect(readFileSync(heldRevision).equals(readFileSync(preserved))).toBe(false);
  });
});
