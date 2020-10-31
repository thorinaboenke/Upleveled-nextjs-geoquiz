import cookies from 'next-cookies';
import nextCookies from 'next-cookies';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';
import Layout from '../components/Layout';
import { isSessionTokenValid } from '../util/auth';
import { getUserBySessionToken } from '../util/database';

export default function Stats(props) {
  const router = useRouter();
  return (
    <Layout loggedIn={props.loggedIn}>
      <Head>
        <title>GeoQuiz - Statistics</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>I am displaying your username:</div>
      <div>{props?.user?.username}</div>
      <div>More Statistics:</div>
      <button
        onClick={async (e) => {
          const response = await fetch('/api/signup', {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username: props.user.username }),
          });
          const { success } = await response.json();
          if (success) router.push('/deleted');
        }}
      >
        Delete my account
      </button>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  // get the token from the cookies
  // session valid?
  // if no: redirect to login
  // if yes: get user via the token and pass user as prop
  const { session: token } = nextCookies(context);

  if (await isSessionTokenValid(token)) {
    const user = await getUserBySessionToken(token);
    return {
      props: {
        user: user,
        loggedIn: true,
      },
    };
  }
  return {
    redirect: {
      destination: '/login?returnTo=/stats',
      permanent: false,
    },
  };
}
