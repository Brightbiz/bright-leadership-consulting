# Bright website revision — preview review package
9 November 2026 · Prepared for Irene A. Agunbiade
Updated 9 November 2026 (third pass): final evidence corrected; hosted-preview checks remain OUTSTANDING. Earlier v1/v2 reports are historical and superseded by v3.

**Preview only. Nothing published or deployed. No live submissions, records, emails or external-account changes.**

## R1. Starting point and scope
### R1.1 Live versus preview
Before page edits, rendered text and main-page links matched exactly on /, /academy, /courses and /leading-people. Public live pages were read-only; third-party requests blocked. The 4 November release 09a5516 is complete, not pending.
### R1.2 Already complete
Four Academy programme names and their existing links; Courses jump links including #comparison; homepage primary-action hierarchy; Leading People top/lower buttons and existing cohort URL; workshops, workbook/resources, practice/feedback, sponsor reviews, six-week format and £4,800 cohort fee. Kept, not duplicated.
### R1.3 Historical article status — superseded
Before this task: src/App.tsx + src/pages/InsightPreviewArticles.tsx, plus internal roadmap.md, compared with 09a5516. At that earlier stage the three articles were preview-only, noindex, unlisted and absent from sitemap. This is historical: their import/route has since been removed and the unchanged article source moved to on-hold/insights-preview/InsightPreviewArticles.tsx. The article URLs now render not-found; see R9.1.

## R2. Leading People employer journey
### R2.1 Buttons and destination
Both existing buttons now say **Enquire about a cohort** and navigate to [https://id-preview--43b21fe4-e960-444b-bb8f-f71668f51cbd.lovable.app/contact?cohort=leading-people#enquiry-form](https://id-preview--43b21fe4-e960-444b-bb8f-f71668f51cbd.lovable.app/contact?cohort=leading-people#enquiry-form). Observed: Employer cohort selected (stored enquiryType remains Organisational / leadership team), cohort heading visible below fixed header and focused. The Contact page’s existing cohort button uses the same wording/destination.
### R2.2 Form wording and dependencies
Before: no form anchor; general organisational explanation mentioned board/executive advisory; participant label “Size of the leadership team in scope”.
After, only on explicit cohort route: **Leading People employer enquiry**; employer/cohort explanation without diagnostic prerequisite; **Approximate number of managers**, placeholder “e.g. 8–12 managers”.
Exact-text search across repository source, admin/CRM, functions, reports/scripts and on-hold materials found that label only in Contact.tsx. No admin/CRM/report dependency found. External reports not in this repository are unverified. Field identifiers and the “Approx. participants:” submitted detail prefix are unchanged. Route transitions reset route-specific selection/prefill, avoiding cohort wording leaking into a later general journey.
Message preservation (added second pass): the route-change reset now replaces the message only when it is still the untouched automatic template (or empty); any text the visitor typed is preserved in both directions. Verified by four regression tests and an isolated browser check: typed text survived leaving and entering the cohort route; the untouched template was cleared on the general route and re-added on the cohort route. No page errors.
### R2.3 Page scanning
Added quiet jump links to existing audience, format, workshop, participant-support and fee sections; revised headings to “Who it’s for”, “What participants receive” and “Six-week format and commitment”. No duplicate curriculum or deliverables added. Workshop titles/content, six-week delivery, direct-report manager audience and fee unchanged. Lower button remains after programme details/questions.
### R2.4 Wording for Bright’s review
Lower heading: **What happens after you enquire?**
Note: “Tell us about the managers you’d like to develop. We’ll discuss your needs and whether Leading People is a good fit.”
This is the suggested wording in the brief, grounded in the existing fit discussion; no response-time or booking promise added. Please review this wording as part of the preview.
### R2.5 Submission and tracking preservation
Code comparison: contactSchema and the entire onSubmit handler byte-identical to c004ba5. Attribution allowlist, field names, email routing, confirmation and tracking implementation untouched. Existing confirmation still says a team member will respond shortly; it was not changed under this brief. Runtime submission/email/record processing **untested**: no form was sent, even to a mock service. Interface validation checked by blur only.

## R3. Homepage actions
### R3.1 Order and destinations
1. **Discuss Executive Alignment** → /contact (only outlined primary action).
2. **Executive Alignment Index™** → /executive-alignment-index (existing quiet link retained).
3. **Explore Bright Leadership Academy** → /academy (new distinct quiet secondary link).
Desktop: primary and Index link on first row, Academy on the next when width requires; mobile: ordered stacked actions, all readable/tappable after scrolling. Existing spacing/design retained; the mobile opening content extends below the first screen. Screenshots below show both layouts after rejecting analytics.
### R3.2 Preview
[Homepage](https://id-preview--43b21fe4-e960-444b-bb8f-f71668f51cbd.lovable.app/)

## R4. Academy programme choice
### R4.1 Audience descriptions
Drawn from existing approved programme-page copy, stored alongside the shared catalogue (no invented audience or benefit):
- ELM: “Senior leaders and high-potential executives who require a comprehensive, accredited development pathway.” Individual-facing; no employer language or employer-offer destination added.
- AI: “Chairs and non-executive directors; chief executives and executive directors; functional leaders with AI exposure.”
- Future Workplace: “Chief executives and executive directors; chief people officers and HR directors; divisional and functional leaders.”
- Productivity: “Chief executives and executive directors; senior leaders carrying delivery load; leadership teams with throughput problems.”
Sources: ELM opening description; the other three existing “Who the Programme Is For” audience headings. Separate employer-funded Leading People section retained.
### R4.2 Existing identities and observed destinations
| Approved display name retained | Actual preview URL | Result |
|---|---|---|
| Executive Leadership Mastery Programme | https://id-preview--43b21fe4-e960-444b-bb8f-f71668f51cbd.lovable.app/executive-leadership-mastery | passed; no redirect |
| Strategic Leadership in the Age of AI | https://id-preview--43b21fe4-e960-444b-bb8f-f71668f51cbd.lovable.app/strategic-leadership-ai | passed; no redirect |
| Future Workplace and Workforce Strategy Programme | https://id-preview--43b21fe4-e960-444b-bb8f-f71668f51cbd.lovable.app/future-of-work | passed; no redirect |
| Strategic Productivity and Peak Performance Accelerator | https://id-preview--43b21fe4-e960-444b-bb8f-f71668f51cbd.lovable.app/strategic-productivity-peak-performance | passed; no redirect |
The brief abbreviates the ELM/Future Workplace titles without “Programme”; the approved existing catalogue names are retained, not silently renamed.
### R4.3 Comparison and other Academy links
[Academy](https://id-preview--43b21fe4-e960-444b-bb8f-f71668f51cbd.lovable.app/academy) · [Comparison](https://id-preview--43b21fe4-e960-444b-bb8f-f71668f51cbd.lovable.app/courses#comparison)
“Compare the four executive programmes” uses the actual #comparison anchor, not the top of Courses; section receives focus and sits below the fixed header. Leading People, catalogue and Insights links also checked. Comparison content unchanged; Courses receives an accessibility/focus-only change, so its lastmod is unchanged.

## R5. Brochure links — separately itemised extension
### R5.1 Current linked versions inspected
Website footer links to these HTML versions; live copies each returned 200 and their enquiry CTA still points to the general absolute live /contact URL:
- public/brochures/executive-leadership-mastery-brochure.html
- public/brochures/future-of-work-brochure.html
- public/brochures/peak-performance-brochure.html
These are the corresponding public HTML routes, not separate React brochure routes. Existing shared CSS/CTA script and rewrite mapping inspected, unchanged.
### R5.2 Destination-only changes and observed selections
Each HTML has one changed href, now same-origin so preview stays preview:
| Brochure | Actual destination path (append to preview origin) | Observed selection |
|---|---|---|
| ELM | /contact?programme=Executive%20Leadership%20Mastery%20Programme#enquiry-form | Individual executive; Executive Leadership Mastery Programme |
| Future Workplace | /contact?programme=Future%20Workplace%20and%20Workforce%20Strategy%20Programme#enquiry-form | Individual executive; Future Workplace and Workforce Strategy Programme |
| Peak Performance | /contact?programme=Strategic%20Productivity%20and%20Peak%20Performance%20Accelerator#enquiry-form | Individual executive; Strategic Productivity and Peak Performance Accelerator |
Navigation by keyboard confirmed form heading focused and visible below header. The existing programme-page individual enquiry helper is reused, adding the form anchor only. No ELM employer route introduced.
### R5.3 Preservation proof
The attached diff shows exactly one href replacement per HTML. Automated comparison normalising only those hrefs makes each before/after HTML byte-identical: all copy, fees, accreditation, CPD details, design, scripts and print controls preserved. Shared brochure mapping has the same three destination changes; legacy mappings unchanged.
### R5.4 PDF/download/external limits
These HTML brochures use browser “Print / save as PDF”; no separately linked programme-specific PDF was found in the inspected tracked public destinations. No existing PDFs were edited or regenerated. Previously downloaded PDFs, review PDFs in Files, the separate portfolio PDF, embedded PDF links/images, Thinkific and any externally hosted copies were **not checked or updated**. Their destinations are **unverified**, not assumed old. Both legacy brochure files remain byte-identical to the recorded baseline, verified by existing tests; no retirement/badge/CPD wording action.
### R5.5 Preview brochure URLs
- [ELM brochure](https://id-preview--43b21fe4-e960-444b-bb8f-f71668f51cbd.lovable.app/brochures/executive-leadership-mastery-brochure.html)
- [Future Workplace brochure](https://id-preview--43b21fe4-e960-444b-bb8f-f71668f51cbd.lovable.app/brochures/future-of-work-brochure.html)
- [Peak Performance brochure](https://id-preview--43b21fe4-e960-444b-bb8f-f71668f51cbd.lovable.app/brochures/peak-performance-brochure.html)

## R6. Verification and safety
### R6.1 Environment
Chromium via Playwright, emulated viewports: **1280×1800 desktop**, **884×674 tablet/current preview**, **390×844 mobile** CSS pixels. Not real-device testing. Behaviour verified on localhost preview; managed hosted preview fetch returned 401, so hosted-injected behaviour is not established by local checks.
### R6.2 Check table
| Acceptance check | Viewports | Status | Limitation/evidence |
|---|---|---|---|
| Earlier four-name / jump-link / primary hierarchy release | live + local 1280 | already complete | Rendered text and main links matched before edits |
| Leading People upper/lower CTAs, cohort selection, anchor/focus | 1280 / 884 / 390 | passed | Correct heading below fixed header |
| Cohort route direct load and refresh | 1280 / 884 / 390 | passed | Cohort selected, scoped wording |
| General advisory and four programme selections | 1280 / 884 / 390 | passed | Original labels outside cohort; programme selected |
| Contact route back-navigation clears cohort presentation | 390 | passed | General selection restored |
| Existing ELM employer-funded and webinar individual route | 390 | passed | Interface/selection only; no submission |
| Three homepage actions and order | 1280 / 884 / 390 | passed | Desktop/mobile screenshots reviewed |
| Four Academy programme destinations | 1280 / 884 / 390 | passed | Final paths correct; no redirects |
| Academy comparison link | 1280 / 884 / 390 | passed | Actual #comparison; focused; clear of header |
| Other Academy actions (Leading People/catalogue/Insights) | 390 | passed | Actual links clicked |
| Three brochure CTA keyboard destinations and selections | 1280 / 884 / 390 | passed | Same-origin; correct programme |
| Five Leading People keyboard section links | 1280 / 884 / 390 | passed | Focusable target; corrected scroll after first check |
| Form labels and visible keyboard ring | 1280 / 884 / 390 | passed | Labels attached; focus ring observed |
| Name/email validation | 390 | passed | Blur checks only, no submit |
| New controls’ mobile tap sizing and text readability | 390 | passed | Quiet links ≥44px; labels wrap; screenshots reviewed |
| Affected-page horizontal overflow/runtime errors | 1280 / 884 / 390 | passed | 82 flow checks, no overflow/new page errors |
| Contrast | all | passed (limited) | Existing semantic foreground/muted/focus tokens retained; visual review. No new full-site numerical contrast audit |
| Local isolation self-test / external responses | all | passed | DNS kill switch + context-wide deny-by-default; self-test blocked; zero nonlocal responses |
| Submission handler/schema and tracking hooks | code | passed | Byte-identical handler/schema; analytics files unchanged |
| Automated regression tests | local | passed | 37 tests in six files; known test-environment reload/router warnings only |
| End-to-end submission, record save, email delivery | all | untested | No submission performed; no backend claim |
| Hosted preview platform telemetry and real devices | hosted/physical | untested | Hosted fetch 401; not inferred from source |
### R6.3 Analytics findings
Application GA4 uses the same production measurement ID on every host; there is no hostname exclusion in the tag loader. **After analytics consent, preview can send production GA4 events** (code finding; no production event deliberately generated). All local browser checks used DNS blocking plus whole-context network blocking and rejected analytics; local dataLayer events are not evidence of external delivery. No Google script/config or analytics setting changed. Hosting-added analytics outside source remain unverified; hosted preview 401 prevented safe inspection. Production collection was blocked during testing; no analytics-acceptance test was run.

## R7. Review groups, files and later publication scope
### R7.1 Equivalent reviewable groups
The platform recorded the initial edits together in a6ad8fd when the supplementary message arrived; no history was rewritten. Equivalent scoped diffs are retained internally under on-hold/website-revision-09nov2026:
- **G0 shared dependencies:** Contact presentation/route-prefill, useEnquiryAnchor, AGENTS notes, sitemap source/output.
- **G1 Leading People:** LeadingPeople.tsx.
- **G2 homepage:** HeroSection.tsx.
- **G3 Academy:** Academy.tsx, Courses.tsx; audience hunks in shared programmes.ts.
- **G4 brochures:** three HTML files, destination hunks in programmes.ts, brochureEnquiryRoutes.test.ts.
- Shared catalogue diff explicitly shows G3 audiences and G4 destination hunks separately.
### R7.2 Can groups publish independently?
Not by pressing Publish in this combined working version: it publishes the whole current site. G2 is logically separable with only homepage lastmod; G1 needs Contact/anchor + its two lastmods; G3 needs catalogue audience hunks + Courses/anchor + Academy lastmod; G4 needs destination mapping/HTML/test + Contact/anchor + three brochure lastmods. Catalogue, anchor, Contact and sitemap are shared dependencies, so a selective release would require preparing and verifying a selected source state first.
Second pass: a selected release state HAS now been prepared — see R9.1.
### R7.3 Exact public changes a later publish would include now
Superseded by R9.1: the article routes and source are no longer in the build. A publish of the current state would include exactly the G0–G4 frontend/assets changes, the message-preservation fix, and the seven lastmod changes listed in R7.5 — and nothing else beyond the already-live 09a5516 scope. Internal on-hold diffs, tests, AGENTS and roadmap are not public pages.
No backend deployments/configuration, badge replacement, CPD explanatory revision, tax wording change, legacy retirement, workbook activity or framework migration is in this change set.
### R7.4 Changed-file list
AGENTS.md; src/hooks/useEnquiryAnchor.ts; src/pages/LeadingPeople.tsx; src/pages/Contact.tsx; src/components/HeroSection.tsx; src/pages/Academy.tsx; src/pages/Courses.tsx; src/data/programmes.ts; the three public brochure HTML files listed in R5.1; src/test/brochureEnquiryRoutes.test.ts; scripts/generate-sitemap.mjs; public/sitemap.xml; roadmap.md; internal review diffs/report under on-hold/website-revision-09nov2026. Also changed against preparation baseline c004ba5: src/App.tsx (article import/route removed); src/pages/InsightPreviewArticles.tsx moved unchanged to on-hold/insights-preview/InsightPreviewArticles.tsx; src/test/contactMessagePreservation.test.tsx (four regression tests); on-hold/cpd-audit/snapshot.json (internal record). App.tsx has no net difference against published 09a5516, but was edited during preparation. No analytics/backend file edited. R10 and the final appendix provide the complete inventory.
### R7.5 Explicit sitemap implications
| Entry | Live/prior lastmod | Proposed preview lastmod |
|---|---|---|
| / | 2026-11-04 | 2026-11-09 |
| /academy | 2026-11-04 | 2026-11-09 |
| /leading-people | 2026-10-30 | 2026-11-09 |
| /contact | 2026-10-30 | 2026-11-09 |
| Three retained brochure HTML entries | 2026-11-02 | 2026-11-09 |
Dates updated by hand in source and regenerated sitemap, as required by the existing rule. /courses remains 2026-11-04 (focus-only change); /insights and every other entry unchanged. No article entry added. All date changes remain unpublished.
### R7.6 Separate pending work and holds
Three Insights articles; badge/date decision; public CPD wording and separate tax/enrolment proposal; both legacy brochure retirement notices; sample workbook/marketing follow-up; AI-audit release, private EDL, ELM employer-offer issuance/legal effective-date decision; outreach approval/sending and other existing backend/live-test holds. These records are not implemented by this brief. Older unresolved crawler-visible previews and separate peak brochure print pagination remain unchanged.

## R8. Hold points and requirement references
All original/supplementary sections now have unique handover references R1–R8 and Rn.n subsections. Original continued Leading People material → R2.3–R2.5; Academy destinations → R4.2; verification safety → R6.2–R6.3. Supplement dependencies → R2.2; homepage order → R3.1; ELM audience → R4.1; analytics → R6.3; brochure diff/copies → R5.3–R5.5; separation → R7.1–R7.3; unique numbering → R8.
No publication, deployment, messages, live form submissions or external changes authorised/performed. All separate holds remain unchanged.

## R9. Second pass — implementation corrected; hosted checks outstanding (9 November 2026)
### R9.1 Release state excluding the articles (prepared, awaiting approval)
The preview-only Insights article route and source are removed from the build: src/App.tsx is byte-identical to the published 09a5516, and the article component is held at on-hold/insights-preview/InsightPreviewArticles.tsx (content also preserved in git history and Files/insights-drafts/). Verified: typecheck clean, all 250 tests in 31 files pass, build OK, and in-preview the three article URLs render the not-found page while /, /academy, /courses, /leading-people and /contact load correctly. The exact public scope a publish would now ship: G0–G4 changes (R7.1), the message-preservation fix (R2.2), and the seven hand-recorded sitemap date changes (R7.5) — all explicitly included. Articles can be restored after publication without touching this scope.
### R9.2 Message preservation
Resolved as recorded in R2.2: route switches replace only untouched automatic text; visitor-written content is preserved. Four regression tests (src/test/contactMessagePreservation.test.tsx) plus an isolated browser check, all passing.
### R9.3 Local versus hosted-preview verification — OUTSTANDING
All behavioural checks remain local (localhost preview, emulated Chromium). The managed hosted preview was re-checked on 9 November and still returns HTTP 401, so hosted behaviour, hosting-injected telemetry and real-device rendering remain unverified. When the hosted preview is accessible, the affected navigation and layout checks should be repeated there with production analytics blocked and no live form submissions. End-to-end submission remains explicitly untested under the existing boundary.
### R9.4 Audience inconsistency — flagged for a separate copy decision
The new Academy audience descriptions position Future Workplace and Productivity for senior executives, while the retained brochure footers say “For Professionals, Managers, Supervisors & Team Leaders.” These footers were preserved unchanged under the destination-only instruction. Visitors could receive different audience signals. This is flagged for a separate copy decision; this release does not alter it.

## R10. Final evidence and exact review reference
### R10.1 Commit and baselines
Exact final implementation commit for review and eventual publication: **ada806787b39194abc52b28f5a38aaaf71c718e8**.
Published baseline: **09a5516aac5e75f9a5c4afe919d5d416b2b062c7**.
Preparation baseline (includes the earlier article pages): **c004ba54640e2829d9876aa5bab7a709753684b7**.
This third pass changes documentation/evidence only, not the implementation scope. Before eventual publication, confirm the current public/source state still matches this implementation commit; a documentation-only successor is not an extra public change.
### R10.2 Final appendix
The v3 appendix replaces the stale initial-pass diff with the final preparation-baseline-to-implementation-commit diff: conditional message preservation, all four regression tests, App article import/route removal and unchanged article-source relocation. It also includes the published-baseline public/source diff and complete changed-file inventory. The final evidence file is final-implementation.diff; earlier grouped diff files and v1/v2 attachments are historical initial-pass evidence, not the final appendix.
Fresh targeted verification: **7 tests passed in two files**, including all four message-preservation tests. The broader 250-test and local browser results in R9 remain earlier verification, not newly performed hosted checks.
### R10.3 Hosted-preview retry — OUTSTANDING
Read-only retry on 9 November 2026 returned **HTTP 401** again. Hosted navigation/layout checks remain **OUTSTANDING**, not resolved, because the intended pages cannot be reached. When accessible, repeat affected navigation, four programme links, three brochure destinations, anchors and desktop/tablet/mobile layout checks with production analytics blocked, consent rejected and context-wide network/submission guards. No live forms may be submitted. Local verification does not establish hosting-injected telemetry behaviour.
No publication, backend deployment, messages, badge change or live submissions were performed; all separate holds remain unchanged.
