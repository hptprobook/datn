import { formatDistanceToNow } from 'date-fns';

export const capitalizeFirstLetter = (val) => {
  if (!val) return '';
  return `${val.charAt(0).toUpperCase()}${val.slice(1)}`;
};

export const convertHTMLToText = (htmlString) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');
  return doc.body.textContent || '';
};

export const formatTimestamp = (timestamp) => {
  return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
};

export const truncateString = (str, num) => {
  if (str.length <= num) {
    return str;
  }
  return str.slice(0, num) + '...';
};

export const formatCurrencyVND = (amount) => {
  return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
};

export const generateMongoObjectId = () => {
  const timestamp = ((new Date().getTime() / 1000) | 0).toString(16); // 4 bytes timestamp
  const random = 'xxxxxxxxxx'.replace(/[x]/g, () =>
    ((Math.random() * 16) | 0).toString(16)
  ); // 5 bytes random
  const counter = 'xxx'.replace(/[x]/g, () =>
    ((Math.random() * 16) | 0).toString(16)
  ); // 3 bytes counter

  return timestamp + random + counter; // MongoDB ObjectId format
};

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
