import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import Layout from '../components/Layout';
import { useRouter } from 'next/router';
import { isSessionTokenValid } from '../util/auth';
import { loginStyles } from '../styles/loginstyles';
import nextCookies from 'next-cookies';

export default function Signup(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const usernameInput = useRef(null);

  useEffect(() => {
    usernameInput.current.focus();
  }, []);

  const router = useRouter();
  return (
    <Layout>
      <Head>
        <title>GeoQuiz - Signup</title>
      </Head>
      <div css={loginStyles}>
        <div className="container">
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const response = await fetch('/api/signup', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  username: username,
                  password: password,
                  token: props.token,
                }),
              });

              const { success, errors } = await response.json();
              if (success) {
                console.log('successfully registered');
                // redirect to homepage if successfully registered
                const log = await fetch('/api/login', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ username, password }),
                });
                router.push('/');
              } else {
                // If the response status is 409 (conflict), i.e. user already exists show an error message
                if (response.status === 409) {
                  setErrorMessage('User already exists');
                }
                if (response.status === 400) {
                  setErrorMessage(errors[0].message);
                } else {
                  setErrorMessage('Something went wrong');
                }
              }
            }}
          >
            <div className="title">Register</div>
            <label htmlFor="username">
              {' '}
              Username
              <input
                ref={usernameInput}
                value={username}
                id="username"
                type="text"
                maxLength={22}
                onChange={(e) => setUsername(e.currentTarget.value)}
              />
            </label>

            <label htmlFor="password">
              {' '}
              Password
              <input
                value={password}
                id="password"
                type="text"
                maxLength={22}
                onChange={(e) => setPassword(e.currentTarget.value)}
              />
            </label>
            {errorMessage && <div className="error">{errorMessage}</div>}
            <button type="submit">SIGN UP</button>
            <div className="instructions">
              {' '}
              Already have an account?{' '}
              <Link href="/login">
                <a>Log in here</a>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  //if a user that is already logged in accesses the signup page redirect to home
  const { session: tokenFromCookie } = nextCookies(context);
  const redirectDestination = '/';
  const logged = await isSessionTokenValid(tokenFromCookie);
  if (logged) {
    console.log({ logged });
    return {
      redirect: {
        destination: redirectDestination,
        permanent: false,
      },
    };
  }

  const tokens = new (await import('csrf')).default();
  const secret = process.env.CSRF_TOKEN_SECRET;

  if (typeof secret === 'undefined') {
    throw new Error('CSRF_TOKEN_SECRET environment variable not configured');
  }
  const token = tokens.create(secret);
  return { props: { token } };
}

// in node to generate the secret that has to be saved in the .env file:
// var Tokens = require('csrf');
// const tokens = new Tokens();
// const secret = tokens.secretSync()
