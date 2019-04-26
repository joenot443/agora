import Sequelize, { Op } from 'sequelize';
import config from '../config';

const sequelize = new Sequelize(config.databaseUrl, {
  operatorsAliases: Op,
  logging: false,
  // dialect: 'mysql',
  // dialectOptions: {
  //   socketPath: '/tmp/mysql.sock',
  // },
  define: {
    freezeTableName: true,
  },
});

export default sequelize;
