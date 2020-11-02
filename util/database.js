import postgres from 'postgres';
import dotenv from 'dotenv';
import camelcaseKeys from 'camelcase-keys';
import extractHerokuDatabaseEnvVars from './extractHerokuDatabaseEnvVars';
import { constants } from 'buffer';

extractHerokuDatabaseEnvVars();

dotenv.config();
const sql =
  process.env.NODE_ENV === 'production'
    ? // Heroku needs SSL connections but
      // has an "unauthorized" certificate
      // https://devcenter.heroku.com/changelog-items/852
      postgres({ ssl: { rejectUnauthorized: false } })
    : postgres();

export async function getUserByUsername(username) {
  const users = await sql`
    SELECT * FROM users WHERE username = ${username};
  `;

  return users.map((u) => camelcaseKeys(u))[0];
}

export async function registerUser(username, passwordHash) {
  // insert the user in the user table
  const users = await sql`
    INSERT INTO users
      (username, password_hash, total_answered_questions, total_correct_questions)
    VALUES
      (${username}, ${passwordHash}, 0, 0)
    RETURNING *;
  `;
  // get the existing category ids
  const categoryObject = await sql`
  SELECT category_id FROM categories;
  `;
  const categoryArray = categoryObject.map((entry) => entry.category_id);
  // insert a row with 0 values for each category for the new user
  for (const id of categoryArray) {
    await sql`
    INSERT INTO category_scores
      (answered_questions, correct_questions, category_id, user_id)
    VALUES(
      0,
      0,
    ${id},
    (SELECT user_id FROM users WHERE username = ${username})
    );`;
  }
  // get the existing region ids
  const regionObject = await sql`
  SELECT region_id FROM regions;
  `;
  // insert a row with 0 values for each region for the new user
  const regionArray = regionObject.map((entry) => entry.region_id);
  for (const id of regionArray) {
    await sql`
    INSERT INTO region_scores
      (answered_questions, correct_questions, region_id, user_id)
    VALUES(
      0,
      0,
    ${id},
    (SELECT user_id FROM users WHERE username = ${username})
    );`;
  }

  return users.map((u) => camelcaseKeys(u))[0];
}

export async function insertSession(token, userId) {
  const sessions = await sql`
    INSERT INTO sessions
      (token, user_id)
    VALUES
      (${token},${userId})
    RETURNING *;
  `;

  return sessions.map((u) => camelcaseKeys(u))[0];
}

export async function getSessionByToken(token) {
  const sessions = await sql`
  SELECT FROM sessions where token = ${token};
  `;
  return sessions.map((u) => camelcaseKeys(u))[0];
}

export async function deleteSessionByToken(token) {
  await sql`DELETE FROM sessions WHERE token = ${token};`;
}

export async function deleteExpiredSessions() {
  await sql`DELETE FROM sessions WHERE expiry_timestamp < NOW();`;
}

export async function getUserBySessionToken(token) {
  const users = await sql`SELECT
 users.user_id, users.username
  FROM
  users,
  sessions
  WHERE
  sessions.token = ${token} AND
  sessions.user_id = users.user_id
  ;`;
  console.log(users.map((u) => camelcaseKeys(u))[0]);
  return users.map((u) => camelcaseKeys(u))[0];
}

export async function deleteUserByUsername(username) {
  const users = await sql`
  DELETE FROM users where username = ${username};`;
  // Returning *;`;
  // return users.map((u) => camelcaseKeys(u))[0];
}

export async function updateScoresByUserId(
  userId,
  answeredQuestions,
  correctQuestions,
  categoryAnswer,
  region,
) {
  // update the total score and total questions in the user table
  console.log('test', answeredQuestions);
  const scores = await sql`
  UPDATE users
  SET total_correct_questions = total_correct_questions + ${correctQuestions},
  total_answered_questions = total_answered_questions + ${answeredQuestions}
  WHERE user_id = ${userId};`;
  // update the correct_questions and answered_questions in region_scores based on user_id and region_id
  const regionScores = await sql`
  UPDATE region_scores
  SET correct_questions = correct_questions + ${correctQuestions},
  answered_questions = answered_questions + ${answeredQuestions}
  WHERE user_id = ${userId} AND region_id = (SELECT region_id FROM regions WHERE region_name = ${region});`;

  const categoryScores = await sql`
UPDATE category_scores
SET correct_questions = correct_questions + ${correctQuestions},
answered_questions = answered_questions + ${answeredQuestions}
WHERE user_id = ${userId} AND category_id = (SELECT category_id FROM categories WHERE category_name = ${categoryAnswer});`;
}

export async function getTopTen() {
  const users = await sql`
    SELECT * FROM users ORDER BY total_correct_questions LIMIT 10;
  `;

  return users.map((u) => camelcaseKeys(u));
}
