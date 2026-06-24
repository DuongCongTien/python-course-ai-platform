import { useParams } from "react-router-dom";
import StaticPlaceholderPage from "../static/StaticPlaceholderPage";

function QuizPage() {
  const { lessonId = "lesson-4" } = useParams();
  return <StaticPlaceholderPage title={`Quiz: ${lessonId}`} backTo="/courses" />;
}

export default QuizPage;
