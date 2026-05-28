const { Pool } = require('pg');
const env = require('../config/env');
const logger = require('../config/logger');

const pool = new Pool({
  connectionString: env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
});

pool.on('error', (err) => logger.error('Unexpected error on idle client', err));

module.exports = pool;
