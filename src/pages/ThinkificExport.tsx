import { useState, useMemo } from "react";
import { Navigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, FileText, Loader2, CheckCircle2, Package, ArrowLeft, BookOpen, Video, HelpCircle, Printer, Play, ClipboardList } from "lucide-react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface Module {
  number: number;
  title: string;
  content: string;
}

interface ParsedModule {
  number: number;
  title: string;
  fullContent: string;
  lessonContent: string; // Content without video scripts and quizzes
  videoScripts: string;  // Just the video script sections
  quizContent: string;   // Just the quiz section
}

const ThinkificExport = () => {
  const { user, isAdmin, isLoading: authLoading } = useAdminAuth();
  const [modules, setModules] = useState<ParsedModule[]>([]);
  const [loading, setLoading] = useState(false);
  const [parsed, setParsed] = useState(false);
  const [exporting, setExporting] = useState<string | null>(null);

  // Count stats - must be before any returns
  const stats = useMemo(() => {
    if (!parsed) return { lessons: 0, scripts: 0, quizzes: 0 };
    return {
      lessons: modules.length,
      scripts: modules.filter(m => m.videoScripts.length > 0).length,
      quizzes: modules.filter(m => m.quizContent.length > 0).length,
    };
  }, [modules, parsed]);

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

  const extractVideoScripts = (content: string): string => {
    // Extract all "Video Script" sections from the content
    const lines = content.split('\n');
    const scriptSections: string[] = [];
    let inScript = false;
    let currentScript: string[] = [];
    let currentLesson = '';

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Track lesson headers
      if (line.match(/^### Lesson \d+\.\d+:/)) {
        currentLesson = line;
      }
      
      // Start of video script section
      if (line.includes('**Video Script') || line.match(/^\*\*Video Script/)) {
        inScript = true;
        if (currentLesson) {
          currentScript.push(currentLesson);
          currentScript.push('');
        }
        currentScript.push(line);
        continue;
      }
      
      // End of video script section (next major section)
      if (inScript && (
        line.match(/^### Lesson \d+\.\d+:/) ||
        line.match(/^### Module \d+ Quiz/) ||
        line.match(/^### Case Study/) ||
        line.match(/^### Role-Play/) ||
        line.match(/^---$/) ||
        line.match(/^## /)
      )) {
        if (currentScript.length > 0) {
          scriptSections.push(currentScript.join('\n'));
          currentScript = [];
        }
        inScript = false;
        if (line.match(/^### Lesson \d+\.\d+:/)) {
          currentLesson = line;
        }
      }
      
      if (inScript) {
        currentScript.push(line);
      }
    }
    
    // Don't forget the last script if still in one
    if (currentScript.length > 0) {
      scriptSections.push(currentScript.join('\n'));
    }

    return scriptSections.join('\n\n---\n\n');
  };

  const extractQuizContent = (content: string): string => {
    // Extract quiz section
    const quizMatch = content.match(/### Module \d+ Quiz[\s\S]*?(?=\n---|\n### Role-Play|\n### Case Study|$)/);
    if (quizMatch) {
      return quizMatch[0].trim();
    }
    return '';
  };

  const extractLessonContent = (content: string): string => {
    // Remove video script sections and quiz from content
    let cleaned = content;
    
    // Remove video scripts (everything between "**Video Script" and next section)
    cleaned = cleaned.replace(/\*\*Video Script[^*]*\*\*[\s\S]*?(?=\n\n\*\*[A-Z]|\n---|\n### |\n## |$)/g, '');
    
    // Remove quiz section
    cleaned = cleaned.replace(/### Module \d+ Quiz[\s\S]*?(?=\n---\n|$)/g, '');
    
    // Clean up extra whitespace
    cleaned = cleaned.replace(/\n{4,}/g, '\n\n\n');
    
    return cleaned.trim();
  };

  const parseMarkdown = async () => {
    setLoading(true);
    try {
      const response = await fetch("/downloads/executive-leadership-mastery-thinkific-content.md");
      const text = await response.text();
      
      // Split by module headers (# MODULE X:)
      const moduleRegex = /^# MODULE (\d+): (.+)$/gm;
      const matches = [...text.matchAll(moduleRegex)];
      
      const parsedModules: ParsedModule[] = [];
      
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
          fullContent: moduleContent,
          lessonContent: extractLessonContent(moduleContent),
          videoScripts: extractVideoScripts(moduleContent),
          quizContent: extractQuizContent(moduleContent),
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
      // Lists
      .replace(/^- (.+)$/gm, "<li>$1</li>")
      .replace(/^\d+\. (.+)$/gm, "<li>$1</li>")
      // Blockquotes
      .replace(/^> (.+)$/gm, "<blockquote>$1</blockquote>")
      // Paragraphs
      .replace(/^(?!<[h|l|b|u|o|t|d|p|/])(.+)$/gm, (match) => {
        if (match.trim() && !match.startsWith("<")) {
          return `<p>${match}</p>`;
        }
        return match;
      })
      // Clean up list items into ul
      .replace(/(<li>.*<\/li>\n?)+/g, (match) => `<ul>${match}</ul>`)
      // Clean up empty paragraphs
      .replace(/<p>\s*<\/p>/g, "")
      // Clean up multiple line breaks
      .replace(/\n{3,}/g, "\n\n");
    
    return html;
  };

  const generatePDFWindow = (title: string, subtitle: string, content: string, docType: 'lesson' | 'video' | 'quiz') => {
    const htmlContent = convertMarkdownToHTML(content);
    
    const colors = {
      lesson: { primary: '#0f4c3a', accent: '#c9a227', badge: 'Lesson Content' },
      video: { primary: '#7c3aed', accent: '#a855f7', badge: '🎬 Video Scripts' },
      quiz: { primary: '#0891b2', accent: '#06b6d4', badge: '📝 Quiz Questions' },
    };
    
    const { primary, accent, badge } = colors[docType];
    
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>${title}</title>
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
            h1 { color: ${primary}; font-size: 28px; border-bottom: 3px solid ${accent}; padding-bottom: 12px; margin-bottom: 24px; }
            h2 { color: ${primary}; font-size: 22px; margin-top: 32px; margin-bottom: 16px; }
            h3 { color: #333; font-size: 18px; margin-top: 24px; margin-bottom: 12px; }
            h4 { color: #444; font-size: 16px; margin-top: 20px; margin-bottom: 10px; }
            p { margin-bottom: 12px; }
            ul, ol { margin-bottom: 16px; padding-left: 24px; }
            li { margin-bottom: 6px; }
            strong { color: ${primary}; }
            blockquote { border-left: 4px solid ${accent}; margin: 20px 0; padding: 12px 20px; background: #f9f7f2; font-style: italic; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
            th { background: ${primary}; color: white; }
            tr:nth-child(even) { background: #f9f7f2; }
            hr { border: none; border-top: 1px solid #ddd; margin: 32px 0; }
            .header-banner {
              background: linear-gradient(135deg, ${primary} 0%, ${primary}dd 100%);
              color: white;
              padding: 30px;
              margin: -20px -20px 30px -20px;
              text-align: center;
            }
            .header-banner h1 { color: white; border: none; margin: 0; padding: 0; }
            .header-banner p { color: ${accent}; font-size: 14px; margin-top: 8px; }
            .header-banner .badge { 
              display: inline-block; 
              background: rgba(255,255,255,0.2); 
              padding: 6px 16px; 
              border-radius: 20px; 
              margin-top: 12px;
              font-size: 12px;
            }
            .footer {
              margin-top: 40px;
              padding-top: 20px;
              border-top: 2px solid ${primary};
              text-align: center;
              font-size: 12px;
              color: #666;
            }
          </style>
        </head>
        <body>
          <div class="header-banner">
            <h1>Executive Leadership Mastery Program</h1>
            <p>${subtitle}</p>
            <div class="badge">${badge}</div>
          </div>
          ${htmlContent}
          <div class="footer">
            <p>© Bright Leadership Consulting • Executive Leadership Mastery Program</p>
            <p>This material is for enrolled students only. Do not distribute.</p>
          </div>
        </body>
        </html>
      `);
      printWindow.document.close();
      
      const checkReady = setInterval(() => {
        try {
          if (printWindow.document.readyState === 'complete') {
            clearInterval(checkReady);
            setTimeout(() => printWindow.print(), 500);
          }
        } catch {
          clearInterval(checkReady);
        }
      }, 100);
      setTimeout(() => {
        clearInterval(checkReady);
        try { printWindow.print(); } catch {}
      }, 3000);
    }
  };

  const downloadModuleLessons = async (module: ParsedModule) => {
    setExporting(`lesson-${module.number}`);
    generatePDFWindow(
      `Module ${module.number}: ${module.title}`,
      `Module ${module.number} of 33 • CPD Accredited`,
      module.lessonContent,
      'lesson'
    );
    setTimeout(() => setExporting(null), 1000);
  };

  const downloadModuleScripts = async (module: ParsedModule) => {
    setExporting(`video-${module.number}`);
    const header = `# Module ${module.number}: ${module.title}\n\n## Video Recording Scripts\n\n`;
    generatePDFWindow(
      `Module ${module.number}: ${module.title} - Video Scripts`,
      `Module ${module.number} of 33 • Recording Scripts`,
      header + module.videoScripts,
      'video'
    );
    setTimeout(() => setExporting(null), 1000);
  };

  const downloadModuleQuiz = async (module: ParsedModule) => {
    setExporting(`quiz-${module.number}`);
    const header = `# Module ${module.number}: ${module.title}\n\n`;
    generatePDFWindow(
      `Module ${module.number}: ${module.title} - Quiz`,
      `Module ${module.number} of 33 • Assessment`,
      header + module.quizContent,
      'quiz'
    );
    setTimeout(() => setExporting(null), 1000);
  };

  const downloadAllOfType = async (type: 'lesson' | 'video' | 'quiz') => {
    setExporting(`all-${type}`);
    
    let allContent = '';
    const pageBreak = '\n\n<div style="page-break-after: always;"></div>\n\n';
    
    modules.forEach((module, index) => {
      let content = '';
      switch (type) {
        case 'lesson':
          content = module.lessonContent;
          break;
        case 'video':
          content = `# Module ${module.number}: ${module.title}\n\n## Video Scripts\n\n${module.videoScripts}`;
          break;
        case 'quiz':
          content = `# Module ${module.number}: ${module.title}\n\n${module.quizContent}`;
          break;
      }
      allContent += content + (index < modules.length - 1 ? pageBreak : '');
    });

    const titles = {
      lesson: 'Complete Course Content',
      video: 'All Video Scripts (165+)',
      quiz: 'All Module Quizzes',
    };

    generatePDFWindow(
      `Executive Leadership Mastery - ${titles[type]}`,
      `33 Modules • Complete ${titles[type]}`,
      allContent,
      type
    );
    
    setTimeout(() => setExporting(null), 1000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-32 pb-20">
        <div className="container max-w-6xl mx-auto px-4">
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
              Export Content for Thinkific
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
              Parse and export the Executive Leadership Mastery content as separate PDFs for video scripts, lesson content, and quizzes.
            </p>
            
            {/* Quick Downloads */}
            <div className="flex flex-wrap justify-center gap-3 mb-6">
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
                      const checkReady = setInterval(() => {
                        try {
                          if (printWindow.document.readyState === 'complete') {
                            clearInterval(checkReady);
                            setTimeout(() => printWindow.print(), 500);
                          }
                        } catch {
                          clearInterval(checkReady);
                        }
                      }, 100);
                      setTimeout(() => {
                        clearInterval(checkReady);
                        try { printWindow.print(); } catch {}
                      }, 3000);
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
                      const checkReady = setInterval(() => {
                        try {
                          if (printWindow.document.readyState === 'complete') {
                            clearInterval(checkReady);
                            setTimeout(() => printWindow.print(), 500);
                          }
                        } catch {
                          clearInterval(checkReady);
                        }
                      }, 100);
                      setTimeout(() => {
                        clearInterval(checkReady);
                        try { printWindow.print(); } catch {}
                      }, 3000);
                    }
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-primary hover:bg-primary/20 transition-colors text-sm font-medium border-l border-primary/20"
                  title="Download as PDF"
                >
                  <Printer className="h-4 w-4" />
                </button>
              </div>
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
                    Click below to parse the markdown file and extract video scripts, lesson content, and quizzes for all 33 modules.
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
                        Parse All 33 Modules
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Content Tabs */}
          {parsed && modules.length > 0 && (
            <>
              {/* Stats Banner */}
              <Card className="mb-8 border-primary/20 bg-primary/5">
                <CardContent className="pt-6">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <CheckCircle2 className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                      <div>
                        <h3 className="text-lg font-semibold">{modules.length} Modules Parsed</h3>
                        <p className="text-sm text-muted-foreground">
                          {stats.lessons} lesson sets • {stats.scripts} video script sets • {stats.quizzes} quizzes
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Tabs defaultValue="videos" className="space-y-6">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="videos" className="gap-2">
                    <Video className="h-4 w-4" />
                    <span className="hidden sm:inline">Video Scripts</span>
                    <span className="sm:hidden">Videos</span>
                  </TabsTrigger>
                  <TabsTrigger value="lessons" className="gap-2">
                    <BookOpen className="h-4 w-4" />
                    <span className="hidden sm:inline">Module Content</span>
                    <span className="sm:hidden">Content</span>
                  </TabsTrigger>
                  <TabsTrigger value="quizzes" className="gap-2">
                    <ClipboardList className="h-4 w-4" />
                    <span className="hidden sm:inline">Quizzes</span>
                    <span className="sm:hidden">Quizzes</span>
                  </TabsTrigger>
                </TabsList>

                {/* Video Scripts Tab */}
                <TabsContent value="videos" className="space-y-6">
                  <Card className="border-internal-video-border bg-internal-video-bg/50">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-internal-video text-white">
                            <Video className="h-5 w-5" />
                          </div>
                          <div>
                            <CardTitle>Video Recording Scripts</CardTitle>
                            <CardDescription>165+ teleprompter-ready scripts for all modules</CardDescription>
                          </div>
                        </div>
                        <Button 
                          onClick={() => downloadAllOfType('video')} 
                          disabled={exporting !== null}
                          className="bg-internal-video hover:bg-internal-video/90 text-white"
                        >
                          {exporting === 'all-video' ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <Download className="h-4 w-4 mr-2" />
                          )}
                          Download All Scripts
                        </Button>
                      </div>
                    </CardHeader>
                  </Card>

                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {modules.map((module) => (
                      <Card key={`video-${module.number}`} className="hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <Badge variant="secondary" className="mb-2 bg-internal-video-bg text-internal-video-foreground border border-internal-video-border">
                              <Play className="h-3 w-3 mr-1" />
                              Module {module.number}
                            </Badge>
                          </div>
                          <CardTitle className="text-sm leading-tight line-clamp-2">
                            {module.title}
                          </CardTitle>
                          <CardDescription className="text-xs">
                            ~5 video scripts
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full border-internal-video-border text-internal-video-foreground hover:bg-internal-video-bg"
                            onClick={() => downloadModuleScripts(module)}
                            disabled={exporting !== null || !module.videoScripts}
                          >
                            {exporting === `video-${module.number}` ? (
                              <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                            ) : (
                              <Download className="h-3 w-3 mr-2" />
                            )}
                            Export Scripts
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                {/* Lesson Content Tab */}
                <TabsContent value="lessons" className="space-y-6">
                  <Card className="border-internal-content-border bg-internal-content-bg/50">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-internal-content text-white">
                            <BookOpen className="h-5 w-5" />
                          </div>
                          <div>
                            <CardTitle>Module Lesson Content</CardTitle>
                            <CardDescription>Lessons, case studies & exercises (excludes video scripts & quizzes)</CardDescription>
                          </div>
                        </div>
                        <Button 
                          onClick={() => downloadAllOfType('lesson')} 
                          disabled={exporting !== null}
                          className="bg-internal-content hover:bg-internal-content/90 text-white"
                        >
                          {exporting === 'all-lesson' ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <Download className="h-4 w-4 mr-2" />
                          )}
                          Download All Content
                        </Button>
                      </div>
                    </CardHeader>
                  </Card>

                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {modules.map((module) => (
                      <Card key={`lesson-${module.number}`} className="hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <Badge variant="secondary" className="mb-2 bg-internal-content-bg text-internal-content-foreground border border-internal-content-border">
                              <BookOpen className="h-3 w-3 mr-1" />
                              Module {module.number}
                            </Badge>
                          </div>
                          <CardTitle className="text-sm leading-tight line-clamp-2">
                            {module.title}
                          </CardTitle>
                          <CardDescription className="text-xs">
                            {Math.round(module.lessonContent.length / 1000)}k characters
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full border-internal-content-border text-internal-content-foreground hover:bg-internal-content-bg"
                            onClick={() => downloadModuleLessons(module)}
                            disabled={exporting !== null}
                          >
                            {exporting === `lesson-${module.number}` ? (
                              <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                            ) : (
                              <Download className="h-3 w-3 mr-2" />
                            )}
                            Export Content
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                {/* Quizzes Tab */}
                <TabsContent value="quizzes" className="space-y-6">
                  <Card className="border-internal-quiz-border bg-internal-quiz-bg/50">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-internal-quiz text-white">
                            <ClipboardList className="h-5 w-5" />
                          </div>
                          <div>
                            <CardTitle>Module Quizzes</CardTitle>
                            <CardDescription>Assessment questions for all 33 modules</CardDescription>
                          </div>
                        </div>
                        <Button 
                          onClick={() => downloadAllOfType('quiz')} 
                          disabled={exporting !== null}
                          className="bg-internal-quiz hover:bg-internal-quiz/90 text-white"
                        >
                          {exporting === 'all-quiz' ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <Download className="h-4 w-4 mr-2" />
                          )}
                          Download All Quizzes
                        </Button>
                      </div>
                    </CardHeader>
                  </Card>

                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {modules.map((module) => (
                      <Card key={`quiz-${module.number}`} className="hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <Badge variant="secondary" className="mb-2 bg-internal-quiz-bg text-internal-quiz-foreground border border-internal-quiz-border">
                              <HelpCircle className="h-3 w-3 mr-1" />
                              Module {module.number}
                            </Badge>
                          </div>
                          <CardTitle className="text-sm leading-tight line-clamp-2">
                            {module.title}
                          </CardTitle>
                          <CardDescription className="text-xs">
                            {module.quizContent ? '4-8 questions' : 'No quiz'}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full border-internal-quiz-border text-internal-quiz-foreground hover:bg-internal-quiz-bg"
                            onClick={() => downloadModuleQuiz(module)}
                            disabled={exporting !== null || !module.quizContent}
                          >
                            {exporting === `quiz-${module.number}` ? (
                              <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                            ) : (
                              <Download className="h-3 w-3 mr-2" />
                            )}
                            Export Quiz
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>

              {/* Instructions */}
              <Card className="mt-8">
                <CardHeader>
                  <CardTitle className="text-lg text-foreground">How to Upload to Thinkific</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                  <p><strong className="text-foreground">1.</strong> Click "Export PDF" on each module or use "Download All" for combined files</p>
                  <p><strong className="text-foreground">2.</strong> In the print dialog, select "Save as PDF" as the destination</p>
                  <p><strong className="text-foreground">3.</strong> Save files with clear names (e.g., "Module-01-Leadership-Content.pdf")</p>
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
