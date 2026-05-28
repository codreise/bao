const logger = require('../config/logger');
const env = require('../config/env');

module.exports = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  if (status === 500) {
    logger.error(`${req.method} ${req.path} - Error:`, err);
  }

  res.status(status).json({
    success: false,
    error: message,
    details: env.NODE_ENV === 'development' ? err.stack : undefined,
    code: err.code
  });
};
