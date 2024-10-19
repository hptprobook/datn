import { useCart } from 'react-use-cart';
import { formatCurrencyVND } from '~/utils/formatters';
import { useNavigate } from 'react-router-dom';

const CartSummary = () => {
  const { cartTotal } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate('/thanh-toan');
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex justify-between items-center w-full mb-4">
        <h2 className="text-xl font-semibold text-gray-900 sm:text-2xl">
          Thông tin
        </h2>
      </div>
      <div className="space-y-8 rounded-lg border-2 border-gray-300 bg-white p-4 shadow-sm sm:p-6">
        <p className="text-xl font-semibold text-gray-900 text-center">
          Tổng giá trị đơn hàng
        </p>
        <p className="text-3xl font-semibold text-red-600 text-center">
          {formatCurrencyVND(cartTotal)}
        </p>

        <button
          className="btn bg-red-600 rounded-md w-full"
          onClick={handleCheckout}
        >
          Thanh toán
        </button>

        <div className="flex items-center justify-center gap-2">
          <span className="text-sm font-normal text-gray-500"> hoặc </span>
          <a
            href="#"
            title=""
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-700 underline hover:no-underline"
          >
            Tiếp tục mua sắm
            <svg
              className="h-5 w-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 12H5m14 0-4 4m4-4-4-4"
              />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
};

CartSummary.propTypes = {};

export default CartSummary;
