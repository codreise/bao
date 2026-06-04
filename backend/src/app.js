const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const env = require('./config/env');
const apiRoutes = require('./index');
const errorHandler = require('./middleware/error.middleware');

const app = express();

app.set('trust proxy', env.TRUST_PROXY);

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json({ limit: '10kb' }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, error: 'Too many requests' },
});

app.use('/api/', limiter);
app.use('/api', apiRoutes);
app.use(errorHandler);

module.exports = app;
