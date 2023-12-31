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
  showQuestion,
  postQuestion,
  deleteQuestion,
};
