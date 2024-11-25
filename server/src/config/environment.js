import 'dotenv/config';

export const env = {
  MONGODB_URI: process.env.MONGODB_URI,
  DATABASE_NAME: process.env.DATABASE_NAME,
  HOST_URL: process.env.HOST_URL,
  WEB_URL: process.env.WEB_URL,
  // APP_PORT: process.env.APP_PORT,
  // BUILD_MODE: process.env.BUILD_MODE,
  SECRET: process.env.SECRET,
  PASSWORD_NODEMAILER: process.env.PASSWORD_NODEMAILER,
  EMAIL_NODEMAILER: process.env.EMAIL_NODEMAILER,
  CLIENT_URL: process.env.CLIENT_URL,
};
