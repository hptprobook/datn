import { Icon } from '@iconify/react';
import PropTypes from 'prop-types';
import { formatDateToDDMMYYYY } from '~/utils/formatters';

// Tạo một object để ánh xạ trạng thái với thông tin tương ứng từ `tabs`
const STATUS_INFO = {
  pending: {
    label: 'Chờ xác nhận',
    icon: 'mdi:receipt-text-pending',
    color: 'text-blue-500',
  },
  confirmed: {
    label: 'Đã xác nhận',
    icon: 'material-symbols-light:order-approve-rounded',
    color: 'text-green-500',
  },
  shipped: {
    label: 'Đã giao cho ĐVVC',
    icon: 'mdi:truck-cargo-container',
    color: 'text-orange-500',
  },
  shipping: {
    label: 'Shipper đang tới',
    icon: 'mdi:truck-fast-outline',
    color: 'text-purple-500',
  },
  delivered: {
    label: 'Đã nhận hàng',
    icon: 'ri:user-received-fill',
    color: 'text-amber-700',
  },
  returned: {
    label: 'Trả hàng',
    icon: 'mdi:backup-restore',
    color: 'text-green-700',
  },
  cancelled: { label: 'Đã hủy', icon: 'mdi:cancel', color: 'text-red-500' },
  completed: {
    label: 'Đã hoàn thành',
    icon: 'mdi:check-circle',
    color: 'text-indigo-500',
  },
  reviewed: {
    label: 'Đánh giá',
    icon: 'fluent:comment-48-filled',
    color: 'text-yellow-500',
  },
  paymentPending: {
    label: 'Chờ thanh toán',
    icon: 'mdi:currency-usd-off',
    color: 'text-blue-500',
  },
};

const OrderDetailStatus = ({ status }) => {
  const currentStatusKey = status?.[status.length - 1]?.status;
  const currentStatusInfo = STATUS_INFO[currentStatusKey];
  const currentStatusDate = status?.find(
    (s) => s.status === currentStatusKey
  )?.createdAt;

  return (
    <div className="flex flex-col items-center py-8">
      {currentStatusInfo ? (
        <div className="flex flex-col items-center text-center">
          <div
            className={`p-8 rounded-full bg-gray-300 ${currentStatusInfo.color}`}
          >
            <Icon className="text-6xl" icon={currentStatusInfo.icon} />
          </div>
          <h6 className="mt-4 text-lg font-semibold">
            {currentStatusInfo.label}
          </h6>
          <p className="text-gray-500 text-sm">
            {formatDateToDDMMYYYY(currentStatusDate) || '-'}
          </p>
        </div>
      ) : (
        <p className="text-gray-500">Trạng thái không xác định</p>
      )}
    </div>
  );
};

OrderDetailStatus.propTypes = {
  status: PropTypes.arrayOf(
    PropTypes.shape({
      status: PropTypes.string.isRequired,
      note: PropTypes.string,
      createdAt: PropTypes.number,
    })
  ).isRequired,
};

export default OrderDetailStatus;
