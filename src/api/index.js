import auth from './auth';

const router = require('express').Router();

router.use(auth);

export default router;
