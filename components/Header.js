import Link from 'next/link';
import React from 'react';
import { css } from '@emotion/core';
import { colors } from '../assets/colors';
import { useRouter } from 'next/router';

const headerStyles = css`
  img {
    position: absolute;
    right: 0;
    margin-right: 2em;
    margin-left: auto;
    margin-top: 0.6em;
    float: right;
    border-radius: 50%;
    height: 40px;
  }
  img:hover {
    cursor: pointer;
  }

  @media (max-width: 48em) {
    img {
      display: none;
    }
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

  @media (min-width: 48em) {
    .header li {
      float: left;
    }
    .header li a {
      padding: 20px 30px;
    }
    .header li .log {
      position: absolute;
      right: 80px;
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

function Header(props) {
  const loggedInPassed = typeof props.loggedIn !== 'undefined';
  const router = useRouter();
  const user = props.user;
  const avatar = props.avatar;

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
                data-cy="header-link-home"
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
              <a data-cy="header-link-stats">Stats</a>
            </Link>
          </li>
          <li>
            {' '}
            <Link href="/profile">
              <a data-cy="header-link-profile">Profile</a>
            </Link>
          </li>

          {!loggedInPassed ||
          router.pathname === '/login' ? null : props.loggedIn ? (
            <>
              <li>
                <Link href="/logout">
                  <a data-cy="header-link-logout" className="log">
                    Log out
                  </a>
                </Link>
              </li>

              <img
                src={
                  avatar
                    ? avatar
                    : user?.avatarUrl
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
                <a data-cy="header-link-login" className="log">
                  Log in
                </a>
              </Link>
            </li>
          )}
        </ul>
      </header>
    </div>
  );
}

export default Header;
