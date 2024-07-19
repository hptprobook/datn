/* eslint-disable semi */
import express from 'express';
import { usersController } from '~/controllers/userController';
import verifyToken from '~/middlewares';
import isAdmin from '~/middlewares/isAdmin';

const Router = express.Router();

// auth
Router.post('/register', usersController.register);
Router.post('/login', usersController.login);
Router.post('/logout', verifyToken, usersController.logout);
Router.post('/otps', usersController.getOtp);
Router.post('/otps/verify', usersController.checkOtp);
Router.put('/otps/reset-password', usersController.changePassWordByOtp);

// user
Router.get('/me', verifyToken, (req, res) => {
  // #swagger.tags = ['Users']
  // #swagger.summary = 'Get my data...'
  usersController.getCurrentUser(req, res);
});

Router.get('/:id', usersController.getUserById);
Router.get('/email/:email', usersController.getUserByEmail);

Router.put('/me', verifyToken, usersController.updateCurrentUser);
Router.put('/me/password', verifyToken, usersController.changePassWord);

// admin
Router.get('/', verifyToken, isAdmin, usersController.getAllUsers);
Router.put('/:id', verifyToken, isAdmin, usersController.updateUser);
Router.delete('/:id', verifyToken, isAdmin, usersController.deleteUser);

export const usersApi = Router;
