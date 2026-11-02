import { describe, expect, it } from "vitest";
import { existsSync } from "node:fs";
import { execFileSync, spawnSync } from "node:child_process";
describe("internal CPD report packaging", () => {
  it("generates the detailed snapshot outside public", () => {
    execFileSync("node", ["scripts/generate-cpd-audit.mjs"]);
    expect(existsSync("on-hold/cpd-audit/snapshot.json")).toBe(true);
    expect(existsSync("public/cpd-audit.json")).toBe(false);
  });
  it("refuses an explicit public output path before writing", () => {
    const result = spawnSync("node", ["scripts/generate-cpd-audit.mjs", "--out", "public/cpd-audit.json"]);
    expect(result.status).toBe(1);
    expect(existsSync("public/cpd-audit.json")).toBe(false);
  });
});