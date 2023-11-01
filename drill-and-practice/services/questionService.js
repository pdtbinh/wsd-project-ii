import { sql } from "../database/database.js";

const findQuestionById = async (questionId) => {
  return await sql`SELECT * FROM questions WHERE id = ${questionId}`;
};

const findQuestionsByTopic = async (topicId) => {
  return await sql`SELECT * FROM questions WHERE topic_id = ${topicId}`;
};

const findRandomQuestionByTopic = async (topicId) => {
  return await sql`SELECT * FROM questions WHERE topic_id = ${topicId} ORDER BY RAND() LIMIT 1`;
};

const findRandomQuestion = async () => {
  return await sql`SELECT * FROM questions ORDER BY RAND() LIMIT 1`;
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

export {
  findRandomQuestion,
  findRandomQuestionByTopic,
  deleteQuestionById,
  findQuestionById,
  findQuestionsByTopic,
  deleteQuestionsByTopic,
  addQuestionToTopic,
};
