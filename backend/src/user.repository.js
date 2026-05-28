const pool = require('../db/pool');

exports.upsertUser = async ({ id, first_name, last_name, username }) => {
  const result = await pool.query(
    'INSERT INTO users (id, first_name, last_name, username) VALUES ($1, $2, $3, $4) ON CONFLICT (id) DO UPDATE SET first_name = $2, last_name = $3, username = $4 RETURNING *',
    [id, first_name, last_name, username]
  );
  return result.rows[0];
};

exports.findById = async (id) => {
  const result = await pool.query(
    'SELECT * FROM users WHERE id = $1',
    [id]
  );
  return result.rows[0];
};