import { Icon } from '@iconify/react';
import { FaTimes } from 'react-icons/fa';
import PropTypes from 'prop-types';

const SelectCoupon = ({
  isOpen,
  onClose,
  isClosing,
  coupons,
  selectedDiscount,
  handleCouponSelect,
  visibleCounts,
  handleShowMore,
  couponCode,
  setCouponCode,
  handleApplyCoupon,
  applyCouponError,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-300 ${
        isClosing ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div
        className="absolute inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>
      <div className="bg-white p-6 rounded-lg relative z-10  min-w-[80%] md:min-w-[700px] max-w-[800px] max-h-[80vh] overflow-y-auto hide-scrollbar">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-black"
          onClick={onClose}
        >
          <FaTimes size={20} />
        </button>

        <h2 className="font-bold text-black mb-4">Nhập mã giảm giá</h2>
        <div className="w-full flex md:block">
          <input
            type="text"
            className="w-[60%] md:w-[80%] border border-gray-300 h-[40px] px-4 bg-white text-gray-600 rounded-s-md"
            placeholder="Nhập mã giảm giá"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
          />
          <button
            onClick={handleApplyCoupon}
            className="w-[40%] md:w-[20%] bg-red-500 text-white px-4 h-[40px] rounded-e-md"
          >
            Áp dụng
          </button>
        </div>
        {applyCouponError && (
          <span className="text-red-500 text-sm">
            {applyCouponError?.message}
          </span>
        )}
        <div>
          {['shipping', 'order'].map((type) => (
            <div key={type} className="mb-6">
              <h3 className="text-lg font-semibold mb-2 capitalize">
                {type === 'order' ? 'Giảm giá cho đơn hàng' : 'Phí vận chuyển'}
              </h3>
              <ul className="space-y-3">
                {coupons[type].slice(0, visibleCounts[type]).map((coupon) => (
                  <li
                    key={coupon._id}
                    className={`flex relative md:static items-center justify-between rounded-md cursor-pointer px-8 py-2 border ${
                      (type === 'order' &&
                        (selectedDiscount.orderPercent?._id === coupon._id ||
                          selectedDiscount.orderPrice?._id === coupon._id)) ||
                      (type === 'shipping' &&
                        selectedDiscount.shipping?._id === coupon._id)
                        ? 'bg-red-50 border-red-400'
                        : ''
                    }`}
                  >
                    <div
                      onClick={() => handleCouponSelect(coupon, type)}
                      className="flex items-center space-x-8"
                    >
                      <div>
                        <Icon
                          className="text-2xl md:text-5xl text-red-600"
                          icon="icon-park-outline:ticket"
                        />
                      </div>
                      <div>
                        <p className="text-sm md:text-xl font-semibold">
                          {coupon?.name}
                        </p>
                        <p className="text-xs md:text-[16px]">
                          Mã giảm giá: <strong>{coupon?.code}</strong>
                        </p>
                        <p className="text-gray-600 text-xs md:text-[14px] mt-2">
                          {coupon?.description}
                        </p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={
                        (type === 'order' &&
                          (selectedDiscount.orderPercent?._id === coupon._id ||
                            selectedDiscount.orderPrice?._id === coupon._id)) ||
                        (type === 'shipping' &&
                          selectedDiscount.shipping?._id === coupon._id)
                      }
                      className="checkbox h-5 w-5 text-red-600"
                      onChange={() => handleCouponSelect(coupon, type)}
                    />
                  </li>
                ))}
              </ul>

              {coupons[type].length > visibleCounts[type] && (
                <button
                  onClick={() => handleShowMore(type)}
                  className="text-blue-500 hover:underline mt-2"
                >
                  Xem thêm
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="sticky bottom-0 right-8 flex justify-end gap-3">
          <button
            type="submit"
            className="btn bg-red-600 rounded-md mt-4 text-white"
            onClick={onClose}
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
};

SelectCoupon.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  isClosing: PropTypes.bool.isRequired,
  coupons: PropTypes.object.isRequired,
  selectedDiscount: PropTypes.object.isRequired,
  handleCouponSelect: PropTypes.func.isRequired,
  visibleCounts: PropTypes.object.isRequired,
  handleShowMore: PropTypes.func.isRequired,
  couponCode: PropTypes.string.isRequired,
  setCouponCode: PropTypes.func.isRequired,
  handleApplyCoupon: PropTypes.func.isRequired,
  applyCouponError: PropTypes.object,
};

export default SelectCoupon;
