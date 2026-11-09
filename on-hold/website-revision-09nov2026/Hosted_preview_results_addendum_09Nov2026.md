# Hosted-preview results addendum — 9 November 2026
Supplements the v3 report and the platform-change addendum.

## Tested revision
Hosted preview opened through the view-only shared link at 13:33–13:35 UTC. Website source at the time: `6602274` (the reviewed implementation `ada8067` plus platform commit `6602274`). Every later commit (`da69fb1`, `0cca455`, `5224718`, `c4b6c50`) changes internal review documents only.

## Safeguards
- Every outside address was blocked at the network level; only the preview host was reachable.
- Every request other than a page read was refused, so no form could submit.
- A self-test before the checks confirmed the form backend and Google Analytics collection were both BLOCKED.
- Analytics consent was rejected on the cookie banner.
- Result: 0 responses from any outside service. No form was submitted.

## Results
| Check | Result |
|---|---|
| Home, Academy, Courses, Courses#comparison, Insights, Contact at 1280 / 768 / 390 px | All load; no horizontal overflow |
| Homepage actions | One primary "Discuss Executive Alignment"; "Explore Bright Leadership Academy" goes to /academy |
| Academy programme links (Leading People, ELM, Strategic Leadership in the Age of AI, Future of Work, Peak Performance) | All load |
| Leading People enquiry | Goes to /contact?cohort=leading-people#enquiry-form |
| ELM, Future of Work, Peak Performance brochures | Programme-specific same-origin enquiry links |
| Sitemap | Seven entries dated 2026-11-09 |

## Limitations
- Web fonts and platform scripts were blocked, so layout was checked with fallback fonts.
- Hosting-injected telemetry was blocked, not observed.
- Programme-page layout at tablet and mobile widths was not checked separately; they were checked at desktop only.
- The other three brochures still link to the plain live /contact page. They were unchanged and outside this revision.

## Scope confirmation
No website source, public file or sitemap change since the platform-change addendum. Release scope remains `ada8067` + `6602274`, with the seven sitemap date changes. Nothing was published or deployed.
