import { useEffect, useMemo, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { Loader2, RefreshCw, CheckCircle2, AlertTriangle, HelpCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { programmes } from "@/data/programmes";

interface AuditAsset {
  file: string;
  programme: string | null;
  expected: string | null;
  found: string[];
  occurrences: { line: number; value: string }[];
  bannedTerms: { line: number; term: string }[];
  status: "ok" | "error" | "unmapped";
  issues: string[];
}

interface AuditSnapshot {
  generatedAt: string;
  catalogue: string;
  programmes: { title: string; cpdHours: string; assetCount: number }[];
  filesScanned: number;
  assets: AuditAsset[];
  summary: { total: number; ok: number; unmapped: number; errors: number };
}

const StatusBadge = ({ status }: { status: AuditAsset["status"] }) => {
  if (status === "ok") {
    return (
      <Badge variant="outline" className="border-primary/40 text-primary gap-1">
        <CheckCircle2 className="h-3 w-3" aria-hidden="true" /> Match
      </Badge>
    );
  }
  if (status === "error") {
    return (
      <Badge variant="destructive" className="gap-1">
        <AlertTriangle className="h-3 w-3" aria-hidden="true" /> Mismatch
      </Badge>
    );
  }
  return (
    <Badge variant="secondary" className="gap-1">
      <HelpCircle className="h-3 w-3" aria-hidden="true" /> Unmapped
    </Badge>
  );
};

const AdminCpdAudit = () => {
  const { user, isAdmin, isLoading } = useAdminAuth();
  const [snapshot, setSnapshot] = useState<AuditSnapshot | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loadingSnapshot, setLoadingSnapshot] = useState(true);
  const [filter, setFilter] = useState("");

  const load = async () => {
    setLoadingSnapshot(true);
    setLoadError(null);
    try {
      const res = await fetch(`/cpd-audit.json?t=${Date.now()}`);
      if (!res.ok) throw new Error(`Snapshot unavailable (${res.status})`);
      setSnapshot((await res.json()) as AuditSnapshot);
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : "Unable to load the audit snapshot.");
    } finally {
      setLoadingSnapshot(false);
    }
  };

  useEffect(() => {
    if (isAdmin) void load();
  }, [isAdmin]);

  // Live catalogue values, so drift between the snapshot and the current
  // catalogue is visible without regenerating.
  const catalogueByTitle = useMemo(
    () => new Map(programmes.map((p) => [p.title, p.cpdHours])),
    []
  );

  const rows = useMemo(() => {
    if (!snapshot) return [];
    const q = filter.trim().toLowerCase();
    return snapshot.assets.filter(
      (a) =>
        !q ||
        a.file.toLowerCase().includes(q) ||
        (a.programme ?? "").toLowerCase().includes(q)
    );
  }, [snapshot, filter]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user || !isAdmin) return <Navigate to="/admin/login" replace />;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main id="main-content" className="flex-1 container mx-auto px-6 py-16 max-w-6xl">
        <Link
          to="/admin"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back to admin
        </Link>

        <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl text-foreground">CPD Hours Audit</h1>
            <p className="mt-2 text-sm text-muted-foreground max-w-2xl">
              Stated CPD hours in every downloadable asset and PDF generator, compared
              against the expected ranges in <code>src/data/programmes.ts</code>.
            </p>
          </div>
          <Button variant="outline" onClick={() => void load()} disabled={loadingSnapshot}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loadingSnapshot ? "animate-spin" : ""}`} aria-hidden="true" />
            Refresh
          </Button>
        </div>

        {/* Catalogue reference */}
        <section aria-labelledby="catalogue-heading" className="mt-12">
          <h2 id="catalogue-heading" className="text-xs uppercase tracking-widest text-muted-foreground">
            Expected ranges (catalogue)
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {programmes.map((p) => (
              <div key={p.slug ?? p.title} className="border-l-2 border-primary/40 pl-4">
                <p className="text-sm text-foreground">{p.title}</p>
                <p className="mt-1 font-serif text-xl text-foreground">{p.cpdHours}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Summary */}
        {snapshot && (
          <section className="mt-12 grid gap-4 sm:grid-cols-4">
            {[
              { label: "Assets audited", value: snapshot.summary.total },
              { label: "Matching", value: snapshot.summary.ok },
              { label: "Mismatches", value: snapshot.summary.errors },
              { label: "Unmapped", value: snapshot.summary.unmapped },
            ].map((s) => (
              <div key={s.label} className="border border-border p-6">
                <p className="text-xs uppercase tracking-widest text-muted-foreground">{s.label}</p>
                <p className="mt-2 font-serif text-3xl text-foreground">{s.value}</p>
              </div>
            ))}
          </section>
        )}

        {/* Table */}
        <section aria-labelledby="assets-heading" className="mt-12">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 id="assets-heading" className="text-xs uppercase tracking-widest text-muted-foreground">
              Downloadable assets
            </h2>
            <div className="w-full sm:w-72">
              <label htmlFor="asset-filter" className="sr-only">
                Filter by file or programme
              </label>
              <Input
                id="asset-filter"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                placeholder="Filter by file or programme…"
              />
            </div>
          </div>

          {loadingSnapshot && (
            <div className="mt-6 space-y-3">
              {[0, 1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          )}

          {!loadingSnapshot && loadError && (
            <p className="mt-6 border border-border p-6 text-sm text-muted-foreground">
              {loadError} — the snapshot is generated at build time by{" "}
              <code>npm run audit:cpd</code>.
            </p>
          )}

          {!loadingSnapshot && snapshot && (
            <div className="mt-6 border border-border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>File</TableHead>
                    <TableHead>Programme</TableHead>
                    <TableHead>Stated in asset</TableHead>
                    <TableHead>Expected (catalogue)</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((a) => {
                    const liveExpected = a.programme ? catalogueByTitle.get(a.programme) : undefined;
                    const stale = Boolean(a.expected && liveExpected && liveExpected !== a.expected);
                    return (
                      <TableRow key={a.file}>
                        <TableCell className="font-mono text-xs align-top">{a.file}</TableCell>
                        <TableCell className="text-sm align-top">{a.programme ?? "—"}</TableCell>
                        <TableCell className="text-sm align-top">
                          {a.found.length > 0 ? a.found.join(", ") : <span className="text-muted-foreground">none stated</span>}
                          {a.occurrences.length > 0 && (
                            <span className="block text-xs text-muted-foreground">
                              line{a.occurrences.length > 1 ? "s" : ""}{" "}
                              {a.occurrences.map((o) => o.line).join(", ")}
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-sm align-top">
                          {liveExpected ?? a.expected ?? "—"}
                          {stale && (
                            <span className="block text-xs text-destructive">
                              Snapshot recorded {a.expected} — regenerate the audit.
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="align-top">
                          <StatusBadge status={a.status} />
                          {a.issues.length > 0 && (
                            <ul className="mt-2 space-y-1 text-xs text-destructive">
                              {a.issues.map((issue) => (
                                <li key={issue}>{issue}</li>
                              ))}
                            </ul>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {rows.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-sm text-muted-foreground py-8 text-center">
                        No assets match this filter.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}

          {snapshot && (
            <p className="mt-4 text-xs text-muted-foreground">
              Snapshot generated {new Date(snapshot.generatedAt).toLocaleString("en-GB")} across{" "}
              {snapshot.filesScanned} scanned file(s). Regenerated on every build.
            </p>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AdminCpdAudit;
