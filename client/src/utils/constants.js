export const checkoutSteps = [
  { number: 1, label: 'Giỏ hàng', status: 'done' },
  { number: 2, label: 'Thanh toán', status: 'doing' },
  { number: 3, label: 'Hoàn thành', status: 'waiting' },
];

export const env = {
  API_URL: import.meta.env.VITE_API_ROOT,
  SERVER_URL: import.meta.env.VITE_SERVER_URL,
  DOMAIN: import.meta.env.VITE_DOMAIN,
  GHN_SHOP_ID: import.meta.env.VITE_GHN_SHOP_ID,
  GHN_TOKEN: import.meta.env.VITE_GHN_TOKEN,
  GHN_URL: import.meta.env.VITE_GHN_URL,
};
