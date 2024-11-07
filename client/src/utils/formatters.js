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
  return amount
    ? amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
    : 0;
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

export const formatDateToDDMMYYYY = (dateString) => {
  if (!dateString) return '';

  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

export const urlToFile = async (url, filename, mimeType) => {
  const res = await fetch(url);
  const blob = await res.blob();
  return new File([blob], filename, { type: mimeType });
};

export const formatDateToYYYYMMDD = (dateString) => {
  if (!dateString) return '';
  const [day, month, year] = dateString.split('/');
  return `${year}-${month}-${day}`;
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

// Hàm định dạng số điện thoại Việt Nam
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
