import { useEffect, useState } from "react";
import { generateStrategicLeadershipPDF, downloadStrategicLeadershipPDF } from "@/utils/strategicLeadershipPdfGenerator";

const GenerateWorkbook = () => {
  const [status, setStatus] = useState<"generating" | "done" | "error">("generating");

  useEffect(() => {
    generateStrategicLeadershipPDF()
      .then((bytes) => {
        downloadStrategicLeadershipPDF(bytes);
        setStatus("done");
      })
      .catch(() => setStatus("error"));
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
      <div className="text-center space-y-4">
        {status === "generating" && <p className="text-lg">Generating your fillable PDF workbook…</p>}
        {status === "done" && (
          <>
            <p className="text-lg font-semibold">✓ Download started</p>
            <p className="text-sm text-muted-foreground">Check your downloads folder for the PDF.</p>
          </>
        )}
        {status === "error" && <p className="text-lg text-destructive">Something went wrong. Please refresh to retry.</p>}
      </div>
    </div>
  );
};

export default GenerateWorkbook;
