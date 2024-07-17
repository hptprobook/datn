import MainLayout from '~/layouts/MainLayout';
import CategoryPage from '~/pages/Categories';
import HomePage from '~/pages/Home/HomePage';
import ProductPage from '~/pages/Products';

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '',
      element: <HomePage />,
    },
    {
      path: 'danh-muc-san-pham',
      children: [
        {
          path: ':slug',
          element: <CategoryPage />,
        },
      ],
    },
    {
      path: 'san-pham',
      children: [
        {
          path: ':slug',
          element: <ProductPage />,
        },
      ],
    },
  ],
};

export default MainRoutes;
