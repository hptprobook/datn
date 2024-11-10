export const getDayName = (d) => {
  const dateObject = new Date(d);

  const dayOfWeek = dateObject.getDay();

  const weekDays = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  return weekDays[dayOfWeek];
};

export const orderStatus = {
  pending: 'Chờ xác nhận',
  confirmed: 'Đã xác nhận',
  shipped: 'Đã giao cho ĐVVC',
  shipping: 'Shipper đang tới',
  delivered: 'Đã nhận hàng',
  returned: 'Trả hàng',
  cancelled: 'Đã hủy',
  completed: 'Đã hoàn thành',
};
