export const LEADING_PEOPLE_COHORT_ENQUIRY = "leading_people_cohort";
export const LEADING_PEOPLE_COHORT_LABEL = "Leading People employer cohort";
export const ENQUIRY_LABELS: Record<string, string> = {
  elm_employer_funded: "ELM employer-funded enquiry",
  elm_individual_enrolment: "ELM individual enrolment request",
  [LEADING_PEOPLE_COHORT_ENQUIRY]: LEADING_PEOPLE_COHORT_LABEL,
};
export const ALLOWED_ENQUIRY_TYPES = Object.keys(ENQUIRY_LABELS);

export function leadingPeopleEnquiryType(params: URLSearchParams, hasProgramme: boolean) {
  return !hasProgramme && params.get("cohort") === "leading-people"
    ? LEADING_PEOPLE_COHORT_ENQUIRY
    : null;
}