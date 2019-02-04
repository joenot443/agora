import auth from './auth';
import live from './live';

const router = require('express').Router();

router.use(auth);
router.use(live);

export default router;
