const express = require('express');
const uploadRoutes = require('./upload.routes');

const router = express.Router();

// Монтуємо роути для завантаження
router.use('/upload', uploadRoutes);

// Додайте інші роути тут
module.exports = router;