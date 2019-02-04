import ws from 'ws';
import https from 'https';
import fs from 'fs';
import kurento from './kurento';

import {
  PRESENTER_REQUEST,
  VIEWER_REQUEST,
  ICE_CANDIDATE,
} from '../constants/ws';

// Set up WSS

const setUpWSS = () => {
  const httpsOptions = {
    key: fs.readFileSync('/etc/agora/localhost.key'),
    cert: fs.readFileSync('/etc/agora/localhost.crt'),
  };
  const httpsServer = https
    .createServer(httpsOptions)
    .listen(8443, () => console.info('Listening on 8443'));
  const wss = new ws.Server({ server: httpsServer });

  wss.on('connection', ws => {
    ws.on('message', msg => {
      const parsed = JSON.parse(msg);
      console.info(parsed);
      switch (parsed.id) {
        case PRESENTER_REQUEST:
          kurento.hostLecture('123', parsed.sdpOffer, ws);
          break;
        case VIEWER_REQUEST:
          kurento.joinLecture('123', parsed.sdpOffer, ws);
          break;
        case ICE_CANDIDATE:
          kurento.handleIceCandidate(parsed);
          break;
        default:
          break;
      }
    });
  });
};
export default setUpWSS;
