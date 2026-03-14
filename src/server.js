require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./infrastructure/config/db');
const routes = require('./presentation/routes');
const errorHandler = require('./presentation/middlewares/errorHandler');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
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
