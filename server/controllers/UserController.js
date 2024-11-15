const User = require('../models/users');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const fs = require('fs')
const path = require('path')
const crypto = require('crypto');

// רישום משתמש חדש
exports.registerUser = async (req, res) => {
    console.log(req.body)
    const errors = validationResult(req);
    console.log(errors)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
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

        // קריאה למפתח המוצפן

        // קרא את הסיסמה שדרושה לפענוח המפתח (הסיסמה שנבחרה בזמן יצירת המפתח)
       
            res.status(201).json({ message: 'User registered' });
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// כניסת משתמש קיים
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // השוואת סיסמאות
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        try {
            const encryptedPrivateKey = fs.readFileSync(path.join(__dirname, '../private.key'), 'utf8');
            const token = jwt.sign({ id: user.id, email: user.email }, encryptedPrivateKey, {
                algorithm: 'RS256', expiresIn: process.env.JWT_EXPIRES_IN,
            });
            res.status(201).json({ message: 'Logged in successfully', token });
        }
        catch (e) {
            console.log(e)
        }

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.updateUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;
    const userId = req.user.id;

    try {
        // שליפת המשתמש מהמסד נתונים
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // עדכון פרטים
        if (username) user.username = username;
        if (email) user.email = email;
        if (password) {
            const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_SALT_ROUNDS));
            user.password = await bcrypt.hash(password, salt);
        }

        await user.save();
        res.json({ message: 'User updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// מחיקת משתמש
exports.deleteUser = async (req, res) => {
    const userId = req.user.id;

    try {
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await user.destroy();
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// מחיקת משתמש
exports.getUserbyId = async (req, res) => {
    console.log(req.body.userId)
    const userId = req.body.userId;

    try {
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
