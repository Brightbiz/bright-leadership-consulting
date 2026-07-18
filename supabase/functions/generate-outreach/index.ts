import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You draft outbound advisory correspondence for Bright Leadership Consulting, a UK-based executive alignment advisory firm.

## HOUSE VOICE (non-negotiable)
- Institutional, measured, board-level. Never marketing-adjacent.
- Very short sentences. One idea per sentence. No adjectives of enthusiasm. No exclamation marks. No emojis.
- Never use: "coaching", "training", "services", "packages", "offering", "solutions", "excited", "delighted", "reach out", "touch base", "circle back", "empower", "unlock", "transform", "leverage", "synergy", "thought leadership".
- Prefer: "engagement", "diagnostic", "instrument", "conversation", "advisory", "governance", "structural alignment", "variance".
- Address the recipient as a peer — a Chair, Senior Independent Director, or Nominations Committee head — not a prospect.
- Do NOT flatter. Do NOT reference their public profile in a way that reads as researched-from-LinkedIn.

## FLAGSHIP INSTRUMENT
Reference the Executive Alignment Index™ (EAI) by name. The EAI is a board-level governance diagnostic — a structural instrument, not an assessment or survey. It measures variance across six dimensions of executive team functioning and produces a board-ready report. It is typically the entry point to any engagement.

## LETTER STRUCTURE (each email)
- Subject: 5-7 words. No colons unless necessary. No question marks. Refers to substance, not the sender.
- Opening: one crisp line acknowledging the recipient's remit (Chair / SID / Noms) — factual, not flattering.
- Body: 2 short paragraphs. Paragraph 1 states one governance-level observation relevant to their role. Paragraph 2 introduces the EAI as the instrument that surfaces variance before it becomes a board issue.
- Close: propose a 20-minute confidential conversation. Signed "— Bright Leadership Consulting" (no individual name unless provided).
- Total length: 70-95 words in the body. No preamble, no signature block beyond the line above.

## OUTPUT
Return ONLY valid JSON matching this shape, no prose:
{
  "emails": [
    { "recipient_name": "...", "recipient_role": "...", "company": "...", "subject": "...", "body": "..." }
  ]
}
The "body" field must be plain text with \\n\\n between paragraphs. Do not include the subject inside the body.`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user } } = await userClient.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const admin = createClient(supabaseUrl, serviceKey);
    const { data: hasAdmin } = await admin.rpc("has_role", { _user_id: user.id, _role: "admin" });
    if (!hasAdmin) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { recipients, notes, mode, originalSubject, originalBody, sentDaysAgo, replyText, tone } = await req.json();
    const isFollowUp = mode === "follow_up";
    const isClassify = mode === "classify_reply";

    // --- Reply classifier: standalone short-circuit path ---
    if (isClassify) {
      const text = String(replyText || "").slice(0, 4000);
      if (!text.trim()) {
        return new Response(JSON.stringify({ error: "replyText required" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const LOVABLE_API_KEY_C = Deno.env.get("LOVABLE_API_KEY");
      if (!LOVABLE_API_KEY_C) throw new Error("Missing LOVABLE_API_KEY");
      const classifyPrompt = `Classify the following reply to an outbound advisory email into ONE sentiment bucket, and give a one-sentence summary of what the sender said.

Buckets (choose exactly one key):
- "meeting_booked" — they proposed a specific time, accepted a call, or asked to schedule.
- "positive" — interested, engaged, wants more information, referred to a colleague warmly.
- "neutral" — acknowledged, non-committal, asked a clarifying question without commitment.
- "negative" — dismissive, mildly annoyed, "not now", "not the right fit".
- "no_thanks" — explicit decline, unsubscribe, do-not-contact.

Reply text:
"""
${text}
"""

Return ONLY JSON: { "sentiment": "<key>", "confidence": <0-1 number>, "summary": "<one sentence>" }`;

      const clRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: { Authorization: `Bearer ${LOVABLE_API_KEY_C}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: "You are a precise, terse classifier. Return only valid JSON." },
            { role: "user", content: classifyPrompt },
          ],
          response_format: { type: "json_object" },
        }),
      });
      if (!clRes.ok) {
        const t = await clRes.text();
        console.error("classify AI error", clRes.status, t);
        return new Response(JSON.stringify({ error: "Classification failed", status: clRes.status }), {
          status: clRes.status, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const clPayload = await clRes.json();
      const clContent = clPayload?.choices?.[0]?.message?.content ?? "{}";
      let clParsed: any = {};
      try { clParsed = JSON.parse(clContent); } catch { /* noop */ }
      const allowed = ["meeting_booked", "positive", "neutral", "negative", "no_thanks"];
      const sentiment = allowed.includes(clParsed.sentiment) ? clParsed.sentiment : "neutral";
      const confidence = typeof clParsed.confidence === "number" ? Math.max(0, Math.min(1, clParsed.confidence)) : 0.5;
      const summary = String(clParsed.summary || "").slice(0, 240);
      return new Response(JSON.stringify({ sentiment, confidence, summary }), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!Array.isArray(recipients) || recipients.length === 0 || recipients.length > 20) {
      return new Response(JSON.stringify({ error: "Provide 1–20 recipients" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const cleaned = recipients.slice(0, 20).map((r: any) => ({
      name: String(r.name || "").slice(0, 120),
      role: String(r.role || "").slice(0, 120),
      company: String(r.company || "").slice(0, 160),
      context: String(r.context || "").slice(0, 400),
    })).filter(r => r.name && r.role);

    if (cleaned.length === 0) {
      return new Response(JSON.stringify({ error: "Each recipient needs at least a name and role" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userPrompt = isFollowUp
      ? `Draft ONE short follow-up email to a recipient who did not reply to the original outreach below.

## RULES FOR THIS FOLLOW-UP
- Shorter than the original: 45-65 words total in the body.
- Do NOT restate the pitch. Do NOT re-explain the EAI.
- One short opening line acknowledging silence without apology or repetition (e.g. "Circling once — no pressure.").
- One short paragraph offering a single, specific reason it may still be timely for their board (reference a governance beat: chair review, remuneration cycle, AGM season, effectiveness review).
- Close with a 20-minute conversation offer. Signed "— Bright Leadership Consulting".
- Subject: 4-6 words. Not "Following up". Something substantive tied to their remit.

## ORIGINAL EMAIL (sent ${Number(sentDaysAgo) || "several"} days ago)
Subject: ${String(originalSubject || "").slice(0, 200)}

${String(originalBody || "").slice(0, 2000)}

## RECIPIENT
${cleaned.map((r) => `${r.name} — ${r.role}${r.company ? `, ${r.company}` : ""}${r.context ? ` | context: ${r.context}` : ""}`).join("\n")}

Return JSON with an "emails" array of length 1.`
      : `Draft one personalised outreach email for each of the following recipients. Return them in the same order.

${notes ? `Optional context to weave in where relevant (do not force it):\n${String(notes).slice(0, 800)}\n\n` : ""}Recipients:
${cleaned.map((r, i) => `${i + 1}. ${r.name} — ${r.role}${r.company ? `, ${r.company}` : ""}${r.context ? ` | context: ${r.context}` : ""}`).join("\n")}

Return JSON with an "emails" array of length ${cleaned.length}, in the same order as above.`;

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("Missing LOVABLE_API_KEY");

    const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!aiRes.ok) {
      const text = await aiRes.text();
      console.error("AI gateway error", aiRes.status, text);
      if (aiRes.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited. Try again shortly." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiRes.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Top up in Settings → Workspace → Usage." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      return new Response(JSON.stringify({ error: "Generation failed" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const payload = await aiRes.json();
    const content = payload?.choices?.[0]?.message?.content ?? "{}";
    let parsed: any;
    try { parsed = JSON.parse(content); } catch { parsed = { emails: [] }; }

    return new Response(JSON.stringify({ emails: parsed.emails ?? [] }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("generate-outreach error", err);
    return new Response(JSON.stringify({ error: "Unexpected error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
