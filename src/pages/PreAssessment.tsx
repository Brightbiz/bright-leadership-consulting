import AssessmentPage from "@/components/AssessmentPage";
import { preAssessmentQuestions } from "@/data/assessmentQuestions";

const PreAssessment = () => (
  <AssessmentPage
    title="Pre-Course Leadership Assessment"
    subtitle="Executive Leadership Mastery Program"
    assessmentType="pre-course"
    questions={preAssessmentQuestions}
  />
);

export default PreAssessment;
