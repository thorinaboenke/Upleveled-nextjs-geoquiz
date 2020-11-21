import Head from 'next/head';
import React from 'react';
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
    align-items: flex-start;
    flex-grow: 1;
    line-height: 2;
  }
  .outer-wrapper div {
    font-size: 1em;
    text-align: left;
    margin: 1em;
  }
  .outer-wrapper ul {
    align-self: flex-start;
    margin-left: -2em;
  }
  .outer-wrapper li {
    list-style: none;
  }

  .outer-wrapper a {
    color: ${colors.primary};
  }
  .outer-wrapper a:hover {
    cursor: pointer;
  }
  .flex {
    display: flex;
  }

  @media (max-width: 600px) {
    .flex {
      flex-direction: column;
    }
  }
  .flex img {
    border-radius: 50%;
    height: 150px;
    margin: 2em;
    margin-left: 0;
    align-self: center;
  }
  .picture-gallery {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr 1fr;
    column-gap: 0.5em;
    row-gap: 0.5em;
  }
  .picture-gallery img {
    max-width: 100%;
  }
  .group {
    grid-column: 1/3;
  }
`;

export default function Deleted(props) {
  return (
    <Layout loggedIn={props.loggedIn}>
      <Head>
        <title>GeoQuiz - About</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div css={aboutStyles}>
        <div className="outer-wrapper">
          <div className="flex">
            <img src="/profilepicture.jpg" alt="profile.jpg" />
            <p>
              Hello there! <br /> My name is Thorina, great to see you here!
              This App was my final project in the Vienna UpLeveled Full Stack
              Web Development Bootcamp 2020. It is built with React and Next.js,
              a PostgreSQL database, publicly available data from
              restcountries.eu, Mailgun, image hosting via Cloudinary and
              deployed via Heroku. <br /> You can check out the code on{' '}
              <a
                href="https://github.com/thorinaboenke/geoquiz"
                alt="Thorina Boenke GitHub"
              >
                Github
              </a>
              , or find me on{' '}
              <a
                href="https://twitter.com/ThorinaBoenke"
                alt="Thorina Boenke Twitter"
              >
                Twitter.
              </a>
            </p>{' '}
          </div>
          <ul>
            <li>
              Avatars from{' '}
              <a href="https://avatars.dicebear.com" title="Dicebear">
                Dicebear
              </a>{' '}
            </li>{' '}
            <li>
              {' '}
              Icons by{' '}
              <a
                href="https://www.flaticon.com/authors/freepik"
                title="Freepik"
              >
                Freepik
              </a>{' '}
              from{' '}
              <a href="https://www.flaticon.com/" title="Flaticon">
                www.flaticon.com
              </a>
            </li>
            <li>
              <span>
                Photos by{' '}
                <a href="https://unsplash.com/@gaellemarcel?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">
                  Gaelle Marcel
                </a>{' '}
                on{' '}
                <a href="https://unsplash.com/s/photos/world?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">
                  Unsplash
                </a>{' '}
                and <a href="https://www.pexels.com/@andrew">Andrew Neel</a> on
                <a href="https://www.pexels.com"> Pexels</a>
              </span>{' '}
            </li>
          </ul>

          <a href="https://upleveled.io">
            <img src="/upleveled.svg" alt="UpLeveledLogo" height="100px" />
          </a>
          <p>
            🚀 If you want to learn coding lightning fast and kick start your
            career as a web developer, check out{' '}
            <a href="https://upleveled.io">UpLeveled</a>. Thanks to our
            fantastic teacher Karl Horky, superwoman Antje Enzi and all the
            other students, it was a BLAST!
          </p>
          <div className="picture-gallery">
            <img
              src="/group.jpg"
              alt="Upleveled students working"
              className="group"
            />
            <img src="/working.jpg" alt="Upleveled students working" />
            <img src="/working2.jpg" alt="Upleveled students working" />
            <img src="/working3.jpg" alt="Upleveled students working" />
            <img src="/working4.jpg" alt="Upleveled students working" />
          </div>
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps(context) {
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
}
