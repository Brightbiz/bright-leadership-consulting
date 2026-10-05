import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { MARKETING_CONSENT_VERSIONS, MARKETING_SOURCE_PAGES } from "../_shared/marketingConsent.ts";

// Records an explicit opt-in to follow-up marketing emails. Only called when
// the visitor ticked the consent box; no email is sent from here.

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  let payload: Record<string, unknown>;
  try {
    payload = await req.json();
  } catch {
    return json({ error: "Invalid request" }, 400);
  }

  // Honeypot: silently accept and discard.
  if (typeof payload.website === "string" && payload.website.trim() !== "") return json({ success: true });

  const name = typeof payload.name === "string" ? payload.name.trim() : "";
  const email = typeof payload.email === "string" ? payload.email.trim().toLowerCase() : "";
  const version = typeof payload.consentVersion === "string" ? payload.consentVersion : "";
  const sourcePage = typeof payload.sourcePage === "string" ? payload.sourcePage : "";

  if (payload.consent !== true) return json({ error: "Consent is required" }, 400);
  if (!name || name.length > 100) return json({ error: "Please enter your name" }, 400);
  if (!EMAIL.test(email) || email.length > 255) return json({ error: "Please enter a valid email address" }, 400);
  const consentText = MARKETING_CONSENT_VERSIONS[version];
  if (!consentText) return json({ error: "Invalid consent version" }, 400);
  if (!MARKETING_SOURCE_PAGES.includes(sourcePage)) return json({ error: "Invalid source page" }, 400);

  const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

  const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("cf-connecting-ip") || "unknown";
  const windowStart = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const { count } = await supabase
    .from("rate_limits")
    .select("*", { count: "exact", head: true })
    .eq("ip_address", clientIp)
    .eq("form_type", "marketing_optin")
    .gte("created_at", windowStart);
  if ((count ?? 0) >= 5) return json({ error: "Too many requests. Please try again later." }, 429);
  await supabase.from("rate_limits").insert({ ip_address: clientIp, form_type: "marketing_optin" });

  const { error } = await supabase.from("marketing_consents").insert({
    name,
    email,
    consent_text: consentText,
    consent_version: version,
    source_page: sourcePage,
  });
  if (error) {
    console.error("marketing_consents insert failed:", error);
    return json({ error: "Your request could not be saved" }, 500);
  }
  return json({ success: true });
});
