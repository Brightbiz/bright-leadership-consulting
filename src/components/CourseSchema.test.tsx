import { describe, it, expect, beforeEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { HelmetProvider } from "react-helmet-async";
import CourseSchema from "@/components/CourseSchema";
import { programmes } from "@/data/programmes";

const SITE_URL = "https://brightleadershipconsulting.com";

const readBlocks = () =>
  Array.from(document.head.querySelectorAll('script[type="application/ld+json"]')).map(
    (el) => JSON.parse(el.textContent || "{}")
  );

/** Render the component and read back the JSON-LD Helmet writes into document.head. */
const renderSchema = async (element: React.ReactElement, expectEmpty = false) => {
  render(<HelmetProvider>{element}</HelmetProvider>);
  // Helmet flushes to the head asynchronously.
  for (let i = 0; i < 40; i++) {
    const blocks = readBlocks();
    if (blocks.length > 0) return blocks;
    await new Promise((r) => setTimeout(r, 10));
  }
  if (!expectEmpty) throw new Error("no JSON-LD was emitted");
  return [];
};

beforeEach(() => {
  cleanup();
  document.head
    .querySelectorAll('script[type="application/ld+json"]')
    .forEach((el) => el.remove());
});


const expectedUrl = (title: string) => {
  const p = programmes.find((x) => x.title === title)!;
  return p.detailPage ? `${SITE_URL}${p.detailPage}` : p.link;
};

describe("CourseSchema — courses listing", () => {
  it("emits a single ItemList node with schema.org context", async () => {
    const [data, ...rest] = await renderSchema(<CourseSchema />);
    expect(rest).toHaveLength(0);
    expect(data["@context"]).toBe("https://schema.org");
    expect(data["@type"]).toBe("ItemList");
    expect(data.name).toBe("Executive Programmes");
    expect(data.url).toBe(`${SITE_URL}/courses`);
  });

  it("lists every programme once, in catalogue order, with sequential positions", async () => {
    const [data] = await renderSchema(<CourseSchema />);
    expect(data.numberOfItems).toBe(programmes.length);
    expect(data.itemListElement).toHaveLength(programmes.length);

    data.itemListElement.forEach((entry: any, i: number) => {
      expect(entry["@type"]).toBe("ListItem");
      expect(entry.position).toBe(i + 1);
      expect(entry.url).toBe(expectedUrl(programmes[i].title));
      expect(entry.item.name).toBe(programmes[i].title);
    });
  });

  it("builds each Course node from the programme catalogue", async () => {
    const [data] = await renderSchema(<CourseSchema />);

    data.itemListElement.forEach((entry: any, i: number) => {
      const programme = programmes[i];
      const course = entry.item;
      expect(course["@type"]).toBe("Course");
      expect(course.name).toBe(programme.title);
      expect(course.description).toBe(programme.description);
      expect(course.url).toBe(expectedUrl(programme.title));
      expect(course.provider).toEqual({
        "@type": "Organization",
        name: "Bright Leadership Consulting",
        url: SITE_URL,
      });
      const [min, max] = (programme.cpdHours ?? "")
        .match(/(\d+(?:\.\d+)?)\s*[\u2013-]\s*(\d+(?:\.\d+)?)/)!
        .slice(1)
        .map(Number);
      expect(course.hasCourseInstance).toEqual({
        "@type": "CourseInstance",
        courseMode: "online",
        courseWorkload: `PT${max}H`,
      });
      expect(course.timeRequired).toBe(`PT${min}H`);
      expect(course.educationalCredentialAwarded).toContain(programme.cpdHours);
      expect(course.additionalProperty[0]).toMatchObject({
        "@type": "PropertyValue",
        name: "Accredited CPD hours",
        value: programme.cpdHours,
        minValue: min,
        maxValue: max,
        unitText: "HUR",
      });

      // While individual places are arranged directly the catalogue link is an
      // in-site enquiry path, so no external `sameAs` may be emitted.
      if (programme.detailPage && /^https:/.test(programme.link)) {
        expect(course.sameAs).toBe(programme.link);
      } else {
        expect(course.sameAs).toBeUndefined();
      }
    });
  });

  it("honours custom list path and name overrides", async () => {
    const [data] = await renderSchema(
      <CourseSchema listPath="/programmes" listName="Board Programmes" />
    );
    expect(data.url).toBe(`${SITE_URL}/programmes`);
    expect(data.name).toBe("Board Programmes");
  });
});

describe("CourseSchema — Executive Leadership Mastery Programme page", () => {
  const TITLE = "Executive Leadership Mastery Programme";

  it("emits a single Course node for the flagship programme", async () => {
    const [data] = await renderSchema(<CourseSchema programmeTitle={TITLE} />);
    const programme = programmes.find((p) => p.title === TITLE)!;

    expect(data["@context"]).toBe("https://schema.org");
    expect(data["@type"]).toBe("Course");
    expect(data.name).toBe(TITLE);
    expect(data.description).toBe(programme.description);
    expect(data.url).toBe(`${SITE_URL}/executive-leadership-mastery`);
    // No external course page is referenced while places are arranged directly.
    expect(data.sameAs).toBeUndefined();
    expect(programme.link.startsWith("/contact")).toBe(true);
    expect(data.itemListElement).toBeUndefined();
  });

  it("renders nothing for an unknown programme title", async () => {
    const blocks = await renderSchema(
      <CourseSchema programmeTitle="Not A Programme" />,
      true
    );
    expect(blocks).toHaveLength(0);
  });
});
