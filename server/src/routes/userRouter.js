/* eslint-disable semi */
import express from 'express';
import { usersController } from '~/controllers/userController';
import verifyAdmin from '~/middlewares/verifyAdmin';
import { isAdmin } from '~/middlewares/verifyRole';
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

Router.get('/:id', verifyToken, isAdmin, usersController.getUserById);
Router.get('/email/:email', usersController.getUserByEmail);

Router.put('/me', verifyToken, usersController.updateCurrentUser);
Router.put('/me/password', verifyToken, usersController.changePassWord);

// admin
Router.get('/', verifyToken, verifyAdmin, usersController.getAllUsers);
Router.put('/:id', verifyToken, isAdmin, usersController.updateUser);
Router.delete('/:id', verifyToken, isAdmin, usersController.deleteUser);
Router.post('/', verifyToken, isAdmin, usersController.createUser);

//favorite
Router.post('/favorite/:id', usersController.favoriteProduct);

export const usersApi = Router;
