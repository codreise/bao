const { Pool } = require('pg');
const env = require('./env');

let pool;

const connectDb = async () => {
  if (!pool) {
    pool = new Pool({
      connectionString: env.DATABASE_URL,
      ssl: env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false, // Для Heroku або інших провайдерів
    });
  }
  // Перевірка з'єднання
  await pool.query('SELECT 1');
};

const getPool = () => pool;

module.exports = { connectDb, getPool };