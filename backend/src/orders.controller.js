const ordersService = require('../services/orders.service');
const apiResponse = require('../utils/apiResponse');

exports.getAllOrders = async (req, res) => {
  const orders = await ordersService.listOrders(req.user.id);
  return apiResponse(res, orders);
};

exports.getMyOrders = async (req, res) => {
  const orders = await ordersService.listOrdersByBuyer(req.user.id);
  return apiResponse(res, orders);
};

exports.getOrderById = async (req, res) => {
  const order = await ordersService.getOrderById(req.params.id, req.user.id);
  return apiResponse(res, order);
};

exports.getMyOrderById = async (req, res) => {
  const order = await ordersService.getOrderByBuyerId(req.params.id, req.user.id);
  return apiResponse(res, order);
};

exports.createOrder = async (req, res) => {
  const orderData = {
    ...req.body,
    buyer_id: req.user?.id || null,
  };

  const newOrder = await ordersService.createOrder(orderData);
  return apiResponse(res, newOrder, 'Order created successfully', 201);
};
