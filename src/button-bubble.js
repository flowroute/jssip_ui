import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Icon from './icon';

import './button-bubble.scss';

const ButtonBubble = ({
  red,
  blue,
  green,
  icon,
  ...props
}) => (
  <button
    type="button"
    className={classnames(
      'button-bubble',
      {
        'button-bubble__red': red,
        'button-bubble__blue': blue,
        'button-bubble__green': green,
      },
    )}
    {...props}
  >
    <Icon icon={icon} />
  </button>
);

ButtonBubble.propTypes = {
  icon: PropTypes.string.isRequired,
  red: PropTypes.bool,
  blue: PropTypes.bool,
  green: PropTypes.bool,
};

ButtonBubble.defaultProps = {
  red: false,
  blue: false,
  green: false,
};

const ButtonBubbleWithLabel = ({ label, ...props }) => {
  if (!label) return ButtonBubble;

  return (
    <div className="button-bubble-label">
      <ButtonBubble {...props} />
      <span className="button-bubble-label__label">{label}</span>
    </div>
  );
};

ButtonBubbleWithLabel.propTypes = {
  label: PropTypes.string,
};

ButtonBubbleWithLabel.defaultProps = {
  label: '',
};


export default ButtonBubbleWithLabel;
