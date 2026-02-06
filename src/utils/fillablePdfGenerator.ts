import { PDFDocument, PDFFont, StandardFonts, rgb, PDFPage, PDFTextField } from 'pdf-lib';

interface LessonContent {
  lessonNumber: string;
  title: string;
  keyConcepts: string[];
  hasActivities: boolean;
  content: string;
}

interface ModuleData {
  number: number;
  title: string;
  lessons: Array<{
    lessonNumber: string;
    title: string;
    content: string;
  }>;
  fullContent: string;
}

// Color definitions matching brand
const COLORS = {
  primary: rgb(0.059, 0.298, 0.227), // #0f4c3a
  accent: rgb(0.788, 0.635, 0.153), // #c9a227
  text: rgb(0.1, 0.1, 0.1),
  muted: rgb(0.4, 0.4, 0.4),
  white: rgb(1, 1, 1),
  lightBg: rgb(0.97, 0.97, 0.97),
  greenBg: rgb(0.91, 0.96, 0.91),
};

const PAGE_WIDTH = 595.28; // A4 width in points
const PAGE_HEIGHT = 841.89; // A4 height in points
const MARGIN = 50;
const CONTENT_WIDTH = PAGE_WIDTH - (MARGIN * 2);

// Sanitize text to replace unsupported characters with standard equivalents
function sanitizeText(text: string): string {
  return text
    // Smart quotes to straight quotes
    .replace(/[\u201C\u201D\u201E\u201F]/g, '"') // " " „ ‟ → "
    .replace(/[\u2018\u2019\u201A\u201B]/g, "'") // ' ' ‚ ‛ → '
    // Dashes
    .replace(/[\u2013\u2014]/g, '-') // – — → -
    // Ellipsis
    .replace(/\u2026/g, '...') // … → ...
    // Bullet points
    .replace(/[\u2022\u2023\u2043]/g, '*') // • ‣ ⁃ → *
    // Non-breaking space
    .replace(/\u00A0/g, ' ')
    // Remove any other problematic characters that Helvetica can't render
    .replace(/[^\x00-\x7F]/g, (char) => {
      // Allow common accented characters that Helvetica supports
      const allowed = 'àáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝÞ';
      return allowed.includes(char) ? char : '';
    });
}

// Helper to wrap text into lines
function wrapText(text: string, maxWidth: number, font: PDFFont, fontSize: number): string[] {
  const sanitized = sanitizeText(text);
  const words = sanitized.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const testWidth = font.widthOfTextAtSize(testLine, fontSize);

    if (testWidth > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
}

// Draw a text field (form field) on the page
function drawTextField(
  page: PDFPage,
  form: ReturnType<PDFDocument['getForm']>,
  fieldName: string,
  x: number,
  y: number,
  width: number,
  height: number,
  isMultiline: boolean = false
): PDFTextField {
  const textField = form.createTextField(fieldName);
  textField.addToPage(page, {
    x,
    y: y - height,
    width,
    height,
    borderWidth: 1,
    borderColor: rgb(0.8, 0.8, 0.8),
    backgroundColor: rgb(1, 1, 1),
  });
  
  if (isMultiline) {
    textField.enableMultiline();
  }
  
  return textField;
}

// Draw section header
function drawSectionHeader(
  page: PDFPage,
  text: string,
  y: number,
  font: PDFFont,
  boldFont: PDFFont,
  icon?: string
) {
  // Draw background rectangle
  page.drawRectangle({
    x: MARGIN,
    y: y - 30,
    width: CONTENT_WIDTH,
    height: 35,
    color: COLORS.primary,
  });

  // Draw text
  page.drawText(text, {
    x: MARGIN + 15,
    y: y - 22,
    size: 14,
    font: boldFont,
    color: COLORS.white,
  });

  return y - 50;
}

// Draw subsection header
function drawSubsectionHeader(
  page: PDFPage,
  text: string,
  y: number,
  font: PDFFont,
  icon?: string
) {
  page.drawText(text, {
    x: MARGIN,
    y,
    size: 12,
    font,
    color: COLORS.primary,
  });

  return y - 20;
}

// Extract lesson content for workbook
function extractLessonContent(lessons: ModuleData['lessons']): LessonContent[] {
  return lessons.map(lesson => {
    const keyConceptMatches = lesson.content.match(/\*\*([^*]+)\*\*/g) || [];
    const keyConcepts = keyConceptMatches
      .map(m => sanitizeText(m.replace(/\*\*/g, '').trim()))
      .filter(c => c.length > 5 && c.length < 60)
      .slice(0, 5);
    
    const activityMatches = lesson.content.match(/activity|exercise|reflection|practice|discuss|consider|think about|write down/gi) || [];
    
    return {
      lessonNumber: lesson.lessonNumber,
      title: sanitizeText(lesson.title),
      keyConcepts,
      hasActivities: activityMatches.length > 0,
      content: lesson.content,
    };
  });
}

// Extract case study title
function extractCaseStudyTitle(fullContent: string): string | null {
  const match = fullContent.match(/### Case Study[:\s]*([\s\S]*?)(?=\n### |\n---\n|$)/i);
  if (match) {
    const title = match[1].split('\n')[0]?.replace(/^\*\*|\*\*$/g, '').trim() || 'Case Study';
    return sanitizeText(title);
  }
  return null;
}

// Extract role-play title  
function extractRolePlayTitle(fullContent: string): string | null {
  const match = fullContent.match(/### Role-Play[:\s]*([\s\S]*?)(?=\n### |\n---\n|$)/i);
  if (match) {
    const title = match[1].split('\n')[0]?.replace(/^\*\*|\*\*$/g, '').trim() || 'Role-Play Exercise';
    return sanitizeText(title);
  }
  return null;
}

export async function generateFillableWorkbookPDF(module: ModuleData): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const form = pdfDoc.getForm();
  
  // Embed fonts
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const helveticaOblique = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);
  
  const lessonsContent = extractLessonContent(module.lessons);
  const caseStudyTitle = extractCaseStudyTitle(module.fullContent);
  const rolePlayTitle = extractRolePlayTitle(module.fullContent);
  
  let fieldCounter = 0;
  const createFieldName = (prefix: string) => `${prefix}_${module.number}_${fieldCounter++}`;

  // ============ COVER PAGE ============
  let coverPage = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  
  // Dark green background
  coverPage.drawRectangle({
    x: 0,
    y: 0,
    width: PAGE_WIDTH,
    height: PAGE_HEIGHT,
    color: COLORS.primary,
  });
  
  // Module badge
  const badgeText = `MODULE ${module.number} OF 33`;
  const badgeWidth = helvetica.widthOfTextAtSize(badgeText, 10) + 40;
  coverPage.drawRectangle({
    x: (PAGE_WIDTH - badgeWidth) / 2,
    y: PAGE_HEIGHT - 150,
    width: badgeWidth,
    height: 28,
    borderColor: COLORS.accent,
    borderWidth: 1,
    color: rgb(0.788, 0.635, 0.153),
    opacity: 0.2,
  });
  coverPage.drawText(badgeText, {
    x: (PAGE_WIDTH - helvetica.widthOfTextAtSize(badgeText, 10)) / 2,
    y: PAGE_HEIGHT - 141,
    size: 10,
    font: helvetica,
    color: COLORS.accent,
  });
  
  // Title
  const titleLines = wrapText(module.title, CONTENT_WIDTH - 40, helveticaBold, 32);
  let titleY = PAGE_HEIGHT - 220;
  for (const line of titleLines) {
    const lineWidth = helveticaBold.widthOfTextAtSize(line, 32);
    coverPage.drawText(line, {
      x: (PAGE_WIDTH - lineWidth) / 2,
      y: titleY,
      size: 32,
      font: helveticaBold,
      color: COLORS.white,
    });
    titleY -= 40;
  }
  
  // Subtitle
  const subtitle = 'Interactive Learning Workbook';
  coverPage.drawText(subtitle, {
    x: (PAGE_WIDTH - helvetica.widthOfTextAtSize(subtitle, 16)) / 2,
    y: titleY - 20,
    size: 16,
    font: helvetica,
    color: rgb(0.9, 0.9, 0.9),
  });
  
  // Features
  const features = 'Reflection Exercises - Action Planning - Key Concepts Summary';
  coverPage.drawText(features, {
    x: (PAGE_WIDTH - helvetica.widthOfTextAtSize(features, 11)) / 2,
    y: titleY - 50,
    size: 11,
    font: helvetica,
    color: rgb(0.7, 0.7, 0.7),
  });
  
  // Divider line
  coverPage.drawLine({
    start: { x: PAGE_WIDTH / 2 - 60, y: titleY - 80 },
    end: { x: PAGE_WIDTH / 2 + 60, y: titleY - 80 },
    thickness: 2,
    color: COLORS.accent,
  });
  
  // Footer info
  const footerTexts = [
    'Executive Leadership Mastery Program',
    'CPD Accredited • 66 CPD Points Total',
    '© Bright Leadership Consulting',
  ];
  let footerY = 120;
  for (const text of footerTexts) {
    coverPage.drawText(text, {
      x: (PAGE_WIDTH - helvetica.widthOfTextAtSize(text, 10)) / 2,
      y: footerY,
      size: 10,
      font: helvetica,
      color: rgb(0.6, 0.6, 0.6),
    });
    footerY -= 18;
  }

  // ============ INTRODUCTION PAGE ============
  let introPage = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  let y = PAGE_HEIGHT - MARGIN;
  
  // Title
  introPage.drawText('How to Use This Workbook', {
    x: MARGIN,
    y,
    size: 24,
    font: helveticaBold,
    color: COLORS.primary,
  });
  
  // Underline
  introPage.drawLine({
    start: { x: MARGIN, y: y - 8 },
    end: { x: MARGIN + 280, y: y - 8 },
    thickness: 3,
    color: COLORS.accent,
  });
  
  y -= 50;
  
  const introText = `This workbook is designed to help you actively engage with the material in Module ${module.number}. For maximum benefit, complete each section as you progress through the lessons.`;
  const introLines = wrapText(introText, CONTENT_WIDTH, helvetica, 11);
  for (const line of introLines) {
    introPage.drawText(line, {
      x: MARGIN,
      y,
      size: 11,
      font: helvetica,
      color: COLORS.text,
    });
    y -= 16;
  }
  
  y -= 20;
  
  // Instructions boxes
  const instructions = [
    { icon: '1', title: 'Before Each Lesson', text: 'Review the key concepts listed and set your learning intention.' },
    { icon: '2', title: 'During Each Lesson', text: 'Take notes in the spaces provided. Capture insights, questions, and ideas.' },
    { icon: '3', title: 'After Each Lesson', text: 'Complete the reflection questions and action planning sections.' },
    { icon: '4', title: 'At Module End', text: 'Summarize your key takeaways and commit to specific actions.' },
  ];
  
  for (const instr of instructions) {
    // Box background
    introPage.drawRectangle({
      x: MARGIN,
      y: y - 50,
      width: CONTENT_WIDTH,
      height: 55,
      color: COLORS.lightBg,
      borderColor: rgb(0.85, 0.85, 0.85),
      borderWidth: 1,
    });
    
    // Left accent bar
    introPage.drawRectangle({
      x: MARGIN,
      y: y - 50,
      width: 4,
      height: 55,
      color: COLORS.primary,
    });
    
    introPage.drawText(instr.title, {
      x: MARGIN + 15,
      y: y - 18,
      size: 12,
      font: helveticaBold,
      color: COLORS.primary,
    });
    
    introPage.drawText(instr.text, {
      x: MARGIN + 15,
      y: y - 38,
      size: 10,
      font: helvetica,
      color: COLORS.muted,
    });
    
    y -= 65;
  }
  
  y -= 20;
  
  // Learning commitment section with fillable fields
  introPage.drawRectangle({
    x: MARGIN,
    y: y - 100,
    width: CONTENT_WIDTH,
    height: 105,
    color: COLORS.greenBg,
    borderColor: rgb(0.65, 0.84, 0.65),
    borderWidth: 1,
  });
  
  introPage.drawText('MY LEARNING COMMITMENT', {
    x: MARGIN + 15,
    y: y - 20,
    size: 12,
    font: helveticaBold,
    color: rgb(0.18, 0.49, 0.2),
  });
  
  introPage.drawText('I will complete this module by:', {
    x: MARGIN + 15,
    y: y - 45,
    size: 10,
    font: helvetica,
    color: COLORS.text,
  });
  
  await drawTextField(introPage, form, createFieldName('commitment_date'), MARGIN + 200, y - 35, 280, 20);
  
  introPage.drawText('My primary goal for this module:', {
    x: MARGIN + 15,
    y: y - 75,
    size: 10,
    font: helvetica,
    color: COLORS.text,
  });
  
  await drawTextField(introPage, form, createFieldName('commitment_goal'), MARGIN + 200, y - 65, 280, 20);

  // ============ LESSON PAGES ============
  for (let lessonIdx = 0; lessonIdx < lessonsContent.length; lessonIdx++) {
    const lesson = lessonsContent[lessonIdx];
    let lessonPage = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    y = PAGE_HEIGHT - MARGIN;
    
    // Section header
    y = drawSectionHeader(lessonPage, `Lesson ${lesson.lessonNumber}: ${lesson.title}`, y, helvetica, helveticaBold);
    
    // Key concepts
    if (lesson.keyConcepts.length > 0) {
      y -= 10;
      lessonPage.drawRectangle({
        x: MARGIN,
        y: y - (lesson.keyConcepts.length * 18 + 45),
        width: CONTENT_WIDTH,
        height: lesson.keyConcepts.length * 18 + 50,
        color: rgb(1, 0.98, 0.94),
        borderColor: COLORS.accent,
        borderWidth: 1,
      });
      
      lessonPage.drawText('KEY CONCEPTS TO MASTER', {
        x: MARGIN + 15,
        y: y - 20,
        size: 11,
        font: helveticaBold,
        color: rgb(0.55, 0.44, 0.1),
      });
      
      y -= 40;
      for (const concept of lesson.keyConcepts) {
        lessonPage.drawText(`• ${concept}`, {
          x: MARGIN + 20,
          y,
          size: 10,
          font: helvetica,
          color: COLORS.muted,
        });
        y -= 18;
      }
      y -= 15;
    }
    
    // Notes section with fillable field
    y -= 10;
    lessonPage.drawText('MY NOTES', {
      x: MARGIN,
      y,
      size: 12,
      font: helveticaBold,
      color: COLORS.primary,
    });
    y -= 15;
    
    await drawTextField(lessonPage, form, createFieldName(`notes_${lesson.lessonNumber}`), MARGIN, y, CONTENT_WIDTH, 100, true);
    y -= 115;
    
    // Reflection questions
    y -= 10;
    lessonPage.drawRectangle({
      x: MARGIN,
      y: y - 180,
      width: CONTENT_WIDTH,
      height: 185,
      borderColor: COLORS.primary,
      borderWidth: 2,
      opacity: 0,
    });
    
    lessonPage.drawText('REFLECTION QUESTIONS', {
      x: MARGIN + 10,
      y: y - 15,
      size: 12,
      font: helveticaBold,
      color: COLORS.primary,
    });
    
    lessonPage.drawText('How does this lesson relate to my current leadership challenges?', {
      x: MARGIN + 10,
      y: y - 35,
      size: 10,
      font: helveticaOblique,
      color: COLORS.muted,
    });
    
    await drawTextField(lessonPage, form, createFieldName(`reflect1_${lesson.lessonNumber}`), MARGIN + 10, y - 45, CONTENT_WIDTH - 20, 50, true);
    
    lessonPage.drawText('What is one thing I can apply immediately?', {
      x: MARGIN + 10,
      y: y - 110,
      size: 10,
      font: helveticaOblique,
      color: COLORS.muted,
    });
    
    await drawTextField(lessonPage, form, createFieldName(`reflect2_${lesson.lessonNumber}`), MARGIN + 10, y - 120, CONTENT_WIDTH - 20, 50, true);
    
    y -= 195;
    
    // Action items
    if (y > 200) {
      y -= 10;
      lessonPage.drawRectangle({
        x: MARGIN,
        y: y - 110,
        width: CONTENT_WIDTH,
        height: 115,
        color: COLORS.greenBg,
        borderColor: rgb(0.65, 0.84, 0.65),
        borderWidth: 1,
      });
      
      lessonPage.drawText('ACTION ITEMS FROM THIS LESSON', {
        x: MARGIN + 10,
        y: y - 18,
        size: 11,
        font: helveticaBold,
        color: rgb(0.18, 0.49, 0.2),
      });
      
      for (let i = 1; i <= 3; i++) {
        const itemY = y - 25 - (i * 25);
        // Checkbox square
        lessonPage.drawRectangle({
          x: MARGIN + 10,
          y: itemY - 12,
          width: 14,
          height: 14,
          borderColor: rgb(0.18, 0.49, 0.2),
          borderWidth: 1.5,
        });
        
        await drawTextField(lessonPage, form, createFieldName(`action${i}_${lesson.lessonNumber}`), MARGIN + 30, itemY, CONTENT_WIDTH - 50, 18);
      }
    }
  }

  // ============ CASE STUDY PAGE ============
  if (caseStudyTitle) {
    let casePage = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    y = PAGE_HEIGHT - MARGIN;
    
    // Purple header for case study
    casePage.drawRectangle({
      x: MARGIN,
      y: y - 30,
      width: CONTENT_WIDTH,
      height: 35,
      color: rgb(0.49, 0.23, 0.93),
    });
    
    casePage.drawText(`CASE STUDY: ${caseStudyTitle}`, {
      x: MARGIN + 15,
      y: y - 22,
      size: 13,
      font: helveticaBold,
      color: COLORS.white,
    });
    
    y -= 60;
    
    // Analysis questions with fillable fields
    const caseQuestions = [
      'What is the key issue or challenge presented in this case?',
      'What leadership principles from this module apply here?',
      'What would I do differently or the same as the leader in this case?',
    ];
    
    for (const question of caseQuestions) {
      casePage.drawText(question, {
        x: MARGIN,
        y,
        size: 10,
        font: helveticaOblique,
        color: COLORS.muted,
      });
      y -= 15;
      
      await drawTextField(casePage, form, createFieldName('case_analysis'), MARGIN, y, CONTENT_WIDTH, 60, true);
      y -= 75;
    }
    
    // Key lessons section
    y -= 10;
    casePage.drawRectangle({
      x: MARGIN,
      y: y - 100,
      width: CONTENT_WIDTH,
      height: 105,
      color: rgb(0.93, 0.91, 0.99),
      borderColor: rgb(0.77, 0.71, 0.99),
      borderWidth: 1,
    });
    
    casePage.drawText('KEY LESSONS FROM THIS CASE', {
      x: MARGIN + 10,
      y: y - 18,
      size: 11,
      font: helveticaBold,
      color: rgb(0.49, 0.23, 0.93),
    });
    
    for (let i = 1; i <= 3; i++) {
      const itemY = y - 20 - (i * 25);
      casePage.drawRectangle({
        x: MARGIN + 10,
        y: itemY - 12,
        width: 14,
        height: 14,
        borderColor: rgb(0.49, 0.23, 0.93),
        borderWidth: 1.5,
      });
      
      await drawTextField(casePage, form, createFieldName(`case_lesson_${i}`), MARGIN + 30, itemY, CONTENT_WIDTH - 50, 18);
    }
  }

  // ============ ROLE-PLAY PAGE ============
  if (rolePlayTitle) {
    let rolePage = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    y = PAGE_HEIGHT - MARGIN;
    
    // Orange header for role-play
    rolePage.drawRectangle({
      x: MARGIN,
      y: y - 30,
      width: CONTENT_WIDTH,
      height: 35,
      color: rgb(0.92, 0.35, 0.05),
    });
    
    rolePage.drawText(`ROLE-PLAY: ${rolePlayTitle}`, {
      x: MARGIN + 15,
      y: y - 22,
      size: 13,
      font: helveticaBold,
      color: COLORS.white,
    });
    
    y -= 60;
    
    // Preparation notes
    rolePage.drawText('Preparation Notes', {
      x: MARGIN,
      y,
      size: 12,
      font: helveticaBold,
      color: rgb(0.92, 0.35, 0.05),
    });
    y -= 10;
    
    rolePage.drawText('Before practicing this role-play, consider:', {
      x: MARGIN,
      y,
      size: 10,
      font: helvetica,
      color: COLORS.muted,
    });
    y -= 15;
    
    await drawTextField(rolePage, form, createFieldName('roleplay_prep'), MARGIN, y, CONTENT_WIDTH, 80, true);
    y -= 100;
    
    // Practice reflection
    const rpQuestions = [
      { q: 'What went well during the role-play?', height: 50 },
      { q: 'What would I do differently next time?', height: 50 },
      { q: 'What feedback did I receive?', height: 50 },
    ];
    
    rolePage.drawText('PRACTICE REFLECTION', {
      x: MARGIN,
      y,
      size: 12,
      font: helveticaBold,
      color: COLORS.primary,
    });
    y -= 25;
    
    for (const item of rpQuestions) {
      rolePage.drawText(item.q, {
        x: MARGIN,
        y,
        size: 10,
        font: helveticaOblique,
        color: COLORS.muted,
      });
      y -= 15;
      
      await drawTextField(rolePage, form, createFieldName('roleplay_reflect'), MARGIN, y, CONTENT_WIDTH, item.height, true);
      y -= item.height + 15;
    }
  }

  // ============ MODULE SUMMARY PAGE ============
  let summaryPage = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  y = PAGE_HEIGHT - MARGIN;
  
  // Gold header for summary
  summaryPage.drawRectangle({
    x: MARGIN,
    y: y - 30,
    width: CONTENT_WIDTH,
    height: 35,
    color: COLORS.accent,
  });
  
  summaryPage.drawText(`MODULE ${module.number} SUMMARY`, {
    x: MARGIN + 15,
    y: y - 22,
    size: 14,
    font: helveticaBold,
    color: rgb(0.06, 0.16, 0.13),
  });
  
  y -= 60;
  
  // Top 3 Insights
  summaryPage.drawText('TOP 3 INSIGHTS', {
    x: MARGIN,
    y,
    size: 12,
    font: helveticaBold,
    color: COLORS.primary,
  });
  y -= 20;
  
  for (let i = 1; i <= 3; i++) {
    summaryPage.drawText(`${i}.`, {
      x: MARGIN,
      y,
      size: 10,
      font: helveticaBold,
      color: COLORS.text,
    });
    
    await drawTextField(summaryPage, form, createFieldName(`insight_${i}`), MARGIN + 20, y + 5, CONTENT_WIDTH - 30, 20);
    y -= 30;
  }
  
  y -= 10;
  
  // Questions I Still Have
  summaryPage.drawText('QUESTIONS I STILL HAVE', {
    x: MARGIN,
    y,
    size: 12,
    font: helveticaBold,
    color: COLORS.primary,
  });
  y -= 15;
  
  await drawTextField(summaryPage, form, createFieldName('questions_remaining'), MARGIN, y, CONTENT_WIDTH, 80, true);
  y -= 100;
  
  // 30-Day Action Plan
  summaryPage.drawRectangle({
    x: MARGIN,
    y: y - 140,
    width: CONTENT_WIDTH,
    height: 145,
    color: COLORS.greenBg,
    borderColor: rgb(0.65, 0.84, 0.65),
    borderWidth: 1,
  });
  
  summaryPage.drawText('MY 30-DAY ACTION PLAN', {
    x: MARGIN + 10,
    y: y - 18,
    size: 12,
    font: helveticaBold,
    color: rgb(0.18, 0.49, 0.2),
  });
  
  const actionWeeks = [
    'This Week (Days 1-7):',
    'Next Week (Days 8-14):',
    'Week 3 (Days 15-21):',
    'Week 4 (Days 22-30):',
  ];
  
  let actionY = y - 40;
  for (const week of actionWeeks) {
    summaryPage.drawRectangle({
      x: MARGIN + 10,
      y: actionY - 8,
      width: 12,
      height: 12,
      borderColor: rgb(0.18, 0.49, 0.2),
      borderWidth: 1.5,
    });
    
    summaryPage.drawText(week, {
      x: MARGIN + 28,
      y: actionY - 2,
      size: 9,
      font: helveticaBold,
      color: rgb(0.18, 0.49, 0.2),
    });
    
    await drawTextField(summaryPage, form, createFieldName('action_week'), MARGIN + 150, actionY + 5, CONTENT_WIDTH - 170, 18);
    actionY -= 28;
  }
  
  y -= 165;
  
  // Commitment statement
  if (y > 150) {
    summaryPage.drawRectangle({
      x: MARGIN,
      y: y - 110,
      width: CONTENT_WIDTH,
      height: 115,
      borderColor: COLORS.primary,
      borderWidth: 2,
    });
    
    summaryPage.drawText('MY COMMITMENT STATEMENT', {
      x: MARGIN + 10,
      y: y - 18,
      size: 12,
      font: helveticaBold,
      color: COLORS.primary,
    });
    
    summaryPage.drawText(`Based on what I've learned in Module ${module.number}, I commit to:`, {
      x: MARGIN + 10,
      y: y - 38,
      size: 10,
      font: helveticaOblique,
      color: COLORS.muted,
    });
    
    await drawTextField(summaryPage, form, createFieldName('commitment_statement'), MARGIN + 10, y - 45, CONTENT_WIDTH - 20, 50, true);
    
    summaryPage.drawText('Signed: ____________________________   Date: ________________', {
      x: MARGIN + 10,
      y: y - 102,
      size: 9,
      font: helvetica,
      color: COLORS.muted,
    });
  }

  // ============ FOOTER ON LAST PAGE ============
  const lastPage = pdfDoc.getPages()[pdfDoc.getPageCount() - 1];
  const footerText = `© Bright Leadership Consulting • Module ${module.number}: ${module.title} • Interactive Workbook`;
  lastPage.drawText(footerText, {
    x: (PAGE_WIDTH - helvetica.widthOfTextAtSize(footerText, 8)) / 2,
    y: 30,
    size: 8,
    font: helvetica,
    color: COLORS.muted,
  });

  // Flatten forms for better compatibility (optional - comment out if you want editable fields)
  // form.flatten();

  return await pdfDoc.save();
}

// Helper function to trigger download
export function downloadPDF(pdfBytes: Uint8Array, filename: string) {
  const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
