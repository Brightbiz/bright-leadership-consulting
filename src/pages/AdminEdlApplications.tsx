import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { format } from "date-fns";
import { ArrowLeft, Loader2, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  EDL,
  EDL_APPLICATION_STATUSES,
  EDL_EMPLOYER_STATUSES,
  EDL_EMPLOYER_STATUS_LABELS,
  EDL_OFFER_RESERVATION_WORKING_DAYS,
  EDL_STATUS_LABELS,
  type EdlApplicationStatus,
  type EdlEmployerRequestStatus,
} from "@/data/edlIntensive";
import {
  trackProgrammeClarificationInvite,
  trackProgrammeEnrolmentConfirmed,
  trackProgrammeOfferIssued,
  trackProgrammeWithdrawal,
} from "@/lib/analytics";

interface ApplicationRow {
  id: string;
  created_at: string;
  full_name: string;
  work_email: string;
  telephone: string;
  role_title: string;
  organisation: string;
  sector: string;
  country: string;
  time_zone: string;
  linkedin_url: string | null;
  referral_source: string;
  referral_detail: string | null;
  resp_current: string;
  resp_decision_types: string;
  resp_approvals: string;
  resp_authority: string;
  decision_statement: string;
  decision_deadline: string;
  decision_why_now: string;
  decision_at_risk: string;
  decision_already_decided: string;
  decision_alternatives: string;
  decision_off_limits: string;
  anonymisable: string;
  conflict_note: string | null;
  funding_route: string;
  sponsor_name: string | null;
  sponsor_role: string | null;
  sponsor_email: string | null;
  org_legal_name: string | null;
  po_required: string | null;
  vendor_onboarding_required: string | null;
  expected_approval_date: string | null;
  privacy_notice_version: string;
  marketing_consent: boolean;
  marketing_consent_at: string | null;
  utm_source: string | null;
  utm_campaign: string | null;
  status: EdlApplicationStatus;
  review_notes: string | null;
  decision_at: string | null;
  offer_reserved_until: string | null;
  edl_application_access_needs?: {
    adjustment_route: string;
    adjustment_detail: string | null;
    preferred_contact_method: string | null;
  }[];
}

interface EmployerRow {
  id: string;
  created_at: string;
  requester_name: string;
  requester_role: string;
  requester_organisation: string;
  requester_email: string;
  participant_name: string | null;
  participant_role: string | null;
  participant_email: string | null;
  invoice_required: string | null;
  po_required: string | null;
  vendor_onboarding_required: string | null;
  expected_decision_date: string | null;
  admin_question: string | null;
  status: EdlEmployerRequestStatus;
}

const STATUS_TONE: Partial<Record<EdlApplicationStatus, string>> = {
  submitted: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  conflict_hold: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  conditionally_accepted: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  enrolled: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  declined: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  offer_lapsed: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
};

/** Five working days from today, skipping Saturday and Sunday. */
const reservationDeadline = () => {
  const date = new Date();
  let added = 0;
  while (added < EDL_OFFER_RESERVATION_WORKING_DAYS) {
    date.setDate(date.getDate() + 1);
    const day = date.getDay();
    if (day !== 0 && day !== 6) added += 1;
  }
  return date;
};

const ACCESS_ROUTE_LABELS: Record<string, string> = {
  yes: "Adjustment requested",
  private: "Prefers a private conversation",
};

/**
 * Administrative review for Executive Decision Leadership Intensive™
 * applications. Every status in the approved list can be assigned by a human
 * reviewer; nothing here initiates a payment route.
 */
const AdminEdlApplications = () => {
  const { user, isAdmin, isLoading: authLoading } = useAdminAuth();
  const { toast } = useToast();
  const [rows, setRows] = useState<ApplicationRow[]>([]);
  const [employerRows, setEmployerRows] = useState<EmployerRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});

  const fetchAll = useCallback(async () => {
    setLoading(true);
    const [apps, employers] = await Promise.all([
      (supabase as any)
        .from("edl_applications")
        .select("*, edl_application_access_needs(adjustment_route, adjustment_detail, preferred_contact_method)")
        .order("created_at", { ascending: false }),
      (supabase as any)
        .from("edl_employer_requests")
        .select("*")
        .order("created_at", { ascending: false }),
    ]);

    if (apps.error || employers.error) {
      toast({ title: "Could not load applications", variant: "destructive" });
    } else {
      setRows((apps.data as ApplicationRow[]) ?? []);
      setEmployerRows((employers.data as EmployerRow[]) ?? []);
    }
    setLoading(false);
  }, [toast]);

  useEffect(() => {
    if (isAdmin) void fetchAll();
  }, [isAdmin, fetchAll]);

  const outstanding = useMemo(
    () => rows.filter((r) => r.status === "submitted" || r.status === "conflict_hold").length,
    [rows],
  );

  const setStatus = async (row: ApplicationRow, status: EdlApplicationStatus) => {
    setBusyId(row.id);
    const patch: Record<string, unknown> = {
      status,
      reviewer_id: user?.id ?? null,
      decision_at: new Date().toISOString(),
    };

    // A conditional place is reserved for five working days unless extended.
    if (status === "conditionally_accepted") {
      patch.offer_reserved_until = reservationDeadline().toISOString();
    }

    const { error } = await (supabase as any)
      .from("edl_applications")
      .update(patch)
      .eq("id", row.id);

    if (error) {
      toast({ title: "Status could not be updated", variant: "destructive" });
    } else {
      // Categorical funnel events only — no applicant detail is transmitted.
      if (status === "clarification_required" || status === "clarification_scheduled") {
        trackProgrammeClarificationInvite({ programme: EDL.title, reasonCategory: status });
      }
      if (status === "conditionally_accepted") {
        trackProgrammeOfferIssued({
          programme: EDL.title,
          route: row.funding_route === "Employer-funded" ? "employer" : "self",
          deadline: reservationDeadline().toISOString().slice(0, 10),
        });
      }
      if (status === "enrolled") {
        trackProgrammeEnrolmentConfirmed({
          programme: EDL.title,
          fundingClassification: row.funding_route,
        });
      }
      if (status === "withdrawn" || status === "offer_lapsed") {
        trackProgrammeWithdrawal({ programme: EDL.title, stage: row.status, reasonCategory: status });
      }
      await fetchAll();
    }
    setBusyId(null);
  };

  const saveNotes = async (row: ApplicationRow) => {
    setBusyId(row.id);
    const { error } = await (supabase as any)
      .from("edl_applications")
      .update({ review_notes: notes[row.id] ?? row.review_notes ?? "", reviewer_id: user?.id ?? null })
      .eq("id", row.id);
    if (error) toast({ title: "Review notes could not be saved", variant: "destructive" });
    else toast({ title: "Review notes saved" });
    setBusyId(null);
  };

  const setEmployerStatus = async (row: EmployerRow, status: EdlEmployerRequestStatus) => {
    setBusyId(row.id);
    const { error } = await (supabase as any)
      .from("edl_employer_requests")
      .update({ status })
      .eq("id", row.id);
    if (error) toast({ title: "Status could not be updated", variant: "destructive" });
    else await fetchAll();
    setBusyId(null);
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }
  if (!user) return <Navigate to="/admin/login" replace />;
  if (!isAdmin) return <Navigate to="/admin/login" replace />;

  const Field = ({ label, value }: { label: string; value: string | null }) =>
    value ? (
      <div>
        <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
        <p className="mt-1 whitespace-pre-wrap text-sm text-foreground">{value}</p>
      </div>
    ) : null;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container-brief pt-32 pb-24">
        <Link to="/admin" className="link-quiet mb-8 inline-flex items-center gap-2 text-sm">
          <ArrowLeft className="h-3.5 w-3.5" /> Admin
        </Link>

        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="heading-section">Executive Decision Leadership Intensive™</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {rows.length} application{rows.length === 1 ? "" : "s"} · {outstanding} awaiting
              review · {employerRows.length} employer request
              {employerRows.length === 1 ? "" : "s"}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => void fetchAll()} disabled={loading}>
            <RefreshCw className={`mr-2 h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh
          </Button>
        </div>

        {/* Applications */}
        <section aria-labelledby="applications-heading" className="mb-20">
          <h2 id="applications-heading" className="mb-6 font-serif text-lg font-semibold text-foreground">
            Applications
          </h2>

          {rows.length === 0 && !loading && (
            <p className="text-sm text-muted-foreground">No applications have been received.</p>
          )}

          <ul className="space-y-4">
            {rows.map((row) => {
              const access = row.edl_application_access_needs?.[0];
              const isOpen = openId === row.id;
              return (
                <li key={row.id} className="rounded-sm border border-border bg-background">
                  <div className="flex flex-wrap items-start justify-between gap-4 p-5">
                    <div>
                      <p className="font-serif text-base font-semibold text-foreground">
                        {row.full_name} — {row.organisation}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {row.role_title} · {row.funding_route} · {row.referral_source}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Received {format(new Date(row.created_at), "d MMM yyyy, HH:mm")}
                        {row.offer_reserved_until
                          ? ` · place reserved until ${format(new Date(row.offer_reserved_until), "d MMM yyyy")}`
                          : ""}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <Badge className={STATUS_TONE[row.status] ?? ""}>
                        {EDL_STATUS_LABELS[row.status]}
                      </Badge>
                      <Button variant="outline" size="sm" onClick={() => setOpenId(isOpen ? null : row.id)}>
                        {isOpen ? "Hide record" : "Open record"}
                      </Button>
                    </div>
                  </div>

                  {isOpen && (
                    <div className="space-y-8 border-t border-border p-5">
                      <div className="grid gap-5 sm:grid-cols-2">
                        <Field label="Work email" value={row.work_email} />
                        <Field label="Telephone" value={row.telephone} />
                        <Field label="Sector" value={row.sector} />
                        <Field label="Country / time zone" value={`${row.country} · ${row.time_zone}`} />
                        <Field label="LinkedIn" value={row.linkedin_url} />
                        <Field label="Recruitment detail" value={row.referral_detail} />
                        <Field label="Privacy notice version" value={row.privacy_notice_version} />
                        <Field
                          label="Marketing consent"
                          value={
                            row.marketing_consent
                              ? `Given ${row.marketing_consent_at ? format(new Date(row.marketing_consent_at), "d MMM yyyy") : ""}`
                              : "Not given"
                          }
                        />
                        <Field label="Campaign source" value={row.utm_source} />
                        <Field label="Campaign" value={row.utm_campaign} />
                      </div>

                      <div className="space-y-5 border-t border-border pt-5">
                        <h3 className="font-serif text-sm font-semibold text-foreground">Responsibility</h3>
                        <Field label="Present responsibilities" value={row.resp_current} />
                        <Field label="Decisions shaped" value={row.resp_decision_types} />
                        <Field label="Approval required from" value={row.resp_approvals} />
                        <Field label="Implementation authority" value={row.resp_authority} />
                      </div>

                      <div className="space-y-5 border-t border-border pt-5">
                        <h3 className="font-serif text-sm font-semibold text-foreground">Decision case</h3>
                        <Field label="Decision statement" value={row.decision_statement} />
                        <Field
                          label="Decision deadline"
                          value={format(new Date(row.decision_deadline), "d MMM yyyy")}
                        />
                        <Field label="Why now" value={row.decision_why_now} />
                        <Field label="At risk" value={row.decision_at_risk} />
                        <Field label="Already decided" value={row.decision_already_decided} />
                        <Field label="Genuine alternatives" value={row.decision_alternatives} />
                        <Field label="Not for cohort discussion" value={row.decision_off_limits} />
                        <Field label="Can be anonymised" value={row.anonymisable} />
                        <Field label="Declared conflict" value={row.conflict_note} />
                      </div>

                      {row.funding_route === "Employer-funded" && (
                        <div className="space-y-5 border-t border-border pt-5">
                          <h3 className="font-serif text-sm font-semibold text-foreground">
                            Employer funding
                          </h3>
                          <Field label="Approver" value={`${row.sponsor_name ?? ""} — ${row.sponsor_role ?? ""}`} />
                          <Field label="Approver email" value={row.sponsor_email} />
                          <Field label="Organisation legal name" value={row.org_legal_name} />
                          <Field label="Purchase order required" value={row.po_required} />
                          <Field label="Vendor onboarding required" value={row.vendor_onboarding_required} />
                          <Field
                            label="Expected approval date"
                            value={
                              row.expected_approval_date
                                ? format(new Date(row.expected_approval_date), "d MMM yyyy")
                                : null
                            }
                          />
                        </div>
                      )}

                      {access && (
                        <div className="space-y-3 rounded-sm border border-border bg-muted/30 p-4">
                          <h3 className="font-serif text-sm font-semibold text-foreground">
                            Access support — restricted
                          </h3>
                          <p className="text-sm text-foreground">
                            {ACCESS_ROUTE_LABELS[access.adjustment_route] ?? access.adjustment_route}
                          </p>
                          {access.adjustment_detail && (
                            <p className="whitespace-pre-wrap text-sm text-muted-foreground">
                              {access.adjustment_detail}
                            </p>
                          )}
                          {access.preferred_contact_method && (
                            <p className="text-sm text-muted-foreground">
                              Preferred contact: {access.preferred_contact_method}
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground">
                            Never included in notifications or analytics.
                          </p>
                        </div>
                      )}

                      <div className="space-y-4 border-t border-border pt-5">
                        <label
                          className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground"
                          htmlFor={`notes-${row.id}`}
                        >
                          Review notes
                        </label>
                        <Textarea
                          id={`notes-${row.id}`}
                          rows={3}
                          value={notes[row.id] ?? row.review_notes ?? ""}
                          onChange={(e) => setNotes((n) => ({ ...n, [row.id]: e.target.value }))}
                        />
                        <Button size="sm" variant="outline" onClick={() => void saveNotes(row)} disabled={busyId === row.id}>
                          Save notes
                        </Button>
                      </div>

                      <div className="border-t border-border pt-5">
                        <p className="mb-3 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                          Assign status
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {EDL_APPLICATION_STATUSES.map((status) => (
                            <Button
                              key={status}
                              size="sm"
                              variant={row.status === status ? "default" : "outline"}
                              disabled={busyId === row.id}
                              onClick={() => void setStatus(row, status)}
                            >
                              {EDL_STATUS_LABELS[status]}
                            </Button>
                          ))}
                        </div>
                        <p className="mt-4 text-xs text-muted-foreground">
                          A conditional acceptance reserves the place for{" "}
                          {EDL_OFFER_RESERVATION_WORKING_DAYS} working days. Payment and
                          invoice routes are issued manually after accepted terms.
                        </p>
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </section>

        {/* Employer requests */}
        <section aria-labelledby="employer-heading">
          <h2 id="employer-heading" className="mb-6 font-serif text-lg font-semibold text-foreground">
            Employer-information requests
          </h2>

          {employerRows.length === 0 && !loading && (
            <p className="text-sm text-muted-foreground">No employer requests have been received.</p>
          )}

          <ul className="space-y-4">
            {employerRows.map((row) => (
              <li key={row.id} className="rounded-sm border border-border bg-background p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="font-serif text-base font-semibold text-foreground">
                      {row.requester_name} — {row.requester_organisation}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {row.requester_role} · {row.requester_email}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Received {format(new Date(row.created_at), "d MMM yyyy, HH:mm")}
                      {row.expected_decision_date
                        ? ` · decision expected ${format(new Date(row.expected_decision_date), "d MMM yyyy")}`
                        : ""}
                    </p>
                  </div>
                  <Badge variant="outline">{EDL_EMPLOYER_STATUS_LABELS[row.status]}</Badge>
                </div>

                <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-3">
                  <div>
                    <dt className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Invoice</dt>
                    <dd className="text-foreground">{row.invoice_required ?? "Not stated"}</dd>
                  </div>
                  <div>
                    <dt className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                      Purchase order
                    </dt>
                    <dd className="text-foreground">{row.po_required ?? "Not stated"}</dd>
                  </div>
                  <div>
                    <dt className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                      Vendor onboarding
                    </dt>
                    <dd className="text-foreground">{row.vendor_onboarding_required ?? "Not stated"}</dd>
                  </div>
                </dl>

                {(row.participant_name || row.participant_email) && (
                  <p className="mt-4 text-sm text-muted-foreground">
                    Intended participant: {row.participant_name ?? "—"}
                    {row.participant_role ? `, ${row.participant_role}` : ""}
                    {row.participant_email ? ` · ${row.participant_email}` : ""}
                  </p>
                )}

                {row.admin_question && (
                  <p className="mt-4 whitespace-pre-wrap text-sm text-muted-foreground">
                    {row.admin_question}
                  </p>
                )}

                <div className="mt-5 flex flex-wrap gap-2 border-t border-border pt-4">
                  {EDL_EMPLOYER_STATUSES.map((status) => (
                    <Button
                      key={status}
                      size="sm"
                      variant={row.status === status ? "default" : "outline"}
                      disabled={busyId === row.id}
                      onClick={() => void setEmployerStatus(row, status)}
                    >
                      {EDL_EMPLOYER_STATUS_LABELS[status]}
                    </Button>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AdminEdlApplications;
