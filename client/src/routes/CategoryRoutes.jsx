import CategoryPage from '~/pages/Categories';

const AuthRoutes = {
  path: '/danh-muc-san-pham',
  children: [
    {
      path: '/:slug',
      element: <CategoryPage />,
    },
  ],
};

export default AuthRoutes;
