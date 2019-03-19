import kurento from 'kurento-client';
import config from '../config';
import uuid from 'uuid/v1';
import Lecture from '../data/models/Lecture';

import {
  PRESENTER_RESPONSE,
  VIEWER_RESPONSE,
  VIEWER_TYPE,
  PRESENTER_TYPE,
} from '../constants/ws';

const MEDIA_PIPELINE = 'MediaPipeline';
const WEB_RTC_ENDPOINT = 'WebRtcEndpoint';
const ON_ICE_CANDIDATE = 'OnIceCandidate';
const ICE_CANDIDATE_TYPE = 'IceCandidate';
const ICE_CANDIDATE_EVENT = 'iceCandidate';
const CONNECTION_STATE_CHANGED = 'MediaStateChanged';

const CONNECTED = 'DISCONNECTED';
const DISCONNECTED = 'DISCONNECTED';

const activeLectures = {};
const activeViewers = {};

let kurentoSingleton;

async function getKurentoClient() {
  if (kurentoSingleton) return kurentoSingleton;

  kurentoSingleton = await kurento.getSingleton(config.kurentoUrl);

  return kurentoSingleton;
}

async function wsIceCandidate(event, ws) {
  const candidate = kurento.getComplexType(ICE_CANDIDATE_TYPE)(event.candidate);
  ws.send(
    JSON.stringify({
      id: ICE_CANDIDATE_EVENT,
      candidate,
    }),
  );
}
async function onLecturerIceCandidate(lectureId, _candidate) {
  console.info(activeLectures);
  const lecturer = activeLectures[lectureId];
  if (!lecturer) return;
  const candidate = kurento.getComplexType(ICE_CANDIDATE_TYPE)(_candidate);
  lecturer.webRtcEndpoint.addIceCandidate(candidate);
}

async function onViewerIceCandidate(viewerId, _candidate) {
  console.info(activeViewers);
  const viewer = activeViewers[viewerId];
  if (!viewer) return;
  const candidate = kurento.getComplexType(ICE_CANDIDATE_TYPE)(_candidate);
  viewer.webRtcEndpoint.addIceCandidate(candidate);
}

async function handleIceCandidate(message) {
  switch (message.type) {
    case VIEWER_TYPE:
      onViewerIceCandidate(message.viewerId, message.candidate);
      break;
    case PRESENTER_TYPE:
      onLecturerIceCandidate(message.lectureId, message.candidate);
      break;
    default:
  }
}

async function setLectureActive(lectureId, active) {
  const lecture = await Lecture.findOne({
    where: { id: Number.parseInt(lectureId) },
  });
  if (!lecture) {
    console.info(`No lecture for id ${lectureId}`);
    return;
  }
  lecture.live = active;
  await lecture.save();
}

async function onMediaStateChanged(state, lectureId) {
  if (state.newState === DISCONNECTED && activeLectures[lectureId]) {
    delete activeLectures[lectureId];
    setLectureActive(lectureId, false);
  }
}

async function hostLecture(lectureId, sdpOffer, ws) {
  const presenter = {
    lectureId,
    pipeline: null,
    webRtcEndpoint: null,
  };

  try {
    const kurentoClient = await getKurentoClient();

    presenter.pipeline = await kurentoClient.create(MEDIA_PIPELINE);
    presenter.webRtcEndpoint = presenter.pipeline.create(WEB_RTC_ENDPOINT);
    const onIceCandidateFn = wsIceCandidate;
    presenter.webRtcEndpoint.on(ON_ICE_CANDIDATE, event =>
      onIceCandidateFn(event, ws),
    );
    presenter.webRtcEndpoint.on(CONNECTION_STATE_CHANGED, event => {
      onMediaStateChanged(event, lectureId);
      console.info(event);
    });

    const sdpAnswer = await presenter.webRtcEndpoint.processOffer(sdpOffer);
    ws.send(
      JSON.stringify({
        id: PRESENTER_RESPONSE,
        response: 'accepted',
        message: sdpAnswer,
      }),
    );

    await presenter.webRtcEndpoint.gatherCandidates(error =>
      console.info(error),
    );

    activeLectures[lectureId] = presenter;
    setLectureActive(lectureId, true);
  } catch (e) {
    console.info(e);
  }
}

async function joinLecture(lectureId, sdpOffer, ws) {
  const viewer = {
    lectureId,
    pipeline: null,
    webRtcEndpoint: null,
  };
  try {
    const presenter = activeLectures[lectureId];
    console.info(presenter);
    if (!presenter) return;

    viewer.webRtcEndpoint = presenter.pipeline.create(WEB_RTC_ENDPOINT);
    const onIceCandidateFn = wsIceCandidate;
    viewer.webRtcEndpoint.on(ON_ICE_CANDIDATE, event =>
      onIceCandidateFn(event, ws),
    );

    const sdpAnswer = await viewer.webRtcEndpoint.processOffer(sdpOffer);

    presenter.webRtcEndpoint.connect(viewer.webRtcEndpoint);

    console.info('Presenter sdpAnswer: ');
    console.info(sdpAnswer);
    const viewerId = uuid();

    ws.send(
      JSON.stringify({
        id: VIEWER_RESPONSE,
        response: 'accepted',
        message: sdpAnswer,
        viewerId,
      }),
    );

    activeViewers[viewerId] = viewer;

    viewer.webRtcEndpoint.gatherCandidates();
  } catch (e) {
    console.info(e);
  }
}

export default { hostLecture, joinLecture, handleIceCandidate };
