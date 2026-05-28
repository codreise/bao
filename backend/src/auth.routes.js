const express = require('express');
const router = express.Router();
const authController = require('./auth.controller');
const authMiddleware = require('./auth.middleware');
const asyncHandler = require('./asyncHandler');

router.post('/telegram', asyncHandler(authController.telegramLogin));
router.get('/me', authMiddleware, asyncHandler(authController.getMe));

module.exports = router;