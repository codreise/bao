const express = require('express');
const uploadService = require('../services/upload.service');

const router = express.Router();

router.post('/', async (req, res, next) => {
  try {
    const result = await uploadService.processUpload(req.body);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error); // Передаємо помилку до централізованого обробника
  }
});

module.exports = router;