import React from 'react';

const NotFound = props => {
  return (
    <>
      <h1 className="x-large text-primary">
        <i className="fas fa-exclamation-triangle" /> Page Not Found
      </h1>
      <p className="large">Sorry, this page does not exist</p>
    </>
  );
};

export default NotFound;
