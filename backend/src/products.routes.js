const express = require('express');
const router = express.Router();
const productsController = require('../controllers/products.controller');
const authMiddleware = require('../middleware/auth.middleware');
const asyncHandler = require('../middleware/asyncHandler');

router.get('/', asyncHandler(productsController.getAllProducts));
router.get('/:id', asyncHandler(productsController.getProductById));
router.post('/', authMiddleware, asyncHandler(productsController.createProduct));

module.exports = router;