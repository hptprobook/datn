const navConfig = [
  {
    title: 'dashboard',
    path: '/',
    icon: 'ion:home',
    child: undefined,
  },
  {
    title: 'Người dùng',
    path: '/user',
    icon: 'ion:person',
    child: undefined,
  },
  {
    title: 'Sản phẩm',
    path: '/products',
    icon: 'ion:shirt',
    child: [
      {
        title: 'Tạo sản phẩm',
        path: '/products/create',
        icon: 'ion:add',
      },
    ],
  },
  {
    title: 'Đơn hàng',
    path: '/orders',
    icon: 'ion:cart',
   
  },
  {
    title: 'Phân loại',
    path: '/category',
    icon: 'ion:grid',
    child: [
      {
        title: 'Tạo danh mục',
        path: '/category/create',
        icon: 'ion:add',
      },
    ],
  },
  {
    title: 'Kho',
    path: '/warehouse',
    icon: 'ion:cube',
    child: undefined,
  },
  {
    title: 'Mã giảm giá',
    path: '/coupons',
    icon: 'ion:ticket',
    child: undefined,
  },
  {
    title: 'Bài viết',
    path: '/blog',
    icon: 'ion:document-text',
    child: undefined,
  },
  {
    title: 'Cài đặt',
    path: '/settings',
    icon: 'ion:settings',
    child: [
      {
        title: 'Menu Quản trị',
        path: '/settings/nav',
        icon: 'ion:list-circle',
      },
      {
        title: 'Thông tin website',
        path: '/settings/web-config',
        icon: 'ion:list-circle',
      },
    ],
  },
];

export default navConfig;