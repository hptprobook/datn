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
    title: 'user',
    path: '/user',
    icon: icon('ic_user'),
  },
  {
    title: 'product',
    path: '/products',
    icon: icon('ic_cart'),
  },
  {
    title: 'order',
    path: '/products',
    icon: icon('ic_orders'),
  },  {
    title: 'category',
    path: '/products',
    icon: icon('ic_category'),
  },
  {
    title: 'warehouse',
    path: '/products',
    icon: icon('ic_warehouse'),
  },
  {
    title: 'coupon',
    path: '/products',
    icon: icon('ic_coupon'),
  },
  {
    title: 'blog',
    path: '/blog',
    icon: icon('ic_blog'),
  },
];

export default navConfig;
