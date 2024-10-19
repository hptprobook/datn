const navConfig = [
  {
    title: 'dashboard',
    path: '/',
    icon: 'ion:home',
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
        title: 'Thông tin website',
        path: '/settings/web-config',
        icon: 'ion:list-circle',
      },
    ],
  },
];

export default navConfig;
