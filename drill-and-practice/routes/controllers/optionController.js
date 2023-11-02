import {
  addOption,
  deleteOptonById,
} from "../../services/questionAnswerOptionService.js";
import { deleteOptionAnswers } from "../../services/questionAnswerService.js";
import { findQuestionById } from "../../services/questionService.js";
import { validasaur } from "../../deps.js";

const optionValidationRules = {
  option_text: [validasaur.required, validasaur.minLength(1)],
};

const getOptionData = async (request, questionId) => {
  const formData = await request.formData();

  const rows = await findQuestionById(questionId);
  const question = rows[0];

  return {
    ...question,
    option_text: formData.get("option_text"),
    is_correct: formData.get("option_text"),
  };
};

const postOption = async ({ params, request, response, state, render }) => {
  const user = await state.session.get("user");

  if (!user) {
    response.redirect("/auth/login");
    return;
  }

  const optionData = await getOptionData(request, params.qId);

  const [passes, errors] = await validasaur.validate(
    optionData,
    optionValidationRules
  );

  if (!passes) {
    console.log(errors);
    optionData.validationErrors = errors;
    render("question.eta", optionData);
  } else {
    await addOption(
      user.id,
      params.qId,
      optionData.option_text,
      optionData.is_correct
    );
    response.redirect(`/topics/${params.id}/questions/${params.qId}`);
  }
};

const deleteOption = async ({ params, request, response, state, render }) => {
  const user = await state.session.get("user");

  if (!user) {
    response.redirect("/auth/login");
    return;
  }

  await deleteOptionAnswers(params.oId);
  await deleteOptonById(params.oId, params.qId);

  response.redirect(`/topics/${params.tId}/questions/${params.qId}`);
};

export { postOption, deleteOption };
