import { useState } from 'react';

export default function SelectSize() {
  const [activeSize, setActiveSize] = useState(null);

  const sizes = ['Full Set', '10 kg', '25 kg', '35 kg'];

  const handleSizeClick = (size) => {
    setActiveSize(size);
  };

  return (
    <div className="grid grid-cols-2 min-[400px]:grid-cols-4 gap-3 mb-3 min-[400px]:mb-8">
      {sizes.map((size) => (
        <button
          key={size}
          className={`border border-gray-200 whitespace-nowrap text-sm leading-6 py-2.5 rounded-md px-5 text-center w-full font-semibold shadow-sm shadow-transparent transition-all duration-300 hover:bg-gray-50 hover:shadow-gray-300 ${
            activeSize === size
              ? 'bg-orange-500 text-white hover:bg-orange-600'
              : 'text-gray-900'
          }`}
          onClick={() => handleSizeClick(size)}
        >
          {size}
        </button>
      ))}
    </div>
  );
}
