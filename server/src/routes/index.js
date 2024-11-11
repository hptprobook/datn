import express from 'express';

// Authentication
import { authApi } from './authRouter';

// User Management
import { usersApi } from './userRouter';
import { staffsApi } from './staffsRouter';
import { customerGroupApi } from './customerGroupRouter';
import { addressApi } from './addressRouter';

// Product & Inventory Management
import { productsApi } from './productRouter';
import { variantsApi } from './variantsRouter';
import { categoriesApi } from './categoryRouter';
import { brandsApi } from './brandRouter';
import { suppliersApi } from './supplierRoute';
import { warehousesApi } from './warehouseRouter';
import { warehouseReceiptAPI } from './routeForAdmin/warehouseReceiptRoute';

// Orders & Payments
import { ordersApi } from './orderRouter';
import { cartsApi } from './cartRouter';
import { paysApi } from './payRouter';
import { paymentApi } from './paymentRouter';
import { receiptsApi } from './receiptRouter';

// Promotions & Marketing
import { couponApi } from './couponRouter';
import { couponHistoryApi } from './couponHistoryRouter';
import { webBannerApi } from './routeForAdmin/webBannerRouter';
import { hotSearchApi } from './hotSearchRouter';

// Content & SEO
import { reviewsApi } from './reviewRouter';
import { blogApi } from './blogRouter';
import { staticPageApi } from './routeForAdmin/staticPagesRoute';
import { seoConfigApi } from './routeForAdmin/seoConfigRouter';

// Admin Dashboard & Configuration
import { navDashboardApi } from './routeForAdmin/navDashboardRoute';
import { webApi } from './routeForAdmin/webRouter';
import { timetableApi } from './routeForAdmin/timetableRouter';
import { dashboardApi } from './routeForAdmin/dashboardRoute';


const Router = express.Router();

Router.use('/auth', authApi);
Router.use('/users', usersApi);
Router.use('/categories', categoriesApi);

Router.use('/hotSearch', hotSearchApi);

Router.use('/staffs', staffsApi);

Router.use('/carts', cartsApi);
Router.use('/orders', ordersApi);
Router.use('/warehouse-receipts', warehouseReceiptAPI)
Router.use('/reviews', reviewsApi);

Router.use('/suppliers', suppliersApi);
Router.use('/warehouses', warehousesApi);
Router.use('/products', productsApi);
Router.use('/variants', variantsApi);
Router.use('/brands', brandsApi);

Router.use('/pays', paysApi);
Router.use('/payments', paymentApi);

Router.use('/seo', seoConfigApi);
Router.use('/web', webApi);
Router.use('/coupons', couponApi);
Router.use('/web-banner', webBannerApi);

Router.use('/navDashboard', navDashboardApi);
Router.use('/address', addressApi);
Router.use('/static-pages', staticPageApi);
Router.use('/customer-group', customerGroupApi);
Router.use('/timetables', timetableApi);
Router.use('/blogs', blogApi);
Router.use('/dashboard', dashboardApi);

Router.use('/couponHistory', couponHistoryApi);
Router.use('/receipts', receiptsApi);

Router.get('/', (req, res) => {
  res.send('Hello from API!');
});

export const APIs = Router;
