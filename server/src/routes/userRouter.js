/* eslint-disable semi */
import express from 'express';
import { usersController } from '~/controllers/userController';
import isAdmin from '~/middlewares/verifyAdmin';
import verifyToken from '~/middlewares/verifyToken';

const Router = express.Router();
// user
Router.get('/me', verifyToken, (req, res) => {
  // #swagger.tags = ['Users']
  // #swagger.summary = 'Get my data...'
  usersController.getCurrentUser(req, res);
});
Router.get('/admin', verifyToken, isAdmin, (req, res) => {
  usersController.getCurrentAdmin(req, res);
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
