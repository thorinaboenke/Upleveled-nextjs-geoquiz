import Link from 'next/link';
import React from 'react';
import Header from './Header';
import { css, keyframes } from '@emotion/core';
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
    }
  }
`;

function Layout(props) {
  return (
    <div id="content">
      <Header loggedIn={props.loggedIn} />
      <main>{props.children}</main>
      <div css={footerStyles}>
        <footer>
          {' '}
          <Link href="/">
            <a>About</a>
          </Link>
          <Link href="/stats">
            <a>Contact</a>
          </Link>
          <a href="https://github.com/thorinaboenke/geoquiz">
            <img className="icon" src="/github.svg" alt="github" />
          </a>
          <a href="https://twitter.com/ThorinaBoenke">
            <img className="icon" src="/twitter.svg" alt="twitter" />
          </a>
        </footer>
      </div>
    </div>
  );
}

export default Layout;
