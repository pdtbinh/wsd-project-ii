import { sql } from "../database/database.js";

// Order by alphabetical
const getAllTopics = async () => {
  return await sql`SELECT * FROM topics ORDER BY name`;
};

const getTopicById = async (id) => {
  return await sql`SELECT * FROM topics WHERE id = ${id}`;
};

const addTopic = async (name, userId) => {
  await sql`INSERT INTO topics (user_id, name) VALUES (${userId}, ${name})`;
};

const deleteTopicById = async (id) => {
  await sql`DELETE FROM topics WHERE id = ${id}`;
};

const countAllTopics = async () => {
  return await sql`SELECT COUNT(*) AS count FROM topics`;
};

export { countAllTopics, getAllTopics, getTopicById, addTopic, deleteTopicById };
