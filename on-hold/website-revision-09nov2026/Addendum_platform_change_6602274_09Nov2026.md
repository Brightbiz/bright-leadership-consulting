# Addendum to v3 review report — platform commit 6602274
9 November 2026. This supplements v3; it does not rebuild it.

## 1. Scope statement correction
v3's "exact current scope" matched `ada8067`/`7310421` when it was written. One later commit, `6602274` ("Work in progress"), was created automatically by the platform at 13:16:59 UTC. It is outside the reviewed scope.

## 2. Exact file and diff
File: `src/integrations/supabase/previewAuthStorage.ts` (marked "automatically generated. Do not edit it directly"). Two lines changed, one added:

```diff
-  const UUID = '[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}';
+  const UUID = '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}';
   const projectId = onPreviewZone
     ? (new RegExp('^(?:id-preview(?:-[a-z0-9]+)?|project)--(' + UUID + ')(?:-dev)?(?=\\.|$)', 'i').exec(host)?.[1]
+        ?? new RegExp('^live--(' + UUID + ')(?:-thr_[a-z0-9]+)?(?=\\.|$)', 'i').exec(host)?.[1]
         ?? new RegExp('^(' + UUID + ')(?=[.-])', 'i').exec(host)?.[1])
```

## 3. Effect
- Purpose: it lets Lovable's own preview addresses share the editor's sign-in session. The ID pattern now accepts UUID-shaped IDs without the previous version/variant restriction. It also recognises an extra `live--<id>` preview address format.
- Preview: it only matters when the address is a Lovable address (`lovable.app`, `lovableproject.com` and similar). It does not touch page content, navigation, forms, analytics or the sitemap.
- Production on custom domains (`brightleadershipconsulting.com`, `www.`): no effect. Those addresses are not on the preview list, so the code takes the same path as before and uses ordinary browser storage.
- `blc-host-internal.lovable.app`: this address is on the Lovable list. Under both the old and new code it does not match any project-ID pattern (it has no `id-preview--`, `live--` or leading ID), so the behaviour is unchanged.
- Visitors: the public site has no visitor sign-in. Only the admin sign-in uses this storage.

Qualification: the findings in this section come from code review (including the surrounding hostname list check at lines 44–45 of the file), not browser verification.

## 4. Can it be excluded?
Technically yes. The revision does not depend on it, and the reviewed source state `ada8067` does not contain it. Excluding it is not recommended, though. The platform regenerates this file and may bring the change back. Reverting it by hand would also mean editing a generated file. It has not been reverted.

Recommendation: treat it as a platform-maintenance change that can go out with the release. The publication scope would then be `ada8067` plus `6602274`, with documentation-only commits on top. This needs your explicit approval as an addition to the scope. If you prefer to exclude it, ask the platform how to publish without it, rather than reverting the file by hand.

## 5. Sitemap wording correction
The earlier statement that the seven sitemap date changes were "unchanged compared with live" was wrong. Correct wording: the seven proposed sitemap date changes are unchanged from the previous proposal. They still differ from live, where those dates move to 9 November 2026 as shown in v3.

## 6. Hosted preview
Retried at 13:20 UTC: HTTP 401. This is an access limitation, not a failed website check. Navigation and layout checks in the hosted environment remain outstanding. They will be run once access works, with production analytics blocked and no live submissions.

## Status
The reviewed implementation is retained. Publication is on hold pending your decision on 6602274 and the hosted checks. The audience-wording inconsistency remains a separate copy decision. Nothing was published or deployed.

## 7. Decision and access route (13:24 UTC)
Victoria recommends including 6602274 in the eventual release scope. Accepting it into scope does not authorise publication. The id-preview address is private: it requires a Lovable sign-in with access to the project, so further unauthenticated retries will not help. Route: Share → Share a preview link (view-only, no editor access, may expire or be password-protected). Once a link is supplied, the outstanding hosted checks will run with production analytics blocked, consent rejected and form submissions denied.

## 8. Hosted-preview checks completed (13:35 UTC)
Opened via the shared view-only preview link. Guards: DNS kill switch for all non-preview hosts, context-wide deny of every non-GET request, pre-run self-test (backend submit and GA collect both BLOCKED), cookie banner rejected. Result: 0 responses from any non-preview host; blocked attempts included google-analytics.com and the form backend. No form submitted.
- Home, Academy, Courses, Courses#comparison, Insights, Contact load at 1280, 768 and 390 px with no horizontal overflow.
- Homepage actions: one primary "Discuss Executive Alignment"; "Explore Bright Leadership Academy" → /academy.
- Academy: all four programme links plus Leading People load (/leading-people, /executive-leadership-mastery, /strategic-leadership-ai, /future-of-work, /strategic-productivity-peak-performance).
- Leading People enquiry links → /contact?cohort=leading-people#enquiry-form.
- Three retained brochures (ELM, Future of Work, Peak Performance) use programme-specific same-origin enquiry links; the three legacy/other brochures still use the plain live /contact link (unchanged, outside this revision).
- Sitemap: seven entries dated 2026-11-09.
Limits: fonts/platform scripts were blocked, so typography is a fallback-font render; hosting-injected telemetry was blocked, not observed.
