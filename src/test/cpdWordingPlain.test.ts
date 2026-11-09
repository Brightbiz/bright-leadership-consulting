import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
const files = ["src/components/BeforeYouEnrol.tsx","src/components/ProgrammeFaq.tsx","src/data/cpd-faq.json","src/pages/StrategicLeadershipAI.tsx","src/pages/Courses.tsx"];
describe("public CPD wording", () => {
  for (const f of files) it(`${f} has no unverified hour-bound explanation`, () => {
    const s = readFileSync(f, "utf8");
    expect(s).not.toMatch(/Most participants complete|lower bound|upper bound|depth of\s+engagement/i);
  });
});
