import { lazy } from 'react';

export const IndexPage = lazy(() => import('src/pages/app'));

// coupon page
export const CouponsPage = lazy(() => import('src/pages/coupons/coupons'));
export const CreateCouponPage = lazy(() => import('src/pages/coupons/create'));
export const CouponDetailPage = lazy(() => import('src/pages/coupons/detail'));
// blog page
export const BlogPage = lazy(() => import('src/pages/blog/blogs'));
export const CreateBlogPage = lazy(() => import('src/pages/blog/create'));
export const DetailBlogPage = lazy(() => import('src/pages/blog/detail'));
// webbanner page
export const WebBannerPage = lazy(() => import('src/pages/webBanner/webanners'));
export const CreateWebBannerPage = lazy(() => import('src/pages/webBanner/create'));
export const DetailWebBannerPage = lazy(() => import('src/pages/webBanner/detail'));
// Customer Group page
export const CustomerGroupPage = lazy(() => import('src/pages/customerGroups/customerGroups'));
export const CreateCustomerGroupPage = lazy(() => import('src/pages/customerGroups/create'));
export const DetailCustomerGroupPage = lazy(() => import('src/pages/customerGroups/detail'));
// settings page
export const NavDashboardPage = lazy(() => import('src/pages/settings/nav-dashboard'));
export const NavDashboardCreatePage = lazy(() => import('src/pages/settings/create-nav'));
export const NavUpdatePage = lazy(() => import('src/pages/settings/update-nav'));
export const WebConfigPage = lazy(() => import('src/pages/settings/config/web-config'));
export const SeoConfigPage = lazy(() => import('src/pages/settings/config/seo-config'));

export const dashboardRoute = [
  { element: <IndexPage />, index: true },
  { path: '/', element: <IndexPage /> },
  { path: 'blog', element: <BlogPage /> },
  { path: 'blog/create', element: <CreateBlogPage /> },
  { path: 'blog/:id', element: <DetailBlogPage /> },
  { path: 'coupons', element: <CouponsPage /> },
  { path: 'coupons/create', element: <CreateCouponPage /> },
  { path: 'coupons/:id', element: <CouponDetailPage /> },
  { path: 'webBanners', element: <WebBannerPage /> },
  { path: 'webBanners/create', element: <CreateWebBannerPage /> },
  { path: 'webBanners/:id', element: <DetailWebBannerPage /> },
  { path: 'customerGroups', element: <CustomerGroupPage /> },
  { path: 'customerGroups/create', element: <CreateCustomerGroupPage /> },
  { path: 'customerGroups/:id', element: <DetailCustomerGroupPage /> },
  { path: 'settings', element: <WebConfigPage /> },
  { path: 'settings/seo-config', element: <SeoConfigPage /> },
];
