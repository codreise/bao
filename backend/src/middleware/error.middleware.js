const errorHandler = (err, req, res, next) => {
  console.error(err.stack); // Логуємо стек помилки для дебагу

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  // У продакшн-режимі не показуємо деталі стеку
  if (process.env.NODE_ENV === 'production' && statusCode === 500) {
    return res.status(statusCode).json({
      success: false,
      message: 'Something went wrong on the server.',
    });
  }

  res.status(statusCode).json({
    success: false,
    message: message,
  });
};

module.exports = errorHandler;