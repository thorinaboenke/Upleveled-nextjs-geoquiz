import React from 'react';
import { keyframes } from '@emotion/core';
import { colors } from '../assets/colors';

const footerStyles = css`
  .achievement-popup {
  }
`;

function AchievementPopup(props) {
  const { streakdays, totalScore } = props;
  return (
    <div className="achievement-popup">{`Congrats! You answered ${totalScore} question correctly`}</div>
  );
}

export default AchievementPopup;
