import { countAllAnswers } from "../../services/questionAnswerService.js";
import { countAllQuestions } from "../../services/questionService.js";
import { countAllTopics } from "../../services/topicService.js";

const showMain = async ({ render }) => {
  const topicRows = await countAllTopics();
  const topicCount = topicRows[0].count;

  const questionRows = await countAllQuestions();
  const questionCount = questionRows[0].count;

  const answerRows = await countAllAnswers();
  const answerCount = answerRows[0].count;

  const data = {
    topicCount,
    questionCount,
    answerCount
  };

  render("main.eta", data)
};

export { showMain };
