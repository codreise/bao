const pool = require('../db/pool');
const logger = require('../config/logger');

module.exports = {
  async query(text, params) {
    const start = Date.now();
    try {
      const res = await pool.query(text, params);
      const duration = Date.now() - start;
      return res;
    } catch (error) {
      throw error;
    }
  },
};
