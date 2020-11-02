import React from 'react';

function Results({ questions, answers }) {
  return (
    <div>
      <div>Last Rounds results:</div>
      <div>Question</div>
      <div>Your Answer</div>
      <div>Correct Answer</div>
      {answers.map((answer, index) => {
        return (
          <>
            <div>{questions[index].question}</div>
            <div>{answer}</div>
            <div>
              {
                questions[index].answerOptions.find(
                  (option) => option.isCorrect === true,
                ).answer
              }
            </div>
          </>
        );
      })}
    </div>
  );
}

export default Results;
