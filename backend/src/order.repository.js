const pool = require('./db/pool');

const normalizeOrder = (order) => ({
  ...order,
  total: Number(order.total),
  created_date: order.created_at,
});

exports.findAll = async (sellerId) => {
  const result = await pool.query(
    'SELECT * FROM orders WHERE seller_id = $1 ORDER BY created_at DESC',
    [sellerId]
  );
  return result.rows.map(normalizeOrder);
};

exports.findAllByBuyer = async (buyerId) => {
  const result = await pool.query(
    'SELECT * FROM orders WHERE buyer_id = $1 ORDER BY created_at DESC',
    [buyerId]
  );
  return result.rows.map(normalizeOrder);
};

exports.findById = async (id, sellerId) => {
  const result = await pool.query(
    'SELECT * FROM orders WHERE id = $1 AND seller_id = $2',
    [id, sellerId]
  );
  return result.rows[0] ? normalizeOrder(result.rows[0]) : null;
};

exports.findByBuyerId = async (id, buyerId) => {
  const result = await pool.query(
    'SELECT * FROM orders WHERE id = $1 AND buyer_id = $2',
    [id, buyerId]
  );
  return result.rows[0] ? normalizeOrder(result.rows[0]) : null;
};

exports.create = async ({
  seller_id,
  buyer_id,
  items,
  total,
  buyer_name,
  buyer_email,
  shipping_address,
  status = 'pending',
}) => {
  const result = await pool.query(
    `INSERT INTO orders (
      seller_id,
      buyer_id,
      items,
      total,
      buyer_name,
      buyer_email,
      shipping_address,
      status
    ) VALUES ($1, $2, $3::jsonb, $4, $5, $6, $7, $8)
    RETURNING *`,
    [
      seller_id,
      buyer_id,
      JSON.stringify(items || []),
      total,
      buyer_name,
      buyer_email,
      shipping_address,
      status,
    ]
  );

  return normalizeOrder(result.rows[0]);
};
