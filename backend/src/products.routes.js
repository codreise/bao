const express = require('express');
const router = express.Router();
const productsController = require('./products.controller');
const authMiddleware = require('./auth.middleware');
const asyncHandler = require('./asyncHandler');

router.get('/', asyncHandler(productsController.getAllProducts));
router.get('/:id', asyncHandler(productsController.getProductById));
router.post('/', authMiddleware, asyncHandler(productsController.createProduct));

module.exports = router;