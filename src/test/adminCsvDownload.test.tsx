import { fireEvent, render, screen, waitFor, cleanup } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";

const fixtures = vi.hoisted(() => ({
  name: '  =HYPERLINK("https://example.invalid","test")',
  records: {} as Record<string, unknown[]>,
  user: { id: "synthetic-admin" },
}));
vi.mock("@/hooks/useAdminAuth", () => ({ useAdminAuth: () => ({
  user: fixtures.user, isAdmin: true, isLoading: false, signOut: vi.fn(),
}) }));
vi.mock("@/integrations/supabase/client", () => ({ supabase: {
  from: (table: string) => ({ select: () => ({
    not: async () => ({ data: [], error: null }),
    order: () => ({
    not: async () => ({ data: [], error: null }),
    then: (resolve: (result: unknown) => unknown) => Promise.resolve({ data: fixtures.records[table] ?? [], error: null }).then(resolve),
  }) }) }),
} }));
vi.mock("@/components/Header", () => ({ default: () => null }));
vi.mock("@/components/Footer", () => ({ default: () => null }));
vi.mock("@/components/admin/OutstandingActionsBanner", () => ({ default: () => null }));
vi.mock("@/components/CsvImportDialog", () => ({ CsvImportDialog: () => null }));
import AdminCRM from "@/pages/AdminCRM";
import AdminSubmissions from "@/pages/AdminSubmissions";

afterEach(() => { cleanup(); vi.restoreAllMocks(); vi.unstubAllGlobals(); });

describe("admin export downloads with synthetic records only", () => {
  it.each(["CRM", "Submissions"])("protects the %s download without writing records", async (page) => {
    const record = Object.freeze({
      id: "synthetic", name: fixtures.name, email: "test@example.invalid", phone: "\t+44123",
      company: 'Ordinary "company"', job_title: "Manager", source: "manual", status: "new", tags: [],
      notes: "\u0000@SUM(1)", message: "\u0000@SUM(1)", deal_stage: null,
      estimated_value: null, next_follow_up: null, last_contacted_at: null,
      created_at: "2026-10-29T12:00:00Z", updated_at: "2026-10-29T12:00:00Z", is_read: false,
    });
    fixtures.records = { crm_contacts: [record], contact_submissions: [record] };
    const downloads: string[] = [];
    // Capture downloaded bytes in memory. No network, real auth, database or files.
    vi.stubGlobal("Blob", class { constructor(parts: string[]) { downloads.push(parts.join("")); } });
    vi.stubGlobal("URL", class extends URL {
      static createObjectURL = vi.fn(() => "blob:synthetic");
      static revokeObjectURL = vi.fn();
    });
    vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => undefined);
    render(<MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>{page === "CRM" ? <AdminCRM /> : <AdminSubmissions />}</MemoryRouter>);
    const button = await screen.findByRole("button", { name: page === "CRM" ? /^Export$/ : /^Export CSV$/ });
    await waitFor(() => expect(button).toBeEnabled());
    fireEvent.click(button);
    expect(downloads).toHaveLength(1);
    expect(downloads[0]).toContain('"\'  =HYPERLINK(""https://example.invalid"",""test"")"');
    expect(downloads[0]).toContain('"\'\t+44123"');
    expect(downloads[0]).toContain('"Ordinary ""company"""');
    expect(downloads[0]).toContain('"\'\u0000@SUM(1)"');
    expect(record.name).toBe(fixtures.name);
    expect(record.phone).toBe("\t+44123");
  });
});