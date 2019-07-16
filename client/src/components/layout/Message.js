import React from 'react';
import PropTypes from 'prop-types';

const Message = ({ message, badgeType }) => (
  <div className={`badge badge-${badgeType}`}>{message}</div>
);

// Message.defaultProps = {
//   timeout: 3000
// };

Message.propTypes = {
  message: PropTypes.string.isRequired,
  badgeType: PropTypes.string.isRequired
};

export default Message;
