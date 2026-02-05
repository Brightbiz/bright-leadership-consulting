import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

// Rate limit configuration
const RATE_LIMITS: Record<string, { maxRequests: number; windowMinutes: number }> = {
  contact: { maxRequests: 3, windowMinutes: 60 },      // 3 contact forms per hour
  newsletter: { maxRequests: 5, windowMinutes: 60 },   // 5 newsletter signups per hour
  lead_magnet: { maxRequests: 5, windowMinutes: 60 },  // 5 lead magnet downloads per hour
};

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { formType, action } = await req.json();

    if (!formType || !RATE_LIMITS[formType]) {
      return new Response(
        JSON.stringify({ error: 'Invalid form type' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get client IP from headers (Supabase edge functions provide this)
    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() 
                  || req.headers.get('cf-connecting-ip') 
                  || 'unknown';

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const config = RATE_LIMITS[formType];
    const windowStart = new Date(Date.now() - config.windowMinutes * 60 * 1000).toISOString();

    // Clean up old entries first (older than 1 hour)
    await supabase.rpc('cleanup_old_rate_limits');

    // Count recent submissions
    const { count, error: countError } = await supabase
      .from('rate_limits')
      .select('*', { count: 'exact', head: true })
      .eq('ip_address', clientIp)
      .eq('form_type', formType)
      .gte('created_at', windowStart);

    if (countError) {
      console.error('Error checking rate limit:', countError);
      // Allow through on error to not block legitimate users
      return new Response(
        JSON.stringify({ allowed: true, remaining: config.maxRequests }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const currentCount = count || 0;
    const remaining = Math.max(0, config.maxRequests - currentCount);
    const isAllowed = currentCount < config.maxRequests;

    // If this is a "record" action and we're allowed, record the submission
    if (action === 'record' && isAllowed) {
      const { error: insertError } = await supabase
        .from('rate_limits')
        .insert({
          ip_address: clientIp,
          form_type: formType,
        });

      if (insertError) {
        console.error('Error recording rate limit:', insertError);
      }
    }

    if (!isAllowed) {
      return new Response(
        JSON.stringify({ 
          allowed: false, 
          remaining: 0,
          retryAfterMinutes: config.windowMinutes,
          message: `Too many submissions. Please try again in ${config.windowMinutes} minutes.`
        }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ allowed: true, remaining: remaining - (action === 'record' ? 1 : 0) }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Rate limit check error:', error);
    // Allow through on error
    return new Response(
      JSON.stringify({ allowed: true, error: 'Rate limit check failed' }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
