import { CiStar, CiUser } from 'react-icons/ci';
import { FaRegEye } from 'react-icons/fa';
import { IoBagCheckOutline } from 'react-icons/io5';
import { MdDiscount } from 'react-icons/md';

export const ProfileSideBarItems = [
  {
    path: '/nguoi-dung',
    label: 'Đơn hàng của tôi',
    icon: <IoBagCheckOutline className="text-xl" />,
  },
  {
    path: '/nguoi-dung/tai-khoan',
    label: 'Hồ Sơ',
    icon: <CiUser className="text-xl" />,
    subRoutes: [
      {
        path: '/nguoi-dung/tai-khoan',
        label: 'Hồ Sơ',
      },
      {
        path: '/nguoi-dung/tai-khoan/so-dia-chi',
        label: 'Sổ địa chỉ',
      },
      {
        path: '/nguoi-dung/tai-khoan/thong-bao',
        label: 'Thông báo',
      },
      {
        path: '/nguoi-dung/tai-khoan/doi-mat-khau',
        label: 'Đổi mật khẩu',
      },
    ],
  },
  {
    path: '/nguoi-dung/kho-voucher',
    label: 'Kho voucher',
    icon: <MdDiscount className="text-xl" />,
  },
  {
    path: '/nguoi-dung/danh-gia-cua-toi',
    label: 'Đánh giá của tôi',
    icon: <CiStar className="text-xl" />,
  },
  {
    path: '/nguoi-dung/san-pham-da-xem',
    label: 'Sản phẩm đã xem',
    icon: <FaRegEye className="text-xl" />,
  },
];
