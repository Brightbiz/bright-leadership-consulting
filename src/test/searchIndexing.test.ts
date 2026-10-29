import { describe, expect, it } from "vitest";
import { shouldNoindex } from "@/lib/searchIndexing";

describe("public discovery indexing", () => {
  it("allows Academy and Leading People on the public domain", () => {
    expect(shouldNoindex("brightleadershipconsulting.com", false)).toBe(false);
    expect(shouldNoindex("www.brightleadershipconsulting.com", false)).toBe(false);
  });
  it("excludes the preview host", () => {
    expect(shouldNoindex("id-preview--43b21fe4-e960-444b-bb8f-f71668f51cbd.lovable.app", false)).toBe(true);
  });
  it("retains webinar noindex even on the public domain", () => {
    expect(shouldNoindex("brightleadershipconsulting.com", true)).toBe(true);
  });
});