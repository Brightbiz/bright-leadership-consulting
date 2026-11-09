import { describe, it, expect, beforeAll } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { MemoryRouter, Route, Routes, useNavigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

import Contact from "@/pages/Contact";

const COHORT_TEMPLATE =
  "Leading People — employer cohort enquiry\nApproximate number of managers:\nMain development need:\nPreferred timing:";

const NavigateButton = ({ to, label }: { to: string; label: string }) => {
  const navigate = useNavigate();
  return (
    <button type="button" onClick={() => navigate(to)}>
      {label}
    </button>
  );
};

const renderContact = (initial: string, links: { to: string; label: string }[]) =>
  render(
    <HelmetProvider>
      <MemoryRouter initialEntries={[initial]}>
        <Routes>
          <Route
            path="/contact"
            element={
              <>
                {links.map((link) => (
                  <NavigateButton key={link.to} {...link} />
                ))}
                <Contact />
              </>
            }
          />
        </Routes>
      </MemoryRouter>
    </HelmetProvider>,
  );

const messageField = () => screen.getByLabelText("Message") as HTMLTextAreaElement;

beforeAll(() => {
  // jsdom does not implement scrollIntoView; the anchor hook calls it.
  Element.prototype.scrollIntoView = () => {};
});

describe("Contact message preservation across enquiry routes", () => {
  it("keeps visitor-written text when leaving the cohort route", async () => {
    renderContact("/contact?cohort=leading-people#enquiry-form", [
      { to: "/contact", label: "general" },
    ]);
    expect(messageField().value).toBe(COHORT_TEMPLATE);

    fireEvent.change(messageField(), {
      target: { value: "We have nine managers needing support with delegation." },
    });
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "general" }));
    });

    expect(messageField().value).toBe(
      "We have nine managers needing support with delegation.",
    );
  });

  it("replaces only the untouched template when leaving the cohort route", async () => {
    renderContact("/contact?cohort=leading-people#enquiry-form", [
      { to: "/contact", label: "general" },
    ]);
    expect(messageField().value).toBe(COHORT_TEMPLATE);

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "general" }));
    });

    expect(messageField().value).toBe("");
  });

  it("keeps visitor-written text when entering the cohort route", async () => {
    renderContact("/contact", [
      { to: "/contact?cohort=leading-people#enquiry-form", label: "cohort" },
    ]);
    fireEvent.change(messageField(), {
      target: { value: "Draft notes I do not want to lose." },
    });
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "cohort" }));
    });

    expect(messageField().value).toBe("Draft notes I do not want to lose.");
  });

  it("adds the template on the cohort route when the message was empty", async () => {
    renderContact("/contact", [
      { to: "/contact?cohort=leading-people#enquiry-form", label: "cohort" },
    ]);
    expect(messageField().value).toBe("");

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "cohort" }));
    });

    expect(messageField().value).toBe(COHORT_TEMPLATE);
  });
});
