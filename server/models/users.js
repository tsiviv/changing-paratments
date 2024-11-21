const { DataTypes } = require('sequelize');
const sequelize = require('./index'); // ייבוא החיבור

// יצירת מודל של טבלת משתמשים
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
}, {
  tableName: 'users',
  timestamps: true, // תאריכי יצירה ועדכון אוטומטיים
});

module.exports = User;
