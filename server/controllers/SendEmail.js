const nodemailer = require('nodemailer');
const crypto = require('crypto'); // כדי ליצור קוד חד-פעמי
const User = require('./models/User'); // המודל של המשתמשים
const { Op } = require('sequelize'); // מודול לחיפושים ב-SQL

// פונקציה לשליחת קוד לשחזור סיסמא
async function sendResetPasswordEmail(email) {
  try {
    // ניצור את הקוד על ידי crypto
    const resetToken = crypto.randomBytes(20).toString('hex');
    const expirationTime = Date.now() + 3600000; // הקוד יהיה בתוקף לשעה

    // נעדכן את המשתמש בקוד החדש והזמן לתוקף
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new Error('לא נמצא משתמש עם כתובת מייל זו');
    }

    // שמירת הקוד בתוקף במסד הנתונים
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = expirationTime;
    await user.save();

    // יצירת המייל
    let transporter = nodemailer.createTransport({
      service: 'gmail', // לדוגמה, ניתן לשנות לספק אחר
      auth: {
        user: 'your-email@gmail.com', // כתובת המייל שלך
        pass: 'your-email-password',  // הסיסמה שלך
      },
    });

    // שליחת המייל
    const mailOptions = {
      from: 'your-email@gmail.com',
      to: email,
      subject: 'שחזור סיסמא',
      text: `קיבלת את הקוד לשחזור סיסמתך: ${resetToken}. הקוד יהיה בתוקף לשעה. השתמש בו לאיפוס הסיסמה.`,
    };

    await transporter.sendMail(mailOptions);

    console.log('המייל נשלח בהצלחה');
  } catch (error) {
    console.error('שגיאה בשליחת המייל:', error);
  }
}
module.exports