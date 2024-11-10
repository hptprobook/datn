// import PropTypes from 'prop-types';

import { formatCurrencyVND } from '~/utils/formatters';

const CheckoutProduct = ({ selectedProducts }) => {
  const totalPrice = selectedProducts?.reduce(
    (acc, product) => acc + product.price * product.quantity,
    0
  );

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
        {selectedProducts?.map((product) => (
          <div
            key={product?._id}
            className="grid grid-cols-12 items-start mt-4 gap-4"
          >
            <div className="col-span-12 sm:col-span-6 flex">
              <img
                src={product?.image}
                alt={product?.name}
                className="w-12 h-12 object-cover"
              />
              <div className="ml-4">
                <p className="font-medium text-sm sm:text-md text-clamp-1">
                  {product?.name}
                </p>
                <span className="text-red-500 text-xs sm:text-sm text-clamp-1">
                  {product?.variantColor}
                  {product?.variantSize !== 'FREESIZE' &&
                    ` - ${product.variantSize}`}
                </span>
              </div>
            </div>

            <div className="col-span-4 sm:col-span-2 text-center text-xs sm:text-sm font-normal">
              <p>{formatCurrencyVND(product?.price)}</p>
            </div>

            <div className="col-span-4 sm:col-span-2 text-center text-xs sm:text-sm font-normal">
              <p>{product?.quantity}</p>
            </div>

            <div className="col-span-4 sm:col-span-2 text-right text-xs sm:text-sm font-normal">
              <p>{formatCurrencyVND(product?.price * product?.quantity)}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 border-t pt-4 text-right flex flex-col sm:flex-row justify-end gap-4 sm:gap-12 items-end sm:items-center">
        <p className="font-semibold text-center sm:text-left">
          Tổng số tiền ({selectedProducts?.length} sản phẩm):
        </p>
        <span className="ml-2 text-red-600 text-lg sm:text-xl">
          {formatCurrencyVND(totalPrice)}
        </span>
      </div>
    </div>
  );
};

CheckoutProduct.propTypes = {};

export default CheckoutProduct;
