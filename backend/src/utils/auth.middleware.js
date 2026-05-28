const jwt = require('jsonwebtoken');
const env = require('../config/env');
const APIError = require('../utils/apiError');

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new APIError('Unauthorized', 401);
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, env.JWT_SECRET);
    
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      next(new APIError('Invalid token', 401));
    } else if (error.name === 'TokenExpiredError') {
      next(new APIError('Token expired', 401));
    } else {
      next(error);
    }
  }
};
