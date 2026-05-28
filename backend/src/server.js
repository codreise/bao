require('dotenv').config();

const app = require('./app');
const env = require('./config/env');
const { connectDb } = require('./config/db');

const startServer = async () => {
  try {
    // Підключення до бази даних
    await connectDb();
    console.log('✅ Connected to PostgreSQL database');

    // Запуск Express сервера
    const PORT = env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT} in ${env.NODE_ENV} mode`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();