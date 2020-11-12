import Head from 'next/head';
import React from 'react';
import Layout from '../components/Layout';
import nextCookies from 'next-cookies';
import cookie from 'cookie';
import { css } from '@emotion/core';
import { deleteSessionByToken } from '../util/database';

const deletedStyles = css`
  .outer-wrapper {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex-grow: 1;
  }
  .outer-wrapper div {
    font-size: 2em;
    text-align: center;
    margin: 1em;
    margin-top: 20vh;
  }
  img {
    margin: 2em;
    height: 200px;
  }
`;

export default function Deleted(props) {
  return (
    <Layout loggedIn={props.loggedIn}>
      <Head>
        <title>GeoQuiz - Goodbye</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div css={deletedStyles}>
        <div className="outer-wrapper">
          <div>Your account was successfully deleted.</div>
          <img src="/world-map.png" alt="world-map" />
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const { session: token } = nextCookies(context);
  await deleteSessionByToken(token);

  context.res.setHeader(
    'Set-Cookie',
    cookie.serialize('session', '', {
      maxAge: -1,
      path: '/',
    }),
  );
  return {
    props: { loggedIn: false },
  };
}
