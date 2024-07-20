import express from 'express';
import { usersApi } from './userRouter';
import { categoriesApi } from './categoryRouter';

import { cartsApi } from './cartRouter';
import { ordersApi } from './orderRouter';

import { suppliersApi } from './supplierRoute';
import { productsApi } from './productRouter';

const Router = express.Router();

Router.use('/users', usersApi);
Router.use('/categories', categoriesApi);

Router.use('/carts', cartsApi);
Router.use('/orders', ordersApi);

Router.use('/suppliers', suppliersApi);
Router.use('/products', productsApi);


Router.get('/', (req, res) => {
  res.send('Hello from API!');
});

export const APIs = Router;
