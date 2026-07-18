import { useState, useRef, useEffect, useCallback } from "react";
import { Navigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2, Plus, Trash2, Copy, Download, ArrowLeft, Star, AlertTriangle, Filter, CheckCircle2, MailCheck, Reply, Send, BarChart3, PenLine, ShieldAlert } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

type DraftStatus = "draft" | "sent" | "replied";
type ReplySentiment = "positive" | "neutral" | "negative" | "no_thanks" | "meeting_booked";

interface Recipient {
  id: string;              // DB uuid (also used locally before save)
  name: string;
  role: string;
  company: string;
  email: string;
  context: string;
  priority: boolean;
  cadence_days: number;         // 7 | 14 | 21 — days to wait before follow-up is eligible
  do_not_follow_up: boolean;    // hard exclude from auto follow-ups
  snooze_until: string | null;  // ISO date; if in future, follow-up is paused
  persisted?: boolean;     // true once at least one save has succeeded
}

interface SavedDraft {
  id: string;
  recipient_id: string | null;
  recipient_name: string;
  recipient_role: string;
  company: string;
  subject: string;
  body: string;
  status: DraftStatus;
  sent_at: string | null;
  crm_contact_id: string | null;
  created_at: string;
  parent_draft_id?: string | null;
  is_follow_up?: boolean;
  replied_at?: string | null;
  reply_text?: string | null;
  reply_sentiment?: ReplySentiment | null;
}

const emptyRecipient = (): Recipient => ({
  id: crypto.randomUUID(),
  name: "",
  role: "Chair",
  company: "",
  email: "",
  context: "",
  priority: false,
  cadence_days: 14,
  do_not_follow_up: false,
  snooze_until: null,
});

const CADENCE_OPTIONS = [7, 14, 21] as const;


const ROLE_PRESETS = ["Chair", "Senior Independent Director", "Nominations Committee Chair", "Non-Executive Director"];

const AdminOutreach = () => {
  const { user, isAdmin, isLoading } = useAdminAuth();
  const { toast } = useToast();
  const [recipients, setRecipients] = useState<Recipient[]>(
    Array.from({ length: 3 }, emptyRecipient)
  );
  const [notes, setNotes] = useState("");
  const [bulkPaste, setBulkPaste] = useState("");
  const [generating, setGenerating] = useState(false);
  const [drafts, setDrafts] = useState<SavedDraft[]>([]);
  const [genericWarning, setGenericWarning] = useState<{ names: string[]; batch: Recipient[] } | null>(null);
  const [showOnlyGeneric, setShowOnlyGeneric] = useState(false);
  const [replyDialog, setReplyDialog] = useState<SavedDraft | null>(null);
  const [replyText, setReplyText] = useState("");
  const [replySentiment, setReplySentiment] = useState<ReplySentiment>("neutral");
  const [followUpBusyId, setFollowUpBusyId] = useState<string | null>(null);
  const [hydrating, setHydrating] = useState(true);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const userId = user?.id ?? null;

  // Sender identity + signature block — persisted per browser in localStorage.
  const [sender, setSender] = useState<{ name: string; title: string; signature: string }>(() => {
    try {
      return {
        name: localStorage.getItem("outreach.sender.name") ?? "",
        title: localStorage.getItem("outreach.sender.title") ?? "",
        signature: localStorage.getItem("outreach.sender.signature") ?? "",
      };
    } catch {
      return { name: "", title: "", signature: "" };
    }
  });
  const [senderDialogOpen, setSenderDialogOpen] = useState(false);
  const [senderDraft, setSenderDraft] = useState(sender);
  const signatureBlock = (() => {
    if (sender.signature.trim()) return sender.signature.trim();
    const lines = ["— Bright Leadership Consulting"];
    if (sender.name.trim()) lines.unshift([sender.name, sender.title].filter(Boolean).join(", "));
    return lines.join("\n");
  })();
  const saveSender = () => {
    try {
      localStorage.setItem("outreach.sender.name", senderDraft.name);
      localStorage.setItem("outreach.sender.title", senderDraft.title);
      localStorage.setItem("outreach.sender.signature", senderDraft.signature);
    } catch {}
    setSender(senderDraft);
    setSenderDialogOpen(false);
    toast({ title: "Signature saved" });
  };


  // Load recipients + drafts on mount
  useEffect(() => {
    if (!userId || !isAdmin) return;
    let cancelled = false;
    (async () => {
      try {
        const [{ data: recData }, { data: draftData }] = await Promise.all([
          (supabase as any)
            .from("outreach_recipients")
            .select("id,name,role,company,email,context,priority,sort_order")
            .eq("user_id", userId)
            .order("sort_order", { ascending: true }),
          (supabase as any)
            .from("outreach_drafts")
            .select("id,recipient_id,recipient_name,recipient_role,company,subject,body,status,sent_at,crm_contact_id,created_at,parent_draft_id,is_follow_up,replied_at,reply_text,reply_sentiment")
            .eq("user_id", userId)
            .order("created_at", { ascending: false })
            .limit(200),
        ]);
        if (cancelled) return;
        if (recData && recData.length > 0) {
          setRecipients(
            recData.map((r: any) => ({
              id: r.id,
              name: r.name ?? "",
              role: r.role ?? "Chair",
              company: r.company ?? "",
              email: r.email ?? "",
              context: r.context ?? "",
              priority: !!r.priority,
              persisted: true,
            }))
          );
        }
        if (draftData) setDrafts(draftData as SavedDraft[]);
      } catch (err) {
        console.error("Failed to load outreach data", err);
      } finally {
        if (!cancelled) setHydrating(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [userId, isAdmin]);

  // Debounced autosave — upsert recipients whenever they change
  const persistRecipients = useCallback(
    async (list: Recipient[]) => {
      if (!userId) return;
      const rows = list
        .map((r, idx) => ({
          id: r.id,
          user_id: userId,
          name: r.name,
          role: r.role || "Chair",
          company: r.company,
          email: r.email || null,
          context: r.context,
          priority: r.priority,
          sort_order: idx,
        }))
        .filter(r => r.name.trim() || r.company.trim() || r.email || r.context.trim());
      if (rows.length === 0) return;
      const { error } = await (supabase as any)
        .from("outreach_recipients")
        .upsert(rows, { onConflict: "id" });
      if (error) console.error("Recipient autosave failed", error);
    },
    [userId]
  );

  useEffect(() => {
    if (hydrating || !userId) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      persistRecipients(recipients);
    }, 700);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [recipients, hydrating, userId, persistRecipients]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }
  if (!user || !isAdmin) return <Navigate to="/admin/login" replace />;


  const updateRecipient = (id: string, patch: Partial<Recipient>) =>
    setRecipients(rs => rs.map(r => (r.id === id ? { ...r, ...patch } : r)));

  const addRecipient = () => setRecipients(rs => [...rs, emptyRecipient()]);
  const removeRecipient = async (id: string) => {
    setRecipients(rs => rs.filter(r => r.id !== id));
    if (userId) {
      await (supabase as any).from("outreach_recipients").delete().eq("id", id);
    }
  };

  const parseBulk = () => {
    // Format per line: Name | Role | Company | optional context
    const parsed = bulkPaste
      .split(/\r?\n/)
      .map(l => l.trim())
      .filter(Boolean)
      .map(line => {
        const parts = line.split("|").map(p => p.trim());
        return {
          id: crypto.randomUUID(),
          name: parts[0] || "",
          role: parts[1] || "Chair",
          company: parts[2] || "",
          email: "",
          context: parts[3] || "",
          priority: false,
          cadence_days: 14,
          do_not_follow_up: false,
          snooze_until: null,
        } satisfies Recipient;

      })
      .filter(r => r.name);
    if (parsed.length === 0) {
      toast({ title: "Nothing to import", description: "Use one recipient per line: Name | Role | Company | context", variant: "destructive" });
      return;
    }
    setRecipients(parsed);
    setBulkPaste("");
    toast({ title: `Imported ${parsed.length} recipients` });
  };

  const normalizeHeader = (h: string) =>
    h
      .toLowerCase()
      .replace(/[^a-z0-9]/g, " ")
      .trim();

  const findColumn = (headers: string[], candidates: string[]) => {
    const normalized = headers.map(normalizeHeader);
    for (const candidate of candidates.map(c => normalizeHeader(c))) {
      const exact = normalized.indexOf(candidate);
      if (exact !== -1) return exact;
      const partial = normalized.findIndex(h => h.includes(candidate) || candidate.includes(h));
      if (partial !== -1) return partial;
    }
    return -1;
  };

  const parseCsvRows = (text: string): { headers: string[]; rows: string[][] } => {
    const lines: string[][] = [];
    let current: string[] = [];
    let field = "";
    let inQuotes = false;
    const flushField = () => {
      current.push(field.trim());
      field = "";
    };
    const flushRow = () => {
      if (current.length > 0 || field.length > 0) {
        flushField();
        lines.push(current);
        current = [];
      }
    };
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const next = text[i + 1];
      if (char === '"') {
        if (inQuotes && next === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === "," && !inQuotes) {
        flushField();
      } else if ((char === "\n" || char === "\r") && !inQuotes) {
        flushRow();
      } else {
        field += char;
      }
    }
    flushRow();
    const nonEmpty = lines.filter(r => r.some(c => c.length > 0));
    if (nonEmpty.length === 0) return { headers: [], rows: [] };
    return { headers: nonEmpty[0], rows: nonEmpty.slice(1) };
  };

  const [csvPreview, setCsvPreview] = useState<Recipient[] | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const mapApolloRow = (headers: string[], row: string[]): Recipient => {
    const nameIdx = findColumn(headers, ["name", "full name"]);
    const firstNameIdx = findColumn(headers, ["first name"]);
    const lastNameIdx = findColumn(headers, ["last name"]);
    const titleIdx = findColumn(headers, ["title", "job title", "role"]);
    const companyIdx = findColumn(headers, ["company name", "company", "account name", "organization name", "organisation name", "organization", "organisation"]);
    const industryIdx = findColumn(headers, ["industry", "company industry", "keywords"]);

    let name = "";
    if (nameIdx !== -1 && row[nameIdx]) {
      name = row[nameIdx];
    } else if (firstNameIdx !== -1 || lastNameIdx !== -1) {
      const parts = [row[firstNameIdx] ?? "", row[lastNameIdx] ?? ""].filter(Boolean);
      name = parts.join(" ");
    }

    const role = titleIdx !== -1 ? row[titleIdx] ?? "" : "";
    const company = companyIdx !== -1 ? row[companyIdx] ?? "" : "";
    const context = industryIdx !== -1 ? row[industryIdx] ?? "" : "";

    return {
      id: crypto.randomUUID(),
      name: name.slice(0, 120),
      role: role.slice(0, 120) || "Chair",
      company: company.slice(0, 160),
      email: "",
      context: context.slice(0, 400),
      priority: false,
    } satisfies Recipient;
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.toLowerCase().endsWith(".csv")) {
      toast({ title: "Please upload a CSV file", variant: "destructive" });
      return;
    }
    try {
      const text = await file.text();
      const { headers, rows } = parseCsvRows(text);
      if (headers.length === 0 || rows.length === 0) {
        toast({ title: "CSV appears empty", description: "No usable rows were found.", variant: "destructive" });
        return;
      }
      const mapped = rows.map(r => mapApolloRow(headers, r)).filter(r => r.name);
      if (mapped.length === 0) {
        toast({ title: "No recipients found", description: "Check the CSV has Name, Title, and Company columns.", variant: "destructive" });
        return;
      }
      setCsvPreview(mapped.slice(0, 50));
      toast({ title: `Parsed ${mapped.length} recipients`, description: "Review the preview, then confirm import." });
    } catch (err) {
      toast({ title: "Failed to read CSV", description: (err as Error).message, variant: "destructive" });
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const confirmCsvImport = () => {
    if (!csvPreview || csvPreview.length === 0) return;
    setRecipients(csvPreview);
    setCsvPreview(null);
    toast({ title: `Imported ${csvPreview.length} recipients` });
  };

  const cancelCsvImport = () => setCsvPreview(null);

  // Signal words that suggest a specific, board-level observation rather than
  // a scraped industry-keyword dump. Presence of any of these makes context "specific".
  const SPECIFIC_SIGNALS = [
    "chair", "ceo", "cfo", "coo", "sid", "appoint", "transition", "succession",
    "refresh", "review", "agm", "governance", "strategy", "merger", "acquisition",
    "acquir", "ipo", "listing", "delist", "restructur", "transformation", "activist",
    "esg", "audit", "dispute", "resign", "step down", "stepped down", "new chair",
    "board effectiveness", "remit", "committee", "spin off", "spin-off", "carve out",
    "carve-out", "takeover", "profit warning", "fundraise", "capital raise",
    "regulatory", "fine", "probe", "investigation", "turnaround", "scandal",
    "reappointed", "interim",
  ];

  const contextIssue = (ctx: string): string | null => {
    const c = ctx.trim().toLowerCase();
    if (!c) return "Empty — add a board-level observation.";
    if (c.length < 25) return "Too short — add specificity (transition, governance event, appointment).";
    const hasSignal = SPECIFIC_SIGNALS.some(s => c.includes(s));
    if (hasSignal) return null;
    const commaCount = (c.match(/,/g) || []).length;
    const hasSentence = /[.!?]/.test(c);
    if (commaCount >= 2 && !hasSentence) return "Keyword dump — rewrite as a specific observation.";
    return "No board-level signal — reference a chair change, review, or governance event.";
  };
  const isGenericContext = (ctx: string): boolean => contextIssue(ctx) !== null;

  // Auto-suggested rewrite prompts for flagged recipients. Each prompt is a
  // fully-formed board-level observation seeded from Name, Title, and Company
  // so the user can one-click select the closest fit and refine from there.
  const suggestContextRewrites = (r: Recipient): string[] => {
    const role = (r.role || "").toLowerCase();
    const company = r.company.trim() || "the board";
    const firstName = (r.name.trim().split(/\s+/)[0]) || "";
    const surname = r.name.trim().split(/\s+/).slice(-1)[0] || "";
    const who = surname ? `${surname}'s` : "their";

    if (role.includes("chair")) {
      return [
        `Recently appointed Chair at ${company}; board effectiveness review likely in ${who} first 12 months.`,
        `Chair at ${company} navigating an executive transition — CEO or CFO succession increasingly on the agenda.`,
        `Chair overseeing a strategy reset at ${company}; alignment between board intent and executive delivery under pressure.`,
      ];
    }
    if (role.includes("sid") || role.includes("senior independent")) {
      return [
        `SID at ${company} during a period of executive transition; succession and governance under review.`,
        `Senior Independent Director at ${company} responsible for the chair's annual effectiveness review — variance likely to surface.`,
        `SID at ${company} acting as shareholder point of contact during a period of strategic scrutiny.`,
      ];
    }
    if (role.includes("nomination")) {
      return [
        `Chair of the Nominations Committee at ${company} leading a NED refresh; alignment gaps typical at this stage.`,
        `Nominations Committee lead at ${company} handling chair succession — board composition under active review.`,
        `Nominations Committee at ${company} rebalancing skills matrix following a recent board refresh.`,
      ];
    }
    if (role.includes("ceo")) {
      return [
        `CEO at ${company} navigating a strategy reset; board-executive alignment increasingly material.`,
        `CEO at ${company} following a chair transition — recalibration of board expectations underway.`,
        `CEO at ${company} preparing for a capital or governance milestone where alignment variance is board-visible.`,
      ];
    }
    if (role.includes("ned") || role.includes("non-executive")) {
      return [
        `NED at ${company} following a recent board refresh; committee remit and effectiveness under review.`,
        `Non-Executive at ${company} sitting on Audit or Remuneration during a period of regulatory scrutiny.`,
        `NED at ${company} contributing to an externally-facilitated board evaluation this cycle.`,
      ];
    }
    if (role.includes("cfo")) {
      return [
        `CFO at ${company} through a capital or reporting cycle where board-executive alignment on strategy is being tested.`,
        `CFO at ${company} following a chair or CEO transition — financial narrative under board re-examination.`,
      ];
    }
    return [
      `Recent governance event at ${company} — board refresh, strategy reset, or committee review — likely to surface alignment variance.`,
      `${firstName || "Director"} operating at ${company} through a period of executive transition where board alignment is materially tested.`,
      `Board of ${company} undertaking an externally-facilitated effectiveness review; variance between intent and execution under scrutiny.`,
    ];
  };


  const runGenerate = async (batch: Recipient[]) => {
    if (!userId) return;
    setGenerating(true);
    try {
      // Ensure batch recipients are persisted first so we can link drafts to them.
      await persistRecipients(recipients);

      const { data, error } = await supabase.functions.invoke("generate-outreach", {
        body: { recipients: batch, notes },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      const emails: Array<{ recipient_name: string; recipient_role: string; company: string; subject: string; body: string }> =
        data?.emails ?? [];
      if (emails.length === 0) throw new Error("No drafts returned");

      // Match each generated email back to the recipient by name+company (order-tolerant).
      const findRecipient = (e: { recipient_name: string; company: string }) =>
        batch.find(
          r =>
            r.name.trim().toLowerCase() === (e.recipient_name || "").trim().toLowerCase() &&
            r.company.trim().toLowerCase() === (e.company || "").trim().toLowerCase()
        ) ?? batch.find(r => r.name.trim().toLowerCase() === (e.recipient_name || "").trim().toLowerCase());

      const rows = emails.map(e => {
        const rec = findRecipient(e);
        return {
          user_id: userId,
          recipient_id: rec?.id ?? null,
          recipient_name: e.recipient_name,
          recipient_role: e.recipient_role,
          company: e.company ?? "",
          subject: e.subject,
          body: e.body,
          status: "draft" as DraftStatus,
        };
      });

      const { data: inserted, error: insertErr } = await (supabase as any)
        .from("outreach_drafts")
        .insert(rows)
        .select();
      if (insertErr) throw insertErr;

      setDrafts(prev => [...(inserted as SavedDraft[]), ...prev]);
      toast({ title: `Drafted ${emails.length} emails`, description: "Saved to your outreach log." });
    } catch (err: any) {
      toast({ title: "Generation failed", description: err.message ?? "Please try again.", variant: "destructive" });
    } finally {
      setGenerating(false);
    }
  };

  const generate = async () => {
    const valid = recipients.filter(r => r.name.trim() && r.role.trim());
    const flagged = valid.filter(r => r.priority);
    const batch = flagged.length > 0 ? flagged : valid;
    if (batch.length === 0) {
      toast({ title: "Add at least one recipient", variant: "destructive" });
      return;
    }
    if (batch.length > 20) {
      toast({
        title: "Maximum 20 recipients per batch",
        description: flagged.length > 0
          ? "Deselect some priority contacts, or generate in multiple passes."
          : "Flag your top 20 with the star, or trim the list.",
        variant: "destructive",
      });
      return;
    }
    const genericNames = batch.filter(r => isGenericContext(r.context)).map(r => r.name);
    if (genericNames.length > 0) {
      setGenericWarning({ names: genericNames, batch });
      return;
    }
    await runGenerate(batch);
  };

  const copyEmail = async (e: SavedDraft) => {
    const text = `Subject: ${e.subject}\n\n${e.body}\n\n${signatureBlock}`;
    await navigator.clipboard.writeText(text);
    toast({ title: "Copied to clipboard" });
  };


  const findRecipientForDraft = (d: SavedDraft): Recipient | undefined =>
    recipients.find(r => r.id === d.recipient_id) ??
    recipients.find(
      r =>
        r.name.trim().toLowerCase() === d.recipient_name.trim().toLowerCase() &&
        r.company.trim().toLowerCase() === (d.company || "").trim().toLowerCase()
    );

  const updateDraftStatus = async (d: SavedDraft, status: DraftStatus) => {
    if (!userId) return;
    try {
      let crmContactId: string | null = d.crm_contact_id;

      // On first "sent", push into the CRM if we have an email.
      if (status === "sent" && !crmContactId) {
        const rec = findRecipientForDraft(d);
        const email = rec?.email?.trim();
        if (email) {
          const { data: crmRow, error: crmErr } = await (supabase as any)
            .from("crm_contacts")
            .upsert(
              {
                email,
                name: d.recipient_name || rec?.name || null,
                company: d.company || rec?.company || null,
                job_title: d.recipient_role || rec?.role || null,
                source: "outreach",
                source_table: "outreach_drafts",
                source_record_id: d.id,
                status: "contacted",
                last_contacted_at: new Date().toISOString(),
                tags: ["outreach"],
              },
              { onConflict: "email" }
            )
            .select("id")
            .single();
          if (crmErr) {
            console.error("CRM upsert failed", crmErr);
            toast({ title: "Draft marked sent — CRM sync failed", description: crmErr.message, variant: "destructive" });
          } else if (crmRow) {
            crmContactId = crmRow.id;
          }
        } else {
          toast({
            title: "Marked sent (no CRM link)",
            description: "Add an email to the recipient to auto-log this contact in the CRM.",
          });
        }
      }

      const patch: any = {
        status,
        sent_at: status === "sent" ? d.sent_at ?? new Date().toISOString() : d.sent_at,
        crm_contact_id: crmContactId,
      };
      const { data: updated, error } = await (supabase as any)
        .from("outreach_drafts")
        .update(patch)
        .eq("id", d.id)
        .select()
        .single();
      if (error) throw error;
      setDrafts(prev => prev.map(x => (x.id === d.id ? (updated as SavedDraft) : x)));
    } catch (err: any) {
      toast({ title: "Update failed", description: err.message ?? "Please try again.", variant: "destructive" });
    }
  };

  const deleteDraft = async (d: SavedDraft) => {
    try {
      const { error } = await (supabase as any).from("outreach_drafts").delete().eq("id", d.id);
      if (error) throw error;
      setDrafts(prev => prev.filter(x => x.id !== d.id));
    } catch (err: any) {
      toast({ title: "Delete failed", description: err.message, variant: "destructive" });
    }
  };

  // Save reply text + sentiment and flip status to "replied".
  const saveReply = async () => {
    if (!replyDialog || !userId) return;
    const d = replyDialog;
    try {
      const patch: any = {
        status: "replied" as DraftStatus,
        replied_at: new Date().toISOString(),
        reply_text: replyText.trim() || null,
        reply_sentiment: replySentiment,
      };
      const { data: updated, error } = await (supabase as any)
        .from("outreach_drafts")
        .update(patch)
        .eq("id", d.id)
        .select()
        .single();
      if (error) throw error;
      setDrafts(prev => prev.map(x => (x.id === d.id ? (updated as SavedDraft) : x)));

      // Nudge the CRM row (if any) to reflect the reply.
      if (d.crm_contact_id) {
        const stageMap: Record<ReplySentiment, string> = {
          meeting_booked: "qualified",
          positive: "qualified",
          neutral: "contacted",
          negative: "lost",
          no_thanks: "lost",
        };
        await (supabase as any)
          .from("crm_contacts")
          .update({
            status: stageMap[replySentiment],
            last_contacted_at: new Date().toISOString(),
          })
          .eq("id", d.crm_contact_id);
      }

      setReplyDialog(null);
      setReplyText("");
      setReplySentiment("neutral");
      toast({ title: "Reply logged" });
    } catch (err: any) {
      toast({ title: "Failed to save reply", description: err.message, variant: "destructive" });
    }
  };

  // Draft a follow-up email for a specific "sent" draft that hasn't been replied to.
  const generateFollowUp = async (d: SavedDraft) => {
    if (!userId) return;
    const rec = findRecipientForDraft(d);
    const recipientPayload = {
      name: d.recipient_name || rec?.name || "",
      role: d.recipient_role || rec?.role || "",
      company: d.company || rec?.company || "",
      context: rec?.context || "",
    };
    if (!recipientPayload.name || !recipientPayload.role) {
      toast({ title: "Missing recipient details", description: "Restore the original recipient row to draft a follow-up.", variant: "destructive" });
      return;
    }
    setFollowUpBusyId(d.id);
    try {
      const sentDate = d.sent_at ? new Date(d.sent_at) : new Date(d.created_at);
      const sentDaysAgo = Math.max(1, Math.round((Date.now() - sentDate.getTime()) / (1000 * 60 * 60 * 24)));
      const { data, error } = await supabase.functions.invoke("generate-outreach", {
        body: {
          recipients: [recipientPayload],
          mode: "follow_up",
          originalSubject: d.subject,
          originalBody: d.body,
          sentDaysAgo,
        },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      const emails = data?.emails ?? [];
      if (emails.length === 0) throw new Error("No follow-up returned");
      const e = emails[0];

      const { data: inserted, error: insertErr } = await (supabase as any)
        .from("outreach_drafts")
        .insert({
          user_id: userId,
          recipient_id: d.recipient_id,
          recipient_name: e.recipient_name || d.recipient_name,
          recipient_role: e.recipient_role || d.recipient_role,
          company: e.company || d.company,
          subject: e.subject,
          body: e.body,
          status: "draft" as DraftStatus,
          parent_draft_id: d.id,
          is_follow_up: true,
        })
        .select()
        .single();
      if (insertErr) throw insertErr;
      setDrafts(prev => [inserted as SavedDraft, ...prev]);
      toast({ title: "Follow-up drafted", description: "Review it in the drafts log." });
    } catch (err: any) {
      toast({ title: "Follow-up failed", description: err.message ?? "Please try again.", variant: "destructive" });
    } finally {
      setFollowUpBusyId(null);
    }
  };

  // Analytics summary for the drafts log (deduped-by-draft — one row per email).
  const analytics = (() => {
    const total = drafts.length;
    const sent = drafts.filter(d => d.status === "sent" || d.status === "replied").length;
    const replied = drafts.filter(d => d.status === "replied").length;
    const followUps = drafts.filter(d => d.is_follow_up).length;
    const replyRate = sent > 0 ? Math.round((replied / sent) * 100) : 0;
    const now = Date.now();
    const needsFollowUp = drafts.filter(d => {
      if (d.status !== "sent") return false;
      // exclude drafts that already have a follow-up drafted against them
      const hasChild = drafts.some(x => x.parent_draft_id === d.id);
      if (hasChild) return false;
      const sentAt = d.sent_at ? new Date(d.sent_at).getTime() : new Date(d.created_at).getTime();
      return now - sentAt > 7 * 24 * 60 * 60 * 1000;
    }).length;
    return { total, sent, replied, followUps, replyRate, needsFollowUp };
  })();

  // --- Draft quality scoring (client-side heuristics) ---
  const BANNED_PHRASES = [
    "hope this finds you well", "hope this email finds you", "quick call", "circle back",
    "touch base", "reach out", "just wanted to", "checking in", "services", "packages",
    "solutions", "leverage", "synergy", "unlock", "empower", "transform", "excited", "delighted",
  ];
  const scoreDraft = (subject: string, body: string): string[] => {
    const issues: string[] = [];
    const words = body.trim().split(/\s+/).filter(Boolean).length;
    if (words > 140) issues.push(`Too long — ${words} words (aim ≤ 140)`);
    if (words > 0 && words < 40) issues.push(`Too short — ${words} words`);
    if (!/EAI|Executive Alignment Index/i.test(body)) issues.push("Missing EAI™ reference");
    const hay = `${subject} ${body}`.toLowerCase();
    const hits = BANNED_PHRASES.filter(p => hay.includes(p));
    if (hits.length > 0) issues.push(`Banned phrase${hits.length === 1 ? "" : "s"}: "${hits.join("\", \"")}"`);
    const subjWords = subject.trim().split(/\s+/).filter(Boolean).length;
    if (subjWords > 9) issues.push(`Subject too long — ${subjWords} words (aim ≤ 7)`);
    return issues;
  };

  // --- 30-day activity + role breakdown for the Insights panel ---
  const insights = (() => {
    const now = new Date();
    const days: { label: string; sent: number; replied: number }[] = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      d.setHours(0, 0, 0, 0);
      days.push({ label: d.toISOString().slice(5, 10), sent: 0, replied: 0 });
    }
    const cutoff = new Date(now);
    cutoff.setDate(now.getDate() - 29);
    cutoff.setHours(0, 0, 0, 0);
    const dayIndex = (iso: string | null | undefined) => {
      if (!iso) return -1;
      const t = new Date(iso);
      t.setHours(0, 0, 0, 0);
      const diff = Math.round((t.getTime() - cutoff.getTime()) / (1000 * 60 * 60 * 24));
      return diff >= 0 && diff < 30 ? diff : -1;
    };
    for (const d of drafts) {
      if (d.status === "sent" || d.status === "replied") {
        const idx = dayIndex(d.sent_at ?? d.created_at);
        if (idx >= 0) days[idx].sent += 1;
      }
      if (d.status === "replied") {
        const idx = dayIndex(d.replied_at ?? d.sent_at ?? d.created_at);
        if (idx >= 0) days[idx].replied += 1;
      }
    }
    const maxBar = Math.max(1, ...days.map(x => x.sent));

    // Role bucketing: normalise arbitrary titles into governance categories.
    const roleBucket = (raw: string): string => {
      const r = raw.toLowerCase();
      if (r.includes("nomination")) return "Nominations";
      if (r.includes("senior independent") || r === "sid" || r.includes(" sid")) return "SID";
      if (r.includes("chair")) return "Chair";
      if (r.includes("non-exec") || r.includes("non exec") || r.includes("ned")) return "NED";
      if (r.includes("ceo")) return "CEO";
      if (r.includes("cfo")) return "CFO";
      return "Other";
    };
    const byRole = new Map<string, { sent: number; replied: number }>();
    for (const d of drafts) {
      const bucket = roleBucket(d.recipient_role || "");
      const row = byRole.get(bucket) ?? { sent: 0, replied: 0 };
      if (d.status === "sent" || d.status === "replied") row.sent += 1;
      if (d.status === "replied") row.replied += 1;
      byRole.set(bucket, row);
    }
    const roles = Array.from(byRole.entries())
      .map(([role, r]) => ({ role, ...r, rate: r.sent > 0 ? Math.round((r.replied / r.sent) * 100) : 0 }))
      .filter(r => r.sent > 0)
      .sort((a, b) => b.sent - a.sent);

    return { days, maxBar, roles };
  })();





  const exportCsv = () => {
    if (drafts.length === 0) return;
    const esc = (s: string) => `"${(s ?? "").replace(/"/g, '""')}"`;
    const rows = [
      ["Recipient", "Role", "Company", "Subject", "Body"].map(esc).join(","),
      ...drafts.map(d => [d.recipient_name, d.recipient_role, d.company, d.subject, d.body].map(esc).join(",")),
    ].join("\n");
    const blob = new Blob([rows], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `outreach-drafts-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportRecipientsCsv = () => {
    const valid = recipients.filter(r => r.name.trim() || r.role.trim() || r.company.trim() || r.context.trim());
    if (valid.length === 0) {
      toast({ title: "Nothing to export", description: "Add at least one recipient first.", variant: "destructive" });
      return;
    }
    const esc = (s: string) => `"${(s ?? "").replace(/"/g, '""')}"`;
    const header = ["Name", "Role", "Company", "Context", "Priority", "Context Warning"].map(esc).join(",");
    const rows = valid.map(r =>
      [r.name, r.role, r.company, r.context, r.priority ? "Yes" : "No", contextIssue(r.context) ?? ""].map(esc).join(",")
    );
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `outreach-recipients-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Recipients exported", description: `${valid.length} row${valid.length === 1 ? "" : "s"} saved to CSV.` });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Link to="/admin" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mb-3">
              <ArrowLeft className="h-3.5 w-3.5" /> Back to admin
            </Link>
            <h1 className="font-serif text-3xl text-foreground">Outreach Drafts</h1>
            <p className="text-sm text-muted-foreground mt-2 max-w-2xl">
              Draft personalised approaches for Chairs, SIDs, and Nominations Committee heads. Each letter references the Executive Alignment Index™ and follows house voice.
            </p>
          </div>
        </div>

        <Card className="p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <h2 className="font-serif text-lg">Recipients</h2>
              {(() => {
                const flagged = recipients.filter(r => r.name.trim() && isGenericContext(r.context)).length;
                if (flagged === 0) return null;
                return (
                  <span className="inline-flex items-center gap-1 text-xs text-amber-700">
                    <AlertTriangle className="h-3 w-3" />
                    {flagged} generic context{flagged === 1 ? "" : "s"}
                  </span>
                );
              })()}
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 mr-2">
                <Filter className="h-3.5 w-3.5 text-muted-foreground" />
                <Label htmlFor="generic-filter" className="text-xs text-muted-foreground cursor-pointer">
                  Show only flagged
                </Label>
                <Switch
                  id="generic-filter"
                  checked={showOnlyGeneric}
                  onCheckedChange={setShowOnlyGeneric}
                  aria-label="Show only recipients with generic context warnings"
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => { setSenderDraft(sender); setSenderDialogOpen(true); }}
                title="Set the sender identity and signature block appended to every copied draft"
              >
                <PenLine className="h-3.5 w-3.5 mr-1" /> Signature
                {!sender.name && !sender.signature && (
                  <span className="ml-1.5 inline-block h-1.5 w-1.5 rounded-full bg-amber-500" aria-label="Signature not configured" />
                )}
              </Button>
              <Button variant="outline" size="sm" onClick={exportRecipientsCsv}>
                <Download className="h-3.5 w-3.5 mr-1" /> Export CSV
              </Button>
              <Button variant="outline" size="sm" onClick={addRecipient}>
                <Plus className="h-3.5 w-3.5 mr-1" /> Add
              </Button>
            </div>
          </div>

          {(() => {
            const flagged = recipients
              .map((r, i) => ({ r, i }))
              .filter(({ r }) => r.name.trim() && contextIssue(r.context));
            if (flagged.length === 0) return null;
            const jumpTo = (id: string) => {
              const el = document.getElementById(`recipient-row-${id}`);
              if (!el) return;
              el.scrollIntoView({ behavior: "smooth", block: "center" });
              const input = el.querySelector<HTMLInputElement>('input[placeholder^="Optional context"]');
              input?.focus();
              el.classList.add("ring-2", "ring-amber-500/50", "rounded-md");
              setTimeout(() => el.classList.remove("ring-2", "ring-amber-500/50", "rounded-md"), 1600);
            };
            return (
              <div className="mb-4 rounded-md border border-amber-500/40 bg-amber-50/60 p-3">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-3.5 w-3.5 text-amber-700" />
                  <p className="text-xs font-medium text-amber-800">
                    {flagged.length} recipient{flagged.length === 1 ? "" : "s"} flagged as generic — review before generating
                  </p>
                </div>
                <ul className="space-y-1">
                  {flagged.map(({ r, i }) => (
                    <li key={r.id} className="flex items-baseline gap-2 text-[11px] leading-snug">
                      <button
                        type="button"
                        onClick={() => jumpTo(r.id)}
                        className="text-primary hover:underline decoration-dotted underline-offset-2 shrink-0"
                        title="Jump to this row"
                      >
                        #{i + 1} {r.name || "Unnamed"}{r.company ? ` — ${r.company}` : ""}
                        {r.priority ? " ★" : ""}
                      </button>
                      <span className="text-amber-700">{contextIssue(r.context)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })()}

          <div className="space-y-3">
            {recipients
              .filter(r => !showOnlyGeneric || (r.name.trim() && isGenericContext(r.context)))
              .map((r, i) => (
              <div key={r.id} id={`recipient-row-${r.id}`} className="grid grid-cols-1 md:grid-cols-[auto_1.2fr_1.4fr_1.4fr_1.4fr_2fr_auto] gap-2 items-start scroll-mt-24 transition-shadow">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => updateRecipient(r.id, { priority: !r.priority })}
                  title={r.priority ? "Priority — will be included in generation" : "Flag as priority"}
                  aria-label={r.priority ? "Unflag priority" : "Flag as priority"}
                >
                  <Star className={`h-4 w-4 ${r.priority ? "fill-primary text-primary" : "text-muted-foreground"}`} />
                </Button>
                <Input placeholder="Name" value={r.name} onChange={e => updateRecipient(r.id, { name: e.target.value })} />
                <Input placeholder="Role" list={`roles-${i}`} value={r.role} onChange={e => updateRecipient(r.id, { role: e.target.value })} />
                <datalist id={`roles-${i}`}>
                  {ROLE_PRESETS.map(p => <option key={p} value={p} />)}
                </datalist>
                <Input placeholder="Company" value={r.company} onChange={e => updateRecipient(r.id, { company: e.target.value })} />
                <Input
                  type="email"
                  placeholder="Email (for CRM link)"
                  value={r.email}
                  onChange={e => updateRecipient(r.id, { email: e.target.value })}
                  title="Optional — required to auto-log this contact to the CRM when a draft is marked sent"
                />
                <div className="relative">
                  <Input
                    placeholder="Optional context (sector, recent event)"
                    value={r.context}
                    onChange={e => updateRecipient(r.id, { context: e.target.value })}
                    className={r.name.trim() && isGenericContext(r.context) ? "border-amber-500/60 pr-8" : "pr-2"}
                    aria-invalid={r.name.trim() ? isGenericContext(r.context) : undefined}
                    aria-describedby={`ctx-hint-${r.id}`}
                  />
                  {r.name.trim() && isGenericContext(r.context) && (
                    <span
                      className="absolute right-2 top-[14px] pointer-events-none"
                      title={contextIssue(r.context) ?? "Context looks generic"}
                    >
                      <AlertTriangle
                        className="h-3.5 w-3.5 text-amber-600"
                        aria-label={contextIssue(r.context) ?? "Context looks generic"}
                      />
                    </span>
                  )}
                  {r.name.trim() && contextIssue(r.context) && (
                    <div id={`ctx-hint-${r.id}`} role="status" aria-live="polite" className="mt-1 space-y-1.5">
                      <p className="text-[11px] leading-snug text-amber-700 inline-flex items-start gap-1 m-0">
                        <AlertTriangle className="h-3.5 w-3.5 text-amber-600 shrink-0 mt-0.5" aria-hidden="true" />
                        {contextIssue(r.context)}
                      </p>
                      <div className="pl-4 border-l border-amber-500/30 space-y-1">
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Suggested rewrites — click to apply</p>
                        {suggestContextRewrites(r).map((prompt, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => updateRecipient(r.id, { context: prompt })}
                            className="block text-left text-[11px] leading-snug text-primary hover:text-primary/80 hover:underline decoration-dotted underline-offset-2"
                            title="Apply this rewrite and re-validate"
                          >
                            → {prompt}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <Button variant="ghost" size="icon" onClick={() => removeRecipient(r.id)} disabled={recipients.length <= 1}>
                  <Trash2 className="h-4 w-4 text-muted-foreground" />
                </Button>
              </div>
            ))}
            {showOnlyGeneric && recipients.filter(r => r.name.trim() && isGenericContext(r.context)).length === 0 && (
              <p className="text-sm text-muted-foreground py-4">No generic-context warnings. All recipients look specific.</p>
            )}
          </div>

          <div className="mt-6 pt-6 border-t border-border space-y-6">
            <div>
              <Label className="text-xs uppercase tracking-wide text-muted-foreground">Upload Apollo CSV</Label>
              <p className="text-xs text-muted-foreground mt-1">
                Accepts Apollo exports directly. Name, Title, and Company columns are auto-mapped. Industry/Keywords are used as context.
              </p>
              <div className="mt-2 flex items-center gap-2">
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,text/csv"
                  onChange={handleFileUpload}
                  className="text-sm file:mr-3 file:py-1 file:px-2 file:rounded file:border-0 file:bg-muted file:text-foreground hover:file:bg-muted/80"
                />
              </div>
            </div>

            {csvPreview && csvPreview.length > 0 && (
              <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                <h3 className="font-serif text-sm">CSV preview ({csvPreview.length} rows)</h3>
                <div className="max-h-60 overflow-auto border border-border rounded bg-background">
                  <table className="w-full text-xs">
                    <thead className="bg-muted sticky top-0">
                      <tr>
                        <th className="text-left p-2 font-medium">Name</th>
                        <th className="text-left p-2 font-medium">Role</th>
                        <th className="text-left p-2 font-medium">Company</th>
                        <th className="text-left p-2 font-medium">Context</th>
                      </tr>
                    </thead>
                    <tbody>
                      {csvPreview.map(r => (
                        <tr key={r.id} className="border-t border-border">
                          <td className="p-2">{r.name}</td>
                          <td className="p-2">{r.role}</td>
                          <td className="p-2">{r.company}</td>
                          <td className="p-2 text-muted-foreground truncate max-w-[200px]">{r.context}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={confirmCsvImport}>Confirm import</Button>
                  <Button size="sm" variant="outline" onClick={cancelCsvImport}>Cancel</Button>
                </div>
              </div>
            )}

            <div>
              <Label className="text-xs uppercase tracking-wide text-muted-foreground">Or bulk paste (one per line: Name | Role | Company | context)</Label>
              <Textarea
                className="mt-2 font-mono text-xs"
                rows={4}
                placeholder={"Jane Whitmore | Chair | Meridian Group plc | infrastructure, recent CEO transition\nDavid Ellis | Senior Independent Director | Halevy Holdings"}
                value={bulkPaste}
                onChange={e => setBulkPaste(e.target.value)}
              />
              <Button variant="outline" size="sm" className="mt-2" onClick={parseBulk} disabled={!bulkPaste.trim()}>
                Replace list with pasted rows
              </Button>
            </div>
          </div>

          <div className="mt-6">
            <Label className="text-xs uppercase tracking-wide text-muted-foreground">Optional notes for the batch</Label>
            <Textarea
              className="mt-2"
              rows={2}
              placeholder="e.g. Reference the recent uptick in board-level scrutiny following AGM season"
              value={notes}
              onChange={e => setNotes(e.target.value)}
            />
          </div>

          <div className="mt-6 flex items-center justify-between gap-4 flex-wrap">
            {(() => {
              const validCount = recipients.filter(r => r.name.trim() && r.role.trim()).length;
              const flaggedCount = recipients.filter(r => r.priority && r.name.trim() && r.role.trim()).length;
              return (
                <p className="text-xs text-muted-foreground">
                  {flaggedCount > 0
                    ? <><span className="text-foreground font-medium">{flaggedCount} priority</span> of {validCount} valid · only starred contacts will be drafted</>
                    : <>{validCount} valid · max 20 per batch · star your top 10–15 to draft only those</>}
                </p>
              );
            })()}
            <Button onClick={generate} disabled={generating}>
              {generating ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Drafting…</> : "Generate drafts"}
            </Button>
          </div>
        </Card>

        {drafts.length > 0 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              <div className="rounded-lg border border-border bg-card p-3">
                <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                  <BarChart3 className="h-3.5 w-3.5" />
                  <span className="text-[10px] font-medium uppercase tracking-wider">Drafts</span>
                </div>
                <p className="text-xl font-semibold text-foreground">{analytics.total}</p>
              </div>
              <div className="rounded-lg border border-border bg-card p-3">
                <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                  <MailCheck className="h-3.5 w-3.5" />
                  <span className="text-[10px] font-medium uppercase tracking-wider">Sent</span>
                </div>
                <p className="text-xl font-semibold text-foreground">{analytics.sent}</p>
              </div>
              <div className="rounded-lg border border-border bg-card p-3">
                <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                  <Reply className="h-3.5 w-3.5" />
                  <span className="text-[10px] font-medium uppercase tracking-wider">Replied</span>
                </div>
                <p className="text-xl font-semibold text-foreground">{analytics.replied}</p>
              </div>
              <div className="rounded-lg border border-border bg-card p-3">
                <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                  <span className="text-[10px] font-medium uppercase tracking-wider">Reply rate</span>
                </div>
                <p className="text-xl font-semibold text-foreground">{analytics.replyRate}%</p>
              </div>
              <div className="rounded-lg border border-border bg-card p-3">
                <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                  <Send className="h-3.5 w-3.5" />
                  <span className="text-[10px] font-medium uppercase tracking-wider">Follow-up due</span>
                </div>
                <p className={`text-xl font-semibold ${analytics.needsFollowUp > 0 ? "text-amber-700" : "text-foreground"}`}>
                  {analytics.needsFollowUp}
                </p>
              </div>
            </div>

            {(insights.days.some(d => d.sent > 0) || insights.roles.length > 0) && (
              <Card className="p-5">
                <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr] gap-6">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">
                      Sends · last 30 days
                    </p>
                    <div className="flex items-end gap-[3px] h-20">
                      {insights.days.map((d, i) => {
                        const h = d.sent === 0 ? 3 : Math.max(6, Math.round((d.sent / insights.maxBar) * 76));
                        const repH = d.replied === 0 ? 0 : Math.max(3, Math.round((d.replied / insights.maxBar) * 76));
                        return (
                          <div
                            key={i}
                            className="flex-1 flex flex-col justify-end items-stretch"
                            title={`${d.label} — ${d.sent} sent · ${d.replied} replied`}
                          >
                            <div className="bg-primary/25" style={{ height: `${h - repH}px` }} />
                            {repH > 0 && <div className="bg-primary" style={{ height: `${repH}px` }} />}
                          </div>
                        );
                      })}
                    </div>
                    <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                      <span>{insights.days[0].label}</span>
                      <span className="flex items-center gap-3">
                        <span className="inline-flex items-center gap-1"><span className="inline-block h-2 w-2 bg-primary/25" /> sent</span>
                        <span className="inline-flex items-center gap-1"><span className="inline-block h-2 w-2 bg-primary" /> replied</span>
                      </span>
                      <span>{insights.days[insights.days.length - 1].label}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">
                      Reply rate by role
                    </p>
                    {insights.roles.length === 0 ? (
                      <p className="text-xs text-muted-foreground">No sent drafts yet.</p>
                    ) : (
                      <table className="w-full text-xs">
                        <tbody>
                          {insights.roles.map(r => (
                            <tr key={r.role} className="border-b border-border/60 last:border-0">
                              <td className="py-1.5 text-foreground">{r.role}</td>
                              <td className="py-1.5 text-muted-foreground text-right w-16">{r.replied}/{r.sent}</td>
                              <td className="py-1.5 text-right w-14">
                                <span className={`font-medium ${r.rate >= 20 ? "text-emerald-700" : r.rate >= 10 ? "text-foreground" : "text-muted-foreground"}`}>
                                  {r.rate}%
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              </Card>
            )}


            <div className="flex items-center justify-between">
              <h2 className="font-serif text-xl">Drafts ({drafts.length})</h2>
              <Button variant="outline" size="sm" onClick={exportCsv}>
                <Download className="h-3.5 w-3.5 mr-1" /> Export CSV
              </Button>
            </div>
            {drafts.map((d) => {
              const rec = findRecipientForDraft(d);
              const hasEmail = !!(rec?.email?.trim());
              const sentAt = d.sent_at ? new Date(d.sent_at).getTime() : new Date(d.created_at).getTime();
              const daysSinceSent = Math.floor((Date.now() - sentAt) / (1000 * 60 * 60 * 24));
              const hasChildFollowUp = drafts.some(x => x.parent_draft_id === d.id);
              const followUpEligible = d.status === "sent" && daysSinceSent >= 7 && !hasChildFollowUp;
              const statusStyle =
                d.status === "sent"
                  ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                  : d.status === "replied"
                  ? "bg-blue-100 text-blue-800 border-blue-300"
                  : "bg-muted text-muted-foreground border-border";
              return (
                <Card key={d.id} className="p-6">
                  <div className="flex items-start justify-between mb-3 gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">
                        {d.recipient_role}{d.company ? ` · ${d.company}` : ""}
                      </p>
                      <h3 className="font-serif text-base mt-0.5">
                        {d.recipient_name}
                        {rec?.email && <span className="text-xs text-muted-foreground font-sans ml-2">· {rec.email}</span>}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap justify-end">
                      {d.is_follow_up && (
                        <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border bg-amber-50 text-amber-800 border-amber-300">
                          <Send className="h-3 w-3" /> Follow-up
                        </span>
                      )}
                      <span className={`inline-flex items-center gap-1 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border ${statusStyle}`}>
                        {d.status === "sent" && <CheckCircle2 className="h-3 w-3" />}
                        {d.status}
                        {d.crm_contact_id && <span className="ml-1 opacity-70">· CRM</span>}
                      </span>
                      <Button variant="ghost" size="sm" onClick={() => copyEmail(d)}>
                        <Copy className="h-3.5 w-3.5 mr-1" /> Copy
                      </Button>
                      {d.status !== "sent" && d.status !== "replied" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateDraftStatus(d, "sent")}
                          title={hasEmail ? "Marks as sent and logs the contact to your CRM" : "Add an email to auto-log to CRM; will still mark sent"}
                        >
                          <MailCheck className="h-3.5 w-3.5 mr-1" /> Mark sent
                        </Button>
                      )}
                      {followUpEligible && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => generateFollowUp(d)}
                          disabled={followUpBusyId === d.id}
                          title={`Sent ${daysSinceSent} days ago — draft a shorter second touch`}
                        >
                          {followUpBusyId === d.id
                            ? <><Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" /> Drafting…</>
                            : <><Send className="h-3.5 w-3.5 mr-1" /> Draft follow-up</>}
                        </Button>
                      )}
                      {d.status === "sent" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setReplyText("");
                            setReplySentiment("neutral");
                            setReplyDialog(d);
                          }}
                        >
                          <Reply className="h-3.5 w-3.5 mr-1" /> Log reply
                        </Button>
                      )}
                      <Button variant="ghost" size="icon" onClick={() => deleteDraft(d)} title="Delete draft">
                        <Trash2 className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </div>
                  </div>
                  {(() => {
                    const issues = scoreDraft(d.subject, d.body);
                    if (issues.length === 0) return null;
                    return (
                      <div className="mb-3 rounded-md border border-amber-500/40 bg-amber-50/60 p-2.5">
                        <div className="flex items-center gap-1.5 mb-1">
                          <ShieldAlert className="h-3.5 w-3.5 text-amber-700" />
                          <p className="text-[11px] font-medium text-amber-800 uppercase tracking-wider">
                            Quality — {issues.length} issue{issues.length === 1 ? "" : "s"}
                          </p>
                        </div>
                        <ul className="text-[11px] leading-snug text-amber-800 pl-4 list-disc space-y-0.5">
                          {issues.map(iss => <li key={iss}>{iss}</li>)}
                        </ul>
                      </div>
                    );
                  })()}
                  <div className="border-l-2 border-border pl-4">
                    <p className="text-sm font-medium text-foreground mb-2">Subject: {d.subject}</p>
                    <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">{d.body}</p>
                    <p className="text-sm text-muted-foreground mt-3 whitespace-pre-wrap">{signatureBlock}</p>
                  </div>
                  {d.status === "replied" && (d.reply_text || d.reply_sentiment) && (
                    <div className="mt-4 rounded-md border border-blue-200 bg-blue-50/50 p-3">
                      <p className="text-[10px] uppercase tracking-wider text-blue-900 mb-1">
                        Reply logged{d.replied_at ? ` · ${new Date(d.replied_at).toLocaleDateString()}` : ""}
                        {d.reply_sentiment ? ` · ${d.reply_sentiment.replace("_", " ")}` : ""}
                      </p>
                      {d.reply_text && <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">{d.reply_text}</p>}
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        )}



      </main>
      <Footer />

      <AlertDialog open={!!genericWarning} onOpenChange={(open) => { if (!open) setGenericWarning(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-serif flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              {genericWarning?.names.length} recipient{genericWarning && genericWarning.names.length === 1 ? "" : "s"} lack specific context
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-3 text-sm">
                <p>
                  The Context field for the following recipient{genericWarning && genericWarning.names.length === 1 ? " reads" : "s reads"} as a generic industry keyword dump rather than a board-level observation. Drafts will default to formulaic sector language.
                </p>
                <ul className="text-xs text-muted-foreground list-disc pl-5 max-h-40 overflow-auto">
                  {genericWarning?.names.slice(0, 12).map(n => <li key={n}>{n}</li>)}
                  {genericWarning && genericWarning.names.length > 12 && (
                    <li className="italic">…and {genericWarning.names.length - 12} more</li>
                  )}
                </ul>
                <p className="text-xs text-muted-foreground">
                  Recommended: add one specific line each — e.g. <em>"New Chair appointed following 2024 governance review"</em> or <em>"CEO transition announced Q1 2026"</em>.
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setGenericWarning(null)}>Edit context</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                const batch = genericWarning?.batch ?? [];
                setGenericWarning(null);
                if (batch.length > 0) await runGenerate(batch);
              }}
            >
              Generate anyway
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={senderDialogOpen} onOpenChange={setSenderDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-serif flex items-center gap-2">
              <PenLine className="h-4 w-4" /> Sender identity & signature
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-3 text-sm">
                <p className="text-xs text-muted-foreground">
                  Appended to every draft on screen and when you copy to clipboard. Stored locally on this browser.
                </p>
                <div>
                  <Label className="text-xs uppercase tracking-wide text-muted-foreground">Name</Label>
                  <Input
                    className="mt-1.5"
                    value={senderDraft.name}
                    onChange={e => setSenderDraft(p => ({ ...p, name: e.target.value }))}
                    placeholder="e.g. Jonathan Bright"
                  />
                </div>
                <div>
                  <Label className="text-xs uppercase tracking-wide text-muted-foreground">Title</Label>
                  <Input
                    className="mt-1.5"
                    value={senderDraft.title}
                    onChange={e => setSenderDraft(p => ({ ...p, title: e.target.value }))}
                    placeholder="e.g. Founder, Bright Leadership Consulting"
                  />
                </div>
                <div>
                  <Label className="text-xs uppercase tracking-wide text-muted-foreground">
                    Full signature block (optional — overrides the above)
                  </Label>
                  <Textarea
                    className="mt-1.5 font-mono text-xs"
                    rows={5}
                    value={senderDraft.signature}
                    onChange={e => setSenderDraft(p => ({ ...p, signature: e.target.value }))}
                    placeholder={"Jonathan Bright\nFounder, Bright Leadership Consulting\nbrightleadershipconsulting.com"}
                  />
                </div>
                <div className="rounded-md border border-border bg-muted/40 p-3">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Preview</p>
                  <pre className="text-xs text-foreground whitespace-pre-wrap font-sans">{
                    (senderDraft.signature.trim())
                      ? senderDraft.signature.trim()
                      : [
                          [senderDraft.name, senderDraft.title].filter(Boolean).join(", "),
                          "— Bright Leadership Consulting",
                        ].filter(Boolean).join("\n")
                  }</pre>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={saveSender}>Save signature</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!replyDialog} onOpenChange={(open) => { if (!open) setReplyDialog(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-serif flex items-center gap-2">
              <Reply className="h-4 w-4 text-blue-700" />
              Log reply from {replyDialog?.recipient_name}
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-3 text-sm">
                <p className="text-xs text-muted-foreground">
                  Records what came back so the CRM reflects real conversation state. Sentiment updates the linked CRM stage automatically.
                </p>
                <div>
                  <Label className="text-xs uppercase tracking-wide text-muted-foreground">Sentiment</Label>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {([
                      { key: "meeting_booked", label: "Meeting booked" },
                      { key: "positive", label: "Positive" },
                      { key: "neutral", label: "Neutral" },
                      { key: "negative", label: "Negative" },
                      { key: "no_thanks", label: "No, thanks" },
                    ] as { key: ReplySentiment; label: string }[]).map(opt => (
                      <button
                        key={opt.key}
                        type="button"
                        onClick={() => setReplySentiment(opt.key)}
                        className={`text-[11px] px-2.5 py-1 rounded-full border transition-colors ${
                          replySentiment === opt.key
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-background text-foreground border-border hover:border-primary/50"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <Label className="text-xs uppercase tracking-wide text-muted-foreground">Reply text (optional)</Label>
                  <Textarea
                    className="mt-2"
                    rows={5}
                    placeholder="Paste the reply here, or note the substance briefly."
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                  />
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setReplyDialog(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={saveReply}>Save reply</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminOutreach;
