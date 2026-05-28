const { z } = require('zod');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') }); // Path to .env in root

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.string().transform(Number).default('5000'),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
  TELEGRAM_BOT_TOKEN: z.string().min(1),
  TRUST_PROXY: z.string().default('1'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid environment variables:', JSON.stringify(parsed.error.format(), null, 2));
  process.exit(1);
}

module.exports = parsed.data;
