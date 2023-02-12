/* eslint-disable node/no-process-env */

import dotenv from 'dotenv';

dotenv.config();

export default {
  PORT: process.env.PORT ?? 3000,
  MONGODB_URI: process.env.MONGODB_URI ?? null,
  DOMAIN: process.env.DOMAIN ?? 'http://localhost:3000',
  JWT_SECRET: process.env.JWT_SECRET ?? '',
  NODE_ENV: process.env.NODE_ENV ?? 'development',
} as const;
