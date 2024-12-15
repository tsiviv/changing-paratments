const { Sequelize } = require('sequelize');
// יצירת חיבור למסד הנתונים
const sequelize = new Sequelize(process.env.DATABASE_DB, process.env.DATABASE_USER, process.env.DATABASE_PASSWORD, {
  host: process.env.DATABASE_HOST,
  dialect: 'mysql',
  dialectModule: require('mysql2'),  // שימוש ב- mysql2 כדרייבר
  logging: false // אם תרצה לכבות את הלוגים של Sequelize
});
module.exports = sequelize;
