const productsService = require('../services/products.service');
const apiResponse = require('../utils/apiResponse');

exports.getAllProducts = async (req, res) => {
  const products = await productsService.listProducts();
  return apiResponse(res, products);
};

exports.getProductById = async (req, res) => {
  const product = await productsService.getProductById(req.params.id);
  return apiResponse(res, product);
};

exports.createProduct = async (req, res) => {
  const productData = {
    ...req.body,
    seller_id: req.user.id // Now using real authenticated user ID
  };
  const newProduct = await productsService.createProduct(productData);
  return apiResponse(res, newProduct, 'Product created successfully', 201);
};