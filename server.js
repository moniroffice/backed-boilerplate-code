import mongoose from 'mongoose';
import logger from './src/core/config/logger.js'; 
import app from './src/app.js'; 
import config from './src/core/config/config.js';

mongoose
  .connect(config.mongoURI)
  .then(() => {
    logger.info('MongoDB connected');
    app.listen(config.port, () => {
      logger.info(`Server running on port ${config.port}`);
    });
  })
  .catch((err) => {
    logger.error('MongoDB connection error:', err);
  });

