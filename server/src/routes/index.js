import express from 'express';
import { usersApi } from './userRouter';
const Router = express.Router();

Router.use('/users', usersApi);
Router.get('/', (req, res) => {
  res.send('Hello from API!');
});

export const APIs = Router;
