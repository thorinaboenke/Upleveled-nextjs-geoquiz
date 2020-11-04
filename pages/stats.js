import cookies from 'next-cookies';
import nextCookies from 'next-cookies';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';
import CircularProgress from '../components/CircularProgress';
import Layout from '../components/Layout';
import { isSessionTokenValid } from '../util/auth';
import {
  getTopTen,
  getUserBySessionToken,
  getScoresBySessionToken,
} from '../util/database';
import { css } from '@emotion/core';
import { colors } from '../assets/colors';

const statStyles = css`
  .outer-wrapper {
    max-width: 900px;
    min-height: 80vh;
    margin-left: auto;
    margin-right: auto;
    padding-bottom: 1em;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
  }
  .progress-container {
    display: flex;
    flex-wrap: wrap;

    justify-content: flex-start;
    align-items: flex-end;
    align-self: center;
    /* justify-content: flex-start;
    align-items: center;
    position: relative;
    background-color: lightcoral; */
  }

  .top10-container {
    display: flex;
    flex-direction: column;
    align-self: stretch;
    margin-left: 30%;
    margin-right: 30%;
  }
  .top10-container + div {
    align-self: center;
  }
  .top10-entry {
    display: flex;
    justify-content: space-between;
    min-width: 50%;
    border-bottom: 1px solid ${colors.black};
    padding: 0.3em;
  }
`;
export default function Stats(props) {
  const router = useRouter();

  console.log('top 10', props.topTen);
  return (
    <Layout loggedIn={props.loggedIn}>
      <Head>
        <title>GeoQuiz - Statistics</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div css={statStyles}>
        <div className="outer-wrapper">
          <div>Username:{props?.user?.username}</div>
          <CircularProgress
            progress={Math.round(
              (props.user.totalCorrectQuestions /
                props.user.totalAnsweredQuestions) *
                100,
            )}
            size={150}
            strokeWidth={10}
            circleOneStroke={colors.black}
            circleTwoStroke={colors.primary}
            imgUrl="earth-globe.png"
          />

          <div className="progress-container">
            <CircularProgress
              progress={70}
              size={90}
              strokeWidth={8}
              circleOneStroke={colors.black}
              circleTwoStroke={colors.primary}
              imgUrl="africa.png"
            />
            <CircularProgress
              progress={30}
              size={90}
              strokeWidth={8}
              circleOneStroke={colors.black}
              circleTwoStroke={colors.primary}
              imgUrl="asia.png"
            />
            <CircularProgress
              progress={30}
              size={90}
              strokeWidth={8}
              circleOneStroke={colors.black}
              circleTwoStroke={colors.primary}
              imgUrl="europe.png"
            />
            <CircularProgress
              progress={30}
              size={90}
              strokeWidth={8}
              circleOneStroke={colors.black}
              circleTwoStroke={colors.primary}
              imgUrl="australia.png"
            />
            <CircularProgress
              progress={30}
              size={90}
              strokeWidth={8}
              circleOneStroke={colors.black}
              circleTwoStroke={colors.primary}
              imgUrl="america.png"
            />
          </div>
          <div className="achievements-container">
            <div>3 Day Streak</div>
            <div>7 Day Streak</div>
            <div>30 Day Streak</div>
            <div>100 Day Streak</div>
            <div>10 points for names</div>
            <div>10 points for flags</div>
            <div>10 points for capitals</div>
            <div>100 points for names</div>
            <div>100 points for flags</div>
            <div>100 points for capitals</div>
            <div>10 points for Europe</div>
            <div>10 points for America</div>
            <div>10 points for Africa</div>
            <div>10 points for Oceania</div>
            <div>10 points for Asia</div>
            <div>100 points for Europe</div>
            <div>100 points for America</div>
            <div>100 points for Africa</div>
            <div>100 points for Oceania</div>
            <div>100 points for Asia</div>
            <div>1000 points</div>
          </div>
          <div className="top10-container">
            <div>Top 10</div>
            {props.topTen.map((top) => {
              return (
                <div key={top.username} className="top10-entry">
                  <div>{top.username}</div>
                  <div>{top.totalCorrectQuestions}</div>
                </div>
              );
            })}
          </div>
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
        </div>
      </div>
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
    const scores = await getScoresBySessionToken(token);
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
