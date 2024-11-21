const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const userController = require('../controllers/UserController');
const { apiLimiter } = require('../middleware/rateLimiter');
const { authenticateToken } = require('../middleware/authMiddleware');
const { verifyToken } = require('../middleware/authMiddleware');

// רישום משתמש חדש
// router.post('/register', userController.registerUser);

router.post('/register', apiLimiter, [
  check('username', 'Username is required').notEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password must be 6 or more characters').isLength({ min: 6 }),
], userController.registerUser);

// כניסת משתמש
router.post('/login', userController.loginUser);
router.get('/:id',verifyToken, userController.getUserById);
router.put('/:id',verifyToken, userController.updateUser);
router.get('/', userController.getAllUsers);
router.post("/forgot-password", userController.ForgotPassword);
// router.delete('/delete', authenticateToken, userController.deleteUser);
router.post('/reset-password', userController.ResetPassword);

module.exports = router;
