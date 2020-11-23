import Link from 'next/link';
import React from 'react';
import Header from './Header';
import { css } from '@emotion/core';
import { colors } from '../assets/colors';

const footerStyles = css`
  footer {
    min-height: 40px;
    width: 100vw;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: ${colors.black};

    a {
      padding: 1em;
      color: #7ea3b5;
      border: none;

      margin-left: 0.5em;
      margin-right: 0.5em;
      text-align: center;
      @media (max-width: 420px) {
        font-size: 8px;
      }
    }
    a:hover {
      color: ${colors.primaryLight};
    }

    .icon {
      height: 20px;
      width: 20px;
    }
  }
`;

function Layout(props) {
  return (
    <div id="content">
      <Header
        loggedIn={props.loggedIn}
        user={props.user}
        avatar={props.avatar}
      />
      <main>{props.children}</main>
      <div css={footerStyles}>
        <footer>
          {' '}
          <Link href="/about">
            <a data-cy="footer-link-about">About</a>
          </Link>
          <Link href="/contact">
            <a data-cy="footer-link-contact">Contact</a>
          </Link>
          <Link href="/impressum">
            <a data-cy="footer-link-impressum"> Impressum</a>
          </Link>
          <a
            href="https://github.com/thorinaboenke/geoquiz"
            alt="Thorina Boenke GitHub"
          >
            <img className="icon" src="/github.svg" alt="github" />
          </a>
          <a
            href="https://twitter.com/ThorinaBoenke"
            alt="Thorina Boenke Twitter"
          >
            <img className="icon" src="/twitter.svg" alt="twitter" />
          </a>
        </footer>
      </div>
    </div>
  );
}

export default Layout;
