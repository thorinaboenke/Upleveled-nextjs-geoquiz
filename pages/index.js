import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function Home() {
  const [displayQuestion, setDisplayQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [isRestarted, setIsRestarted] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    const fetchCountries = async () => {
      setIsLoading(true);
      const result = await fetch(
        'https://restcountries.eu/rest/v2/all?fields=name;capital;flag;region',
      );
      const allCountries = await result.json();
      console.log(
        allCountries.filter((country) => country.capital !== '').length,
      );
      setCountries(allCountries.filter((country) => country.capital !== ''));
      const questionSet = await createQuestionArray(
        5,
        4,
        allCountries.filter((country) => country.capital !== ''),
        cat.name,
        cat.capital,
      );
      setQuestions(questionSet);
      setIsLoading(false);
    };
    fetchCountries();
    console.log(countries);
  }, [isRestarted]);

  const cat = { flag: 'flag', name: 'name', capital: 'capital' };

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
    setIsRestarted(!isRestarted);
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

  function random(x) {
    // returns a random number between 0 and x-1
    return Math.floor(Math.random() * x);
  }

  function createUniqueRandomIndexArray(length) {
    const arr = [];
    while (arr.length < length) {
      const newRand = random(245);
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
    category1,
    category2,
  ) {
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
    return questionArray;
  }

  console.log('questions', questions);

  return (
    <div>
      <Head>
        <title>GeoQuiz</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {isLoading ? (
        <div>Is loading ... </div>
      ) : (
        <>
          <div>Your Score: {score}</div>
          {/* <button
            onClick={() => {
              setIsRestarted(!isRestarted);
              }}
          >
            Play
          </button> */}
          <div>
            {questions.map((q, index) => {
              return (
                displayQuestion === index && (
                  <div key={q.question}>
                    <div>
                      Question {index + 1} of {questions.length}{' '}
                    </div>
                    <div>{q.question}</div>
                    <div>
                      {q.answerOptions.map((option) => {
                        return (
                          <button
                            onClick={() => handleAnswerClick(option.isCorrect)}
                          >
                            {option.answer}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )
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
        </>
      )}
    </div>
  );
}
