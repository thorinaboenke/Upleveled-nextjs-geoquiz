import { css, Global, keyframes } from '@emotion/core';
import styled from '@emotion/styled';

export const globalStyles = (
  <Global
    styles={css`
      html,
      body {
        margin: 0;
        font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
          Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
        font-size: 14px;
      }
      #content {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
      }
      main {
        flex-grow: 1;
      }
      footer: {
        margin-top: auto;
      }

      a {
        color: inherit;
        text-decoration: none;
      }

      button {
        cursor: pointer;
      }

      * {
        box-sizing: border-box;
      }
    `}
  />
);

export const basicStyles = css`
  transition: all 0.1s linear;
`;

export const hoverStyles = css`
  &:hover {
  }
`;

export const bounce = keyframes`
  from {
    transform: scale(1.01);
  }
  to {
    transform: scale(0.99);
  }
`;
