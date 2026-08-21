/**
 * AI Leadership Readiness Audit — email copy (awaiting written approval).
 *
 * Nothing here is sent while `EMAILS_ENABLED` is false. The wording below is
 * the exact copy submitted for approval; when approval is given, flip the flag
 * and wire `deliver()` to the project email function.
 *
 * Constraints applied:
 *  - Transactional only. No marketing content, no promotional links.
 *  - The buyer's audit answers, dimension scores and readiness band are never
 *    included in any email.
 *  - One buyer acknowledgement and one internal operational notice per
 *    successfully recorded commercial request.
 */

export const EMAILS_ENABLED = false;

export const SENDER_NAME = "Bright Leadership Consulting";
export const SENDER_ADDRESS = "notifications@brightleadershipconsulting.com";
export const REPLY_TO = "enquiries@brightleadershipconsulting.com";
export const ADMIN_RECIPIENT = "enquiries@brightleadershipconsulting.com";

export interface RequestSummary {
  requestId: string;
  requestType: string;
  actionLabel: string;
  product: string;
  quantity: number | null;
  name: string;
  email: string;
  organisation: string;
  jobTitle: string;
}

const quantityLine = (quantity: number | null) =>
  quantity === null
    ? ""
    : `Quantity confirmed: ${quantity} digital ${quantity === 1 ? "place" : "places"}\n`;

/** Buyer acknowledgement — invoice, PO, decision pack and scoping requests. */
export function buyerAcknowledgement(r: RequestSummary) {
  return {
    to: r.email,
    subject: `Request recorded — ${r.actionLabel}`,
    text: [
      `Dear ${r.name.split(" ")[0] || "colleague"},`,
      "",
      "We have recorded your request following the AI Leadership Readiness Audit.",
      "",
      `Request: ${r.actionLabel}`,
      `Programme route: ${r.product}`,
      quantityLine(r.quantity).trim(),
      "",
      "No payment has been taken and no enrolment has been created at this stage.",
      "",
      "A member of the Bright administrative team will respond by email with the",
      "material requested and the next step. If anything in the above is incorrect,",
      `reply to this message or write to ${REPLY_TO}.`,
      "",
      "Bright Leadership Consulting",
      "Bright Business Solutions (Int'l) Company Limited",
    ]
      .filter((line) => line !== "")
      .join("\n"),
  };
}

/** Internal operational notice — a commercial request requires action. */
export function adminNotification(r: RequestSummary) {
  return {
    to: ADMIN_RECIPIENT,
    subject: `Action required — ${r.requestType} request recorded (${r.organisation})`,
    text: [
      "A commercial request from the AI Leadership Readiness Audit has been recorded.",
      "",
      `Request type: ${r.requestType}`,
      `Action: ${r.actionLabel}`,
      `Programme route: ${r.product}`,
      quantityLine(r.quantity).trim(),
      `Contact: ${r.name}, ${r.jobTitle}`,
      `Organisation: ${r.organisation}`,
      `Email: ${r.email}`,
      `Record reference: ${r.requestId}`,
      "",
      "Open the administrative audit-requests view to action it.",
      "No payment has been taken.",
    ]
      .filter((line) => line !== "")
      .join("\n"),
  };
}

/** Failure notice — CRM mirroring unsuccessful after the retry process. */
export function crmFailureNotification(r: RequestSummary, error: string) {
  return {
    to: ADMIN_RECIPIENT,
    subject: `CRM mirroring failed — ${r.requestType} request ${r.requestId}`,
    text: [
      "A recorded audit request could not be mirrored into the CRM.",
      "",
      `Record reference: ${r.requestId}`,
      `Request type: ${r.requestType}`,
      `Organisation: ${r.organisation}`,
      `Reported error: ${error}`,
      "",
      "The request record itself is safe. Use the retry control in the",
      "administrative audit-requests view once the cause is resolved.",
    ].join("\n"),
  };
}

/**
 * Delivery gate. While approval is outstanding this only records the intent in
 * the function logs so the wording and volume can be verified without sending.
 */
export async function deliver(
  message: { to: string; subject: string; text: string },
  kind: string,
): Promise<"sent" | "suppressed"> {
  if (!EMAILS_ENABLED) {
    console.log(`[email:suppressed:${kind}] to=${message.to} subject="${message.subject}"`);
    return "suppressed";
  }
  // Activated only after written approval of the wording and sender details.
  return "sent";
}
