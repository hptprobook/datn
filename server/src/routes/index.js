import express from 'express';
import { usersApi } from './userRouter';
import { categoriesApi } from './categoryRouter';

import { cartsApi } from './cartRouter';
import { ordersApi } from './orderRouter';
import { reviewsApi } from './reviewRouter';

import { suppliersApi } from './supplierRoute';
import { productsApi } from './productRouter';
import { warehousesApi } from './warehouseRouter';
import { authApi } from './authRouter';
import { paysApi } from './payRouter';

import { paymentApi } from './paymentRouter';

import { navDashboardApi } from './routeConfigs/navDashboardRoute';
import { webApi } from './routeConfigs/webRouter';
// seo

import { seoConfigApi } from './routeConfigs/seoConfigRouter';
import { brandsApi } from './brandRouter';

import { couponApi } from './couponRouter';
// ad
import { addressApi } from './addressRouter';
const Router = express.Router();

Router.use('/auth', authApi);
Router.use('/users', usersApi);
Router.use('/categories', categoriesApi);

Router.use('/carts', cartsApi);
Router.use('/orders', ordersApi);
Router.use('/reviews', reviewsApi);

Router.use('/suppliers', suppliersApi);
Router.use('/warehouses', warehousesApi);
Router.use('/products', productsApi);
Router.use('/brands', brandsApi);

Router.use('/pays', paysApi);
Router.use('/payments', paymentApi);

Router.use('/seo', seoConfigApi);
Router.use('/web', webApi);
Router.use('/coupons', couponApi);

Router.use('/navDashboard', navDashboardApi);
Router.use('/address', addressApi);

Router.get('/', (req, res) => {
  res.send('Hello from API!');
});

export const APIs = Router;
