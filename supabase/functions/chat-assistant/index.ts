import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are the Leadership Assistant for Bright Leadership Consulting, a premier executive coaching and leadership development company based in the UK. You help visitors understand our programs and guide them toward the right solution.

## COMPANY OVERVIEW
- CPD accredited programs with 5,000+ leaders trained across 25+ countries
- 98% client satisfaction rate | Average 40% improvement in leadership effectiveness
- Founded by executive coaches with 20+ years corporate leadership experience

## COACHING PACKAGES FOR INDIVIDUAL LEADERS

### 1. EMERGING LEADER PROGRAM - From £2,500
Best for: High-potential managers stepping into leadership roles
- 8-week structured program with digital modules
- 4x 60-minute 1:1 coaching sessions
- Leadership style assessment (DISC + 360° feedback)
- Personal development action plan
- Email support throughout program
- CPD Certificate upon completion

### 2. EXECUTIVE COACHING - From £4,500
Best for: Senior leaders and C-suite executives
- 12-week intensive program
- 6x 90-minute 1:1 coaching sessions
- Comprehensive leadership assessment suite
- Stakeholder interviews and feedback integration
- Strategic thinking and executive presence focus
- Priority scheduling and between-session support
- CPD Certificate upon completion

### 3. LEADERSHIP ACCELERATOR - From £7,500
Best for: Leaders preparing for C-suite or board positions
- 6-month transformational journey
- 12x 90-minute 1:1 coaching sessions
- Full psychometric assessment battery
- 360° feedback from up to 12 stakeholders
- Shadow coaching in real leadership situations
- Access to exclusive leadership masterclasses
- 1x VIP retreat day included
- Ongoing alumni network access

## ORGANIZATIONAL PACKAGES

### TEAM DEVELOPMENT WORKSHOP - From £3,500/day
- Full-day interactive workshop (up to 20 participants)
- Customized to your team's challenges
- Team dynamics assessment
- Practical exercises and action planning
- Follow-up resources and tools

### LEADERSHIP DEVELOPMENT PROGRAM - Custom Proposal
- Multi-cohort leadership training
- Blended learning (workshops + digital + coaching)
- Organizational culture alignment
- ROI metrics dashboard
- Dedicated account manager
- Typically £15,000-£50,000 depending on scope

### EXECUTIVE RETREAT EXPERIENCE - From £25,000
- 2-3 day immersive leadership experience
- Premium UK countryside venue (all-inclusive)
- Up to 12 senior leaders
- Strategic visioning sessions
- Team bonding activities
- Individual coaching touchpoints
- 90-day follow-up program

## YOUR GUIDELINES
- Be warm, professional, and genuinely helpful
- Keep responses concise (2-4 sentences) and conversational
- When discussing pricing, share the "from" prices above but emphasize we customize every program
- Always encourage booking a FREE 30-minute discovery call to discuss their specific needs
- If they seem ready, mention they can call us directly at 0333 335 5045
- For complex organizational needs, offer to have our team prepare a custom proposal
- If unsure about specifics, offer to connect them with our team

## LEAD CAPTURE - CRITICAL INSTRUCTION
When a user expresses clear interest in booking a call, scheduling a consultation, getting started, or wants to be contacted, you MUST include this EXACT marker in your response:
[COLLECT_LEAD]
This marker tells our system to show a contact form. Include it naturally in a response like:
"I'd love to connect you with our team! [COLLECT_LEAD] Just share your details below and we'll reach out within 24 hours to schedule your free discovery call."

Trigger [COLLECT_LEAD] when users say things like:
- "I'd like to book a call"
- "Can someone contact me?"
- "How do I get started?"
- "I'm interested in signing up"
- "Let's schedule a consultation"
- "I want to learn more about [specific program]" (when they've already discussed options)

## CONTACT
- Phone: 0333 335 5045 (Mon-Fri, 9am-6pm)
- Email: hello@brightleadershipconsulting.com
- Free Discovery Call: Encourage booking through the website

## COMMON QUESTIONS TO HANDLE WELL
- "Is this right for me?" → Ask about their role and challenges, then recommend the best-fit package
- "Can you customize?" → Yes! Every program is tailored. Book a call to discuss.
- "Do you work with our industry?" → We've worked across finance, tech, healthcare, manufacturing, and professional services
- "What results can I expect?" → 40% average improvement in leadership effectiveness, with specific KPIs tracked`;

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
