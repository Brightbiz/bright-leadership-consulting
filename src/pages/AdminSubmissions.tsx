import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { format } from "date-fns";
import { Mail, MailOpen, Trash2, ArrowLeft, RefreshCw, LogOut, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";

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

const AdminSubmissions = () => {
  const { user, isAdmin, isLoading: authLoading, signOut } = useAdminAuth();
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);
  const { toast } = useToast();

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("contact_submissions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setSubmissions(data || []);
    } catch (error) {
      console.error("Error fetching submissions:", error);
      toast({
        title: "Error loading submissions",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && isAdmin) {
      fetchSubmissions();
    }
  }, [user, isAdmin]);

  // Redirect if not authenticated or not admin
  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  const toggleReadStatus = async (submission: ContactSubmission) => {
    try {
      const { error } = await supabase
        .from("contact_submissions")
        .update({ is_read: !submission.is_read })
        .eq("id", submission.id);

      if (error) throw error;

      setSubmissions((prev) =>
        prev.map((s) =>
          s.id === submission.id ? { ...s, is_read: !s.is_read } : s
        )
      );

      toast({
        title: submission.is_read ? "Marked as unread" : "Marked as read",
      });
    } catch (error) {
      console.error("Error updating submission:", error);
      toast({
        title: "Error updating submission",
        variant: "destructive",
      });
    }
  };

  const deleteSubmission = async (id: string) => {
    try {
      const { error } = await supabase
        .from("contact_submissions")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setSubmissions((prev) => prev.filter((s) => s.id !== id));
      setSelectedSubmission(null);

      toast({
        title: "Submission deleted",
      });
    } catch (error) {
      console.error("Error deleting submission:", error);
      toast({
        title: "Error deleting submission",
        variant: "destructive",
      });
    }
  };

  const unreadCount = submissions.filter((s) => !s.is_read).length;

  return (
    <div className="min-h-screen bg-background">
      <div className="container-narrow py-8">
      {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-3">
              <Link to="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Site
                </Button>
              </Link>
            </div>
            <h1 className="font-serif text-3xl font-semibold text-foreground">
              Contact Submissions
            </h1>
            <p className="mt-1 text-muted-foreground">
              {submissions.length} total submissions
              {unreadCount > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {unreadCount} unread
                </Badge>
              )}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={fetchSubmissions} variant="outline" disabled={loading}>
              <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button onClick={signOut} variant="ghost" size="sm">
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-lg border border-border bg-card">
          {loading ? (
            <div className="p-6 space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : submissions.length === 0 ? (
            <div className="p-12 text-center">
              <Mail className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
              <h3 className="text-lg font-medium text-foreground">No submissions yet</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Contact form submissions will appear here.
              </p>
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
                      {submission.is_read ? (
                        <MailOpen className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Mail className="h-4 w-4 text-primary" />
                      )}
                    </TableCell>
                    <TableCell className="font-medium">
                      {submission.name}
                      {!submission.is_read && (
                        <Badge variant="default" className="ml-2 text-xs">
                          New
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {submission.email}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {submission.company || "—"}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-muted-foreground">
                      {format(new Date(submission.created_at), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleReadStatus(submission)}
                          title={submission.is_read ? "Mark as unread" : "Mark as read"}
                        >
                          {submission.is_read ? (
                            <Mail className="h-4 w-4" />
                          ) : (
                            <MailOpen className="h-4 w-4" />
                          )}
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
                                This action cannot be undone. This will permanently delete the
                                submission from {submission.name}.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteSubmission(submission.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
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

        {/* Detail Modal */}
        {selectedSubmission && (
          <AlertDialog open={!!selectedSubmission} onOpenChange={() => setSelectedSubmission(null)}>
            <AlertDialogContent className="max-w-lg">
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2">
                  {selectedSubmission.name}
                  {!selectedSubmission.is_read && (
                    <Badge variant="default" className="text-xs">New</Badge>
                  )}
                </AlertDialogTitle>
                <AlertDialogDescription asChild>
                  <div className="space-y-4 text-left">
                    <div className="grid gap-3 text-sm">
                      <div>
                        <span className="font-medium text-foreground">Email:</span>{" "}
                        <a href={`mailto:${selectedSubmission.email}`} className="text-primary hover:underline">
                          {selectedSubmission.email}
                        </a>
                      </div>
                      {selectedSubmission.phone && (
                        <div>
                          <span className="font-medium text-foreground">Phone:</span>{" "}
                          <a href={`tel:${selectedSubmission.phone}`} className="text-primary hover:underline">
                            {selectedSubmission.phone}
                          </a>
                        </div>
                      )}
                      {selectedSubmission.company && (
                        <div>
                          <span className="font-medium text-foreground">Company:</span>{" "}
                          {selectedSubmission.company}
                        </div>
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
                    setSelectedSubmission({
                      ...selectedSubmission,
                      is_read: !selectedSubmission.is_read,
                    });
                  }}
                >
                  {selectedSubmission.is_read ? (
                    <>
                      <Mail className="mr-2 h-4 w-4" />
                      Mark Unread
                    </>
                  ) : (
                    <>
                      <MailOpen className="mr-2 h-4 w-4" />
                      Mark Read
                    </>
                  )}
                </Button>
                <AlertDialogCancel>Close</AlertDialogCancel>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    </div>
  );
};

export default AdminSubmissions;
