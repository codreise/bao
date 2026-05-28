const jwt = require('jsonwebtoken');
const env = require('../config/env');
const { validateTelegramInitData } = require('../utils/tgValidation');
const userRepository = require('../repositories/user.repository');
const APIError = require('../utils/apiError');

exports.loginWithTelegram = async (initData) => {
  const isValid = validateTelegramInitData(initData, env.TELEGRAM_BOT_TOKEN);
  
  if (!isValid && env.NODE_ENV !== 'development') {
    throw new APIError('Invalid Telegram data', 401);
  }

  const urlParams = new URLSearchParams(initData);
  const tgUser = JSON.parse(urlParams.get('user'));

  const user = await userRepository.upsertUser({
    id: tgUser.id,
    first_name: tgUser.first_name,
    last_name: tgUser.last_name,
    username: tgUser.username
  });

  const token = jwt.sign({ id: user.id }, env.JWT_SECRET, { expiresIn: '7d' });
  
  return { token, user };
};

exports.getUserById = async (id) => {
  const user = await userRepository.findById(id);
  if (!user) throw new APIError('User not found', 404);
  return user;
};