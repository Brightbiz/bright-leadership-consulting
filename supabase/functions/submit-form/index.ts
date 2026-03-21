import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const RATE_LIMITS: Record<string, { maxRequests: number; windowMinutes: number }> = {
  contact: { maxRequests: 3, windowMinutes: 60 },
  newsletter: { maxRequests: 5, windowMinutes: 60 },
  lead_magnet: { maxRequests: 5, windowMinutes: 60 },
};

// Allowed tables and their required/optional fields
const FORM_CONFIGS: Record<string, { table: string; required: string[]; optional: string[]; maxLengths: Record<string, number> }> = {
  contact: {
    table: "contact_submissions",
    required: ["name", "email", "message"],
    optional: ["phone", "company"],
    maxLengths: { name: 100, email: 255, message: 2000, phone: 30, company: 200 },
  },
  newsletter: {
    table: "newsletter_subscribers",
    required: ["email"],
    optional: ["source"],
    maxLengths: { email: 255, source: 50 },
  },
  lead_magnet: {
    table: "lead_magnet_downloads",
    required: ["email"],
    optional: ["name", "lead_magnet_name"],
    maxLengths: { email: 255, name: 100, lead_magnet_name: 100 },
  },
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { formType, formData } = await req.json();

    // Validate form type
    if (!formType || !FORM_CONFIGS[formType]) {
      return new Response(
        JSON.stringify({ error: "Invalid form type" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const config = FORM_CONFIGS[formType];

    // Validate required fields
    if (!formData || typeof formData !== "object") {
      return new Response(
        JSON.stringify({ error: "Invalid form data" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    for (const field of config.required) {
      if (!formData[field] || typeof formData[field] !== "string" || formData[field].trim() === "") {
        return new Response(
          JSON.stringify({ error: `Missing required field: ${field}` }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // Sanitize and validate field lengths
    const sanitized: Record<string, string | null> = {};
    const allowedFields = [...config.required, ...config.optional];

    for (const field of allowedFields) {
      const value = formData[field];
      if (value !== undefined && value !== null) {
        const strValue = String(value).trim();
        const maxLen = config.maxLengths[field] || 255;
        if (strValue.length > maxLen) {
          return new Response(
            JSON.stringify({ error: `${field} exceeds maximum length of ${maxLen} characters` }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        sanitized[field] = strValue || null;
      }
    }

    // Email format validation
    if (sanitized.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(sanitized.email)) {
        return new Response(
          JSON.stringify({ error: "Invalid email address" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // Get client IP
    const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
      || req.headers.get("cf-connecting-ip")
      || "unknown";

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Rate limit check
    const rateConfig = RATE_LIMITS[formType];
    if (rateConfig) {
      const windowStart = new Date(Date.now() - rateConfig.windowMinutes * 60 * 1000).toISOString();

      // Clean up old entries
      await supabase.rpc("cleanup_old_rate_limits");

      const { count, error: countError } = await supabase
        .from("rate_limits")
        .select("*", { count: "exact", head: true })
        .eq("ip_address", clientIp)
        .eq("form_type", formType)
        .gte("created_at", windowStart);

      if (!countError && (count || 0) >= rateConfig.maxRequests) {
        return new Response(
          JSON.stringify({
            error: `Too many submissions. Please try again in ${rateConfig.windowMinutes} minutes.`,
            retryAfterMinutes: rateConfig.windowMinutes,
          }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Record rate limit entry
      await supabase.from("rate_limits").insert({ ip_address: clientIp, form_type: formType });
    }

    // Insert into the target table using service role (bypasses RLS)
    const { data, error } = await supabase.from(config.table).insert(sanitized).select();

    if (error) {
      // Handle unique constraint violations gracefully
      if (error.code === "23505") {
        return new Response(
          JSON.stringify({ error: "This entry already exists." }),
          { status: 409, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      console.error("Insert error:", error);
      return new Response(
        JSON.stringify({ error: "Submission could not be processed" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Form submission error:", error);
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
