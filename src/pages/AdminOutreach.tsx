import { useState, useRef } from "react";
import { Navigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Loader2, Plus, Trash2, Copy, Download, ArrowLeft, Star } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface Recipient {
  id: string;
  name: string;
  role: string;
  company: string;
  context: string;
  priority: boolean;
}

interface DraftedEmail {
  recipient_name: string;
  recipient_role: string;
  company: string;
  subject: string;
  body: string;
}

const emptyRecipient = (): Recipient => ({
  id: crypto.randomUUID(),
  name: "",
  role: "Chair",
  company: "",
  context: "",
  priority: false,
});

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
  const [drafts, setDrafts] = useState<DraftedEmail[]>([]);

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
  const removeRecipient = (id: string) => setRecipients(rs => rs.filter(r => r.id !== id));

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
          context: parts[3] || "",
          priority: false,
        };
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
      context: context.slice(0, 400),
      priority: false,
    };
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
    setGenerating(true);
    setDrafts([]);
    try {
      const { data, error } = await supabase.functions.invoke("generate-outreach", {
        body: { recipients: batch, notes },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      const emails: DraftedEmail[] = data?.emails ?? [];
      if (emails.length === 0) throw new Error("No drafts returned");
      setDrafts(emails);
      toast({ title: `Drafted ${emails.length} emails` });
    } catch (err: any) {
      toast({ title: "Generation failed", description: err.message ?? "Please try again.", variant: "destructive" });
    } finally {
      setGenerating(false);
    }
  };

  const copyEmail = async (e: DraftedEmail) => {
    const text = `Subject: ${e.subject}\n\n${e.body}\n\n— Bright Leadership Consulting`;
    await navigator.clipboard.writeText(text);
    toast({ title: "Copied to clipboard" });
  };

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
            <h2 className="font-serif text-lg">Recipients</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={addRecipient}>
                <Plus className="h-3.5 w-3.5 mr-1" /> Add
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            {recipients.map((r, i) => (
              <div key={r.id} className="grid grid-cols-1 md:grid-cols-[1.2fr_1.4fr_1.4fr_2fr_auto] gap-2 items-start">
                <Input placeholder="Name" value={r.name} onChange={e => updateRecipient(r.id, { name: e.target.value })} />
                <Input placeholder="Role" list={`roles-${i}`} value={r.role} onChange={e => updateRecipient(r.id, { role: e.target.value })} />
                <datalist id={`roles-${i}`}>
                  {ROLE_PRESETS.map(p => <option key={p} value={p} />)}
                </datalist>
                <Input placeholder="Company" value={r.company} onChange={e => updateRecipient(r.id, { company: e.target.value })} />
                <Input placeholder="Optional context (sector, recent event)" value={r.context} onChange={e => updateRecipient(r.id, { context: e.target.value })} />
                <Button variant="ghost" size="icon" onClick={() => removeRecipient(r.id)} disabled={recipients.length <= 1}>
                  <Trash2 className="h-4 w-4 text-muted-foreground" />
                </Button>
              </div>
            ))}
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

          <div className="mt-6 flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              {recipients.filter(r => r.name.trim() && r.role.trim()).length} valid · max 20 per batch
            </p>
            <Button onClick={generate} disabled={generating}>
              {generating ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Drafting…</> : "Generate drafts"}
            </Button>
          </div>
        </Card>

        {drafts.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-xl">Drafts ({drafts.length})</h2>
              <Button variant="outline" size="sm" onClick={exportCsv}>
                <Download className="h-3.5 w-3.5 mr-1" /> Export CSV
              </Button>
            </div>
            {drafts.map((d, i) => (
              <Card key={i} className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                      {d.recipient_role}{d.company ? ` · ${d.company}` : ""}
                    </p>
                    <h3 className="font-serif text-base mt-0.5">{d.recipient_name}</h3>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => copyEmail(d)}>
                    <Copy className="h-3.5 w-3.5 mr-1" /> Copy
                  </Button>
                </div>
                <div className="border-l-2 border-border pl-4">
                  <p className="text-sm font-medium text-foreground mb-2">Subject: {d.subject}</p>
                  <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">{d.body}</p>
                  <p className="text-sm text-muted-foreground mt-3">— Bright Leadership Consulting</p>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default AdminOutreach;
