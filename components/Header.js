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
      <header className="header">
        <input
          className="menu-btn"
          type="checkbox"
          id="menu-btn"
          name="menu-btn"
        />
        <label className="menu-icon" htmlFor="menu-btn">
          <span className="navicon" />
        </label>
        <ul className="menu">
          <li>
            {' '}
            <Link href="/">
              <a
                onClick={() => {
                  router.pathname === '/' && window.location.reload();
                }}
              >
                Home
              </a>
            </Link>
          </li>
          <li>
            <Link href="/stats">
              <a>Stats</a>
            </Link>
          </li>
          <li>
            {' '}
            <Link href="/profile">
              <a>Profile</a>
            </Link>
          </li>

          {!loggedInPassed ||
          router.pathname === '/login' ? null : props.loggedIn ? (
            <>
              <li>
                <Link href="/logout">
                  <a className="log">Log out</a>
                </Link>
              </li>

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
            </>
          ) : (
            <li>
              <Link href="/login">
                <a className="log">Log in</a>
              </Link>
            </li>
          )}
        </ul>
      </header>
    </div>
  );
}

export default Header;

const headerStyles = css`
  img {
    margin-right: 2em;
    margin-left: auto;
    margin-top: 0.6em;
    float: right;
  }
  img:hover {
    cursor: pointer;
  }
  .header {
    background-color: ${colors.black};
    box-shadow: 1px 1px 4px 0 rgba(0, 0, 0, 0.1);
    position: fixed;
    width: 100%;
    z-index: 3;
  }

  .header ul {
    margin: 0;
    padding: 0;
    list-style: none;
    overflow: hidden;
    background-color: ${colors.black};
  }

  .header li a {
    display: block;
    padding: 20px 20px;

    font-size: 16px;
    text-decoration: none;
    color: ${colors.primary};
  }

  .header li a:hover {
    background: ${colors.primary};
    color: white;
  }

  .header .logo {
    display: block;
    float: left;
    font-size: 2em;
    padding: 10px 20px;
    text-decoration: none;
  }

  .header .menu {
    clear: both;
    max-height: 0;
    transition: max-height 0.2s ease-out;
  }
  .header .menu-icon {
    cursor: pointer;
    display: inline-block;
    float: right;
    padding: 28px 20px;
    position: relative;
    user-select: none;
  }

  .header .menu-icon .navicon {
    background: ${colors.primary};
    display: block;
    height: 2px;
    position: relative;
    transition: background 0.2s ease-out;
    width: 18px;
  }

  .header .menu-icon .navicon:before,
  .header .menu-icon .navicon:after {
    background: ${colors.primary};
    content: '';
    display: block;
    height: 100%;
    position: absolute;
    transition: all 0.2s ease-out;
    width: 100%;
  }

  .header .menu-icon .navicon:before {
    top: 5px;
  }

  .header .menu-icon .navicon:after {
    top: -5px;
  }
  .header .menu-btn {
    display: none;
  }

  .header .menu-btn:checked ~ .menu {
    max-height: 240px;
  }

  .header .menu-btn:checked ~ .menu-icon .navicon {
    background: transparent;
  }

  .header .menu-btn:checked ~ .menu-icon .navicon:before {
    transform: rotate(-45deg);
  }

  .header .menu-btn:checked ~ .menu-icon .navicon:after {
    transform: rotate(45deg);
  }

  .header .menu-btn:checked ~ .menu-icon:not(.steps) .navicon:before,
  .header .menu-btn:checked ~ .menu-icon:not(.steps) .navicon:after {
    top: 0;
  }

  img {
    border-radius: 50%;
    height: 40px;
  }

  @media (min-width: 48em) {
    .header li {
      float: left;
    }
    .header li a {
      padding: 20px 30px;
    }
    .header .menu {
      clear: none;
      float: left;
      max-height: none;
    }
    .header .menu-icon {
      display: none;
    }
  }
`;
