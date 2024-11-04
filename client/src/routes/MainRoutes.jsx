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
import SearchPage from '~/pages/Search';
import StaticPage from '~/pages/Static/StaticPage';
import TrackingOrderPage from '~/pages/TrackingOrder';

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
        {
          path: ':slug/:sort',
          element: <CategoryPage />,
        },
      ],
    },
    {
      path: 'tim-kiem',
      children: [
        {
          path: '',
          element: <SearchPage />,
        },
        {
          path: ':keyword',
          element: <SearchPage />,
        },
        {
          path: ':keyword/:sort',
          element: <SearchPage />,
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
      path: 'theo-doi-don-hang',
      children: [
        {
          path: '',
          element: <TrackingOrderPage />,
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
    {
      path: 'static',
      children: [
        {
          path: ':slug',
          element: <StaticPage />,
        },
      ],
    },
  ],
};

export default MainRoutes;
