import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import kurentoUtils from 'kurento-utils';
import superagent from 'superagent';
import s from './JoinLecture.css';
import Error from '../../components/Error/Error';
import Loading from '../../components/Loading/Loading';
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
    lectureId: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);

    this.viewerId = null;
    this.state = {
      message: null,
      lecture: null,
      loading: true,
    };
  }

  async componentDidMount() {
    if (typeof window === 'undefined') return;
    this.fetchLecture();
  }

  fetchLecture = async () => {
    const response = await superagent.get(
      `/api/lecture/${this.props.lectureId}`,
    );
    if (!response.body.success) {
      this.setState({
        message: response.body.message,
        success: false,
        loading: false,
      });
      return;
    }

    this.setState({
      lecture: response.body.data,
      success: true,
      loading: false,
    });
    this.startViewer();
  };

  startViewer = async () => {
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
  };
  // Websockets

  onWSMessage = msg => {
    const parsed = JSON.parse(msg.data);
    console.info(parsed);
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
    if (!this.ws || this.ws.readyState === this.ws.CLOSED) {
      this.ws = new WebSocket('wss://localhost:8443/ws');
      this.ws.onmessage = this.onWSMessage;
    }
    const jsonMessage = JSON.stringify(msg);
    console.info(`Sending message  : ${jsonMessage}`);
    this.ws.send(jsonMessage);
  };

  // Kurento

  onViewerResponse = message => {
    console.info(message);
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
      lectureId: this.props.lectureId,
      sdpOffer: offer,
    };
    this.sendWSMessage(message);
  };

  render() {
    let body;
    if (this.state.loading) body = <Loading />;
    else if (this.state.success === false)
      body = <Error message={this.state.message} />;
    else
      body = (
        <div>
          <h1>{this.state.lecture.title}</h1>
          <h4>{this.state.lecture.description}</h4>
          <div className={s.content}>
            <video id="video" autoPlay width="640px" height="480px" controls />
            <Chatroom />
          </div>
        </div>
      );
    return (
      <div className={s.root}>
        <div className={s.container}>{body}</div>
      </div>
    );
  }
}

export default withStyles(s)(JoinLecture);
