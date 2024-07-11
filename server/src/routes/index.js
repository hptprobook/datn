import express from 'express';
import { usersApi } from './userRouter';
import { categoriesApi } from './categoryRouter';
const Router = express.Router();

Router.use('/users', usersApi);
Router.use('/categories', categoriesApi);

Router.get('/', (req, res) => {
  res.send('Hello from API!');
});

export const APIs = Router;
