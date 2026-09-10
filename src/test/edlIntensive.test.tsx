import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
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

beforeEach(() => {
  document.head.querySelectorAll("meta[name='robots']").forEach((n) => n.remove());
});

describe("Executive Decision Leadership Intensive — fixed facts", () => {
  it("keeps the approved commercial facts", () => {
    expect(EDL.fee).toBe("£1,950");
    expect(EDL.vatNote).toMatch(/no VAT/i);
    expect(EDL.places).toBe(6);
    expect(EDL.facilitator).toBe("Irene A. Agunbiade");
  });

  it("keeps the four published dates and four stages", () => {
    expect(EDL_SCHEDULE.length).toBeGreaterThanOrEqual(3);
    expect(EDL_STAGES.map((s) => s.name)).toEqual(["FRAME", "TEST", "ALIGN", "MOBILISE"]);
  });

  it("uses application language, never purchase language", () => {
    expect(EDL_CTA.primary.label).toMatch(/^Apply/i);
    expect(EDL_CTA.secondary.label).toMatch(/employer information/i);
    const joined = JSON.stringify({ EDL, EDL_CTA, EDL_STAGES }).toLowerCase();
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
  it("keeps the programme page out of search indexes", () => {
    renderAt(<EdlIntensive />, "/executive-decision-leadership-intensive");
    const robots = document.head.querySelector("meta[name='robots']");
    expect(robots?.getAttribute("content")).toMatch(/noindex/);
  });

  it("offers an application route and no purchase route", () => {
    renderAt(<EdlIntensive />, "/executive-decision-leadership-intensive");
    const applyLinks = screen.getAllByRole("link", { name: new RegExp(EDL_CTA.primary.label, "i") });
    expect(applyLinks.length).toBeGreaterThan(0);
    expect(applyLinks[0]).toHaveAttribute(
      "href",
      "/executive-decision-leadership-intensive/apply",
    );
    expect(document.body.textContent?.toLowerCase()).not.toContain("buy now");
  });

  it("opens the application at step one of six with an exit route", () => {
    renderAt(<EdlApply />, "/executive-decision-leadership-intensive/apply");
    expect(document.body.textContent).toMatch(/1 of 6/i);
    expect(document.head.querySelector("meta[name='robots']")?.getAttribute("content")).toMatch(
      /noindex/,
    );
  });

  it("asks employers for administration only, with no payment route", () => {
    renderAt(
      <EdlEmployerInformation />,
      "/executive-decision-leadership-intensive/employer-information",
    );
    const text = document.body.textContent?.toLowerCase() ?? "";
    expect(text).not.toContain("pay now");
    expect(text).not.toContain("card payment");
    expect(document.head.querySelector("meta[name='robots']")?.getAttribute("content")).toMatch(
      /noindex/,
    );
  });
});
