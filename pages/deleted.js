import Head from 'next/head';
import React from 'react';
import Layout from '../components/Layout';
import nextCookies from 'next-cookies';
import cookie from 'cookie';
import { deleteSessionByToken } from '../util/database';

export default function Deleted(props) {
  return (
    <Layout loggedIn={props.loggedIn}>
      <Head>
        <title>GeoQuiz - Goodbye</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>Your account was successfully deleted</div>
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
