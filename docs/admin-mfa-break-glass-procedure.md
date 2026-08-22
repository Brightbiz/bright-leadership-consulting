# Administrator MFA — Revised Break-Glass Recovery Procedure

Status: procedure document only. `ADMIN_MFA_ENFORCED` remains `false`. No factor has been added,
removed or re-enrolled on the administrator account. No authentication policy, database policy,
edge function, indexing, email, checkout or video setting has been changed by this document.

## 1. Scope

Applies to the single administrator account when the enrolled TOTP authenticator device is lost,
destroyed or otherwise unavailable and no second authenticator / stored setup key exists.

## 2. Self-service path (always attempted first)

1. Re-add the stored manual setup key (password manager) or use the second enrolled authenticator.
2. No operator involvement, no session revocation, no logging entry required.

Break-glass below is used only if step 1 is impossible.

## 3. Identity verification — two independent steps (both required)

An authenticated project-chat instruction is **not** sufficient on its own.

- Step A — Instruction: a written deletion request from the project owner in the authenticated
  project chat, naming the account email and the reason.
- Step B — Independent ownership proof, one of:
  - a confirmation reply sent from the confirmed administrator mailbox
    (`admin@…` as recorded on the auth account) to `enquiries@brightleadershipconsulting.com`,
    quoting the request reference; or
  - control of a Lovable-verified ownership channel for the project (platform account owner
    verification via Lovable support), where the mailbox itself is unavailable; or
  - control of the verified custom domain (DNS TXT challenge published at
    `brightleadershipconsulting.com`) where neither of the above is available.

Both steps must be satisfied and dated before any factor is deleted. If Step B cannot be
completed, the request is refused.

## 4. Execution

1. Operator (Lovable agent acting on the verified request, or Lovable support) deletes only the
   MFA factor(s) for the named account through the backend auth administration API.
2. Immediately after deletion, **all sessions for that account are revoked** (global sign-out /
   refresh-token revocation). No session survives a factor deletion.
3. The administrator performs a fresh password login (leaked-password protection applies) and is
   sent straight to `/admin/security` to re-enrol a factor before any other administrative use.
4. Re-enrolment must add the authenticator on two devices, or store the setup key, so the same
   break-glass is not needed twice.

No audit response, audit request, enquiry or CRM data is read, exported or displayed at any point
in this procedure.

## 5. Recovery record (no secrets)

Each break-glass execution is recorded with:

- timestamp (UTC) of deletion and of session revocation
- affected account identifier and email
- operator identity (who executed it)
- verification evidence references: Step A request reference, Step B channel used and its date
- reason stated in the request
- outcome (factor deleted, sessions revoked, re-enrolment completed date)

Explicitly **never** recorded: the TOTP secret, the provisioning URI, QR payload, any entered
code, or recovery codes. The record is retained for administrative accountability only.
Implementation of the persisted log ships with the approved enforcement migration; until then the
record is kept in the project chat plus this document's change history.

## 6. Total lockout

The procedure remains possible with the administrator fully locked out of the application:
factor deletion and session revocation are performed server-side against the auth service, not
through any signed-in admin screen. Neither an application session nor a valid TOTP code is
required to execute it. Only Step A + Step B verification are required, and Step B has two
fallbacks (platform ownership verification, domain control) for the case where the mailbox is
also unreachable.

## 7. Rollback if AAL2 enforcement blocks legitimate access

Reverse in this order, each step independently sufficient to restore access:

1. Set `ADMIN_MFA_ENFORCED = false` (UI redirect removed).
2. Revert AAL2 clauses in RLS policies on audit-response, audit-request and enquiry tables back to
   `has_role(auth.uid(),'admin')`.
3. Remove the `aal2` claim check from privileged edge functions.

Non-administrators remain blocked throughout; rollback never loosens RLS below today's posture and
requires no data migration and no data exposure.
