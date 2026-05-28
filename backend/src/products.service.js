const productRepository = require('../repositories/product.repository');
const APIError = require('../utils/apiError');

exports.listProducts = async () => {
  return await productRepository.findAll();
};

exports.getProductById = async (id) => {
  const product = await productRepository.findById(id);
  if (!product) throw new APIError('Product not found', 404);
  return product;
};

exports.createProduct = async (productData) => {
  if (!productData.title || !productData.price) {
    throw new APIError('Title and Price are required', 400);
  }
  return await productRepository.create(productData);
};