import React from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/core';
import { colors } from '../assets/colors';

const Component = styled('bar')`
  .bar {
    height: 0.5em;

    width: ${(props) => props.width}%;
    background-color: ${colors.incorrect};
    transition: width 1s linear;
  }
`;

const Bar = ({ width }) => {
  return (
    <Component width={width}>
      <div className="bar" />
    </Component>
  );
};

export default Bar;
