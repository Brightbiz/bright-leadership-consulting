import { describe, expect, it } from "vitest";
import { leadingPeopleEnquiryType, ALLOWED_ENQUIRY_TYPES } from "../../supabase/functions/_shared/enquiryLabels";

describe("Leading People enquiry attribution", () => {
  it("labels explicit employer cohort enquiries", () => {
    expect(leadingPeopleEnquiryType(new URLSearchParams("cohort=leading-people"), false)).toBe("leading_people_cohort");
    expect(ALLOWED_ENQUIRY_TYPES).toContain("leading_people_cohort");
  });
  it("does not label unrelated enquiries or cleared URLs", () => {
    expect(leadingPeopleEnquiryType(new URLSearchParams(), false)).toBeNull();
    expect(leadingPeopleEnquiryType(new URLSearchParams("cohort=other"), false)).toBeNull();
  });
  it("does not override a programme enquiry", () => {
    expect(leadingPeopleEnquiryType(new URLSearchParams("cohort=leading-people"), true)).toBeNull();
  });
});