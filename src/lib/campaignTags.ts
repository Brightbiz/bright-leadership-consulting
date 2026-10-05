/**
 * Campaign tags (utm_source / utm_medium / utm_campaign) for enquiry records.
 *
 * Captured from the landing address and held in memory only — nothing is
 * written to cookies or browser storage — so they survive in-site navigation
 * for the rest of the visit but disappear when the tab is closed or reloaded
 * on a page without tags. Values are allow-listed and length-limited here and
 * again on the server. Cleared after a successful enquiry so a second enquiry
 * in the same visit is not double-attributed.
 */

export type CampaignTags = Partial<Record<"utm_source" | "utm_medium" | "utm_campaign", string>>;

const KEYS = ["utm_source", "utm_medium", "utm_campaign"] as const;
const PATTERN = /^[A-Za-z0-9._-]{1,100}$/;

export function readCampaignTags(params: URLSearchParams): CampaignTags {
  const tags: CampaignTags = {};
  for (const key of KEYS) {
    const value = params.get(key)?.trim();
    if (value && PATTERN.test(value)) tags[key] = value;
  }
  return tags;
}

let captured: CampaignTags =
  typeof window === "undefined" ? {} : readCampaignTags(new URLSearchParams(window.location.search));

/** Record tags seen on any page address during the visit (latest wins). */
export function noteCampaignTags(params: URLSearchParams) {
  const tags = readCampaignTags(params);
  if (Object.keys(tags).length) captured = tags;
}

export function getCampaignTags(): CampaignTags {
  return { ...captured };
}

export function clearCampaignTags() {
  captured = {};
}

/** Append the current visit's tags to an internal link. */
export function withCampaignTags(path: string): string {
  const tags = getCampaignTags();
  const entries = Object.entries(tags);
  if (!entries.length) return path;
  const extra = new URLSearchParams(entries).toString();
  return `${path}${path.includes("?") ? "&" : "?"}${extra}`;
}
