import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

interface Summary {
  unactioned: number;
  oldestCreatedAt: string | null;
  crmFailed: number;
  crmFailedUnacknowledged: number;
}

const ageLabel = (iso: string) => {
  const hours = Math.floor((Date.now() - new Date(iso).getTime()) / 3_600_000);
  if (hours < 1) return "under 1 hour";
  if (hours < 48) return `${hours} hour${hours === 1 ? "" : "s"}`;
  return `${Math.floor(hours / 24)} days`;
};

/**
 * Outstanding-action indicator for the authenticated administrator landing area.
 *
 * The administrative view is the authoritative operational channel for audit
 * requests — no internal operational or CRM-failure emails are sent — so
 * pending work must be visible without opening individual records.
 */
const OutstandingActionsBanner = () => {
  const [summary, setSummary] = useState<Summary | null>(null);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const { data } = await (supabase as any)
        .from("ai_audit_requests")
        .select("created_at, action_status, crm_status, crm_failure_ack_at")
        .order("created_at", { ascending: true });
      if (cancelled || !data) return;
      const rows = data as {
        created_at: string;
        action_status: string;
        crm_status: string;
        crm_failure_ack_at: string | null;
      }[];
      const pending = rows.filter((r) => r.action_status !== "actioned");
      const failed = rows.filter((r) => r.crm_status === "failed");
      setSummary({
        unactioned: pending.length,
        oldestCreatedAt: pending[0]?.created_at ?? null,
        crmFailed: failed.length,
        crmFailedUnacknowledged: failed.filter((r) => !r.crm_failure_ack_at).length,
      });
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!summary) return null;

  const clear = summary.unactioned === 0 && summary.crmFailed === 0;

  return (
    <div
      className={`mb-6 flex flex-col gap-3 rounded-md border p-4 sm:flex-row sm:items-center sm:justify-between ${
        clear ? "" : "border-destructive/50 bg-destructive/5"
      }`}
    >
      <div className="flex items-start gap-3">
        {clear ? (
          <CheckCircle2 className="mt-0.5 h-5 w-5 text-muted-foreground" />
        ) : (
          <AlertTriangle className="mt-0.5 h-5 w-5 text-destructive" />
        )}
        <div className="text-sm">
          {clear ? (
            <p className="text-muted-foreground">
              No outstanding audit requests. CRM mirroring is up to date.
            </p>
          ) : (
            <>
              <p className="font-medium">
                {summary.unactioned > 0
                  ? `Needs action: ${summary.unactioned} audit request${
                      summary.unactioned === 1 ? "" : "s"
                    } unactioned`
                  : "CRM mirroring needs attention"}
                {summary.oldestCreatedAt && summary.unactioned > 0
                  ? ` — oldest waiting ${ageLabel(summary.oldestCreatedAt)}`
                  : ""}
              </p>
              {summary.crmFailed > 0 && (
                <p className="mt-1 text-muted-foreground">
                  {summary.crmFailed} CRM-mirroring failure
                  {summary.crmFailed === 1 ? "" : "s"} ({summary.crmFailedUnacknowledged}{" "}
                  unacknowledged). Request records remain intact.
                </p>
              )}
            </>
          )}
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {summary.unactioned > 0 && (
          <Button asChild size="sm">
            <Link to="/admin/audit-requests?filter=needs-action">
              Open {summary.unactioned} needing action
            </Link>
          </Button>
        )}
        {summary.crmFailed > 0 && (
          <Button asChild size="sm" variant="outline">
            <Link to="/admin/audit-requests?filter=crm-failed">
              Open {summary.crmFailed} CRM failure{summary.crmFailed === 1 ? "" : "s"}
            </Link>
          </Button>
        )}
        {clear && (
          <Button asChild size="sm" variant="outline">
            <Link to="/admin/audit-requests">Open audit requests</Link>
          </Button>
        )}
      </div>
    </div>
  );
};

export default OutstandingActionsBanner;
