import { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import MultiRangeSlider from '../common/Range/MultiSliderRange';
import { debounce } from 'lodash';

const ProductListFilter = ({
  onFilterChange,
  priceRangeData,
  onPriceRangeChange,
  initialFilters,
}) => {
  const [selectedColors, setSelectedColors] = useState(
    initialFilters.colors || []
  );
  const [selectedSizes, setSelectedSizes] = useState(
    initialFilters.sizes || []
  );
  const [selectedType, setSelectedType] = useState(initialFilters.type || '');
  const [selectedTags, setSelectedTags] = useState(initialFilters.tags || []);
  const [isColorOpen, setIsColorOpen] = useState(false);
  const [isSizeOpen, setIsSizeOpen] = useState(false);
  const [isTypeOpen, setIsTypeOpen] = useState(false);
  const [isTagOpen, setIsTagOpen] = useState(false);

  const debouncedFilterChange = useCallback(
    debounce((filters) => {
      onFilterChange(filters);
    }, 1000),
    [onFilterChange]
  );

  useEffect(() => {
    const filters = {
      colors: selectedColors,
      sizes: selectedSizes,
      type: selectedType,
      tags: selectedTags,
    };
    debouncedFilterChange(filters);
  }, [
    selectedColors,
    selectedSizes,
    selectedType,
    selectedTags,
    debouncedFilterChange,
  ]);

  const handlePriceRangeChange = useCallback(
    (newPriceRange) => {
      if (
        JSON.stringify(newPriceRange) !==
        JSON.stringify(initialFilters.priceRange)
      ) {
        onPriceRangeChange(newPriceRange);
      }
    },
    [onPriceRangeChange, initialFilters.priceRange]
  );

  const colors = [
    'Đỏ',
    'Xanh lá cây',
    'Xanh dương',
    'Vàng',
    'Cam',
    'Tím',
    'Hồng',
    'Đen',
    'Trắng',
    'Xám',
    'Nâu',
    'Xanh lơ',
    'Hồng cánh sen',
    'Xanh lá nhạt',
    'Xanh đậm',
    'Tím nhạt',
  ];

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  const types = ['Nam', 'Nữ', 'Trẻ em'];
  const tags = ['Mới nhất', 'Bán chạy', 'Hot sale', 'Freeship'];

  const handleColorChange = (color) => {
    setSelectedColors((prevSelectedColors) =>
      prevSelectedColors.includes(color)
        ? prevSelectedColors.filter((c) => c !== color)
        : [...prevSelectedColors, color]
    );
  };

  const handleSizeChange = (size) => {
    setSelectedSizes((prevSelectedSizes) =>
      prevSelectedSizes.includes(size)
        ? prevSelectedSizes.filter((s) => s !== size)
        : [...prevSelectedSizes, size]
    );
  };

  const handleTypeChange = (type) => {
    setSelectedType((prevType) => (prevType === type ? '' : type));
  };

  const handleTagChange = (tag) => {
    setSelectedTags((prevSelectedTags) =>
      prevSelectedTags.includes(tag)
        ? prevSelectedTags.filter((t) => t !== tag)
        : [...prevSelectedTags, tag]
    );
  };

  const getColorClass = (color) => {
    const colorMap = {
      Đỏ: 'bg-red-500',
      'Xanh lá cây': 'bg-green-500',
      'Xanh dương': 'bg-blue-500',
      Vàng: 'bg-yellow-500',
      Cam: 'bg-orange-500',
      Tím: 'bg-purple-500',
      Hồng: 'bg-pink-500',
      Đen: 'bg-black',
      Trắng: 'bg-white border border-gray-300',
      Xám: 'bg-gray-500',
      Nâu: 'bg-amber-800',
      'Xanh lơ': 'bg-cyan-500',
      'Hồng cánh sen': 'bg-pink-300',
      'Xanh lá nhạt': 'bg-green-300',
      'Xanh đậm': 'bg-blue-700',
      'Tím nhạt': 'bg-purple-300',
    };
    return colorMap[color] || 'bg-gray-200';
  };

  const removeColor = (color) => {
    setSelectedColors(selectedColors.filter((c) => c !== color));
  };

  const removeSize = (size) => {
    setSelectedSizes(selectedSizes.filter((s) => s !== size));
  };

  const removeType = () => setSelectedType('');
  const removeTag = (tag) =>
    setSelectedTags(selectedTags.filter((t) => t !== tag));

  const handleResetFilters = () => {
    setSelectedColors([]);
    setSelectedSizes([]);
    setSelectedType('');
    setSelectedTags([]);
    onFilterChange({
      colors: [],
      sizes: [],
      type: '',
      tags: [],
      priceRange: {
        min: priceRangeData?.minPrice,
        max: priceRangeData?.maxPrice,
      },
    });
  };

  return (
    <div className="sticky top-4 max-h-[80vh] overflow-y-auto hide-scrollbar px-[2px]">
      <MultiRangeSlider
        min={priceRangeData?.minPrice}
        max={priceRangeData?.maxPrice}
        initialMin={priceRangeData?.minPrice}
        initialMax={priceRangeData?.maxPrice}
        onPriceRangeChange={handlePriceRangeChange}
      />

      <p className="text-gray-700 font-bold">Đã chọn: </p>
      <div className="flex flex-wrap gap-2 mt-4">
        {selectedColors.map((color) => (
          <div key={color} className="badge badge-error flex items-center">
            {color}
            <button
              className="badge-close ml-2 w-4 h-4 font-bold bg-gray-300 hover:bg-white hover:text-gray-900 rounded-full transition-colors duration-200"
              onClick={() => removeColor(color)}
            >
              ×
            </button>
          </div>
        ))}
        {selectedSizes.map((size) => (
          <div key={size} className="badge badge-secondary flex items-center">
            {size}
            <button
              className="badge-close ml-2 w-4 h-4 font-bold bg-gray-300 hover:bg-white hover:text-gray-900 rounded-full transition-colors duration-200"
              onClick={() => removeSize(size)}
            >
              ×
            </button>
          </div>
        ))}
        {selectedType && (
          <div className="badge badge-info flex items-center">
            {selectedType}
            <button
              className="badge-close ml-2 w-4 h-4 font-bold bg-gray-300 hover:bg-white hover:text-gray-900 rounded-full transition-colors duration-200"
              onClick={removeType}
            >
              ×
            </button>
          </div>
        )}
        {selectedTags.map((tag) => (
          <div key={tag} className="badge badge-warning flex items-center">
            {tag}
            <button
              className="badge-close ml-2 w-4 h-4 font-bold bg-gray-300 hover:bg-white hover:text-gray-900 rounded-full transition-colors duration-200"
              onClick={() => removeTag(tag)}
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <div>
        {selectedColors.length > 0 ||
        selectedSizes.length > 0 ||
        selectedType ||
        selectedTags.length > 0 ? (
          <button
            className="mt-5 btn rounded-md text-white bg-red-500 hover:bg-red-600"
            onClick={handleResetFilters}
          >
            Làm mới tất cả
          </button>
        ) : null}
      </div>

      <div className="space-y-2 mt-12">
        <div className="overflow-hidden rounded-md border border-gray-300">
          <button
            className="flex w-full cursor-pointer items-center justify-between gap-2 bg-white p-4 text-gray-900 transition"
            onClick={() => setIsColorOpen(!isColorOpen)}
          >
            <span className="text-sm font-bold">Màu sắc</span>
            <span className={`transition ${isColorOpen ? 'rotate-180' : ''}`}>
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
          </button>

          <div
            className={`border-t border-gray-200 bg-white transition-all duration-300 ${
              isColorOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            } overflow-hidden`}
          >
            <header className="flex items-center justify-between p-4">
              <span className="text-sm text-gray-700">
                {selectedColors.length} đã chọn
              </span>
              <button
                type="button"
                onClick={() => setSelectedColors([])}
                className="text-sm text-gray-900 underline underline-offset-4 hover:text-red-500"
              >
                Làm mới
              </button>
            </header>

            <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-4 gap-2 border-t border-gray-200 p-4">
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() => handleColorChange(color)}
                  className={`w-8 h-8 rounded-full flex justify-center items-center ${getColorClass(
                    color
                  )} relative`}
                  title={color}
                >
                  {selectedColors.includes(color) && (
                    <Icon icon="ph:check-fat-fill" className="text-gray-700" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2 mt-6">
        <div className="overflow-hidden rounded-md border border-gray-300">
          <button
            className="flex w-full cursor-pointer items-center justify-between gap-2 bg-white p-4 text-gray-900 transition"
            onClick={() => setIsSizeOpen(!isSizeOpen)}
          >
            <span className="text-sm font-bold">Kích thước</span>
            <span className={`transition ${isSizeOpen ? 'rotate-180' : ''}`}>
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
          </button>

          <div
            className={`border-t border-gray-200 bg-white transition-all duration-300 ${
              isSizeOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            } overflow-hidden`}
          >
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

            <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-3 gap-2 border-t border-gray-200 p-4">
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => handleSizeChange(size)}
                  className={`btn px-4 py-2 rounded border flex justify-center items-center ${
                    selectedSizes.includes(size)
                      ? 'bg-red-500 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2 mt-6">
        <div className="overflow-hidden rounded-md border border-gray-300">
          <button
            className="flex w-full cursor-pointer items-center justify-between gap-2 bg-white p-4 text-gray-900 transition"
            onClick={() => setIsTypeOpen(!isTypeOpen)}
          >
            <span className="text-sm font-bold">Loại sản phẩm</span>
            <span className={`transition ${isTypeOpen ? 'rotate-180' : ''}`}>
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
          </button>
          <div
            className={`border-t border-gray-200 bg-white transition-all duration-300 ${
              isTypeOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            } overflow-hidden`}
          >
            <div className="grid grid-cols-2 gap-2 border-t border-gray-200 p-4">
              {types.map((type) => (
                <button
                  key={type}
                  onClick={() => handleTypeChange(type)}
                  className={`btn px-4 py-2 rounded border flex justify-center items-center ${
                    selectedType === type
                      ? 'bg-red-500 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Collapse for Tag */}
      <div className="space-y-2 mt-6">
        <div className="overflow-hidden rounded-md border border-gray-300">
          <button
            className="flex w-full cursor-pointer items-center justify-between gap-2 bg-white p-4 text-gray-900 transition"
            onClick={() => setIsTagOpen(!isTagOpen)}
          >
            <span className="text-sm font-bold">Tags</span>
            <span className={`transition ${isTagOpen ? 'rotate-180' : ''}`}>
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
          </button>
          <div
            className={`border-t border-gray-200 bg-white transition-all duration-300 ${
              isTagOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            } overflow-hidden`}
          >
            <div className="grid grid-cols-1 gap-2 border-t border-gray-200 p-4">
              {tags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleTagChange(tag)}
                  className={`btn px-4 py-2 rounded border flex justify-center items-center ${
                    selectedTags.includes(tag)
                      ? 'bg-blue-500 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

ProductListFilter.propTypes = {
  onFilterChange: PropTypes.func,
  priceRangeData: PropTypes.object,
  onPriceRangeChange: PropTypes.func,
  initialFilters: PropTypes.object,
};

export default ProductListFilter;
