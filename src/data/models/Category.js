import DataType from 'sequelize';
import Model from '../sequelize';

const Category = Model.define('Category', {
  title: {
    type: DataType.STRING,
  },
});

export default Category;
