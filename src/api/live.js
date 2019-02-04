import kurento from '../live/kurento';

const router = require('express').Router();

router.get('/lecture', (req, res) => {
  try {
    kurento.hostLecture('1');
  } catch (e) {
    console.info(e);
  }

  res.send('here');
});

export default router;
