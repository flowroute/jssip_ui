import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import FlowrouteClient from 'jssip_client';
import ButtonBubble from './button-bubble';
import Keypad from './keypad';
import Volume from './volume';


import './call-support-modal.scss';


class CallSupportModal extends React.Component {
  static propTypes = {
    onClose: PropTypes.func.isRequired,
  }

  static isEnabledCallButton(status) {
    return status === 'ended' || status === 'registered' || status === 'failed';
  }

  constructor(props) {
    super(props);

    this.flowrouteClient = new FlowrouteClient({
      debug: true,
      onUserAgentAction: this.handleUserAgentAction,
    });

    this.state = {
      // number: '14503001085', // (VoIP Patrol)
      // number: '12012673228', // (Julien Mobile)
      number: '13125867146', // (FreeSwitch)
      isCall: false,
      isMuted: false,
      isKeypadOpen: false,
      volume: 100,
      keysPressed: [],
      status: '',
    };
  }

  componentDidMount() {
    this.flowrouteClient.start();
  }

  componentWillUnmount() {
    const { isCall } = this.state;

    this.flowrouteClient.onUserAgentAction = () => {};

    if (isCall) {
      this.flowrouteClient.hangup();
    }
    this.flowrouteClient.stop();
  }

  onCallToggle = () => {
    const { isCall, number } = this.state;

    if (isCall) {
      this.flowrouteClient.hangup();

      // restaure the initial config on end call
      this.setState({
        volume: 100,
        isMuted: false,
        isKeypadOpen: false,
        keysPressed: [],
      });
      this.flowrouteClient.setOutputVolume(100);
    }

    if (!isCall) {
      this.flowrouteClient.call({
        to: number,
        onCallAction: this.handleCallAction,
      });
    }
  }

  onMutedToggle = () => {
    const { isMuted } = this.state;

    this.setState({
      isMuted: !isMuted,
    });

    if (isMuted) {
      this.flowrouteClient.getActiveCall().unmute();
    } else {
      this.flowrouteClient.getActiveCall().mute();
    }
  }

  onKeypadToggle = () => {
    this.setState(({ isKeypadOpen }) => ({ isKeypadOpen: !isKeypadOpen }));
  }

  onHandleVolume = ({ target }) => {
    this.setState({
      volume: target.value,
    });

    this.flowrouteClient.setOutputVolume(target.value);
  }

  onClickKeypad = ({ target }) => {
    const { keysPressed } = this.state;

    keysPressed.push(target.value);

    this.flowrouteClient.sendRtpDTMF(target.value);


    this.setState({ keysPressed });
  }

  handleCallAction = (action) => {
    console.log(`call action: ${action.type}`);
    this.setState({
      status: action.type,
    });

    switch (action.type) {
      case 'accepted':
      case 'confirmed':
        this.setState({
          isCall: true,
        });
        break;
      case 'ended':
      case 'failed':
        this.setState({
          isCall: false,
          volume: 100,
          isMuted: false,
          isKeypadOpen: false,
          keysPressed: [],
        });
        this.flowrouteClient.setOutputVolume(100);
        break;
      default:
        console.warn('Ignored call action:', action.type, action.payload);
        break;
    }
  }

  handleUserAgentAction = (action) => {
    console.log(`user action: ${action.type}`);
    this.setState({
      status: action.type,
    });
  }

  render() {
    const {
      number,
      isCall,
      isMuted,
      isKeypadOpen,
      volume,
      keysPressed,
      status,
    } = this.state;
    const { onClose } = this.props;

    return (
      <div className="call-support__modal">
        <div className="call-support__header">
          <h3>Call Support</h3>
          <button type="button" className="call-support__close" onClick={onClose}>
            <i className="fa fa-times" />
          </button>
        </div>

        <div className="call-support__body">
          <div className="call-support__number">+{number}</div>
          {status && (
            <div className="call-support__status">
              {status}
            </div>
          )}
          {isKeypadOpen && (
            <div className="call-support__keypad">
              {!!keysPressed.length && (
                <div className="call-support__display-keys">{keysPressed.join('')}</div>
              )}
              <Keypad onClick={this.onClickKeypad} />
            </div>
          )}
          <div className="call-support__actions">
            {!isCall && (
              <ButtonBubble id="btn-call-start" icon="call-start" label="call" green onClick={this.onCallToggle} disabled={!CallSupportModal.isEnabledCallButton(status)} />
            )}
            {isCall && (
              <Fragment>
                <ButtonBubble id="btn-muted" icon="muted" label={isMuted ? 'unmute' : 'mute'} blue={isMuted} onClick={this.onMutedToggle} />
                <ButtonBubble id="btn-keypad" icon="keypad" label="keypad" blue={isKeypadOpen} onClick={this.onKeypadToggle} />
                <ButtonBubble id="btn-call-end" icon="call-end" label="end call" red onClick={this.onCallToggle} />
              </Fragment>
            )}
          </div>
          {isCall && (
            <div className="call-support__footer">
              <Volume value={volume} onChange={this.onHandleVolume} />
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default CallSupportModal;
