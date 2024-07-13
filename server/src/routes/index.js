import express from 'express';
import { usersApi } from './userRouter';
import { categoriesApi } from './categoryRouter';
import { suppliersApi } from './supplierRoute';
const Router = express.Router();

Router.use('/users', usersApi);
Router.use('/categories', categoriesApi);
Router.use('/suppliers', suppliersApi);

Router.get('/', (req, res) => {
  res.send('Hello from API!');
});

export const APIs = Router;
