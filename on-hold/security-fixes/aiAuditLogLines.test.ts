// Synthetic errors carrying personal details; the staged log lines must emit only allowlisted fields.
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
const src = readFileSync("on-hold/security-fixes/functions/submit-ai-audit/index.ts", "utf8");
const PII = ["jane.doe@example.invalid", "Jane Doe", "07700 900123", "Bearer eyJsecret", "My confidential board concern"];
const capture = (fn: () => void) => { const out: string[] = []; const o = console.error; console.error = (...a) => out.push(a.join(" ")); try { fn(); } finally { console.error = o; } return out.join("\n"); };
// Exact statements copied from the staged file (asserted present below).
const recordFailed = (rpcError: any) => console.error(JSON.stringify({ event: "ai_audit:record_failed", code: rpcError?.code ?? "unknown" }));
const unexpected = (error: unknown) => console.error(JSON.stringify({ event: "ai_audit:unexpected_error", name: error instanceof Error ? error.name : "unknown" }));
describe("staged AI-audit error logs", () => {
  it("staged file contains exactly these statements and no raw message logging", () => {
    expect(src).toContain('JSON.stringify({ event: "ai_audit:record_failed", code: rpcError?.code ?? "unknown" })');
    expect(src).toContain('JSON.stringify({ event: "ai_audit:unexpected_error", name: error instanceof Error ? error.name : "unknown" })');
    expect(src).not.toMatch(/console\.(error|log|warn)\([^)]*\.message/);
  });
  it("database error quoting a submitted row logs only event + code", () => {
    const out = capture(() => recordFailed({ code: "23505", message: `duplicate key (email)=(${PII[0]})`, details: PII.join(" "), hint: PII[3] }));
    expect(JSON.parse(out)).toEqual({ event: "ai_audit:record_failed", code: "23505" });
    PII.forEach((p) => expect(out).not.toContain(p));
  });
  it("missing error object logs code unknown", () => {
    expect(JSON.parse(capture(() => recordFailed(null)))).toEqual({ event: "ai_audit:record_failed", code: "unknown" });
  });
  it("thrown error with personal details logs only event + error type", () => {
    const e = new TypeError(`bad input from ${PII[1]} <${PII[0]}> ${PII[2]} ${PII[4]} ${PII[3]}`);
    const out = capture(() => unexpected(e));
    expect(JSON.parse(out)).toEqual({ event: "ai_audit:unexpected_error", name: "TypeError" });
    PII.forEach((p) => expect(out).not.toContain(p));
  });
  it("non-Error throw (string or object with an address) logs name unknown", () => {
    const out = capture(() => { unexpected(PII[0]); unexpected({ email: PII[0] }); });
    PII.forEach((p) => expect(out).not.toContain(p));
    expect(out.split("\n").map((l) => JSON.parse(l).name)).toEqual(["unknown", "unknown"]);
  });
});
