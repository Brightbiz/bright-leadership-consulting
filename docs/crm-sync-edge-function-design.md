# CRM Sync Edge Function — Implementation Design (read-only, not implemented)

Fixes the defect where `AdminCRM.tsx` calls the service-role-only
`public.sync_existing_leads_to_crm()` with a user JWT and always fails.

## 1. Name and route
- Function: `admin-sync-crm`
- Route: `POST /functions/v1/admin-sync-crm`
- Config: default `verify_jwt = false`; the token is validated in code.

## 2. Bearer-token validation
- Read `Authorization: Bearer <token>`; reject 401 when absent or malformed.
- Create an anon-key client with the caller's `Authorization` header and call
  `auth.getUser()` server-side. No user id is taken from the request body.

## 3. Administrator confirmation
- With the caller-scoped client, call `rpc("has_role", { _user_id: user.id, _role: "admin" })`.
- Non-admin → 403, generic message, no detail about roles or data.

## 4. Assurance level
- No AAL2/`aal` check is introduced. `ADMIN_MFA_ENFORCED` stays `false`; an AAL1
  administrator session retains current access. AAL2 gating is added only with a
  separately approved enforcement change.

## 5. Service-role invocation
- A second client is created with `SUPABASE_SERVICE_ROLE_KEY` (server env only)
  and calls `rpc("sync_existing_leads_to_crm")` after the role check passes.
- Grants stay unchanged: the function remains service-role only.

## 6. CORS and method
- Import `corsHeaders` from `npm:@supabase/supabase-js@2/cors`; answer `OPTIONS`
  with `ok`.
- Only `POST` is accepted; anything else → 405 with CORS headers.

## 7. Request validation
- Zod: `z.object({ reason: z.string().min(3).max(200).optional() }).strict()`.
- Empty body allowed; unknown keys → 400 with field errors.

## 8. Rate limiting / replay protection
- Reuse the existing `rate_limits` ledger via the shared limiter: 3 syncs per
  administrator per hour, keyed on `admin-sync-crm:<user.id>`; 429 on exceed.
- Idempotency: an in-flight/completed run within 60 s for the same operator
  returns the prior result rather than re-running.

## 9. Audit logging
- Insert into the existing audit ledger: action `crm_sync`, operator user id and
  email, `created_at` timestamp, rows-synced count, outcome, request id. No lead
  payloads are logged.

## 10. Responses and errors
- 200 `{ synced: <number>, at: <iso> }`.
- 401 / 403 / 400 / 405 / 429 / 500 with generic messages; database errors are
  logged server-side only and never returned verbatim.

## 11. Frontend change (`AdminCRM.tsx`)
- Replace `supabase.rpc("sync_existing_leads_to_crm")` with
  `supabase.functions.invoke("admin-sync-crm", { method: "POST" })`.
- Surface synced count on success, and the mapped 401/403/429 states as toasts.
  No key material or role logic moves to the client.

## 12. Test cases
1. No token → 401. 2. Valid non-admin → 403. 3. Valid admin → 200 with count.
4. `GET` → 405. 5. Unknown body key → 400. 6. Fourth call in an hour → 429.
7. Duplicate call within 60 s → prior result, single ledger row.
8. Audit row written with operator identity and timestamp.
9. Direct `rpc("sync_existing_leads_to_crm")` with a user JWT still fails
   (grants unchanged). 10. AAL1 admin succeeds while `ADMIN_MFA_ENFORCED` is
   `false`.

## 13. Rollback
- Delete the edge function and revert the single `AdminCRM.tsx` call site. No
  migration, grant, RLS policy or identity wording is involved, so rollback is
  code-only and leaves no database state behind.

## 14. Key handling
- `SUPABASE_SERVICE_ROLE_KEY` is read only inside the edge function runtime.
  It is never imported into `src/**`, never referenced by browser tests, and
  never emitted into build output.
