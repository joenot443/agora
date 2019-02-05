import auth from './auth';
import live from './live';
import lecture from './lecture';

const router = require('express').Router();

router.use(auth);
router.use(live);
router.use(lecture);

export default router;
