import Link from 'next/link';
import React from 'react';
import { css, keyframes } from '@emotion/core';
import styled from '@emotion/styled';
import { colors } from '../assets/colors';

function Header(props) {
  const loggedInPassed = typeof props.loggedIn !== 'undefined';

  return (
    <div css={headerStyles}>
      <header>
        <Link href="/">
          <a>Home</a>
        </Link>
        <Link href="/stats">
          <a>Stats</a>
        </Link>
        {!loggedInPassed ? null : props.loggedIn ? (
          <Link href="/logout">
            <a className="log">Log out</a>
          </Link>
        ) : (
          <Link href="/login">
            <a className="log">Log in</a>
          </Link>
        )}
      </header>
    </div>
  );
}

export default Header;

const headerStyles = css`
  header {
    width: 100vw;
    height: 60px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    background-color: ${colors.black};


    a {
    padding: 1em;
    color: ${colors.primary};
    font-weight:bold;
    font-size: 20px;
    margin-left: 2em;
    margin-right: 2em;
    text-align: center;
    @media (max-width: 420px) {
    margin-left: 0.2em;
    margin-right: 0.2em;
    }


  }
  a:hover {
    background: ${colors.primary};
    color: white;

  }
  .log{
    margin-left: auto;
    margin-right: 1em;
  }

  @media screen and (max-width: 400px) {


  }
`;
