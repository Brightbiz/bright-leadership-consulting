/**
 * AI Leadership Readiness Audit — analytics and conversion events.
 *
 * No readiness answers, free-text or personal data are ever sent. Scores and
 * bands are aggregate, non-identifying result attributes.
 *
 * Approved conversion definitions:
 *  - Audit completion / result view ....... audit conversion
 *  - Invoice, PO, pack or scoping request . qualified-request conversion
 *  - Outbound programme-platform click .... engagement event only
 *  - Completed platform sale .............. the only purchase conversion
 *    (recorded on the learning platform, never inferred from a click here)
 *
 * Staging hosts are excluded from production analytics. Events fire only from
 * the live public domain, or from any host when the authorised test indicator
 * is set, in which case they are tagged so they can be identified or excluded.
 */

import { trackEvent, reportEnquiryConversion } from "./analytics";
import { auditSessionId, isStagingHost, isTestMode } from "./auditSession";

/** Events already emitted for this browser session's audit attempt. */
const emitted = new Set<string>();

function emit(name: string, params: Record<string, unknown>, dedupeKey?: string) {
  const staging = isStagingHost();
  const test = isTestMode();

  // Staging traffic never reaches production analytics unless explicitly
  // flagged as an authorised test.
  if (staging && !test) return;

  const key = dedupeKey ? `${name}:${dedupeKey}` : null;
  if (key) {
    if (emitted.has(key)) return;
    emitted.add(key);
  }

  trackEvent(name, {
    ...params,
    audit_session_id: auditSessionId(),
    audit_environment: staging ? "staging" : "production",
    test_event: test,
  });
}

export function trackAuditStart() {
  emit("ai_audit_start", { audit: "ai_leadership_readiness" }, auditSessionId());
}

export function trackAuditStepView(step: string, index: number) {
  emit("ai_audit_step_view", { audit_step: step, audit_step_index: index });
}

export interface AuditResultEvent {
  score: number;
  band: string;
  classification: string;
  recommendedProduct: string;
  alternativeProduct?: string | null;
  quantityResolved: boolean;
}

/**
 * Result-page view. This is the audit conversion, fired once per completed
 * audit and deduplicated on the session key.
 */
export function trackAuditResultView(e: AuditResultEvent) {
  emit(
    "ai_audit_result",
    {
      readiness_score: e.score,
      readiness_band: e.band,
      buyer_classification: e.classification,
      recommended_product: e.recommendedProduct,
      alternative_product: e.alternativeProduct ?? null,
      quantity_resolved: e.quantityResolved,
      conversion: true,
      conversion_type: "audit",
    },
    auditSessionId(),
  );
}

export interface AuditActionEvent {
  action: string;
  label: string;
  product: string;
  classification: string;
  emphasis: "primary" | "secondary" | "tertiary";
  quantity?: number | null;
}

/** Any result-page action click. Engagement only — never a conversion. */
export function trackAuditActionClick(e: AuditActionEvent) {
  emit(
    "ai_audit_action_click",
    {
      audit_action: e.action,
      cta_label: e.label,
      recommended_product: e.product,
      buyer_classification: e.classification,
      cta_emphasis: e.emphasis,
      participant_quantity: e.quantity ?? null,
      conversion: false,
      event_category: "engagement",
    },
    `${e.action}:${auditSessionId()}`,
  );
}

/**
 * Outbound click to the programme platform for the approved single digital
 * place. Recorded before the redirect so attribution is never lost, and
 * classified as an engagement event: the completed platform sale is the only
 * purchase conversion.
 */
export function trackAuditOutboundPurchase(destination: string) {
  emit(
    "ai_audit_outbound_checkout_click",
    {
      destination_url: destination,
      programme_name: "Strategic Leadership in the Age of AI",
      product_tier: "individual_digital_place",
      price_gbp: 895,
      outbound: true,
      conversion: false,
      conversion_type: null,
      event_category: "engagement",
    },
    auditSessionId(),
  );
}

/**
 * A qualified request record was created (invoice, purchase order, decision
 * pack or scoping). This is the qualified-request conversion; it is
 * deduplicated on the session key and is not sent for a merged duplicate or an
 * idempotent replay.
 */
export function trackAuditRequestSubmitted(
  requestType: string,
  quantity: number | null,
  opts?: { duplicate?: boolean; replayed?: boolean },
) {
  if (opts?.replayed) return;
  emit(
    "ai_audit_qualified_request",
    {
      request_type: requestType,
      participant_quantity: quantity ?? null,
      merged_duplicate: opts?.duplicate === true,
      conversion: true,
      conversion_type: "qualified_request",
    },
    `${requestType}:${auditSessionId()}`,
  );

  // Google Ads conversion is reserved for genuinely new qualified requests
  // from the live public domain only.
  if (!isStagingHost() && !isTestMode() && !opts?.duplicate) {
    reportEnquiryConversion();
  }
}
