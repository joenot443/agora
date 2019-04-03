import config from '../config';
import Lecture from '../data/models/Lecture';

const router = require('express').Router();

router.get('/lectures/active', async (req, res) => {
  try {
    const lectures = await Lecture.findAll({ where: { live: true } });

    if (!lectures.length) {
      res.json({
        success: false,
        message: 'No lecture streams are currently live!',
      });
      return;
    }

    res.json({
      success: true,
      message: 'Found Lectures',
      data: lectures,
    });
  } catch (e) {
    console.error(e);
    res.json({ success: false, message: e.description });
  }
});

router.get('/lectures', async (req, res) => {
  try {
    const lectures = await Lecture.findAll();

    if (!lectures) {
      res.json({
        success: false,
        message: 'No lectures',
      });
    }

    res.json({
      success: true,
      message: 'Found Lectures',
      data: lectures,
    });
  } catch (e) {
    console.error(e);
    res.json({ success: false, message: e.description });
  }
});

router.get('/lecture/*', async (req, res) => {
  try {
    const id = req.params[0];
    const lecture = await Lecture.findOne({ where: { id } });
    if (!lecture) {
      res.json({ success: false, message: 'No lecture for that ID' });
      return;
    }

    res.json({
      success: true,
      message: '',
      data: {
        title: lecture.title,
        description: lecture.description,
        startTime: lecture.startTime,
        lecturerId: lecture.lecturerId,
        live: lecture.live,
      },
    });
  } catch (e) {
    console.info(e);
    res.json({ success: false, message: e });
  }
});

router.post('/lectures/new', async (req, res) => {
  try {
    const lecture = await Lecture.create({
      title: req.body.title,
      description: req.body.description,
      startTime: req.body.startTime,
    });

    res.json({
      success: true,
      message: 'Successfully created a lecture',
      id: lecture.dataValues.id,
    });
  } catch (e) {
    console.error(e);
  }
});

export default router;
