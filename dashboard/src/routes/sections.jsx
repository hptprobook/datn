import {lazy, Suspense} from 'react';
import {Navigate, Outlet, useRoutes} from 'react-router-dom';

import {ProtectedRoute} from './components/ProtectedRoute';

export const IndexPage = lazy(() => import('src/pages/app'));
export const BlogPage = lazy(() => import('src/pages/blog'));

export const UserPage = lazy(() => import('src/pages/user/user'));
export const CreateUserPage = lazy(() => import('src/pages/user/createUser'));

export const LoginPage = lazy(() => import('src/pages/login'));

export const ProductsPage = lazy(() => import('src/pages/products/products'));
export const CreateProductPage = lazy(() => import('src/pages/products/createProduct'));

export const Page404 = lazy(() => import('src/pages/page-not-found'));

export  const CategoryPage = lazy(() => import('src/pages/category/category'));
export  const CreateCategoryPage = lazy(() => import('src/pages/category/createCategory'));
export  const EditCategoryPage = lazy(() => import('src/pages/category/editCategory'));

export  const WarehousePage = lazy(() => import('src/pages/warehouse/warehouse'));
export  const CouponsPage = lazy(() => import('src/pages/coupons/coupons'));
export const OrdersPage = lazy(() => import('src/pages/orders/orders'));

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    {
      element: (
          <ProtectedRoute>
            <Suspense>
              <Outlet/>
            </Suspense>
          </ProtectedRoute>
      ),
      children: [
        {element: <IndexPage/>, index: true},
        {path: 'user', element: <UserPage/>},
        {path: 'user/create', element: <CreateUserPage/>},
        {path: 'products', element: <ProductsPage/>},
        {path: 'products/create', element: <CreateProductPage/>}, 
        {path: 'blog', element: <BlogPage/>},
        {path: 'category', element: <CategoryPage/>},
        {path: 'category/create', element: <CreateCategoryPage/>},
        {path: 'category/edit/:id', element: <EditCategoryPage/>},
        {path: 'warehouse', element: <WarehousePage/>},
        {path: 'coupons', element: <CouponsPage/>},
        {path: 'orders', element: <OrdersPage/>},
      ],
    },
    {
      path: 'login',
      element: <LoginPage/>,
    },
    {
      path: '404',
      element: <Page404/>,
    },
    {
      path: '*',
      element: <Navigate to="/404" replace/>,
    },
  ]);
}
