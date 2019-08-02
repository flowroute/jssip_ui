import React from 'react';
import PropTypes from 'prop-types';

const Icon = ({ icon }) => (
  <img
    src={`${process.env.PUBLIC_URL}/icons/${icon}.svg`}
    className="fr-icon"
    alt={`icon-${icon}`}
  />
);

Icon.propTypes = {
  icon: PropTypes.string.isRequired,
};

export default Icon;
