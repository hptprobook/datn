/* eslint-disable semi */
import express from 'express';
import { authController } from '~/controllers/authController';
import verifyToken from '~/middlewares/verifyToken';
// import isAdmin from '~/middlewares/isAdmin';

const Router = express.Router();

Router.post('/register', authController.register);
Router.post('/login', authController.login);
Router.post('/logout', verifyToken, authController.logout);
Router.post('/otps', authController.getOtp);
Router.post('/otps/verify', authController.checkOtp);
Router.put('/otps/reset-password', authController.changePassWordByOtp);

export const authApi = Router;