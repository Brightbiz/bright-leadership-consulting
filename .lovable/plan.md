# Academy launch-blocker reconciliation (read-only findings, 3 Nov 2026)

Nothing was changed, created, sent, published or deployed. Approving this records the conclusions below in the task list only; no other change follows from it.

## 1. "Amended Terms/Privacy publication" hold (roadmap line 50)

**Where it came from:** Victoria's 25 Sep 2026 instruction (chat #2528) to "keep the amended Terms and Privacy Notice unpublished" while the ELM employer-funded **individual-place** offer was being built. The hold relates to that ELM offer (Terms version `TC-2026-09`, offer terms `ELM-EMP-2026-09-v4`). It never named Leading People or the Academy.

**What the records show now:**
- Live `/terms` and preview `/terms` text match word for word (checked today, view only). The same is true of `/privacy`. Later whole-site publications have already put the amended wording live, including "Organisational and cohort purchases" and the employer-funded individual-place clause.
- The only Terms item still unpublished is the version/effective-date line. It stays hidden because `TERMS_AND_CONDITIONS_EFFECTIVE_DATE = null` in `src/data/legal.ts`.
- No separate unpublished Terms or Privacy draft exists in the source, `on-hold/` or Files.
- The **EDL Intensive** and **worksheet/marketing** amendments are separate holds (roadmap lines 58, 66–69). The worksheet Privacy update has not been drafted, and EDL is staging-only. Neither affects Leading People or the Academy.
- Leading People wording is live in the Privacy Notice (participants, lawful basis, access ends 90 days after workshop 4, employer reporting limits, Thinkific/Zoom). Terms send cohort purchases to "the proposal, order form or written agreement".

**Conclusion:** the records show **no specific Academy legal gap**. The line 50 checkbox is outdated: its wording is already live. What actually remains is (a) legal review of the live ELM wording, which nothing shows has been done, and (b) the decision to show an effective date. I have not marked legal advice as obtained or the Terms as approved.

**Next action (yours):** decide whether to rename line 50 to "ELM employer-offer Terms: legal review + effective-date decision (wording already live since a later publication)" and take it off the Academy blocker list.

## 2. Private employer offer links (roadmap line 46)

**Evidence:** `src/data/employerOffer.ts` (fee £1,297, `EMPLOYER_OFFER_TERMS_APPROVED = false`) and `supabase/functions/employer-offer/index.ts` clause 1: "one individual place on the Executive Leadership Mastery Programme… not an organisational, multiple-place, cohort… engagement". Offer references start with `ELM-`. The database holds 0 offers.

**Conclusion:** these links serve **ELM individual seats only**. They are not the £4,800 Leading People employer cohort booking. Their issue approval **does not block** public Academy availability or a Leading People booking.

**Remaining steps for a real Leading People employer booking (none taken):**
1. Enquiry arrives through the explicit Leading People cohort link (tagged `leading_people_cohort`).
2. Scoping reply from info@: fit, 8–12 managers, dates.
3. Issue a written proposal or order form for the cohort (£4,800 total, no VAT). **No Leading People order-form template exists in the source or Files; one needs drafting and Bright approval.**
4. Employer signs or accepts; invoice and contractual administration go through admin@.
5. Participant list arrives under the approved handover standard (employer SharePoint/OneDrive, info@ only, three fields, after booking).
6. Create participant and enrolment records, then send manual Thinkific joining emails (the automatic course welcome is OFF). This uses the five documents approved 30 Oct.
7. Delivery: Zoom workshops, hub access opens 7 days before the first workshop and closes 90 days after workshop 4.

## 3. Summary and next concrete actions

| Item | Blocks public Academy? | Blocks an actual LP booking? | Next action |
|---|---|---|---|
| Line 50 Terms/Privacy | No (wording already live) | No | Your decision to re-scope line 50 as above |
| Line 46 offer links | No (ELM only) | No | None for the Academy |
| LP proposal/order form | No | **Yes**, no template exists | Draft for Bright approval when you say so |
| Insurance | Not stated as a blocker | Deferred, unconfirmed | No cover claims; Irene decides |
| Academy publication | Needs your separate approval | n/a | Your publication approval (combined pending scope) |

Thinkific stays as tested today: QA access expires 7 Nov, and the automatic welcome stays OFF. Nothing changes there.
