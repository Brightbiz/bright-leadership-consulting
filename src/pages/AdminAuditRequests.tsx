import { useCallback, useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
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
  const { toast } = useToast();
  const [rows, setRows] = useState<AuditRequestRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [retrying, setRetrying] = useState<string | null>(null);

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
          Invoice, purchase-order, decision-pack and scoping requests recorded from the AI Leadership
          Readiness Audit, with CRM mirroring status and the restricted subject-request function.
        </p>

        {failures.length > 0 && (
          <div className="mt-6 flex items-start gap-3 rounded-md border border-destructive/40 bg-destructive/5 p-4">
            <AlertTriangle className="mt-0.5 h-5 w-5 text-destructive" />
            <p className="text-sm">
              {failures.length} request{failures.length === 1 ? "" : "s"} could not be mirrored into
              the CRM. The request records themselves are intact — use Retry below once the cause is
              resolved.
            </p>
          </div>
        )}

        <div className="mt-6 flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => void fetchRows()} disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Refresh
          </Button>
          <span className="text-sm text-muted-foreground">{rows.length} records</span>
        </div>

        <div className="mt-4 overflow-x-auto rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Recorded</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Request</TableHead>
                <TableHead>Qty</TableHead>
                <TableHead>CRM mirror</TableHead>
                <TableHead>Emails</TableHead>
                <TableHead>Retain until</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.id}>
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
                    <Badge className={CRM_BADGE[r.crm_status]}>{r.crm_status}</Badge>
                    {r.crm_error && (
                      <span className="mt-1 block max-w-[220px] text-[11px] text-destructive">
                        {r.crm_error}
                      </span>
                    )}
                    <span className="mt-1 block text-[11px] text-muted-foreground">
                      {r.crm_attempts} attempt{r.crm_attempts === 1 ? "" : "s"}
                    </span>
                  </TableCell>
                  <TableCell className="text-[11px] text-muted-foreground">
                    <span className="block">buyer: {r.buyer_ack_status}</span>
                    <span className="block">admin: {r.admin_notice_status}</span>
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-xs">
                    {format(new Date(r.retain_until), "dd MMM yyyy")}
                  </TableCell>
                  <TableCell>
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
                  </TableCell>
                </TableRow>
              ))}
              {!loading && rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="py-10 text-center text-sm text-muted-foreground">
                    No audit requests recorded yet.
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
