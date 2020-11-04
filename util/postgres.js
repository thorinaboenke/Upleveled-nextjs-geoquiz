import camelcaseKeys from 'camelcase-keys';
import postgres from 'postgres';
const sql = postgres();

export async function getUserBySessionToken(token) {
  const users = await sql`SELECT
 users.user_id, users.username, users.total_answered_questions, users.total_correct_questions
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

// join region table and region score table
const users = await sql`
SELECT regions.region_name, region_scores.answered_questions, region_scores.correct_questions
FROM
region_scores
INNER JOIN regions ON regions.region_id = region_scores.region_id;`;

// join category table and category score table
const users = await sql`
SELECT categories.category_name, category_scores.answered_questions, category_scores.correct_questions
FROM
category_scores
INNER JOIN categories ON categories.category_id = category_scores.category_id;
`;

// JOIN user table with score table
const users = await sql`
SELECT users.user_id, username, answered_questions, correct_questions
FROM
users
INNER JOIN category_scores ON users.user_id = category_scores.user_id;
`;
// Join users table, category score table and category table
const users = await sql`
SELECT users.user_id, username, answered_questions as answered, correct_questions as correct, category_name as category
FROM
users
INNER JOIN category_scores ON users.user_id = category_scores.user_id
INNER JOIN categories ON categories.category_id = category_scores.category_id;
`;

// now get it for a particular user based on user id (from sessions)
// subselect to get the user id via the token
const users = await sql`
SELECT users.user_id, username, answered_questions as answered, correct_questions as correct, category_name as category
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
  sessions.token = 'ZTWvOPE6nBM0AGpxnbLFPFpbXU2veywA' AND
  sessions.user_id = users.user_id);
`;

// convert categories into columns
// Working version:
const test = await sql`
SELECT answered, correct,
sum (CASE WHEN category = 'flag' then answered else NULL end) flag_answered,
sum (CASE WHEN category = 'capital' then answered else NULL end) capital_answered,
sum (CASE WHEN category = 'name' then answered else NULL end) name_answered,
sum (CASE WHEN category = 'flag' then correct else NULL end) flag_correct,
sum (CASE WHEN category = 'capital' then correct else NULL end) capital_correct,
sum (CASE WHEN category = 'name' then correct else NULL end) name_correct
FROM
(SELECT users.user_id, username, answered_questions as answered, correct_questions as correct, category_name as category
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
    sessions.token = 'MwqkC8ZykLU1U46bwjoZIXbWZxOccCax' AND
    sessions.user_id = users.user_id)) as x
group by answered, correct;`;
console.log(test);
