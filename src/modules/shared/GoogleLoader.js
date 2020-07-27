import React from 'react';
import PropTypes from 'prop-types';

const GoogleLoader = ({ className, height, width }) => (
  <svg
    className={`spinner ${className || ''}`}
    width={width}
    height={height}
    viewBox="0 0 66 66"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      className="path"
      fill="none"
      strokeWidth={6}
      strokeLinecap="round"
      cx="33"
      cy="33"
      r="30"
    />
  </svg>
);

GoogleLoader.propTypes = {
  className: PropTypes.string,
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

GoogleLoader.defaultProps = {
  className: '',
  height: 20,
  width: 20,
};

export default GoogleLoader;
