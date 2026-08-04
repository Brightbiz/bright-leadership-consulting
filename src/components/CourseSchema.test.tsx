import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { HelmetProvider } from "react-helmet-async";
import CourseSchema from "@/components/CourseSchema";
import { programmes } from "@/data/programmes";

const SITE_URL = "https://brightleadershipconsulting.com";

/** Render the component and read back the JSON-LD it hands to Helmet (isolated per test). */
const renderSchema = async (element: React.ReactElement) => {
  const context: { helmet?: any } = {};
  render(<HelmetProvider context={context}>{element}</HelmetProvider>);
  await new Promise((r) => setTimeout(r, 0));
  const markup: string = context.helmet?.script?.toString() ?? "";
  const container = document.createElement("div");
  container.innerHTML = markup;
  return Array.from(
    container.querySelectorAll('script[type="application/ld+json"]')
  ).map((el) => JSON.parse(el.textContent || "{}"));
};

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
      expect(course.hasCourseInstance).toEqual({
        "@type": "CourseInstance",
        courseMode: "online",
        courseWorkload: "PT10H",
      });
      // sameAs points at the external enrolment page only when an in-site page exists.
      if (programme.detailPage) {
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

describe("CourseSchema — Executive Leadership Mastery page", () => {
  const TITLE = "Executive Leadership Mastery";

  it("emits a single Course node for the flagship programme", async () => {
    const [data] = await renderSchema(<CourseSchema programmeTitle={TITLE} />);
    const programme = programmes.find((p) => p.title === TITLE)!;

    expect(data["@context"]).toBe("https://schema.org");
    expect(data["@type"]).toBe("Course");
    expect(data.name).toBe(TITLE);
    expect(data.description).toBe(programme.description);
    expect(data.url).toBe(`${SITE_URL}/executive-leadership-mastery`);
    expect(data.sameAs).toBe(programme.link);
    expect(data.sameAs).toMatch(
      /^https:\/\/bright-leadership-consulting\.thinkific\.com\/products\/courses\//
    );
    expect(data.itemListElement).toBeUndefined();
  });

  it("renders nothing for an unknown programme title", async () => {
    const blocks = await renderSchema(<CourseSchema programmeTitle="Not A Programme" />);
    expect(blocks).toHaveLength(0);
  });
});
