import { findAnswerOptionsByQuestion } from "../../services/questionAnswerOptionService.js";
import { findQuestionById, findRandomQuestionByTopic } from "../../services/questionService.js";
import { getAllTopics } from "../../services/topicService.js";

export const showQuizPage = async ({
  params,
  request,
  response,
  state,
  render,
}) => {
  const user = await state.session.get("user");

  if (!user) {
    response.redirect("/auth/login");
    return;
  }

  const rows = await getAllTopics();
  render("quizTopics.eta", { topics: rows, user });
};

export const showRandomQuestion = async ({
  params,
  request,
  response,
  state,
  render,
}) => {
  const user = await state.session.get("user");

  if (!user) {
    response.redirect("/auth/login");
    return;
  }

  const rows = await findQuestionById(params.qId);
  const question = rows[0];
  const options = await findAnswerOptionsByQuestion(params.qId);

  render("quizQuestion.eta", { ...question, options, answers });
};

export const randomQuestion = async ({
  params,
  request,
  response,
  state,
  render,
}) => {
  const user = await state.session.get("user");

  if (!user) {
    response.redirect("/auth/login");
    return;
  }

  const rows = await findRandomQuestionByTopic(params.tId);
  const question = rows[0];

  response.redirect(`/quiz/${params.tId}/questions/${question.id}`);
};
