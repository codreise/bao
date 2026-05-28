const express = require('express');
const router = express.Router();
const uploadController = require('./upload.controller');
const asyncHandler = require('./asyncHandler');

router.post('/', asyncHandler(uploadController.uploadFile));

module.exports = router;