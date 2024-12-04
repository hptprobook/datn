const navConfig = [
  {
    title: 'Dashboard',
    path: '/admin/',
    icon: 'ion:home',
    child: undefined,
  },
  // {
  //   title: 'Lịch làm việc',
  //   path: '/admin/timetables',
  //   icon: 'mdi:table',
  //   child: undefined,
  // },

  {
    title: 'Sản phẩm',
    path: '/admin/products',
    icon: 'ion:shirt',
    child: undefined,
  },
  {
    title: 'Biến thể',
    path: '/admin/variants',
    icon: 'mdi:order-bool-ascending-variant',
    child: undefined,
  },
  {
    title: 'Danh mục',
    path: '/admin/categories',
    icon: 'tabler:category-filled',
    child: undefined,
  },
  {
    title: 'Nhà cung cấp',
    path: '/admin/suppliers',
    icon: 'fluent:person-tag-20-regular',
    child: undefined,
  },
  {
    title: 'Nhãn hàng',
    path: '/admin/brands',
    icon: 'mdi:tag',
    child: undefined,
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
        title: 'Tạo hóa đơn kho',
        path: '/admin/warehouse/receipts/create',
      },
    ],
  },
];

export default navConfig;
