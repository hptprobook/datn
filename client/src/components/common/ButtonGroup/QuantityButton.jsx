import { useState } from 'react';

const QuantityButton = ({ quantity, onQuantityChange, stopPropagation }) => {
  const [localQuantity, setLocalQuantity] = useState(quantity);

  const handleIncrease = (e) => {
    stopPropagation(e);
    const newQuantity = localQuantity + 1;
    setLocalQuantity(newQuantity);
    onQuantityChange(newQuantity); // Gọi hàm cập nhật số lượng từ component cha
  };

  const handleDecrease = (e) => {
    stopPropagation(e);
    if (localQuantity > 1) {
      const newQuantity = localQuantity - 1;
      setLocalQuantity(newQuantity);
      onQuantityChange(newQuantity); // Gọi hàm cập nhật số lượng từ component cha
    }
  };

  return (
    <div className="flex items-center">
      <button
        type="button"
        onClick={handleDecrease}
        className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-gray-300 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100"
      >
        <svg
          className="h-2.5 w-2.5 text-gray-900"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 18 2"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M1 1h16"
          />
        </svg>
      </button>
      <input
        type="text"
        className="w-10 shrink-0 border-0 bg-transparent text-center text-sm font-medium text-gray-900 focus:outline-none focus:ring-0"
        value={localQuantity}
        readOnly
      />
      <button
        type="button"
        onClick={handleIncrease}
        className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-gray-300 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100"
      >
        <svg
          className="h-2.5 w-2.5 text-gray-900"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 18 18"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 1v16M1 9h16"
          />
        </svg>
      </button>
    </div>
  );
};

export default QuantityButton;
