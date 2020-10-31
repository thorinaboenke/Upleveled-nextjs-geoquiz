import { getSessionByToken } from './database';

// 1) check if there is a token
// 2) check if there is a session for that token in the database
// 3) check if the session is expired
export async function isSessionTokenValid(token) {
  if (typeof token === 'undefined') {
    return false;
  }
  const session = await getSessionByToken(token);
  if (typeof session === 'undefined') {
    return false;
  }

  if (session.expiryTimestamp < new Date()) {
    return false;
  }

  return true;
}
