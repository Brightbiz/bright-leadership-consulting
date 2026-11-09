# Follow-up review package — 9/10 Nov 2026 (preview only)

Nothing published, deployed, submitted or sent. Insights articles and all existing holds remain separate. Base: published f95c47c (= ada8067 + 6602274).

## Status key
IMPLEMENTED (preview) / PROPOSAL (needs approval) / BLOCKED / UNVERIFIED

## A. Programme audiences and claims — BLOCKED
No Future Workplace or Productivity teaching materials exist in the project (only website pages and HTML brochures). Every listed output is therefore an evidence gap until materials are supplied: workforce strategy documents, hybrid structures, organisational-design principles, executive-capacity diagnosis, personal operating systems, team-throughput measures.
Proposed audience wording (not applied): as in the brief. Current page descriptions remain board/senior-leader framed ("board-level programme", "for senior leaders"), which conflicts with the proposed wording.
Needed: module outlines/workbooks for both programmes.

## B. Enquiry measurement — FINDINGS ONLY (no change made)
| Need | Current state |
|---|---|
| Page visits incl. in-app navigation | GA4 config + Enhanced Measurement history events (consent-gated). Covered. |
| Programme page views | `programme_view` / `programme_page_view`. Covered. |
| Academy discovery + programme buttons | No event on /academy links. GAP. |
| Leading People upper vs lower buttons | No event on either. GAP. |
| Programme enquiry-button clicks | `programme_enquiry_click` (ProgrammeCta); brochures `course_cta_click`. Covered, two names. |
| Successful enquiry by offer | Only `elm_employer_funded_enquiry_submit`, fired after a successful response. No general success event. GAP. The database record (contact_submissions.enquiry_type/source) is the reliable success count. |
| Campaign tags to record | utm_source/medium/campaign allow-listed and stored on contact_submissions. Covered. |
Proposal (needs approval, frontend only): reuse `programme_enquiry_click` on Academy links (`cta_surface: academy`) and Leading People (`cta_surface: leading_people_upper|lower`); add one `enquiry_submit_success` fired only after a successful response, params `enquiry_type`, `source` only (no name/email/message), replacing no existing event; ELM event kept, not double counted (report uses one or the other). Marking it as a GA4 key event is an analytics-account change: separate approval.

## C. Reporting — METHOD (no dashboard)
Two- and four-week review per offer (advisory, each Academy programme, Leading People):
1. Source/medium/campaign → GA4 sessions (Traffic acquisition).
2. Relevant page visits → GA4 page views by path.
3. Enquiry clicks → events above by `programme_name` / `cta_surface`.
4. Successful enquiries → contact_submissions grouped by enquiry_type/source/utm_*, date range (admin export).
Qualified opportunities and bookings come from CRM deal_stage and lp_enrolments, never from web events.
Missing: Academy and Leading People click events; general success event; GA4 reporting access (read connection) for whoever runs the review; consented-only GA4 data understates traffic, so step 4 counts are the reference.

## D. Badge — BLOCKED
Official 2025–2027 file is not in the project; please upload it. Known reference: /principal (`src/pages/Principal.tsx`, `public/cpd-standards-office-accredited.png`). Search limits: repository text only; images embedded inside PDFs and Thinkific not searched. Nothing replaced.

## E. Public CPD wording — IMPLEMENTED (preview)
Confirmed ranges unchanged: ELM 50–66, AI 20–30, Future Workplace 20–25, Productivity 20–25.
| Location | Before | After |
|---|---|---|
| Before You Enrol (4 programme pages) | "Most participants complete in line with the accredited range of {hours}… lower bound… upper bound…" | "Approved CPD hours: {hours}." |
| Programme FAQ "How much time…" | "The accredited range is {hours}. The lower bound… Most participants spread this…" | "Approved CPD hours: {hours}." |
| AI page FAQ | "…20–30 accredited CPD hours, depending on depth of engagement with the working documents and capstone." | "Approved CPD hours: 20–30." |
| CPD FAQ (Courses, Terms, portfolio PDF source) | Range explanation; "how range is determined"; module-by-module completion definition; partial-completion statement | "Approved CPD hours are stated as a range for each programme, as recorded with The CPD Standards Office (Provider Number 50838). {list}." / "Completion means satisfying the approved completion requirements for the programme, as confirmed on enrolment." Certificate statement kept unchanged. |
| Headings | "How CPD Hours Are Determined", "CPD hours explained" | "Approved CPD Hours" / "Approved CPD hours" |
Module-specific completion requirements removed because no approved documentation is in the project; can be restored when supplied. Leading People non-accredited distinction untouched. No validity/expiry wording added. Tax and employer-offer wording untouched.
PDFs NOT updated: `public/downloads/programme-portfolio.pdf` (generated from the FAQ source; regenerate on approval), embedded certificate/badge images, Thinkific copies. Generated workbook PDFs carry range-only footers (no change needed).
Sitemap dates set to 2026-11-10: /courses, /terms, /executive-leadership-mastery, /strategic-leadership-ai, /future-of-work, /strategic-productivity-peak-performance.
Checks: all 32 test files pass plus new wording test; /courses, /strategic-leadership-ai, /terms at 1280 and 390 show new wording, no sideways scroll, external requests blocked, no forms submitted.

## F. Legacy brochures — PROPOSAL
URLs: /brochures/advanced-leadership-skills-brochure.html, /brochures/enhanced-employability-skills-brochure.html. Both have an active "Enquire About This Programme" link to /contact (plain). Internal references: catalogue enquiry map (`src/data/programmes.ts`), validation script, hash-pinned hold test. Neither is in the sitemap; neither is linked from site pages.
Redirect: the host does not apply `vercel.json`; a server 301 cannot be set from code. Options: (1) replace the Advanced Leadership file with a short noindex retirement notice linking to /courses (drafted earlier); (2) in-page redirect (not a true 301). Both take effect only on publication. Not implemented per the stop rule. Historical copy preserved in on-hold/brochure-review/legacy. External/downloaded copies cannot be withdrawn. Employability unchanged.

## G. Publication scope (if approved later)
Group E files: BeforeYouEnrol.tsx, ProgrammeFaq.tsx, cpd-faq.json, StrategicLeadershipAI.tsx, Courses.tsx, Terms.tsx, generate-sitemap.mjs (six dates), new test. Shared dependency: cpd-faq.json also feeds the portfolio PDF generator. No other pending public source changes.
