import {
  deleteQuestionAnswerOptions,
  findAnswerOptionsByQuestion,
  findCorrectOptionsForQuestion,
  findOptionById,
} from "../../services/questionAnswerOptionService.js";
import {
  deleteQuestionAnswers,
  findAnswersByQuestion,
} from "../../services/questionAnswerService.js";
import {
  addQuestionToTopic,
  deleteQuestionById,
  findQuestionById,
  findRandomQuestion,
  findRandomQuestionByTopic,
} from "../../services/questionService.js";
import { getTopicById } from "../../services/topicService.js";
import { validasaur } from "../../deps.js";

const showQuestion = async ({ params, request, response, state, render }) => {
  const user = await state.session.get("user");

  if (!user) {
    response.redirect("/auth/login");
    return;
  }

  const rows = await findQuestionById(params.qId);
  const question = rows[0];
  const options = await findAnswerOptionsByQuestion(params.qId);
  const answers = await findAnswersByQuestion(params.qId);

  render("question.eta", { ...question, options, answers });
};

const questionValidationRules = {
  question_text: [validasaur.required, validasaur.minLength(1)],
};

const randomQuestion = async ({ params, request, response, state, render }) => {
  const user = await state.session.get("user");

  if (!user) {
    response.redirect("/auth/login");
    return;
  }

  const rows = await findRandomQuestionByTopic(params.tId);
  const question = rows[0];

  response.redirect(`/quiz/${params.tId}/questions/${question.id}`);
};

const showRandomQuestion = async ({ params, request, response, state, render }) => {
  const user = await state.session.get("user");

  if (!user) {
    response.redirect("/auth/login");
    return;
  }

  const rows = await findQuestionById(params.qId);
  const question = rows[0];
  const options = await findAnswerOptionsByQuestion(params.qId);

  render("question.eta", { ...question, options, answers });
};

const showCorrectPage = async ({ params, request, response, state, render }) => {
  const user = await state.session.get("user");

  if (!user) {
    response.redirect("/auth/login"); 
    return;
  }

  render("correct.eta", { topic_id: params.tId });
};

const showIncorrectPage = async ({ params, request, response, state, render }) => {
  const user = await state.session.get("user");

  if (!user) {
    response.redirect("/auth/login");
    return;
  }

  const correctOptions = await findCorrectOptionsForQuestion(params.qId);

  render("incorrect.eta", { topic_id: params.tId, options: correctOptions });
};

const jsonRandomQuestion = async ({ params, request, response, state, render }) => {
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

const verifyJson = async ({ params, request, response, state, render }) => {
  const body = request.body({ type: "json" });
  const document = await body.value;
  const questionId = document.questionId;
  const optionId = document.optionId;

  const option = await findOptionById(optionId, questionId);

  response.headers.set("Content-Type", "application/json");
  response.body = { correct: option.is_correct };
};

const getQuestionData = async (request, topicId) => {
  const body = request.body();
  const params = await body.value;
  const rows = await getTopicById(topicId);
  const topic = rows[0];

  return {
    ...topic,
    question_text: params.get("question_text"),
  };
};

const postQuestion = async ({ params, request, response, state, render }) => {
  const user = await state.session.get("user");

  if (!user) {
    response.redirect("/auth/login");
    return;
  }

  const questionData = await getQuestionData(request, params.id);

  const [passes, errors] = await validasaur.validate(
    questionData,
    questionValidationRules
  );

  if (!passes) {
    console.log(errors);
    questionData.validationErrors = errors;
    render("topic.eta", questionData);
  } else {
    await addQuestionToTopic(user.id, params.id, questionData.question_text);
    response.redirect(`/topics/${params.id}`);
  }
};

const deleteQuestion = async ({ params, request, response, state, render }) => {
  const user = await state.session.get("user");

  if (!user) {
    response.redirect("/auth/login");
    return;
  }

  await deleteQuestionAnswers(params.qId);
  await deleteQuestionAnswerOptions(params.qId);
  await deleteQuestionById(params.qId);

  response.redirect(`/topics/${params.tId}`);
};

export {
  jsonRandomQuestion,
  verifyJson,
  showCorrectPage,
  showIncorrectPage,
  showRandomQuestion,
  randomQuestion,
  showQuestion,
  postQuestion,
  deleteQuestion,
};
