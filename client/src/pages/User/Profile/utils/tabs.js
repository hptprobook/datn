export const tabs = [
  {
    step: 1,
    name: 'Tất cả đơn hàng',
    key: 'all',
    color: 'text-black',
    icon: '',
  },
  {
    step: 2,
    name: 'Chờ xác nhận',
    key: 'pending',
    color: 'text-blue-500',
    icon: 'mdi:receipt-text-pending',
  },
  {
    step: 3,
    name: 'Đã xác nhận',
    key: 'confirmed',
    color: 'text-green-500',
    icon: 'material-symbols-light:order-approve-rounded',
  },
  {
    step: 4,
    name: 'Đã giao cho ĐVVC',
    icon: 'mdi:truck-cargo-container',
    key: 'shipped',
    color: 'text-orange-500',
  },
  {
    step: 5,
    name: 'Shipper đang tới',
    icon: 'mdi:truck-fast-outline',
    key: 'shipping',
    color: 'text-purple-500',
  },
  {
    step: 6,
    name: 'Đã nhận hàng',
    key: 'delivered',
    icon: 'ri:user-received-fill',
    color: 'text-amber-700',
  },
  {
    step: 0,
    name: 'Trả hàng',
    icon: 'mdi:backup-restore',
    key: 'returned',
    color: 'text-green-700',
  },
  {
    step: 0,
    name: 'Đã hủy',
    key: 'cancelled',
    icon: 'mdi:cancel',
    color: 'text-red-500',
  },
  {
    step: 0,
    name: 'Đã hoàn thành',
    icon: 'mdi:check-circle',
    key: 'completed',
    color: 'text-indigo-500',
  },
];

export const getStatusColor = (statusKey) => {
  const tab = tabs.find((tab) => tab.key === statusKey);
  return tab ? tab.color : 'text-gray-500';
};

export const getStatusName = (statusKey) => {
  const tab = tabs.find((tab) => tab.key === statusKey);
  return tab ? tab.name : 'Không xác định';
};
