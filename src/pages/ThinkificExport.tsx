import { useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, FileText, Loader2, CheckCircle2, Package, ArrowLeft, BookOpen, Video, HelpCircle, Printer } from "lucide-react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface Module {
  number: number;
  title: string;
  content: string;
}

const ThinkificExport = () => {
  const { user, isAdmin, isLoading: authLoading } = useAdminAuth();
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(false);
  const [parsed, setParsed] = useState(false);
  const [exporting, setExporting] = useState<number | null>(null);

  // Auth loading state
  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Redirect if not authenticated or not admin
  if (!user || !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  const parseMarkdown = async () => {
    setLoading(true);
    try {
      const response = await fetch("/downloads/executive-leadership-mastery-thinkific-content.md");
      const text = await response.text();
      
      // Split by module headers (# MODULE X:)
      const moduleRegex = /^# MODULE (\d+): (.+)$/gm;
      const matches = [...text.matchAll(moduleRegex)];
      
      const parsedModules: Module[] = [];
      
      for (let i = 0; i < matches.length; i++) {
        const match = matches[i];
        const moduleNumber = parseInt(match[1]);
        const moduleTitle = match[2].trim();
        
        // Get content from this module header to the next (or end of file)
        const startIndex = match.index!;
        const endIndex = i < matches.length - 1 ? matches[i + 1].index! : text.length;
        const moduleContent = text.slice(startIndex, endIndex).trim();
        
        parsedModules.push({
          number: moduleNumber,
          title: moduleTitle,
          content: moduleContent,
        });
      }
      
      setModules(parsedModules);
      setParsed(true);
    } catch (error) {
      console.error("Failed to parse markdown:", error);
    } finally {
      setLoading(false);
    }
  };

  const downloadModuleAsPDF = async (module: Module) => {
    setExporting(module.number);
    
    try {
      // Convert markdown to simple HTML for PDF
      const htmlContent = convertMarkdownToHTML(module.content);
      
      // Create a printable HTML document
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <title>Module ${module.number}: ${module.title}</title>
            <style>
              @page { margin: 2cm; size: A4; }
              body {
                font-family: 'Georgia', 'Times New Roman', serif;
                line-height: 1.7;
                color: #1a1a1a;
                max-width: 100%;
                margin: 0;
                padding: 0;
              }
              h1 {
                color: #0f4c3a;
                font-size: 28px;
                border-bottom: 3px solid #c9a227;
                padding-bottom: 12px;
                margin-bottom: 24px;
              }
              h2 {
                color: #0f4c3a;
                font-size: 22px;
                margin-top: 32px;
                margin-bottom: 16px;
              }
              h3 {
                color: #333;
                font-size: 18px;
                margin-top: 24px;
                margin-bottom: 12px;
              }
              h4 {
                color: #444;
                font-size: 16px;
                margin-top: 20px;
                margin-bottom: 10px;
              }
              p { margin-bottom: 12px; }
              ul, ol {
                margin-bottom: 16px;
                padding-left: 24px;
              }
              li { margin-bottom: 6px; }
              strong { color: #0f4c3a; }
              blockquote {
                border-left: 4px solid #c9a227;
                margin: 20px 0;
                padding: 12px 20px;
                background: #f9f7f2;
                font-style: italic;
              }
              table {
                width: 100%;
                border-collapse: collapse;
                margin: 20px 0;
              }
              th, td {
                border: 1px solid #ddd;
                padding: 10px;
                text-align: left;
              }
              th {
                background: #0f4c3a;
                color: white;
              }
              tr:nth-child(even) { background: #f9f7f2; }
              hr {
                border: none;
                border-top: 1px solid #ddd;
                margin: 32px 0;
              }
              .header-banner {
                background: linear-gradient(135deg, #0f4c3a 0%, #1a6b52 100%);
                color: white;
                padding: 30px;
                margin: -20px -20px 30px -20px;
                text-align: center;
              }
              .header-banner h1 {
                color: white;
                border: none;
                margin: 0;
                padding: 0;
              }
              .header-banner p {
                color: #c9a227;
                font-size: 14px;
                margin-top: 8px;
              }
              .footer {
                margin-top: 40px;
                padding-top: 20px;
                border-top: 2px solid #0f4c3a;
                text-align: center;
                font-size: 12px;
                color: #666;
              }
            </style>
          </head>
          <body>
            <div class="header-banner">
              <h1>Executive Leadership Mastery Program</h1>
              <p>Module ${module.number} of 33 • CPD Accredited</p>
            </div>
            ${htmlContent}
            <div class="footer">
              <p>© Bright Business Solutions • Executive Leadership Mastery Program</p>
              <p>This material is for enrolled students only. Do not distribute.</p>
            </div>
          </body>
          </html>
        `);
        printWindow.document.close();
        
        // Trigger print dialog (Save as PDF)
        setTimeout(() => {
          printWindow.print();
        }, 500);
      }
    } catch (error) {
      console.error("Failed to export PDF:", error);
    } finally {
      setExporting(null);
    }
  };

  const downloadAllModules = async () => {
    setExporting(-1);
    
    // Create a single document with all modules
    const allContent = modules.map(m => convertMarkdownToHTML(m.content)).join('<div style="page-break-after: always;"></div>');
    
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Executive Leadership Mastery Program - Complete Course</title>
          <style>
            @page { margin: 2cm; size: A4; }
            @media print { .page-break { page-break-after: always; } }
            body {
              font-family: 'Georgia', 'Times New Roman', serif;
              line-height: 1.7;
              color: #1a1a1a;
            }
            h1 { color: #0f4c3a; font-size: 28px; border-bottom: 3px solid #c9a227; padding-bottom: 12px; }
            h2 { color: #0f4c3a; font-size: 22px; margin-top: 32px; }
            h3 { color: #333; font-size: 18px; margin-top: 24px; }
            h4 { color: #444; font-size: 16px; margin-top: 20px; }
            p { margin-bottom: 12px; }
            ul, ol { margin-bottom: 16px; padding-left: 24px; }
            li { margin-bottom: 6px; }
            strong { color: #0f4c3a; }
            blockquote { border-left: 4px solid #c9a227; margin: 20px 0; padding: 12px 20px; background: #f9f7f2; font-style: italic; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
            th { background: #0f4c3a; color: white; }
            tr:nth-child(even) { background: #f9f7f2; }
            hr { border: none; border-top: 1px solid #ddd; margin: 32px 0; }
          </style>
        </head>
        <body>
          <h1 style="text-align: center; border: none;">Executive Leadership Mastery Program</h1>
          <p style="text-align: center; color: #c9a227; font-weight: bold;">Complete Course Content • 33 Modules • CPD Accredited</p>
          <hr>
          ${allContent}
          <div style="margin-top: 40px; text-align: center; font-size: 12px; color: #666;">
            <p>© Bright Business Solutions • Executive Leadership Mastery Program</p>
          </div>
        </body>
        </html>
      `);
      printWindow.document.close();
      setTimeout(() => {
        printWindow.print();
        setExporting(null);
      }, 500);
    } else {
      setExporting(null);
    }
  };

  const convertMarkdownToHTML = (markdown: string): string => {
    let html = markdown
      // Escape HTML
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      // Headers
      .replace(/^#### (.+)$/gm, "<h4>$1</h4>")
      .replace(/^### (.+)$/gm, "<h3>$1</h3>")
      .replace(/^## (.+)$/gm, "<h2>$1</h2>")
      .replace(/^# (.+)$/gm, "<h1>$1</h1>")
      // Bold and italic
      .replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>")
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      // Horizontal rules
      .replace(/^---$/gm, "<hr>")
      // Lists - simplified approach
      .replace(/^- (.+)$/gm, "<li>$1</li>")
      .replace(/^\d+\. (.+)$/gm, "<li>$1</li>")
      // Blockquotes
      .replace(/^> (.+)$/gm, "<blockquote>$1</blockquote>")
      // Paragraphs (lines with content that aren't already HTML)
      .replace(/^(?!<[h|l|b|u|o|t|d|p|/])(.+)$/gm, (match) => {
        if (match.trim() && !match.startsWith("<")) {
          return `<p>${match}</p>`;
        }
        return match;
      })
      // Clean up consecutive list items into ul
      .replace(/(<li>.*<\/li>\n?)+/g, (match) => `<ul>${match}</ul>`)
      // Clean up empty paragraphs
      .replace(/<p>\s*<\/p>/g, "")
      // Clean up multiple line breaks
      .replace(/\n{3,}/g, "\n\n");
    
    return html;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-32 pb-20">
        <div className="container max-w-5xl mx-auto px-4">
          {/* Back Link */}
          <Link 
            to="/courses" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Courses
          </Link>

          {/* Header */}
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">
              <Package className="h-3 w-3 mr-1" />
              Thinkific Export Tool
            </Badge>
            <h1 className="text-3xl md:text-4xl font-serif font-semibold text-foreground mb-4">
              Export Modules for Thinkific
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
              Parse the Executive Leadership Mastery content and export individual modules as PDF files for bulk upload to Thinkific.
            </p>
            
            {/* Quick Downloads */}
            <div className="flex flex-wrap justify-center gap-3 mb-4">
              <div className="inline-flex items-center rounded-lg bg-secondary/10 overflow-hidden">
                <a
                  href="/downloads/executive-leadership-mastery-introduction.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 text-secondary hover:bg-secondary/20 transition-colors text-sm font-medium"
                >
                  <BookOpen className="h-4 w-4" />
                  Course Introduction
                </a>
                <button
                  onClick={() => {
                    const printWindow = window.open("/downloads/executive-leadership-mastery-introduction.html", "_blank");
                    if (printWindow) {
                      printWindow.onload = () => {
                        setTimeout(() => printWindow.print(), 300);
                      };
                    }
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-secondary hover:bg-secondary/20 transition-colors text-sm font-medium border-l border-secondary/20"
                  title="Download as PDF"
                >
                  <Printer className="h-4 w-4" />
                </button>
              </div>
              <div className="inline-flex items-center rounded-lg bg-primary/10 overflow-hidden">
                <a
                  href="/downloads/executive-leadership-mastery-overview.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 text-primary hover:bg-primary/20 transition-colors text-sm font-medium"
                >
                  <FileText className="h-4 w-4" />
                  Course Overview
                </a>
                <button
                  onClick={() => {
                    const printWindow = window.open("/downloads/executive-leadership-mastery-overview.html", "_blank");
                    if (printWindow) {
                      printWindow.onload = () => {
                        setTimeout(() => printWindow.print(), 300);
                      };
                    }
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-primary hover:bg-primary/20 transition-colors text-sm font-medium border-l border-primary/20"
                  title="Download as PDF"
                >
                  <Printer className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            {/* Production Documents */}
            <p className="text-sm text-muted-foreground mb-3">Internal Production Documents:</p>
            <div className="flex flex-wrap justify-center gap-3">
              <a
                href="/downloads/video-scripts-internal.html"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-500/10 text-orange-600 hover:bg-orange-500/20 transition-colors text-sm font-medium border border-orange-500/20"
              >
                <Video className="h-4 w-4" />
                Video Scripts (Internal)
              </a>
              <a
                href="/downloads/quiz-export-thinkific.html"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-500/10 text-indigo-600 hover:bg-indigo-500/20 transition-colors text-sm font-medium border border-indigo-500/20"
              >
                <HelpCircle className="h-4 w-4" />
                Quiz Export (Thinkific)
              </a>
            </div>
          </div>

          {/* Parse Button */}
          {!parsed && (
            <Card className="mb-8">
              <CardContent className="pt-6">
                <div className="text-center">
                  <FileText className="h-12 w-12 mx-auto text-primary mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Parse Course Content</h3>
                  <p className="text-muted-foreground mb-6">
                    Click below to parse the markdown file and split it into individual modules.
                  </p>
                  <Button onClick={parseMarkdown} disabled={loading} size="lg">
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Parsing...
                      </>
                    ) : (
                      <>
                        <FileText className="h-4 w-4 mr-2" />
                        Parse Markdown File
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Modules List */}
          {parsed && modules.length > 0 && (
            <>
              {/* Export All Button */}
              <Card className="mb-8 border-primary/20 bg-primary/5">
                <CardContent className="pt-6">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                        {modules.length} Modules Parsed Successfully
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Export all modules as a single PDF or download individually below.
                      </p>
                    </div>
                    <Button 
                      onClick={downloadAllModules} 
                      disabled={exporting !== null}
                      size="lg"
                      className="shrink-0"
                    >
                      {exporting === -1 ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Preparing...
                        </>
                      ) : (
                        <>
                          <Download className="h-4 w-4 mr-2" />
                          Export All as PDF
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Individual Modules Grid */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {modules.map((module) => (
                  <Card key={module.number} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <Badge variant="secondary" className="mb-2">
                          Module {module.number}
                        </Badge>
                      </div>
                      <CardTitle className="text-base leading-tight">
                        {module.title}
                      </CardTitle>
                      <CardDescription className="text-xs">
                        {Math.round(module.content.length / 1000)}k characters
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        onClick={() => downloadModuleAsPDF(module)}
                        disabled={exporting !== null}
                      >
                        {exporting === module.number ? (
                          <>
                            <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                            Exporting...
                          </>
                        ) : (
                          <>
                            <Download className="h-3 w-3 mr-2" />
                            Export PDF
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Instructions */}
              <Card className="mt-8">
                <CardHeader>
                  <CardTitle className="text-lg text-foreground">How to Upload to Thinkific</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                  <p><strong className="text-foreground">1.</strong> Click "Export PDF" on each module (or "Export All" for one file)</p>
                  <p><strong className="text-foreground">2.</strong> In the print dialog, select "Save as PDF" as the destination</p>
                  <p><strong className="text-foreground">3.</strong> Save each file with a clear name (e.g., "Module-01-What-is-Leadership.pdf")</p>
                  <p><strong className="text-foreground">4.</strong> In Thinkific: Go to Products → Courses → Your Course → Curriculum</p>
                  <p><strong className="text-foreground">5.</strong> Use the Content Uploader to bulk upload PDFs as lesson content</p>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ThinkificExport;
