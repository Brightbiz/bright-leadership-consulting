# Bind batch approvals to each recipient's exact subject and details

## Confirmed issue
A batch approval currently checks only the shared email wording, the sender, the list of draft IDs, the maximum count and the expiry. It does not record each recipient's subject line, email address, name, job title or company. If any of these is edited after approval, the batch would still go out under the old approval. That breaks the approved rule that any change to the recipients or final content cancels the approval. No emails are at risk today: there are 0 approvals and 0 unsent drafts, and the outreach hold remains.

## Proposed change (needs your authorisation: it changes the live database and the live sender)
1. **Database:** add an optional `recipient_fingerprints` field to the batch approvals table. It maps each approved draft to a fingerprint of its subject, email address, name, job title and company. Existing records are unaffected, because none exist.
2. **Sender:** the batch route refuses any approval that has no `recipient_fingerprints`. Before sending anything, it recomputes the fingerprint for every eligible draft from current data. If any draft's fingerprint is missing or different, the whole batch stops before any email-provider call, and the report names the changed draft(s).
3. **Approval creation (done by hand in the database):** record the fingerprints at approval time using the same calculation the sender uses, so whoever creates the approval does not have to compute them.
4. **Tests (simulated only):** add cases for a changed subject, changed address, changed name, changed job title and changed company, plus an approval with no fingerprints. Each must refuse with no provider call. Then re-run the 14 existing tests.
5. **Review pack:** update the "what the fingerprint covers" section so it says the subject and personal details are now protected per recipient.

## Not included
No send, test email, approval record, draft or schedule. The email wording and the 21-person list stay as they are.
