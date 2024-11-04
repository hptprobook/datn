const navConfig = [
  {
    title: 'Thống kê',
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
    title: 'Nhóm khách hàng',
    path: '/customerGroups',
    icon: 'ion:people',
    child: undefined,
  },
  {
    title: 'Banner',
    path: '/webBanners',
    icon: 'ion:image',
    child: undefined,
  },
  {
    title: 'Cài đặt',
    path: '/settings',
    icon: 'ion:settings',
    child: [
      {
        title: 'Cài đặt trang web',
        path: '/settings',
        icon: 'mdi:web',
      },
      {
        title: 'Cài đặt SEO',
        path: '/settings/seo-config',
        icon: 'tabler:seo',
      },
    ],
  },
];

export default navConfig;
