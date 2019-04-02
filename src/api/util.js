import Lecture from '../data/models/Lecture';

export const clearLectures = async () =>
  Lecture.update(
    {
      live: false,
    },
    {
      where: {},
    },
  );
