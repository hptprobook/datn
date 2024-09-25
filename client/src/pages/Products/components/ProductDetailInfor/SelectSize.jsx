import PropTypes from 'prop-types';

const SelectSize = ({ sizes, onChange, selectedSize }) => {
  return (
    <div className="grid grid-cols-2 min-[400px]:grid-cols-5 gap-3 mb-3 min-[400px]:mb-8">
      {sizes.map((size) => (
        <div key={size.size} className="relative group">
          <button
            disabled={size.stock === 0}
            className={`relative border border-gray-200 whitespace-nowrap text-sm leading-6 py-2.5 rounded-md px-5 text-center w-full font-semibold shadow-sm shadow-transparent transition-all duration-300 hover:bg-gray-50 hover:shadow-gray-300 ${
              selectedSize === size.size
                ? 'bg-orange-500 text-white hover:bg-orange-600'
                : 'text-gray-900'
            } ${size.stock === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={() => size.stock !== 0 && onChange(size.size)}
          >
            {size.size}
          </button>

          {size.stock === 0 && (
            <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black text-white text-xs font-bold py-2 w-full text-center px-2 rounded-md">
              Hết hàng
              <div className="absolute left-1/2 transform -translate-x-1/2 top-full border-4 border-transparent border-t-black"></div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

SelectSize.propTypes = {
  sizes: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  selectedSize: PropTypes.string.isRequired,
};

export default SelectSize;
