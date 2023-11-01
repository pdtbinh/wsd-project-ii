import {
  addOption,
  deleteOptonById,
} from "../../services/questionAnswerOptionService";
import { deleteOptionAnswers } from "../../services/questionAnswerService";
import { findQuestionById } from "../../services/questionService";

const optionValidationRules = {
  option_text: [validasaur.required, validasaur.minLength(1)],
};

const getOptionData = async (request, questionId) => {
  const body = request.body({ type: "form" });
  const params = await body.value;
  const rows = await findQuestionById(questionId);
  const question = rows[0];

  return {
    ...question,
    option_text: params.get("option_text"),
    is_correct: params.get("option_text"),
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

const deleteOption = async ({ params, response, render }) => {
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
