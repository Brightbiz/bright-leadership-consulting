import AssessmentPage from "@/components/AssessmentPage";
import { postAssessmentQuestions } from "@/data/assessmentQuestions";

const PostAssessment = () => (
  <AssessmentPage
    title="Post-Course Leadership Assessment"
    subtitle="Executive Leadership Mastery Program"
    assessmentType="post-course"
    questions={postAssessmentQuestions}
  />
);

export default PostAssessment;
