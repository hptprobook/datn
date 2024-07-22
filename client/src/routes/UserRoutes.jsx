import ProfileLayout from '~/layouts/ProfileLayout';
import MyOrder from '~/pages/User/MyOrder';
import MyRated from '~/pages/User/MyRated';
import ProductViewed from '~/pages/User/ProductViewed';
import AddressList from '~/pages/User/Profile/AddressList';
import ChangePassword from '~/pages/User/Profile/ChangePassword';
import MyProfile from '~/pages/User/Profile/MyProfile';
import Notifies from '~/pages/User/Profile/Notifies';
import VoucherList from '~/pages/User/VoucherList';

const UserRoutes = {
  path: '/nguoi-dung',
  element: <ProfileLayout />,
  children: [
    {
      path: '',
      element: <MyOrder />,
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
