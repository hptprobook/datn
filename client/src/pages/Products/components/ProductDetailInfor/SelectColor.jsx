export default function SelectColor({ variants, onChange, selectedColor }) {
  return (
    <div className="grid grid-cols-6 gap-3 mb-6 max-w-sm">
      {variants.map((variant) => (
        <div
          key={variant.color}
          className={`color-box group relative cursor-pointer ${
            selectedColor === variant.color ? 'border-red-600 text-red-600' : ''
          } ${variant.stock === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={() => variant.stock !== 0 && onChange(variant.color)}
        >
          <div className="relative">
            <div className="relative">
              <img
                src={variant.image}
                alt={`${variant.color} image`}
                className={`w-full aspect-square border-4 ${
                  selectedColor === variant.color
                    ? 'border-red-600'
                    : 'border-gray-100'
                } rounded-md transition-all duration-500`}
              />
              {variant.stock === 0 && (
                <div className="absolute inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center rounded-md">
                  <p className="text-white text-sm font-semibold">Hết hàng</p>
                </div>
              )}
            </div>
            <p
              className={`font-bold text-sm leading-6 ${
                selectedColor === variant.color
                  ? 'text-red-600'
                  : 'text-gray-700'
              } text-center mt-2 transition-all duration-500`}
            >
              {variant.color}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
