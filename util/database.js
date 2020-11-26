import postgres from 'postgres';
import dotenv from 'dotenv';
import camelcaseKeys from 'camelcase-keys';
import extractHerokuDatabaseEnvVars from './extractHerokuDatabaseEnvVars';

extractHerokuDatabaseEnvVars();
dotenv.config();

const sql =
  process.env.NODE_ENV === 'production'
    ? // Heroku needs SSL connections but
      // has an "unauthorized" certificate
      // https://devcenter.heroku.com/changelog-items/852
      postgres({ ssl: { rejectUnauthorized: false } })
    : postgres({ idle_timeout: 5 });

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
  const categoryIds = await sql`
  SELECT category_id FROM categories;
  `;
  const categoryArray = categoryIds.map((entry) => entry.category_id);
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
  const regionIds = await sql`
  SELECT region_id FROM regions;
  `;
  // insert a row with 0 values for each region for the new user
  const regionArray = regionIds.map((entry) => entry.region_id);
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
  SELECT FROM sessions WHERE token = ${token};
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
 users.user_id, users.username, users.total_answered_questions, users.total_correct_questions, users.streak_days, users.avatar_url
  FROM
  users,
  sessions
  WHERE
  sessions.token = ${token} AND
  sessions.user_id = users.user_id
  ;`;

  return users.map((u) => camelcaseKeys(u))[0];
}

export async function getScoresBySessionToken(token) {
  const cat = await sql`
SELECT
category_scores.answered_questions as cat_answered,
category_scores.correct_questions as cat_correct,
category_name as category
FROM
users
INNER JOIN category_scores ON users.user_id = category_scores.user_id
INNER JOIN categories ON categories.category_id = category_scores.category_id
WHERE users.user_id = (SELECT
 users.user_id
  FROM
  users,
  sessions
  WHERE
  sessions.token = ${token} AND
  sessions.user_id = users.user_id);`;

  const reg = await sql`
SELECT
region_scores.answered_questions as cat_answered,
region_scores.correct_questions as cat_correct,
region_name as region
FROM
users
INNER JOIN region_scores ON users.user_id = region_scores.user_id
INNER JOIN regions ON regions.region_id = region_scores.region_id
WHERE users.user_id = (SELECT
 users.user_id
  FROM
  users,
  sessions
  WHERE
  sessions.token = ${token} AND
  sessions.user_id = users.user_id);`;

  const categoryScores = cat.map((u) => camelcaseKeys(u));

  const reducedCategoryScores = categoryScores.reduce((acc, curr) => {
    acc[curr.category] = {
      correct: curr.catCorrect,
      answered: curr.catAnswered,
    };
    return acc;
  }, {});

  const regionScores = reg.map((u) => camelcaseKeys(u));
  console.log('regionScores', regionScores);
  const reducedRegionScores = regionScores.reduce((acc, curr) => {
    acc[curr.region.toLowerCase()] = {
      correct: curr.catCorrect,
      answered: curr.catAnswered,
    };
    return acc;
  }, {});

  const scores = { ...reducedRegionScores, ...reducedCategoryScores };
  console.log(scores);
  return scores;
}

export async function deleteUserByUsername(username, token) {
  const users = await sql`
  DELETE FROM users where username = ${username} AND user_id = (SELECT user_id FROM sessions WHERE
  sessions.token = ${token} )
  Returning *;`;
  return users.map((u) => camelcaseKeys(u))[0];
}

export async function updateScoresByUserId(
  userId,
  answeredQuestions,
  correctQuestions,
  categoryAnswer,
  region,
  token,
) {
  // update the total score, total questions, last_game_played and streak_days in the user table
  if (userId) {
    const scores = await sql`
  UPDATE users
  SET total_correct_questions = total_correct_questions + ${correctQuestions},
  total_answered_questions = total_answered_questions + ${answeredQuestions},
  streak_days = CASE
  WHEN DATE_PART('day', NOW() - last_game_played) = 1 THEN streak_days + 1
  WHEN DATE_PART('day', NOW() - last_game_played) > 1 THEN 0
  ELSE streak_days
  END,
  last_game_played = NOW()
  WHERE user_id = (SELECT user_id FROM sessions WHERE
  sessions.token = ${token} );`;
  }

  // update the correct_questions and answered_questions in region_scores based on user_id and region_id
  const regionScores = await sql`
  UPDATE region_scores
  SET correct_questions = correct_questions + ${correctQuestions},
  answered_questions = answered_questions + ${answeredQuestions}
  WHERE user_id = (SELECT user_id FROM sessions WHERE
  sessions.token = ${token}) AND region_id = (SELECT region_id FROM regions WHERE region_name = ${region});`;

  const categoryScores = await sql`
UPDATE category_scores
SET correct_questions = correct_questions + ${correctQuestions},
answered_questions = answered_questions + ${answeredQuestions}
WHERE user_id = (SELECT user_id FROM sessions WHERE
  sessions.token = ${token} ) AND category_id = (SELECT category_id FROM categories WHERE category_name = ${categoryAnswer});`;
}

export async function getTopTen() {
  const users = await sql`
    SELECT username,total_correct_questions, avatar_url FROM users ORDER BY total_correct_questions DESC LIMIT 10;
  `;

  return users.map((u) => camelcaseKeys(u));
}

export async function insertAvatarUrlByUserId(userId, url, token) {
  const avatarUrl = await sql`
  UPDATE users
  SET avatar_url =  ${url}
WHERE user_id = (SELECT user_id FROM sessions WHERE
  sessions.token = ${token} ) ;`;
}
