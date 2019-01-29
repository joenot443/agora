import sequelize from '../sequelize';
import User from './User';
import UserProfile from './UserProfile';
import Lecture from './Lecture';
import Class from './Class';
import Category from './Category';
import UserClass from './UserClass';

User.hasOne(UserProfile, {
  foreignKey: 'userId',
  as: 'profile',
  onUpdate: 'cascade',
  onDelete: 'cascade',
});

Lecture.belongsTo(User, {
  as: 'lecturer',
});

Lecture.belongsTo(Class, {
  as: 'class',
});

Class.belongsTo(User, {
  as: 'lecturer',
});

Class.belongsTo(Category, {
  as: 'category',
});

User.hasMany(UserClass, { foreignKey: 'userId' });
Class.hasMany(UserClass, { foreignKey: 'classId' });

function sync(...args) {
  return sequelize.sync(...args);
}

export default { sync };
export { User, UserProfile, Lecture, Class, Category };
