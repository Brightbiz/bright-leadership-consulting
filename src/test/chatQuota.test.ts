import { describe, expect, it, vi } from "vitest";
import { reserveQuota } from "../../supabase/functions/chat-assistant/quota";

describe("chat quota fail-closed gate", () => {
  it("permits an explicitly confirmed reservation", async () => {
    expect(await reserveQuota(async () => ({ data: true, error: null }))).toBe(true);
  });
  it("blocks an exhausted quota", async () => {
    expect(await reserveQuota(async () => ({ data: false, error: null }))).toBe(false);
  });
  it("blocks database errors even with a true result", async () => {
    expect(await reserveQuota(async () => ({ data: true, error: new Error("quota unavailable") }))).toBe(false);
  });
  it("blocks exceptions", async () => {
    expect(await reserveQuota(async () => { throw new Error("connection failed"); })).toBe(false);
  });
  it("never authorises ambiguous responses", async () => {
    for (const data of [null, undefined, 1, "true", {}]) {
      expect(await reserveQuota(async () => ({ data, error: null }))).toBe(false);
    }
  });
  it("does not reach paid processing after a quota error", async () => {
    const paid = vi.fn();
    if (await reserveQuota(async () => ({ data: null, error: new Error("quota failed") }))) paid();
    expect(paid).not.toHaveBeenCalled();
  });
});