/* eslint-disable semi */
import express from 'express';
import verifyToken from '~/middlewares';
import isAdmin from '~/middlewares/isAdmin';
import { categoryController } from '~/controllers/categoryController';

const Router = express.Router();

//admin
Router.get('/', categoryController.getAllCategories);
Router.post('/add', categoryController.createCategory);
Router.delete('/:id', categoryController.deleteCategory);
Router.put('/:id', categoryController.updateCategory);

export const categoriesApi = Router;
