import ReadinessQuizModal from "@/components/ReadinessQuizModal";
import { useNavigate } from "react-router-dom";

const Quiz = () => {
  const navigate = useNavigate();

  return (
    <ReadinessQuizModal
      open={true}
      onOpenChange={(open) => {
        if (!open) navigate("/courses");
      }}
    />
  );
};

export default Quiz;
