const User = require('../models/users');
const OnwerPartments = require('../models/OnwerPartments');
const alternativePartmnets = require('../models/alternativePartmnets');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
const crypto = require('crypto'); // כדי ליצור קוד חד-פעמי

// רישום משתמש חדש
exports.registerUser = async (req, res) => {
    console.log('Request Body:', req.body);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Validation errors', errors: errors.array() });
    }

    const { username, email, password } = req.body;

    try {
        // בדיקה אם המשתמש קיים
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ message: 'User already exists' });
        }

        // הצפנת סיסמא
        const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_SALT_ROUNDS));
        const hashedPassword = await bcrypt.hash(password, salt);

        // יצירת משתמש חדש
        const newUser = await User.create({
            username,
            email,
            password: hashedPassword,
        });

        res.status(201).json({ status: 'success', message: 'User registered successfully', data: newUser });

    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ status: 'error', message: 'Server error during registration', details: error.message });
    }
};

// כניסת משתמש קיים
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ status: 'error', message: 'User not found' });
        }

        // השוואת סיסמאות
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ status: 'error', message: 'Invalid credentials' });
        }

        // יצירת JWT
        try {
            const privateKey = fs.readFileSync(path.join(__dirname, '../private.key'), 'utf8');
            const token = jwt.sign({ id: user.id, email: user.email }, privateKey, {
                algorithm: 'RS256',
                expiresIn: process.env.JWT_EXPIRES_IN,
            });
            res.status(200).json({ status: 'success', message: 'Logged in successfully', token });
        } catch (error) {
            console.error('JWT error:', error);
            res.status(500).json({ status: 'error', message: 'Error generating token', details: error.message });
        }

    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ status: 'error', message: 'Server error during login', details: error.message });
    }
};

// עדכון משתמש קיים
exports.updateUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Validation errors', errors: errors.array() });
    }

    const { username, email, password } = req.body;
    const userId = req.params.id;

    try {
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ status: 'error', message: 'User not found' });
        }

        // עדכון פרטים
        if (username) user.username = username;
        if (email) user.email = email;
        if (password) {
            const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_SALT_ROUNDS));
            user.password = await bcrypt.hash(password, salt);
        }

        await user.save();
        res.status(200).json({ status: 'success', message: 'User updated successfully', data: user });

    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ status: 'error', message: 'Server error during update', details: error.message });
    }
};

// מחיקת משתמש
exports.deleteUser = async (req, res) => {
    const userId = req.user.id;

    try {
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ status: 'error', message: 'User not found' });
        }

        await user.destroy();
        res.status(200).json({ status: 'success', message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ status: 'error', message: 'Server error during deletion', details: error.message });
    }
};

// שליפת משתמש לפי מזהה
exports.getUserById = async (req, res) => {
    const userId = req.params.id;

    try {
        const user = await User.findOne({
            where: { id: userId },
            include: [
                {
                    model: OnwerPartments,
                    as: 'Apartments'
                },
                {
                    model: alternativePartmnets,
                    as: 'WantedApartments'
                }
            ]
        });

        if (!user) {
            return res.status(404).json({ status: 'error', message: 'User not found' });
        }

        res.status(200).json(user);

    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ status: 'error', message: 'Server error during user retrieval', details: error.message });
    }
};exports.getAllUsers = async (req, res) => {
    try {
        // מביאים רק משתמשים שיש להם דירות ב-Apartments
        const users = await User.findAll({
            include: [
                {
                    model: OnwerPartments,
                    as: 'Apartments',
                    required: true // רק משתמשים שיש להם דירות
                },
                {
                    model: alternativePartmnets,
                    as: 'WantedApartments',
                    required: false // לא חובה שיהיו דירות WantedApartments
                }
            ]
        });

        console.log(users);
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ status: 'error', message: 'Server error during users retrieval', details: error.message });
    }
};

exports.ForgotPassword = async (req, res) => {

    const { email } = req.body;

    console.log(email, process.env.EMAIL_USER, process.env.EMAIL_PASS)

    try {
        // חיפוש המשתמש במערכת לפי המייל
        const user = await User.findOne({
            where: { email: email } // תקין: המאפיין נמצא בתוך `where`
        });

        if (!user) {
            return res.status(400).json({ message: 'שגיאה משתמש לא נמצא' });
        }

        // יצירת קוד אקראי לשחזור סיסמה
        const resetCode = Math.floor(10000 + Math.random() * 90000).toString();

        // שמירה זמנית של הקוד בזיכרון (session)
        req.session.resetCode = resetCode;
        req.session.resetCodeTime = Date.now();


        // יצירת קישור לשחזור סיסמה

        // שליחת המייל עם הלינק
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'שחזור סיסמה',
            text: `שלום,\n\nל,  על  הבא:\n\n${resetCode}`
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'הקוד נשלח בהצלחה למייל' });
    } catch (error) {
        console.error('Error during password reset email sending:', error);
        res.status(500).json({ message: 'אירעה שגיאה במהלך שליחת המייל' });
    }
}
exports.ResetPassword = async (req, res) => {

    const { code, newPassword } = req.body;
    console.log(code)
    console.log(req.session.resetCode)
    try {
        // בדוק אם הקוד שהוזן תואם לקוד בזיכרון
        if (req.session.resetCode !== code || Date.now() - req.session.resetCodeTime > 15 * 60 * 1000) {
            return res.status(400).json({ message: 'הקוד לא תקין או פג תוקף' });
        }

        // חפש את המשתמש במערכת
        const user = await User.findOne({ email: req.session.email });

        if (!user) {
            return res.status(400).json({ message: 'משתמש לא נמצא' });
        }

        // עדכון הסיסמה
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        // מחיקת הקוד מה-session לאחר השחזור
        delete req.session.resetCode;
        delete req.session.resetCodeTime;

        res.status(200).json({ message: 'הסיסמה שוחזרה בהצלחה' });
    } catch (error) {
        console.error('Error during password reset:', error);
        res.status(500).json({ message: 'אירעה שגיאה במערכת' });
    }
}

