const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/upload.controller');
const asyncHandler = require('../middleware/asyncHandler');

router.post('/', asyncHandler(uploadController.uploadFile));

module.exports = router;