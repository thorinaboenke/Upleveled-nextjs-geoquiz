import React, { useEffect, useState, useRef } from 'react';
import { css } from '@emotion/core';

const progressStyles = css`
  .card {
    flex-shrink: 1;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    position: relative;

    margin: 1em;
  }
  .svg {
    display: inline;
    max-width: 100%;
  }

  .svg-circle-bg {
    fill: none;
  }
  .svg-circle {
    fill: none;
  }
  .progress {
    font-weight: bold;
    font-size: 2em;
    background-color: white;
    opacity: 0.5;
    color: black;
    border-radius: 50%;
    align-self: flex-end;
  }
  .progress span {
    font-size: 0.7em;
  }
  img {
    position: absolute;
    top: 15%;
    left: 10%;
  }
`;

function CircularProgress({
  size,
  progress,
  strokeWidth,
  circleOneStroke,
  circleTwoStroke,
  imgUrl,
}) {
  const [offset, setOffset] = useState(0);
  const circleRef = useRef(null);
  const center = size / 2;
  const radius = size / 2 - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    const progressOffset = ((100 - progress) / 100) * circumference;
    setOffset(progressOffset);
    circleRef.current.style =
      'transition: stroke-dashoffset 850ms ease-in-out;';
  }, [setOffset, circumference, progress, offset]);
  return (
    <div css={progressStyles}>
      <div className="card">
        <svg className="svg" width={size} height={size}>
          <circle
            className="svg-circle-bg"
            stroke={circleOneStroke}
            cx={center}
            cy={center}
            r={radius}
            strokeWidth={strokeWidth}
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
            strokeLinecap="round"
          />
        </svg>
        <div className="progress">
          {progress}
          <span>%</span>
        </div>

        {imgUrl && <img src={imgUrl} alt="" height={size / 1.5} />}
      </div>
    </div>
  );
}

export default CircularProgress;
