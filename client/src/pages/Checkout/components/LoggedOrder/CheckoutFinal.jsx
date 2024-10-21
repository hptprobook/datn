// import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';

const CheckoutMethod = () => {
  return (
    <div className="px-4 py-8 shadow-md text-gray-900 rounded-sm bg-gray-50 mt-4 sm:px-6 lg:px-8">
      <div className="md:flex justify-between items-center border-b border-gray-200 pb-8">
        <h3 className="font-semibold text-xl">Phương thức thanh toán</h3>
        <div className="flex items-center gap-4">
          <span>Thanh toán khi nhận hàng</span>
          <button className="text-blue-500 hover:underline hover:text-red-600">
            Thay đổi
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4 mt-6 border-b border-gray-200 pb-8">
        <div className="col-span-6"></div>

        <div className="col-span-12 lg:col-span-6">
          <div className="mt-4">
            <div className="flex justify-between">
              <p>Tổng tiền hàng</p>
              <p>₫3.743.450</p>
            </div>
            <div className="flex justify-between mt-2">
              <p>Tổng tiền phí vận chuyển</p>
              <p className="text-red-500">+ ₫776.400</p>
            </div>
            <div className="flex justify-between mt-2">
              <p>Voucher giảm giá</p>
              <p className="text-green-500">-₫22.686</p>
            </div>
            <div className="flex justify-between mt-4 pt-2">
              <p className="font-semibold text-lg">Tổng thanh toán</p>
              <p className="font-bold text-red-500 text-xl">₫4.490.664</p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row justify-between items-center mt-10 pb-3">
        <p className="text-sm text-gray-400 mt-2 text-center lg:text-left">
          Nhấn Đặt hàng đồng nghĩa với việc bạn đồng ý tuân theo Điều khoản{' '}
          <Link to="/" className="font-semibold">
            BMT Life
          </Link>
        </p>
        <button className="btn rounded-md bg-red-500 hover:bg-red-600 text-white w-full md:w-48 mt-4 lg:mt-0">
          Đặt hàng
        </button>
      </div>
    </div>
  );
};

const CheckoutVoucher = () => {
  return (
    <div className="px-4 py-5 shadow-md text-gray-900 rounded-sm bg-gray-50 mt-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Icon icon="ri:coupon-line" className="text-red-600 text-2xl" />
          <p className="ml-2">BMT Life Voucher</p>
        </div>
        <button className="text-blue-500">Chọn Voucher</button>
      </div>
      <div className="container mx-auto mt-8">
        <div className="mt-4 bg-gradient-to-br from-red-400 to-red-700 text-white text-center py-1 px-20 rounded-lg shadow-md relative">
          <h3 className="text-xl font-semibold my-4">
            Giảm giá 20% cho đơn hàng trên 100.000đ
          </h3>

          <div className="w-10 h-7 bg-gray-50 rounded-full absolute top-1/2 transform -translate-y-1/2 left-0 -ml-6"></div>
          <div className="w-10 h-7 bg-gray-50 rounded-full absolute top-1/2 transform -translate-y-1/2 right-0 -mr-6"></div>
        </div>
      </div>
    </div>
  );
};

const CheckoutFinal = () => {
  return (
    <>
      <CheckoutVoucher />

      <CheckoutMethod />
    </>
  );
};

CheckoutFinal.propTypes = {};

export default CheckoutFinal;
