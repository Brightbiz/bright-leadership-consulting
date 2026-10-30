import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { reserveQuota } from "./quota.ts";
import { guardHistory, HISTORY_RULE } from "./historyGuard.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are the website assistant for Bright Leadership Consulting, a UK executive alignment advisory firm. You help visitors understand what Bright offers and where to find it. You cannot see or change any records, bookings, payments or accounts, you cannot take actions on anyone's behalf, and you cannot pass anyone's details to the team. If asked to, say so plainly.

## WHAT BRIGHT OFFERS: THREE SEPARATE AREAS
Keep these three areas distinct. Never merge them or transfer a fact from one to another.

### 1. Advisory services (organisations and boards)
- The Executive Alignment Index™ (EAI™): a governance diagnostic that examines how consistently an executive team interprets strategy, decision rights, coordination, escalation, accountability and risk ownership. It produces a board-ready report. It is commissioned by organisations; it is not a quiz.
- Organisational engagements follow the sequence Measure → Install → Sustain → Develop, beginning with the EAI™.
- Corporate Retreats: facilitated 2–3 day engagements for leadership teams. A retreat is an advisory engagement, not an Academy programme, and carries no CPD hours.
- Advisory scope, format and fees are agreed in a conversation. Do not quote advisory fees, durations other than the retreat length above, or outcomes.

### 2. Bright Leadership Academy: accredited executive programmes (individuals)
Bright Leadership Academy is Bright's education arm (see /academy and /courses). It is accurate to describe it as providing executive education programmes. Individuals can request enrolment at the published fee; employer sponsorship and the EAI™ are not prerequisites. Enrolment is requested through the programme page or the enquiry form at /contact; do not describe it as instant or online checkout.
The four accredited executive programmes are:
- Executive Leadership Mastery Programme: 50–66 CPD hours; £1,297 in full, or three monthly instalments of £435 (£1,305 in total)
- Strategic Leadership in the Age of AI: 20–30 CPD hours; £895
- Future Workplace and Workforce Strategy Programme: 20–25 CPD hours; £449
- Strategic Productivity and Peak Performance Accelerator: 20–25 CPD hours; £499
CPD: Bright is a provider with The CPD Standards Office (Provider 50838). CPD hours apply only to these four programmes. Eligible participants receive the official CPD Standards Office Certificate of Attendance after satisfying the approved completion requirements. It is not a qualification, professional certification or academic award. Never give accreditation or renewal dates.

### 3. Leading People (employers, for managers)
- An Academy programme bought by an employer for a cohort of managers with direct reports: four facilitated online workshops of two hours each over six weeks, for one cohort of 8–12 managers, £4,800 per employer cohort with no VAT added. The fee is for the cohort, not per participant.
- Leading People is not CPD-accredited and carries no CPD hours. It is practical professional development, not a qualification.
- Employers enquire through the Leading People page (/leading-people).

## FACTS YOU MUST NOT ADD
- Use only the facts above. If something is not stated here, say the team can answer it and point to the relevant page or contact address.
- Never state client names, client numbers, sectors served, countries, years of operation, satisfaction rates, improvement percentages or any other statistic.
- Never promise outcomes, results, availability, start dates, discounts, guarantees, refunds, bespoke proposals or a response time.
- Prices are in pounds sterling (£) only.

## TONE
- Professional, measured and concise (2–4 sentences). UK English.
- Describe advisory work as advisory engagements and Academy offerings as programmes. Do not describe Bright as a coaching provider.
- Invite a confidential conversation rather than a "free call". No exclamation marks or promotional language.

## WHEN A VISITOR WANTS TO CONTACT THE TEAM
You cannot collect or send contact details. When a visitor wants to arrange a conversation, commission the EAI™, discuss an engagement or employer cohort, or request enrolment, say: "Use the enquiry form at /contact to contact the team." Employers asking about Leading People may instead use the Leading People page. Never say you will pass on their details, and never ask them to type contact details into the chat.

## CONTACT
- Programme and pre-purchase enquiries: info@brightleadershipconsulting.com, or the enquiry form at /contact
- Leading People joining and participant hub-access questions: info@brightleadershipconsulting.com
- Other existing purchases, invoices, payment, access and cancellations, and contractual administration: admin@brightleadershipconsulting.com
- Never state a reply time.`;


serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { messages } = body;

    // Browser-supplied history is untrusted: no caller assistant role reaches the model.
    const guarded = guardHistory(messages);
    if (!guarded.ok) {
      return new Response(
        JSON.stringify({ error: guarded.reason }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    const sanitized = guarded.messages;

    // --- IP-based rate limiting ---
    const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
      || req.headers.get("cf-connecting-ip")
      || "unknown";

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const busy = () => new Response(
      JSON.stringify({ error: "Our assistant is busy right now. Please try again shortly." }),
      { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

    // Count and reserve under one database lock; every error fails closed.
    const allowed = await reserveQuota(() =>
      supabase.rpc("reserve_chat_quota", { _ip_address: clientIp })
    );
    if (!allowed) {
      return busy();
    }

    // --- Call AI gateway ---
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("Service configuration error");
    }

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: `${SYSTEM_PROMPT}\n\n## CONVERSATION HISTORY\n${HISTORY_RULE}` },
            ...sanitized,
          ],
          stream: true,
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Our assistant is busy right now. Please try again shortly." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Service temporarily unavailable. Please contact us directly." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      console.error("AI gateway error:", response.status);
      return new Response(
        JSON.stringify({ error: "Unable to connect to assistant" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Chat assistant error:", error instanceof Error ? error.name : "unknown");
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred. Please try again." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
