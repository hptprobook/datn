import express from 'express';
const Router = express.Router();

Router.get('/', (req, res) => {
  res.send('Hello from API!');
});

export const APIs = Router;
