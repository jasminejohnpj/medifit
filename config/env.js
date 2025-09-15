/* eslint-disable no-undef */

import { config } from "dotenv";

//  const env_type = global.process.env.NODE_ENV || 'development'
// config({ path: `.env` });

config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });
export const {
  DB_NAME,
  DB_USER,
  DB_PASSWORD,
  DB_HOST,
  DB_DIALECT,
  SERVER_PORT,
  NODE_ENV ,
  JWT_SECRET,
  JWT_EXPIRES_IN
} = process.env;

