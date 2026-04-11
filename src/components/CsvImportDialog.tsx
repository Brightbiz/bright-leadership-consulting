import { useState, useCallback } from "react";
import { Upload, FileText, AlertTriangle, CheckCircle2, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const CRM_FIELDS = [
  { key: "skip", label: "— Skip —" },
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone" },
  { key: "company", label: "Company" },
  { key: "job_title", label: "Job Title" },
  { key: "notes", label: "Notes" },
  { key: "tags", label: "Tags (semicolon-separated)" },
  { key: "status", label: "Status" },
  { key: "deal_stage", label: "Deal Stage" },
  { key: "estimated_value", label: "Estimated Value" },
] as const;

type Step = "upload" | "mapping" | "importing" | "done";

interface ImportResult {
  imported: number;
  duplicates: number;
  errors: number;
}

function parseRow(row: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;
  for (const char of row) {
    if (char === '"') inQuotes = !inQuotes;
    else if (char === "," && !inQuotes) { result.push(current.trim()); current = ""; }
    else current += char;
  }
  result.push(current.trim());
  return result;
}

function autoMapColumns(headers: string[]): Record<number, string> {
  const mapping: Record<number, string> = {};
  const patterns: [RegExp, string][] = [
    [/^email$/i, "email"],
    [/^(full_?)?name$/i, "name"],
    [/^(first_?name|last_?name)$/i, "name"],
    [/^phone|tel/i, "phone"],
    [/^company|org/i, "company"],
    [/^(job|title|position|role)$/i, "job_title"],
    [/^job.?title$/i, "job_title"],
    [/^note/i, "notes"],
    [/^tag/i, "tags"],
    [/^status$/i, "status"],
    [/^(deal|stage)/i, "deal_stage"],
    [/^(value|amount|revenue)/i, "estimated_value"],
  ];
  headers.forEach((h, i) => {
    const clean = h.toLowerCase().replace(/[^a-z_]/g, "");
    for (const [regex, field] of patterns) {
      if (regex.test(clean) && !Object.values(mapping).includes(field)) {
        mapping[i] = field;
        break;
      }
    }
  });
  return mapping;
}

interface CsvImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImportComplete: () => void;
}

export const CsvImportDialog = ({ open, onOpenChange, onImportComplete }: CsvImportDialogProps) => {
  const [step, setStep] = useState<Step>("upload");
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<string[][]>([]);
  const [columnMapping, setColumnMapping] = useState<Record<number, string>>({});
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [fileName, setFileName] = useState("");
  const { toast } = useToast();

  const reset = useCallback(() => {
    setStep("upload");
    setHeaders([]);
    setRows([]);
    setColumnMapping({});
    setProgress(0);
    setResult(null);
    setFileName("");
  }, []);

  const handleClose = (isOpen: boolean) => {
    if (!isOpen) reset();
    onOpenChange(isOpen);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const text = await file.text();
    const lines = text.split("\n").filter((l) => l.trim());
    
    if (lines.length < 2) {
      toast({ title: "Invalid CSV", description: "File must have a header row and at least one data row.", variant: "destructive" });
      return;
    }

    const parsedHeaders = parseRow(lines[0]);
    const parsedRows = lines.slice(1).map(parseRow);
    const autoMap = autoMapColumns(parsedHeaders);

    if (!Object.values(autoMap).includes("email")) {
      toast({ title: "No email column detected", description: "Please map the email column manually.", variant: "destructive" });
    }

    setFileName(file.name);
    setHeaders(parsedHeaders);
    setRows(parsedRows);
    setColumnMapping(autoMap);
    setStep("mapping");
  };

  const handleMapping = (colIdx: number, field: string) => {
    setColumnMapping((prev) => {
      const next = { ...prev };
      // Remove any existing mapping to this field (except "skip")
      if (field !== "skip") {
        for (const key in next) {
          if (next[Number(key)] === field) delete next[Number(key)];
        }
      }
      if (field === "skip") delete next[colIdx];
      else next[colIdx] = field;
      return next;
    });
  };

  const hasEmailMapping = Object.values(columnMapping).includes("email");

  const startImport = async () => {
    if (!hasEmailMapping) {
      toast({ title: "Email column required", description: "Please map at least the email column.", variant: "destructive" });
      return;
    }

    setStep("importing");
    let imported = 0, duplicates = 0, errors = 0;
    const total = rows.length;
    const BATCH_SIZE = 10;

    for (let i = 0; i < total; i += BATCH_SIZE) {
      const batch = rows.slice(i, i + BATCH_SIZE);
      const records: Record<string, unknown>[] = [];

      for (const cols of batch) {
        const record: Record<string, unknown> = { source: "csv_import" };
        for (const [colIdxStr, field] of Object.entries(columnMapping)) {
          const val = cols[Number(colIdxStr)]?.trim();
          if (!val) continue;
          if (field === "tags") {
            record.tags = val.split(";").map((t: string) => t.trim()).filter(Boolean);
          } else if (field === "estimated_value") {
            const num = parseFloat(val.replace(/[^0-9.-]/g, ""));
            if (!isNaN(num)) record.estimated_value = num;
          } else {
            record[field] = val;
          }
        }
        if (!record.email) continue;
        records.push(record);
      }

      // Insert one by one to handle duplicates gracefully
      for (const record of records) {
        const { error } = await (supabase as any).from("crm_contacts").insert(record);
        if (error?.code === "23505") duplicates++;
        else if (error) errors++;
        else imported++;
      }

      setProgress(Math.min(100, Math.round(((i + batch.length) / total) * 100)));
    }

    setResult({ imported, duplicates, errors });
    setStep("done");
    if (imported > 0) onImportComplete();
  };

  const previewRows = rows.slice(0, 5);
  const mappedFields = Object.values(columnMapping);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Import Leads from CSV
          </DialogTitle>
          <DialogDescription>
            {step === "upload" && "Upload a CSV file with your lead data. The file must contain at least an email column."}
            {step === "mapping" && `${fileName} — ${rows.length} rows found. Map your CSV columns to CRM fields.`}
            {step === "importing" && "Importing contacts..."}
            {step === "done" && "Import complete."}
          </DialogDescription>
        </DialogHeader>

        {/* Upload Step */}
        {step === "upload" && (
          <div className="py-8">
            <label className="flex flex-col items-center gap-4 rounded-lg border-2 border-dashed border-muted-foreground/25 p-10 cursor-pointer hover:border-primary/50 transition-colors">
              <FileText className="h-12 w-12 text-muted-foreground/50" />
              <div className="text-center">
                <p className="font-medium text-foreground">Click to select a CSV file</p>
                <p className="text-sm text-muted-foreground mt-1">Supports .csv files with headers</p>
              </div>
              <input type="file" accept=".csv" className="hidden" onChange={handleFileSelect} />
            </label>
            <div className="mt-4 rounded-lg bg-muted/50 p-4 text-sm text-muted-foreground">
              <p className="font-medium mb-2">Expected format:</p>
              <code className="text-xs bg-background px-2 py-1 rounded">
                Name,Email,Phone,Company,Job Title,Tags<br />
                John Doe,john@example.com,555-1234,Acme Inc,CEO,"tag1; tag2"
              </code>
            </div>
          </div>
        )}

        {/* Mapping Step */}
        {step === "mapping" && (
          <div className="space-y-4">
            <div className="rounded-lg border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    {headers.map((h, i) => (
                      <TableHead key={i} className="min-w-[160px]">
                        <div className="space-y-1.5">
                          <p className="text-xs font-medium truncate" title={h}>{h}</p>
                          <Select
                            value={columnMapping[i] || "skip"}
                            onValueChange={(v) => handleMapping(i, v)}
                          >
                            <SelectTrigger className="h-8 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {CRM_FIELDS.map((f) => (
                                <SelectItem
                                  key={f.key}
                                  value={f.key}
                                  disabled={f.key !== "skip" && mappedFields.includes(f.key) && columnMapping[i] !== f.key}
                                >
                                  {f.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {previewRows.map((row, ri) => (
                    <TableRow key={ri}>
                      {headers.map((_, ci) => (
                        <TableCell key={ci} className="text-xs text-muted-foreground max-w-[200px] truncate">
                          {row[ci] || "—"}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {rows.length > 5 && (
              <p className="text-xs text-muted-foreground text-center">
                Showing 5 of {rows.length} rows
              </p>
            )}

            {!hasEmailMapping && (
              <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 rounded-lg p-3">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                Email column mapping is required to proceed.
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              <span className="text-xs text-muted-foreground">Mapped:</span>
              {Object.values(columnMapping).map((f) => (
                <Badge key={f} variant="secondary" className="text-xs">
                  {CRM_FIELDS.find((c) => c.key === f)?.label || f}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Importing Step */}
        {step === "importing" && (
          <div className="py-8 space-y-4">
            <div className="flex items-center justify-center gap-3">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <span className="text-lg font-medium">Importing {rows.length} contacts…</span>
            </div>
            <Progress value={progress} className="h-2" />
            <p className="text-center text-sm text-muted-foreground">{progress}% complete</p>
          </div>
        )}

        {/* Done Step */}
        {step === "done" && result && (
          <div className="py-8 space-y-4">
            <div className="flex items-center justify-center gap-3">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
              <span className="text-xl font-semibold">Import Complete</span>
            </div>
            <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto">
              <div className="text-center rounded-lg bg-green-50 dark:bg-green-900/20 p-3">
                <p className="text-2xl font-bold text-green-700 dark:text-green-400">{result.imported}</p>
                <p className="text-xs text-muted-foreground">Imported</p>
              </div>
              <div className="text-center rounded-lg bg-yellow-50 dark:bg-yellow-900/20 p-3">
                <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-400">{result.duplicates}</p>
                <p className="text-xs text-muted-foreground">Duplicates</p>
              </div>
              <div className="text-center rounded-lg bg-red-50 dark:bg-red-900/20 p-3">
                <p className="text-2xl font-bold text-red-700 dark:text-red-400">{result.errors}</p>
                <p className="text-xs text-muted-foreground">Errors</p>
              </div>
            </div>
          </div>
        )}

        <DialogFooter>
          {step === "mapping" && (
            <div className="flex gap-2 w-full justify-between">
              <Button variant="outline" onClick={reset}>Back</Button>
              <Button onClick={startImport} disabled={!hasEmailMapping}>
                Import {rows.length} Contacts
              </Button>
            </div>
          )}
          {step === "done" && (
            <Button onClick={() => handleClose(false)}>Close</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
