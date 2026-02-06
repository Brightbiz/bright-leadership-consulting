import { describe, it, expect } from "vitest";
import { generateFillableWorkbookPDF } from "@/utils/fillablePdfGenerator";

describe("fillablePdfGenerator", () => {
  it("should generate a PDF with form fields", async () => {
    const mockModule = {
      number: 1,
      title: "Test Module",
      lessons: [
        {
          lessonNumber: "1.1",
          title: "Test Lesson",
          content: "This is **key concept** test content with some **important terms**.",
        },
      ],
      fullContent: "### Case Study: Test Case\nSome case study content here.",
    };

    const pdfBytes = await generateFillableWorkbookPDF(mockModule);
    
    expect(pdfBytes).toBeInstanceOf(Uint8Array);
    expect(pdfBytes.length).toBeGreaterThan(0);
  });
});
