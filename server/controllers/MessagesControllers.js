const Message = require('../models/Messages');
const nodemailer = require('nodemailer');


// קבלת כל הדירות שהמשתמשים מעוניינים בהם
exports.postMessage = async (req, res) => {
    const { username, message ,rating} = req.body;
    console.log(username, message,rating)
    if (!username || !message||!rating) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        const newWantedApartment = await Message.create({
            message,
            rating,
            username
        });
        console.log(await SendEmail(`שם: ${newWantedApartment.username} ההודעה: ${newWantedApartment.message} תאריך: ${newWantedApartment.createdAt}: דרוג${rating}` ))
        res.status(201).json(newWantedApartment);
    } catch (error) {
        console.error('Error adding apartment:', error);
        res.status(500).json({ error: error.message });
    }
};

SendEmail = async (content) => {

    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            subject: 'קבלת הודעה ממשתמש',
            text: content
        };

        await transporter.sendMail(mailOptions);

        return 'הקוד נשלח בהצלחה למייל';
    } catch (error) {
        return error
    }
}