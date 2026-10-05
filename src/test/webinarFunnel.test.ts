import { describe, expect, it, beforeEach } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createWatchTracker } from "@/hooks/useWatchProgress";
import { readCampaignTags } from "@/lib/campaignTags";
import { MARKETING_CONSENT_TEXT, MARKETING_CONSENT_VERSION } from "@/data/marketingConsent";
import { CONSENT_STORAGE_KEY, getConsent, hasAnalyticsConsent, setConsent } from "@/lib/consent";

function run(tracker: ReturnType<typeof createWatchTracker>, from: number, to: number, duration = 100, step = 0.25) {
  tracker.interrupt(from);
  for (let t = from; t <= to; t += step) tracker.tick(t, duration, false, false);
}

describe("watch coverage", () => {
  it("counts distinct played sections; ignores seeks and replays", () => {
    const sent: string[] = [];
    const t = createWatchTracker((n, p) => sent.push(`${n}:${p.percent ?? ""}`));
    t.play(); t.play();
    run(t, 0, 20);
    t.interrupt(90); t.tick(90, 100, false, false);
    run(t, 0, 20);
    expect(t.watchedSeconds).toBe(21);
    expect(sent).toEqual(["elm_webinar_play:"]);
    run(t, 21, 30);
    expect(sent.filter((s) => s === "elm_webinar_progress:25")).toHaveLength(1);
  });

  it("fires 25/50/75 once and a separate complete at 95%, never 100", () => {
    const sent: string[] = [];
    const t = createWatchTracker((n, p) => sent.push(`${n}:${p.percent ?? ""}`));
    run(t, 0, 93.5);
    expect(sent).toEqual(["elm_webinar_progress:25", "elm_webinar_progress:50", "elm_webinar_progress:75"]);
    run(t, 93.5, 94.5);
    expect(sent).toContain("elm_webinar_complete:");
    run(t, 0, 99);
    expect(sent.filter((s) => s.startsWith("elm_webinar_complete"))).toHaveLength(1);
    expect(sent.some((s) => s.includes("100"))).toBe(false);
  });

  it("counts faster playback; ignores paused and buffering time", () => {
    const t = createWatchTracker(() => {});
    run(t, 0, 10, 100, 0.5); // 2x speed
    expect(t.watchedSeconds).toBe(11);
    t.interrupt(50);
    t.tick(50, 100, true, false); t.tick(51, 100, true, false);
    t.tick(52, 100, false, true); t.tick(53, 100, false, true);
    expect(t.watchedSeconds).toBe(11);
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
  it("stores the analytics choice and ignores v1/v2 records", () => {
    localStorage.setItem("blc.cookie-consent.v1", JSON.stringify({ advertising: true, version: 1 }));
    localStorage.setItem("blc.cookie-consent.v2", JSON.stringify({ analytics: true, advertising: true, version: 2 }));
    expect(getConsent()).toBeNull();
    setConsent({ analytics: true });
    expect(hasAnalyticsConsent()).toBe(true);
    expect(JSON.parse(localStorage.getItem(CONSENT_STORAGE_KEY)!).version).toBe(3);
    expect(localStorage.getItem("blc.cookie-consent.v1")).toBeNull();
    expect(localStorage.getItem("blc.cookie-consent.v2")).toBeNull();
  });
});

describe("marketing consent wording", () => {
  it("matches the server's canonical text", () => {
    const server = readFileSync(resolve(process.cwd(), "supabase/functions/_shared/marketingConsent.ts"), "utf8");
    expect(server).toContain(`"${MARKETING_CONSENT_VERSION}"`);
    expect(server).toContain(MARKETING_CONSENT_TEXT);
  });
});
