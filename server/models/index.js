const { Sequelize } = require('sequelize');
// יצירת חיבור למסד הנתונים
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'mysql',
  dialectModule: require('mysql2'),
  logging: false,
});

module.exports = sequelize;
