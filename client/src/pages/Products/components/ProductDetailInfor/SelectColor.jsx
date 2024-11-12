import PropTypes from 'prop-types';

const SelectColor = ({ variants, onChange, selectedColor }) => {
  return (
    <div className='grid grid-cols-6 gap-3 mb-6'>
      {variants.map((variant) => (
        <div
          key={variant.color}
          className={`color-box group relative cursor-pointer ${
            selectedColor === variant.color ? 'border-red-600 text-red-600' : ''
          } ${variant.stock === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={() => variant.stock !== 0 && onChange(variant.color)}
        >
          <div className='relative pb-[120%]'>
            {' '}
            {/* Aspect ratio 5:6 */}
            <div className='absolute inset-0'>
              <img
                src={variant.image}
                alt={`${variant.color} image`}
                className={`w-full h-full object-cover border-4 ${
                  selectedColor === variant.color
                    ? 'border-red-600'
                    : 'border-gray-100'
                } rounded-md transition-all duration-500`}
              />
              {variant.stock === 0 && (
                <div className='absolute inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center rounded-md'>
                  <p className='text-white text-xs font-semibold'>Hết hàng</p>
                </div>
              )}
            </div>
          </div>
          <p
            className={`font-bold text-xs leading-tight ${
              selectedColor === variant.color ? 'text-red-600' : 'text-gray-700'
            } text-center mt-1 transition-all duration-500`}
          >
            {variant.color}
          </p>
        </div>
      ))}
    </div>
  );
};

SelectColor.propTypes = {
  variants: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  selectedColor: PropTypes.string.isRequired,
};

export default SelectColor;
