import React from 'react';
const Preview = (props) => {
  return (
    <img
      className="preview"
      src={
        props.imageUrl
          ? props.imageUrl
          : props.url
          ? props.url
          : props.fallbackUrl
      }
      alt="avatar"
    />
  );
};

export default Preview;
