import React from 'react';
import PropTypes from 'prop-types';

const Message = ({ message, badgeType, textColor }) => (
  <div className={`badge badge-${badgeType} text-${textColor}`}>{message}</div>
);

// Message.defaultProps = {
//   timeout: 3000
// };

Message.propTypes = {
  message: PropTypes.string.isRequired,
  badgeType: PropTypes.string.isRequired,
  textColor: PropTypes.string.isRequired
};

export default Message;
