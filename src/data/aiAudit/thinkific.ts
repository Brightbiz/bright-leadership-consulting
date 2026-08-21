/**
 * Verified Thinkific destination for the approved £895 individual digital place.
 *
 * This is the ONLY place in the codebase permitted to hold the programme's
 * Thinkific product URL, and it is used only by the AI Leadership Readiness
 * Audit's individual self-purchase route (Q10 = A). Payment, account creation
 * and enrolment all happen in Thinkific, so no Bright details form is placed
 * in front of it.
 *
 * Multi-seat, organisational, facilitated, invoice and purchase-order routes
 * are never sent here.
 */

/** Verified live product page (HTTP 200, price shown as £895). */
export const THINKIFIC_INDIVIDUAL_URL =
  "https://bright-leadership-consulting.thinkific.com/products/courses/strategic-leadership-in-the-age-of-ai";

/**
 * Whether a purchaser can pay while a *different* named participant receives
 * the enrolment. The current Thinkific configuration exposes no verified
 * gift//"buy for someone else" flow, so this stays false and Q10 = B is routed
 * to the invoice/details process instead of enrolling the purchaser as learner.
 */
export const THINKIFIC_SUPPORTS_PURCHASE_FOR_ANOTHER = false;

/**
 * Attribution parameters only. No readiness answers, scores, bands or personal
 * data are ever placed in the outbound URL.
 */
export function buildThinkificPurchaseUrl(opts?: { campaignSearch?: string }): string {
  const url = new URL(THINKIFIC_INDIVIDUAL_URL);
  url.searchParams.set("utm_source", "brightleadershipconsulting");
  url.searchParams.set("utm_medium", "referral");
  url.searchParams.set("utm_campaign", "ai_leadership_readiness_audit");
  url.searchParams.set("utm_content", "individual_digital_place");

  // Carry forward only recognised inbound campaign parameters.
  if (opts?.campaignSearch) {
    const inbound = new URLSearchParams(opts.campaignSearch);
    for (const key of ["gclid", "gbraid", "wbraid", "utm_id", "utm_term"]) {
      const value = inbound.get(key);
      if (value) url.searchParams.set(key, value);
    }
  }
  return url.toString();
}
