const { Sequelize } = require('sequelize');
const SMTPConnection = require('nodemailer/lib/smtp-connection');

const connection = new SMTPConnection({
  host: 'smtp.gmail.com', // או ה‑SMTP שלך
  port: 587,              // או 465 אם SSL
  secure: false,          // true אם פורט 465
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  connectionTimeout: 5000,  // זמן סבלנות לחיבור
  greetingTimeout: 5000,    // זמן סבלנות לברכה מהשרת
  socketTimeout: 5000       // זמן סבלנות לסוקט
});

connection.connect(err => {
  if (err) {
    console.error('❌ Connection failed:');
    console.error('Error code:', err.code || 'N/A');
    console.error('Error message:', err.message);
    console.error('Stack trace:', err.stack);

    // דוגמאות לסוגי שגיאות נפוצות
    if (err.code === 'ETIMEDOUT') {
      console.warn('⚠ Connection timed out. ייתכן שהפורט חסום.');
    } else if (err.code === 'EAUTH') {
      console.warn('⚠ Authentication failed. בדקי שם משתמש וסיסמה.');
    } else if (err.responseCode === 554) {
      console.warn('⚠ Server rejected the connection. בדקי את ה‑host וה‑port.');
    }
  } else {
    console.log('✅ Connection successful!');
    connection.quit();
  }
});

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'mysql',
  dialectModule: require('mysql2'),
  logging: console.log,
});

async function dropIndexWithRetry(tableName, indexName, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await sequelize.query(`DROP INDEX \`${indexName}\` ON \`${tableName}\`;`);
      console.log(`✅ Index ${indexName} on ${tableName} dropped successfully.`);
      break;
    } catch (err) {
      if (err.code === 'ER_LOCK_DEADLOCK' && attempt < retries) {
        console.warn(`⚠ Deadlock detected while dropping ${indexName}. Retrying attempt ${attempt}/${retries}...`);
        await new Promise(res => setTimeout(res, 500)); // המתנה קצרה לפני ניסיון חוזר
      } else {
        throw err; // אם הגיע למספר הנסיונות או שגיאה אחרת – זורק הלאה
      }
    }
  }
}

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
          console.log(`🔹 Deleting duplicate index ${idx.Key_name} on ${tableName}.${idx.Column_name}`);
          await dropIndexWithRetry(tableName, idx.Key_name);
        } else {
          seen.add(key);
        }
      }
    }

    console.log('✅ Duplicate indexes cleaned. Running sync...');
    await sequelize.sync({ alter: true });
    console.log('✅ Sync completed successfully.');
  } catch (error) {
    console.error('❌ Error cleaning indexes or syncing:', error);
  }
}

cleanDuplicateIndexes();
module.exports = sequelize;
