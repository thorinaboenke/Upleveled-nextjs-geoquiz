import { useState, useEffect } from 'react';
import Head from 'next/head';

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
  const [region, setRegion] = useState('Americas');
  const [numberOfQuestions, setNumberOfQuestions] = useState(5);
  const [numberOfPossibleAnswers, setNumberOfPossibleAnswers] = useState(4);
  const cat = { flag: 'flag', name: 'name', capital: 'capital' };
  const [categoryQuestion, setCategoryQuestion] = useState(cat.name);
  const [categoryAnswer, setCategoryAnswer] = useState(cat.capital);

  useEffect(() => {}, []);

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
      const questionSet = createQuestionArray(
        numberOfQuestions,
        numberOfPossibleAnswers,
        allCountries.filter((country) => country.capital !== ''),
        categoryQuestion,
        categoryAnswer,
        region,
      );
      setQuestions(questionSet);
      setIsLoading(false);
    };
    fetchCountries();
  }, [
    isRestarted,
    region,
    numberOfPossibleAnswers,
    categoryQuestion,
    categoryAnswer,
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
  ];

  function random(x) {
    // returns a random number between 0 and x-1
    return Math.floor(Math.random() * x);
  }

  function createUniqueRandomIndexArray(length, indicesToChooseFrom) {
    const arr = [];
    while (arr.length < length) {
      const newRand = random(indicesToChooseFrom);
      if (!arr.includes(newRand)) {
        arr.push(newRand);
      }
    }
    return arr;
  }

  function createQuestionArray(
    numberOfQuestions,
    answerPossibilities,
    allCountries,
    qCategory = 'name',
    aCategory = 'capital',
    region,
  ) {
    const countries = allCountries.filter(
      (country) => country.region === region,
    );
    const questionArray = [];
    // create new questions
    for (let i = 0; i < numberOfQuestions; i++) {
      const randomCountryIndices = createUniqueRandomIndexArray(
        answerPossibilities,
        countries.length,
      );
      const sol = random(answerPossibilities);
      const indexOfSolution = randomCountryIndices[sol];
      let quizQuestion;
      switch (qCategory) {
        case 'name':
          quizQuestion = countries[indexOfSolution].name;
          break;
        case 'capital':
          quizQuestion = countries[indexOfSolution].capital;
          break;
        case 'flag':
          quizQuestion = countries[indexOfSolution].flag;
          break;
        default:
          quizQuestion = countries[indexOfSolution].name;
      }
      const newQuestion = {};
      newQuestion.question = quizQuestion;
      newQuestion.answerOptions = [];
      // create answerOptions for each question
      for (let i = 0; i < randomCountryIndices.length; i++) {
        let quizAnswer;
        switch (aCategory) {
          case 'name':
            quizAnswer = countries[randomCountryIndices[i]].name;
            break;
          case 'capital':
            quizAnswer = countries[randomCountryIndices[i]].capital;
            break;
          case 'flag':
            quizAnswer = countries[randomCountryIndices[i]].flag;
            break;
          default:
            quizAnswer = countries[randomCountryIndices[i]].name;
        }
        if (i === sol) {
          //for the correct answer
          newQuestion.answerOptions.push({
            answer: quizAnswer,
            isCorrect: true,
          });
        } else {
          //for the wrong answers
          newQuestion.answerOptions.push({
            answer: quizAnswer,
            isCorrect: false,
          });
        }
      }
      questionArray.push(newQuestion);
    }
    return questionArray;
  }

  console.log('questions', questions);

  const handleQuizStartSubmit = (e) => {
    e.preventDefault();
    setIsQuizRunning(true);
  };

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
          <form onSubmit={(e) => handleQuizStartSubmit(e)}>
            <label>
              Select Region:
              <select
                value={region}
                onChange={(e) => setRegion(e.currentTarget.value)}
              >
                <option value="Americas">Amerikas</option>
                <option value="Europe">Europe</option>
                <option value="Oceania">Oceania</option>
                <option value="Asia">Asia</option>
                <option value="Africa">Africa</option>
              </select>
            </label>
            <label>
              Select Category:
              <select
                value={categoryAnswer}
                onChange={(e) => setCategoryAnswer(e.currentTarget.value)}
              >
                <option value={cat.capital}>Capitals</option>
                <option value={cat.flag}>Flags</option>
              </select>
            </label>
            <input type="submit" value="Start Quiz"></input>
          </form>
          {isQuizRunning ? (
            <>
              <div>Your Score: {score}</div>

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
                                onClick={() =>
                                  handleAnswerClick(option.isCorrect)
                                }
                              >
                                {categoryAnswer === cat.flag ? (
                                  <img
                                    height={150}
                                    alt=""
                                    src={option.answer}
                                  ></img>
                                ) : (
                                  <span>{option.answer}</span>
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
