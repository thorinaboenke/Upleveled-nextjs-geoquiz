import { css } from '@emotion/core';
import React from 'react';
import { colors } from '../assets/colors';

const statStyles = css`
  .results-container {
    min-width: 80%;
    /* max-width: 900px;
    min-width: 90vw; */
    display: flex;
    flex-direction: column;
    align-self: stretch;
  }
  .col-names {
    font-weight: bold;
  }

  .results-entry {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    align-items: center;
    min-width: 100%;
    border-bottom: 1px solid ${colors.black};
    padding: 0.3em;
  }

  .correct {
    color: ${colors.correct};
  }

  .incorrect {
    color: ${colors.incorrect};
  }
  .results-entry:nth-child(1) {
    grid-column: 1;
  }
  .results-entry:nth-child(2) {
    grid-column: 2;
  }
  .results-entry:nth-child(3) {
    grid-column: 3;
  }
  .image-container {
    padding: 1em;
  }
  img {
    height: 80%;
    width: 80%;
    box-shadow: 0 0 5pt 5pt ${colors.lightgray};
  }

  img.correct {
    box-shadow: 0 0 5pt 5pt ${colors.correct};
  }
  img.incorrect {
    box-shadow: 0 0 5pt 5pt ${colors.incorrect};
  }
`;
function Results({ questions, answers, categoryAnswer, categoryQuestion }) {
  return (
    <div css={statStyles}>
      <div className="results-container">
        <div className="results-entry col-names">
          <div>Question</div>
          <div>Your Answer</div>
          <div>Correct Answer</div>
        </div>
        {answers.map((answer, index) => {
          return (
            <div key={answer} className="results-entry">
              {categoryQuestion !== 'flag' ? (
                <div>{questions[index].question}</div>
              ) : (
                <div className="image-container">
                  <img src={questions[index].question} alt="" />
                </div>
              )}
              {categoryAnswer !== 'flag' || answer === '-' ? (
                <div
                  className={
                    answer ===
                    questions[index].answerOptions.find(
                      (option) => option.isCorrect === true,
                    ).answer
                      ? 'correct'
                      : 'incorrect'
                  }
                >
                  {answer}
                </div>
              ) : (
                <div className="image-container">
                  <img
                    src={answer}
                    alt=""
                    className={
                      answer ===
                      questions[index].answerOptions.find(
                        (option) => option.isCorrect === true,
                      ).answer
                        ? 'correct'
                        : 'incorrect'
                    }
                  />
                </div>
              )}
              {categoryAnswer !== 'flag' ? (
                <div>
                  {
                    questions[index].answerOptions.find(
                      (option) => option.isCorrect === true,
                    ).answer
                  }
                </div>
              ) : (
                <div className="image-container">
                  <img
                    src={
                      questions[index].answerOptions.find(
                        (option) => option.isCorrect === true,
                      ).answer
                    }
                    alt=""
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Results;
