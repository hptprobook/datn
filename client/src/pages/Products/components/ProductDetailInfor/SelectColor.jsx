import { useState } from 'react';

export default function SelectColor() {
  const [activeColor, setActiveColor] = useState(null);

  const colors = [
    { name: 'Đen', src: 'https://pagedone.io/asset/uploads/1700472379.png' },
    { name: 'Bạc', src: 'https://pagedone.io/asset/uploads/1700472529.png' },
    { name: 'Đỏ', src: 'https://pagedone.io/asset/uploads/1700472529.png' },
    { name: 'Tím', src: 'https://pagedone.io/asset/uploads/1700472529.png' },
    { name: 'Hồng', src: 'https://pagedone.io/asset/uploads/1700472529.png' },
  ];

  const handleColorClick = (colorName) => {
    setActiveColor(colorName);
  };

  return (
    <div className="grid grid-cols-4 gap-3 mb-6 max-w-sm">
      {colors.map((color) => (
        <div
          key={color.name}
          className={`color-box group cursor-pointer ${
            activeColor === color.name ? 'border-amber-600 text-amber-600' : ''
          }`}
          onClick={() => handleColorClick(color.name)}
        >
          <div>
            <img
              src={color.src}
              alt={`${color.name} image`}
              className={`w-full aspect-square border-2 ${
                activeColor === color.name
                  ? 'border-amber-600'
                  : 'border-gray-100'
              } rounded-md transition-all duration-500`}
            />
            <p
              className={`font-normal text-sm leading-6 ${
                activeColor === color.name ? 'text-amber-600' : 'text-gray-700'
              } text-center mt-2 transition-all duration-500`}
            >
              {color.name}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
