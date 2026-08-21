# AI audit — internal notification wording (documentation only)

Approved 21 Aug 2026 under Option C. **Neither message below is sendable.** Both
were removed from the active sending path; their operational purpose is served by
the secured administrative view at `/admin/audit-requests`. The wording is kept
here only so the administrative states can be phrased consistently, and so it can
be repurposed if a separately controlled push-alert provider is approved later.

No code path — including the buyer acknowledgement flag
`BUYER_ACK_EMAILS_ENABLED` — can trigger these messages.

## 1. Internal operational notification (administrative view only)

Subject: `Action required — {request type} — {record reference}`

> A commercial request from the AI Leadership Readiness Audit has been recorded.
>
> Request type / Action / Programme / Quantity / Contact / Job title /
> Organisation / Email / Record reference
>
> No payment has been taken.
> Open the administrative audit-requests view to review and action the request.

Administrative equivalent: the **Needs action** status, the unactioned-request
count and the oldest unactioned-request age on `/admin/audit-requests`, mirrored
as an outstanding-action indicator on the administrator landing area.

## 2. CRM-mirroring failure notification (administrative view only)

Subject: `CRM mirroring failed — request {record reference}`

> A recorded audit request could not be mirrored into the CRM after the automatic
> retry process.
>
> Record reference / Request type / Organisation / Failure category
> (sanitised category only — never raw errors, credentials or stack traces)
>
> The underlying request record remains available. Use the retry control in the
> administrative audit-requests view after the cause has been resolved.

Administrative equivalent: the persistent CRM-mirroring Pending / Completed /
Failed counts, the persistent failure state per record, the retry control, and
the acknowledged/resolved status with date and responsible administrator.
