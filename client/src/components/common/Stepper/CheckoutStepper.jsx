import { FaCheck } from 'react-icons/fa';
import PropTypes from 'prop-types';

const CheckoutStepper = ({ currentStep }) => {
  const steps = [
    { number: 1, label: 'Giỏ hàng' },
    { number: 2, label: 'Thanh toán' },
    { number: 3, label: 'Hoàn thành' },
  ];

  return (
    <ol className="steps items-center flex w-full max-w-2xl text-center text-sm font-medium text-gray-500 dark:text-gray-400 sm:text-base">
      {steps.map((step, index) => {
        let status = 'waiting';
        if (index < currentStep - 1) {
          status = 'done';
        } else if (index === currentStep - 1) {
          status = 'doing';
        }

        return (
          <li
            key={index}
            className={`step overflow-hidden ${
              status === 'done'
                ? 'step-done step-success'
                : status === 'doing'
                ? 'step-active step-error'
                : ''
            }`}
          >
            <div className="step-circle">
              {status === 'done' ? (
                <FaCheck className="text-success" />
              ) : (
                step.number
              )}
            </div>
            <h3
              className={
                status === 'done'
                  ? 'text-success'
                  : status === 'doing'
                  ? 'text-error'
                  : ''
              }
            >
              {step.label}
            </h3>
          </li>
        );
      })}
    </ol>
  );
};

CheckoutStepper.propTypes = {
  currentStep: PropTypes.number.isRequired,
};

export default CheckoutStepper;
