import bcrypt from 'bcrypt';
import jsonwebtoken from 'jsonwebtoken';

import config from '../config';
import User from '../data/models/User';

const router = require('express').Router();

const tokenForUser = user =>
  jsonwebtoken.sign(
    {
      id: user.id,
      username: user.username,
    },
    config.auth.jwt.secret,

    { expiresIn: '1y' },
  );

router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ where: { username: req.body.username } });

    console.info(req.body);

    if (!user) {
      res.json({
        success: false,
        message: 'No user for that username',
      });
    }

    const valid = await bcrypt.compare(req.body.password, user.password);

    if (!valid) {
      res.json({
        success: false,
        message: 'Incorrect username and password combination',
      });
    }

    const token = tokenForUser(user);

    console.log(token);

    res.cookie('id_token', token);
    res.json({
      success: true,
      message: 'Logged in',
      data: token,
    });
  } catch (e) {
    console.error(e);
  }
});

router.post('/register', async (req, res) => {
  try {
    console.info(config.auth.jwt.secret);
    let user = await User.findOne({ where: { username: req.body.username } });

    if (user) {
      res.json({
        success: false,
        message: 'That user already exists!',
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(
      req.body.password,
      config.auth.bcrypt.saltRounds,
    );

    user = await User.create({
      username: req.body.username,
      password: hashedPassword,
      name: req.body.name,
    });

    const token = tokenForUser(user);

    res.cookie('id_token', token);
    res.json({
      success: true,
      message: 'Successfully created a user',
      data: token,
    });
  } catch (e) {
    console.error(e);
  }
});

export default router;
