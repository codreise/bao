const { Pool } = require('pg');
const env = require('../config/env'); // Correct relative path
const logger = require('../config/logger'); // Correct relative path

const pool = new Pool({
  connectionString: env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
});

pool.on('error', (err) => logger.error('Unexpected error on idle client', err));

module.exports = pool;
