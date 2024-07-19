import MainLayout from '~/layouts/MainLayout';
import HomePage from '~/pages/Home/HomePage';
import Test from '~/pages/Test/test';

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '',
      element: <HomePage />,
    },
    {
      path: '/test',
      element: <Test />,
    },
  ],
};

export default MainRoutes;
