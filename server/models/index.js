const { Sequelize } = require('sequelize');
const SMTPConnection = require('nodemailer/lib/smtp-connection');

const connection = new SMTPConnection({
  host: 'smtp.gmail.com', // החליפו ל-SMTP שלכם
  port: 587,              // 465 אם SSL
  secure: false,          // true אם פורט 465
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS // מומלץ App Password אם Gmail
  },
  connectionTimeout: 10000,  // זמן סבלנות לחיבור
  greetingTimeout: 10000,    // זמן סבלנות לברכה מהשרת
  socketTimeout: 10000       // זמן סבלנות לסוקט
});

connection.on('error', (err) => {
  console.error('❌ Emitted error event:');
  console.error('Error code:', err.code || 'N/A');
  console.error('Error message:', err.message);
  console.error('Stack trace:', err.stack);
  
  if (err.code === 'ETIMEDOUT') console.warn('⚠ Connection timed out – פורט חסום או השרת לא מגיב.');
  if (err.code === 'EAUTH') console.warn('⚠ Authentication failed – בדקו שם משתמש/סיסמה.');
  if (err.responseCode === 554) console.warn('⚠ Server rejected the connection – בדקו host/port.');
});

console.log('✉️ מנסה להתחבר ל-SMTP...');
connection.connect(err => {
  if (err) {
    console.error('❌ Connection failed:', err.message);
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
