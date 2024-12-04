import { formatDistanceToNow } from 'date-fns';
import { env } from './constants';

// Viết hoa chữ cái đầu tiên của chuỗi
export const capitalizeFirstLetter = (val) => {
  if (!val) return '';
  return `${val.charAt(0).toUpperCase()}${val.slice(1)}`;
};

// Kiểm tra xem một hình ảnh có tồn tại tại URL đã cho hay không
const checkImageExists = async (imageUrl) => {
  try {
    const response = await fetch(imageUrl, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    return false;
  }
};

// Trả về URL hình ảnh, sử dụng hình ảnh mặc định nếu URL gốc không tồn tại
export const resolveImageWithFallback = async (imageUrl) => {
  const exists = await checkImageExists(imageUrl);
  return exists
    ? imageUrl
    : 'https://www.vietnamworks.com/hrinsider/wp-content/uploads/2023/12/hinh-nen-thien-nhien-3d-001.jpg';
};

// Xử lý URL, thêm tiền tố server URL nếu cần thiết
export const resolveUrl = (url) => {
  if (
    url?.startsWith('https://') ||
    url?.startsWith('http://') ||
    url?.startsWith('//')
  ) {
    return url;
  }
  return `${env?.SERVER_URL}/${url}`;
};

// Chuyển đổi nội dung HTML thành văn bản thuần túy
export const convertHTMLToText = (htmlString) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');
  return doc.body.textContent || '';
};

// Định dạng thời gian theo kiểu "... time ago"
export const formatTimestamp = (timestamp) => {
  return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
};

// Tính khoảng cách giữa hai điểm địa lý theo công thức Haversine
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Bán kính trái đất tính theo km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Cắt ngắn chuỗi và thêm dấu ... nếu độ dài vượt quá giới hạn
export const truncateString = (str, num) => {
  if (str.length <= num) {
    return str;
  }
  return str.slice(0, num) + '...';
};

// Định dạng số tiền theo định dạng tiền tệ VND
export const formatCurrencyVND = (amount) => {
  return amount
    ? amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
    : 0;
};

// Tạo MongoDB ObjectId giả lập
export const generateMongoObjectId = () => {
  const timestamp = ((new Date().getTime() / 1000) | 0).toString(16); // 4 bytes cho timestamp
  const random = 'xxxxxxxxxx'.replace(/[x]/g, () =>
    ((Math.random() * 16) | 0).toString(16)
  ); // 5 bytes ngẫu nhiên
  const counter = 'xxx'.replace(/[x]/g, () =>
    ((Math.random() * 16) | 0).toString(16)
  ); // 3 bytes cho bộ đếm

  return timestamp + random + counter; // Định dạng MongoDB ObjectId
};

// Chuyển đổi ngày tháng sang định dạng DD/MM/YYYY
export const formatDateToDDMMYYYY = (dateString) => {
  if (!dateString) return '';

  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

// Chuyển đổi URL thành đối tượng File
export const urlToFile = async (url, filename, mimeType) => {
  const res = await fetch(url);
  const blob = await res.blob();
  return new File([blob], filename, { type: mimeType });
};

// Chuyển đổi ngày tháng từ DD/MM/YYYY sang YYYY-MM-DD
export const formatDateToYYYYMMDD = (dateString) => {
  if (!dateString) return '';
  const [day, month, year] = dateString.split('/');
  return `${year}-${month}-${day}`;
};

// Tính và hiển thị khoảng thời gian đã trôi qua bằng tiếng Việt
export const getTimeDifference = (createdAt) => {
  const now = Date.now();
  const diff = now - createdAt;

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);

  if (minutes < 1) {
    return `${seconds} giây trước`;
  } else if (minutes < 60) {
    return `${minutes} phút trước`;
  } else if (hours < 24) {
    return `${hours} giờ trước`;
  } else if (days === 1) {
    return 'Hôm qua';
  } else if (days <= 7) {
    return `${days} ngày trước`;
  } else if (days <= 30) {
    return `${Math.floor(days / 7)} tuần trước`;
  } else if (months === 1) {
    return '1 tháng trước';
  } else if (months > 1) {
    return `${months} tháng trước`;
  } else {
    // Nếu thời gian quá 1 tháng, trả về định dạng ngày cụ thể không có giờ
    const date = new Date(createdAt);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  }
};

// Định dạng số điện thoại Việt Nam theo chuẩn hiển thị
export const formatVietnamesePhoneNumber = (phoneNumber) => {
  const cleaned = phoneNumber.replace(/\D/g, '');

  if (cleaned.startsWith('84') && cleaned.length === 11) {
    return `+84 ${cleaned.slice(2, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(
      8
    )}`;
  }

  if (cleaned.startsWith('0') && cleaned.length === 10) {
    return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`;
  }

  return phoneNumber;
};
