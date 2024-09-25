import { useState, useEffect } from 'react';
import MultiRangeSlider from '~/components/common/Range/MultiSliderRange';

export default function CategorySidebar({ products, onFilterChange }) {
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [checkboxes, setCheckboxes] = useState({});

  useEffect(() => {
    onFilterChange({ colors: selectedColors, sizes: selectedSizes });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedColors, selectedSizes]);

  if (!products || products.length === 0) {
    return null;
  }

  const handleCheckboxChange = (color) => {
    setCheckboxes((prevCheckboxes) => {
      const updatedCheckboxes = {
        ...prevCheckboxes,
        [color]: !prevCheckboxes[color],
      };
      setSelectedColors(
        Object.keys(updatedCheckboxes).filter((key) => updatedCheckboxes[key])
      );
      return updatedCheckboxes;
    });
  };

  const resetCheckboxes = () => {
    const resetState = colors.reduce((acc, color) => {
      acc[color] = false;
      return acc;
    }, {});
    setCheckboxes(resetState);
    setSelectedColors([]);
  };

  const colors = Array.from(
    new Set(
      products.flatMap((product) =>
        product.variants.map((variant) => variant.color)
      )
    )
  );

  const sizes = Array.from(
    new Set(
      products.flatMap((product) =>
        product.variants.flatMap((variant) =>
          variant.sizes
            .map((sizeObj) => sizeObj.size)
            .filter((size) => size !== undefined && size !== null)
        )
      )
    )
  );

  const handleSizeChange = (size) => {
    setSelectedSizes((prevSelectedSizes) =>
      prevSelectedSizes.includes(size)
        ? prevSelectedSizes.filter((s) => s !== size)
        : [...prevSelectedSizes, size]
    );
  };

  return (
    <div className="">
      {/* Slider Range */}
      <MultiRangeSlider min={0} max={100} />

      {/* Color Filter */}
      <div className="space-y-2 mt-12">
        <details className="overflow-hidden rounded-md border border-gray-300 transition-all duration-300">
          <summary className="flex cursor-pointer items-center justify-between gap-2 bg-white p-4 text-gray-900 transition">
            <span className="text-sm font-medium">Màu sắc</span>
            <span className="transition group-open:-rotate-180">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="h-4 w-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                />
              </svg>
            </span>
          </summary>

          <div className="border-t border-gray-200 bg-white transition-all duration-300">
            <header className="flex items-center justify-between p-4">
              <span className="text-sm text-gray-700">
                {selectedColors.length} đã chọn
              </span>
              <button
                type="button"
                onClick={resetCheckboxes}
                className="text-sm text-gray-900 underline underline-offset-4 hover:text-red-500"
              >
                Làm mới
              </button>
            </header>

            <ul className="space-y-1 border-t border-gray-200 p-4 transition-all duration-300">
              {colors.map((color) => (
                <label
                  key={color}
                  className="cursor-pointer label flex gap-4 items-center"
                >
                  <input
                    type="checkbox"
                    checked={checkboxes[color] || false}
                    onChange={() => handleCheckboxChange(color)}
                    className="checkbox checkbox-error checkbox-sm"
                  />
                  <span className="label-text">{color}</span>
                </label>
              ))}
            </ul>
          </div>
        </details>
      </div>

      {/* Size Filter */}
      <div className="space-y-2 mt-6">
        <details className="overflow-hidden rounded-md border border-gray-300 transition-all duration-300">
          <summary className="flex cursor-pointer items-center justify-between gap-2 bg-white p-4 text-gray-900 transition">
            <span className="text-sm font-medium">Kích thước</span>
            <span className="transition group-open:-rotate-180">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="h-4 w-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                />
              </svg>
            </span>
          </summary>

          <div className="border-t border-gray-200 bg-white transition-all duration-300">
            <header className="flex items-center justify-between p-4">
              <span className="text-sm text-gray-700">
                {selectedSizes.length} đã chọn
              </span>
              <button
                type="button"
                onClick={() => setSelectedSizes([])}
                className="text-sm text-gray-900 underline underline-offset-4 hover:text-red-500"
              >
                Làm mới
              </button>
            </header>

            <ul className="space-y-1 border-t border-gray-200 p-4 transition-all duration-300">
              {sizes.map((size) => (
                <label
                  key={size}
                  className="cursor-pointer label flex gap-4 items-center"
                >
                  <input
                    type="checkbox"
                    checked={selectedSizes.includes(size)}
                    onChange={() => handleSizeChange(size)}
                    className="checkbox checkbox-error checkbox-sm"
                  />
                  <span className="label-text">{size}</span>
                </label>
              ))}
            </ul>
          </div>
        </details>
      </div>
    </div>
  );
}
