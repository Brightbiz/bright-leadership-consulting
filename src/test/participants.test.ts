import { describe, it, expect } from "vitest";
import { isDuplicateEnrolment, normaliseParticipantEmail } from "@/lib/participants";

describe("participant rules", () => {
  it("treats differently-cased emails as the same participant", () => {
    expect(normaliseParticipantEmail(" Jane@Example.COM ")).toBe("jane@example.com");
  });
  it("blocks a second place in the same cohort", () => {
    expect(isDuplicateEnrolment([{ participant_id: "p1", cohort_code: "LP-1" }], "p1", "LP-1")).toBe(true);
  });
  it("allows the same participant in a different cohort", () => {
    expect(isDuplicateEnrolment([{ participant_id: "p1", cohort_code: "LP-1" }], "p1", "LP-2")).toBe(false);
  });
});
