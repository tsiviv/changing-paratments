const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'mysql',
  dialectModule: require('mysql2'),
  logging: false,
});

// ייבוא המודלים שלך
require('./User');
// require('./OtherModels');

(async () => {
  try {
    await sequelize.authenticate();
    console.log('🔌 Database connected');

    // שינוי טבלאות לפי המודלים (alter: true מוסיף את השדות החדשים)
    await sequelize.sync({ alter: true });
    console.log('✅ Database synced with alter');

    process.exit(); // לסגור את התהליך אחרי הסנכרון
  } catch (error) {
    console.error('❌ Error syncing database:', error);
  }
})();

module.exports = sequelize;
