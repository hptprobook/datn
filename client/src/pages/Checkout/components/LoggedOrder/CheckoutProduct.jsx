// import PropTypes from 'prop-types';

const CheckoutProduct = () => {
  return (
    <div className="px-4 py-5 shadow-md text-gray-900 rounded-sm bg-gray-50 mt-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="grid grid-cols-12 text-center pb-2 mb-2 mt-3">
        <div className="col-span-6 text-left font-semibold text-lg sm:text-xl">
          Sản phẩm
        </div>
        <div className="col-span-2 text-center text-xs sm:text-sm text-gray-400 font-light">
          Đơn giá
        </div>
        <div className="col-span-2 text-center text-xs sm:text-sm text-gray-400 font-light">
          Số lượng
        </div>
        <div className="col-span-2 text-right text-xs sm:text-sm text-gray-400 font-light">
          Thành tiền
        </div>
      </div>
      <div>
        <div className="grid grid-cols-12 items-start mt-4 gap-4">
          <div className="col-span-12 sm:col-span-6 flex">
            <img
              src="https://via.placeholder.com/50"
              alt="Product"
              className="w-12 h-12 object-cover"
            />
            <div className="ml-4">
              <p className="font-medium text-sm sm:text-md">
                Máy hút bụi cầm tay mini lực hút siêu mạnh...
              </p>
              <span className="text-red-500 text-xs sm:text-sm text-clamp-1">
                Đỏ - M
              </span>
            </div>
          </div>

          <div className="col-span-4 sm:col-span-2 text-center text-xs sm:text-sm font-normal">
            <p>₫53.000</p>
          </div>

          <div className="col-span-4 sm:col-span-2 text-center text-xs sm:text-sm font-normal">
            <p>1</p>
          </div>

          <div className="col-span-4 sm:col-span-2 text-right text-xs sm:text-sm font-normal">
            <p>₫53.000</p>
          </div>
        </div>
        <div className="grid grid-cols-12 items-start mt-4 gap-4">
          <div className="col-span-12 sm:col-span-6 flex">
            <img
              src="https://via.placeholder.com/50"
              alt="Product"
              className="w-12 h-12 object-cover"
            />
            <div className="ml-4">
              <p className="font-medium text-sm sm:text-md">
                Máy hút bụi cầm tay mini lực hút siêu mạnh...
              </p>
              <span className="text-red-500 text-xs sm:text-sm text-clamp-1">
                Đỏ - M
              </span>
            </div>
          </div>

          <div className="col-span-4 sm:col-span-2 text-center text-xs sm:text-sm font-normal">
            <p>₫53.000</p>
          </div>

          <div className="col-span-4 sm:col-span-2 text-center text-xs sm:text-sm font-normal">
            <p>1</p>
          </div>

          <div className="col-span-4 sm:col-span-2 text-right text-xs sm:text-sm font-normal">
            <p>₫53.000</p>
          </div>
        </div>
      </div>
      <div className="mt-4 border-t pt-4 text-right flex flex-col sm:flex-row justify-end gap-4 sm:gap-12 items-end sm:items-center">
        <p className="font-semibold text-center sm:text-left">
          Tổng số tiền (2 sản phẩm):
        </p>
        <span className="ml-2 text-red-600 text-lg sm:text-xl"> ₫96.900</span>
      </div>
    </div>
  );
};

CheckoutProduct.propTypes = {};

export default CheckoutProduct;
