const navConfig = [
  {
    title: 'dashboard',
    path: '/admin/',
    icon: 'ion:home',
    child: undefined,
  },
  {
    title: 'Lịch làm việc',
    path: '/admin/timetables',
    icon: 'mdi:table',
    child: undefined,
  },
  {
    title: 'Khách hàng',
    path: '/admin/users',
    icon: 'ion:person',
    child: undefined,
  },
  {
    title: 'Đơn hàng',
    path: '/admin/orders',
    icon: 'ion:cart',
  },

  {
    title: 'Sản phẩm',
    path: '/admin/products',
    icon: 'ion:shirt',
    child: [
      {
        title: 'Danh sách sản phẩm',
        path: '/admin/products',
      },
      {
        title: 'Danh mục',
        path: '/admin/categories',
      },
      {
        title: 'Biến thể',
        path: '/admin/variants',
      },
    ],
  },

  {
    title: 'Kho',
    path: '/admin/warehouse',
    icon: 'ion:cube',
    child: [
      {
        title: 'Danh sách kho',
        path: '/admin/warehouse',
      },
      {
        title: 'Nhập kho',
        path: '/admin/warehouse/receipts',
      },
      {
        title: 'Nhà cung cấp',
        path: '/admin/suppliers',
      },
      {
        title: 'Nhãn hàng',
        path: '/admin/brands',
      },
    ],
  },
];

export default navConfig;
