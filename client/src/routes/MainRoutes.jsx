import MainLayout from '~/layouts/MainLayout';
import CartPage from '~/pages/Cart';
import CategoryPage from '~/pages/Categories';
import CheckoutPage from '~/pages/Checkout';
import CheckoutConfirm from '~/pages/Checkout/CheckoutConfirm';
import HomePage from '~/pages/Home/HomePage';
import NotFoundPage from '~/pages/NotFound/404NotFound';
import PostPage from '~/pages/Post';
import PostDetail from '~/pages/Post/PostDetail';
import ProductPage from '~/pages/Products';

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '*',
      element: <NotFoundPage />,
    },
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
    {
      path: 'gio-hang',
      children: [
        {
          path: '',
          element: <CartPage />,
        },
      ],
    },
    {
      path: 'thanh-toan',
      children: [
        {
          path: '',
          element: <CheckoutPage />,
        },
        {
          path: 'xac-nhan',
          element: <CheckoutConfirm />,
        },
      ],
    },
    {
      path: 'tin-tuc',
      children: [
        {
          path: '',
          element: <PostPage />,
        },
        {
          path: ':slug',
          element: <PostDetail />,
        },
      ],
    },
  ],
};

export default MainRoutes;
