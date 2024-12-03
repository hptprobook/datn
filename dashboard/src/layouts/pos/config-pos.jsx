const navConfig = [
  {
    title: 'Bán hàng',
    path: '/pos',
    icon: 'ion:cart',
    child: undefined,
  },
  {
    title: 'Hóa đơn',
    path: '/pos/receipts',
    icon: 'mdi:receipt-text',
    child: undefined,
  },
  {
    title: 'Đơn hàng',
    path: '/pos/orders',
    icon: 'ion:cart',
  },
  {
    title: 'Tra cứu đơn hàng',
    path: '/pos/tracking-order',
    icon: 'mdi:file-find',
    child: undefined,
  },
  {
    title: 'Tra cứu tồn kho',
    path: '/pos/inventory',
    icon: 'ion:cube',
    child: undefined,
  },
];

export default navConfig;
