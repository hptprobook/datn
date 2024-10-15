import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import { Box, LinearProgress, linearProgressClasses } from '@mui/material';
import DashboardLayout from 'src/layouts/dashboard';
import WarehouseLayout from 'src/layouts/warehouse';
import { ProtectedRoute } from './components/dashboard-protected';
import { configPath } from './utils';
// ----------------------------------------------------------------------
export const IndexPage = lazy(() => import('src/pages/app'));
// user page
export const UserPage = lazy(() => import('src/pages/user/user'));
export const CreateUserPage = lazy(() => import('src/pages/user/createUser'));
export const DetailUserPage = lazy(() => import('src/pages/user/detail'));
// login page
export const LoginPage = lazy(() => import('src/pages/login'));
// product page
export const ProductsPage = lazy(() => import('src/pages/products/products'));
export const CreateProductPage = lazy(() => import('src/pages/products/createProduct'));
export const DetailProductPage = lazy(() => import('src/pages/products/detail'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));
// category page
export const CategoryPage = lazy(() => import('src/pages/categories/category'));
export const CreateCategoryPage = lazy(() => import('src/pages/categories/create'));
export const EditCategoryPage = lazy(() => import('src/pages/categories/detail'));
// config page
export const NavDashboardPage = lazy(() => import('src/pages/settings/nav-dashboard'));
export const NavDashboardCreatePage = lazy(() => import('src/pages/settings/create-nav'));
export const NavUpdatePage = lazy(() => import('src/pages/settings/update-nav'));
export const WebConfigPage = lazy(() => import('src/pages/settings/config/web-config'));
export const SeoConfigPage = lazy(() => import('src/pages/settings/config/seo-config'));
// warehouse page
export const WarehousePage = lazy(() => import('src/pages/warehouse/warehouse'));
export const WarehouseCreatePage = lazy(() => import('src/pages/warehouse/create'));
export const WarehouseEditPage = lazy(() => import('src/pages/warehouse/edit'));
// coupon page
export const CouponsPage = lazy(() => import('src/pages/coupons/coupons'));
export const CreateCouponPage = lazy(() => import('src/pages/coupons/create'));
export const CouponDetailPage = lazy(() => import('src/pages/coupons/detail'));
// supplier page
export const SuppliersPage = lazy(() => import('src/pages/suppliers/suppliers'));
export const SupplierCreatePage = lazy(() => import('src/pages/suppliers/create'));
export const SupplierDetailPage = lazy(() => import('src/pages/suppliers/detail'));
// orders page
export const OrdersPage = lazy(() => import('src/pages/orders/orders'));
export const OrderDetailPage = lazy(() => import('src/pages/orders/detail'));
// brand page
export const BrandsPage = lazy(() => import('src/pages/brands/brands'));
export const BrandCreatePage = lazy(() => import('src/pages/brands/create'));
export const BrandDetailPage = lazy(() => import('src/pages/brands/detail'));
// blog page
export const BlogPage = lazy(() => import('src/pages/blog/blogs'));
export const CreateBlogPage = lazy(() => import('src/pages/blog/create'));
export const DetailBlogPage = lazy(() => import('src/pages/blog/detail'));
// ----------------------------------------------------------------------

const childRoutes = [
  { element: <IndexPage />, index: true },
  { path: configPath.user, element: <UserPage /> },
  { path: configPath.userCreate, element: <CreateUserPage /> },
  { path: configPath.userDetail, element: <DetailUserPage /> },
  { path: configPath.products, element: <ProductsPage /> },
  { path: configPath.productCreate, element: <CreateProductPage /> },
  { path: configPath.productDetail, element: <DetailProductPage /> },
  { path: configPath.blog, element: <BlogPage /> },
  { path: configPath.blogCreate, element: <CreateBlogPage /> },
  { path: configPath.blogDetail, element: <DetailBlogPage /> },
  { path: configPath.category, element: <CategoryPage /> },
  { path: configPath.categoryCreate, element: <CreateCategoryPage /> },
  { path: configPath.categoryDetail, element: <EditCategoryPage /> },
  { path: configPath.nav, element: <NavDashboardPage /> },
  { path: configPath.navCreate, element: <NavDashboardCreatePage /> },
  { path: configPath.navDetail, element: <NavUpdatePage /> },
  { path: configPath.webConfig, element: <WebConfigPage /> },
  { path: configPath.seoConfig, element: <SeoConfigPage /> },
  { path: configPath.warehouse, element: <WarehousePage /> },
  { path: configPath.warehouseCreate, element: <WarehouseCreatePage /> },
  { path: configPath.warehouseDetail, element: <WarehouseEditPage /> },
  { path: configPath.coupons, element: <CouponsPage /> },
  { path: configPath.couponsCreate, element: <CreateCouponPage /> },
  { path: configPath.couponsDetail, element: <CouponDetailPage /> },
  { path: configPath.orders, element: <OrdersPage /> },
  { path: configPath.orderDetail, element: <OrderDetailPage /> },
  { path: configPath.suppliers, element: <SuppliersPage /> },
  { path: configPath.supplierCreate, element: <SupplierCreatePage /> },
  { path: configPath.supplierDetail, element: <SupplierDetailPage /> },
  { path: configPath.brands, element: <BrandsPage /> },
  { path: configPath.brandCreate, element: <BrandCreatePage /> },
  { path: configPath.brandDetail, element: <BrandDetailPage /> },
];

const renderFallback = (
  <Box display="flex" alignItems="center" justifyContent="center" flex="1 1 auto">
    <LinearProgress
      sx={{
        width: 1,
        maxWidth: 320,
        bgcolor: (theme) => (theme.palette.mode === 'light' ? 'primary.lighter' : 'primary.dark'),
        [`& .${linearProgressClasses.bar}`]: { bgcolor: 'text.primary' },
      }}
    />
  </Box>
);

export default function Router() {
  return useRoutes([
    {
      element: (
        <ProtectedRoute>
          <DashboardLayout>
            <Suspense fallback={renderFallback}>
              <Outlet />
            </Suspense>
          </DashboardLayout>
        </ProtectedRoute>
      ),
      children: childRoutes,
    },
    {
      path: 'dashboard',
      element: (
        <ProtectedRoute>
          <WarehouseLayout>
            <Suspense fallback={renderFallback}>
              <Outlet />
            </Suspense>
          </WarehouseLayout>
        </ProtectedRoute>
      ),
      children: [
        {
          index: true,
          element: <Box>test</Box>,
        },
      ],
    },
    {
      path: 'login',
      element: <LoginPage />,
    },
    {
      path: '404',
      element: <Page404 />,
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);
}
