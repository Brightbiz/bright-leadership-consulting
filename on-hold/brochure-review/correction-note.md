# Brochure correction review — 2 November 2026

**Preparation only. Nothing published, deployed or emailed; no live tests, records, historical logs or Thinkific settings touched.**

## v4 correction and release decision — supersedes the v3 inspection/scope below
Victoria identified outcomes 09–10 as unlabelled continuation on page 5 of ELM v3. Print-only rules now keep the complete outcomes container together and reduce its internal spacing, without changing outcome wording or screen layout. An initial keep-together render increased ELM to seven pages; compact print spacing resolved that regression. Final ELM v4 is six pages, with heading and all ten outcomes on page 4, assessments on page 5 and fee/closing/footer on page 6.
All 15 final pages were rendered and visually checked; no clipping, stranded outcome headings, split outcome items, blank or footer-only pages found. Eight desktop/mobile print checks passed with zero external responses, production egress, click requests or runtime errors. Four legacy/CPD safeguard tests passed. External fonts remain blocked, so these are fallback-font checks. No live verification performed.

### Brochure-only approval scope
The proposed brochure release is limited to the four retained HTML files under public/brochures (ELM, Peak, Future of Work and EAI), public/brochures/review-accessibility.css, scripts/generate-sitemap.mjs and public/sitemap.xml. Four brochure lastmod dates remain 2026-11-02; this correction is on the same day, so no other dates change. Both legacy public HTML files still match recorded baseline 95414a1; their revised copies remain held.

### Separate CPD-report decision: exact effects, NOT brochure approval
The current publishable working version still contains these three unrelated changes; publication cannot be represented as brochure-only until they are separately resolved:
- public/cpd-audit.json deletion: stops serving the detailed audit snapshot at https://brightleadershipconsulting.com/cpd-audit.json. The historical snapshot is retained under on-hold/cpd-audit/previous-public-snapshot.json. The deletion changes public report availability, not brochure CPD wording or accreditation.
- scripts/generate-cpd-audit.mjs: changes default output from public/cpd-audit.json to on-hold/cpd-audit/snapshot.json and refuses public output. Normal generation cannot recreate a public report. No protected delivery is implemented.
- src/pages/AdminCpdAudit.tsx: stops fetching that public JSON and shows a report-access hold notice instead. The authorised admin page and catalogue ranges remain; detailed findings, counts and asset rows no longer load online. Refresh repeats the hold notice. Admins temporarily lose detailed online report access until a separately approved protected route exists.
These are website/generation changes, not backend deployment. No other visitor-facing source changes were identified against recorded baseline 95414a1. Review/test/hold documents are non-public. Previously deployed function-source differences and staged chatbot/AI-audit replacements are excluded from deployment authority.

**Decision required:** approve the four-brochure candidate, then separately approve the three CPD-report effects above or keep publication held pending an isolated release version. The report has not been restored to public merely to hide this dependency. No combined publication is authorised by approving brochures alone.

## Historical v3 note (inspection and combined scope below superseded above)

## Four revised brochures
- **ELM:** approximately 3–4 hours weekly over 16 weeks; 33 core modules plus welcome/foundation chapter; project delivery added under Module 14. Removed inconsistent per-module hours/CPD allocations and unconfirmed monthly Q&A, every-module quizzes and 70% progression promises. Original teaching documents contain the latter historically, but current delivery is not verified.
- **Peak Performance:** original source confirms seven modules. Restored documented titles: Productivity, Company Productivity, Individual Productivity, Assessment, Finances, Employees, Planning. Replaced unsupported Research-Based Content claim with Workplace Focus.
- **Future Workplace:** Key Focus Areas stays with its heading/content.
- **EAI:** commissioning heading/introduction and all five items stay together; unsupported majority assumption removed; participant-response findings are no longer presented as objective or independently verified conditions.

## PDF inspection and isolated checks
All **15 pages** rendered and visually inspected: ELM 6 pages; Peak 3; Future Workplace 3; EAI 3. Fixed split fee panel, overly tall assessment cards, separated commissioning introduction/list and unnecessary final pages. No stranded section headings/list items, clipping, blank or footer-only final pages found in final pass. Existing design retained; print-only spacing adjusted.

At 1280×1800 and 375×812, all four brochures have no forms/inputs, no overflow/runtime errors, accessible keyboard/mouse print and zero click requests. Production blocked by DNS kill switch and context-wide deny-by-default rules; POST and popup self-tests passed. Zero external responses, production egress, live writes or emails. External fonts blocked deliberately: generated PDFs use fallback fonts. **15 tests passed: 13 existing commercial/privacy checks and two new legacy-release safeguards; latest observed preview build OK.**

## Held legacy brochures
Advanced Leadership and Employability revisions are outside publication under on-hold. Previously published public copies preserved byte-for-byte against recorded baseline 95414a1: no live removal or learner-access change. This preserves their old public content too; a retirement/withdrawal change still needs separate approval. Neither legacy PDF is included in the current review collection. Earlier files remain historical, not approved release material.

## Exact combined website publication scope — awaiting approval
Four retained brochure HTML pages, shared print/accessibility stylesheet, sitemap generator and sitemap (four brochure dates remain **2026-11-02**); also earlier internal CPD-report exclusion and admin report-hold changes. Both legacy public files have no difference from recorded baseline. Current live equivalence was not freshly checked under the live-test hold.

## Backend — separate
No backend edits in this correction. Earlier complete chatbot instructions and strict AI-audit diagnostics remain staged only; no deployment authority given. Unrelated internal CPD-report withdrawal is still included in the pending website version and needs a separate release decision.

## Evidence still needed before full curriculum approval
Victoria's latest instruction supplies Module 14 placement; minimal project-delivery wording added without inventing detailed lessons. The earlier detailed approved addition was not found. Current ELM assessment/support configuration and any newer Peak module titles remain unverified. Advanced Leadership retirement/transfer is recorded from Victoria's latest review, not independently proven by earlier records. Employability's catalogue place remains undecided. Both legacy release holds remain.

Publication, backend deployment, emails and live testing require separate approval.