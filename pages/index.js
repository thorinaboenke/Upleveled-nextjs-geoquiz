import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { createQuestionArray, updateScoresRequest } from '../assets/functions';
import Layout from '../components/Layout';
import { quizStyles } from '../styles/quizstyles.js';
import nextCookies from 'next-cookies';
import { isSessionTokenValid } from '../util/auth';
import Link from 'next/link';
import Results from '../components/Results';
import { getUserBySessionToken } from '../util/database';
import AnswerButton from '../components/Answer';
import Bar from '../components/Bar';
import Confetti from 'react-dom-confetti';

export default function Home(props) {
  const [displayQuestion, setDisplayQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [countdown, setCountdown] = useState(10);
  const [totalTime, setTotalTime] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isQuizRunning, setIsQuizRunning] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [countries, setCountries] = useState([]);
  // maybe sum this in one state for QuizSettings?
  // const [quizSettings, setQuizSettings] = useState({regions:[], numberOfQuestions:5, numberOfPossibleAnswers:4, categoryQuestion: cat.name, categoryAnswer:cat.capital})
  const cat = { flag: 'flag', name: 'name', capital: 'capital' };
  const [region, setRegion] = useState('World');
  const [numberOfQuestions, setNumberOfQuestions] = useState(5);
  const [numberOfPossibleAnswers, setNumberOfPossibleAnswers] = useState(4);
  const [categoryQuestion, setCategoryQuestion] = useState(cat.name);
  const [categoryAnswer, setCategoryAnswer] = useState(cat.capital);
  const [answers, setAnswers] = useState([]);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const [showOnlyCorrectAnswer, setShowOnlyCorrectAnswer] = useState(false);
  const [allCorrect, setAllCorrect] = useState(false);

  const questionToFocus = useRef(null);

  const config = {
    angle: 90,
    spread: 90,
    startVelocity: 33,
    elementCount: 120,
    dragFriction: 0.15,
    duration: 4000,
    stagger: 3,
    width: '12px',
    height: '12px',
    perspective: '560px',
    colors: ['#a864fd', '#29cdff', '#78ff44', '#ff718d', '#fdff6a'],
  };

  useEffect(() => {
    if (
      !showCorrectAnswer &&
      !showOnlyCorrectAnswer &&
      isQuizRunning &&
      displayQuestion < questions.length
    ) {
      const interval = setInterval(() => {
        if (countdown < 1) {
          const newQ = displayQuestion + 1;
          setDisplayQuestion(newQ);
          setAnswers([...answers, '-']);
          const newTotal = totalTime + 10;
          setTotalTime(newTotal);
          setCountdown(10);
          if (displayQuestion < questions.length && isQuizRunning === true) {
            questionToFocus?.current?.focus();
          }
        } else {
          setCountdown((countdown) => countdown - 1);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [
    setCountdown,
    displayQuestion,
    isQuizRunning,
    questions.length,
    countdown,
    totalTime,
    answers,
    showCorrectAnswer,
    showOnlyCorrectAnswer,
  ]);

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
      setIsLoading(false);
    };
    fetchCountries();
  }, []);

  useEffect(() => {
    if (displayQuestion === questions.length && props.loggedIn) {
      updateScoresRequest(
        props.user?.userId,
        questions.length,
        score,
        categoryAnswer,
        region,
        props.token,
      );
    }
    if (displayQuestion === questions.length && score === questions.length)
      setAllCorrect(true);
  }, [
    displayQuestion,
    questions.length,
    props.loggedIn,
    props.user?.userId,
    score,
    categoryAnswer,
    region,
    props.token,
  ]);

  const handleAnswerClick = (correct, answerArray, answer) => {
    const newTotal = totalTime + (10 - countdown);
    setTotalTime(newTotal);
    const newAnswerArray = [...answerArray, answer];
    setAnswers(newAnswerArray);
    //here one second delay for visual feedback to occur
    if (correct) {
      const newScore = score + 1;
      setScore(newScore);
      setShowOnlyCorrectAnswer(true);
    }
    if (!correct) {
      setShowCorrectAnswer(true);
    }
    function delayedReset() {
      setShowCorrectAnswer(false);
      setShowOnlyCorrectAnswer(false);
      setCountdown(10);
      const newQ = displayQuestion + 1;
      setDisplayQuestion(newQ);
    }
    setTimeout(delayedReset, 1500);
  };

  function makeNewQuestionSet() {
    const questionSet = createQuestionArray(
      numberOfQuestions,
      numberOfPossibleAnswers,
      countries.filter((country) => country.capital !== ''),
      categoryQuestion,
      categoryAnswer,
      region,
    );
    return questionSet;
  }

  const resetGame = () => {
    setAllCorrect(false);
    setTotalTime(0);
    setDisplayQuestion(0);
    setScore(0);
    setCountdown(10);
    setAnswers([]);
  };

  const startQuiz = () => {
    setQuestions(makeNewQuestionSet());
    resetGame();
    setIsQuizRunning(true);
  };

  return (
    <div css={quizStyles}>
      <Layout loggedIn={props.loggedIn} user={props.user}>
        <Head>
          <title>GeoQuiz</title>
          <link rel="icon" href="/favicon.ico" />
          <meta
            name="description"
            content="Geography Quiz that lets you guess Countries, Capitals and Flags"
          />
        </Head>
        <div className="outer-wrapper">
          {isLoading ? (
            <div></div>
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
                    <label htmlFor="africa">
                      <input
                        type="radio"
                        name="region"
                        id="africa"
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
                        <div>Name</div>
                      </label>
                      {props.loggedIn && (
                        <>
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
                              disabled={
                                cat.capital === categoryAnswer ||
                                !props.loggedIn
                              }
                            />
                            <div>Capital</div>
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
                              disabled={
                                cat.flag === categoryAnswer || !props.loggedIn
                              }
                            />
                            <div>Flag</div>
                          </label>
                        </>
                      )}
                    </div>
                    <div className="answer">
                      <div className="heading">
                        <div>Answer</div>
                      </div>
                      {props.loggedIn && (
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
                            disabled={
                              cat.name === categoryQuestion || !props.loggedIn
                            }
                          />
                          <div>Name</div>
                        </label>
                      )}
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
                        <div>Capital</div>
                      </label>
                      {props.loggedIn && (
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
                            disabled={
                              cat.flag === categoryQuestion || !props.loggedIn
                            }
                          />
                          <div>Flag</div>
                        </label>
                      )}
                    </div>
                  </div>

                  <div className="section difficulty">
                    <div className="heading">
                      <div>Difficulty</div>
                    </div>
                    <div className="difficulty-option-container">
                      <label>
                        <input
                          type="radio"
                          name="difficulty"
                          id="normal"
                          value={4}
                          onChange={(e) =>
                            setNumberOfPossibleAnswers(e.currentTarget.value)
                          }
                          checked={numberOfPossibleAnswers == 4}
                        />
                        <div>Normal</div>
                      </label>
                      {props.loggedIn && (
                        <label>
                          <input
                            type="radio"
                            name="difficulty"
                            id="pro"
                            value={6}
                            onChange={(e) =>
                              setNumberOfPossibleAnswers(e.currentTarget.value)
                            }
                            checked={numberOfPossibleAnswers == 6}
                            disabled={!props.loggedIn}
                          />
                          <div>Pro</div>
                        </label>
                      )}
                    </div>
                  </div>

                  <button onClick={(e) => startQuiz(e)} className="start">
                    Start Quiz
                  </button>
                  {!props.loggedIn && (
                    <div className="instructions">
                      <Link href="/signup">
                        <a>Create a free account </a>
                      </Link>
                      to play more categories and see your statistics
                    </div>
                  )}
                </div>
              )}
              {isQuizRunning ? (
                <div className="quizSection">
                  {isQuizRunning === true &&
                    displayQuestion !== questions.length && (
                      <button
                        className="cancel"
                        onClick={() => {
                          setIsQuizRunning(false);
                          setScore(0);
                          setDisplayQuestion(0);
                        }}
                      >
                        Cancel
                      </button>
                    )}
                  {questions.map((q, index) => {
                    return (
                      displayQuestion === index &&
                      isQuizRunning === true && (
                        <div key={q.question}>
                          <div className="count time-count">{countdown}</div>
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
                            ref={questionToFocus}
                            tabindex="0"
                          >
                            {categoryQuestion === 'flag' && (
                              <img
                                className="flag"
                                alt=""
                                src={q.question}
                                chrome
                              />
                            )}
                            {categoryQuestion !== 'flag' && (
                              <div>{q.question}</div>
                            )}
                          </div>
                          <Bar width={(10 - countdown) * 10} />
                          <div
                            className={
                              categoryAnswer === 'flag'
                                ? 'flag-container'
                                : 'answer-container'
                            }
                          >
                            {q.answerOptions.map((option) => {
                              return (
                                <AnswerButton
                                  categoryAnswer={categoryAnswer}
                                  showCorrectAnswer={showCorrectAnswer}
                                  showOnlyCorrectAnswer={showOnlyCorrectAnswer}
                                  handleAnswerClick={handleAnswerClick}
                                  option={option}
                                  answers={answers}
                                />
                              );
                            })}
                          </div>
                        </div>
                      )
                    );
                  })}
                </div>
              ) : null}
              {displayQuestion === questions.length && isQuizRunning ? (
                <>
                  <div className="count time-count">Time: {totalTime}s</div>
                  <div className="count score-count">Score: {score}</div>
                  <Confetti active={allCorrect} config={config} />
                  <Results
                    questions={questions}
                    answers={answers}
                    categoryAnswer={categoryAnswer}
                    categoryQuestion={categoryQuestion}
                  />

                  <button
                    onClick={() => {
                      setIsQuizRunning(false);
                      setDisplayQuestion(0);
                    }}
                  >
                    Menu
                  </button>
                  <button
                    className=""
                    onClick={() => {
                      startQuiz();
                    }}
                  >
                    Play again
                  </button>
                </>
              ) : null}
            </>
          )}
        </div>
      </Layout>
    </div>
  );
}

export async function getServerSideProps(context) {
  let { session: token } = nextCookies(context) || null;
  const loggedIn = await isSessionTokenValid(token);
  const user = (await getUserBySessionToken(token)) || null;
  console.log(user);
  if (typeof token === 'undefined') {
    token = null;
  }
  return { props: { loggedIn: loggedIn, user: user, token: token } };
}
