const db = require('..');
const { DataTypes } = require('sequelize');

const UserModel = db.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  uid: {
    type: DataTypes.STRING(256),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(320),
    allowNull: false,
    unique: true
  },
  username: {
    type: DataTypes.STRING(64),
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING(128),
    allowNull: false
  },
  userRoleId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  isEmailVerified: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  verificationToken: {
    type: DataTypes.STRING(255),
    allowNull: true // Allow null initially until the user is verified
  },
  // Add resetPasswordToken and resetPasswordExpires fields
  resetPasswordToken: {
    type: DataTypes.STRING(255), // Consider the appropriate size for your token
    allowNull: true // Initially, there won't be a reset token
  },
  resetPasswordExpires: {
    type: DataTypes.DATE, // Stores the expiry time for the reset token
    allowNull: true // Initially, there won't be an expiry time
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'user', // Specify table name explicitly
});

module.exports = UserModel;
