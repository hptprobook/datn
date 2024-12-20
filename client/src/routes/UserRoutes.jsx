import ProfileLayout from '~/layouts/ProfileLayout';
import MyOrder from '~/pages/User/MyOrder';
import MyRated from '~/pages/User/MyRated';
import ProductViewed from '~/pages/User/ProductViewed';
import AddressList from '~/pages/User/Profile/AddressList';
import ChangePassword from '~/pages/User/Profile/ChangePassword';
import MyProfile from '~/pages/User/Profile/MyProfile';
import Notifies from '~/pages/User/Profile/Notifies';
import VoucherList from '~/pages/User/VoucherList';
import PrivateRoute from './PrivateRoutes';
import { Helmet } from 'react-helmet-async';
import OrderDetail from '~/pages/User/OrderDetail';

const UserRoutes = {
  path: '/nguoi-dung',
  element: (
    <PrivateRoute>
      <Helmet>
        <title>BMT Life | Hồ sơ</title>
      </Helmet>
      <ProfileLayout />
    </PrivateRoute>
  ),
  children: [
    {
      path: '',
      element: <MyOrder />,
    },
    {
      path: ':tab',
      element: <MyOrder />,
    },
    {
      path: 'don-hang/:orderCode',
      element: <OrderDetail />,
    },
    {
      path: 'tai-khoan',
      children: [
        {
          path: '',
          element: <MyProfile />,
        },
        {
          path: 'so-dia-chi',
          element: <AddressList />,
        },
        {
          path: 'thong-bao',
          element: <Notifies />,
        },
        {
          path: 'doi-mat-khau',
          element: <ChangePassword />,
        },
      ],
    },
    {
      path: 'san-pham-da-xem',
      element: <ProductViewed />,
    },
    {
      path: 'danh-gia-cua-toi',
      element: <MyRated />,
    },
    {
      path: 'kho-voucher',
      element: <VoucherList />,
    },
  ],
};

export default UserRoutes;
