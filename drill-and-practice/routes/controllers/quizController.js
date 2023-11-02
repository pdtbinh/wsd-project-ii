import { findAnswerOptionsByQuestion, findCorrectOptionsForQuestion } from "../../services/questionAnswerOptionService.js";
import { findQuestionById, findRandomQuestionByTopic } from "../../services/questionService.js";
import { getAllTopics, getTopicById } from "../../services/topicService.js";

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

  render("quizQuestion.eta", { ...question, options });
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

  if (rows.length <= 0) {
    const topicRows = await getTopicById(params.tId);
    const topic = topicRows[0];
    render("noQuestion.eta", topic);
  }

  const question = rows[0];
  response.redirect(`/quiz/${params.tId}/questions/${question.id}`);
};

export const showCorrectPage = async ({ params, request, response, state, render }) => {
  const user = await state.session.get("user");

  if (!user) {
    response.redirect("/auth/login"); 
    return;
  }

  render("correct.eta", { topic_id: params.tId });
};

export const showIncorrectPage = async ({ params, request, response, state, render }) => {
  const user = await state.session.get("user");

  if (!user) {
    response.redirect("/auth/login");
    return;
  }

  const correctOptions = await findCorrectOptionsForQuestion(params.qId);

  render("incorrect.eta", { topic_id: params.tId, options: correctOptions });
};
