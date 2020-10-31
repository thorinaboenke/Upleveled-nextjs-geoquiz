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
    : postgres();

export async function getUserByUsername(username) {
  const users = await sql`
    SELECT * FROM users WHERE username = ${username};
  `;

  return users.map((u) => camelcaseKeys(u))[0];
}

export async function registerUser(username, passwordHash) {
  const users = await sql`
    INSERT INTO users
      (username, password_hash)
    VALUES
      (${username}, ${passwordHash})
    RETURNING *;
  `;

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
  username
  FROM
  users,
  sessions
  WHERE
  sessions.token = ${token} AND
  sessions.user_id = users.user_id
  ;`;
  return users.map((u) => camelcaseKeys(u))[0];
}

export async function deleteUserByUsername(username) {
  const users = await sql`
  DELETE FROM users where username = ${username};`;
  // Returning *;`;
  // return users.map((u) => camelcaseKeys(u))[0];
}
