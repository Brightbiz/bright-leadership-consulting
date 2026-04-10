import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Navigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { format } from "date-fns";
import {
  Users, RefreshCw, LogOut, Loader2, Search, Plus, Download, Upload,
  ArrowLeft, Edit, Trash2, X, Tag, Phone, Building2, Briefcase, Calendar,
  DollarSign, StickyNote, ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader,
  AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

type CrmStatus = "new" | "contacted" | "qualified" | "converted" | "lost";

interface CrmContact {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  company: string | null;
  job_title: string | null;
  source: string;
  source_table: string | null;
  status: CrmStatus;
  tags: string[];
  notes: string | null;
  deal_stage: string | null;
  estimated_value: number | null;
  next_follow_up: string | null;
  last_contacted_at: string | null;
  created_at: string;
  updated_at: string;
}

const STATUS_CONFIG: Record<CrmStatus, { label: string; color: string }> = {
  new: { label: "New", color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300" },
  contacted: { label: "Contacted", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300" },
  qualified: { label: "Qualified", color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300" },
  converted: { label: "Converted", color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" },
  lost: { label: "Lost", color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300" },
};

const SOURCE_LABELS: Record<string, string> = {
  contact_form: "Contact Form",
  newsletter: "Newsletter",
  lead_magnet: "Lead Magnet",
  readiness_quiz: "Readiness Quiz",
  workbook: "Workbook",
  manual: "Manual Entry",
  csv_import: "CSV Import",
};

const AdminCRM = () => {
  const { user, isAdmin, isLoading: authLoading, signOut } = useAdminAuth();
  const [contacts, setContacts] = useState<CrmContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedContact, setSelectedContact] = useState<CrmContact | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState<Partial<CrmContact>>({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTagInput, setNewTagInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const fetchContacts = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await (supabase as any)
        .from("crm_contacts")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      setContacts((data as CrmContact[]) || []);
    } catch (error) {
      console.error("Error fetching CRM contacts:", error);
      toast({ title: "Error loading contacts", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const syncLeads = async () => {
    setSyncing(true);
    try {
      const { data, error } = await supabase.rpc("sync_existing_leads_to_crm");
      if (error) throw error;
      toast({ title: "Sync complete", description: `${data} records processed.` });
      await fetchContacts();
    } catch (error) {
      console.error("Sync error:", error);
      toast({ title: "Sync failed", variant: "destructive" });
    } finally {
      setSyncing(false);
    }
  };

  useEffect(() => {
    if (user && isAdmin) fetchContacts();
  }, [user, isAdmin, fetchContacts]);

  const filteredContacts = useMemo(() => {
    let result = contacts;
    if (statusFilter !== "all") {
      result = result.filter((c) => c.status === statusFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          (c.name?.toLowerCase().includes(q)) ||
          c.email.toLowerCase().includes(q) ||
          (c.company?.toLowerCase().includes(q)) ||
          c.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return result;
  }, [contacts, statusFilter, searchQuery]);

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { all: contacts.length };
    for (const c of contacts) counts[c.status] = (counts[c.status] || 0) + 1;
    return counts;
  }, [contacts]);

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !isAdmin) return <Navigate to="/admin/login" replace />;

  const updateContact = async (id: string, updates: Record<string, unknown>) => {
    try {
      const { error } = await (supabase as any)
        .from("crm_contacts")
        .update(updates)
        .eq("id", id);
      if (error) throw error;
      setContacts((prev) =>
        prev.map((c) => (c.id === id ? { ...c, ...updates } as CrmContact : c))
      );
      if (selectedContact?.id === id) {
        setSelectedContact((prev) => prev ? { ...prev, ...updates } as CrmContact : null);
      }
      toast({ title: "Contact updated" });
    } catch {
      toast({ title: "Error updating contact", variant: "destructive" });
    }
  };

  const deleteContact = async (id: string) => {
    try {
      const { error } = await (supabase as any).from("crm_contacts").delete().eq("id", id);
      if (error) throw error;
      setContacts((prev) => prev.filter((c) => c.id !== id));
      setSelectedContact(null);
      toast({ title: "Contact deleted" });
    } catch {
      toast({ title: "Error deleting contact", variant: "destructive" });
    }
  };

  const addContact = async (contact: { name: string; email: string; phone?: string; company?: string; job_title?: string; notes?: string }) => {
    try {
      const { data, error } = await (supabase as any)
        .from("crm_contacts")
        .insert({ ...contact, source: "manual" })
        .select()
        .single();
      if (error) throw error;
      setContacts((prev) => [data as unknown as CrmContact, ...prev]);
      setShowAddForm(false);
      toast({ title: "Contact added" });
    } catch (error: any) {
      if (error?.code === "23505") {
        toast({ title: "Duplicate email", description: "A contact with this email already exists.", variant: "destructive" });
      } else {
        toast({ title: "Error adding contact", variant: "destructive" });
      }
    }
  };

  const saveEdit = async () => {
    if (!selectedContact) return;
    await updateContact(selectedContact.id, editForm);
    setEditMode(false);
  };

  const addTag = () => {
    if (!newTagInput.trim() || !selectedContact) return;
    const newTags = [...(editForm.tags || selectedContact.tags || []), newTagInput.trim()];
    setEditForm((prev) => ({ ...prev, tags: newTags }));
    setNewTagInput("");
  };

  const removeTag = (tag: string) => {
    const current = editForm.tags || selectedContact?.tags || [];
    setEditForm((prev) => ({ ...prev, tags: current.filter((t) => t !== tag) }));
  };

  // CSV Export
  const exportCsv = () => {
    const escape = (v: string) => `"${v.replace(/"/g, '""')}"`;
    const headers = ["Name", "Email", "Phone", "Company", "Job Title", "Source", "Status", "Tags", "Notes", "Deal Stage", "Estimated Value", "Next Follow-Up", "Last Contacted", "Created"];
    const rows = filteredContacts.map((c) => [
      c.name || "", c.email, c.phone || "", c.company || "", c.job_title || "",
      SOURCE_LABELS[c.source] || c.source, c.status, (c.tags || []).join("; "),
      c.notes || "", c.deal_stage || "", c.estimated_value?.toString() || "",
      c.next_follow_up ? format(new Date(c.next_follow_up), "yyyy-MM-dd") : "",
      c.last_contacted_at ? format(new Date(c.last_contacted_at), "yyyy-MM-dd") : "",
      format(new Date(c.created_at), "yyyy-MM-dd HH:mm"),
    ]);
    const csv = [headers.map(escape).join(","), ...rows.map((r) => r.map(escape).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `crm-contacts-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // CSV Import
  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    const lines = text.split("\n").filter((l) => l.trim());
    if (lines.length < 2) {
      toast({ title: "Invalid CSV", description: "File must have a header row and at least one data row.", variant: "destructive" });
      return;
    }

    const parseRow = (row: string): string[] => {
      const result: string[] = [];
      let current = "";
      let inQuotes = false;
      for (const char of row) {
        if (char === '"') { inQuotes = !inQuotes; }
        else if (char === "," && !inQuotes) { result.push(current.trim()); current = ""; }
        else { current += char; }
      }
      result.push(current.trim());
      return result;
    };

    const headers = parseRow(lines[0]).map((h) => h.toLowerCase().replace(/[^a-z_]/g, ""));
    const emailIdx = headers.findIndex((h) => h.includes("email"));
    if (emailIdx === -1) {
      toast({ title: "Missing email column", description: "CSV must contain an 'email' column.", variant: "destructive" });
      return;
    }

    const nameIdx = headers.findIndex((h) => h.includes("name") && !h.includes("lead") && !h.includes("magnet"));
    const phoneIdx = headers.findIndex((h) => h.includes("phone"));
    const companyIdx = headers.findIndex((h) => h.includes("company"));
    const jobIdx = headers.findIndex((h) => h.includes("job") || h.includes("title"));
    const notesIdx = headers.findIndex((h) => h.includes("note"));
    const tagsIdx = headers.findIndex((h) => h.includes("tag"));

    let imported = 0;
    let duplicates = 0;

    for (let i = 1; i < lines.length; i++) {
      const cols = parseRow(lines[i]);
      const email = cols[emailIdx]?.trim();
      if (!email) continue;

      const record: Record<string, unknown> = {
        email,
        source: "csv_import",
        name: nameIdx >= 0 ? cols[nameIdx] || null : null,
        phone: phoneIdx >= 0 ? cols[phoneIdx] || null : null,
        company: companyIdx >= 0 ? cols[companyIdx] || null : null,
        job_title: jobIdx >= 0 ? cols[jobIdx] || null : null,
        notes: notesIdx >= 0 ? cols[notesIdx] || null : null,
        tags: tagsIdx >= 0 && cols[tagsIdx] ? cols[tagsIdx].split(";").map((t: string) => t.trim()).filter(Boolean) : [],
      };

      const { error } = await (supabase as any).from("crm_contacts").insert(record);
      if (error?.code === "23505") { duplicates++; }
      else if (!error) { imported++; }
    }

    toast({
      title: "Import complete",
      description: `${imported} imported, ${duplicates} duplicates skipped.`,
    });
    if (imported > 0) await fetchContacts();
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const LoadingSkeleton = () => (
    <div className="p-6 space-y-4">
      {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <div className="container-narrow py-8 pt-28 flex-1">
        {/* Page Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Button asChild variant="ghost" size="sm">
              <Link to="/admin"><ArrowLeft className="mr-1 h-4 w-4" /> Dashboard</Link>
            </Button>
            <div>
              <h1 className="font-serif text-3xl font-semibold text-foreground">CRM</h1>
              <p className="text-sm text-muted-foreground">{contacts.length} total contacts</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button onClick={syncLeads} variant="outline" size="sm" disabled={syncing}>
              <RefreshCw className={`mr-2 h-4 w-4 ${syncing ? "animate-spin" : ""}`} />
              {syncing ? "Syncing…" : "Sync Leads"}
            </Button>
            <Button onClick={() => setShowAddForm(true)} size="sm">
              <Plus className="mr-2 h-4 w-4" /> Add Contact
            </Button>
            <Button onClick={exportCsv} variant="outline" size="sm" disabled={filteredContacts.length === 0}>
              <Download className="mr-2 h-4 w-4" /> Export
            </Button>
            <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
              <Upload className="mr-2 h-4 w-4" /> Import
            </Button>
            <input ref={fileInputRef} type="file" accept=".csv" className="hidden" onChange={handleImport} />
            <Button onClick={signOut} variant="ghost" size="sm">
              <LogOut className="mr-2 h-4 w-4" /> Sign Out
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="mb-4 flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search name, email, company, tags…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Status Tabs */}
        <Tabs value={statusFilter} onValueChange={setStatusFilter} className="space-y-4">
          <TabsList className="flex-wrap h-auto gap-1">
            <TabsTrigger value="all">All ({statusCounts.all || 0})</TabsTrigger>
            {(Object.keys(STATUS_CONFIG) as CrmStatus[]).map((s) => (
              <TabsTrigger key={s} value={s}>
                {STATUS_CONFIG[s].label} ({statusCounts[s] || 0})
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="rounded-lg border border-border bg-card">
            {loading ? <LoadingSkeleton /> : filteredContacts.length === 0 ? (
              <div className="p-12 text-center">
                <Users className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
                <h3 className="text-lg font-medium text-foreground">No contacts found</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {contacts.length === 0 ? 'Click "Sync Leads" to import existing leads, or add contacts manually.' : "Try adjusting your search or filter."}
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead className="hidden md:table-cell">Company</TableHead>
                    <TableHead className="hidden lg:table-cell">Source</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden sm:table-cell">Tags</TableHead>
                    <TableHead className="hidden lg:table-cell">Created</TableHead>
                    <TableHead className="w-[40px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredContacts.map((contact) => (
                    <TableRow
                      key={contact.id}
                      className="cursor-pointer"
                      onClick={() => {
                        setSelectedContact(contact);
                        setEditMode(false);
                        setEditForm({});
                      }}
                    >
                      <TableCell className="font-medium">{contact.name || "—"}</TableCell>
                      <TableCell className="text-muted-foreground">{contact.email}</TableCell>
                      <TableCell className="hidden md:table-cell">{contact.company || "—"}</TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <Badge variant="outline" className="text-xs">{SOURCE_LABELS[contact.source] || contact.source}</Badge>
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_CONFIG[contact.status].color}`}>
                          {STATUS_CONFIG[contact.status].label}
                        </span>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <div className="flex flex-wrap gap-1">
                          {(contact.tags || []).slice(0, 2).map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                          ))}
                          {(contact.tags || []).length > 2 && (
                            <Badge variant="secondary" className="text-xs">+{contact.tags.length - 2}</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-muted-foreground text-sm">
                        {format(new Date(contact.created_at), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </Tabs>
      </div>
      <Footer />

      {/* Contact Detail Sheet */}
      <Sheet open={!!selectedContact} onOpenChange={(open) => { if (!open) { setSelectedContact(null); setEditMode(false); setEditForm({}); } }}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          {selectedContact && (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-center justify-between">
                  <span>{selectedContact.name || selectedContact.email}</span>
                </SheetTitle>
              </SheetHeader>

              <div className="mt-6 space-y-6">
                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Button variant={editMode ? "default" : "outline"} size="sm" onClick={() => {
                    if (editMode) { saveEdit(); } else { setEditMode(true); setEditForm({ ...selectedContact }); }
                  }}>
                    <Edit className="mr-2 h-4 w-4" /> {editMode ? "Save" : "Edit"}
                  </Button>
                  {editMode && (
                    <Button variant="ghost" size="sm" onClick={() => { setEditMode(false); setEditForm({}); }}>Cancel</Button>
                  )}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="text-destructive ml-auto"><Trash2 className="h-4 w-4" /></Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete contact?</AlertDialogTitle>
                        <AlertDialogDescription>This will permanently remove {selectedContact.name || selectedContact.email} from your CRM.</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deleteContact(selectedContact.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>

                {/* Status */}
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-1 block">Status</label>
                  {editMode ? (
                    <Select value={editForm.status || selectedContact.status} onValueChange={(v) => setEditForm((prev) => ({ ...prev, status: v as CrmStatus }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {(Object.keys(STATUS_CONFIG) as CrmStatus[]).map((s) => (
                          <SelectItem key={s} value={s}>{STATUS_CONFIG[s].label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-sm font-medium ${STATUS_CONFIG[selectedContact.status].color}`}>
                      {STATUS_CONFIG[selectedContact.status].label}
                    </span>
                  )}
                </div>

                {/* Contact Info */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-foreground">Contact Information</h3>
                  {editMode ? (
                    <div className="space-y-3">
                      <div><label className="text-xs text-muted-foreground">Name</label><Input value={editForm.name || ""} onChange={(e) => setEditForm((p) => ({ ...p, name: e.target.value }))} /></div>
                      <div><label className="text-xs text-muted-foreground">Email</label><Input value={editForm.email || ""} onChange={(e) => setEditForm((p) => ({ ...p, email: e.target.value }))} /></div>
                      <div><label className="text-xs text-muted-foreground">Phone</label><Input value={editForm.phone || ""} onChange={(e) => setEditForm((p) => ({ ...p, phone: e.target.value }))} /></div>
                      <div><label className="text-xs text-muted-foreground">Company</label><Input value={editForm.company || ""} onChange={(e) => setEditForm((p) => ({ ...p, company: e.target.value }))} /></div>
                      <div><label className="text-xs text-muted-foreground">Job Title</label><Input value={editForm.job_title || ""} onChange={(e) => setEditForm((p) => ({ ...p, job_title: e.target.value }))} /></div>
                    </div>
                  ) : (
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-muted-foreground" />{selectedContact.phone || "—"}</div>
                      <div className="flex items-center gap-2"><Building2 className="h-4 w-4 text-muted-foreground" />{selectedContact.company || "—"}</div>
                      <div className="flex items-center gap-2"><Briefcase className="h-4 w-4 text-muted-foreground" />{selectedContact.job_title || "—"}</div>
                    </div>
                  )}
                </div>

                {/* Deal Info */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-foreground">Deal Information</h3>
                  {editMode ? (
                    <div className="space-y-3">
                      <div><label className="text-xs text-muted-foreground">Deal Stage</label><Input value={editForm.deal_stage || ""} onChange={(e) => setEditForm((p) => ({ ...p, deal_stage: e.target.value }))} /></div>
                      <div><label className="text-xs text-muted-foreground">Estimated Value</label><Input type="number" value={editForm.estimated_value ?? ""} onChange={(e) => setEditForm((p) => ({ ...p, estimated_value: e.target.value ? parseFloat(e.target.value) : null }))} /></div>
                      <div><label className="text-xs text-muted-foreground">Next Follow-Up</label><Input type="date" value={editForm.next_follow_up ? editForm.next_follow_up.slice(0, 10) : ""} onChange={(e) => setEditForm((p) => ({ ...p, next_follow_up: e.target.value || null }))} /></div>
                      <div><label className="text-xs text-muted-foreground">Last Contacted</label><Input type="date" value={editForm.last_contacted_at ? editForm.last_contacted_at.slice(0, 10) : ""} onChange={(e) => setEditForm((p) => ({ ...p, last_contacted_at: e.target.value || null }))} /></div>
                    </div>
                  ) : (
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2"><Briefcase className="h-4 w-4 text-muted-foreground" /><span className="text-muted-foreground">Stage:</span> {selectedContact.deal_stage || "—"}</div>
                      <div className="flex items-center gap-2"><DollarSign className="h-4 w-4 text-muted-foreground" /><span className="text-muted-foreground">Value:</span> {selectedContact.estimated_value ? `$${selectedContact.estimated_value.toLocaleString()}` : "—"}</div>
                      <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-muted-foreground" /><span className="text-muted-foreground">Follow-up:</span> {selectedContact.next_follow_up ? format(new Date(selectedContact.next_follow_up), "MMM d, yyyy") : "—"}</div>
                      <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-muted-foreground" /><span className="text-muted-foreground">Last contacted:</span> {selectedContact.last_contacted_at ? format(new Date(selectedContact.last_contacted_at), "MMM d, yyyy") : "—"}</div>
                    </div>
                  )}
                </div>

                {/* Tags */}
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-foreground flex items-center gap-2"><Tag className="h-4 w-4" /> Tags</h3>
                  <div className="flex flex-wrap gap-1">
                    {(editMode ? editForm.tags || selectedContact.tags : selectedContact.tags || []).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                        {editMode && <X className="ml-1 h-3 w-3 cursor-pointer" onClick={() => removeTag(tag)} />}
                      </Badge>
                    ))}
                  </div>
                  {editMode && (
                    <div className="flex gap-2">
                      <Input placeholder="Add tag" value={newTagInput} onChange={(e) => setNewTagInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }} className="h-8 text-sm" />
                      <Button size="sm" variant="outline" onClick={addTag} className="h-8">Add</Button>
                    </div>
                  )}
                </div>

                {/* Notes */}
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-foreground flex items-center gap-2"><StickyNote className="h-4 w-4" /> Notes</h3>
                  {editMode ? (
                    <Textarea rows={4} value={editForm.notes || ""} onChange={(e) => setEditForm((p) => ({ ...p, notes: e.target.value }))} />
                  ) : (
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{selectedContact.notes || "No notes yet."}</p>
                  )}
                </div>

                {/* Meta */}
                <div className="border-t pt-4 space-y-1 text-xs text-muted-foreground">
                  <p>Source: {SOURCE_LABELS[selectedContact.source] || selectedContact.source}</p>
                  <p>Created: {format(new Date(selectedContact.created_at), "MMM d, yyyy 'at' HH:mm")}</p>
                  <p>Updated: {format(new Date(selectedContact.updated_at), "MMM d, yyyy 'at' HH:mm")}</p>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Add Contact Dialog */}
      <Sheet open={showAddForm} onOpenChange={setShowAddForm}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Add New Contact</SheetTitle>
          </SheetHeader>
          <AddContactForm onSubmit={addContact} onCancel={() => setShowAddForm(false)} />
        </SheetContent>
      </Sheet>
    </div>
  );
};

const AddContactForm = ({ onSubmit, onCancel }: { onSubmit: (data: { name: string; email: string; phone?: string; company?: string; job_title?: string; notes?: string }) => void; onCancel: () => void }) => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", company: "", job_title: "", notes: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email.trim()) return;
    setSubmitting(true);
    await onSubmit({
      name: form.name || undefined as any,
      email: form.email,
      phone: form.phone || undefined,
      company: form.company || undefined,
      job_title: form.job_title || undefined,
      notes: form.notes || undefined,
    });
    setSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      <div><label className="text-sm font-medium">Email *</label><Input required type="email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} /></div>
      <div><label className="text-sm font-medium">Name</label><Input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} /></div>
      <div><label className="text-sm font-medium">Phone</label><Input value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} /></div>
      <div><label className="text-sm font-medium">Company</label><Input value={form.company} onChange={(e) => setForm((p) => ({ ...p, company: e.target.value }))} /></div>
      <div><label className="text-sm font-medium">Job Title</label><Input value={form.job_title} onChange={(e) => setForm((p) => ({ ...p, job_title: e.target.value }))} /></div>
      <div><label className="text-sm font-medium">Notes</label><Textarea rows={3} value={form.notes} onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))} /></div>
      <div className="flex gap-2 pt-2">
        <Button type="submit" disabled={submitting}>{submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}Add Contact</Button>
        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  );
};

export default AdminCRM;
