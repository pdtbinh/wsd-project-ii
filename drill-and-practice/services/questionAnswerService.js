import { sql } from "../database/database.js";

const deleteQuestionAnswers = async (questionId) => {
  await sql`DELETE FROM question_answers WHERE question_id = ${questionId}`;
};

const deleteOptionAnswers = async (optionId) => {
  await sql`DELETE FROM question_answers WHERE question_answer_option_id = ${optionId}`;
};

const findAnswersByQuestion = async (questionId) => {
  return await sql`SELECT * FROM question_answers WHERE question_id = ${questionId}`;
};

const addAnswer = async (userId, questionId, optionId) => {
  await sql`INSERT INTO question_answers (user_id, question_id, question_answer_option_id) VALUES (${userId}, ${questionId}, ${optionId})`;
};

export {
  addAnswer,
  deleteOptionAnswers,
  deleteQuestionAnswers,
  findAnswersByQuestion,
};
