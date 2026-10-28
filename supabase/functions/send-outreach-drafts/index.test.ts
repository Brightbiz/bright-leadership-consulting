// Simulated tests for the outreach sending controls. No real emails are
// sent and no real database is touched: the provider and the database are
// in-memory fakes, and every scenario runs against handler.ts directly.

import {
  assertEquals,
  assert,
} from "https://deno.land/std@0.224.0/assert/mod.ts";
import {
  runBatchSend,
  runTestSend,
  contentHash,
  draftFingerprint,
  TEST_ADDRESS,
  SENDER,
  type SendDeps,
  type DraftRow,
  type ApprovalRow,
  type SendResult,
} from "./handler.ts";

interface SentMail { to: string; subject: string; html: string; text: string; idempotencyKey: string }

function makeDeps(overrides: {
  drafts?: DraftRow[];
  suppressed?: string[];
  approval?: ApprovalRow | null;
  sendBehaviour?: (input: SentMail) => SendResult;
}) {
  const sent: SentMail[] = [];
  const draftStates = new Map<string, Record<string, unknown>>();
  const claimedDrafts = new Set<string>();
  let approvalUsed = overrides.approval?.used_at != null;

  const deps: SendDeps = {
    listEligibleDrafts: () => Promise.resolve(overrides.drafts ?? []),
    listSuppressedEmails: () => Promise.resolve(overrides.suppressed ?? []),
    getApproval: () => Promise.resolve(overrides.approval ?? null),
    claimApproval: () => {
      if (approvalUsed) return Promise.resolve(false);
      approvalUsed = true;
      return Promise.resolve(true);
    },
    claimDraft: (id) => {
      if (claimedDrafts.has(id)) return Promise.resolve(false);
      claimedDrafts.add(id);
      return Promise.resolve(true);
    },
    markDraft: (id, _runId, fields) => {
      draftStates.set(id, { ...(draftStates.get(id) ?? {}), ...fields });
      return Promise.resolve();
    },
    sendEmail: (input) => {
      const behaviour = overrides.sendBehaviour ?? (() => ({ ok: true, status: 200, messageId: "msg-1" }));
      const res = behaviour(input);
      if (res.ok) sent.push(input);
      return Promise.resolve(res);
    },
    sleep: () => Promise.resolve(),
    now: () => new Date("2026-10-16T10:00:00Z"),
  };
  return { deps, sent, draftStates, isApprovalUsed: () => approvalUsed };
}

const draft = (id: string, email: string | null, name = "Jo Smith", role = "HR & People Director", company = "Acme"): DraftRow =>
  ({ id, subject: "Has their leadership kept pace with their role?", recipient_name: name, recipient_role: role, company, email });

async function approvalFor(approved: DraftRow[], overrides: Partial<ApprovalRow> = {}): Promise<ApprovalRow> {
  const recipient_fingerprints: Record<string, string> = {};
  for (const d of approved) recipient_fingerprints[d.id] = await draftFingerprint(d);
  return {
    id: "appr-1",
    recipient_draft_ids: approved.map((d) => d.id),
    recipient_fingerprints,
    content_hash: await contentHash(),
    sender: SENDER,
    max_count: approved.length,
    expires_at: "2026-10-17T10:00:00Z",
    used_at: null,
    ...overrides,
  };
}

Deno.test("batch without an approval header is refused and sends nothing", async () => {
  const { deps, sent } = makeDeps({ drafts: [draft("d1", "a@b.co")] });
  const res = await runBatchSend(deps, null);
  assertEquals(res.ok, false);
  assertEquals(sent.length, 0);
});

Deno.test("expired approval is refused and sends nothing", async () => {
  const ds = [draft("d1", "a@b.co")];
  const appr = await approvalFor(ds.filter((d) => ["d1"].includes(d.id)), { expires_at: "2026-10-15T10:00:00Z" });
  const { deps, sent } = makeDeps({ drafts: ds, approval: appr });
  const res = await runBatchSend(deps, "appr-1");
  assertEquals(res.error, "Approval expired");
  assertEquals(sent.length, 0);
});

Deno.test("reused approval is refused and sends nothing", async () => {
  const ds = [draft("d1", "a@b.co")];
  const appr = await approvalFor(ds.filter((d) => ["d1"].includes(d.id)));
  const { deps, sent, isApprovalUsed } = makeDeps({ drafts: ds, approval: appr });
  const first = await runBatchSend(deps, "appr-1");
  assertEquals(first.ok, true);
  assertEquals(sent.length, 1);
  assert(isApprovalUsed());
  const second = await runBatchSend(deps, "appr-1");
  assertEquals(second.error, "Approval already used");
  assertEquals(sent.length, 1);
});

Deno.test("concurrent batch calls: only one wins the approval", async () => {
  const ds = [draft("d1", "a@b.co")];
  const appr = await approvalFor(ds.filter((d) => ["d1"].includes(d.id)));
  const { deps, sent } = makeDeps({ drafts: ds, approval: appr });
  const [a, b] = await Promise.all([runBatchSend(deps, "appr-1"), runBatchSend(deps, "appr-1")]);
  const winners = [a, b].filter((r) => r.ok);
  const losers = [a, b].filter((r) => !r.ok);
  assertEquals(winners.length, 1);
  assertEquals(losers.length, 1);
  assertEquals(losers[0].error, "Approval already used");
  assertEquals(sent.length, 1);
});

Deno.test("changed content (hash mismatch) invalidates the approval", async () => {
  const ds = [draft("d1", "a@b.co")];
  const appr = await approvalFor(ds.filter((d) => ["d1"].includes(d.id)), { content_hash: "stale-hash" });
  const { deps, sent, isApprovalUsed } = makeDeps({ drafts: ds, approval: appr });
  const res = await runBatchSend(deps, "appr-1");
  assertEquals(res.error, "Content changed since approval");
  assertEquals(sent.length, 0);
  assertEquals(isApprovalUsed(), false); // not consumed by a refused run
});

Deno.test("sender mismatch invalidates the approval", async () => {
  const ds = [draft("d1", "a@b.co")];
  const appr = await approvalFor(ds.filter((d) => ["d1"].includes(d.id)), { sender: "Someone Else <x@y.co>" });
  const { deps, sent } = makeDeps({ drafts: ds, approval: appr });
  const res = await runBatchSend(deps, "appr-1");
  assertEquals(res.error, "Sender mismatch");
  assertEquals(sent.length, 0);
});

Deno.test("recipients outside the approved list are never sent", async () => {
  const ds = [draft("d1", "approved@b.co"), draft("d2", "not-approved@b.co")];
  const appr = await approvalFor(ds.filter((d) => ["d1"].includes(d.id)), { max_count: 2 });
  const { deps, sent, draftStates } = makeDeps({
    drafts: ds,
    approval: appr,
  });
  const res = await runBatchSend(deps, "appr-1");
  assertEquals(res.ok, true);
  assertEquals(sent.length, 1);
  assertEquals(sent[0].to, "approved@b.co");
  assertEquals(draftStates.has("d2"), false); // untouched
});

Deno.test("eligible count above the approved maximum aborts before any send", async () => {
  const ds = [draft("d1", "a@b.co"), draft("d2", "c@d.co")];
  const appr = await approvalFor(ds.filter((d) => ["d1", "d2"].includes(d.id)), { max_count: 1 });
  const { deps, sent, isApprovalUsed } = makeDeps({
    drafts: ds,
    approval: appr,
  });
  const res = await runBatchSend(deps, "appr-1");
  assertEquals(res.ok, false);
  assertEquals(sent.length, 0);
  assertEquals(isApprovalUsed(), false);
});

Deno.test("suppressed contacts are skipped and marked suppressed, not emailed", async () => {
  const ds = [draft("d1", "optout@b.co"), draft("d2", "fine@b.co")];
  const appr = await approvalFor(ds.filter((d) => ["d1", "d2"].includes(d.id)));
  const { deps, sent, draftStates } = makeDeps({
    drafts: ds,
    suppressed: ["OptOut@b.co"],
    approval: appr,
  });
  const res = await runBatchSend(deps, "appr-1");
  assertEquals(res.ok, true);
  assertEquals(sent.length, 1);
  assertEquals(sent[0].to, "fine@b.co");
  assertEquals((draftStates.get("d1") as { send_state?: string }).send_state, "suppressed");
});

Deno.test("provider timeout flags needs_reconciliation and never resends", async () => {
  const ds = [draft("d1", "a@b.co")];
  const appr = await approvalFor(ds.filter((d) => ["d1"].includes(d.id)));
  let calls = 0;
  const { deps, sent, draftStates } = makeDeps({
    drafts: ds,
    approval: appr,
    sendBehaviour: () => { calls++; return { ok: false, error: "fetch failed: timeout" }; },
  });
  const res = await runBatchSend(deps, "appr-1");
  assertEquals(res.ok, true);
  assertEquals(res.sent, 0);
  assertEquals(calls, 1); // exactly one attempt, no retry
  assertEquals(sent.length, 0);
  const state = draftStates.get("d1") as { send_state?: string };
  assertEquals(state.send_state, "needs_reconciliation");
});

Deno.test("definite provider rejection (422) is marked rejected", async () => {
  const ds = [draft("d1", "bad@b.co")];
  const appr = await approvalFor(ds.filter((d) => ["d1"].includes(d.id)));
  const { deps, draftStates } = makeDeps({
    drafts: ds,
    approval: appr,
    sendBehaviour: () => ({ ok: false, status: 422, error: "invalid to" }),
  });
  await runBatchSend(deps, "appr-1");
  assertEquals((draftStates.get("d1") as { send_state?: string }).send_state, "rejected");
});

Deno.test("test mode sends only to the designated test address and touches no state", async () => {
  const { deps, sent, draftStates, isApprovalUsed } = makeDeps({
    drafts: [draft("d1", "real-recipient@b.co", "Marnie Wright", "HR Director", "Arma Partners")],
  });
  const res = await runTestSend(deps, "d1");
  assertEquals(res.ok, true);
  assertEquals(sent.length, 1);
  assertEquals(sent[0].to, TEST_ADDRESS);
  assert(sent[0].to !== "real-recipient@b.co");
  assertEquals(sent[0].idempotencyKey, "elm-outreach-test-d1");
  assertEquals(draftStates.size, 0); // no claims, no marks
  assertEquals(isApprovalUsed(), false);
  // personalisation still applied
  assert(sent[0].html.includes("Dear Marnie"));
});

Deno.test("plain text keeps a literal & in job titles (no &amp; defect)", async () => {
  const ds = [draft("d1", "a@b.co", "Jo Smith", "Human Resources & Facilities Management Director", "Acme")];
  const appr = await approvalFor(ds.filter((d) => ["d1"].includes(d.id)));
  const { deps, sent } = makeDeps({
    drafts: ds,
    approval: appr,
  });
  await runBatchSend(deps, "appr-1");
  assert(sent[0].text.includes("Human Resources & Facilities Management Director"));
  assert(!sent[0].text.includes("&amp;"));
  assert(sent[0].html.includes("Human Resources &amp; Facilities Management Director")); // HTML still escaped
});

Deno.test("footer carries Irene A. Agunbiade in both versions", async () => {
  const ds = [draft("d1", "a@b.co")];
  const appr = await approvalFor(ds.filter((d) => ["d1"].includes(d.id)));
  const { deps, sent } = makeDeps({ drafts: ds, approval: appr });
  await runBatchSend(deps, "appr-1");
  assert(sent[0].html.includes("Irene A. Agunbiade &middot; Principal Consultant"));
  assert(sent[0].text.includes("Irene A. Agunbiade, Principal Consultant"));
});

// Any change to subject, address or merge fields after approval cancels it.
for (const [field, value] of [
  ["subject", "A different subject"],
  ["email", "someone-else@b.co"],
  ["recipient_name", "Pat Jones"],
  ["recipient_role", "Chief Executive"],
  ["company", "Other Ltd"],
] as const) {
  Deno.test(`changed ${field} after approval refuses the whole batch before any send`, async () => {
    const approved = [draft("d1", "a@b.co"), draft("d2", "c@d.co")];
    const appr = await approvalFor(approved);
    const edited = [approved[0], { ...approved[1], [field]: value }];
    const { deps, sent, isApprovalUsed, draftStates } = makeDeps({ drafts: edited, approval: appr });
    const res = await runBatchSend(deps, "appr-1");
    assertEquals(res.ok, false);
    assertEquals(res.error, "Recipient details changed since approval: d2");
    assertEquals(sent.length, 0);
    assertEquals(draftStates.size, 0);
    assertEquals(isApprovalUsed(), false);
  });
}

Deno.test("approval without recipient fingerprints is refused", async () => {
  const ds = [draft("d1", "a@b.co")];
  const appr = await approvalFor(ds, { recipient_fingerprints: null });
  const { deps, sent } = makeDeps({ drafts: ds, approval: appr });
  const res = await runBatchSend(deps, "appr-1");
  assertEquals(res.error, "Approval has no recipient fingerprints");
  assertEquals(sent.length, 0);
});
