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

export const generateSlug = (text) => {
  let str = text.toLowerCase();
  str = str.normalize('NFD').replace(/[\u0300-\u036f]/g, ''); // bỏ dấu
  str = str.replace(/[đĐ]/g, 'd');
  str = str.replace(/([^0-9a-z-\s])/g, ''); // chỉ giữ lại số, chữ thường và dấu gạch ngang
  str = str.replace(/(\s+)/g, '-'); // thay khoảng trắng bằng dấu gạch ngang
  str = str.replace(/-+/g, '-'); // xóa các dấu gạch ngang liên tiếp
  str = str.replace(/^-+|-+$/g, ''); // xóa dấu gạch ngang ở đầu và cuối
  return str;
};
