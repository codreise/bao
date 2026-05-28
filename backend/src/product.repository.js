const pool = require('../db/pool');

exports.findAll = async () => {
  const result = await pool.query('SELECT * FROM products ORDER BY created_at DESC');
  return result.rows;
};

exports.findById = async (id) => {
  const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
  return result.rows[0];
};

exports.create = async ({ title, description, price, category, image_url, seller_id }) => {
  const result = await pool.query(
    'INSERT INTO products (title, description, price, category, image_url, seller_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
    [title, description, price, category, image_url, seller_id]
  );
  return result.rows[0];
};