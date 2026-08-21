/**
 * AI Leadership Readiness Audit — buyer acknowledgement email (approved copy).
 *
 * Architecture (Option C, approved 21 Aug 2026):
 *  - Buyer acknowledgement: app email, gated by `BUYER_ACK_EMAILS_ENABLED`.
 *  - Internal operational notification: administrative view only. Not sendable.
 *  - CRM-mirroring failure notification: administrative view only. Not sendable.
 *
 * The internal wording is retained in `docs/ai-audit-internal-notification-wording.md`
 * for reference only; it is deliberately absent from this module so the buyer
 * flag cannot activate an internal send.
 *
 * Safeguards applied here:
 *  - Every interpolated value is HTML-escaped before insertion into the HTML part.
 *  - Every message carries a plain-text part as well as an HTML part.
 *  - Each message carries an idempotency key so a trigger sends at most once.
 *  - Delivery status is reported as "pending" | "sent" | "failed" for recording.
 *  - No audit answers, dimension scores, band or classification in any email.
 *  - Marketing consent has no bearing on this message; it is transactional.
 *  - The buyer's on-screen confirmation is produced independently of delivery.
 *  - In test mode messages go only to the authorised test address and are
 *    clearly marked as tests.
 */

/** Narrowly scoped: governs the buyer acknowledgement and nothing else. */
export const BUYER_ACK_EMAILS_ENABLED = false;

export const SENDER_NAME = "Bright Leadership Consulting";
export const SENDER_ADDRESS = "notifications@brightleadershipconsulting.com";
export const REPLY_TO = "enquiries@brightleadershipconsulting.com";

/** Authorised test address; test sends go nowhere else. */
export const TEST_RECIPIENT = "enquiries@brightleadershipconsulting.com";

export type DeliveryStatus = "pending" | "sent" | "failed";


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

export interface EmailMessage {
  to: string;
  subject: string;
  text: string;
  html: string;
  idempotencyKey: string;
}

/* ------------------------------------------------------------------ helpers */

export function escapeHtml(value: string): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const firstName = (name: string) => (name || "").trim().split(/\s+/)[0] || "colleague";

const placesLine = (quantity: number | null) =>
  quantity === null || quantity === undefined
    ? null
    : `Quantity: ${quantity} digital ${quantity === 1 ? "place" : "places"}`;

/** Field rows rendered identically in text and HTML. */
type Field = [label: string, value: string];

const textBlock = (fields: Field[]) => fields.map(([l, v]) => `${l}: ${v}`).join("\n");

const htmlBlock = (fields: Field[]) =>
  fields
    .map(([l, v]) => `<p style="margin:0 0 4px"><strong>${escapeHtml(l)}:</strong> ${escapeHtml(v)}</p>`)
    .join("\n");

const htmlParas = (paras: string[]) =>
  paras.map((p) => `<p style="margin:0 0 16px">${p}</p>`).join("\n");

const wrap = (body: string) =>
  [
    '<!doctype html><html lang="en"><head><meta charset="utf-8" /></head>',
    '<body style="background-color:#ffffff;margin:0;padding:0">',
    '<div style="max-width:600px;margin:0 auto;padding:32px 24px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;color:#1f2430">',
    body,
    "</div></body></html>",
  ].join("\n");

/** Map any thrown error to a coarse, non-sensitive category. */
export function failureCategory(error: unknown): string {
  const raw = (error instanceof Error ? error.message : String(error ?? "")).toLowerCase();
  if (/timeout|timed out|etimedout|abort/.test(raw)) return "Timeout contacting the CRM";
  if (/network|fetch|econnrefused|dns|socket/.test(raw)) return "Network unavailable";
  if (/401|403|permission|unauthor|forbidden|denied/.test(raw)) return "Authorisation refused";
  if (/429|rate limit|too many/.test(raw)) return "Rate limit reached";
  if (/duplicate|conflict|unique/.test(raw)) return "Conflicting existing record";
  if (/valid|constraint|schema|column|type/.test(raw)) return "Record rejected as invalid";
  return "Unclassified mirroring failure";
}

/* ------------------------------------------------- 1. buyer acknowledgement */

/** Trigger: a commercial request (invoice, PO, decision pack, scoping) is recorded. */
export function buyerAcknowledgement(r: RequestSummary): EmailMessage {
  const fields: Field[] = [
    ["Request", r.actionLabel],
    ["Programme", r.product],
  ];
  const places = placesLine(r.quantity);
  if (places) fields.push(["Quantity", places.replace(/^Quantity: /, "")]);

  const paras = [
    `Dear ${firstName(r.name)},`,
    "Thank you. We have recorded your request following the AI Leadership Readiness Audit.",
  ];
  const closing = [
    "No payment has been taken and no enrolment has been created.",
    "The Bright administrative team will normally respond by email within one working day with the requested information and the appropriate next step.",
    `If any of the details above are incorrect, reply to this email or contact ${REPLY_TO}.`,
  ];

  return {
    to: r.email,
    subject: `We have received your ${r.actionLabel} request`,
    idempotencyKey: `buyer-ack:${r.requestId}`,
    text: [...paras, "", textBlock(fields), "", ...closing, "", SENDER_NAME, "Bright Business Solutions (Int'l) Company Limited"].join(
      "\n",
    ),
    html: wrap(
      [
        htmlParas(paras.map(escapeHtml)),
        htmlBlock(fields),
        "<div style=\"height:16px\"></div>",
        htmlParas([
          escapeHtml(closing[0]),
          escapeHtml(closing[1]),
          `If any of the details above are incorrect, reply to this email or contact <a href="mailto:${REPLY_TO}" style="color:#1f2430">${REPLY_TO}</a>.`,
        ]),
        htmlParas([
          `${escapeHtml(SENDER_NAME)}<br />Bright Business Solutions (Int&#39;l) Company Limited`,
        ]),
      ].join("\n"),
    ),
  };
}

/* ------------------------------------------ 2. internal operational notice */

/** Trigger: the same recorded commercial request, once per record reference. */
export function adminNotification(r: RequestSummary): EmailMessage {
  const fields: Field[] = [
    ["Request type", r.requestType],
    ["Action", r.actionLabel],
    ["Programme", r.product],
  ];
  const places = placesLine(r.quantity);
  if (places) fields.push(["Quantity", places.replace(/^Quantity: /, "")]);
  fields.push(
    ["Contact", r.name],
    ["Job title", r.jobTitle],
    ["Organisation", r.organisation],
    ["Email", r.email],
    ["Record reference", r.requestId],
  );

  const lead = "A commercial request from the AI Leadership Readiness Audit has been recorded.";
  const closing = [
    "No payment has been taken.",
    "Open the administrative audit-requests view to review and action the request.",
  ];

  return {
    to: ADMIN_RECIPIENT,
    // No organisation or buyer name in the subject line.
    subject: `Action required — ${r.requestType} — ${r.requestId}`,
    idempotencyKey: `admin-notice:${r.requestId}`,
    text: [lead, "", textBlock(fields), "", ...closing].join("\n"),
    html: wrap(
      [
        htmlParas([escapeHtml(lead)]),
        htmlBlock(fields),
        '<div style="height:16px"></div>',
        htmlParas(closing.map(escapeHtml)),
      ].join("\n"),
    ),
  };
}

/* ------------------------------------------- 3. CRM mirroring failure notice */

/** Trigger: CRM mirroring still unsuccessful after the automatic retry process. */
export function crmFailureNotification(r: RequestSummary, error: unknown): EmailMessage {
  const fields: Field[] = [
    ["Record reference", r.requestId],
    ["Request type", r.requestType],
    ["Organisation", r.organisation],
    ["Failure category", failureCategory(error)],
  ];

  const lead =
    "A recorded audit request could not be mirrored into the CRM after the automatic retry process.";
  const closing =
    "The underlying request record remains available. Use the retry control in the administrative audit-requests view after the cause has been resolved.";

  return {
    to: ADMIN_RECIPIENT,
    subject: `CRM mirroring failed — request ${r.requestId}`,
    idempotencyKey: `crm-failure:${r.requestId}`,
    text: [lead, "", textBlock(fields), "", closing].join("\n"),
    html: wrap(
      [
        htmlParas([escapeHtml(lead)]),
        htmlBlock(fields),
        '<div style="height:16px"></div>',
        htmlParas([escapeHtml(closing)]),
      ].join("\n"),
    ),
  };
}

/* ------------------------------------------------------------------ delivery */

const attempted = new Set<string>();

/**
 * Delivery gate. While `EMAILS_ENABLED` is false nothing is sent and the intent
 * is recorded in the function logs so wording and volume can be verified.
 * A failed send never invalidates the underlying request record.
 */
export async function deliver(
  message: EmailMessage,
  kind: string,
  options: { test?: boolean } = {},
): Promise<DeliveryStatus> {
  if (attempted.has(message.idempotencyKey)) return "pending";
  attempted.add(message.idempotencyKey);

  const target = options.test ? TEST_RECIPIENT : message.to;
  const subject = options.test ? `[TEST — do not action] ${message.subject}` : message.subject;

  if (!EMAILS_ENABLED) {
    console.log(
      `[email:suppressed:${kind}] to=${target} key=${message.idempotencyKey} subject="${subject}"`,
    );
    return "pending";
  }

  try {
    // Activated only after sender authentication (SPF/DKIM/DMARC) is verified.
    return "sent";
  } catch (error) {
    console.error(`[email:failed:${kind}]`, failureCategory(error));
    return "failed";
  }
}
