import { Icon } from '@iconify/react';
import PropTypes from 'prop-types';
import { iconForNotify } from '../utils/iconForNotify';

// Hàm tính thời gian khác biệt (đã định nghĩa từ trước)
const getTimeDifference = (createdAt) => {
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
    const date = new Date(createdAt);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  }
};

const NotifyType = {
  order: 'Thông báo đơn hàng',
  system: 'Thông báo hệ thống',
  messages: 'Thông báo tin nhắn',
  offer: 'Thông báo khuyen mãi',
};

const NotifyModal = ({ notify, isOpen, onClose }) => {
  if (!isOpen) return null;

  const { icon, color } =
    iconForNotify.find((item) => item.type === notify.type) || {};
  const notifyTypeLabel = NotifyType[notify.type] || 'Thông báo';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[500]">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
        >
          <Icon
            className="w-8 h-8 cursor-pointer"
            icon="material-symbols:close-small-rounded"
          />
        </button>
        <div className="inline-flex items-center mb-4">
          <Icon icon={icon} className={`${color} mr-4 h-10 w-10`} />
          <div>
            <p className="font-bold text-lg">{notify.title}</p>
            <p className="text-sm text-gray-500">{notifyTypeLabel}</p>
          </div>
        </div>
        <p>{notify?.description}</p>
        <p className="text-sm text-gray-500 mt-4">
          {getTimeDifference(notify.createdAt)}
        </p>
        <p className="mt-4">{notify.message}</p>
      </div>
    </div>
  );
};

NotifyModal.propTypes = {
  notify: PropTypes.object.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default NotifyModal;
