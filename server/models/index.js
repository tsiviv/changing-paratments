const { Sequelize } = require('sequelize');

// יצירת חיבור למסד הנתונים
const sequelize = new Sequelize('ourdata', 'root', '1234', {
  host: 'localhost',
  dialect: 'mysql',
  dialectModule: require('mysql2'),  // שימוש ב- mysql2 כדרייבר
  logging: false // אם תרצה לכבות את הלוגים של Sequelize
});

module.exports = sequelize;
