const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth.middleware');
const asyncHandler = require('../middleware/asyncHandler');

router.post('/telegram', asyncHandler(authController.telegramLogin));
router.get('/me', authMiddleware, asyncHandler(authController.getMe));

module.exports = router;