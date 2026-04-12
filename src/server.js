require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./infrastructure/config/db');
const routes = require('./presentation/routes');
const errorHandler = require('./presentation/middlewares/errorHandler');
const requestContext = require('./presentation/middlewares/requestContext');
const notFound = require('./presentation/middlewares/notFound');
const logger = require('./shared/utils/logger');

const app = express();

const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'https://linkbunker.netlify.app',
].filter(Boolean);

app.set('trust proxy', 1);

app.use(requestContext);
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) {
      return callback(null, true);
    }

    if (process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error('Origin is not allowed by CORS policy'));
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'X-Request-Id'],
  credentials: true,
  optionsSuccessStatus: 200,
}));
app.use(express.json({ limit: '200kb' }));
app.use(express.urlencoded({ extended: true, limit: '200kb' }));

app.use('/api', routes);
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    logger.info('server.started', {
      port: PORT,
      environment: process.env.NODE_ENV || 'development',
      allowedOrigins,
    });
  });
}).catch(err => {
  logger.error('server.startup_failed', {
    message: err.message,
    stack: err.stack,
  });
  process.exit(1);
});
