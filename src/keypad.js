import React from 'react';
import PropTypes from 'prop-types';

import './keypad.scss';

const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

const Keypad = ({ onClick }) => (
  <div className="keypad">
    {numbers.map(number => (
      <button
        key={number}
        className="keypad__number"
        type="button"
        value={number}
        onClick={onClick}
      >
        {number}
      </button>
    ))}
  </div>
);

Keypad.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default Keypad;
