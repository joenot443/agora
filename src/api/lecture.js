import config from '../config';
import Lecture from '../data/models/Lecture';

const router = require('express').Router();

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
  }
});

router.post('/createLecture', async (req, res) => {
  try {
    const lecture = await Lecture.create({
      title: 'lecture title 1',
      description: 'desc',
      url: 'url',
    });

    res.json({
      success: true,
      message: 'Successfully created a lecture',
      data: lecture,
    });
  } catch (e) {
    console.error(e);
  }
});

export default router;
