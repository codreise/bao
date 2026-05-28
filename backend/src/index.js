const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const productsRoutes = require('./products.routes');
const uploadRoutes = require('./upload.routes');

router.use('/auth', authRoutes);
router.use('/products', productsRoutes);
router.use('/upload', uploadRoutes);

module.exports = router;