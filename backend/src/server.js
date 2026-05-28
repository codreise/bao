const app = require('./app');
const env = require('./config/env');
const logger = require('./config/logger');

const PORT = env.PORT || 5000;

const server = app.listen(PORT, () => {
  logger.info(`Server running in ${env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Rejection! Shutting down...', err.message);
  server.close(() => process.exit(1));
});
