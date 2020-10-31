import { css } from '@emotion/core';

export const quizStyles = css`
  button {
    cursor: pointer;
    font-size: 16px;
    border-radius: 20px;
    text-align: center;
    padding: 0.5em;
    color: white;
    background-color: #7ea3b5;
    border: 3px solid #7ea3b5;
    margin: 2em;
  }
  button:hover {
    background-color: #519bbf;
    border: 3px solid #519bbf;
  }

  input {
    opacity: 0;
  }

  input + img {
    width: 100px;
    border-radius: 15px;
    padding: 0.5em;
    margin-top: 0.5em;
    margin-bottom: 0.5em;
    margin-left: 0.5em;
    @media (max-width: 420px) {
      width: 23vw;
    }
  }

  input:hover + img {
    box-shadow: 0 0 3pt 2pt #7ea3b5;
  }
  input:focus + img {
    box-shadow: 0 0 3pt 2pt;
  }
  input:checked + img {
    box-shadow: 0 0 3pt 2pt #181e1e;
  }

  input + div {
    width: 100px;
    border-radius: 20px;
    text-align: center;
    padding: 0.5em;
    color: #181e1e;
    border: 3px solid #181e1e;
    margin-right: 1em;
    margin-left: 1em;
  }
  input:hover + div {
    box-shadow: 0 0 3pt 2pt #7ea3b5;
  }

  input:focus + div {
    box-shadow: 0 0 3pt 2pt #7ea3b5;
  }
  input:checked + div {
    color: white;
    background-color: #181e1e;
    border: 3px solid #181e1e;
    box-shadow: none;
  }
  input:disabled + div {
    color: gray;
    border: 3px solid gray;
    box-shadow: none;
  }

  .outer-wrapper {
    max-width: 800px;
    min-height: 80vh;
    margin-left: auto;
    margin-right: auto;
    padding-bottom: 1em;
    display:flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

  }
  .outer-wrapper>button, .start {
   min-width: 50%;


  }
  .options {
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 1000px;
    align-self: center;
  }
  .section {
    margin-top: 1em;
  }
  .section.region {
    align-self: flex-start;
  }
  .section.qa {
    align-self: flex-end;
    display: flex;
  }
  .section.difficulty {
    align-self: flex-start;
  }

  .question,
  .answer {
  }
  .section .heading {
    padding: 0.5em;
    border-bottom: 3px solid #181e1e;
    position: relative;

  }

  a {
    color: #519bbf;
  }
  .quizSection {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .cancel{
    margin:0;
    padding:0.5em;
    border-radius: 15px;;
    margin-right:5px;
    margin-top:5px;
    margin-left: auto;

  }
  .count {
    border-bottom: 2px solid #181e1e;
    width: 300px;
    max-width: 50vw;
    padding: 0.5em;
  }
  .quizSection img {
    width: 300px;
    max-width: 100%;
    max-height: 100%;

  }
  .question-flag-container{
    margin-top: 2em;
    margin-bottom:2em;
    display: flex;
    justify-content: center;
    padding: 0.5em;
    box-shadow: 0 0 3pt 2pt #181e1e;
    height: 200px;
    width: 300px;
    margin-left:auto;
    margin-right:auto;
  }
  .question-container{
    position:relative;
    font-size: 2em;
    margin-top: 1em;
    margin-bottom:1em;
    display: flex;
    justify-content: center;
    border-bottom: 3px solid #7ea3b5;
    transition: all 15000ms linear;
    padding: 0.5em;
    @media (min-width: 600px) {
      font-size: 3em;
    }
  }
  @keyframes countdown {
  from {width: 0%;}
  to {width: 100%;}
}
  .question-container::before {
    content: ' ';
    transition: all 15000ms linear;
    display: block;
    position: absolute;
    left: 0;
    bottom: 0;
    width: 0%;
    height: 0.2em;
    background-color: #B62121;
    animation-name: countdown;
    animation-duration:10s;
    animation-timing-function: linear;



  }

}
  .question-container::before{
    width: 100%
  }

  .answer-container,
  .flag-container {
    display: flex;
    margin-top: 2em;
    margin-bottom: 2em;
    flex-wrap: wrap;
    justify-content: center;
    align-items: flex-end;
  }
  .answer-container button {
    border-radius: 0;
    border-radius: 15px;
    min-height: 60px;
    min-width: 140px;
    width: 40%;
    margin: 0.5em;

  }
  .flag-container button {
    height: 200px;
    max-width: 40%;
    background: #F1F3F3;
    border: none;
    padding: none;
    border-radius: 0;
    margin: 0.5em;
    box-shadow: 0 0 3pt 2pt #181e1e;
  }
  .flag-container button:hover {
    box-shadow: 0 0 3pt 2pt #7ea3b5;
  }

  @media (max-width: 420px) {
    .flag-container button {
      height: 100px;
    }
`;
