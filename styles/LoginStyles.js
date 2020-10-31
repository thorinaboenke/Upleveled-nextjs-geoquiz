import { css } from '@emotion/core';

export const loginStyles = css`
  .container {
    height: 100vh;
    display: flex;

    align-items: center;
    justify-content: flex-end;
    background-image: url('/loginbackground.jpg');
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;


  .title {
    align-self: center;
    font-size: 2em;
    margin-bottom: 0.5em;
  }
  input {
    padding-left: 1em;
    padding-right: 1em;
    display: block;
    width: 150px;
    margin-top: 0.5em;
    margin-bottom: 0.5em;
    border: none;
    height: 30px;
    border-radius: 15px;
    border: 1px solid #181e1e;
  }
  input:focus,
  button:focus {
    outline: 0;
    box-shadow: 0 0 3pt 2pt #7ea3b5;
    border-radius: 15px;
  }

  label {
    width: 150px;
    margin-top: 0.5em;
    margin-bottom: 0.5em;
    display: block;
    color: #181e1e;
  }
  form {
    background-color: white;
    opacity: 0.8;
    padding: 1em;

    margin-right: 25vw;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
  button {
    background: none;
    border: none;
    margin-top: 1.5em;
    margin-bottom: 0.5em;
    font-size: 15px;
    width: 150px;
    height: 30px;
    border: 2px solid #181e1e;
    border-radius: 15px;
  }
  button:hover {
    color: white;
    background-color:#181e1e;
    border: 2px solid #181e1e;
  }
  .instructions {
    margin-top: 0.5em;
  }
  .instructions a{

    color: #519BBF;
    display: block;
  }

  @media screen and (max-width: 400px) {
    input,
    button {
      width: 60vw;
    }

    form {
      width: 70vw;
      margin-right: auto;
      margin-left: auto;
    }
  }
`;
