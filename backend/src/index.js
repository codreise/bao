const express = require('express');
const authRoutes = require('./auth.routes');
const productsRoutes = require('./products.routes');
const ordersRoutes = require('./orders.routes');
const uploadRoutes = require('./upload.routes');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Bao Market API working',
  });
});

router.use('/auth', authRoutes);
router.use('/products', productsRoutes);
router.use('/orders', ordersRoutes);
router.use('/upload', uploadRoutes);

module.exports = router;
