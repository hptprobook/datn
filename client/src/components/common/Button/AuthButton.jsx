/* eslint-disable indent */
import PropTypes from 'prop-types';

const AuthButton = ({ text, isLoading, type = 'button', ...rest }) => {
  return (
    <button
      className={`inline-block shrink-0 rounded-md px-12 py-3 text-sm font-medium transition focus:outline-none focus:ring w-full md:w-auto
      ${
        isLoading
          ? 'bg-gray-400 border-gray-400 text-white cursor-not-allowed'
          : 'bg-blue-600 border-blue-600 text-white hover:bg-red-500 hover:text-white'
      }
      `}
      type={type}
      {...rest}
      disabled={isLoading}
    >
      {isLoading ? 'Đang xử lý...' : text}
    </button>
  );
};

AuthButton.propTypes = {
  text: PropTypes.string,
  isLoading: PropTypes.bool,
  type: PropTypes.string,
  ...PropTypes.any,
};

export default AuthButton;
