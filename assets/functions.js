export function random(x) {
  // returns a random number between 0 and x-1
  return Math.floor(Math.random() * x);
}

export function createUniqueRandomIndexArray(length, indicesToChooseFrom) {
  const arr = [];
  while (arr.length < length) {
    const newRand = random(indicesToChooseFrom);
    if (!arr.includes(newRand)) {
      arr.push(newRand);
    }
  }
  return arr;
}

export function createQuestionArray(
  numberOfQ,
  answerPossibilities,
  allCountries,
  qCategory,
  aCategory,
  filterByRegion,
) {
  let filteredCountries;
  if (filterByRegion === 'World') {
    filteredCountries = allCountries;
  } else {
    filteredCountries = allCountries.filter(
      (country) => country.region === filterByRegion,
    );
  }
  const questionArray = [];
  // create new questions
  for (let i = 0; i < numberOfQ; i++) {
    const randomCountryIndices = createUniqueRandomIndexArray(
      answerPossibilities,
      filteredCountries.length,
    );
    const sol = random(answerPossibilities);
    const indexOfSolution = randomCountryIndices[sol];
    let quizQuestion;
    switch (qCategory) {
      case 'name':
        quizQuestion = filteredCountries[indexOfSolution].name;
        break;
      case 'capital':
        quizQuestion = filteredCountries[indexOfSolution].capital;
        break;
      case 'flag':
        quizQuestion = filteredCountries[indexOfSolution].flag;
        break;
      default:
        quizQuestion = filteredCountries[indexOfSolution].name;
    }
    const newQuestion = {};
    newQuestion.question = quizQuestion;
    newQuestion.answerOptions = [];
    // create answerOptions for each question
    for (let j = 0; j < randomCountryIndices.length; j++) {
      let quizAnswer;
      switch (aCategory) {
        case 'name':
          quizAnswer = filteredCountries[randomCountryIndices[j]].name;
          break;
        case 'capital':
          quizAnswer = filteredCountries[randomCountryIndices[j]].capital;
          break;
        case 'flag':
          quizAnswer = filteredCountries[randomCountryIndices[j]].flag;
          break;
        default:
          quizAnswer = filteredCountries[randomCountryIndices[j]].name;
      }
      if (j === sol) {
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
