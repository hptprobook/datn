import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const navConfig = [
  {
    title: 'dashboard',
    path: '/',
    icon: icon('ic_analytics'),
  },
  {
    title: 'Người dùng',
    path: '/user',
    icon: icon('ic_user'),
  },
  {
    title: 'Sản phẩm',
    path: '/products',
    icon: icon('ic_cart'),
  },
  {
    title: 'Đơn hàng',
    path: '/orders',
    icon: icon('ic_orders'),
  },  {
    title: 'Phân loại',
    path: '/category',
    icon: icon('ic_category'),
  },
  {
    title: 'Kho',
    path: '/warehouse',
    icon: icon('ic_warehouse'),
  },
  {
    title: 'Mã giảm giá',
    path: '/coupons',
    icon: icon('ic_coupon'),
  },
  {
    title: 'Bài viết',
    path: '/blog',
    icon: icon('ic_blog'),
  },
];

export default navConfig;
