# Executive Decision Leadership Intensive™ — staging build notes

Built to the governing brief (`Executive_Decision_Leadership_Intensive_Lovable_Staging_Build_Brief_2.md`).

## Routes (staging, noindex/nofollow, excluded from the sitemap, not linked from navigation)

| Route | Purpose |
| --- | --- |
| `/executive-decision-leadership-intensive` | Programme page. Application-led only; no checkout, cart or instant enrolment. |
| `/executive-decision-leadership-intensive/apply` | Six-step application: identity, responsibility, decision trigger, confidentiality, commitment, declaration. |
| `/executive-decision-leadership-intensive/employer-information` | Employer-information request. Administrative questions only; no invoice or payment route before suitability. |
| `/admin/edl-applications` | Private review screen (admin role required). Human decision for every status. |

## Data

- `edl_applications` — full application record, status, reviewer, review notes, offer reservation.
- `edl_application_access_needs` — access-support information held separately and shown as restricted; never included in analytics or notifications.
- `edl_employer_requests` — employer-information requests.

All three are service-role write / admin-read only under RLS. Public intake goes through the
`submit-edl-application` edge function: honeypot (answers 200 silently), server-side validation,
five submissions per IP per hour, and service-role inserts.

## Analytics

Categorical funnel events only (`programme_page_view`, `programme_apply_click`,
`programme_application_start`, `programme_application_submit`,
`programme_employer_info_request`, `programme_clarification_invite`,
`programme_offer_issued`, `programme_employer_commitment`,
`programme_enrolment_confirmed`, `programme_withdrawal`). No names, emails,
organisation names or free text are transmitted.

## Verification

- 140/140 tests pass, including `src/test/edlIntensive.test.tsx` (fixed facts, noindex, application-only language, no purchase route).
- Production build OK; TypeScript clean.
- Browser checks: all three routes render with `robots: noindex, nofollow`; the application form retains focus while typing; 360px layout verified.
- Endpoint checks: `GET` → 405, unknown type → 400, missing fields → 400, honeypot → silent 200. No records were created.

## Open launch blockers (must clear before publishing or accepting real applications)

1. `[PROGRAMME EMAIL]` — programme mailbox not supplied.
2. `[RESPONSE PERIOD]` — response commitment not approved.
3. Privacy provider, legal basis, retention and transfer wording not approved.
4. Legal review of final enrolment/cancellation terms and the confidentiality undertaking.
5. Published legal URLs and accessibility contact not validated.
6. Applicant and internal notifications intentionally not implemented while (1) and (2) are open.
