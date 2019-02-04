import Sequelize, { Op } from 'sequelize';
import config from '../config';

const sequelize = new Sequelize(config.databaseUrl, {
  operatorsAliases: Op,
  logging: false,

  define: {
    freezeTableName: true,
  },
});

export default sequelize;
