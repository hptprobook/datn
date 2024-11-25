import { Link } from 'react-router-dom';
import { formatCurrencyVND } from '~/utils/formatters';

const CheckoutInfo = ({
  selectedProducts,
  shippingFee,
  handleConfirmCheckout,
  isLoading,
}) => {
  return (
    <div className="mt-6 w-full space-y-6 sm:mt-8 lg:mt-0 lg:max-w-xs xl:max-w-md lg:sticky lg:top-4 lg:self-start">
      <div className="flow-root">
        <h4 className="mb-7 font-bold text-xl text-black">ĐƠN HÀNG</h4>
        <div className="-my-3 divide-gray-200">
          <dl className="flex items-center justify-between gap-4 py-3">
            <dt className="text-base font-normal text-gray-500">Tạm tính</dt>
            <dd className="text-base font-medium text-gray-900">
              {formatCurrencyVND(
                selectedProducts.reduce(
                  (total, product) => total + product.price * product.quantity,
                  0
                )
              )}
            </dd>
          </dl>

          <dl className="flex items-center justify-between gap-4 py-3">
            <dt className="text-base font-normal text-gray-500">
              Phí vận chuyển
            </dt>
            <dd className="text-base font-medium text-green-700">
              + {formatCurrencyVND(shippingFee)}
            </dd>
          </dl>

          <div className="divider" />

          <dl className="flex items-center justify-between gap-4 py-3">
            <dt className="text-base font-bold text-gray-900">Tổng tiền</dt>
            <dd className="text-2xl font-bold text-red-600">
              {formatCurrencyVND(
                selectedProducts.reduce(
                  (total, product) => total + product.price * product.quantity,
                  0
                ) + shippingFee
              )}
            </dd>
          </dl>
        </div>
      </div>

      <div className="space-y-3">
        <button
          type="button"
          className={`w-full text-center bg-red-600 rounded-md py-3 px-6 font-semibold text-lg text-white hover:bg-red-700 ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          onClick={handleConfirmCheckout}
          disabled={isLoading}
        >
          Đặt hàng
        </button>
      </div>

      <Link to="/tai-khoan/dang-ky">
        <div className="text-gray-900 text-center mt-8 px-12 hover:text-red-600 hover:underline">
          Trở thành thành viên BMT Life để nhận nhiều ưu đãi hơn
        </div>
      </Link>
    </div>
  );
};

export default CheckoutInfo;
