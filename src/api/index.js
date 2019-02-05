import auth from './auth';
import lecture from './lecture';

const router = require('express').Router();

router.use(auth);
router.use(lecture);

export default router;
