const orderRepository = require('./order.repository');
const APIError = require('./utils/apiError');

exports.listOrders = async (sellerId) => {
  if (!sellerId) {
    throw new APIError('Seller id is required', 401);
  }

  return orderRepository.findAll(sellerId);
};

exports.listOrdersByBuyer = async (buyerId) => {
  if (!buyerId) {
    throw new APIError('Buyer id is required', 401);
  }

  return orderRepository.findAllByBuyer(buyerId);
};

exports.getOrderById = async (id, sellerId) => {
  if (!sellerId) {
    throw new APIError('Seller id is required', 401);
  }

  const order = await orderRepository.findById(id, sellerId);
  if (!order) {
    throw new APIError('Order not found', 404);
  }
  return order;
};

exports.getOrderByBuyerId = async (id, buyerId) => {
  if (!buyerId) {
    throw new APIError('Buyer id is required', 401);
  }

  const order = await orderRepository.findByBuyerId(id, buyerId);
  if (!order) {
    throw new APIError('Order not found', 404);
  }
  return order;
};

exports.createOrder = async (orderData) => {
  const {
    items,
    total,
    buyer_name,
    buyer_email,
    shipping_address,
    seller_id,
    buyer_id,
  } = orderData;

  if (!Array.isArray(items) || items.length === 0) {
    throw new APIError('Order items are required', 400);
  }

  if (!buyer_name || !buyer_email || !shipping_address) {
    throw new APIError('Buyer name, email and shipping address are required', 400);
  }

  if (!seller_id) {
    throw new APIError('Seller id is required', 400);
  }

  const parsedTotal = Number(total);
  if (Number.isNaN(parsedTotal) || parsedTotal < 0) {
    throw new APIError('Total must be a valid number', 400);
  }

  return orderRepository.create({
    ...orderData,
    seller_id,
    buyer_id,
    total: parsedTotal,
  });
};
