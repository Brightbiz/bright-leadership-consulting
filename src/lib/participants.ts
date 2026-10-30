/** One participant record per email address: normalise before lookup/insert. */
export const normaliseParticipantEmail = (email: string) => email.trim().toLowerCase();

export const isValidParticipantEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normaliseParticipantEmail(email));

/** True when the participant already holds a place in this cohort. */
export const isDuplicateEnrolment = (
  enrolments: { participant_id: string; cohort_code: string }[],
  participantId: string,
  cohortCode: string,
) =>
  enrolments.some(
    (e) => e.participant_id === participantId && e.cohort_code.trim() === cohortCode.trim(),
  );

export const LP_SUPPORT_EMAIL = "info@brightleadershipconsulting.com";
