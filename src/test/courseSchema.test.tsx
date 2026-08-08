import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Courses from "@/pages/Courses";
import ExecutiveLeadershipMastery from "@/pages/ExecutiveLeadershipMastery";
import { programmes } from "@/data/programmes";

/**
 * Build-time guard: renders the course pages and asserts the emitted JSON-LD
 * carries valid Course fields with no empty values.
 * Wired into `npm run build` via scripts/validate-course-schema.mjs.
 */

const renderPage = async (ui: React.ReactElement) => {
  render(
    <HelmetProvider>
      <MemoryRouter>{ui}</MemoryRouter>
    </HelmetProvider>
  );
  // react-helmet-async writes to document.head asynchronously, and the timing
  // varies between runs. Poll until the JSON-LD lands rather than waiting once.
  const read = () =>
    Array.from(
      document.head.querySelectorAll('script[type="application/ld+json"]')
    ).map((el) => JSON.parse(el.textContent || "{}"));

  for (let attempt = 0; attempt < 50; attempt += 1) {
    if (read().length > 0) break;
    await new Promise((r) => setTimeout(r, 10));
  }
  return read();
};

const nonEmptyString = (value: unknown) =>
  typeof value === "string" && value.trim().length > 0;

const assertValidCourse = (course: Record<string, unknown>) => {
  expect(course["@type"]).toBe("Course");
  for (const field of ["name", "description", "url"]) {
    expect(nonEmptyString(course[field]), `${field} must be a non-empty string`).toBe(true);
  }
  expect(String(course.url)).toMatch(/^https:\/\//);
  expect(course.provider).toBeTruthy();
  // No empty or null values anywhere in the node.
  const walk = (node: unknown, path: string) => {
    if (node === null || node === undefined) throw new Error(`empty value at ${path}`);
    if (typeof node === "string") {
      expect(node.trim().length, `empty string at ${path}`).toBeGreaterThan(0);
    } else if (Array.isArray(node)) {
      expect(node.length, `empty array at ${path}`).toBeGreaterThan(0);
      node.forEach((v, i) => walk(v, `${path}[${i}]`));
    } else if (typeof node === "object") {
      const entries = Object.entries(node as Record<string, unknown>);
      expect(entries.length, `empty object at ${path}`).toBeGreaterThan(0);
      entries.forEach(([k, v]) => walk(v, `${path}.${k}`));
    }
  };
  walk(course, "Course");
};

/** Accredited CPD hours must be present and match the catalogue exactly. */
const assertCpdHours = (course: Record<string, unknown>) => {
  const programme = programmes.find((p) => p.title === course.name);
  expect(programme, `no catalogue entry for ${String(course.name)}`).toBeTruthy();
  if (!programme?.cpdHours) return;

  const [min, max] = programme.cpdHours
    .match(/(\d+(?:\.\d+)?)\s*[\u2013-]\s*(\d+(?:\.\d+)?)/)!
    .slice(1)
    .map(Number);

  expect(course.timeRequired).toBe(`PT${min}H`);
  expect((course.hasCourseInstance as any).courseWorkload).toBe(`PT${max}H`);
  expect(String(course.educationalCredentialAwarded)).toContain(programme.cpdHours);

  const prop = (course.additionalProperty as any[])?.find(
    (a) => a.name === "Accredited CPD hours"
  );
  expect(prop, "additionalProperty for CPD hours missing").toBeTruthy();
  expect(prop.value).toBe(programme.cpdHours);
  expect(prop.minValue).toBe(min);
  expect(prop.maxValue).toBe(max);
};

describe("course page JSON-LD", () => {
  it("emits a complete ItemList of Courses on /courses", async () => {
    const blocks = await renderPage(<Courses />);
    const list = blocks.find((b) => b["@type"] === "ItemList");
    expect(list, "ItemList JSON-LD missing on /courses").toBeTruthy();
    expect(list.url).toMatch(/^https:\/\//);
    expect(list.numberOfItems).toBe(programmes.length);
    expect(list.itemListElement).toHaveLength(programmes.length);

    list.itemListElement.forEach((entry: Record<string, unknown>, i: number) => {
      expect(entry.position).toBe(i + 1);
      expect(nonEmptyString(entry.url)).toBe(true);
      assertValidCourse(entry.item as Record<string, unknown>);
      assertCpdHours(entry.item as Record<string, unknown>);
    });

    // Every catalogue programme is represented exactly once.
    const names = list.itemListElement.map((e: any) => e.item.name).sort();
    expect(names).toEqual(programmes.map((p) => p.title).sort());
  });

  it("emits a valid single Course node on the flagship programme page", async () => {
    const blocks = await renderPage(<ExecutiveLeadershipMastery />);
    const course = blocks.find((b) => b["@type"] === "Course");
    expect(course, "Course JSON-LD missing on the programme page").toBeTruthy();
    assertValidCourse(course);
    expect(course.name).toBe("Executive Leadership Mastery Programme");
    assertCpdHours(course);
  });
});
