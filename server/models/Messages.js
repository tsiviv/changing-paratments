// models/Message.js
const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const Message = sequelize.define('Message', {
  message: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  username: {
    type: DataTypes.TEXT,
    allowNull: false
  }
}, {
  tableName: 'messages',
  timestamps: true
});

module.exports = Message;
