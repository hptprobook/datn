import { useState, useEffect } from 'react';

const QuantityButton = ({
  quantity,
  onQuantityChange,
  stopPropagation,
  stockLimit,
  setHasStockError,
}) => {
  const [localQuantity, setLocalQuantity] = useState(quantity);

  useEffect(() => {
    setHasStockError(localQuantity > stockLimit);
  }, [localQuantity, stockLimit]);

  // Xử lý khi người dùng nhập trực tiếp vào input
  const handleInputChange = (e) => {
    stopPropagation(e);
    const value = e.target.value;

    // Chỉ cho phép nhập số và trong khoảng từ 1 đến 99
    if (/^\d*$/.test(value)) {
      const newQuantity = Math.max(1, Math.min(99, Number(value)));
      setLocalQuantity(newQuantity);
      onQuantityChange(newQuantity);
    }
  };

  const handleIncrease = (e) => {
    stopPropagation(e);
    const newQuantity = Math.min(localQuantity + 1, 99); // Giới hạn không vượt quá 99
    setLocalQuantity(newQuantity);
    onQuantityChange(newQuantity);
  };

  const handleDecrease = (e) => {
    stopPropagation(e);
    if (localQuantity > 1) {
      const newQuantity = localQuantity - 1;
      setLocalQuantity(newQuantity);
      onQuantityChange(newQuantity);
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
        onChange={handleInputChange}
        onClick={(e) => e.stopPropagation()}
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
