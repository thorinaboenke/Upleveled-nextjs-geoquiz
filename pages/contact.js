import Head from 'next/head';
import React, { useState } from 'react';
import Layout from '../components/Layout';
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
    align-items: flex-start;
    flex-grow: 1;
    line-height: 2;
  }
  .outer-wrapper div {
    font-size: 1em;
    text-align: left;
    margin: 1em;
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message || !name || !email) {
      setErrorText('Please fill out all fields');
      return;
    }
    const res = await sendContactMail(message, name, email);

    if (res.status < 300) {
      setErrorText('Thank you for your message');
    } else setErrorText('Something went wrong');
  };

  return (
    <Layout loggedIn={props.loggedIn}>
      <Head>
        <title>GeoQuiz - Contact</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div css={aboutStyles}>
        <div className="outer-wrapper">
          <h2>Leave your comments and feedback!</h2>
          <form onSubmit={(e) => handleSubmit(e)}>
            <div>
              <label htmlFor="name">
                Name:
                <input
                  type="text"
                  name="name"
                  id="name"
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </label>
            </div>
            <div>
              <label htmlFor="email">
                Email:
                <input
                  type="text"
                  name="email"
                  id="email"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </label>
            </div>
            <div>
              <label htmlFor="comments">Message:</label>
              <br />
              <textarea
                name="comments"
                rows="12"
                cols="35"
                onChange={(e) => setMessage(e.target.value)}
                required
              />
            </div>
            <div>
              <input type="submit" name="submit" value="Send" />
              <input type="reset" name="reset" value="Clear Form" />
              {errorText && <div>{errorText}</div>}
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
