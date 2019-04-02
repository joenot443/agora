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
  END_LECTURE,
  RECONNECT_LECTURE,
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
      lecture: {},
      loading: true,
      live: false,
    };
    this.messageStack = [];
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
    this.initializeWS();
    this.startViewer();
  };

  startViewer = async () => {
    try {
      const videoInput = document.getElementById('video');

      const options = {
        remoteVideo: videoInput,
        onicecandidate: this.onIceCandidate,
      };

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

  initializeWS = () => {
    const url = `wss://${document.location.hostname}:8443/ws`;
    this.ws = new WebSocket(url);
    this.ws.onmessage = this.onWSMessage;
    this.ws.onopen = this.onWSOpen;
  };

  sendMessageStack = () => {
    this.messageStack.forEach(m => {
      console.info(`Sending message  : ${m}`);
      this.ws.send(JSON.stringify(m));
    });
    this.messageStack = [];
  };

  onWSOpen = () => {
    // this.heartbeat();
    if (this.messageStack.length) this.sendMessageStack();
  };

  onWSMessage = msg => {
    const parsed = JSON.parse(msg.data);
    switch (parsed.id) {
      case VIEWER_RESPONSE:
        this.onViewerResponse(parsed);
        break;
      case ICE_CANDIDATE:
        this.onWSIceCandidate(parsed);
        break;
      case END_LECTURE:
        this.onLectureEnd();
        break;
      case RECONNECT_LECTURE:
        this.startViewer();
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
      this.initializeWS();
      this.messageStack.push(msg);
    } else if (this.ws.readyState === this.ws.CONNECTING) {
      this.messageStack.push(msg);
    } else {
      const jsonMessage = JSON.stringify(msg);
      console.info(`Sending message  : ${jsonMessage}`);
      this.ws.send(jsonMessage);
    }
  };

  // heartbeat = () => {
  //   clearTimeout(this.pingTimeout);
  //   this.pingTimeout = setTimeout(() => {
  //     this.ws.terminate();
  //   }, 6000);
  // };

  // Kurento

  onViewerResponse = message => {
    this.viewerId = message.viewerId;
    console.info('Viewer response');
    console.info(message);
    if (message.message) {
      this.webRtcPeer.processAnswer(message.message, error => {
        if (error) console.info(error);
        else {
          this.setState({ live: true });
          const video = document.getElementById('video');
          video.play();
        }
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

  onLectureEnd = (error, stream) => {
    console.info(error);
    console.info(stream);
    console.info('isdhfgousd');
    this.setState({ live: false });
  };

  render() {
    return (
      <div className={s.root}>
        <div className={s.container}>
          <div>
            <h1>{this.state.lecture.title}</h1>
            <h4>{this.state.lecture.description}</h4>
            <div className={s.content}>
              <div className={s.videoBody}>
                <video
                  id="video"
                  className={s.video}
                  hidden={!this.state.live}
                  controls
                />
                <div className={s.notPlaying} hidden={this.state.live}>
                  This lecture is not currently live!
                </div>
              </div>
              <Chatroom />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(JoinLecture);
