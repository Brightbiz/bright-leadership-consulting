import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

type FormType = "contact" | "newsletter" | "lead_magnet";

interface RateLimitResult {
  allowed: boolean;
  remaining?: number;
  retryAfterMinutes?: number;
  message?: string;
}

export const useRateLimit = () => {
  const [isChecking, setIsChecking] = useState(false);

  const checkRateLimit = useCallback(async (formType: FormType): Promise<RateLimitResult> => {
    setIsChecking(true);
    try {
      const { data, error } = await supabase.functions.invoke("check-rate-limit", {
        body: { formType, action: "check" },
      });

      if (error) {
        console.error("Rate limit check error:", error);
        // Allow through on error
        return { allowed: true };
      }

      return data as RateLimitResult;
    } catch (error) {
      console.error("Rate limit check failed:", error);
      return { allowed: true };
    } finally {
      setIsChecking(false);
    }
  }, []);

  const recordSubmission = useCallback(async (formType: FormType): Promise<void> => {
    try {
      await supabase.functions.invoke("check-rate-limit", {
        body: { formType, action: "record" },
      });
    } catch (error) {
      console.error("Failed to record rate limit:", error);
    }
  }, []);

  return { checkRateLimit, recordSubmission, isChecking };
};
