const express = require('express');
const router = express.Router();
const ordersController = require('./orders.controller');
const authMiddleware = require('./auth.middleware');
const asyncHandler = require('./asyncHandler');

router.get('/', authMiddleware, asyncHandler(ordersController.getAllOrders));
router.get('/me', authMiddleware, asyncHandler(ordersController.getMyOrders));
router.get('/me/:id', authMiddleware, asyncHandler(ordersController.getMyOrderById));
router.get('/:id', authMiddleware, asyncHandler(ordersController.getOrderById));
router.post('/', authMiddleware, asyncHandler(ordersController.createOrder));

module.exports = router;
