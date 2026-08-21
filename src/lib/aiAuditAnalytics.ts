/**
 * AI Leadership Readiness Audit — analytics and conversion events.
 *
 * No readiness answers, free-text or personal data are ever sent. Scores and
 * bands are aggregate, non-identifying result attributes.
 */

import { trackEvent } from "./analytics";

export function trackAuditStart() {
  trackEvent("ai_audit_start", { audit: "ai_leadership_readiness" });
}

export function trackAuditStepView(step: string, index: number) {
  trackEvent("ai_audit_step_view", { audit_step: step, audit_step_index: index });
}

export interface AuditResultEvent {
  score: number;
  band: string;
  classification: string;
  recommendedProduct: string;
  alternativeProduct?: string | null;
  quantityResolved: boolean;
}

/** Result-page conversion event. Fired once per completed audit. */
export function trackAuditResultView(e: AuditResultEvent) {
  trackEvent("ai_audit_result", {
    readiness_score: e.score,
    readiness_band: e.band,
    buyer_classification: e.classification,
    recommended_product: e.recommendedProduct,
    alternative_product: e.alternativeProduct ?? null,
    quantity_resolved: e.quantityResolved,
    conversion: true,
  });
}

export interface AuditActionEvent {
  action: string;
  label: string;
  product: string;
  classification: string;
  emphasis: "primary" | "secondary" | "tertiary";
  quantity?: number | null;
}

/** Any result-page action click (invoice, PO, decision pack, scoping, email). */
export function trackAuditActionClick(e: AuditActionEvent) {
  trackEvent("ai_audit_action_click", {
    audit_action: e.action,
    cta_label: e.label,
    recommended_product: e.product,
    buyer_classification: e.classification,
    cta_emphasis: e.emphasis,
    participant_quantity: e.quantity ?? null,
  });
}

/**
 * Outbound click to the programme platform for the approved single digital
 * place. Recorded before the redirect so attribution is never lost.
 */
export function trackAuditOutboundPurchase(destination: string) {
  trackEvent("ai_audit_outbound_purchase_click", {
    destination_url: destination,
    programme_name: "Strategic Leadership in the Age of AI",
    product_tier: "individual_digital_place",
    price_gbp: 895,
    outbound: true,
    conversion: true,
  });
}

/** A request record was created (invoice, purchase order, pack, scoping). */
export function trackAuditRequestSubmitted(requestType: string, quantity: number | null) {
  trackEvent("ai_audit_request_submitted", {
    request_type: requestType,
    participant_quantity: quantity ?? null,
    conversion: true,
  });
}
