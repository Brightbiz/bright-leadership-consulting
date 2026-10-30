import { describe, expect, it } from "vitest";
import { programmes } from "@/data/programmes";
import { CPD_PROVIDER_NUMBER } from "@/data/accreditation";

describe("approved CPD programme details", () => {
  it("uses CPDSO provider 50838", () => {
    expect(CPD_PROVIDER_NUMBER).toBe("50838");
  });
  it.each([
    ["Executive Leadership Mastery Programme", "50–66 CPD hours"],
    ["Strategic Leadership in the Age of AI", "20–30 CPD hours"],
    ["Future Workplace and Workforce Strategy Programme", "20–25 CPD hours"],
    ["Strategic Productivity and Peak Performance Accelerator", "20–25 CPD hours"],
  ])("retains the approved hours for %s", (title, hours) => {
    expect(programmes.find((programme) => programme.title === title)?.cpdHours).toBe(hours);
  });
  it("keeps Leading People outside the four accredited programmes", () => {
    expect(programmes).toHaveLength(4);
    expect(programmes.some((programme) => programme.title === "Leading People")).toBe(false);
  });
});