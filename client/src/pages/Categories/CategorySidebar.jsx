import { useState } from 'react';
import MultiRangeSlider from '~/components/common/Range/MultiSliderRange';

export default function CategorySidebar() {
  const [selectedCount, setSelectedCount] = useState(0);
  const [checkboxes, setCheckboxes] = useState({
    red: true,
    blue: true,
  });

  const handleCheckboxChange = (color) => {
    setCheckboxes((prevCheckboxes) => {
      const updatedCheckboxes = {
        ...prevCheckboxes,
        [color]: !prevCheckboxes[color],
      };
      setSelectedCount(
        Object.values(updatedCheckboxes).filter((checked) => checked).length
      );
      return updatedCheckboxes;
    });
  };

  const resetCheckboxes = () => {
    const resetState = {
      red: false,
      blue: false,
    };
    setCheckboxes(resetState);
    setSelectedCount(0);
  };

  return (
    <div className="">
      {/* Slider Range */}
      <MultiRangeSlider min={0} max={100} />
      <div className="space-y-2">
        <details className="overflow-hidden rounded border border-gray-300 [&_summary::-webkit-details-marker]:hidden">
          <summary className="flex cursor-pointer items-center justify-between gap-2 bg-white p-4 text-gray-900 transition">
            <span className="text-sm font-medium"> Màu sắc </span>

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

          <div className="border-t border-gray-200 bg-white">
            <header className="flex items-center justify-between p-4">
              <span className="text-sm text-gray-700">
                {selectedCount} đã chọn
              </span>

              <button
                type="button"
                onClick={resetCheckboxes}
                className="text-sm text-gray-900 underline underline-offset-4 hover:text-red-500"
              >
                Làm mới
              </button>
            </header>

            <ul className="space-y-1 border-t border-gray-200 p-4">
              <div className="form-control">
                <label className="cursor-pointer label flex gap-4 justify-start">
                  <input
                    type="checkbox"
                    checked={checkboxes.red}
                    onChange={() => handleCheckboxChange('red')}
                    className="checkbox checkbox-error checkbox-sm"
                  />
                  <span className="label-text">Đỏ</span>
                </label>
                <label className="cursor-pointer label flex gap-4 justify-start">
                  <input
                    type="checkbox"
                    checked={checkboxes.blue}
                    onChange={() => handleCheckboxChange('blue')}
                    className="checkbox checkbox-error checkbox-sm"
                  />
                  <span className="label-text">Xanh</span>
                </label>
              </div>
            </ul>
          </div>
        </details>
      </div>
    </div>
  );
}
