import { includes } from "lodash";

export const configPath = {
  dashboard: '/',
  blog: 'blog',
  blogCreate: 'blog/create',
  blogDetail: 'blog/:id',
  webConfig: 'settings/web-config',
  seoConfig: 'settings/seo-config',
  coupons: 'coupons',
  couponsCreate: 'coupons/create',
  couponsDetail: 'coupons/:id',
  webBanner: 'webBanners',
  webBannerCreate: 'webBanner/create',
  webBannerDetail: 'webBanner/:id',
};
export const arrPath = Object.values(configPath).filter((item) => !includes(item, ':'));