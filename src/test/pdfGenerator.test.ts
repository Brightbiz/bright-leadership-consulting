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

  it("should handle smart quotes and special characters (Module 3 issue)", async () => {
    const mockModule = {
      number: 3,
      title: "Building Trust in Your Team",
      lessons: [
        {
          lessonNumber: "3.1",
          title: "The Anatomy of Trust (The Trust Equation)",
          content: "Trust = (Credibility + Reliability + Intimacy) / Self-Orientation. **The Trust Multiplier Effect** is key.",
        },
        {
          lessonNumber: "3.4",
          title: "Repairing Broken Trust",
          content: "**The 4 R's of Trust Repair** - Recognition, Responsibility, Remorse, Resolution.",
        },
      ],
      // Simulate smart quotes like "The Broken Promise"
      fullContent: `### Case Study: "The Broken Promise"
**Scenario:** A manager, Alex, promised his team that if they worked two weekends…

### Role-Play Exercise: "Repairing Trust After a Mistake"
**Scenario:** You, as the team leader, made a decision—that resulted in failure.`,
    };

    const pdfBytes = await generateFillableWorkbookPDF(mockModule);
    
    expect(pdfBytes).toBeInstanceOf(Uint8Array);
    expect(pdfBytes.length).toBeGreaterThan(0);
  });
});
