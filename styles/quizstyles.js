import { css } from '@emotion/core';
import { colors } from '../assets/colors';

export const quizStyles = css`
  button {
    cursor: pointer;
    font-family: monospace;
    font-size: 16px;
    border-radius: 20px;
    text-align: center;
    padding: 0.5em;
    color: white;
    background-color: ${colors.primary};
    border: 3px solid ${colors.primary};
    margin: 1em;
  }
  button:hover {
    background-color: ${colors.primaryLight};
    border: 3px solid ${colors.primaryLight};
  }

  @media (hover: none) {
  button:hover {
    background-color: ${colors.primary} !important;
    border: 3px solid ${colors.primary} !important
  }
}
label {
  cursor:pointer;
}
  input {
    opacity: 0;

  }

  input + img {
    width: 100px;
    height:100px;
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
    box-shadow: 0 0 3pt 2pt ${colors.primary};
  }
  input:focus + img {
    box-shadow: 0 0 3pt 2pt;
  }
  input:checked + img {
    box-shadow: 0 0 3pt 2pt ${colors.black};
  }

  input + div {
    width: 100px;
    border-radius: 20px;
    text-align: center;
    padding: 0.5em;
    color: ${colors.black};
    border: 3px solid ${colors.black};
    margin-right: 1em;
    margin-left: 1em;
    position: relative;
  }
  input:hover + div {
    box-shadow: 0 0 3pt 2pt ${colors.primary};
  }

  input:focus + div {
    box-shadow: 0 0 3pt 2pt ${colors.primary};
  }
  input:checked + div {
    color: white;
    background-color: ${colors.black};
    border: 3px solid ${colors.black};
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
    margin-top:50px;
    padding-bottom: 1em;
    display:flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

  }
  .outer-wrapper>button, .start {
   min-width: 30%;
   @media (max-width: 450px) {
    min-width: 50%;
    }


  }
  .instructions {
    text-align:center;
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
    border-bottom: 3px solid ${colors.black};
    position: relative;

  }

  .difficulty-option-container{
    display: flex;
  }
  a {
    color: #519bbf;
  }
  .quizSection {
    display: flex;
    flex-direction: column;
    align-items: center;
    animation: fadein 500ms;
  }
  @keyframes fadein {
    from { opacity: 0; }
    to   { opacity: 1; }
}
@keyframes fadeout {
    from { opacity: 1; }
    to   { opacity: 0; }
}
  .cancel{
    margin:0;
    padding:0.5em;
    border-radius: 15px;;
    margin-right:5px;
    margin-top:5px;
    margin-left: auto;
    margin-bottom: auto;

  }
  .count {
    border-bottom: 2px solid ${colors.black};
    width: 300px;
    max-width: 40vw;
    padding: 0.5em;
    margin-left: 1em;
  }
  .time-count{
    margin-top: 1em;
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
    box-shadow: 0 0 3pt 2pt ${colors.black};
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
    border-bottom: 3px solid ${colors.primary};
    transition: all 15000ms linear;
    padding: 0.5em;
    animation: fadein 1s;
    @media (min-width: 600px) {
      font-size: 3em;
    }
  }
  @keyframes countdown {
  from {width: 0%;}
  to {width: 100%;}
}


}

  .answer-container,
  .flag-container {
    display: flex;
    margin-top: 2em;
    margin-bottom: 2em;
    flex-wrap: wrap;
    justify-content: center;
    align-items: flex-end;
    animation: fadein 1s;
  }
  .answer-container button {
    border-radius: 0;
    border-radius: 15px;
    min-height: 60px;
    min-width: 140px;
    width: 40%;
    margin: 0.5em;

  }
  .answer-container .true {
    box-shadow: 0 0 3pt 2pt ${colors.correct};

  }
  .answer-container .false  {
    box-shadow: 0 0 3pt 2pt ${colors.incorrect};
    /* background-color:${colors.incorrect};
    border-color: ${colors.incorrect} */
    animation: swiggle 200ms;

  }
  .flag-container .true {
    background-color: ${colors.correct};
}
.flag-container .true:hover {
  box-shadow: 0 0 3pt 2pt ${colors.black};
}
  .flag-container .false {
    background-color: ${colors.incorrect};
    animation: swiggle 200ms;
  }
  .flag-container .false:hover {
    box-shadow: 0 0 3pt 2pt ${colors.black};

  }


  @keyframes swiggle
  {
  0% {transform: translate(0,0)}
  15% {transform: translate(0.5rem, 0)}
  35% {transform: translate(-0.5rem,0)}
  55% {transform: translate(0.5rem, 0)}
  80% {transform: translate(-0.5rem, 0)}
  100% {transform: translate(0,0)}
}


  .flag-container button {
    height: 200px;
    max-width: 40%;
    background: ${colors.lightgray};
    border: none;
    padding: none;
    border-radius: 0;
    margin: 0.5em;
    box-shadow: 0 0 3pt 2pt ${colors.black};
  }
  .flag-container button:hover {
    box-shadow: 0 0 3pt 2pt ${colors.primary};
  }



  @media (max-width: 420px) {
    .flag-container button {
      height: 100px;
    }
`;
