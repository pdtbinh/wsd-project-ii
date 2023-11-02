import { sql } from "../database/database.js";

const findQuestionById = async (questionId) => {
  return await sql`SELECT * FROM questions WHERE id = ${questionId}`;
};

const findQuestionsByTopic = async (topicId) => {
  return await sql`SELECT * FROM questions WHERE topic_id = ${topicId}`;
};

const findRandomQuestionByTopic = async (topicId) => {
  return await sql`SELECT * FROM questions WHERE topic_id = ${topicId} ORDER BY random() LIMIT 1`;
};

const findRandomQuestion = async () => {
  return await sql`SELECT * FROM questions ORDER BY random() LIMIT 1`;
};

const deleteQuestionsByTopic = async (topicId) => {
  await sql`DELETE FROM questions WHERE topic_id = ${topicId}`;
};

const deleteQuestionById = async (questionId) => {
  await sql`DELETE FROM questions WHERE id = ${questionId}`;
};

const addQuestionToTopic = async (userId, topicId, questionText) => {
  await sql`INSERT INTO questions (user_id, topic_id, question_text) VALUES (${userId}, ${topicId}, ${questionText})`;
};

const countAllQuestions = async () => {
  return await sql`SELECT COUNT(*) AS count FROM questions`;
};

export {
  countAllQuestions,
  findRandomQuestion,
  findRandomQuestionByTopic,
  deleteQuestionById,
  findQuestionById,
  findQuestionsByTopic,
  deleteQuestionsByTopic,
  addQuestionToTopic,
};
