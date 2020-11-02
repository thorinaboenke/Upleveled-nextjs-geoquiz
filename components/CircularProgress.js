import React, { useEffect, useState, useRef } from 'react';
import { css } from '@emotion/core';
import { off } from 'process';

const progressStyles = css`
  .svg {
    display: block;
    margin: 20px auto;
    max-width: 100%;
  }

  .svg-circle-bg {
    fill: none;
  }
  .svg-circle {
    fill: none;
  }
  .svg-circle-text {
    text-anchor: middle;
  }
`;

function CircularProgress({
  size,
  progress,
  strokeWidth,
  circleOneStroke,
  circleTwoStroke,
}) {
  const [offset, setOffset] = useState(0);
  const center = size / 2;
  const radius = size / 2 - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;
  const circleRef = useRef(null);

  useEffect(() => {
    const progressOffset = ((100 - progress) / 100) * circumference;
    setOffset(progressOffset);
  }, [setOffset, circumference, progress, offset]);
  return (
    <div css={progressStyles}>
      <svg className="svg" width={size} height={size}>
        <circle
          className="svg-circle-bg"
          stroke={circleOneStroke}
          cx={center}
          cy={center}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
        />
        <circle
          className="svg-circle"
          stroke={circleTwoStroke}
          cx={center}
          cy={center}
          r={radius}
          strokeWidth={strokeWidth}
          ref={circleRef}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
        <text className="svg-circle-text">
          {progress}
          <span>%</span>
        </text>
      </svg>
    </div>
  );
}

export default CircularProgress;
