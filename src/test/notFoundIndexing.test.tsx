import { render, waitFor, cleanup } from "@testing-library/react";
import { HelmetProvider } from "react-helmet-async";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it } from "vitest";
import NotFound from "@/pages/NotFound";

afterEach(cleanup);

describe("missing-page search exclusion", () => {
  it("excludes an unknown URL even when the public host would otherwise permit indexing", async () => {
    render(
      <HelmetProvider>
        <MemoryRouter initialEntries={["/missing-review-page"]}>
          <NotFound />
        </MemoryRouter>
      </HelmetProvider>,
    );
    await waitFor(() => {
      expect(document.querySelector('meta[name="robots"]')?.getAttribute("content")).toBe("noindex, nofollow");
      expect(document.querySelector('link[rel="canonical"]')?.getAttribute("href")).toBe("https://brightleadershipconsulting.com/missing-review-page");
    });
  });
});