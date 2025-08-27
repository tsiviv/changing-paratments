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


module.exports = sequelize;
