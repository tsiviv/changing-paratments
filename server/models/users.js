const { DataTypes } = require('sequelize');
const sequelize = require('./index'); // ייבוא החיבור

const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  changeCount: { // שדה לספירת שינויים
    type: DataTypes.INTEGER,
    defaultValue: 0, // ברירת מחדל
  },
}, {
  tableName: 'users',
  timestamps: true, // שדה `updatedAt` יתעדכן אוטומטית
});
module.exports = User