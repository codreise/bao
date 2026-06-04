const { Pool } = require('pg');
const env = require('./env');

let pool;

const ensureSchema = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS orders (
      id BIGSERIAL PRIMARY KEY,
      seller_id TEXT,
      buyer_id TEXT,
      items JSONB NOT NULL DEFAULT '[]'::jsonb,
      total NUMERIC(12, 2) NOT NULL DEFAULT 0,
      buyer_name TEXT NOT NULL,
      buyer_email TEXT NOT NULL,
      shipping_address TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    ALTER TABLE orders ADD COLUMN IF NOT EXISTS seller_id TEXT;
    ALTER TABLE orders ADD COLUMN IF NOT EXISTS buyer_id TEXT;
    ALTER TABLE orders ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

    CREATE INDEX IF NOT EXISTS orders_seller_id_idx ON orders (seller_id);
    CREATE INDEX IF NOT EXISTS orders_created_at_idx ON orders (created_at DESC);
  `);
};

const connectDb = async () => {
  if (!pool) {
    pool = new Pool({
      connectionString: env.DATABASE_URL,
      ssl: env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    });
  }

  await pool.query('SELECT 1');
  await ensureSchema();
};

const getPool = () => pool;

module.exports = { connectDb, getPool };
