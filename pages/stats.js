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
  .inner-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
  }
  .inner-wrapper div:last-child {
    margin-right: auto;
    margin-left: auto;
  }

  .welcome {
    text-align: center;
    font-size: 3em;
    margin-right: auto;
    margin-left: auto;
    margin-bottom: -1em;
    padding: 2em;
    background-image: url('/map.jpg');
    background-size: cover;
    width: 100vw;
    color: white;
  }
  .score {
    font-weight: bold;
    font-size: 2em;
    background-color: white;
    opacity: 0.5;
    color: black;
  }

  .progress-container {
    display: flex;
    flex-wrap: wrap;

    justify-content: center;
    align-items: flex-end;
    align-self: center;
    flex-grow: 1;
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
    @media (max-width: 550px) {
      margin-left: 10%;
      margin-right: 10%;
    }
  }
  .top10-container + div {
    align-self: center;
  }
  .heading {
    font-size: 24px;
    margin-top: 0.5em;
    margin-bottom: 0.5em;
    padding: 0.5em;
    background-color: ${colors.primary};
    color: white;
    width: 100vw;
    text-align: center;
  }

  .top10-entry {
    display: flex;
    justify-content: space-between;
    align-items: center;
    min-width: 50%;
    border-bottom: 1px solid ${colors.black};
    padding: 0.3em;
    font-size: 18px;
  }

  .top10-entry div:nth-child(2) {
    margin-right: auto;
    margin-left: 2em;
  }
  .top10-entry div:nth-child(3) {
    font-weight: bold;
  }
  .top10-entry img {
    height: 50px;
    width: 50px;
    border-radius: 50%;
  }

  .not-fulfilled {
    color: lightgrey;
  }
  .achievement {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin-bottom: 0.3em;
    font-size: 1.5em;
  }
  .achievement img {
    height: 1.5em;
    margin-right: 0.3em;
  }
  img.desaturate {
    filter: grayscale(100%);
  }
`;
export default function Stats(props) {
  const router = useRouter();
  const { user, scores, loggedIn, topTen, streaks, achievements } = props;
  return (
    <Layout loggedIn={loggedIn} user={user}>
      <Head>
        <title>GeoQuiz - Statistics</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div css={statStyles}>
        <div className="outer-wrapper">
          <div className="inner-wrapper">
            <div className="welcome">Welcome explorer {user?.username}</div>
          </div>
          <div className="heading">Score</div>
          <div className="score">
            {user?.totalCorrectQuestions} / {user?.totalAnsweredQuestions}{' '}
            correct answers
          </div>
          <CircularProgress
            aria-label="percentage answered correctly all questions"
            progress={
              user.totalAnsweredQuestions === 0
                ? 0
                : Math.round(
                    (user.totalCorrectQuestions / user.totalAnsweredQuestions) *
                      100,
                  )
            }
            size={150}
            strokeWidth={10}
            circleOneStroke={colors.black}
            circleTwoStroke={colors.primary}
            imgUrl="/earth-globe.png"
          />
          <div className="heading">Accuracy per region</div>
          <div className="progress-container">
            <CircularProgress
              aria-label="percentage answered correctly africa"
              progress={
                scores.africa.answered === 0
                  ? 0
                  : Math.round(
                      (scores.africa.correct / scores.africa.answered) * 100,
                    )
              }
              size={90}
              strokeWidth={8}
              circleOneStroke={colors.black}
              circleTwoStroke={colors.primary}
              imgUrl="/africa.png"
            />
            <CircularProgress
              aria-label="percentage answered correctly asia"
              progress={
                scores.asia.answered === 0
                  ? 0
                  : Math.round(
                      (scores.asia.correct / scores.asia.answered) * 100,
                    )
              }
              size={90}
              strokeWidth={8}
              circleOneStroke={colors.black}
              circleTwoStroke={colors.primary}
              imgUrl="/asia.png"
            />

            <CircularProgress
              aria-label="percentage answered correctly europe"
              progress={
                scores.europe.answered === 0
                  ? 0
                  : Math.round(
                      (scores.europe.correct / scores.europe.answered) * 100,
                    )
              }
              size={90}
              strokeWidth={8}
              circleOneStroke={colors.black}
              circleTwoStroke={colors.primary}
              imgUrl="/europe.png"
            />
            <CircularProgress
              aria-label="percentage answered correctly oceania"
              progress={
                scores.oceania.answered === 0
                  ? 0
                  : Math.round(
                      (scores.oceania.correct / scores.oceania.answered) * 100,
                    )
              }
              size={90}
              strokeWidth={8}
              circleOneStroke={colors.black}
              circleTwoStroke={colors.primary}
              imgUrl="/australia.png"
            />
            <CircularProgress
              progress={
                scores.americas.answered === 0
                  ? 0
                  : Math.round(
                      (scores.americas.correct / scores.americas.answered) *
                        100,
                    )
              }
              size={90}
              strokeWidth={8}
              circleOneStroke={colors.black}
              circleTwoStroke={colors.primary}
              imgUrl="/america.png"
            />
          </div>

          <div className="heading">Streaks</div>
          <div className="streak-container">
            {streaks.map((streak) => {
              return (
                <div
                  key={streak.text}
                  className={streak.achieved ? 'fulfilled' : 'not-fulfilled'}
                >
                  {streak.text}
                </div>
              );
            })}
          </div>
          <div className="heading">Achievements</div>
          <div className="achievements-container">
            {achievements.map((achievement) => {
              return (
                <div className="achievement">
                  <img
                    src="/compass.svg"
                    alt="badge"
                    className={!achievement.achieved ? 'desaturate ' : ''}
                  />

                  <div
                    key={achievement.text}
                    className={
                      achievement.achieved ? 'fulfilled' : 'not-fulfilled'
                    }
                  >
                    {achievement.text}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="heading">Top 10</div>
        <div className="top10-container">
          {topTen.map((top) => {
            return (
              <div key={top.username} className="top10-entry">
                {top.avatarUrl ? (
                  <img src={top.avatarUrl} alt="avatar" />
                ) : (
                  <img
                    src={
                      'https://avatars.dicebear.com/api/gridy/:' +
                      top.username +
                      '.svg'
                    }
                    alt="avatar"
                  />
                )}

                <div>{top.username}</div>
                <div>{top.totalCorrectQuestions}</div>
              </div>
            );
          })}
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

    function checkStreaks(input) {
      const daysArray = [3, 7, 10, 30];
      const streakArray = [];
      for (let i = 0; i < daysArray.length; i++) {
        const newStreak = {};
        newStreak.text = `${daysArray[i]} day streak`;
        if (input.streakDays >= daysArray[i]) {
          newStreak.achieved = true;
        } else {
          newStreak.achieved = false;
        }
        streakArray.push(newStreak);
      }
      return streakArray;
    }

    function checkAchievements(input) {
      const categoryArray = Object.keys(input);
      const pointsArray = [10, 100];
      const achievements = [];
      for (let j = 0; j < pointsArray.length; j++) {
        for (let i = 0; i < categoryArray.length; i++) {
          const newAchievement = {};
          newAchievement.text = `${categoryArray[
            i
          ][0].toUpperCase()}${categoryArray[i].slice(1)}: ${
            pointsArray[j]
          } correct answers`;
          if (input[categoryArray[i]].correct >= pointsArray[j]) {
            newAchievement.achieved = true;
          } else {
            newAchievement.achieved = false;
          }
          achievements.push(newAchievement);
        }
      }
      return achievements;
    }
    const achievements = checkAchievements(scores);
    const streaks = checkStreaks(user);

    return {
      props: {
        scores: scores,
        user: user,
        loggedIn: true,
        topTen: topTen,
        streaks: streaks,
        achievements: achievements,
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
