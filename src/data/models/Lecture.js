import DataType from 'sequelize';
import Model from '../sequelize';

const Lecture = Model.define('Lecture', {
  title: {
    type: DataType.STRING,
  },
  description: {
    type: DataType.STRING,
  },
  startTime: {
    type: DataType.DATE,
  },
  url: {
    type: DataType.STRING,
  },
});

export default Lecture;
