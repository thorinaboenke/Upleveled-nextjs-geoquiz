import React, { useState } from 'react';

function AnswerButton(props) {
  const {
    categoryAnswer,
    showCorrectAnswer,
    showOnlyCorrectAnswer,
    handleAnswerClick,
    option,
    answers,
  } = props;

  const [isClicked, setIsClicked] = useState(false);

  return (
    <button
      data-cy="answer-button"
      disabled={showCorrectAnswer || showOnlyCorrectAnswer}
      onClick={() => {
        handleAnswerClick(option.isCorrect, answers, option.answer);
        setIsClicked(true);
      }}
      className={
        (showOnlyCorrectAnswer || showCorrectAnswer) && option.isCorrect
          ? 'true'
          : showCorrectAnswer && !option.isCorrect && isClicked
          ? 'false'
          : 'normal'
      }
    >
      {categoryAnswer === 'flag' ? (
        <img className="flag" alt="" src={option.answer} />
      ) : (
        <div>{option.answer}</div>
      )}
    </button>
  );
}

export default AnswerButton;
