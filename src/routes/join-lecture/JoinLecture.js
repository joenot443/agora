import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import kurentoUtils from 'kurento-utils';
import s from './JoinLecture.css';
import Chatroom from '../../components/Chatroom/Chatroom';
import {
  ICE_CANDIDATE,
  VIEWER_RESPONSE,
  PRESENTER_RESPONSE,
  STOP_LECTURE,
  PRESENTER_REQUEST,
  VIEWER_REQUEST,
  VIEWER_TYPE,
} from '../../constants/ws';

console.info('Should NEVER SEEN THIS ON SERVER');

class JoinLecture extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);
    this.viewerId = null;
  }

  async componentDidMount() {
    if (typeof window === 'undefined') return;
    try {
      const videoInput = document.getElementById('video');

      const options = {
        remoteVideo: videoInput,
        onicecandidate: this.onIceCandidate,
      };

      this.ws = new WebSocket('wss://localhost:8443/ws');
      this.ws.onmessage = this.onWSMessage;

      this.webRtcPeer = await kurentoUtils.WebRtcPeer.WebRtcPeerRecvonly(
        options,
        error => {
          if (error) console.info(error);
          this.webRtcPeer.generateOffer(this.onPresenterOffer);
        },
      );
    } catch (e) {
      console.info(e);
    }
  }
  // Websockets

  onWSMessage = msg => {
    const parsed = JSON.parse(msg.data);

    switch (parsed.id) {
      case VIEWER_RESPONSE:
        this.onViewerResponse(parsed);
        break;
      case ICE_CANDIDATE:
        this.onWSIceCandidate(parsed);
        break;
      default:
        break;
    }
  };

  onWSIceCandidate = msg => {
    this.webRtcPeer.addIceCandidate(msg.candidate);
  };

  sendWSMessage = msg => {
    const jsonMessage = JSON.stringify(msg);
    console.info(`Senging message  : ${jsonMessage}`);
    this.ws.send(jsonMessage);
  };

  // Kurento

  onViewerResponse = message => {
    this.viewerId = message.viewerId;
    console.info(message);
    if (message.message) {
      this.webRtcPeer.processAnswer(message.message, error => {
        if (error) console.info(error);
      });
    }
  };

  onIceCandidate = candidate => {
    console.info('Got viewer ICE candidate');
    console.info(candidate);
    const message = {
      id: ICE_CANDIDATE,
      candidate,
      type: VIEWER_TYPE,
      viewerId: this.viewerId,
    };
    this.sendWSMessage(message);
  };

  onError = error => {
    console.info(error);
  };

  onPresenterOffer = (error, offer) => {
    if (error) return this.onError(error);

    const message = {
      id: VIEWER_REQUEST,
      sdpOffer: offer,
    };
    this.sendWSMessage(message);
  };

  render() {
    return (
      <div className={s.root}>
        <div className={s.container}>
          <h1>{this.props.title}</h1>
          <div className={s.content}>
            <video id="video" autoPlay width="640px" height="480px" />
            <Chatroom />
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(JoinLecture);
