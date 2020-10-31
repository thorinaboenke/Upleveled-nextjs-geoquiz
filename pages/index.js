import React, { useState, useEffect } from 'react';
import { css } from '@emotion/core';
import Head from 'next/head';
import { createQuestionArray } from '../assets/functions';
import Layout from '../components/Layout';
import { quizStyles } from '../styles/QuizStyles.js';
import nextCookies from 'next-cookies';
import { isSessionTokenValid } from '../util/auth';
import Link from 'next/link';

export default function Home(props) {
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
    <div css={quizStyles}>
      <Layout loggedIn={props.loggedIn}>
        <Head>
          <title>GeoQuiz</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div className="outer-wrapper">
          {isLoading ? (
            <div>Loading...</div>
          ) : (
            <>
              {' '}
              {!isQuizRunning && (
                <div className="options">
                  <div className="section region">
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

                  <div className="section qa">
                    <div className="question">
                      <div>
                        <div className="heading">Question</div>
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
                    <div className="answer">
                      <div className="heading">
                        <div>Answer</div>
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

                  <div className="section difficulty">
                    <div className="heading">
                      <div>Difficulty</div>
                    </div>
                    <div>
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

                  <button onClick={(e) => handleQuizStart(e)}>
                    Start Quiz
                  </button>
                  <div>
                    <Link href="/signup">
                      <a>Create a free account </a>
                    </Link>
                    to play more categories and see your statistics
                  </div>
                </div>
              )}
              {isQuizRunning ? (
                <div className="quizSection">
                  {questions.map((q, index) => {
                    return (
                      displayQuestion === index && (
                        <div key={q.question}>
                          <div className="count score-count">
                            Score: {score}
                          </div>
                          <div className="count question-count">
                            Question {index + 1}/ {questions.length}{' '}
                          </div>
                          <div
                            className={
                              categoryQuestion === 'flag'
                                ? 'question-flag-container'
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
              ) : null}
              {displayQuestion === questions.length ? (
                <div>
                  <button
                    onClick={() => {
                      handlePlayAgainClick();
                    }}
                  >
                    Play again?
                  </button>
                  <button
                    onClick={() => {
                      setIsQuizRunning(false);
                    }}
                  >
                    Menu
                  </button>
                </div>
              ) : null}
            </>
          )}
        </div>
      </Layout>
    </div>
  );
}

export async function getServerSideProps(context) {
  const { session: token } = nextCookies(context);
  const loggedIn = await isSessionTokenValid(token);
  return { props: { loggedIn } };
}
