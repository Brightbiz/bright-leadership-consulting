import { useCallback, useEffect, useState } from "react";
import { Link, Navigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { AlertTriangle, ArrowLeft, Loader2, RefreshCw, Search, ShieldCheck, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface AuditRequestRow {
  id: string;
  email: string;
  name: string | null;
  organisation: string | null;
  job_title: string | null;
  request_type: string;
  action_label: string;
  product: string;
  participant_quantity: number | null;
  status: string;
  crm_status: "pending" | "completed" | "failed";
  crm_error: string | null;
  crm_attempts: number;
  crm_last_attempt_at: string | null;
  duplicate_count: number;
  flagged_duplicate: boolean;
  buyer_ack_status: string;
  admin_notice_status: string;
  retain_until: string;
  created_at: string;
  action_status: "needs_action" | "actioned";
  actioned_at: string | null;
  actioned_by_email: string | null;
  crm_failure_ack_at: string | null;
  crm_failure_ack_by_email: string | null;
}

interface SubjectResult {
  action: string;
  counts: { audit_responses: number; request_records: number; crm_contacts: number };
  learning_platform_note: string;
}

const CRM_BADGE: Record<string, string> = {
  completed: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  failed: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
};

/**
 * The stored operational request type, rendered in words. This is the
 * downstream action generated from the result card, and is deliberately
 * separate from the respondent's own recorded routing answer below.
 */
const REQUEST_TYPE_LABELS: Record<string, string> = {
  thinkific: "Card purchase (programme platform)",
  purchaseRequest: "Purchase request",
  invoice: "Invoice request",
  po: "Purchase-order request",
  info: "Information / decision-pack request",
  proposal: "Written-proposal request",
  scoping: "Tailored scoping request",
  call: "Scoping-conversation request",
  email: "Emailed question",
};

/** The respondent's own Q14 answer, stored unchanged and shown in words. */
const ROUTING_Q14_LABELS: Record<string, string> = {
  card: "Prefers to pay online by card",
  invoice: "Prefers to receive an invoice",
  po: "Prefers to use a purchase order",
  download: "Wants information for internal approval",
  review: "Wants to review the recommendation before deciding",
  notready: "Not ready to purchase",
  reviewoptions: "Wants organisational options reviewed",
  decisionpack: "Wants an internal decision pack",
  proposal: "Wants a written proposal",
  discuss: "Wants to discuss delivery requirements",
  notready2: "Not ready to proceed",
};

const requestTypeLabel = (value: string) => REQUEST_TYPE_LABELS[value] ?? value;
const routingQ14Label = (value: string | null | undefined) =>
  value ? (ROUTING_Q14_LABELS[value] ?? value) : null;


/** Whole hours, or days once beyond 48 hours. */
const ageLabel = (iso: string) => {
  const hours = Math.floor((Date.now() - new Date(iso).getTime()) / 3_600_000);
  if (hours < 1) return "under 1 hour";
  if (hours < 48) return `${hours} hour${hours === 1 ? "" : "s"}`;
  const days = Math.floor(hours / 24);
  return `${days} days`;
};


/**
 * Administrative view for AI Leadership Readiness Audit requests.
 *
 * Two responsibilities: making CRM-mirroring failures visible with a safe
 * retry, and providing the single restricted subject-request function across
 * the audit response, the request record and the CRM contact.
 */
const AdminAuditRequests = () => {
  const { user, isAdmin, isLoading: authLoading } = useAdminAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();
  const [rows, setRows] = useState<AuditRequestRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [retrying, setRetrying] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);


  const [subjectEmail, setSubjectEmail] = useState("");
  const [subjectResult, setSubjectResult] = useState<SubjectResult | null>(null);
  const [subjectBusy, setSubjectBusy] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const fetchRows = useCallback(async () => {
    setLoading(true);
    const { data, error } = await (supabase as any)
      .from("ai_audit_requests")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      toast({ title: "Could not load audit requests", variant: "destructive" });
    } else {
      setRows((data as AuditRequestRow[]) ?? []);
    }
    setLoading(false);
  }, [toast]);

  useEffect(() => {
    if (isAdmin) void fetchRows();
  }, [isAdmin, fetchRows]);

  const retryMirror = async (id: string) => {
    setRetrying(id);
    const { data, error } = await (supabase as any).rpc("retry_ai_audit_crm_mirror", {
      _request_id: id,
    });
    setRetrying(null);
    if (error) {
      toast({ title: "Retry failed", description: error.message, variant: "destructive" });
      return;
    }
    const result = data as { ok: boolean; crm_status: string; error?: string };
    toast({
      title: result.ok ? "CRM mirror completed" : "CRM mirror still failing",
      description: result.error ?? undefined,
      variant: result.ok ? undefined : "destructive",
    });
    await fetchRows();
  };

  /** Marks a request as actioned (or reopens it), recording date and operator. */
  const setActioned = async (id: string, actioned: boolean) => {
    setUpdating(id);
    const { error } = await (supabase as any)
      .from("ai_audit_requests")
      .update(
        actioned
          ? {
              action_status: "actioned",
              actioned_at: new Date().toISOString(),
              actioned_by: user?.id ?? null,
              actioned_by_email: user?.email ?? null,
            }
          : { action_status: "needs_action", actioned_at: null, actioned_by: null, actioned_by_email: null },
      )
      .eq("id", id);
    setUpdating(null);
    if (error) {
      toast({ title: "Could not update status", description: error.message, variant: "destructive" });
      return;
    }
    await fetchRows();
  };

  /** Acknowledges a persistent CRM-mirroring failure without clearing it. */
  const acknowledgeFailure = async (id: string) => {
    setUpdating(id);
    const { error } = await (supabase as any)
      .from("ai_audit_requests")
      .update({
        crm_failure_ack_at: new Date().toISOString(),
        crm_failure_ack_by_email: user?.email ?? null,
      })
      .eq("id", id);
    setUpdating(null);
    if (error) {
      toast({ title: "Could not acknowledge", description: error.message, variant: "destructive" });
      return;
    }
    await fetchRows();
  };



  const runSubjectRequest = async (action: "preview" | "export" | "delete") => {
    if (!subjectEmail.includes("@")) {
      toast({ title: "Enter a verified email address", variant: "destructive" });
      return;
    }
    setSubjectBusy(true);
    const { data, error } = await (supabase as any).rpc("admin_audit_subject_request", {
      _email: subjectEmail.trim().toLowerCase(),
      _action: action,
    });
    setSubjectBusy(false);
    if (error) {
      toast({ title: "Subject request failed", description: error.message, variant: "destructive" });
      return;
    }
    const result = data as SubjectResult & Record<string, unknown>;
    setSubjectResult(result);

    if (action === "export") {
      const blob = new Blob([JSON.stringify(result, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `subject-access-${subjectEmail.trim().toLowerCase()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
    if (action === "delete") {
      toast({ title: "Records deleted across all three stores" });
      await fetchRows();
    }
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }
  if (!user) return <Navigate to="/admin/login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;

  const failures = rows.filter((r) => r.crm_status === "failed");
  const unactioned = rows.filter((r) => r.action_status !== "actioned");
  const oldest = unactioned.reduce<string | null>(
    (acc, r) => (!acc || new Date(r.created_at) < new Date(acc) ? r.created_at : acc),
    null,
  );
  const crmPending = rows.filter((r) => r.crm_status === "pending").length;
  const crmCompleted = rows.filter((r) => r.crm_status === "completed").length;

  const stats: { label: string; value: string; tone?: "alert" }[] = [
    {
      label: "Unactioned requests",
      value: String(unactioned.length),
      ...(unactioned.length > 0 ? { tone: "alert" as const } : {}),
    },
    { label: "Oldest unactioned", value: oldest ? ageLabel(oldest) : "—" },
    { label: "CRM pending", value: String(crmPending) },
    { label: "CRM completed", value: String(crmCompleted) },
    {
      label: "CRM failed",
      value: String(failures.length),
      ...(failures.length > 0 ? { tone: "alert" as const } : {}),
    },
  ];

  /** Deep-link filter used by the outstanding-action indicators. */
  const filter = searchParams.get("filter") ?? "all";
  const visibleRows =
    filter === "needs-action"
      ? unactioned
      : filter === "crm-failed"
        ? failures
        : rows;
  const setFilter = (value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value === "all") next.delete("filter");
    else next.set("filter", value);
    setSearchParams(next, { replace: true });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto max-w-6xl px-4 py-28">
        <Link
          to="/admin/crm"
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back to CRM
        </Link>

        <h1 className="font-serif text-3xl">AI audit requests</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          This view is the authoritative operational channel for invoice, purchase-order,
          decision-pack and scoping requests recorded from the AI Leadership Readiness Audit. No
          internal operational or CRM-failure emails are sent; all outstanding work is tracked here.
        </p>

        <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-5">
          {stats.map((s) => (
            <div
              key={s.label}
              className={`rounded-md border p-4 ${
                s.tone === "alert" ? "border-destructive/50 bg-destructive/5" : ""
              }`}
            >
              <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{s.label}</p>
              <p
                className={`mt-1 font-serif text-2xl ${s.tone === "alert" ? "text-destructive" : ""}`}
              >
                {s.value}
              </p>
            </div>
          ))}
        </div>

        {unactioned.length > 0 && (
          <div className="mt-6 flex items-start gap-3 rounded-md border border-destructive/40 bg-destructive/5 p-4">
            <AlertTriangle className="mt-0.5 h-5 w-5 text-destructive" />
            <p className="text-sm">
              <strong>Needs action:</strong> {unactioned.length} request
              {unactioned.length === 1 ? "" : "s"} awaiting a response
              {oldest ? `, the oldest recorded ${ageLabel(oldest)} ago` : ""}. Mark each record
              actioned once the buyer has been responded to.
            </p>
          </div>
        )}

        {failures.length > 0 && (
          <div className="mt-4 flex items-start gap-3 rounded-md border border-destructive/40 bg-destructive/5 p-4">
            <AlertTriangle className="mt-0.5 h-5 w-5 text-destructive" />
            <p className="text-sm">
              {failures.length} request{failures.length === 1 ? "" : "s"} could not be mirrored into
              the CRM. The request records themselves are intact — use Retry below once the cause is
              resolved. The failure state persists until mirroring completes.
            </p>
          </div>
        )}

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => void fetchRows()} disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Refresh
          </Button>
          {(
            [
              ["all", `All (${rows.length})`],
              ["needs-action", `Needs action (${unactioned.length})`],
              ["crm-failed", `CRM failed (${failures.length})`],
            ] as const
          ).map(([value, label]) => (
            <Button
              key={value}
              size="sm"
              variant={filter === value ? "default" : "outline"}
              aria-pressed={filter === value}
              onClick={() => setFilter(value)}
            >
              {label}
            </Button>
          ))}
          <span className="text-sm text-muted-foreground">{visibleRows.length} shown</span>
        </div>


        <div className="mt-4 overflow-x-auto rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Recorded</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Request</TableHead>
                <TableHead>Qty</TableHead>
                <TableHead>Action status</TableHead>
                <TableHead>CRM mirror</TableHead>
                <TableHead>Buyer email</TableHead>
                <TableHead>Retain until</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {visibleRows.map((r) => (
                <TableRow
                  key={r.id}
                  className={r.action_status !== "actioned" ? "bg-destructive/[0.03]" : undefined}
                >
                  <TableCell className="whitespace-nowrap text-xs">
                    {format(new Date(r.created_at), "dd MMM yyyy HH:mm")}
                    {r.flagged_duplicate && (
                      <Badge variant="outline" className="ml-2">
                        merged ×{r.duplicate_count}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-xs">
                    <span className="block font-medium">{r.name ?? "—"}</span>
                    <span className="block text-muted-foreground">{r.email}</span>
                    <span className="block text-muted-foreground">{r.organisation ?? ""}</span>
                  </TableCell>
                  <TableCell className="text-xs">
                    <span className="block font-medium">{r.request_type}</span>
                    <span className="block text-muted-foreground">{r.action_label}</span>
                  </TableCell>
                  <TableCell className="text-xs">{r.participant_quantity ?? "—"}</TableCell>
                  <TableCell className="text-xs">
                    {r.action_status === "actioned" ? (
                      <>
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                          actioned
                        </Badge>
                        <span className="mt-1 block text-[11px] text-muted-foreground">
                          {r.actioned_at ? format(new Date(r.actioned_at), "dd MMM yyyy HH:mm") : "—"}
                        </span>
                        <span className="block text-[11px] text-muted-foreground">
                          {r.actioned_by_email ?? "unrecorded operator"}
                        </span>
                      </>
                    ) : (
                      <>
                        <Badge variant="destructive">needs action</Badge>
                        <span className="mt-1 block text-[11px] text-muted-foreground">
                          waiting {ageLabel(r.created_at)}
                        </span>
                      </>
                    )}
                  </TableCell>
                  <TableCell className="text-xs">
                    <Badge className={CRM_BADGE[r.crm_status]}>{r.crm_status}</Badge>
                    {r.crm_error && (
                      <span className="mt-1 block max-w-[220px] text-[11px] text-destructive">
                        {r.crm_error}
                      </span>
                    )}
                    <span className="mt-1 block text-[11px] text-muted-foreground">
                      {r.crm_attempts} attempt{r.crm_attempts === 1 ? "" : "s"}
                    </span>
                    {r.crm_status === "failed" &&
                      (r.crm_failure_ack_at ? (
                        <span className="mt-1 block text-[11px] text-muted-foreground">
                          acknowledged {format(new Date(r.crm_failure_ack_at), "dd MMM yyyy HH:mm")} by{" "}
                          {r.crm_failure_ack_by_email ?? "unrecorded operator"}
                        </span>
                      ) : (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="mt-1 h-6 px-2 text-[11px]"
                          disabled={updating === r.id}
                          onClick={() => void acknowledgeFailure(r.id)}
                        >
                          Acknowledge
                        </Button>
                      ))}
                  </TableCell>
                  <TableCell className="text-[11px] text-muted-foreground">
                    {r.buyer_ack_status}
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-xs">
                    {format(new Date(r.retain_until), "dd MMM yyyy")}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-2">
                      {r.crm_status !== "completed" && (
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={retrying === r.id}
                          onClick={() => void retryMirror(r.id)}
                        >
                          {retrying === r.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            "Retry"
                          )}
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant={r.action_status === "actioned" ? "ghost" : "default"}
                        disabled={updating === r.id}
                        onClick={() => void setActioned(r.id, r.action_status !== "actioned")}
                      >
                        {updating === r.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : r.action_status === "actioned" ? (
                          "Reopen"
                        ) : (
                          "Mark actioned"
                        )}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {!loading && visibleRows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} className="py-10 text-center text-sm text-muted-foreground">
                    No matching audit requests.

                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* ------------------------------------------------ subject requests */}

        <section className="mt-16 rounded-md border p-6">
          <h2 className="flex items-center gap-2 font-serif text-2xl">
            <ShieldCheck className="h-5 w-5" /> Subject access and deletion
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Locates records by verified email address across the audit response, the request record
            and the CRM contact. Preview first, then export or delete. Every action is logged with
            the date and operator; the deleted substantive data is not retained in the log.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Input
              type="email"
              value={subjectEmail}
              onChange={(e) => setSubjectEmail(e.target.value)}
              placeholder="verified@email.address"
              className="max-w-xs"
              aria-label="Verified email address"
            />
            <Button
              variant="outline"
              disabled={subjectBusy}
              onClick={() => void runSubjectRequest("preview")}
            >
              <Search className="mr-2 h-4 w-4" /> Preview
            </Button>
            <Button
              variant="outline"
              disabled={subjectBusy || !subjectResult}
              onClick={() => void runSubjectRequest("export")}
            >
              Export
            </Button>
            <Button
              variant="destructive"
              disabled={subjectBusy || !subjectResult}
              onClick={() => setConfirmDelete(true)}
            >
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </Button>
          </div>

          {subjectResult && (
            <div className="mt-5 rounded-md bg-muted/40 p-4 text-sm">
              <p className="font-medium">
                Found: {subjectResult.counts.audit_responses} audit response
                {subjectResult.counts.audit_responses === 1 ? "" : "s"},{" "}
                {subjectResult.counts.request_records} request record
                {subjectResult.counts.request_records === 1 ? "" : "s"},{" "}
                {subjectResult.counts.crm_contacts} CRM contact
                {subjectResult.counts.crm_contacts === 1 ? "" : "s"}.
              </p>
              <p className="mt-2 text-muted-foreground">{subjectResult.learning_platform_note}</p>
            </div>
          )}
        </section>
      </main>
      <Footer />

      <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete all records for this address?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes {subjectResult?.counts.audit_responses ?? 0} audit response(s),{" "}
              {subjectResult?.counts.request_records ?? 0} request record(s) and{" "}
              {subjectResult?.counts.crm_contacts ?? 0} CRM contact(s) for {subjectEmail}. It cannot
              be undone. Learning-platform records must be actioned separately on that platform.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setConfirmDelete(false);
                void runSubjectRequest("delete");
              }}
            >
              Delete permanently
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminAuditRequests;
