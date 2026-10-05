import { describe, expect, it, beforeEach } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createWatchTracker } from "@/hooks/useWatchProgress";
import { readCampaignTags } from "@/lib/campaignTags";
import { MARKETING_CONSENT_TEXT, MARKETING_CONSENT_VERSION } from "@/data/marketingConsent";
import { CONSENT_STORAGE_KEY, getConsent, hasAnalyticsConsent, setConsent } from "@/lib/consent";

function run(tracker: ReturnType<typeof createWatchTracker>, from: number, to: number, duration = 100) {
  tracker.seek(from);
  for (let t = from; t <= to; t += 0.25) tracker.tick(t, duration, 1, false);
}

describe("watch progress", () => {
  it("counts only continuously watched seconds and ignores skips and replays", () => {
    const sent: string[] = [];
    const t = createWatchTracker((n, p) => sent.push(`${n}:${p.percent ?? ""}`));
    t.play();
    t.play();
    run(t, 0, 20);
    t.seek(90); // skip ahead: nothing counted
    t.tick(90, 100, 1, false);
    run(t, 0, 20); // replay: no inflation
    expect(t.watchedSeconds).toBe(21);
    expect(sent).toEqual(["elm_webinar_play:"]);
    run(t, 21, 30);
    expect(sent).toContain("elm_webinar_progress:25");
    expect(sent.filter((s) => s.endsWith(":25"))).toHaveLength(1);
  });

  it("completes at 95% and fires each threshold once", () => {
    const sent: string[] = [];
    const t = createWatchTracker((n, p) => sent.push(`${n}:${p.percent ?? ""}`));
    run(t, 0, 94.5);
    expect(sent).toEqual(["elm_webinar_progress:25", "elm_webinar_progress:50", "elm_webinar_progress:75", "elm_webinar_progress:100"]);
  });

  it("does not count faster-than-normal playback", () => {
    const t = createWatchTracker(() => {});
    t.seek(0);
    for (let x = 0; x < 10; x += 0.25) t.tick(x, 100, 2, false);
    expect(t.watchedSeconds).toBe(0);
  });
});

describe("campaign tags", () => {
  it("keeps only allow-listed, length-limited values", () => {
    const tags = readCampaignTags(
      new URLSearchParams("utm_source=linkedin&utm_medium=social<script>&utm_campaign=" + "a".repeat(101) + "&utm_term=x"),
    );
    expect(tags).toEqual({ utm_source: "linkedin" });
  });
});

describe("consent categories", () => {
  beforeEach(() => localStorage.clear());
  it("stores analytics and advertising separately and ignores v1 records", () => {
    localStorage.setItem("blc.cookie-consent.v1", JSON.stringify({ advertising: true, version: 1 }));
    expect(getConsent()).toBeNull();
    setConsent({ analytics: true, advertising: false });
    expect(hasAnalyticsConsent()).toBe(true);
    expect(JSON.parse(localStorage.getItem(CONSENT_STORAGE_KEY)!).advertising).toBe(false);
    expect(localStorage.getItem("blc.cookie-consent.v1")).toBeNull();
  });
});

describe("marketing consent wording", () => {
  it("matches the server's canonical text", () => {
    const server = readFileSync(resolve(process.cwd(), "supabase/functions/_shared/marketingConsent.ts"), "utf8");
    expect(server).toContain(`"${MARKETING_CONSENT_VERSION}"`);
    expect(server).toContain(MARKETING_CONSENT_TEXT);
  });
});
