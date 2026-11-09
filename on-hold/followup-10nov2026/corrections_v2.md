# Follow-up package — corrections v2 (9 Nov 2026, preview only)

Supersedes the matching sections of review-package.md (kept as historical). Nothing published.

## 1. Sitemap dates
The six entries (/courses, /terms, /executive-leadership-mastery, /strategic-leadership-ai, /future-of-work, /strategic-productivity-peak-performance) now read 2026-11-09, the actual change date. The earlier 2026-11-10 was an error.
`public/sitemap.xml` is NOT changed in the repository. It is generated from `scripts/generate-sitemap.mjs` when the site is built, so the new dates appear only in a build.

## 2. Measurement design (corrected proposal, not implemented)
- Academy programme links are programme-detail clicks. Reuse the existing `programme_detail_click` with `cta_surface: "academy"`, not `programme_enquiry_click`.
- Leading People upper and lower buttons: these open the cohort enquiry form, so `programme_enquiry_click` with `cta_surface: "leading_people_upper"` / `"leading_people_lower"`.
- Successful enquiry: one `enquiry_submit_success`, sent only after the server confirms success. Parameters: `enquiry_type`, `source`, and `programme_id` taken from a fixed allow-list of catalogue slugs. Never the free-text programme label, name, email or message. The ELM employer-funded event stays; reports count either it or the new event, never both.
- **Admin export finding:** the enquiry record has no programme field. The programme is written only into the message text ("Programme of interest: …"). The admin CSV export contains name, email, phone, company, message, date and read status only. It does not include enquiry category, source or campaign tags. Grouping by enquiry type/source would therefore not separate the four programmes, and the export cannot do it at all today. Fixing this (a programme column plus export columns) is a database/backend change and needs its own plan.
- **Evidence level:** every "covered" item in the earlier table was established by reading code and configuration only. No GA4 events were observed. Campaign tags are supported in code (held in memory, allow-listed, stored on the record). Whether they survive a real visitor journey across pages has not been observed.

## 3. Completion rules
- Removed (follows the instruction): "Most participants complete in line with the accredited range…"; the lower/upper-bound explanations; "Each range is set at programme level from module count, taught content length and the applied work…"; "depending on depth of engagement with the working documents and capstone".
- **Restored unchanged:** "What counts as completion?" (all-modules/capstone wording per programme, and "Partial completion is recorded module by module but does not carry the full accredited range"). Its source in this project is `src/data/cpd-faq.json` (last edited 5 Oct 2026). No approval document for it exists here, which does not show that none exists. Please confirm its source before any change. Learner requirements are unchanged.

## 4. Portfolio PDF
A regenerated preview copy is saved as `website-review/programme-portfolio_PREVIEW_09Nov2026.pdf` (4 pages, checked visually). Its heading reads "Approved CPD Hours", it has no range explanations, and the completion wording is restored. The public `public/downloads/programme-portfolio.pdf` is left as published. The generator heading changed so that a later regeneration would match.

## 5. Programme claims and badge
Still blocked: workbooks/teaching materials and the official 2025–2027 badge file are needed.

## 6. Advanced Leadership
A noindex retirement notice linking to /courses, with no enquiry button and no suggested replacement programme, is held at `on-hold/followup-10nov2026/advanced-leadership-retirement/`. The public brochure file is not swapped, because it is pinned to its published baseline until removal is separately approved and a swap would go out with the next publish. Employability is unchanged.

## 7. Changed files since published f95c47c (source/public)
scripts/generate-programme-brochure.mjs (1 heading), scripts/generate-sitemap.mjs (6 dates), src/components/BeforeYouEnrol.tsx, src/components/ProgrammeFaq.tsx, src/data/cpd-faq.json, src/pages/Courses.tsx, src/pages/StrategicLeadershipAI.tsx, src/pages/Terms.tsx, src/test/cpdWordingPlain.test.ts (new). No file under public/ changed. The exact diff is in groupE-cpd_v2.diff. All tests pass.
