import { deleteQuestionAnswerOptions } from "../../services/questionAnswerOptionService.js";
import { deleteQuestionAnswers } from "../../services/questionAnswerService.js";
import {
  deleteQuestionsByTopic,
  findQuestionsByTopic,
} from "../../services/questionService.js";
import {
  addTopic,
  getAllTopics,
  getTopicById,
} from "../../services/topicService.js";
import { validasaur } from "../../deps.js";

const showTopic = async ({ params, render }) => {
  const user = await state.session.get("user");

  if (!user) {
    response.redirect("/auth/login");
    return;
  }

  const rows = getTopicById(params.id);
  const obj = rows[0];
  const questions = await findQuestionsByTopic(params.id);
  render("topic.eta", { ...obj, questions });
};

// This removes the topic, questions on the topic,
// answer options related to questions on the topic,
// and the answers given by users to those questions
const deleteTopic = async ({ params, response, render }) => {
  const user = await state.session.get("user");

  if (!user) {
    response.redirect("/auth/login");
    return;
  }

  const topicQuestions = await findQuestionsByTopic(params.id);

  for (let question of topicQuestions) {
    await deleteQuestionAnswers(question.id);
    await deleteQuestionAnswerOptions(question.id);
  }

  await deleteQuestionsByTopic(params.id);
  await deleteTopic(params.id);

  response.redirect("/topics");
};

const topicValidationRules = {
  name: [validasaur.required, validasaur.minLength(1)],
};

const getTopicData = async (request) => {
  const body = request.body({ type: "form" });
  const params = await body.value;
  return {
    name: params.get("name"),
  };
};

const postTopic = async ({ request, response, state, render }) => {
  const user = await state.session.get("user");

  if (!user) {
    response.redirect("/auth/login");
    return;
  }

  const topicData = await getTopicData(request);

  const [passes, errors] = await validasaur.validate(
    topicData,
    topicValidationRules
  );

  if (!passes) {
    console.log(errors);
    topicData.validationErrors = errors;
    render("topics.eta", topicData);
  } else {
    await addTopic(topicData.name, user.id);
    response.redirect("/topics");
  }
};

const showTopics = async ({ response, state, render }) => {
  const user = await state.session.get("user");

  if (!user) {
    response.redirect("/auth/login");
    return;
  }

  const rows = await getAllTopics();
  render("topics.eta", { topics: rows, user });
};

export { showTopic, deleteTopic, postTopic, showTopics };
