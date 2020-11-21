import Head from 'next/head';
import React, { useState } from 'react';
import Layout from '../components/Layout';
import nextCookies from 'next-cookies';
import { isSessionTokenValid } from '../util/auth';
import { getUserBySessionToken } from '../util/database';
import { colors } from '../assets/colors';
import { css } from '@emotion/core';

const aboutStyles = css`
  .outer-wrapper {
    width: 80vw;
    max-width: 900px;
    height: 100%;
    margin-top: 100px;
    margin-left: auto;
    margin-right: auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex-grow: 1;
    line-height: 2;
  }
  .outer-wrapper div {
    font-size: 1em;
    text-align: left;
    margin: 1em;
  }
  .flex-col {
    display: flex;
    flex-direction: column;
  }
  label {
    margin-left: 0.2em;
  }
  button {
    cursor: pointer;
    font-family: monospace;
    font-size: 16px;
    border-radius: 20px;
    text-align: center;
    padding: 0.5em;
    color: white;
    background-color: ${colors.primary};
    border: 3px solid ${colors.primary};
    margin: 1em;
  }
  button:hover {
    background-color: ${colors.primaryLight};
    border: 3px solid ${colors.primaryLight};
  }
`;

export default function Deleted(props) {
  const [errorText, setErrorText] = useState('');
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const sendContactMail = async (messageText, senderName, emailAddress) => {
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messageText, senderName, emailAddress }),
      });
      return res;
    } catch (error) {
      return error;
    }
  };
  const resetFormValues = () => {
    setName('');
    setEmail('');
    setMessage('');
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message || !name || !email) {
      setErrorText('Please fill out all fields');
      return;
    }
    const res = await sendContactMail(message, name, email);

    if (res.status < 300) {
      setErrorText('Thank you! Your message was sent successfully');
      resetFormValues();
    } else setErrorText('Oops, something went wrong');
  };

  return (
    <Layout loggedIn={props.loggedIn} user={props.user}>
      <Head>
        <title>GeoQuiz - Contact</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div css={aboutStyles}>
        <div className="outer-wrapper">
          <h2>Send your comments and feedback!</h2>
          <form onSubmit={(e) => handleSubmit(e)}>
            <div className="flex-col">
              <label htmlFor="name">Your name:</label>
              <input
                value={name}
                type="text"
                name="name"
                id="name"
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="flex-col">
              <label htmlFor="email">Your email:</label>
              <input
                value={email}
                type="email"
                name="email"
                id="email"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="comments">Message:</label>
              <br />
              <textarea
                value={message}
                name="comments"
                rows="12"
                cols="35"
                onChange={(e) => setMessage(e.target.value)}
                required
              />
            </div>
            <div className="flex-col">
              <button type="submit" name="submit" value="Send" tabindex="0">
                Send Message
              </button>
              <button type="reset" name="reset" value="Clear Form" tabindex="0">
                Clear Form
              </button>
            </div>
          </form>
          {errorText && <div>{errorText}</div>}
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  let { session: token } = nextCookies(context) || null;
  const loggedIn = await isSessionTokenValid(token);
  const user = (await getUserBySessionToken(token)) || null;
  console.log(user);
  if (typeof token === 'undefined') {
    token = null;
  }
  return {
    props: { loggedIn: loggedIn, user: user, token: token },
  };
}
