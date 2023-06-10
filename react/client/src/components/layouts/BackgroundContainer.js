import React from 'react';

const BackgroundContainer = ({ children }) => {
  return (
    React.createElement('div', { className: 'background-container' },
      React.createElement('div', { className: 'background-rotate' }),
      children
    )
  );
};
export default BackgroundContainer;