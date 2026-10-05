import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

// Withdraws marketing consent for every opt-in record sharing the token's
// email address. Every marketing send must exclude addresses with any
// withdrawn record, so no further marketing email is sent after this.

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  let token = new URL(req.url).searchParams.get("token") ?? "";
  if (req.method === "POST" && !token) {
    try {
      const body = await req.json();
      token = typeof body?.token === "string" ? body.token : "";
    } catch {
      /* one-click List-Unsubscribe posts form data; token comes from the URL */
    }
  }
  if (!/^[a-f0-9]{64}$/.test(token)) return json({ error: "Invalid unsubscribe link" }, 400);

  const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const { data: record } = await supabase
    .from("marketing_consents")
    .select("email")
    .eq("unsubscribe_token", token)
    .maybeSingle();
  if (!record) return json({ error: "Invalid unsubscribe link" }, 404);

  const { error } = await supabase
    .from("marketing_consents")
    .update({ unsubscribed_at: new Date().toISOString() })
    .eq("email", record.email)
    .is("unsubscribed_at", null);
  if (error) {
    console.error("unsubscribe failed:", error);
    return json({ error: "Could not process unsubscribe" }, 500);
  }
  return json({ success: true });
});
