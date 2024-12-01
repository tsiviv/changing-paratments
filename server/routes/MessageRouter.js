const express = require('express');
const { postMessage } = require('../controllers/MessagesControllers');
const router = express.Router();
router.post('/', postMessage);

module.exports = router;
