import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import superagent from 'superagent';
import kurentoUtils from 'kurento-utils';
import Error from '../../components/Error/Error';
import Loading from '../../components/Loading/Loading';
import { Button, Radio } from 'antd';
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
      shareType: 'webcam',
    };
    this.messageStack = [];
  }

  async componentDidMount() {
    if (typeof window === 'undefined') return;
    this.fetchLecture();
    this.initializeWS();
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

      const options = {
        localVideo: videoInput,
        onicecandidate: this.onIceCandidate,

        sendSource: this.state.shareType,
        mediaConstraints: {
          audio: true,
          video: {
            mandatory: {
              maxWidth: 320,
              maxHeight: 240,
              maxFrameRate: 15,
              minFrameRate: 15,
            },
          },
        },
      };

      console.info(options);

      this.webRtcPeer = await kurentoUtils.WebRtcPeer.WebRtcPeerSendonly(
        options,
        (error, a) => {
          console.info(error);
          console.info(a);
          // if (error) console.info(error);
          this.webRtcPeer.generateOffer(this.onPresenterOffer);
        },
      );
      this.setState({ hosting: true });
    } catch (e) {
      console.info(e);
    }
  };

  stopHost = async () => {
    try {
      this.sendWSMessage({
        id: STOP_LECTURE,
        lectureId: this.props.lectureId,
      });
      this.setState({
        hosting: false,
      });
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
    // this.ws.on('ping', this.heartbeat);
  };

  sendMessageStack = () => {
    this.messageStack.forEach(m => {
      console.info(`Sending message  : ${m}`);
      this.ws.send(m);
    });
    this.messageStack = [];
  };

  onWSOpen = () => {
    // this.heartbeat();
    if (this.messageStack.length) this.sendMessageStack();
  };

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

  sendWSMessage = msg => {
    if (!this.ws || this.ws.readyState === this.ws.CLOSED) {
      this.initializeWS();
      this.messageStack.push(JSON.stringify(msg));
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
    console.info('Got presenter offer');
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
    else {
      const hostingButtonTitle = this.state.hosting
        ? 'Stop Hosting'
        : 'Start Hosting';
      const hostingButtonAction = this.state.hosting
        ? this.stopHost
        : this.startHost;
      body = (
        <div>
          <h1>{this.state.lecture.title}</h1>
          <h4>{this.state.lecture.description}</h4>
          <div className={s.content}>
            <div className={s.videoBody}>
              <div>
                <video
                  id="video"
                  className={s.video}
                  autoPlay
                  hidden={!this.state.hosting}
                />
                <div className={s.notPlaying} hidden={this.state.hosting}>
                  You're not currently broadcasting. <br />
                  Press the button below to start hosting your lecture!
                </div>
                <div className={s.menu}>
                  <Button
                    type="primary"
                    size="large"
                    onClick={hostingButtonAction}
                  >
                    {hostingButtonTitle}
                  </Button>
                  <div>
                    <Radio.Group
                      defaultValue="webcam"
                      value={this.state.shareType}
                      buttonStyle="solid"
                      size="large"
                      onChange={v =>
                        this.setState({ shareType: v.target.value })
                      }
                      disabled={this.state.hosting}
                    >
                      <Radio.Button value="webcam">Share Webcam</Radio.Button>
                      <Radio.Button value="screen">Share Screen</Radio.Button>
                    </Radio.Group>
                  </div>
                </div>
              </div>
            </div>
            <Chatroom username="Lecturer" />
          </div>
        </div>
      );
    }
    return (
      <div className={s.root}>
        <div className={s.container}>{body}</div>
      </div>
    );
  }
}

export default withStyles(s)(HostLecture);
