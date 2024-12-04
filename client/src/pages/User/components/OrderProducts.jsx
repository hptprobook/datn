import PropTypes from 'prop-types';
import { formatCurrencyVND } from '~/utils/formatters';

const OrderProducts = ({ productsList }) => (
  <div className="container mx-auto p-6 bg-white text-black rounded-sm mt-[1px]">
    <div>
      {productsList?.map((product) => (
        <div key={product?._id} className="grid grid-cols-12 items-center mt-4 gap-4">
          <div className="col-span-12 sm:col-span-6 flex">
            <img src={product?.image} alt={product?.name} className="w-12 h-12 object-cover" />
            <div className="ml-4">
              <p className="font-medium text-sm sm:text-md text-clamp-1">{product?.name}</p>
              <span className="text-red-500 text-xs sm:text-sm text-clamp-1">
                {product?.variantColor}
                {product?.variantSize !== 'FREESIZE' && ` - ${product.variantSize}`}
              </span>
            </div>
          </div>
          <div className="col-span-4 sm:col-span-2 text-center text-xs sm:text-sm font-normal">
            <p>{formatCurrencyVND(product?.price)}</p>
          </div>
          <div className="col-span-4 sm:col-span-2 text-center text-xs sm:text-sm font-normal">
            <p>x{product?.quantity}</p>
          </div>
          <div className="col-span-4 sm:col-span-2 text-right text-xs sm:text-sm font-normal">
            <p>{formatCurrencyVND(product?.price * product?.quantity)}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

OrderProducts.propTypes = {
  productsList: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      image: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      variantColor: PropTypes.string,
      variantSize: PropTypes.string,
      price: PropTypes.number.isRequired,
      quantity: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default OrderProducts;
