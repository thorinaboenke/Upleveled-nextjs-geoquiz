import cookies from 'next-cookies';
import nextCookies from 'next-cookies';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';
import CircularProgress from '../components/CircularProgress';
import Layout from '../components/Layout';
import { isSessionTokenValid } from '../util/auth';
import { getTopTen, getUserBySessionToken } from '../util/database';

export default function Stats(props) {
  const router = useRouter();

  console.log('top 10', props.topTen);
  return (
    <Layout loggedIn={props.loggedIn}>
      <Head>
        <title>GeoQuiz - Statistics</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>I am displaying your username:</div>
      <div>{props?.user?.username}</div>
      <div>Top 10:</div>
      {props.topTen.map((top) => {
        return (
          <>
            <div key={top.username}>{top.totalCorrectQuestions}</div>
            <div key={top.username}>{top.username}</div>
          </>
        );
      })}
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
      <CircularProgress
        progress={70}
        size={200}
        strokeWidth={10}
        circleOneStroke={'blue'}
        circleTwoStroke={'red'}
      />
    </Layout>
  );
}

export async function getServerSideProps(context) {
  // get the token from the cookies
  // session valid?
  // if no: redirect to login
  // if yes: get user via the token and pass user as prop
  const { session: token } = nextCookies(context);

  const topTen = await getTopTen();

  if (await isSessionTokenValid(token)) {
    const user = await getUserBySessionToken(token);
    return {
      props: {
        user: user,
        loggedIn: true,
        topTen: topTen,
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
