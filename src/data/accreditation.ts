/**
 * Approved accreditation and certificate wording.
 *
 * These strings are fixed by the accreditation handover and must not be
 * paraphrased. In particular:
 *  - never describe the certificate as a qualification, professional
 *    certification or academic award;
 *  - never promise automatic certificate generation or download;
 *  - never imply that proprietary diagnostics or advisory engagements are
 *    CPD accredited.
 */

export const CPD_PROVIDER_NUMBER = "50838";
export const CPD_ACCREDITATION_PERIOD = "2025–2026";

/*
 * INTERNAL credential-verification record (Bright-confirmed, supersedes the
 * earlier October 2026 note and the 2025–2027 badge):
 *   Issue date:  10 October 2025
 *   Expiry date: 7 November 2026
 * Renewal is tracked against CPD_ACCREDITATION_EXPIRY. This is an internal
 * marker only — no automatic expiry control. If renewal is not confirmed
 * before expiry, the "50–66 CPD hours" claim and related badge/certificate
 * wording must be removed or qualified first. The expiry date is not shown
 * publicly; the approved public wording above is unchanged.
 */
export const CPD_ACCREDITATION_ISSUE_DATE = "2025-10-10";
export const CPD_ACCREDITATION_EXPIRY = "2026-11-07";

/** Approved provider statement. */
export const CPD_PROVIDER_STATEMENT =
  "Bright Leadership Consulting is an official Accredited Provider recognised by The CPD Standards Office, Provider Number 50838. Accreditation period: 2025–2026.";

/** Approved participant statement. */
export const CPD_PARTICIPANT_STATEMENT =
  "Participants who satisfy the approved completion requirements receive the official CPDSO Certificate of Attendance manually from Bright Leadership Consulting, using the standard template supplied by CPDSO. Certificates are not generated or downloaded automatically.";

/** Mandatory clarification wherever certificate outcomes are described. */
export const CPD_CERTIFICATE_SCOPE_NOTE =
  "The CPDSO Certificate of Attendance records participation in an accredited CPD activity. It is not a qualification, professional certification or academic award.";

/** Scope limit: accreditation covers programmes only. */
export const CPD_SCOPE_STATEMENT =
  "Accreditation applies to the programmes only. The Executive Alignment Index™ and advisory engagements are proprietary instruments and are not externally accredited.";

/** Short label for cards and badges. */
export const CPD_ACTIVITY_LABEL = "Accredited CPD Activity (Provider 50838)";

/** Short certificate outcome line for feature lists. */
export const CPD_CERTIFICATE_FEATURE =
  "CPDSO Certificate of Attendance, issued manually on approved completion";
