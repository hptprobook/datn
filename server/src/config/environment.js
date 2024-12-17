import 'dotenv/config';

export const env = {
  MONGODB_URI: process.env.MONGODB_URI,
  DATABASE_NAME: process.env.DATABASE_NAME,
  HOST_URL: process.env.HOST_URL,
  WEB_URL: process.env.WEB_URL,
  SECRET: process.env.SECRET,
  PASSWORD_NODEMAILER: process.env.PASSWORD_NODEMAILER,
  EMAIL_NODEMAILER: process.env.EMAIL_NODEMAILER,
  CLIENT_URL: process.env.CLIENT_URL,
  REDIS_URL: process.env.REDIS_URI,
  ELASTICSEARCH_NODE: process.env.ELASTICSEARCH_NODE,
  ELASTICSEARCH_API_KEY: process.env.ELASTICSEARCH_API_KEY,
};
