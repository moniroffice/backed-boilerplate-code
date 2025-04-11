import dotenv from 'dotenv';

dotenv.config();

export default {
  port: process.env.PORT || 5000,
  mongoURI: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpire: process.env.JWT_EXPIRE || '1h',
  env: process.env.NODE_ENV || 'development'
};

