import PropTypes from 'prop-types';
import { formatCurrencyVND } from '~/utils/formatters';

const OrderSummary = ({ totalPrice, fee, discountPrice, totalPayment, paymentMethod }) => (
  <div className="container mx-auto p-6 bg-white text-black rounded-sm mt-[1px]">
    <div className="grid grid-cols-12 gap-4 mt-6 pb-8">
      <div className="col-span-6"></div>
      <div className="col-span-12 lg:col-span-6">
        <div className="mt-4">
          <div className="flex justify-between">
            <p>Tổng tiền hàng</p>
            <p className="text-gray-800">{formatCurrencyVND(totalPrice)}</p>
          </div>
          <div className="flex justify-between mt-2">
            <p>Tổng tiền phí vận chuyển</p>
            <p className="text-red-500">+ {formatCurrencyVND(fee)}</p>
          </div>
          <div className="flex justify-between mt-2">
            <p>Voucher giảm giá</p>
            <p className="text-green-500">- {formatCurrencyVND(discountPrice)}</p>
          </div>
          <div className="flex justify-between mt-4 pt-2">
            <p className="font-semibold text-lg">Tổng thanh toán</p>
            <p className="font-bold text-red-500 text-xl">{formatCurrencyVND(totalPayment)}</p>
          </div>
        </div>
      </div>
    </div>
    <div className="text-right text-gray-500 text-sm">
      Phương thức thanh toán: {paymentMethod}
    </div>
  </div>
);

OrderSummary.propTypes = {
  totalPrice: PropTypes.number.isRequired,
  fee: PropTypes.number.isRequired,
  discountPrice: PropTypes.number.isRequired,
  totalPayment: PropTypes.number.isRequired,
  paymentMethod: PropTypes.string.isRequired,
};

export default OrderSummary;
