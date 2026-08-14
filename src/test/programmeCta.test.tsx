import { describe, it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import ProgrammeCta from "@/components/ProgrammeCta";
import { programmes, type Programme } from "@/data/programmes";

const renderCta = (programme: Programme) => {
  const { unmount } = render(
    <MemoryRouter>
      <ProgrammeCta programme={programme} surface="/courses#test" />
    </MemoryRouter>,
  );
  const group = screen.getByRole("group", {
    name: `Next steps for ${programme.title}`,
  });
  return { group, unmount };
};

/** Every anchor/link inside the CTA group, as { name, href } pairs. */
const links = (group: HTMLElement) =>
  within(group)
    .getAllByRole("link")
    .map((el) => ({
      name: (el.textContent ?? "").replace(/\s+/g, " ").trim(),
      href: el.getAttribute("href") ?? "",
    }));

describe("ProgrammeCta destinations", () => {
  it("covers the whole catalogue", () => {
    expect(programmes.length).toBeGreaterThan(0);
  });

  it.each(programmes.map((p) => [p.title, p] as const))(
    "routes every control correctly for %s",
    (_title, programme) => {
      const { group, unmount } = renderCta(programme);
      const found = links(group);

      // The advisory route is always present and always internal.
      const discuss = found.find((l) => l.name.startsWith("Discuss Executive Alignment"));
      expect(discuss, "Discuss Executive Alignment link missing").toBeTruthy();
      expect(discuss!.href).toBe("/contact");

      const primary = found[0];

      if (programme.enrolmentAvailable !== true) {
        // Places arranged directly → in-site enquiry route with the programme
        // preselected, and never an external purchase link.
        expect(primary.name).toMatch(/^Request Individual Enrolment/);
        expect(primary.href).toBe(
          `/contact?programme=${encodeURIComponent(programme.title)}`,
        );
        expect(found.every((l) => !l.href.startsWith("http"))).toBe(true);
        expect(found.every((l) => !/thinkific/i.test(l.href))).toBe(true);
      } else {
        // Open intake with a usable https URL → the enrolment platform.
        expect(primary.name).toMatch(/^Enrol on the Programme Platform/);
        expect(primary.href).toBe(programme.link);
        expect(new URL(primary.href).protocol).toBe("https:");
      }

      // Detail link, when a detail page exists, points at the in-site route.
      const detail = found.find((l) => l.name.startsWith("View programme detail"));
      if (programme.detailPage) {
        expect(detail, "detail link missing").toBeTruthy();
        expect(detail!.href).toBe(programme.detailPage);
      } else {
        expect(detail).toBeUndefined();
      }

      unmount();
    },
  );

  it("falls back to the enquiry route when the enrolment URL is unusable", () => {
    const broken: Programme = {
      ...programmes[0],
      title: "Broken Link Programme",
      link: "",
      enrolmentAvailable: true,
    };
    const { group, unmount } = renderCta(broken);
    const found = links(group);

    expect(found[0].name).toMatch(/^Request Individual Enrolment/);
    expect(found[0].href).toBe(
      `/contact?programme=${encodeURIComponent(broken.title)}`,
    );
    expect(found.every((l) => !l.href.startsWith("http"))).toBe(true);
    unmount();
  });

  it("also falls back when the enrolment URL is malformed", () => {
    const broken: Programme = {
      ...programmes[0],
      title: "Malformed Link Programme",
      link: "not-a-url",
      enrolmentAvailable: true,
    };
    const { group, unmount } = renderCta(broken);
    expect(links(group)[0].href).toBe(
      `/contact?programme=${encodeURIComponent(broken.title)}`,
    );
    unmount();
  });
});
