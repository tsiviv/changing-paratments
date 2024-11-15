const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const userController = require('../controllers/UserController');
const { apiLimiter } = require('../middleware/rateLimiter');
const { authenticateToken } = require('../middleware/authMiddleware');
const { verifyToken } = require('../middleware/authMiddleware');

// רישום משתמש חדש
router.post('/register', userController.registerUser);

// router.post('/register', apiLimiter, [
//   check('username', 'Username is required').notEmpty(),
//   check('email', 'Please include a valid email').isEmail(),
//   check('password', 'Password must be 6 or more characters').isLength({ min: 6 }),
// ], userController.registerUser);

// כניסת משתמש
router.post('/login', apiLimiter, userController.loginUser);
router.get('/',verifyToken, userController.getUserbyId);

// עדכון משתמש קיים (מאומת)
// router.put('/update', authenticateToken, [
//   check('username', 'Username is required').optional().notEmpty(),
//   check('email', 'Please include a valid email').optional().isEmail(),
//   check('password', 'Password must be 6 or more characters').optional().isLength({ min: 6 }),
// ], userController.updateUser);

// // מחיקת משתמש קיים (מאומת)
// router.delete('/delete', authenticateToken, userController.deleteUser);

module.exports = router;
