import { sql } from "../database/database.js";

const deleteOptonById = async (optionId, questionId) => {
  await sql`DELETE FROM question_answer_options WHERE id = ${optionId} AND question_id = ${questionId}`;
};

const deleteQuestionAnswerOptions = async (questionId) => {
  await sql`DELETE FROM question_answer_options WHERE question_id = ${questionId}`;
};

const findAnswerOptionsByQuestion = async (questionId) => {
  return await sql`SELECT * FROM question_answer_options WHERE question_id = ${questionId}`;
};

const findOptionById = async (optionId, questionId) => {
  return await sql`SELECT * FROM question_answer_options WHERE id = ${optionId} AND question_id = ${questionId}`;
};

const addOption = async (questionId, optionText, isCorrect) => {
  await sql`INSERT INTO question_answer_options (question_id, option_text, is_correct) VALUES (${questionId}, ${optionText}, ${isCorrect})`;
};

const findCorrectOptionsForQuestion = async (questionId) => {
  return await sql`SELECT * FROM question_answer_options WHERE question_id = ${questionId} AND is_correct = TRUE`;
};

export {
  findCorrectOptionsForQuestion,
  findOptionById,
  deleteOptonById,
  deleteQuestionAnswerOptions,
  findAnswerOptionsByQuestion,
  addOption,
};
