// Canonical marketing-consent wording, keyed by version. The server stores the
// text for the version the visitor saw, so the record cannot be altered by the
// browser. Keep in sync with src/data/marketingConsent.ts (checked by tests).

export const MARKETING_CONSENT_VERSIONS: Record<string, string> = {
  "elm-followup-v1":
    "Yes, Bright Leadership Consulting may email me follow-up material about the Executive Leadership Mastery Programme. I can unsubscribe at any time using the link in every email.",
};

export const MARKETING_SOURCE_PAGES = ["/executive-leadership-mastery/webinar"];
