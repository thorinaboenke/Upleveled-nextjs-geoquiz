import Head from 'next/head';
import React from 'react';
import Layout from '../components/Layout';

import { css } from '@emotion/core';

const aboutStyles = css`
  .outer-wrapper {
    width: 80vw;
    height: 100%;
    margin-top: 50px;
    margin-left: auto;
    margin-right: auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex-grow: 1;
  }
  .outer-wrapper div {
    font-size: 1em;
    text-align: left;
    margin: 1em;
    margin-top: 20vh;
  }
  img {
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
          <div>
            Hello there! I created this App as my final project in the Vienna
            UpLeveled Bootcamp 2020. It is build with React and Next.js, REST
            countries, a PostgreSQL database, image hosting via Cloudinary and
            deployed via Heroku. You can find all the code on Github. Thanks to
            our fantastic teacher Karl Horky, superwoman Antje Enzi and all the
            other students, it was a BLAST! If you want to start something new
            and kick start your career as a developer, check out UpLeveled.
          </div>
        </div>
      </div>
    </Layout>
  );
}
