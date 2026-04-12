require('dotenv').config();
const mongoose = require('mongoose');
const logger = require('../../shared/utils/logger');

const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error('MONGO_URI is not defined in environment variables');

  const conn = await mongoose.connect(uri);
  logger.info('database.connected', {
    host: conn.connection.host,
    name: conn.connection.name,
  });
};

module.exports = connectDB;
