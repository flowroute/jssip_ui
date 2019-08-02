/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/label-has-for */
import React from 'react';
import PropTypes from 'prop-types';


const Volume = ({ value, onChange }) => (
  <div className="call-support__volume">
    <label htmlFor="volume">Volume</label>
    <input
      type="range"
      id="volume"
      min="0"
      max="100"
      step="1"
      value={value}
      onChange={onChange}
    />
  </div>
);

Volume.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default Volume;
