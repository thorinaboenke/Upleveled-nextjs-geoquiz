/** @jsxRuntime classic */
/** @jsxFrag React.Fragment */
// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import { jsx, css } from '@emotion/core';
import Head from 'next/head';
import { createQuestionArray } from '../assets/functions';
import styles from '../styles/Home.module.css';

const optionStyles = css`
  div {
    background-color: blue;
    font-size: 50px;
  }
  button {
    background-color: blue;
  }
  .option-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .option-container {
  }

  .option-heading {
    font-size: 100px;
  }
`;

export default function Home() {
  const [displayQuestion, setDisplayQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [isRestarted, setIsRestarted] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isQuizRunning, setIsQuizRunning] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [countries, setCountries] = useState([]);
  // maybe sum this in one state for QuizSettings?
  // const [quizSettings, setQuizSettings] = useState({regions:[], numberOfQuestions:5, numberOfPossibleAnswers:4, categoryQuestion: cat.name, categoryAnswer:cat.capital})
  const cat = { flag: 'flag', name: 'name', capital: 'capital' };
  const difficulties = { normal: 4, pro: 6 };

  const [region, setRegion] = useState('World');
  const [numberOfQuestions, setNumberOfQuestions] = useState(5);
  const [numberOfPossibleAnswers, setNumberOfPossibleAnswers] = useState(4);

  const [categoryQuestion, setCategoryQuestion] = useState(cat.name);
  const [categoryAnswer, setCategoryAnswer] = useState(cat.flag);

  useEffect(() => {
    const fetchCountries = async () => {
      setIsLoading(true);
      const result = await fetch(
        'https://restcountries.eu/rest/v2/all?fields=name;capital;flag;region',
      );
      const allCountries = await result.json();
      const filteredCountries = allCountries.filter(
        (country) => country.capital !== '' && country.flag !== '',
      );
      setCountries(filteredCountries);
      // const questionSet = createQuestionArray(
      //   numberOfQuestions,
      //   numberOfPossibleAnswers,
      //   allCountries.filter((country) => country.capital !== ''),
      //   categoryQuestion,
      //   categoryAnswer,
      //   region,
      // );
      // setQuestions(questionSet);
      setIsLoading(false);
    };
    fetchCountries();
  }, [
    isRestarted,
    region,
    numberOfPossibleAnswers,
    categoryQuestion,
    categoryAnswer,
    numberOfQuestions,
  ]);

  const handleAnswerClick = (correct) => {
    const newQ = displayQuestion + 1;
    setDisplayQuestion(newQ);
    if (correct) {
      const newScore = score + 1;
      setScore(newScore);
    }
  };
  const handlePlayAgainClick = () => {
    const questionSet = createQuestionArray(
      numberOfQuestions,
      numberOfPossibleAnswers,
      countries.filter((country) => country.capital !== ''),
      categoryQuestion,
      categoryAnswer,
      region,
    );
    setQuestions(questionSet);
    setDisplayQuestion(0);
    setScore(0);
    setIsRestarted(!isRestarted);
  };

  const handleQuizStart = (e) => {
    const questionSet = createQuestionArray(
      numberOfQuestions,
      numberOfPossibleAnswers,
      countries.filter((country) => country.capital !== ''),
      categoryQuestion,
      categoryAnswer,
      region,
    );
    setQuestions(questionSet);
    setIsQuizRunning(true);
  };
  console.log('I rendered');
  console.log(region);
  console.log(categoryQuestion);
  console.log(categoryAnswer);
  console.log(numberOfPossibleAnswers);
  console.log(questions);
  return (
    <div css={optionStyles}>
      <Head>
        <title>GeoQuiz</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="main">
        {isLoading ? (
          <div>Is loading ... </div>
        ) : (
          <>
            <div className="option-wrapper">
              <div className="option-container-regions">
                <label htmlFor="World">
                  <input
                    type="radio"
                    name="region"
                    id="World"
                    value="World"
                    onChange={(e) => setRegion(e.currentTarget.value)}
                    checked={'World' === region}
                  />
                  <img src="./earth-globe.png" alt="" />
                </label>
                <label htmlFor="Africa">
                  <input
                    type="radio"
                    name="region"
                    id="Africa"
                    value="Africa"
                    onChange={(e) => setRegion(e.currentTarget.value)}
                    checked={'Africa' === region}
                  />
                  <img src="./africa.png" alt="" />
                </label>
                <label htmlFor="Europe">
                  <input
                    type="radio"
                    name="region"
                    id="Europe"
                    value="Europe"
                    onChange={(e) => setRegion(e.currentTarget.value)}
                    checked={'Europe' === region}
                  />
                  <img src="./europe.png" alt="" />
                </label>
                <label htmlFor="Americas">
                  <input
                    type="radio"
                    name="region"
                    id="Americas"
                    value="Americas"
                    onChange={(e) => setRegion(e.currentTarget.value)}
                    checked={'Americas' === region}
                  />
                  <img src="./america.png" alt="" />
                </label>
                <label htmlFor="Asia">
                  <input
                    type="radio"
                    name="region"
                    id="Asia"
                    value="Asia"
                    onChange={(e) => setRegion(e.currentTarget.value)}
                    checked={'Asia' === region}
                  />
                  <img src="./asia.png" alt="" />
                </label>
                <label htmlFor="Oceania">
                  <input
                    type="radio"
                    name="region"
                    id="Oceania"
                    value="Oceania"
                    onChange={(e) => setRegion(e.currentTarget.value)}
                    checked={'Oceania' === region}
                  />
                  <img src="./australia.png" alt="" />
                </label>
              </div>

              <div>
                <div className="option-container-qa">
                  <div className="option-container">
                    <div className="heading-container ">
                      <div className="option-heading">Question</div>
                    </div>
                    <label htmlFor="name1">
                      <input
                        type="radio"
                        name="question"
                        id="name1"
                        value={cat.name}
                        onChange={(e) =>
                          setCategoryQuestion(e.currentTarget.value)
                        }
                        checked={cat.name === categoryQuestion}
                        disabled={cat.name === categoryAnswer}
                      />
                      <div>name</div>
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="question"
                        id="capital1"
                        value={cat.capital}
                        onChange={(e) =>
                          setCategoryQuestion(e.currentTarget.value)
                        }
                        checked={cat.capital === categoryQuestion}
                        disabled={cat.capital === categoryAnswer}
                      />
                      <div>capital</div>
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="question"
                        id="flag1"
                        value={cat.flag}
                        onChange={(e) =>
                          setCategoryQuestion(e.currentTarget.value)
                        }
                        checked={cat.flag === categoryQuestion}
                        disabled={cat.flag === categoryAnswer}
                      />
                      <div>flag</div>
                    </label>
                  </div>
                  <div className="option-container">
                    <div className="heading-container ">
                      <div className={'option-heading'}>Answer</div>
                    </div>
                    <label>
                      <input
                        type="radio"
                        name="Answer"
                        id="name2"
                        value={cat.name}
                        onChange={(e) =>
                          setCategoryAnswer(e.currentTarget.value)
                        }
                        checked={cat.name === categoryAnswer}
                        disabled={cat.name === categoryQuestion}
                      />
                      <div>name</div>
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="Answer"
                        id="capital2"
                        value={cat.capital}
                        onChange={(e) =>
                          setCategoryAnswer(e.currentTarget.value)
                        }
                        checked={cat.capital === categoryAnswer}
                        disabled={cat.capital === categoryQuestion}
                      />
                      <div>capital</div>
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="Answer"
                        id="flag"
                        value={cat.flag}
                        onChange={(e) =>
                          setCategoryAnswer(e.currentTarget.value)
                        }
                        checked={cat.flag === categoryAnswer}
                        disabled={cat.flag === categoryQuestion}
                      />
                      <div>flag</div>
                    </label>
                  </div>
                </div>
              </div>
              <div className="option-container">
                <div className="heading-container ">
                  <div className="option-heading">Difficulty</div>
                </div>
                <div className="difficulty-container">
                  <label>
                    <input
                      type="radio"
                      name="difficulty"
                      id="normal"
                      value={4}
                      onChange={(e) =>
                        setNumberOfPossibleAnswers(e.currentTarget.value)
                      }
                      checked={numberOfPossibleAnswers === 4}
                    />
                    <div>Normal</div>
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="difficulty"
                      id="pro"
                      value={6}
                      onChange={(e) =>
                        setNumberOfPossibleAnswers(e.currentTarget.value)
                      }
                      checked={numberOfPossibleAnswers === 6}
                    />
                    <div>Pro</div>
                  </label>
                </div>
              </div>
            </div>
            <div className="start-container">
              <button classname="start" onClick={(e) => handleQuizStart(e)}>
                Start Quiz
              </button>
            </div>

            {isQuizRunning ? (
              <>
                <div className="score">Score: {score}</div>

                <div>
                  {questions.map((q, index) => {
                    return (
                      displayQuestion === index && (
                        <div key={q.question}>
                          <div className="questionCount">
                            Question {index + 1}/ {questions.length}{' '}
                          </div>
                          <div
                            className={
                              categoryQuestion === 'flag'
                                ? 'flag-container'
                                : 'question-container'
                            }
                          >
                            {categoryQuestion === 'flag' && (
                              <img className="flag" alt="" src={q.question} />
                            )}
                            {categoryQuestion !== 'flag' && (
                              <div>{q.question}</div>
                            )}
                          </div>
                          <div
                            className={
                              categoryAnswer === 'flag'
                                ? 'flag-container'
                                : 'answer-container'
                            }
                          >
                            {q.answerOptions.map((option) => {
                              return (
                                <button
                                  onClick={() =>
                                    handleAnswerClick(option.isCorrect)
                                  }
                                >
                                  {categoryAnswer === cat.flag ? (
                                    <img
                                      className="flag"
                                      alt=""
                                      src={option.answer}
                                    />
                                  ) : (
                                    <div>{option.answer}</div>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )
                    );
                  })}
                </div>
              </>
            ) : null}
            {displayQuestion === 5 ? (
              <div className="playagain-container">
                <button
                  onClick={() => {
                    handlePlayAgainClick();
                  }}
                >
                  Play again?
                </button>
              </div>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}
