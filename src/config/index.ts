import dotenv from 'dotenv';

dotenv.config();

export default {
  PORT: process.env.PORT,
  MONGODB_URI: process.env.MONGODB_URI,
  DOMAIN: process.env.DOMAIN,
  JWT_SECRET: process.env.JWT_SECRET,
};
