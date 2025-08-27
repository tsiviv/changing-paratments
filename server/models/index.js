const { Sequelize } = require('sequelize');
const SMTPConnection = require('nodemailer/lib/smtp-connection');

const portsToTest = [587, 465];
const host = 'smtp.gmail.com'; // החליפו ל-SMTP שלכם
const user = process.env.EMAIL_USER;
const pass = process.env.EMAIL_PASS;

async function testSMTPPort(port, secure) {
  return new Promise((resolve) => {
    const connection = new SMTPConnection({
      host,
      port,
      secure,
      auth: { user, pass },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 10000
    });

    connection.on('error', (err) => {
      console.error(`❌ Error on port ${port}:`, err.message);
      if (err.code === 'ETIMEDOUT') console.warn('⚠ Timeout – פורט חסום או השרת לא מגיב.');
      if (err.code === 'EAUTH') console.warn('⚠ Authentication failed.');
      resolve(false);
    });

    connection.connect((err) => {
      if (err) {
        console.error(`❌ Connection failed on port ${port}:`, err.message);
        resolve(false);
      } else {
        console.log(`✅ Connection successful on port ${port}!`);
        connection.quit();
        resolve(true);
      }
    });
  });
}

(async () => {
  for (const port of portsToTest) {
    const secure = port === 465; // פורט SSL
    console.log(`🔎 Testing SMTP connection on port ${port}...`);
    await testSMTPPort(port, secure);
  }
})();


const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'mysql',
  dialectModule: require('mysql2'),
  logging: console.log,
});


module.exports = sequelize;
