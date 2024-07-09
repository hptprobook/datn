/* eslint-disable semi */
import express from 'express';
import { usersController } from '~/controllers/userController';
import verifyToken from '~/middlewares';
import isAdmin from '~/middlewares/isAdmin';

const Router = express.Router();
Router.get('/me', verifyToken, (req, res) => {
  // #swagger.tags = ['Users']
  // #swagger.summary = 'Get my data...'
  usersController.getCurrentUser(res, req);
});
Router.get('/:id', usersController.getUserById);
Router.get('/email/:email', usersController.getUserByEmail);
Router.post('/register', usersController.register);
Router.post('/login', usersController.login);
Router.put('/me', verifyToken, usersController.updateCurrentUser);
Router.put('/me/password', verifyToken, usersController.changePassWord);

// admin
Router.get('/', verifyToken, isAdmin, usersController.getAllUsers);
Router.put('/:id', verifyToken, isAdmin, usersController.updateUser);
Router.delete('/:id', verifyToken, isAdmin, usersController.deleteUser);

export const usersApi = Router;
