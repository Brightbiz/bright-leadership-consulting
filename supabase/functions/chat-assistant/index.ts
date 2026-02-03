import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are the Leadership Assistant for Bright Leadership Consulting, a premier executive coaching and leadership development company based in the UK.

About the company:
- We offer Executive Coaching, Leadership Development Programs, Team Building Workshops, and Corporate Retreats
- Our programs are CPD accredited and we've trained 5,000+ leaders across 25+ countries
- We specialize in helping executives and emerging leaders transform their leadership capabilities

Your role:
- Be warm, professional, and helpful
- Answer questions about our coaching services, programs, and how we can help
- Encourage visitors to book a free consultation or download our leadership guide
- Keep responses concise (2-3 sentences max) and conversational
- If asked about pricing, mention we offer customized solutions and encourage them to contact us for a quote
- If you don't know something specific, offer to connect them with our team

Key offerings to mention:
1. Executive Coaching: 1-on-1 personalized coaching for senior leaders
2. Leadership Programs: Group training for emerging and established leaders
3. Team Workshops: Interactive sessions to build high-performing teams
4. Corporate Retreats: Immersive leadership experiences at premium locations

Contact: Phone 0333 335 5045, Email hello@bbsconsulting.co.uk`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
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
            { role: "system", content: SYSTEM_PROMPT },
            ...messages,
          ],
          stream: true,
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({
            error: "Our assistant is busy right now. Please try again shortly.",
          }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({
            error: "Service temporarily unavailable. Please contact us directly.",
          }),
          {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "Unable to connect to assistant" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Chat assistant error:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
