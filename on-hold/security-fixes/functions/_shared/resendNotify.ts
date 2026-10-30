// Best-effort internal notification emails sent through the Resend connector
// gateway. brightleadershipconsulting.com must be verified in the linked
// Resend account before Resend accepts mail from it; failures are logged and
// returned, never thrown, so they can never block a visitor's submission.

export const NOTIFY_FROM =
  "Bright Leadership Consulting <info@brightleadershipconsulting.com>";

export const NOTIFY_TO_ENQUIRIES = "info@brightleadershipconsulting.com";

export interface ResendNotifyInput {
  to: string;
  subject: string;
  text: string;
  replyTo?: string;
}

export async function sendResendNotification(
  input: ResendNotifyInput,
): Promise<{ sent: boolean; status?: number; error?: string }> {
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

  if (!LOVABLE_API_KEY || !RESEND_API_KEY) {
    return { sent: false, error: "Resend credentials not configured" };
  }

  try {
    const response = await fetch("https://connector-gateway.lovable.dev/resend/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "X-Connection-Api-Key": RESEND_API_KEY,
      },
      body: JSON.stringify({
        from: NOTIFY_FROM,
        to: [input.to],
        subject: input.subject,
        text: input.text,
        ...(input.replyTo ? { reply_to: input.replyTo } : {}),
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`Resend notification failed [${response.status}]: ${errorBody}`);
      return { sent: false, status: response.status, error: errorBody.slice(0, 500) };
    }

    const body = await response.json().catch(() => null);
    if (body && (body as Record<string, unknown>).ok === false) {
      console.error(`Resend notification rejected: ${JSON.stringify(body)}`);
      return { sent: false, status: 200, error: JSON.stringify(body).slice(0, 500) };
    }

    return { sent: true };
  } catch (error) {
    console.error("Resend notification error:", error);
    return { sent: false, error: String(error).slice(0, 500) };
  }
}
