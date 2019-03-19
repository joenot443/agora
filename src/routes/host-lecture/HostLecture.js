import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import superagent from 'superagent';
import kurentoUtils from 'kurento-utils';
import Error from '../../components/Error/Error';
import Loading from '../../components/Loading/Loading';
import { Button } from 'antd';
import s from './HostLecture.css';
import Chatroom from '../../components/Chatroom/Chatroom';
import {
  ICE_CANDIDATE,
  PRESENTER_RESPONSE,
  STOP_LECTURE,
  PRESENTER_REQUEST,
  PRESENTER_TYPE,
} from '../../constants/ws';

class HostLecture extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    lectureId: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      message: null,
      lecture: null,
      loading: true,
      hosting: false,
    };
  }

  async componentDidMount() {
    if (typeof window === 'undefined') return;
    this.fetchLecture();
  }

  async fetchLecture() {
    const response = await superagent.get(
      `/api/lecture/${this.props.lectureId}`,
    );
    if (!response.body.success)
      this.setState({
        message: response.body.message,
        success: false,
        loading: false,
      });
    else
      this.setState({
        lecture: response.body.data,
        success: true,
        loading: false,
      });
  }

  startHost = async () => {
    try {
      const videoInput = document.getElementById('video');

      const constraints = {
        audio: true,
        video: {
          width: 640,
          framerate: 15,
        },
      };

      const options = {
        localVideo: videoInput,
        onicecandidate: this.onIceCandidate,
        mediaConstraints: constraints,
      };

      this.ws = new WebSocket('wss://localhost:8443/ws');
      this.ws.onmessage = this.onWSMessage;

      this.webRtcPeer = await kurentoUtils.WebRtcPeer.WebRtcPeerSendonly(
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
    console.info(msg);
    const parsed = JSON.parse(msg.data);

    switch (parsed.id) {
      case PRESENTER_RESPONSE:
        this.onPresenterResponse(parsed);
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
    console.info(`Sending message  : ${jsonMessage}`);
    this.ws.send(jsonMessage);
  };

  // Kurento

  onError = error => {
    console.info(error);
  };

  onPresenterResponse = msg => {
    console.info(msg);
    if (msg.response !== 'accepted') {
      console.info(msg);
    } else {
      this.webRtcPeer.processAnswer(msg.message, error => console.info(error));
    }
  };

  onIceCandidate = candidate => {
    console.info('Got ICE candidate');
    console.info(candidate);
    const message = {
      id: ICE_CANDIDATE,
      candidate,
      type: PRESENTER_TYPE,
      lectureId: this.props.lectureId,
    };
    this.sendWSMessage(message);
  };

  onPresenterOffer = (error, offer) => {
    if (error) return this.onError(error);

    const message = {
      id: PRESENTER_REQUEST,
      sdpOffer: offer,
      lectureId: this.props.lectureId,
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
            <video id="video" autoPlay width="640px" height="480px" />
            <Chatroom username="Lecturer" />
          </div>
          <div className={s.menu}>
            <Button type="primary" size="large" onClick={this.startHost}>
              Start Hosting
            </Button>
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

export default withStyles(s)(HostLecture);
