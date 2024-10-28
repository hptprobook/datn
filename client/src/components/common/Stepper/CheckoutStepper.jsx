/* eslint-disable indent */
import { FaCheck } from 'react-icons/fa';
import PropTypes from 'prop-types';
import { useNavigate, useLocation } from 'react-router-dom';

const CheckoutStepper = ({ currentStep }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const steps = [
    { number: 1, label: 'Giỏ hàng', path: '/gio-hang' },
    { number: 2, label: 'Thanh toán', path: '/thanh-toan' },
    { number: 3, label: 'Hoàn thành', path: '/hoan-thanh' },
  ];

  const handleStepClick = (stepNumber, path) => {
    if (currentStep === 3) return;
    if (stepNumber < currentStep) {
      if (stepNumber === 2) {
        const searchParams = new URLSearchParams(location.search);
        navigate(`${path}?${searchParams.toString()}`);
      } else {
        navigate(path);
      }
    }
  };

  return (
    <ol className="hidden lg:flex steps items-center w-full max-w-2xl text-center text-sm font-medium text-gray-500 dark:text-gray-400 sm:text-base">
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
                ? 'step-done step-success cursor-pointer'
                : status === 'doing'
                ? 'step-active step-error'
                : ''
            }`}
            onClick={() => handleStepClick(step.number, step.path)}
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
