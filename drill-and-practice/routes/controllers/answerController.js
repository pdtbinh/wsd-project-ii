import { findOptionById } from "../../services/questionAnswerOptionService";
import { addAnswer } from "../../services/questionAnswerService";

const postAnswer = async ({ params, request, response, state, render }) => {
  const user = await state.session.get("user");

  if (!user) {
    response.redirect("/auth/login");
    return;
  }

  await addAnswer(user.id, params.qId, params.oId);
  const option = await findOptionById(params.oId, params.qId);

  if (option.is_correct) {
    response.redirect(`/quiz/${params.tId}/questions/${params.qId}/correct`);
  } else {
    response.redirect(`/quiz/${params.tId}/questions/${params.qId}/incorrect`);
  }
};

export { postAnswer };
