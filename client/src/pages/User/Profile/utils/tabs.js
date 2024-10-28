export const tabs = [
  { name: 'Tất cả đơn hàng', key: 'all', color: 'text-black' },
  { name: 'Chờ xác nhận', key: 'pending', color: 'text-blue-500' },
  { name: 'Đã xác nhận', key: 'confirmed', color: 'text-green-500' },
  { name: 'Đã giao cho ĐVVC', key: 'shipping', color: 'text-orange-500' },
  { name: 'Đã nhận hàng', key: 'delivered', color: 'text-purple-500' },
  { name: 'Hoàn trả hàng', key: 'returned', color: 'text-amber-700' },
  { name: 'Đã hoàn thành', key: 'completed', color: 'text-green-700' },
  { name: 'Đã hủy', key: 'cancelled', color: 'text-red-500' },
];

export const getStatusColor = (statusKey) => {
  const tab = tabs.find((tab) => tab.key === statusKey);
  return tab ? tab.color : 'text-gray-500';
};

export const getStatusName = (statusKey) => {
  const tab = tabs.find((tab) => tab.key === statusKey);
  return tab ? tab.name : 'Không xác định';
};
