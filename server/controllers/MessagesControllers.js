const { Resend } = require('resend');
const Message = require('../models/Messages'); // ודא שהנתיב לקובץ המודל נכון

const resend = new Resend(process.env.SEND_API_KEY);

exports.postMessage = async (req, res) => {
    const { username, message, rating } = req.body;
    console.log(username, message, rating);
    if (!username || !message || !rating) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        const newWantedApartment = await Message.create({
            message,
            rating,
            username
        });
        
        const emailContent = `שם: ${newWantedApartment.username} ההודעה: ${newWantedApartment.message} תאריך: ${newWantedApartment.createdAt}: דרוג: ${rating}`;
        await SendEmail(emailContent);
        
        res.status(201).json(newWantedApartment);
    } catch (error) {
        console.error('Error adding apartment:', error);
        res.status(500).json({ error: error.message });
    }
};

SendEmail = async (content) => {
    try {
        const { data, error } = await resend.emails.send({
            from: 'onboarding@resend.dev', // Resend דורש שכתובת ה-from תהיה בדומיין שלהם או בדומיין שאומת על ידכם
            to: process.env.EMAIL_USER,
            subject: 'קבלת הודעה ממשתמש',
            text: content,
        });

        if (error) {
            console.error('❌ Error sending email:', error);
            throw new Error('Failed to send email with Resend.');
        }

        console.log('Email sent successfully:', data);
        return 'הקוד נשלח בהצלחה למייל';
    } catch (error) {
        console.error('❌ An unexpected error occurred in SendEmail:', error);
        return error.message || 'Unknown error';
    }
};
