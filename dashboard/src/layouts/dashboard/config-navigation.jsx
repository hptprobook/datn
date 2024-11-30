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
    title: 'Khách hàng',
    path: '/users',
    icon: 'ion:person',
    child: [
      {
        title: 'Danh sách khách hàng',
        path: '/users',
        icon: 'ion:person',
      },
      {
        title: 'Nhóm khách hàng',
        path: '/customerGroups',
        icon: 'ion:people',
      },
    ],
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
  {
    title: 'Tệp',
    path: '/file-manager',
    icon: 'ion:folder',
    child: undefined,
  },
  
];

export default navConfig;
