# Administrator TOTP MFA — Staged Development Proposal

Status: proposal only. Nothing is enforced, no session is invalidated, and no authentication setting beyond leaked-password protection has been changed. Indexing, navigation, promotion, checkout, email and video-release posture stay exactly as they are.

## 1. Scope

Single administrator account (`admin@…`), one role (`admin`), protected surfaces:

- Routes: `/admin`, `/admin/crm`, `/admin/submissions`, `/admin/audit-requests`, `/admin/outreach`, `/admin/cpd-audit`
- Data: audit responses/requests and enquiry tables (SELECT/UPDATE)
- Privileged functions: CRM retry, action/acknowledgement marking, subject-request handling

## 2. Enrolment and setup

- New page `/admin/security` (visible only to a signed-in admin).
- "Add authenticator" calls the TOTP enrol API, renders the returned QR code plus the manual secret string, and shows a 6-digit input.
- The first code is verified through a challenge/verify pair; only on success is the factor marked verified. Unverified factors are removed on cancel so no half-enrolled state can linger.
- The page lists verified factors with created date and an "unenrol" control that itself requires a fresh valid code.

## 3. Challenge after password login

- After a successful password sign-in, the admin auth hook reads the account's assurance level. If a verified TOTP factor exists and the session is only AAL1, the user is routed to `/admin/verify` and cannot leave it except by verifying or signing out.
- `/admin/verify` issues a challenge, accepts the 6-digit code, and on success the session is upgraded to AAL2 in place (same session, no re-login).
- Failed codes are rate-limited client-side and by the auth service; five consecutive failures force sign-out.

## 4. Route enforcement (staged, off by default)

- A single flag `ADMIN_MFA_ENFORCED` (build-time constant, default `false`) governs whether AAL1 sessions are blocked from protected routes.
- While `false`: enrolment, challenge and verification all work, but an AAL1 admin session retains today's access — so the current session is never locked out during development.
- Flipping to `true` is a one-line change made only on written approval.

## 5. Data-layer enforcement (not UI only)

- A security-definer helper `public.is_aal2()` reads the request JWT claim `aal` and returns true only for `aal2`.
- Policies on audit-response, audit-request and enquiry tables are rewritten to `has_role(auth.uid(),'admin') AND public.is_aal2()` for SELECT and UPDATE, so a raw API call with an AAL1 token returns zero rows / permission denied even if the UI is bypassed.
- These policy changes ship in the same approval step as enforcement, not before, so the current AAL1 session keeps working during staging.

## 6. Privileged functions

- Edge functions handling CRM retry, action/acknowledgement and subject requests validate the bearer token server-side (`getUser`), confirm the `admin` role, and require `aal2` in the token claims; otherwise they return 403.
- Service-role writes remain server-only and are never reachable from the browser.

## 7. Existing sessions

- Existing sessions stay valid. Enrolling a factor does not revoke tokens.
- On enforcement day, the current AAL1 session is upgraded by completing one challenge — no forced sign-out, no password reset.

## 8. Recovery (single administrator, lost device)

- Primary: a second enrolled factor. During enrolment the admin adds the authenticator on two devices (or stores the secret in the password manager) so device loss is not account loss.
- Secondary: a break-glass procedure — a support-side factor deletion for the account, performed against the auth service, followed by immediate re-enrolment. It removes MFA only; it does not read, export or expose any audit data.
- Rollback: set `ADMIN_MFA_ENFORCED` back to `false` and revert the AAL2 clauses in the policies. Access returns to today's password + role model with no data migration and no data exposure.
- Password reset and leaked-password protection are unaffected by either path.

## 9. Test plan

| # | Case | Expected |
|---|------|----------|
| 1 | Enrol factor, scan QR, submit valid code | Factor verified, listed on `/admin/security` |
| 2 | Enrol, submit invalid code | Error shown, factor stays unverified, no access change |
| 3 | Cancel enrolment midway | Unverified factor removed |
| 4 | Clean-session password login (enforced) | Redirect to `/admin/verify`, no admin data rendered |
| 5 | Valid code at challenge | Session upgraded to AAL2, admin routes load |
| 6 | Invalid / reused / expired code | Rejected, no upgrade; 5 failures force sign-out |
| 7 | Direct URL to `/admin/audit-requests` with AAL1 | Redirected to verify, no fetch issued |
| 8 | Direct REST call to audit tables with AAL1 token | Zero rows / permission denied |
| 9 | Direct call to retry / acknowledge / subject-request functions with AAL1 token | 403 |
| 10 | Expired or revoked session | Sent to login, AAL2 not inherited |
| 11 | Device-loss recovery | Factor removed, re-enrolment succeeds, no audit data exposed |
| 12 | Rollback | Flag off + policies reverted: admin access restored, non-admins still blocked |

## 10. Sequence before enforcement

1. Build enrolment + challenge UI with `ADMIN_MFA_ENFORCED=false` (no policy change yet).
2. You verify the enrolment interface and enrol the administrator manually.
3. Second clean-session login succeeds through the challenge.
4. Recovery procedure confirmed.
5. On your written approval: flip the flag, apply the AAL2 policy and function checks, re-run tests 4–12.
