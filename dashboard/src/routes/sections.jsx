import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import { ProtectedRoute } from './components/ProtectedRoute';
// ----------------------------------------------------------------------
export const IndexPage = lazy(() => import('src/pages/app'));
export const BlogPage = lazy(() => import('src/pages/blog'));
// user page
export const UserPage = lazy(() => import('src/pages/user/user'));
export const CreateUserPage = lazy(() => import('src/pages/user/createUser'));
// login page
export const LoginPage = lazy(() => import('src/pages/login'));
// product page
export const ProductsPage = lazy(() => import('src/pages/products/products'));
export const CreateProductPage = lazy(() => import('src/pages/products/createProduct'));

export const Page404 = lazy(() => import('src/pages/page-not-found'));
// category page
export const CategoryPage = lazy(() => import('src/pages/category/category'));
export const CreateCategoryPage = lazy(() => import('src/pages/category/createCategory'));
export const EditCategoryPage = lazy(() => import('src/pages/category/editCategory'));
// config page
export const NavDashboardPage = lazy(() => import('src/pages/settings/nav-dashboard'));
export const NavDashboardCreatePage = lazy(() => import('src/pages/settings/create-nav'));
export const NavUpdatePage = lazy(() => import('src/pages/settings/update-nav'));
export const WebConfigPage = lazy(() => import('src/pages/settings/config/web-config'));
export const SeoConfigPage = lazy(() => import('src/pages/settings/config/seo-config'));
// warehouse page
export const WarehousePage = lazy(() => import('src/pages/warehouse/warehouse'));
export const CouponsPage = lazy(() => import('src/pages/coupons/coupons'));
export const CreateCouponPage = lazy(() => import('src/pages/coupons/create'));
export const CouponDetailPage = lazy(() => import('src/pages/coupons/detail'));
// supplier page
export const SuppliersPage = lazy(() => import('src/pages/suppliers/suppliers'));
export const SupplierCreatePage = lazy(() => import('src/pages/suppliers/create'));
// orders page
export const OrdersPage = lazy(() => import('src/pages/orders/orders'));
export const OrderDetailPage = lazy(() => import('src/pages/orders/detail'));

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    {
      element: (
        <ProtectedRoute>
          <Suspense>
            <Outlet />
          </Suspense>
        </ProtectedRoute>
      ),
      children: [
        { element: <IndexPage />, index: true },
        { path: 'user', element: <UserPage /> },
        { path: 'user/create', element: <CreateUserPage /> },
        { path: 'products', element: <ProductsPage /> },
        { path: 'products/create', element: <CreateProductPage /> },
        { path: 'blog', element: <BlogPage /> },
        { path: 'category', element: <CategoryPage /> },
        { path: 'category/create', element: <CreateCategoryPage /> },
        { path: 'category/:id', element: <EditCategoryPage /> },
        { path: 'settings/nav', element: <NavDashboardPage /> },
        { path: 'settings/nav/create', element: <NavDashboardCreatePage /> },
        { path: 'settings/nav/:id', element: <NavUpdatePage /> },
        { path: 'settings/web-config', element: <WebConfigPage /> },
        { path: 'settings/seo-config', element: <SeoConfigPage /> },
        { path: 'warehouse', element: <WarehousePage /> },
        { path: 'coupons', element: <CouponsPage /> },
        { path: 'coupons/create', element: <CreateCouponPage /> },
        { path: 'coupons/:id', element: <CouponDetailPage /> },
        { path: 'orders', element: <OrdersPage /> },
        { path: 'orders/:id', element: <OrderDetailPage /> },
        { path: 'suppliers', element: <SuppliersPage /> },
        { path: 'suppliers/create', element: <SupplierCreatePage /> },
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
