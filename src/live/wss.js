import ws from 'ws';
import https from 'https';
import fs from 'fs';
import kurento from './kurento';

import {
  PRESENTER_REQUEST,
  VIEWER_REQUEST,
  ICE_CANDIDATE,
  STOP_LECTURE,
} from '../constants/ws';

// Set up WSS

let wss;

const setUpWSS = () => {
  if (wss) return;
  console.info('Setting up WS');
  const httpsOptions = {
    key: fs.readFileSync('/etc/agora/localhost.key'),
    cert: fs.readFileSync('/etc/agora/localhost.crt'),
  };
  const httpsServer = https
    .createServer(httpsOptions)
    .listen(8443, () => console.info('Listening on 8443'));
  wss = new ws.Server({ server: httpsServer });

  wss.on('connection', conn => {
    conn.alive = true;
    conn.on('message', msg => {
      const parsed = JSON.parse(msg);
      switch (parsed.id) {
        case PRESENTER_REQUEST:
          kurento.hostLecture(parsed.lectureId, parsed.sdpOffer, conn);
          break;
        case VIEWER_REQUEST:
          kurento.joinLecture(parsed.lectureId, parsed.sdpOffer, conn);
          break;
        case ICE_CANDIDATE:
          kurento.handleIceCandidate(parsed);
          break;
        case STOP_LECTURE:
          kurento.stopLecture(parsed.lectureId);
          break;
        default:
          break;
      }
    });

    conn.on('pong', () => {
      conn.alive = true;
    });
  });
};

setInterval(() => {
  wss.clients.forEach(ws => {
    if (ws.alive === false) {
      return ws.terminate();
    }

    ws.alive = false;
    ws.ping(() => {});
  });
}, 5000);

export default setUpWSS;
