import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import EdlIntensive from "@/pages/EdlIntensive";
import EdlApply from "@/pages/EdlApply";
import EdlEmployerInformation from "@/pages/EdlEmployerInformation";
import {
  EDL,
  EDL_APPLICATION_STATUSES,
  EDL_CTA,
  EDL_SCHEDULE,
  EDL_STAGES,
} from "@/data/edlIntensive";
import { programmes } from "@/data/programmes";

vi.mock("@/integrations/supabase/client", () => ({
  supabase: { functions: { invoke: vi.fn() } },
}));

const renderAt = (ui: React.ReactElement, path = "/") =>
  render(
    <HelmetProvider>
      <MemoryRouter initialEntries={[path]}>{ui}</MemoryRouter>
    </HelmetProvider>,
  );

/** Every staging route must be withheld from search engines. */
const expectNoindex = async () => {
  await waitFor(() => {
    const robots = Array.from(document.head.querySelectorAll("meta[name='robots']"));
    expect(robots.some((m) => /noindex/.test(m.getAttribute("content") ?? ""))).toBe(true);
  });
};

describe("Executive Decision Leadership Intensive — fixed facts", () => {
  it("keeps the approved commercial facts", () => {
    expect(EDL.fee).toBe("£1,950 per participant. No VAT is charged.");
    expect(EDL.cohort).toMatch(/six executives from non-competing organisations/i);
    expect(EDL.format).toBe("Live online");
    expect(EDL.lead).toBe("Irene A. Agunbiade");
  });

  it("keeps the published dates and the four stages", () => {
    expect(EDL_SCHEDULE.map((s) => s.session)).toEqual([
      "Orientation",
      "FRAME",
      "TEST",
      "ALIGN",
      "MOBILISE",
      "Implementation review",
    ]);
    expect(EDL_SCHEDULE.every((s) => /UK time/.test(s.time))).toBe(true);
    expect(EDL_STAGES.map((s) => s.stage)).toEqual(["FRAME", "TEST", "ALIGN", "MOBILISE"]);
    expect(EDL.applicationsWindow).toBe("14 September–11 October 2026");
    expect(EDL.closingTime).toMatch(/11 October 2026/);
  });

  it("uses application language, never purchase language", () => {
    expect(EDL_CTA.primary).toBe("Apply for the founding cohort");
    expect(EDL_CTA.secondary).toBe("Request employer information");
    const joined = JSON.stringify({ EDL, EDL_CTA, EDL_STAGES, EDL_SCHEDULE }).toLowerCase();
    for (const banned of ["buy now", "add to cart", "checkout", "enrol now", "instant access"]) {
      expect(joined).not.toContain(banned);
    }
  });

  it("stays outside the four-programme catalogue", () => {
    expect(programmes.some((p) => p.title === EDL.title)).toBe(false);
  });

  it("requires a human decision for every application status", () => {
    expect(EDL_APPLICATION_STATUSES).toContain("submitted");
    expect(EDL_APPLICATION_STATUSES).toContain("conditionally_accepted");
    expect(EDL_APPLICATION_STATUSES).not.toContain("auto_accepted");
  });
});

describe("Executive Decision Leadership Intensive — pages", () => {
  it("keeps the programme page out of search indexes", async () => {
    renderAt(<EdlIntensive />, EDL.route);
    await expectNoindex();
  });

  it("offers an application route and no purchase route", () => {
    renderAt(<EdlIntensive />, EDL.route);
    const applyLinks = screen
      .getAllByRole("link", { name: new RegExp(EDL_CTA.primary, "i") })
      .filter((a) => a.getAttribute("href") === EDL.applyRoute);
    expect(applyLinks.length).toBeGreaterThan(0);

    const employerLinks = screen
      .getAllByRole("link", { name: new RegExp(EDL_CTA.secondary, "i") })
      .filter((a) => a.getAttribute("href") === EDL.employerRoute);
    expect(employerLinks.length).toBeGreaterThan(0);

    const text = document.body.textContent?.toLowerCase() ?? "";
    for (const banned of ["buy now", "add to cart", "pay now"]) {
      expect(text).not.toContain(banned);
    }
  });

  it("opens the application at step one of six, noindex, with no payment link", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-09-20T10:00:00Z"));
    try {
      renderAt(<EdlApply />, EDL.applyRoute);
      expect(document.body.textContent).toMatch(/1 of 6/i);
      expect(document.body.textContent?.toLowerCase()).not.toContain("pay now");
      await expectNoindex();
    } finally {
      vi.useRealTimers();
    }
  });

  it("locks the application before the window opens", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-09-01T10:00:00Z"));
    try {
      renderAt(<EdlApply />, EDL.applyRoute);
      expect(document.body.textContent).toMatch(/Applications open on 14 September 2026/i);
      expect(document.body.textContent).not.toMatch(/1 of 6/i);
    } finally {
      vi.useRealTimers();
    }
  });

  it("asks employers for administration only, with no payment route", async () => {
    renderAt(<EdlEmployerInformation />, EDL.employerRoute);
    const text = document.body.textContent?.toLowerCase() ?? "";
    expect(text).not.toContain("pay now");
    expect(text).not.toContain("card payment");
    await expectNoindex();
  });
});
