import Head from 'next/head';
import React from 'react';
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
  .impressum {
    font-weight: bold;
  }
`;

export default function Deleted(props) {
  return (
    <Layout loggedIn={props.loggedIn}>
      <Head>
        <title>GeoQuiz - Impressum</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div css={aboutStyles}>
        <div className="outer-wrapper">
          <p className="impressum">Impressum - Legal Disclosure</p>
          <p>
            Name: Thorina Boenke
            <br />
            Location: Vienna
          </p>
          <p>
            {' '}
            <strong>Legal disclaimer</strong> <br />
            The contents of these pages were prepared with utmost care.
            Nonetheless, no liability is assumed for the timeless accuracy and
            completeness of the information. <br />{' '}
            <strong>Liability for Links</strong>
            <br />
            This page includes links to external third party websites. Having no
            influence on the contents of those websites, I cannot guarantee for
            those contents. Providers or administrators of linked websites are
            always responsible for their own contents. The linked websites had
            been checked for possible violations of law at the time of the
            establishment of the link. Illegal contents were not detected at the
            time of the linking. While a permanent monitoring of the contents of
            linked websites cannot be imposed, illegal links will be removed
            immediately at the time I get knowledge of them.
            <br /> <strong>Copyright</strong>
            <br />
            Contents published on this websites by the author are subject to
            German copyright laws. Reproduction, editing, distribution as well
            as the use of any kind outside the scope of the copyright law
            require a written permission of the author. Downloads and copies of
            this websites are permitted for private use only. The commercial use
            of contents without permission of the originator is prohibited.
            Copyright laws of third parties are respected and contributions of
            third parties on this site are indicated as such. However, if you
            notice any violations of copyright law, please inform me. Such
            contents will be removed immediately. <br />
            <strong>Privacy Policies</strong> <br />
            To create an account, a user needs to provide a username and a
            password. Passwords are stored encrypted, but the usual
            precautionary measures apply. Users should use a strong password and
            not use the same one that is used for any other website. Other data
            is generated by use of the service, such as avatar pictures or
            scores in the game. Username, avatars and scores are visible to
            other players, so, since anyone can create an account on the site,
            they should be considered public information. Avatar pictures are
            hosted via third party service providers (Cloudinary). No data of a
            user will be shared with third parties. Data related to a users
            account is stored and processed as long as an account is kept on the
            service. Upon deletion of an account, data linked to this account is
            deleted. <br />
            <strong>Cookies</strong> <br />
            This page uses cookies to store session ids.
          </p>
        </div>
      </div>
    </Layout>
  );
}
