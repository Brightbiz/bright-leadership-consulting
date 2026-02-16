import { useState, useEffect } from "react";
import { Navigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { format } from "date-fns";
import { Mail, MailOpen, Trash2, RefreshCw, LogOut, Loader2, Package, Download, ClipboardCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader,
  AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  message: string;
  created_at: string;
  is_read: boolean;
}

interface LeadDownload {
  id: string;
  name: string | null;
  email: string;
  lead_magnet_name: string;
  downloaded_at: string;
}

interface QuizResult {
  id: string;
  name: string | null;
  email: string;
  total_score: number;
  recommended_tier: string;
  answers: unknown;
  created_at: string;
}

const AdminSubmissions = () => {
  const { user, isAdmin, isLoading: authLoading, signOut } = useAdminAuth();
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [leads, setLeads] = useState<LeadDownload[]>([]);
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);
  const { toast } = useToast();

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [contactRes, leadRes, quizRes] = await Promise.all([
        supabase.from("contact_submissions").select("*").order("created_at", { ascending: false }),
        supabase.from("lead_magnet_downloads").select("*").order("downloaded_at", { ascending: false }),
        supabase.from("readiness_quiz_results").select("*").order("created_at", { ascending: false }),
      ]);
      if (contactRes.error) throw contactRes.error;
      if (leadRes.error) throw leadRes.error;
      if (quizRes.error) throw quizRes.error;
      setSubmissions(contactRes.data || []);
      setLeads(leadRes.data || []);
      setQuizResults(quizRes.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({ title: "Error loading data", description: "Please try again later.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && isAdmin) fetchAll();
  }, [user, isAdmin]);

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !isAdmin) return <Navigate to="/admin/login" replace />;

  const toggleReadStatus = async (submission: ContactSubmission) => {
    try {
      const { error } = await supabase
        .from("contact_submissions")
        .update({ is_read: !submission.is_read })
        .eq("id", submission.id);
      if (error) throw error;
      setSubmissions((prev) => prev.map((s) => s.id === submission.id ? { ...s, is_read: !s.is_read } : s));
      toast({ title: submission.is_read ? "Marked as unread" : "Marked as read" });
    } catch {
      toast({ title: "Error updating submission", variant: "destructive" });
    }
  };

  const deleteSubmission = async (id: string) => {
    try {
      const { error } = await supabase.from("contact_submissions").delete().eq("id", id);
      if (error) throw error;
      setSubmissions((prev) => prev.filter((s) => s.id !== id));
      setSelectedSubmission(null);
      toast({ title: "Submission deleted" });
    } catch {
      toast({ title: "Error deleting submission", variant: "destructive" });
    }
  };

  const unreadCount = submissions.filter((s) => !s.is_read).length;

  const tierLabel = (tier: string) => {
    const map: Record<string, { label: string; variant: "default" | "secondary" | "outline" }> = {
      "executive-coaching": { label: "Executive", variant: "default" },
      "group-coaching": { label: "Group", variant: "secondary" },
      "self-paced": { label: "Self-Paced", variant: "outline" },
    };
    return map[tier] || { label: tier, variant: "outline" as const };
  };

  const downloadCsv = (filename: string, headers: string[], rows: string[][]) => {
    const escape = (v: string) => `"${v.replace(/"/g, '""')}"`;
    const csv = [headers.map(escape).join(","), ...rows.map((r) => r.map(escape).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportContacts = () => {
    downloadCsv("contact-submissions.csv",
      ["Name", "Email", "Phone", "Company", "Message", "Date", "Read"],
      submissions.map((s) => [s.name, s.email, s.phone || "", s.company || "", s.message, format(new Date(s.created_at), "yyyy-MM-dd HH:mm"), s.is_read ? "Yes" : "No"])
    );
  };

  const exportLeads = () => {
    downloadCsv("lead-downloads.csv",
      ["Name", "Email", "Lead Magnet", "Date"],
      leads.map((l) => [l.name || "", l.email, l.lead_magnet_name, format(new Date(l.downloaded_at), "yyyy-MM-dd HH:mm")])
    );
  };

  const exportQuiz = () => {
    downloadCsv("quiz-results.csv",
      ["Name", "Email", "Score", "Recommended Tier", "Date"],
      quizResults.map((r) => [r.name || "", r.email, String(r.total_score), r.recommended_tier, format(new Date(r.created_at), "yyyy-MM-dd HH:mm")])
    );
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
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-serif text-3xl font-semibold text-foreground">Admin Dashboard</h1>
            <p className="mt-1 text-muted-foreground">
              Manage submissions, leads &amp; quiz results
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="outline">
              <Link to="/admin/thinkific-export">
                <Package className="mr-2 h-4 w-4" />
                Thinkific Export
              </Link>
            </Button>
            <Button onClick={fetchAll} variant="outline" disabled={loading}>
              <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button onClick={signOut} variant="ghost" size="sm">
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="contacts" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="contacts" className="gap-2">
              <Mail className="h-4 w-4" />
              Contacts
              {unreadCount > 0 && <Badge variant="default" className="ml-1 text-xs">{unreadCount}</Badge>}
            </TabsTrigger>
            <TabsTrigger value="leads" className="gap-2">
              <Download className="h-4 w-4" />
              Lead Downloads
            </TabsTrigger>
            <TabsTrigger value="quiz" className="gap-2">
              <ClipboardCheck className="h-4 w-4" />
              Quiz Results
            </TabsTrigger>
          </TabsList>

          {/* ─── Contacts Tab ─── */}
          <TabsContent value="contacts">
            {submissions.length > 0 && (
              <div className="mb-3 flex justify-end">
                <Button variant="outline" size="sm" onClick={exportContacts}>
                  <Download className="mr-2 h-4 w-4" />
                  Export CSV
                </Button>
              </div>
            )}
            <div className="rounded-lg border border-border bg-card">
              {loading ? <LoadingSkeleton /> : submissions.length === 0 ? (
                <div className="p-12 text-center">
                  <Mail className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
                  <h3 className="text-lg font-medium text-foreground">No submissions yet</h3>
                  <p className="mt-1 text-sm text-muted-foreground">Contact form submissions will appear here.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[40px]"></TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead className="hidden md:table-cell">Email</TableHead>
                      <TableHead className="hidden lg:table-cell">Company</TableHead>
                      <TableHead className="hidden sm:table-cell">Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {submissions.map((submission) => (
                      <TableRow
                        key={submission.id}
                        className={`cursor-pointer ${!submission.is_read ? "bg-accent/30" : ""}`}
                        onClick={() => setSelectedSubmission(submission)}
                      >
                        <TableCell>
                          {submission.is_read ? <MailOpen className="h-4 w-4 text-muted-foreground" /> : <Mail className="h-4 w-4 text-primary" />}
                        </TableCell>
                        <TableCell className="font-medium">
                          {submission.name}
                          {!submission.is_read && <Badge variant="default" className="ml-2 text-xs">New</Badge>}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">{submission.email}</TableCell>
                        <TableCell className="hidden lg:table-cell">{submission.company || "—"}</TableCell>
                        <TableCell className="hidden sm:table-cell text-muted-foreground">
                          {format(new Date(submission.created_at), "MMM d, yyyy")}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="sm" onClick={() => toggleReadStatus(submission)} title={submission.is_read ? "Mark as unread" : "Mark as read"}>
                              {submission.is_read ? <Mail className="h-4 w-4" /> : <MailOpen className="h-4 w-4" />}
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete submission?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete the submission from {submission.name}.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => deleteSubmission(submission.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </TabsContent>

          {/* ─── Lead Downloads Tab ─── */}
          <TabsContent value="leads">
            {leads.length > 0 && (
              <div className="mb-3 flex justify-end">
                <Button variant="outline" size="sm" onClick={exportLeads}>
                  <Download className="mr-2 h-4 w-4" />
                  Export CSV
                </Button>
              </div>
            )}
            <div className="rounded-lg border border-border bg-card">
              {loading ? <LoadingSkeleton /> : leads.length === 0 ? (
                <div className="p-12 text-center">
                  <Download className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
                  <h3 className="text-lg font-medium text-foreground">No downloads yet</h3>
                  <p className="mt-1 text-sm text-muted-foreground">Lead magnet downloads will appear here.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead className="hidden md:table-cell">Lead Magnet</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leads.map((lead) => (
                      <TableRow key={lead.id}>
                        <TableCell className="font-medium">{lead.name || "—"}</TableCell>
                        <TableCell>{lead.email}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          <Badge variant="outline">{lead.lead_magnet_name}</Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {format(new Date(lead.downloaded_at), "MMM d, yyyy")}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </TabsContent>

          {/* ─── Quiz Results Tab ─── */}
          <TabsContent value="quiz">
            {quizResults.length > 0 && (
              <div className="mb-3 flex justify-end">
                <Button variant="outline" size="sm" onClick={exportQuiz}>
                  <Download className="mr-2 h-4 w-4" />
                  Export CSV
                </Button>
              </div>
            )}
            <div className="rounded-lg border border-border bg-card">
              {loading ? <LoadingSkeleton /> : quizResults.length === 0 ? (
                <div className="p-12 text-center">
                  <ClipboardCheck className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
                  <h3 className="text-lg font-medium text-foreground">No quiz results yet</h3>
                  <p className="mt-1 text-sm text-muted-foreground">Readiness quiz submissions will appear here.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead className="hidden md:table-cell">Score</TableHead>
                      <TableHead>Recommended Tier</TableHead>
                      <TableHead className="hidden sm:table-cell">Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {quizResults.map((result) => {
                      const tier = tierLabel(result.recommended_tier);
                      return (
                        <TableRow key={result.id}>
                          <TableCell className="font-medium">{result.name || "—"}</TableCell>
                          <TableCell>{result.email}</TableCell>
                          <TableCell className="hidden md:table-cell">
                            <Badge variant="secondary">{result.total_score} pts</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={tier.variant}>{tier.label}</Badge>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell text-muted-foreground">
                            {format(new Date(result.created_at), "MMM d, yyyy")}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Detail Modal */}
        {selectedSubmission && (
          <AlertDialog open={!!selectedSubmission} onOpenChange={() => setSelectedSubmission(null)}>
            <AlertDialogContent className="max-w-lg">
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2">
                  {selectedSubmission.name}
                  {!selectedSubmission.is_read && <Badge variant="default" className="text-xs">New</Badge>}
                </AlertDialogTitle>
                <AlertDialogDescription asChild>
                  <div className="space-y-4 text-left">
                    <div className="grid gap-3 text-sm">
                      <div>
                        <span className="font-medium text-foreground">Email:</span>{" "}
                        <a href={`mailto:${selectedSubmission.email}`} className="text-primary hover:underline">{selectedSubmission.email}</a>
                      </div>
                      {selectedSubmission.phone && (
                        <div>
                          <span className="font-medium text-foreground">Phone:</span>{" "}
                          <a href={`tel:${selectedSubmission.phone}`} className="text-primary hover:underline">{selectedSubmission.phone}</a>
                        </div>
                      )}
                      {selectedSubmission.company && (
                        <div><span className="font-medium text-foreground">Company:</span> {selectedSubmission.company}</div>
                      )}
                      <div>
                        <span className="font-medium text-foreground">Submitted:</span>{" "}
                        {format(new Date(selectedSubmission.created_at), "MMMM d, yyyy 'at' h:mm a")}
                      </div>
                    </div>
                    <div className="rounded-lg border border-border bg-muted/50 p-4">
                      <p className="font-medium text-foreground mb-2">Message:</p>
                      <p className="whitespace-pre-wrap text-foreground">{selectedSubmission.message}</p>
                    </div>
                  </div>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="flex-col gap-2 sm:flex-row">
                <Button
                  variant="outline"
                  onClick={() => {
                    toggleReadStatus(selectedSubmission);
                    setSelectedSubmission({ ...selectedSubmission, is_read: !selectedSubmission.is_read });
                  }}
                >
                  {selectedSubmission.is_read ? (
                    <><Mail className="mr-2 h-4 w-4" />Mark Unread</>
                  ) : (
                    <><MailOpen className="mr-2 h-4 w-4" />Mark Read</>
                  )}
                </Button>
                <AlertDialogCancel>Close</AlertDialogCancel>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default AdminSubmissions;
