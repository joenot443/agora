import DataType from 'sequelize';
import Model from '../sequelize';

const Class = Model.define('Class', {
  title: {
    type: DataType.STRING,
  },
  description: {
    type: DataType.STRING,
  },
});

export default Class;
