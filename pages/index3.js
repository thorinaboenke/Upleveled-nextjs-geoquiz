import { useState, useEffect } from 'react';
import Head from 'next/head';
import styles from '../styles/Home.module.css';

export default function Home() {
  const [displayQuestion, setDisplayQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [countries, setCountries] = useState(null);

  useEffect(async () => {
    setIsLoading(true);
    const countries = await getCountries();
    setQuestions(createQuestionArray(4, 4, countries));
    setIsLoading(false);
  }, []);

  const handleAnswerClick = (correct) => {
    const newQ = displayQuestion + 1;
    setDisplayQuestion(newQ);
    if (correct) {
      const newScore = score + 1;
      setScore(newScore);
    }
  };
  const handlePlayAgainClick = () => {
    setDisplayQuestion(0), setScore(0);
  };

  const questions3 = [
    {
      question: 'England',
      answerOptions: [
        { answer: 'London', isCorrect: true },
        { answer: 'Berlin', isCorrect: false },
        { answer: 'Moskau', isCorrect: false },
        { answer: 'Paris', isCorrect: false },
      ],
    },
    {
      question: 'France',
      answerOptions: [
        { answer: 'London', isCorrect: false },
        { answer: 'Berlin', isCorrect: false },
        { answer: 'Moskau', isCorrect: false },
        { answer: 'Paris', isCorrect: true },
      ],
    },
    {
      question: 'Germany',
      answerOptions: [
        { answer: 'London', isCorrect: false },
        { answer: 'Berlin', isCorrect: true },
        { answer: 'Moskau', isCorrect: false },
        { answer: 'Paris', isCorrect: false },
      ],
    },
  ];

  async function getCountries() {
    const data = await fetch('https://restcountries.eu/rest/v2/all');
    const countries = await data.json();
    // setCountries(countries);
    return countries;
  }

  function random(x) {
    // returns a random number between 0 and x-1
    return Math.floor(Math.random() * x);
  }

  function createUniqueRandomIndexArray(length) {
    const arr = [];
    while (arr.length < length) {
      const newRand = random(250);
      if (arr.indexOf(newRand) === -1) {
        arr.push(newRand);
      }
    }
    return arr;
  }

  async function createQuestionArray(
    numberOfQuestions,
    answerPossibilities,
    countries,
  ) {
    setIsLoading(true);
    const questionArray = [];
    // create new questions
    for (let i = 0; i < numberOfQuestions; i++) {
      const randomCountryIndices = createUniqueRandomIndexArray(
        answerPossibilities,
      );
      const sol = random(answerPossibilities);
      const indexOfSolution = randomCountryIndices[sol];
      const solutionCountry = countries[indexOfSolution].name;
      const newQuestion = {};
      newQuestion.question = solutionCountry;
      newQuestion.answerOptions = [];
      // create answerOptions for each quesiton
      for (let i = 0; i < randomCountryIndices.length; i++) {
        if (i === sol) {
          //for the correct answer
          newQuestion.answerOptions.push({
            answer: countries[randomCountryIndices[i]].capital,
            isCorrect: true,
          });
        } else {
          //for the wrong answers
          newQuestion.answerOptions.push({
            answer: countries[randomCountryIndices[i]].capital,
            isCorrect: false,
          });
        }
      }
      console.log(newQuestion);
      questionArray.push(newQuestion);
    }
    console.log(questionArray);
    setIsLoading(false);
    return questionArray;
  }

  console.log('questions', questions);
  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      <Head>
        <title>GeoQuiz</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>Your Score: {score}</div>

      <div>
        {questions.map((question, index) => {
          displayQuestion === index && (
            <div key={index}>
              <div>
                {' '}
                Question {index + 1} of {questions.length}{' '}
              </div>
              <div>{question.question}</div>
              <div>
                {question.answerOptions.map((option) => {
                  return (
                    <button onClick={() => handleAnswerClick(option.isCorrect)}>
                      {option.answer}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      {displayQuestion === questions.length && (
        <button
          onClick={() => {
            handlePlayAgainClick();
          }}
        >
          Play again?
        </button>
      )}
    </div>
  );
}
