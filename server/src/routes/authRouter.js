/* eslint-disable semi */
import express from 'express';
import { authController } from '~/controllers/authController';
import verifyToken from '~/middlewares/verifyToken';
// import isAdmin from '~/middlewares/isAdmin';

const Router = express.Router();

Router.post('/send-sms', authController.sendSMS);
Router.post('/register', authController.register);
Router.post('/login', authController.login);
Router.post('/loginSocial', authController.loginSocial);
Router.post('/logout', verifyToken, authController.logout);
Router.post('/changePassword', verifyToken, authController.changePassword);
Router.post('/otps', authController.getOtp);
Router.post('/otps/verify', authController.checkOtp);
Router.put('/otps/reset-password', authController.changePassWordByOtp);
Router.post('/refresh-token', authController.refreshToken);

export const authApi = Router;
