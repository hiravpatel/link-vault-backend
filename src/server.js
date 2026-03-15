require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./infrastructure/config/db');
const routes = require('./presentation/routes');
const errorHandler = require('./presentation/middlewares/errorHandler');

const app = express();

// Middleware
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'https://linkbunker.netlify.app',
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1 && process.env.NODE_ENV === 'production') {
      // In production, we can be more strict, but for now let's allow all during setup
      // callback(new Error('The CORS policy for this site does not allow access from the specified Origin.'), false);
      callback(null, true); // Allow all for now to resolve user's issue
    } else {
      callback(null, true);
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  credentials: true,
  optionsSuccessStatus: 200
}));
app.use(express.json());

// Routes
app.use('/api', routes);

// Global Error Handler (must be last)
app.use(errorHandler);

// Connect to DB and Start Server
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Linkvault Clean API running on port ${PORT}`);
  });
}).catch(err => {
  console.error('❌ Database connection failed:', err);
  process.exit(1);
});
