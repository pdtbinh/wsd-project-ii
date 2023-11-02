import { findAnswerOptionsByQuestion, findOptionById } from "../../services/questionAnswerOptionService";
import { findRandomQuestion } from "../../services/questionService";

export const jsonRandomQuestion = async ({
  params,
  request,
  response,
  state,
  render,
}) => {
  const rows = await findRandomQuestion();
  const question = rows[0];
  const options = await findAnswerOptionsByQuestion(question.id);
  
  const mappedOptions = options.map((option) => ({
    optionId: option.id,
    optionText: option.option_text,
  }));

  const mappedQuestion = {
    questionId: question.id,
    questionText: question.question_text,
    answerOptions: mappedOptions,
  };

  response.headers.set("Content-Type", "application/json");
  response.body = mappedQuestion;
};

export const verifyJson = async ({
  params,
  request,
  response,
  state,
  render,
}) => {
  const body = request.body({ type: "json" });
  const document = await body.value;
  const questionId = document.questionId;
  const optionId = document.optionId;

  const option = await findOptionById(optionId, questionId);

  response.headers.set("Content-Type", "application/json");
  response.body = { correct: option.is_correct };
};
