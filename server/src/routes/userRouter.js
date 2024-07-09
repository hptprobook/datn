/* eslint-disable semi */
import express from 'express';
import { usersController } from '~/controllers/userController';
import verifyToken from '~/middlewares';
import isAdmin from '~/middlewares/isAdmin';

const Router = express.Router();

Router.get('/one', verifyToken, usersController.getUserMiddlewaresId);
Router.get('/:id', usersController.getUserID);
Router.get('/email/:email', usersController.getUserEmail);

Router.post('/', usersController.register);
Router.post('/login', usersController.login);
Router.put('/', verifyToken, usersController.update);
Router.put('/changePass', verifyToken, usersController.changePassWord);

// admin
Router.get('/', verifyToken, isAdmin, usersController.getUserAll);
Router.put('/updateAdmin/:user_id', verifyToken, usersController.updateAdmin);

export const usersApi = Router;
