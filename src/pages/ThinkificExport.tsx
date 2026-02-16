import { useState, useMemo, useEffect } from "react";
import { Navigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, FileText, Loader2, CheckCircle2, Package, ArrowLeft, BookOpen, Video, HelpCircle, Printer, Play, ClipboardList, Layers, Presentation, NotebookPen, FileDown, Copy, Eye, Archive } from "lucide-react";
import { toast } from "sonner";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { generateFillableWorkbookPDF, downloadPDF } from "@/utils/fillablePdfGenerator";
import JSZip from "jszip";

interface Module {
  number: number;
  title: string;
  content: string;
}

interface ParsedLesson {
  moduleNumber: number;
  lessonNumber: string; // e.g., "1.1", "1.2"
  title: string;
  content: string; // Full lesson content without video scripts
  videoScript: string; // Just the video script for this lesson
}

interface ParsedQuiz {
  moduleNumber: number;
  moduleTitle: string;
  content: string; // Full quiz content
  questionCount: number;
}

interface ParsedModule {
  number: number;
  title: string;
  fullContent: string;
  lessonContent: string; // Content without video scripts and quizzes
  videoScripts: string;  // Just the video script sections
  quizContent: string;   // Just the quiz section
  lessons: ParsedLesson[]; // Individual lessons
  quiz: ParsedQuiz | null; // Parsed quiz for this module
}

const ThinkificExport = () => {
  const { user, isAdmin, isLoading: authLoading } = useAdminAuth();
  const [modules, setModules] = useState<ParsedModule[]>([]);
  const [loading, setLoading] = useState(false);
  const [parsed, setParsed] = useState(false);
  const [exporting, setExporting] = useState<string | null>(null);
  const [embedBranding, setEmbedBranding] = useState(true);
  const [logoBase64, setLogoBase64] = useState<string>('');

  // Load and cache logo as base64 for offline HTML workbooks
  useEffect(() => {
    const loadLogoAsBase64 = async () => {
      try {
        // Import the logo and convert to base64
        const logoModule = await import('@/assets/bbs-logo.png');
        const response = await fetch(logoModule.default);
        const blob = await response.blob();
        const reader = new FileReader();
        reader.onloadend = () => setLogoBase64(reader.result as string);
        reader.readAsDataURL(blob);
      } catch (error) {
        console.error('Could not load logo for embedding:', error);
      }
    };
    loadLogoAsBase64();
  }, []);

  // Count stats - must be before any returns
  const stats = useMemo(() => {
    if (!parsed) return { lessons: 0, scripts: 0, quizzes: 0, individualLessons: 0, individualQuizzes: 0, workbooks: 0 };
    const totalIndividualLessons = modules.reduce((acc, m) => acc + m.lessons.length, 0);
    const totalIndividualQuizzes = modules.filter(m => m.quiz !== null).length;
    return {
      lessons: modules.length,
      scripts: modules.filter(m => m.videoScripts.length > 0).length,
      quizzes: modules.filter(m => m.quizContent.length > 0).length,
      individualLessons: totalIndividualLessons,
      individualQuizzes: totalIndividualQuizzes,
      workbooks: modules.length,
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

  const parseQuizFromModule = (quizContent: string, moduleNumber: number, moduleTitle: string): ParsedQuiz | null => {
    if (!quizContent || quizContent.trim().length === 0) return null;
    
    // Count questions by looking for numbered items (1., 2., etc.)
    const questionMatches = quizContent.match(/^\d+\.\s+/gm);
    const questionCount = questionMatches ? questionMatches.length : 0;
    
    return {
      moduleNumber,
      moduleTitle,
      content: quizContent,
      questionCount,
    };
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

  const extractIndividualLessons = (moduleContent: string, moduleNumber: number): ParsedLesson[] => {
    const lessons: ParsedLesson[] = [];
    
    // Match lesson headers like "### Lesson 1.1: Defining Leadership"
    const lessonRegex = /### Lesson (\d+\.\d+): (.+)/g;
    const matches = [...moduleContent.matchAll(lessonRegex)];
    
    for (let i = 0; i < matches.length; i++) {
      const match = matches[i];
      const lessonNumber = match[1];
      const lessonTitle = match[2].trim();
      
      // Get content from this lesson header to the next lesson, quiz, case study, role-play, or module separator
      const startIndex = match.index!;
      let endIndex: number;
      
      if (i < matches.length - 1) {
        endIndex = matches[i + 1].index!;
      } else {
        // Find the end - could be quiz, case study, role-play, or end of module
        const remainingContent = moduleContent.slice(startIndex);
        const endMatch = remainingContent.match(/\n### Module \d+ Quiz|\n### Case Study|\n### Role-Play|\n---\n\n# MODULE/);
        if (endMatch && endMatch.index) {
          endIndex = startIndex + endMatch.index;
        } else {
          endIndex = moduleContent.length;
        }
      }
      
      const fullLessonContent = moduleContent.slice(startIndex, endIndex).trim();
      
      // Extract video script from this lesson
      const videoScriptMatch = fullLessonContent.match(/\*\*Video Script[^*]*\*\*[\s\S]*?(?=\n\n\*\*[A-Z]|\n---|\n### |$)/);
      const videoScript = videoScriptMatch ? videoScriptMatch[0] : '';
      
      // Remove video script from lesson content
      let lessonContentOnly = fullLessonContent;
      if (videoScript) {
        lessonContentOnly = fullLessonContent.replace(videoScript, '').replace(/\n{3,}/g, '\n\n').trim();
      }
      
      lessons.push({
        moduleNumber,
        lessonNumber,
        title: lessonTitle,
        content: lessonContentOnly,
        videoScript,
      });
    }
    
    return lessons;
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
        
        const lessons = extractIndividualLessons(moduleContent, moduleNumber);
        const quizContent = extractQuizContent(moduleContent);
        const quiz = parseQuizFromModule(quizContent, moduleNumber, moduleTitle);
        
        parsedModules.push({
          number: moduleNumber,
          title: moduleTitle,
          fullContent: moduleContent,
          lessonContent: extractLessonContent(moduleContent),
          videoScripts: extractVideoScripts(moduleContent),
          quizContent,
          lessons,
          quiz,
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

  const downloadIndividualQuiz = async (quiz: ParsedQuiz) => {
    setExporting(`individual-quiz-${quiz.moduleNumber}`);
    const header = `# Module ${quiz.moduleNumber} Quiz: ${quiz.moduleTitle}\n\n`;
    generatePDFWindow(
      `Module ${quiz.moduleNumber} Quiz: ${quiz.moduleTitle}`,
      `Module ${quiz.moduleNumber} of 33 • Assessment`,
      header + quiz.content,
      'quiz'
    );
    setTimeout(() => setExporting(null), 1000);
  };

  const downloadIndividualLesson = async (lesson: ParsedLesson) => {
    setExporting(`individual-${lesson.lessonNumber}`);
    const header = `# Lesson ${lesson.lessonNumber}: ${lesson.title}\n\n`;
    generatePDFWindow(
      `Lesson ${lesson.lessonNumber}: ${lesson.title}`,
      `Module ${lesson.moduleNumber} of 33 • CPD Accredited`,
      header + lesson.content,
      'lesson'
    );
    setTimeout(() => setExporting(null), 1000);
  };

  const generatePresentationPDF = (module: ParsedModule) => {
    setExporting(`presentation-${module.number}`);
    
    interface Slide {
      type: 'title' | 'overview' | 'lesson' | 'keypoints' | 'casestudy' | 'summary';
      title: string;
      subtitle?: string;
      bullets?: string[];
      highlight?: string;
      icon?: string;
    }
    
    const slides: Slide[] = [];
    
    // 1. Title slide
    slides.push({
      type: 'title',
      title: `Module ${module.number}`,
      subtitle: module.title,
    });
    
    // 2. Overview slide - extract module learning objectives if present
    const overviewBullets: string[] = [];
    const learningObjMatch = module.fullContent.match(/learning objectives?:?([\s\S]*?)(?=\n###|\n\*\*|$)/i);
    if (learningObjMatch) {
      const objLines = learningObjMatch[1].split('\n').filter(l => l.trim().startsWith('-') || l.trim().match(/^\d+\./));
      objLines.forEach(line => {
        const cleaned = line.replace(/^[-\d.]+\s*/, '').trim();
        if (cleaned.length > 10 && overviewBullets.length < 5) {
          overviewBullets.push(cleaned);
        }
      });
    }
    if (overviewBullets.length === 0) {
      // Fallback: use lesson titles as overview
      module.lessons.slice(0, 5).forEach(lesson => {
        overviewBullets.push(`${lesson.lessonNumber}: ${lesson.title}`);
      });
    }
    slides.push({
      type: 'overview',
      title: 'Module Overview',
      subtitle: `What You'll Learn in Module ${module.number}`,
      bullets: overviewBullets,
      icon: '📋',
    });

    // 3. Create slides for each lesson with richer content
    module.lessons.forEach((lesson) => {
      const contentLines = lesson.content.split('\n').filter(line => line.trim());
      const coreConcepts: string[] = [];
      const practicalPoints: string[] = [];
      const keyTerms: string[] = [];
      const actionItems: string[] = [];
      let introContext = '';
      
      // Extract different types of content with better categorization
      contentLines.forEach((line, lineIndex) => {
        const cleanLine = line.replace(/^#+\s*/, '').replace(/^\*\*|\*\*$/g, '').replace(/^\*|-\s*/, '').replace(/^\d+\.\s*/, '').trim();
        
        // Skip headers and very short lines
        if (!cleanLine || cleanLine.length < 10 || cleanLine.startsWith('#')) return;
        
        // Capture introductory context (first substantial paragraph)
        if (lineIndex < 8 && cleanLine.length > 50 && cleanLine.length < 300 && !introContext && !line.startsWith('-') && !line.match(/^\d+\./)) {
          introContext = cleanLine;
          return;
        }
        
        // Extract bold terms as key concepts
        const boldMatches = line.match(/\*\*([^*]+)\*\*/g);
        if (boldMatches) {
          boldMatches.forEach(m => {
            const term = m.replace(/\*\*/g, '').trim();
            if (term.length > 3 && term.length < 60 && keyTerms.length < 6) {
              keyTerms.push(term);
            }
          });
        }
        
        // Categorize content by type
        const isActionable = /implement|apply|practice|exercise|try|action|step|do this|start by|begin with/i.test(cleanLine);
        const isPractical = /example|such as|for instance|in practice|real-world|scenario|situation|when you/i.test(cleanLine);
        const isCore = /key|important|essential|critical|fundamental|principle|framework|model|strategy|definition|means|refers to/i.test(cleanLine);
        
        // Truncate very long lines for readability
        const truncatedLine = cleanLine.length > 150 ? cleanLine.substring(0, 147) + '...' : cleanLine;
        
        if (isActionable && actionItems.length < 4) {
          actionItems.push(truncatedLine);
        } else if (isCore && coreConcepts.length < 6) {
          coreConcepts.push(truncatedLine);
        } else if (isPractical && practicalPoints.length < 4) {
          practicalPoints.push(truncatedLine);
        } else if (coreConcepts.length < 6 && cleanLine.length > 25) {
          coreConcepts.push(truncatedLine);
        }
      });

      // Main lesson slide with core concepts
      if (coreConcepts.length > 0 || introContext) {
        const mainBullets = coreConcepts.slice(0, 5);
        slides.push({
          type: 'lesson',
          title: `Lesson ${lesson.lessonNumber}`,
          subtitle: lesson.title,
          bullets: mainBullets,
          highlight: introContext ? (introContext.length > 120 ? introContext.substring(0, 117) + '...' : introContext) : undefined,
          icon: '📖',
        });
      }
      
      // Add practical application slide if we have practical points or action items
      const combinedPractical = [...practicalPoints, ...actionItems].slice(0, 5);
      if (combinedPractical.length >= 2) {
        slides.push({
          type: 'keypoints',
          title: 'Practical Application',
          subtitle: `Lesson ${lesson.lessonNumber} - Putting It Into Practice`,
          bullets: combinedPractical,
          icon: '🎯',
        });
      }
      
      // Add key terms slide if we found enough terms
      if (keyTerms.length >= 3) {
        slides.push({
          type: 'keypoints',
          title: 'Key Terms & Concepts',
          subtitle: `Lesson ${lesson.lessonNumber} Vocabulary`,
          bullets: keyTerms.slice(0, 6),
          icon: '💡',
        });
      }
    });
    
    // 4. Check for case study content - extract more detail
    const caseStudyMatch = module.fullContent.match(/### Case Study[:\s]*([\s\S]*?)(?=\n### |\n---\n|$)/i);
    if (caseStudyMatch) {
      const caseContent = caseStudyMatch[1];
      const caseLines = caseContent.split('\n').filter(l => l.trim());
      const caseTitle = caseLines[0]?.replace(/^\*\*|\*\*$/g, '').trim() || 'Real-World Application';
      const caseBullets: string[] = [];
      let caseContext = '';
      
      caseLines.slice(1).forEach((line, idx) => {
        const cleaned = line.replace(/^[-*]\s*/, '').replace(/^\d+\.\s*/, '').trim();
        if (!cleaned || cleaned.length < 15) return;
        
        // Capture first paragraph as context
        if (idx < 3 && cleaned.length > 40 && !caseContext && !line.startsWith('-')) {
          caseContext = cleaned.length > 140 ? cleaned.substring(0, 137) + '...' : cleaned;
          return;
        }
        
        if (cleaned.length > 15 && cleaned.length < 160 && caseBullets.length < 5) {
          caseBullets.push(cleaned.length > 140 ? cleaned.substring(0, 137) + '...' : cleaned);
        }
      });
      
      if (caseBullets.length > 0 || caseContext) {
        slides.push({
          type: 'casestudy',
          title: 'Case Study',
          subtitle: caseTitle,
          bullets: caseBullets,
          highlight: caseContext,
          icon: '📊',
        });
      }
    }
    
    // 4b. Check for role-play exercises
    const rolePlayMatch = module.fullContent.match(/### Role-Play[:\s]*([\s\S]*?)(?=\n### |\n---\n|$)/i);
    if (rolePlayMatch) {
      const rpContent = rolePlayMatch[1];
      const rpLines = rpContent.split('\n').filter(l => l.trim());
      const rpTitle = rpLines[0]?.replace(/^\*\*|\*\*$/g, '').trim() || 'Practice Scenario';
      const rpBullets: string[] = [];
      
      rpLines.slice(1).forEach(line => {
        const cleaned = line.replace(/^[-*]\s*/, '').replace(/^\d+\.\s*/, '').trim();
        if (cleaned.length > 20 && cleaned.length < 160 && rpBullets.length < 4) {
          rpBullets.push(cleaned.length > 140 ? cleaned.substring(0, 137) + '...' : cleaned);
        }
      });
      
      if (rpBullets.length > 0) {
        slides.push({
          type: 'keypoints',
          title: 'Role-Play Exercise',
          subtitle: rpTitle,
          bullets: rpBullets,
          icon: '🎭',
        });
      }
    }
    
    // 5. Summary slide with richer takeaways
    const summaryBullets = module.lessons.map(l => `✓ ${l.title}`);
    const nextModuleText = module.number < 33 ? `Continue to Module ${module.number + 1} →` : '🎓 Program Complete!';
    slides.push({
      type: 'summary',
      title: 'Module Summary',
      subtitle: `Key Takeaways from Module ${module.number}`,
      bullets: summaryBullets.slice(0, 6),
      highlight: nextModuleText,
      icon: '🎯',
    });

    // Generate HTML for presentation-style PDF with enhanced design
    const slidesHTML = slides.map((slide, index) => {
      const isTitle = slide.type === 'title';
      const isSummary = slide.type === 'summary';
      const isOverview = slide.type === 'overview';
      const isCaseStudy = slide.type === 'casestudy';
      const isKeypoints = slide.type === 'keypoints';
      
      let slideClass = 'slide';
      if (isTitle) slideClass += ' title-slide';
      if (isSummary) slideClass += ' summary-slide';
      if (isOverview) slideClass += ' overview-slide';
      if (isCaseStudy) slideClass += ' casestudy-slide';
      if (isKeypoints) slideClass += ' keypoints-slide';
      
      return `
        <div class="${slideClass}">
          <div class="decorative-corner top-left"></div>
          <div class="decorative-corner top-right"></div>
          <div class="decorative-corner bottom-left"></div>
          <div class="decorative-corner bottom-right"></div>
          <div class="slide-number">${index + 1} / ${slides.length}</div>
          <div class="brand-logo">BRIGHT LEADERSHIP</div>
          
          ${isTitle ? `
            <div class="title-content">
              <div class="module-badge">MODULE ${module.number} OF 33</div>
              <h1 class="main-title">${slide.subtitle}</h1>
              <div class="divider"></div>
              <div class="program-info">Executive Leadership Mastery Program</div>
              <div class="cpd-container">
                <div class="cpd-badge">CPD Accredited</div>
                <div class="cpd-points">66 CPD Points • 80+ Hours</div>
              </div>
            </div>
          ` : `
            <div class="content-wrapper">
              ${slide.icon ? `<div class="slide-icon">${slide.icon}</div>` : ''}
              <div class="slide-header">
                <h2 class="slide-title">${slide.title}</h2>
                ${slide.subtitle ? `<p class="slide-subtitle">${slide.subtitle}</p>` : ''}
              </div>
              ${slide.highlight && !isSummary ? `
                <div class="context-block">${slide.highlight}</div>
              ` : ''}
              ${slide.bullets ? `
                <ul class="slide-bullets ${isKeypoints ? 'keypoints-list' : ''} ${isCaseStudy ? 'casestudy-list' : ''}">
                  ${slide.bullets.map((b, i) => `<li style="animation-delay: ${i * 0.1}s">${b}</li>`).join('')}
                </ul>
              ` : ''}
              ${slide.highlight && isSummary ? `
                <div class="next-module">${slide.highlight}</div>
              ` : ''}
            </div>
          `}
        </div>
      `;
    }).join('');

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Module ${module.number}: ${module.title} - Presentation</title>
          <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
          <style>
            @page { 
              margin: 0; 
              size: A4 landscape; 
            }
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body {
              font-family: 'Inter', 'Segoe UI', sans-serif;
              background: #0a2920;
            }
            
            /* Base slide styles */
            .slide {
              width: 100%;
              height: 100vh;
              min-height: 595px;
              padding: 50px 70px;
              background: linear-gradient(145deg, #0f4c3a 0%, #0a3a2c 40%, #0d4538 100%);
              color: white;
              display: flex;
              flex-direction: column;
              justify-content: center;
              page-break-after: always;
              position: relative;
              overflow: hidden;
            }
            .slide:last-child { page-break-after: auto; }
            
            /* Decorative corners */
            .decorative-corner {
              position: absolute;
              width: 80px;
              height: 80px;
              border: 3px solid rgba(201, 162, 39, 0.3);
            }
            .top-left { top: 25px; left: 25px; border-right: none; border-bottom: none; }
            .top-right { top: 25px; right: 25px; border-left: none; border-bottom: none; }
            .bottom-left { bottom: 25px; left: 25px; border-right: none; border-top: none; }
            .bottom-right { bottom: 25px; right: 25px; border-left: none; border-top: none; }
            
            /* Brand and navigation */
            .brand-logo {
              position: absolute;
              top: 35px;
              left: 70px;
              font-size: 11px;
              letter-spacing: 3px;
              color: rgba(201, 162, 39, 0.7);
              font-weight: 600;
            }
            .slide-number {
              position: absolute;
              bottom: 35px;
              right: 70px;
              font-size: 13px;
              color: rgba(255,255,255,0.4);
              font-weight: 500;
            }
            
            /* Title slide */
            .title-slide {
              background: radial-gradient(ellipse at center, #0f4c3a 0%, #0a2920 100%);
              text-align: center;
            }
            .title-slide .decorative-corner { border-color: rgba(201, 162, 39, 0.5); }
            .title-content { text-align: center; }
            .module-badge {
              display: inline-block;
              background: rgba(201, 162, 39, 0.15);
              border: 1px solid rgba(201, 162, 39, 0.4);
              padding: 8px 24px;
              border-radius: 25px;
              font-size: 13px;
              letter-spacing: 2px;
              color: #c9a227;
              margin-bottom: 30px;
            }
            .main-title {
              font-family: 'Playfair Display', Georgia, serif;
              font-size: 52px;
              font-weight: 600;
              color: white;
              line-height: 1.2;
              margin-bottom: 25px;
              max-width: 900px;
              margin-left: auto;
              margin-right: auto;
            }
            .divider {
              width: 120px;
              height: 3px;
              background: linear-gradient(90deg, transparent, #c9a227, transparent);
              margin: 0 auto 30px;
            }
            .program-info {
              font-size: 18px;
              color: rgba(255,255,255,0.7);
              margin-bottom: 25px;
              letter-spacing: 1px;
            }
            .cpd-container { display: flex; justify-content: center; gap: 15px; align-items: center; }
            .cpd-badge {
              background: #c9a227;
              color: #0a2920;
              padding: 8px 20px;
              border-radius: 4px;
              font-size: 12px;
              font-weight: 600;
              letter-spacing: 1px;
            }
            .cpd-points {
              color: rgba(255,255,255,0.6);
              font-size: 13px;
            }
            
            /* Content slides */
            .content-wrapper {
              max-width: 1000px;
              width: 100%;
            }
            .slide-icon {
              font-size: 36px;
              margin-bottom: 15px;
            }
            .slide-header { margin-bottom: 35px; }
            .slide-title {
              font-family: 'Playfair Display', Georgia, serif;
              font-size: 38px;
              font-weight: 600;
              color: #c9a227;
              margin-bottom: 8px;
              line-height: 1.2;
            }
            .slide-subtitle {
              font-size: 20px;
              color: rgba(255,255,255,0.8);
              font-weight: 400;
            }
            
            /* Context block for introductory text */
            .context-block {
              background: rgba(201, 162, 39, 0.08);
              border-left: 4px solid rgba(201, 162, 39, 0.5);
              padding: 16px 20px;
              margin-bottom: 25px;
              font-size: 17px;
              line-height: 1.6;
              color: rgba(255,255,255,0.85);
              font-style: italic;
              border-radius: 0 8px 8px 0;
            }
            
            /* Bullet lists */
            .slide-bullets {
              list-style: none;
              padding: 0;
            }
            .slide-bullets li {
              font-size: 20px;
              line-height: 1.5;
              margin-bottom: 18px;
              padding-left: 35px;
              position: relative;
              color: rgba(255,255,255,0.9);
            }
            .slide-bullets li::before {
              content: "";
              position: absolute;
              left: 0;
              top: 10px;
              width: 8px;
              height: 8px;
              background: #c9a227;
              border-radius: 50%;
            }
            
            /* Key points slide */
            .keypoints-slide { background: linear-gradient(145deg, #1a5a45 0%, #0f4c3a 100%); }
            .keypoints-list li {
              background: rgba(201, 162, 39, 0.1);
              border-left: 4px solid #c9a227;
              padding: 15px 20px 15px 35px;
              margin-bottom: 12px;
              border-radius: 0 8px 8px 0;
              font-weight: 500;
            }
            .keypoints-list li::before { display: none; }
            
            /* Case study slide */
            .casestudy-slide { background: linear-gradient(145deg, #0d4538 0%, #0a3a2c 100%); }
            .casestudy-slide .slide-icon { font-size: 42px; }
            .casestudy-list li {
              border-bottom: 1px solid rgba(255,255,255,0.1);
              padding-bottom: 15px;
              font-style: italic;
            }
            .casestudy-list li:last-child { border-bottom: none; }
            
            /* Overview slide */
            .overview-slide .slide-bullets li::before {
              content: "→";
              background: none;
              color: #c9a227;
              font-size: 18px;
              font-weight: bold;
              top: 2px;
              width: auto;
              height: auto;
            }
            
            /* Summary slide */
            .summary-slide {
              background: radial-gradient(ellipse at bottom right, #1a5a45 0%, #0a2920 100%);
            }
            .summary-slide .slide-bullets li::before {
              content: none;
            }
            .summary-slide .slide-bullets li {
              padding-left: 0;
              font-size: 22px;
              color: rgba(255,255,255,0.95);
            }
            .next-module {
              margin-top: 40px;
              padding: 15px 30px;
              background: rgba(201, 162, 39, 0.15);
              border: 1px solid rgba(201, 162, 39, 0.4);
              display: inline-block;
              border-radius: 8px;
              color: #c9a227;
              font-weight: 500;
              font-size: 16px;
            }
            
            @media print {
              .slide {
                height: 100vh;
                page-break-after: always;
                page-break-inside: avoid;
              }
              body { background: white; }
            }
          </style>
        </head>
        <body>
          ${slidesHTML}
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
    
    setTimeout(() => setExporting(null), 1000);
  };

  // Workbook generation functions
  const generateWorkbookPDF = async (module: ParsedModule) => {
    setExporting(`workbook-pdf-${module.number}`);
    
    try {
      const pdfBytes = await generateFillableWorkbookPDF({
        number: module.number,
        title: module.title,
        lessons: module.lessons,
        fullContent: module.fullContent,
      });
      
      downloadPDF(pdfBytes, `Module-${module.number}-Workbook-${module.title.replace(/[^a-zA-Z0-9]/g, '-')}.pdf`);
    } catch (error) {
      console.error('Error generating fillable PDF:', error);
    } finally {
      setTimeout(() => setExporting(null), 500);
    }
  };

  // Generate the HTML content for a workbook (returns the HTML string)
  const generateWorkbookHTMLContent = (module: ParsedModule, withBranding: boolean = true): string => {
    // Similar content extraction as PDF version
    const lessonsContent = module.lessons.map(lesson => {
      const keyConceptMatches = lesson.content.match(/\*\*([^*]+)\*\*/g) || [];
      const keyConcepts = keyConceptMatches
        .map(m => m.replace(/\*\*/g, '').trim())
        .filter(c => c.length > 5 && c.length < 60)
        .slice(0, 5);
      
      return {
        lessonNumber: lesson.lessonNumber,
        title: lesson.title,
        keyConcepts,
      };
    });

    const caseStudyMatch = module.fullContent.match(/### Case Study[:\s]*([\s\S]*?)(?=\n### |\n---\n|$)/i);
    const rolePlayMatch = module.fullContent.match(/### Role-Play[:\s]*([\s\S]*?)(?=\n### |\n---\n|$)/i);
    
    const caseStudyTitle = caseStudyMatch ? 
      (caseStudyMatch[1].split('\n')[0]?.replace(/^\*\*|\*\*$/g, '').trim() || 'Case Study') : null;
    const rolePlayTitle = rolePlayMatch ?
      (rolePlayMatch[1].split('\n')[0]?.replace(/^\*\*|\*\*$/g, '').trim() || 'Role-Play Exercise') : null;

    // Logo HTML - use embedded base64 if branding enabled
    const logoHTML = withBranding && logoBase64 ? `
      <div class="header-logo">
        <img src="${logoBase64}" alt="Bright Leadership Consulting" class="logo-image" onerror="this.style.display='none'">
      </div>
    ` : '';

    const interactiveHTML = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Module ${module.number} Workbook: ${module.title}</title>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Inter', 'Segoe UI', sans-serif;
      background: linear-gradient(180deg, #f8fafb 0%, #f1f5f4 100%);
      min-height: 100vh;
      line-height: 1.6;
      color: #1a1a1a;
    }
    
    .header {
      background: linear-gradient(135deg, #0f4c3a 0%, #0a3a2c 100%);
      color: white;
      padding: 40px 20px;
      text-align: center;
    }
    .header-logo {
      margin-bottom: 20px;
    }
    .logo-image {
      max-height: 60px;
      width: auto;
      filter: brightness(0) invert(1);
    }
    .header-badge {
      display: inline-block;
      background: rgba(201, 162, 39, 0.2);
      border: 1px solid rgba(201, 162, 39, 0.5);
      padding: 6px 16px;
      border-radius: 20px;
      font-size: 11px;
      letter-spacing: 2px;
      color: #c9a227;
      margin-bottom: 15px;
    }
    .header h1 {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 32px;
      margin-bottom: 8px;
    }
    .header p { color: rgba(255,255,255,0.8); }
    
    .container {
      max-width: 800px;
      margin: 0 auto;
      padding: 30px 20px;
    }
    
    .progress-bar {
      background: #e5e7eb;
      height: 8px;
      border-radius: 4px;
      margin-bottom: 30px;
      overflow: hidden;
    }
    .progress-fill {
      background: linear-gradient(90deg, #0f4c3a, #1a6b52);
      height: 100%;
      width: 0%;
      transition: width 0.5s ease;
      border-radius: 4px;
    }
    .progress-text {
      text-align: center;
      font-size: 13px;
      color: #666;
      margin-bottom: 30px;
    }
    
    .section {
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
      margin-bottom: 20px;
      overflow: hidden;
    }
    .section-header {
      background: linear-gradient(90deg, #0f4c3a 0%, #1a6b52 100%);
      color: white;
      padding: 15px 20px;
      display: flex;
      align-items: center;
      gap: 12px;
      cursor: pointer;
    }
    .section-header.case-study { background: linear-gradient(90deg, #7c3aed 0%, #9333ea 100%); }
    .section-header.role-play { background: linear-gradient(90deg, #ea580c 0%, #f97316 100%); }
    .section-header.summary { background: linear-gradient(90deg, #c9a227 0%, #dab939 100%); }
    .section-header .icon { font-size: 20px; }
    .section-header h2 { font-size: 16px; margin: 0; flex: 1; }
    .section-header .toggle { font-size: 18px; transition: transform 0.3s; }
    .section-header.collapsed .toggle { transform: rotate(-90deg); }
    
    .section-content {
      padding: 20px;
      display: block;
    }
    .section-content.hidden { display: none; }
    
    .key-concepts {
      background: rgba(201, 162, 39, 0.1);
      border: 1px solid rgba(201, 162, 39, 0.3);
      padding: 15px;
      border-radius: 8px;
      margin-bottom: 20px;
    }
    .key-concepts h4 {
      color: #8b7019;
      font-size: 14px;
      margin-bottom: 10px;
    }
    .key-concepts ul { padding-left: 20px; margin: 0; }
    .key-concepts li { margin-bottom: 5px; color: #555; font-size: 14px; }
    
    .form-group {
      margin-bottom: 20px;
    }
    .form-group label {
      display: block;
      font-weight: 600;
      color: #0f4c3a;
      margin-bottom: 8px;
      font-size: 14px;
    }
    .form-group textarea {
      width: 100%;
      min-height: 100px;
      padding: 12px;
      border: 2px solid #e5e7eb;
      border-radius: 8px;
      font-family: inherit;
      font-size: 14px;
      resize: vertical;
      transition: border-color 0.2s;
    }
    .form-group textarea:focus {
      outline: none;
      border-color: #0f4c3a;
    }
    .form-group textarea.filled {
      border-color: #22c55e;
      background: rgba(34, 197, 94, 0.05);
    }
    
    .action-list { list-style: none; }
    .action-item {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      margin-bottom: 12px;
      padding: 12px;
      background: #f8f9fa;
      border-radius: 8px;
    }
    .action-item input[type="checkbox"] {
      width: 20px;
      height: 20px;
      accent-color: #0f4c3a;
      cursor: pointer;
    }
    .action-item input[type="text"] {
      flex: 1;
      padding: 8px 12px;
      border: 1px solid #ddd;
      border-radius: 6px;
      font-family: inherit;
      font-size: 14px;
    }
    .action-item input[type="text"]:focus {
      outline: none;
      border-color: #0f4c3a;
    }
    
    .btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 12px 24px;
      border: none;
      border-radius: 8px;
      font-family: inherit;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }
    .btn-primary {
      background: linear-gradient(135deg, #0f4c3a 0%, #1a6b52 100%);
      color: white;
    }
    .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(15, 76, 58, 0.3); }
    .btn-secondary {
      background: #f1f5f4;
      color: #0f4c3a;
      border: 2px solid #0f4c3a;
    }
    
    .actions-bar {
      display: flex;
      gap: 12px;
      justify-content: center;
      padding: 30px 20px;
      background: white;
      border-top: 1px solid #e5e7eb;
      position: sticky;
      bottom: 0;
    }
    
    .footer {
      text-align: center;
      padding: 30px 20px;
      color: #666;
      font-size: 13px;
    }
  </style>
</head>
<body>
  <div class="header">
    ${logoHTML}
    <div class="header-badge">MODULE ${module.number} OF 33</div>
    <h1>${module.title}</h1>
    <p>Interactive Learning Workbook</p>
  </div>
  
  <div class="container">
    <div class="progress-bar"><div class="progress-fill" id="progressFill"></div></div>
    <div class="progress-text" id="progressText">0% Complete</div>
    
    ${lessonsContent.map((lesson, idx) => `
      <div class="section" data-section="${idx + 1}">
        <div class="section-header" onclick="toggleSection(this)">
          <span class="icon">📖</span>
          <h2>Lesson ${lesson.lessonNumber}: ${lesson.title}</h2>
          <span class="toggle">▼</span>
        </div>
        <div class="section-content">
          ${lesson.keyConcepts.length > 0 ? `
            <div class="key-concepts">
              <h4>💡 Key Concepts</h4>
              <ul>${lesson.keyConcepts.map(c => `<li>${c}</li>`).join('')}</ul>
            </div>
          ` : ''}
          <div class="form-group">
            <label>📝 My Notes</label>
            <textarea placeholder="What are my key takeaways from this lesson?" onchange="updateProgress()"></textarea>
          </div>
          <div class="form-group">
            <label>💭 How does this apply to my leadership?</label>
            <textarea placeholder="Reflect on how this lesson relates to your current role..." onchange="updateProgress()"></textarea>
          </div>
          <div class="form-group">
            <label>🎯 Action Items</label>
            <ul class="action-list">
              <li class="action-item"><input type="checkbox" onchange="updateProgress()"><input type="text" placeholder="What will I do differently?"></li>
              <li class="action-item"><input type="checkbox" onchange="updateProgress()"><input type="text" placeholder="What will I practice this week?"></li>
            </ul>
          </div>
        </div>
      </div>
    `).join('')}
    
    ${caseStudyTitle ? `
      <div class="section">
        <div class="section-header case-study" onclick="toggleSection(this)">
          <span class="icon">📊</span>
          <h2>Case Study: ${caseStudyTitle}</h2>
          <span class="toggle">▼</span>
        </div>
        <div class="section-content">
          <div class="form-group">
            <label>What is the key challenge in this case?</label>
            <textarea placeholder="Identify the main issue..." onchange="updateProgress()"></textarea>
          </div>
          <div class="form-group">
            <label>What would I do differently?</label>
            <textarea placeholder="Apply the module's principles..." onchange="updateProgress()"></textarea>
          </div>
        </div>
      </div>
    ` : ''}
    
    ${rolePlayTitle ? `
      <div class="section">
        <div class="section-header role-play" onclick="toggleSection(this)">
          <span class="icon">🎭</span>
          <h2>Role-Play: ${rolePlayTitle}</h2>
          <span class="toggle">▼</span>
        </div>
        <div class="section-content">
          <div class="form-group">
            <label>Practice Reflection</label>
            <textarea placeholder="What went well? What would I change?" onchange="updateProgress()"></textarea>
          </div>
        </div>
      </div>
    ` : ''}
    
    <div class="section">
      <div class="section-header summary" onclick="toggleSection(this)">
        <span class="icon">🎯</span>
        <h2>Module Summary</h2>
        <span class="toggle">▼</span>
      </div>
      <div class="section-content">
        <div class="form-group">
          <label>Top 3 Insights from This Module</label>
          <textarea placeholder="1. &#10;2. &#10;3. " onchange="updateProgress()"></textarea>
        </div>
        <div class="form-group">
          <label>My 30-Day Commitment</label>
          <textarea placeholder="What will I commit to doing over the next 30 days?" onchange="updateProgress()"></textarea>
        </div>
      </div>
    </div>
  </div>
  
  <div class="actions-bar">
    <button class="btn btn-secondary" onclick="saveProgress()">💾 Save Progress</button>
    <button class="btn btn-primary" onclick="window.print()">🖨️ Print Workbook</button>
  </div>
  
  <div class="footer">
    <p>© Bright Leadership Consulting • Executive Leadership Mastery Program</p>
  </div>
  
  <script>
    function toggleSection(header) {
      header.classList.toggle('collapsed');
      const content = header.nextElementSibling;
      content.classList.toggle('hidden');
    }
    
    function updateProgress() {
      const textareas = document.querySelectorAll('textarea');
      const checkboxes = document.querySelectorAll('input[type="checkbox"]');
      let filled = 0;
      let total = textareas.length + checkboxes.length;
      
      textareas.forEach(ta => {
        if (ta.value.trim().length > 0) {
          filled++;
          ta.classList.add('filled');
        } else {
          ta.classList.remove('filled');
        }
      });
      checkboxes.forEach(cb => { if (cb.checked) filled++; });
      
      const percent = Math.round((filled / total) * 100);
      document.getElementById('progressFill').style.width = percent + '%';
      document.getElementById('progressText').textContent = percent + '% Complete';
      
      // Auto-save to localStorage
      saveProgress();
    }
    
    function saveProgress() {
      const data = {};
      document.querySelectorAll('textarea').forEach((ta, i) => { data['ta_' + i] = ta.value; });
      document.querySelectorAll('input[type="checkbox"]').forEach((cb, i) => { data['cb_' + i] = cb.checked; });
      document.querySelectorAll('input[type="text"]').forEach((txt, i) => { data['txt_' + i] = txt.value; });
      localStorage.setItem('workbook_module_${module.number}', JSON.stringify(data));
    }
    
    function loadProgress() {
      const saved = localStorage.getItem('workbook_module_${module.number}');
      if (saved) {
        const data = JSON.parse(saved);
        document.querySelectorAll('textarea').forEach((ta, i) => { if (data['ta_' + i]) ta.value = data['ta_' + i]; });
        document.querySelectorAll('input[type="checkbox"]').forEach((cb, i) => { if (data['cb_' + i]) cb.checked = data['cb_' + i]; });
        document.querySelectorAll('input[type="text"]').forEach((txt, i) => { if (data['txt_' + i]) txt.value = data['txt_' + i]; });
        updateProgress();
      }
    }
    
    window.onload = loadProgress;
  </script>
</body>
</html>`;

    return interactiveHTML;
  };

  // Preview workbook HTML in a new window
  const previewWorkbookHTML = (module: ParsedModule) => {
    setExporting(`workbook-preview-${module.number}`);
    const html = generateWorkbookHTMLContent(module, embedBranding);
    
    const htmlWindow = window.open("", "_blank");
    if (htmlWindow) {
      htmlWindow.document.write(html);
      htmlWindow.document.close();
    }
    
    setTimeout(() => setExporting(null), 500);
  };

  // Download workbook HTML as a file
  const downloadWorkbookHTML = (module: ParsedModule) => {
    setExporting(`workbook-download-${module.number}`);
    const html = generateWorkbookHTMLContent(module, embedBranding);
    
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Module-${module.number}-Workbook-${module.title.replace(/[^a-zA-Z0-9]/g, '-')}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    setTimeout(() => setExporting(null), 500);
  };

  // Copy workbook HTML to clipboard for Thinkific embed
  const copyWorkbookHTML = async (module: ParsedModule) => {
    setExporting(`workbook-copy-${module.number}`);
    const html = generateWorkbookHTMLContent(module, embedBranding);
    
    try {
      await navigator.clipboard.writeText(html);
      toast.success(`Module ${module.number} HTML copied!`, {
        description: "Paste into Thinkific's Multimedia Lesson editor."
      });
    } catch (err) {
      console.error('Failed to copy HTML:', err);
      // Fallback: create a temporary textarea
      const textarea = document.createElement('textarea');
      textarea.value = html;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      toast.success(`Module ${module.number} HTML copied!`, {
        description: "Paste into Thinkific's Multimedia Lesson editor."
      });
    }
    
    setTimeout(() => setExporting(null), 500);
  };

  // Generate Thinkific-safe static HTML (no JavaScript, works in embed restrictions)
  const generateThinkificEmbedCode = (module: ParsedModule): string => {
    // Extract lesson content for display
    const lessonsContent = module.lessons.map(lesson => {
      const keyConceptMatches = lesson.content.match(/\*\*([^*]+)\*\*/g) || [];
      const keyConcepts = keyConceptMatches
        .map(m => m.replace(/\*\*/g, '').trim())
        .filter(c => c.length > 5 && c.length < 60)
        .slice(0, 5);
      
      return {
        lessonNumber: lesson.lessonNumber,
        title: lesson.title,
        keyConcepts,
      };
    });

    const caseStudyMatch = module.fullContent.match(/### Case Study[:\s]*([\s\S]*?)(?=\n### |\n---\n|$)/i);
    const rolePlayMatch = module.fullContent.match(/### Role-Play[:\s]*([\s\S]*?)(?=\n### |\n---\n|$)/i);
    
    const caseStudyTitle = caseStudyMatch ? 
      (caseStudyMatch[1].split('\n')[0]?.replace(/^\*\*|\*\*$/g, '').trim() || 'Case Study') : null;
    const rolePlayTitle = rolePlayMatch ?
      (rolePlayMatch[1].split('\n')[0]?.replace(/^\*\*|\*\*$/g, '').trim() || 'Role-Play Exercise') : null;

    // Logo HTML - use embedded base64 if branding enabled
    const logoHTML = embedBranding && logoBase64 ? `
      <div style="text-align:center;margin-bottom:15px;">
        <img src="${logoBase64}" alt="Bright Leadership Consulting" style="max-height:50px;width:auto;filter:brightness(0) invert(1);" onerror="this.style.display='none'">
      </div>
    ` : '';

    // Generate static HTML with inline styles - NO JavaScript
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Module ${module.number} Workbook: ${module.title}</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Inter', sans-serif; background: #f8fafb; line-height: 1.6; color: #1a1a1a; padding: 0; }
    .header { background: linear-gradient(135deg, #0f4c3a 0%, #0a3a2c 100%); color: white; padding: 30px 20px; text-align: center; }
    .header-badge { display: inline-block; background: rgba(201, 162, 39, 0.2); border: 1px solid rgba(201, 162, 39, 0.5); padding: 5px 14px; border-radius: 20px; font-size: 11px; letter-spacing: 2px; color: #c9a227; margin-bottom: 12px; }
    .header h1 { font-size: 26px; font-weight: 700; margin-bottom: 6px; }
    .header p { color: rgba(255,255,255,0.8); font-size: 14px; }
    .container { max-width: 750px; margin: 0 auto; padding: 25px 20px; }
    .section { background: white; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); margin-bottom: 18px; overflow: hidden; }
    .section-header { background: linear-gradient(90deg, #0f4c3a 0%, #1a6b52 100%); color: white; padding: 14px 18px; font-weight: 600; font-size: 15px; }
    .section-header.case-study { background: linear-gradient(90deg, #7c3aed 0%, #9333ea 100%); }
    .section-header.role-play { background: linear-gradient(90deg, #ea580c 0%, #f97316 100%); }
    .section-header.summary { background: linear-gradient(90deg, #c9a227 0%, #dab939 100%); color: #1a1a1a; }
    .section-content { padding: 18px; }
    .key-concepts { background: rgba(201, 162, 39, 0.1); border: 1px solid rgba(201, 162, 39, 0.3); padding: 14px; border-radius: 8px; margin-bottom: 18px; }
    .key-concepts h4 { color: #8b7019; font-size: 13px; margin-bottom: 8px; font-weight: 600; }
    .key-concepts ul { padding-left: 18px; margin: 0; }
    .key-concepts li { margin-bottom: 4px; color: #555; font-size: 13px; }
    .form-group { margin-bottom: 18px; }
    .form-group label { display: block; font-weight: 600; color: #0f4c3a; margin-bottom: 8px; font-size: 14px; }
    .form-group .input-area { width: 100%; min-height: 80px; padding: 12px; border: 2px solid #e5e7eb; border-radius: 8px; background: #fafafa; font-size: 13px; color: #666; font-style: italic; }
    .footer { text-align: center; padding: 25px 20px; color: #666; font-size: 12px; }
    .print-note { background: #fef3c7; border: 1px solid #f59e0b; padding: 12px 16px; border-radius: 8px; margin-bottom: 20px; font-size: 13px; color: #92400e; text-align: center; }
    @media print { .print-note { display: none; } body { background: white; } .section { box-shadow: none; border: 1px solid #e5e7eb; } }
  </style>
</head>
<body>
  <div class="header">
    ${logoHTML}
    <div class="header-badge">MODULE ${module.number} OF 33</div>
    <h1>${module.title}</h1>
    <p>Interactive Learning Workbook</p>
  </div>
  
  <div class="container">
    <div class="print-note">
      💡 <strong>Tip:</strong> Print this workbook (Ctrl/Cmd+P) or use your browser's "Save as PDF" to complete it offline.
    </div>
    
    ${lessonsContent.map((lesson) => `
      <div class="section">
        <div class="section-header">📖 Lesson ${lesson.lessonNumber}: ${lesson.title}</div>
        <div class="section-content">
          ${lesson.keyConcepts.length > 0 ? `
            <div class="key-concepts">
              <h4>💡 Key Concepts</h4>
              <ul>${lesson.keyConcepts.map(c => `<li>${c}</li>`).join('')}</ul>
            </div>
          ` : ''}
          <div class="form-group">
            <label>📝 My Notes</label>
            <div class="input-area">What are my key takeaways from this lesson?</div>
          </div>
          <div class="form-group">
            <label>💭 How does this apply to my leadership?</label>
            <div class="input-area">Reflect on how this lesson relates to your current role...</div>
          </div>
          <div class="form-group">
            <label>🎯 Action Items</label>
            <div class="input-area">1. What will I do differently?<br><br>2. What will I practice this week?</div>
          </div>
        </div>
      </div>
    `).join('')}
    
    ${caseStudyTitle ? `
      <div class="section">
        <div class="section-header case-study">📊 Case Study: ${caseStudyTitle}</div>
        <div class="section-content">
          <div class="form-group">
            <label>What is the key challenge in this case?</label>
            <div class="input-area">Identify the main issue...</div>
          </div>
          <div class="form-group">
            <label>What would I do differently?</label>
            <div class="input-area">Apply the module's principles...</div>
          </div>
        </div>
      </div>
    ` : ''}
    
    ${rolePlayTitle ? `
      <div class="section">
        <div class="section-header role-play">🎭 Role-Play: ${rolePlayTitle}</div>
        <div class="section-content">
          <div class="form-group">
            <label>Practice Reflection</label>
            <div class="input-area">What went well? What would I change?</div>
          </div>
        </div>
      </div>
    ` : ''}
    
    <div class="section">
      <div class="section-header summary">🎯 Module Summary</div>
      <div class="section-content">
        <div class="form-group">
          <label>Top 3 Insights from This Module</label>
          <div class="input-area">1.<br><br>2.<br><br>3.</div>
        </div>
        <div class="form-group">
          <label>My 30-Day Commitment</label>
          <div class="input-area">What will I commit to doing over the next 30 days?</div>
        </div>
      </div>
    </div>
  </div>
  
  <div class="footer">
    <p>© Bright Leadership Consulting • Executive Leadership Mastery Program</p>
  </div>
</body>
</html>`;
  };

  // Download Thinkific-ready ZIP file (contains index.html with full interactivity)
  const downloadThinkificZip = async (module: ParsedModule) => {
    setExporting(`workbook-thinkific-${module.number}`);
    
    try {
      // Use the full interactive HTML (with JS) since ZIP uploads run as standalone pages
      const html = generateWorkbookHTMLContent(module, embedBranding);
      const zip = new JSZip();
      
      // Thinkific requires index.html as the entry point
      zip.file("index.html", html);
      
      // Generate the zip blob
      const blob = await zip.generateAsync({ type: "blob" });
      
      // Download the zip
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Module-${module.number}-Workbook-Thinkific.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success(`Thinkific ZIP downloaded!`, {
        description: `Upload Module-${module.number}-Workbook-Thinkific.zip to Multimedia Lesson.`
      });
    } catch (err) {
      console.error('Failed to generate ZIP:', err);
      toast.error('Failed to generate ZIP file');
    }
    
    setTimeout(() => setExporting(null), 500);
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
                          {stats.individualLessons} lessons • {stats.scripts} video scripts • {stats.individualQuizzes} quizzes • {stats.workbooks} workbooks
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Tabs defaultValue="workbooks" className="space-y-6">
                <TabsList className="grid w-full grid-cols-8">
                  <TabsTrigger value="assessments" className="gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    <span className="hidden sm:inline">Assessments</span>
                    <span className="sm:hidden">✅</span>
                  </TabsTrigger>
                  <TabsTrigger value="workbooks" className="gap-2">
                    <NotebookPen className="h-4 w-4" />
                    <span className="hidden sm:inline">Workbooks</span>
                    <span className="sm:hidden">📓</span>
                  </TabsTrigger>
                  <TabsTrigger value="individual" className="gap-2">
                    <Layers className="h-4 w-4" />
                    <span className="hidden sm:inline">Lessons</span>
                    <span className="sm:hidden">📖</span>
                  </TabsTrigger>
                  <TabsTrigger value="individual-quizzes" className="gap-2">
                    <HelpCircle className="h-4 w-4" />
                    <span className="hidden sm:inline">Quizzes</span>
                    <span className="sm:hidden">❓</span>
                  </TabsTrigger>
                  <TabsTrigger value="presentations" className="gap-2">
                    <Presentation className="h-4 w-4" />
                    <span className="hidden sm:inline">Presentations</span>
                    <span className="sm:hidden">📊</span>
                  </TabsTrigger>
                  <TabsTrigger value="videos" className="gap-2">
                    <Video className="h-4 w-4" />
                    <span className="hidden sm:inline">Scripts</span>
                    <span className="sm:hidden">🎬</span>
                  </TabsTrigger>
                  <TabsTrigger value="lessons" className="gap-2">
                    <BookOpen className="h-4 w-4" />
                    <span className="hidden sm:inline">Modules</span>
                    <span className="sm:hidden">📚</span>
                  </TabsTrigger>
                  <TabsTrigger value="quizzes" className="gap-2">
                    <ClipboardList className="h-4 w-4" />
                    <span className="hidden sm:inline">All Quizzes</span>
                    <span className="sm:hidden">📝</span>
                  </TabsTrigger>
                </TabsList>

                {/* Assessments Tab */}
                <TabsContent value="assessments" className="space-y-6">
                  <Card className="border-primary/20 bg-primary/5">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary text-primary-foreground">
                          <CheckCircle2 className="h-5 w-5" />
                        </div>
                        <div>
                          <CardTitle>Leadership Assessments</CardTitle>
                          <CardDescription>Pre-course and post-course assessments for Thinkific Multimedia lessons</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <Card className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <Badge variant="secondary" className="w-fit mb-2">Pre-Course</Badge>
                        <CardTitle className="text-base">Pre-Course Leadership Assessment</CardTitle>
                        <CardDescription>20 mixed-format questions (self-rating + scenario-based) measuring baseline competencies</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="flex-1" asChild>
                            <a href="/downloads/pre-course-assessment.html" target="_blank" rel="noopener noreferrer">
                              <Eye className="h-3 w-3 mr-2" /> Preview
                            </a>
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1" asChild>
                            <a href="/downloads/pre-course-assessment.html" download="pre-course-assessment.html">
                              <Download className="h-3 w-3 mr-2" /> Download HTML
                            </a>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <Badge variant="secondary" className="w-fit mb-2">Post-Course</Badge>
                        <CardTitle className="text-base">Post-Course Leadership Assessment</CardTitle>
                        <CardDescription>20 mixed-format questions with localStorage-based growth comparison against pre-course scores</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="flex-1" asChild>
                            <a href="/downloads/post-course-assessment.html" target="_blank" rel="noopener noreferrer">
                              <Eye className="h-3 w-3 mr-2" /> Preview
                            </a>
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1" asChild>
                            <a href="/downloads/post-course-assessment.html" download="post-course-assessment.html">
                              <Download className="h-3 w-3 mr-2" /> Download HTML
                            </a>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardContent className="pt-6 space-y-2 text-sm text-muted-foreground">
                      <p><strong className="text-foreground">Thinkific Upload:</strong> Upload each HTML file as a Multimedia lesson. The pre-course assessment saves scores to localStorage, which the post-course assessment reads for the growth comparison.</p>
                      <p><strong className="text-foreground">App Pages:</strong> Authenticated versions are also available at <code>/pre-assessment</code> and <code>/post-assessment</code> with database persistence.</p>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Workbooks Tab */}
                <TabsContent value="workbooks" className="space-y-6">
                  <Card className="border-amber-500/20 bg-amber-500/5">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-amber-600 text-white">
                            <NotebookPen className="h-5 w-5" />
                          </div>
                          <div>
                            <CardTitle>Interactive Workbooks</CardTitle>
                            <CardDescription>{stats.workbooks} module workbooks with reflection exercises, action planning templates & key concepts</CardDescription>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex flex-wrap gap-2 mb-4">
                        <Badge variant="outline" className="bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800">
                          ✍️ Reflection Questions
                        </Badge>
                        <Badge variant="outline" className="bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800">
                          🎯 Action Planning
                        </Badge>
                        <Badge variant="outline" className="bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800">
                          💡 Key Concepts
                        </Badge>
                        <Badge variant="outline" className="bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800">
                          📊 Case Study Analysis
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800">
                        <input 
                          type="checkbox" 
                          id="embedBranding" 
                          checked={embedBranding} 
                          onChange={(e) => setEmbedBranding(e.target.checked)}
                          className="w-4 h-4 accent-amber-600"
                        />
                        <label htmlFor="embedBranding" className="text-sm text-amber-800 dark:text-amber-200 cursor-pointer">
                          <span className="font-medium">Embed branding/logo</span>
                          <span className="text-amber-600 dark:text-amber-400 ml-2">(works offline, no external dependencies)</span>
                        </label>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {modules.map((module) => (
                      <Card key={`workbook-${module.number}`} className="hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <Badge variant="secondary" className="mb-2 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 border border-amber-200 dark:border-amber-700">
                              <NotebookPen className="h-3 w-3 mr-1" />
                              Module {module.number}
                            </Badge>
                          </div>
                          <CardTitle className="text-sm leading-tight line-clamp-2">
                            {module.title}
                          </CardTitle>
                          <CardDescription className="text-xs">
                            {module.lessons.length} lessons • Includes activities
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-0 space-y-2">
                          {/* Primary: Thinkific ZIP (upload to Multimedia Lesson) */}
                          <Button 
                            variant="default" 
                            size="sm" 
                            className="w-full bg-green-600 hover:bg-green-700 text-white"
                            onClick={() => downloadThinkificZip(module)}
                            disabled={exporting !== null}
                            title="Download ZIP for Thinkific Multimedia Lesson upload"
                          >
                            {exporting === `workbook-thinkific-${module.number}` ? (
                              <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                            ) : (
                              <Archive className="h-3 w-3 mr-2" />
                            )}
                            Thinkific ZIP
                          </Button>
                          
                          {/* Secondary: Fillable PDF */}
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/30"
                            onClick={() => generateWorkbookPDF(module)}
                            disabled={exporting !== null}
                          >
                            {exporting === `workbook-pdf-${module.number}` ? (
                              <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                            ) : (
                              <FileDown className="h-3 w-3 mr-2" />
                            )}
                            Fillable PDF
                          </Button>
                          
                          {/* Interactive HTML options (with JS - for standalone use) */}
                          <div className="grid grid-cols-3 gap-1">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/30"
                              onClick={() => copyWorkbookHTML(module)}
                              disabled={exporting !== null}
                              title="Copy interactive HTML (for standalone hosting)"
                            >
                              {exporting === `workbook-copy-${module.number}` ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                <Copy className="h-3 w-3" />
                              )}
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/30"
                              onClick={() => downloadWorkbookHTML(module)}
                              disabled={exporting !== null}
                              title="Download interactive HTML file"
                            >
                              {exporting === `workbook-download-${module.number}` ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                <Download className="h-3 w-3" />
                              )}
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/30"
                              onClick={() => previewWorkbookHTML(module)}
                              disabled={exporting !== null}
                              title="Preview interactive version"
                            >
                              {exporting === `workbook-preview-${module.number}` ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                <Eye className="h-3 w-3" />
                              )}
                            </Button>
                          </div>
                          <p className="text-xs text-muted-foreground text-center">
                            Interactive: 📋 Copy • 💾 Download • 👁️ Preview
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                {/* Individual Lessons Tab */}
                <TabsContent value="individual" className="space-y-6">
                  <Card className="border-primary/20 bg-primary/5">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-primary text-primary-foreground">
                            <Layers className="h-5 w-5" />
                          </div>
                          <div>
                            <CardTitle>Individual Lesson Files</CardTitle>
                            <CardDescription>{stats.individualLessons} separate lessons ready for Thinkific upload</CardDescription>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>

                  {modules.map((module) => (
                    <div key={`individual-module-${module.number}`} className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-sm">
                          Module {module.number}
                        </Badge>
                        <h3 className="font-semibold text-foreground">{module.title}</h3>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {module.lessons.map((lesson) => (
                          <Card key={`lesson-${lesson.lessonNumber}`} className="hover:shadow-md transition-shadow">
                            <CardHeader className="pb-3">
                              <div className="flex items-start justify-between">
                                <Badge variant="secondary" className="mb-2 bg-primary/10 text-primary border border-primary/20">
                                  Lesson {lesson.lessonNumber}
                                </Badge>
                              </div>
                              <CardTitle className="text-sm leading-tight line-clamp-2">
                                {lesson.title}
                              </CardTitle>
                              <CardDescription className="text-xs">
                                {Math.round(lesson.content.length / 1000)}k characters
                              </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-0">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full border-primary/20 text-primary hover:bg-primary/10"
                                onClick={() => downloadIndividualLesson(lesson)}
                                disabled={exporting !== null}
                              >
                                {exporting === `individual-${lesson.lessonNumber}` ? (
                                  <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                                ) : (
                                  <Download className="h-3 w-3 mr-2" />
                                )}
                                Export Lesson
                              </Button>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  ))}
                </TabsContent>

                {/* Individual Quizzes Tab */}
                <TabsContent value="individual-quizzes" className="space-y-6">
                  <Card className="border-internal-quiz-border bg-internal-quiz-bg/50">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-internal-quiz text-white">
                            <HelpCircle className="h-5 w-5" />
                          </div>
                          <div>
                            <CardTitle>Individual Quiz Files</CardTitle>
                            <CardDescription>{stats.individualQuizzes} separate quizzes ready for Thinkific upload</CardDescription>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>

                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {modules.filter(m => m.quiz !== null).map((module) => (
                      <Card key={`individual-quiz-${module.number}`} className="hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <Badge variant="secondary" className="mb-2 bg-internal-quiz-bg text-internal-quiz-foreground border border-internal-quiz-border">
                              <HelpCircle className="h-3 w-3 mr-1" />
                              Module {module.number} Quiz
                            </Badge>
                          </div>
                          <CardTitle className="text-sm leading-tight line-clamp-2">
                            {module.title}
                          </CardTitle>
                          <CardDescription className="text-xs">
                            {module.quiz?.questionCount || 0} questions
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full border-internal-quiz-border text-internal-quiz-foreground hover:bg-internal-quiz-bg"
                            onClick={() => module.quiz && downloadIndividualQuiz(module.quiz)}
                            disabled={exporting !== null}
                          >
                            {exporting === `individual-quiz-${module.number}` ? (
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

                {/* Presentations Tab */}
                <TabsContent value="presentations" className="space-y-6">
                  <Card className="border-secondary/30 bg-secondary/5">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-secondary text-secondary-foreground">
                            <Presentation className="h-5 w-5" />
                          </div>
                          <div>
                            <CardTitle>PowerPoint-Style Presentations</CardTitle>
                            <CardDescription>33 presentation PDFs in landscape format for each module</CardDescription>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>

                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {modules.map((module) => (
                      <Card key={`presentation-${module.number}`} className="hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <Badge variant="secondary" className="mb-2 bg-secondary/10 text-secondary-foreground border border-secondary/20">
                              <Presentation className="h-3 w-3 mr-1" />
                              Module {module.number}
                            </Badge>
                          </div>
                          <CardTitle className="text-sm leading-tight line-clamp-2">
                            {module.title}
                          </CardTitle>
                          <CardDescription className="text-xs">
                            {module.lessons.length} slides • Landscape A4
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full border-secondary/30 text-secondary-foreground hover:bg-secondary/10"
                            onClick={() => generatePresentationPDF(module)}
                            disabled={exporting !== null}
                          >
                            {exporting === `presentation-${module.number}` ? (
                              <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                            ) : (
                              <Download className="h-3 w-3 mr-2" />
                            )}
                            Export Presentation
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

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
                            <CardTitle>Full Module Content</CardTitle>
                            <CardDescription>Complete modules with all lessons combined (excludes video scripts & quizzes)</CardDescription>
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
