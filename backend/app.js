const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const env = require('./config/env');
const routes = require('./routes');
const errorHandler = require('./middleware/error.middleware');

const app = express();

// Trust proxy for production (Heroku, Vercel, Nginx)
app.set('trust proxy', env.TRUST_PROXY);

// Security & Logging
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));

// Limits
app.use(express.json({ limit: '10kb' })); 

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, error: 'Too many requests' }
});
app.use('/api/', limiter);

// Routes
app.use('/api', routes);

// Global Error Handler
app.use(errorHandler);

module.exports = app;