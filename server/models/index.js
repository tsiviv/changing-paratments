const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'mysql',
  dialectModule: require('mysql2'),
  logging: console.log, // אפשר לראות את כל השאילתות שמבוצעות
});

async function cleanDuplicateIndexes() {
  try {
    const [tables] = await sequelize.query("SHOW TABLES;");
    
    for (const table of tables) {
      const tableName = Object.values(table)[0];
      const [indexes] = await sequelize.query(`SHOW INDEX FROM \`${tableName}\`;`);

      const seen = new Set();
      for (const idx of indexes) {
        const key = idx.Column_name + (idx.Non_unique === 0 ? '_unique' : '');
        if (seen.has(key) && idx.Key_name !== 'PRIMARY') {
          console.log(`Deleting duplicate index ${idx.Key_name} on ${tableName}.${idx.Column_name}`);
          await sequelize.query(`DROP INDEX \`${idx.Key_name}\` ON \`${tableName}\`;`);
        } else {
          seen.add(key);
        }
      }
    }

    console.log('✅ Duplicate indexes cleaned. Running sync...');
    await sequelize.sync({ alter: true }); // או { force: true } אם רוצים למחוק ולבנות מחדש
    console.log('✅ Sync completed successfully.');
  } catch (error) {
    console.error('❌ Error cleaning indexes or syncing:', error);
  }
}

cleanDuplicateIndexes();
module.exports = sequelize;
