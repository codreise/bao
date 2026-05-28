const crypto = require('crypto');
const { z } = require('zod');

exports.validateTelegramInitData = (initData, botToken) => {
  const urlParams = new URLSearchParams(initData);
  const hash = urlParams.get('hash');
  const authDate = parseInt(urlParams.get('auth_date') || '0', 10);
  
  // 1. Check expiration (24 hours)
  const now = Math.floor(Date.now() / 1000);
  if (now - authDate > 86400) {
    return false;
  }

  urlParams.delete('hash');
  const dataCheckString = Array.from(urlParams.entries())
    .map(([key, value]) => `${key}=${value}`)
    .sort()
    .join('\n');

  const secretKey = crypto
    .createHmac('sha256', 'WebAppData')
    .update(botToken)
    .digest();

  const calculatedHash = crypto
    .createHmac('sha256', secretKey)
    .update(dataCheckString)
    .digest('hex');

  return calculatedHash === hash;
};
