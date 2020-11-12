import Link from 'next/link';
import React from 'react';
import { css } from '@emotion/core';
import { colors } from '../assets/colors';
import { useRouter } from 'next/router';

function Header(props) {
  const loggedInPassed = typeof props.loggedIn !== 'undefined';
  const router = useRouter();
  const user = props.user;

  return (
    <div css={headerStyles}>
      <header>
        <Link href="/">
          <a
            onClick={() => {
              router.pathname === '/' && window.location.reload();
            }}
          >
            Home
          </a>
        </Link>
        <Link href="/stats">
          <a>Stats</a>
        </Link>
        <Link href="/profile">
          <a>Profile</a>
        </Link>
        {!loggedInPassed ||
        router.pathname === '/login' ? null : props.loggedIn ? (
          <>
            <Link href="/logout">
              <a className="log">Log out</a>
            </Link>
            <Link href="/profile">
              <img
                src={
                  user?.avatarUrl
                    ? user?.avatarUrl
                    : 'https://avatars.dicebear.com/api/gridy/:' +
                      user?.username +
                      '.svg'
                }
                alt="avatar"
              />
            </Link>
          </>
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
    border: 2px solid ${colors.black};


    a {
      height: 100%;
    padding: 1em;
    color: ${colors.primary};
    font-weight:bold;
    font-size: 20px;
    margin-left: 2em;
    margin-right: 2em;
    text-align: center;
    @media (max-width: 550px) {
    margin-left: 0.2em;
    margin-right: 0.2em;
    font-size: 16px;
    }
    @media (max-width: 360px) {
    margin-left: 0.1em;
    margin-right: 0.1em;
    font-size: 14px;
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
 img{
    height: 40px;
    margin-right: 2em;
    border-radius: 50%;
  }
  img:hover{
    cursor: pointer;
  }
`;
