/* eslint-disable semi */
import express from 'express';
import { usersController } from '~/controllers/userController';
import verifyAdmin from '~/middlewares/verifyAdmin';
import verifyToken from '~/middlewares/verifyToken';

const Router = express.Router();
// user
Router.get('/me', verifyToken, (req, res) => {
  // #swagger.tags = ['Users']
  // #swagger.summary = 'Get my data...'
  usersController.getCurrentUser(req, res);
});
Router.get('/admin', verifyToken, verifyAdmin, (req, res) => {
  usersController.getCurrentAdmin(req, res);
});

Router.get('/:id', usersController.getUserById);
Router.get('/email/:email', usersController.getUserByEmail);

Router.put('/me', verifyToken, usersController.updateCurrentUser);
Router.put('/me/password', verifyToken, usersController.changePassWord);

// admin
Router.get('/', verifyToken, verifyAdmin, usersController.getAllUsers);
Router.put('/:id', verifyToken, verifyAdmin, usersController.updateUser);
Router.delete('/:id', verifyToken, verifyAdmin, usersController.deleteUser);

export const usersApi = Router;
