import { Icon } from '@iconify/react';
import PropTypes from 'prop-types';
import { formatDateToDDMMYYYY } from '~/utils/formatters';

const OrderDetailStatus = ({ status }) => {
  const currentStatus = status?.[status.length - 1]?.status;

  // Mapping các bước và trạng thái
  const steps = [
    { key: 'pending', label: 'Chờ xác nhận', icon: 'mdi:receipt-text-pending' },
    {
      key: 'confirmed',
      label: 'Đã xác nhận',
      icon: 'material-symbols-light:order-approve-rounded',
    },
    {
      key: 'shipping',
      label: 'Đã giao cho ĐVVC',
      icon: 'mdi:truck-cargo-container',
    },
    { key: 'delivered', label: 'Đã nhận hàng', icon: 'ri:user-received-fill' },
    { key: 'reviewed', label: 'Đánh giá', icon: 'fluent:comment-48-filled' },
  ];

  const isCancelled = currentStatus === 'cancelled';

  if (isCancelled) {
    steps[steps.length - 1] = {
      key: 'cancelled',
      label: 'Đã huỷ',
      icon: 'mdi:cancel',
    };
  }

  const getStepStatus = (stepKey) => {
    if (isCancelled) return 'cancelled';
    if (stepKey === currentStatus) return 'doing';
    const stepIndex = steps.findIndex((s) => s.key === stepKey);
    const currentIndex = steps.findIndex((s) => s.key === currentStatus);
    return stepIndex < currentIndex ? 'done' : 'waiting';
  };

  const getStepDate = (stepKey) => {
    const step = status?.find((s) => s.status === stepKey);
    return step ? formatDateToDDMMYYYY(step.createdAt) : null;
  };

  return (
    <div className="w-full px-24 py-4">
      <div className="relative flex items-center justify-between w-full">
        <div className="absolute left-0 top-2/4 h-0.5 w-full -translate-y-2/4 bg-gray-300"></div>
        {steps.map((step, index) => {
          const stepStatus = getStepStatus(step.key);
          const stepDate = getStepDate(step.key);
          let bgColor = 'bg-gray-300';
          let textColor = 'text-gray-400';

          if (stepStatus === 'done') {
            bgColor = 'bg-green-700';
            textColor = 'text-green-600';
          } else if (stepStatus === 'doing') {
            bgColor = 'bg-blue-500';
            textColor = 'text-blue-400';
          } else if (stepStatus === 'cancelled') {
            bgColor = 'bg-red-600';
            textColor = 'text-red-600';
          }

          return (
            <div
              key={index}
              className={`relative z-10 grid w-12 h-12 font-bold text-white ${bgColor} rounded-full place-items-center`}
            >
              <Icon className="text-2xl" icon={step.icon} />
              <div className="absolute -bottom-[4rem] w-max text-center">
                <h6
                  className={`block font-sans text-base antialiased font-semibold leading-relaxed tracking-normal ${textColor}`}
                >
                  {step.label}
                </h6>
                <p className="block font-sans text-sm antialiased font-normal leading-relaxed text-gray-500">
                  {stepDate || <span className="text-white">_</span>}
                </p>
              </div>
            </div>
          );
        })}
      </div>
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
