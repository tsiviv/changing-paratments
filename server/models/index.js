const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'mysql',
  dialectModule: require('mysql2'),
  logging: console.log, // אפשר לראות את כל השאילתות שמבוצעות
});

// בדיקה בסיסית לחיבור
async function testConnectionAndIndexes() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connection has been established successfully.');

    // בדיקה של כל הטבלאות והאינדקסים
    const [tables] = await sequelize.query("SHOW TABLES;");
    console.log('📋 Tables in database:', tables.map(t => Object.values(t)[0]));

    for (const table of tables) {
      const tableName = Object.values(table)[0];
      const [indexes] = await sequelize.query(`SHOW INDEX FROM \`${tableName}\`;`);
      console.log(`🔹 Indexes for table ${tableName}:`, indexes.map(idx => ({
        name: idx.Key_name,
        column: idx.Column_name,
        unique: idx.Non_unique === 0
      })));
    }

  } catch (error) {
    console.error('❌ Unable to connect to the database or fetch indexes:', error);
  }
}

testConnectionAndIndexes();

module.exports = sequelize;
