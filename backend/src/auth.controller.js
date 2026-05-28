const authService = require('../services/auth.service');
const apiResponse = require('../utils/apiResponse');

exports.telegramLogin = async (req, res) => {
  const { initData } = req.body;
  const result = await authService.loginWithTelegram(initData);
  
  return apiResponse(res, {
    token: result.token,
    user: result.user
  }, 'Login successful');
};

exports.getMe = async (req, res) => {
  // User is already attached to req by authMiddleware
  const user = await authService.getUserById(req.user.id);
  return apiResponse(res, user);
};