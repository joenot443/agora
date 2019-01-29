import DataType from 'sequelize';
import Model from '../sequelize';

const User = Model.define(
  'User',
  {
    id: {
      type: DataType.UUID,
      defaultValue: DataType.UUIDV1,
      primaryKey: true,
    },

    username: {
      type: DataType.STRING(255),
    },

    password: {
      type: DataType.STRING(255),
    },
  },
  {
    indexes: [{ fields: ['username'] }],
  },
);

export default User;
