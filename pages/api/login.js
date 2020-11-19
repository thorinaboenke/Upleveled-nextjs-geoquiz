import argon2 from 'argon2';
import crypto from 'crypto';
import cookie from 'cookie';
import {
  getUserByUsername,
  insertSession,
  deleteExpiredSessions,
} from '../../util/database';

export default async function handler(request, response) {
  // extract the username and password from the request body (sent on submit by the signup form)
  const { username, password } = request.body;
  const user = await getUserByUsername(username);
  // if user does not exist deny access
  if (typeof user === 'undefined') {
    // TODO return proper message from the server here
    return response.status(401).send({ success: false });
  }

  // verify with argon if the entered password matches the password hash in the database
  const passwordVerified = await argon2.verify(user.passwordHash, password);
  // if password can't be verified, deny access
  if (!passwordVerified) {
    // TODO return proper message from the server here
    return response.status(401).send({ success: false });
  }

  // generate new session token (represent correct authentication) with crypto
  const token = crypto.randomBytes(24).toString('base64');
  //enter the session for this user and this token in the database
  await insertSession(token, user.userId);

  const maxAge = 60 * 60 * 24; // 24h
  const isProduction = process.env.NODE_ENV === 'production';

  //define the session cookie
  const sessionCookie = cookie.serialize('session', token, {
    maxAge: maxAge,
    expires: new Date(Date.now() + maxAge * 1000),
    // Deny cookie access from frontend JavaScript
    httpOnly: true,
    secure: isProduction,
    path: '/',
    sameSite: 'lax',
  });

  //send the session Cookie in the http header
  response.setHeader('Set-Cookie', sessionCookie);

  response.send({ success: true });
  await deleteExpiredSessions();
}
