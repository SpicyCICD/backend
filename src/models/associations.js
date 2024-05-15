const UserModel = require('./nodeDb/user.model');
const RoleModel = require('./nodeDb/role.model');

UserModel.belongsTo(RoleModel, { foreignKey: 'userRoleId', onDelete: 'SET NULL', onUpdate: 'CASCADE' });
RoleModel.hasMany(UserModel, { foreignKey: 'userRoleId', onDelete: 'SET NULL', onUpdate: 'CASCADE' });
