import { describe, it, expect } from "vitest";
import { readFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";

describe("legacy brochure release holds", () => {
  const baseline = [
    ["advanced-leadership-skills", "c26f88e79ad846a496dce9bbc13e4997dd6f2793073c7fba4f46962d41d45f57"],
    ["enhanced-employability-skills", "7a1d5d80031333ca415ffd4d477d9967a2ad1a8d92d5174a65a8baba66225657"],
  ];
  for (const [slug, hash] of baseline) {
    it(`keeps ${slug} revisions outside the public release without removing existing access`, () => {
      const name = `${slug}-brochure.html`;
      const published = readFileSync(`public/brochures/${name}`);
      expect(createHash("sha256").update(published).digest("hex")).toBe(hash);
      const held = `on-hold/brochure-review/legacy/${name}`;
      expect(existsSync(held)).toBe(true);
      expect(readFileSync(held).equals(published)).toBe(false);
    });
  }
});