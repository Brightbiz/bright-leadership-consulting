import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
const src = readFileSync("on-hold/security-fixes/functions/chat-assistant/index.ts", "utf8");
const prompt = src.slice(src.indexOf("const SYSTEM_PROMPT = `"), src.indexOf("`;", src.indexOf("const SYSTEM_PROMPT = `")));
describe("staged chatbot instructions", () => {
  it.each(["98%", "40%", "25+", "10+ years", "24 hours", "training provider", "up to 12", "worldwide", "360", "psychometric", "scoping proposal"])("no unsupported claim: %s", (s) => expect(prompt).not.toContain(s));
  it("CPD hours scoped to the four programmes, Leading People excluded", () => {
    expect(prompt).toContain("CPD hours apply only to these four programmes");
    expect(prompt).toContain("Leading People is not CPD-accredited");
  });
  it("uses approved contact addresses and no reply time", () => {
    expect(prompt).toContain("info@brightleadershipconsulting.com");
    expect(prompt).toContain("admin@brightleadershipconsulting.com");
    expect(prompt).toContain("Never state a reply time");
  });
  it("ELM fee matches approved pricing", () => expect(prompt).toContain("£1,297 in full, or three monthly instalments of £435 (£1,305 in total)"));
  it("rate limit call preserved", () => expect(src).toContain("reserveQuota"));
});
