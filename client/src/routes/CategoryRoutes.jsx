import CategoryPage from '~/pages/Categories';
import NotFoundPage from '~/pages/NotFound/404NotFound';

const AuthRoutes = {
  path: '/danh-muc-san-pham',
  element: <NotFoundPage />,
  children: [
    {
      path: '/:slug',
      element: <CategoryPage />,
    },
  ],
};

export default AuthRoutes;
